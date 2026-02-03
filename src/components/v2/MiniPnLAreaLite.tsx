import { useId, useMemo } from "react";

import type { FakeTrade } from "../../lib/fakeTrades";

/* ======================
   HELPERS
====================== */

function fmtUsdCompact(v: number) {
  const abs = Math.abs(v);
  const sign = v < 0 ? "-" : "";
  if (abs >= 1000) return `${sign}$${(abs / 1000).toFixed(1)}k`;
  return `${sign}$${abs.toFixed(0)}`;
}

function smoothPath(points: { x: number; y: number }[]) {
  if (points.length < 2) return "";
  let d = `M ${points[0].x} ${points[0].y}`;
  for (let i = 1; i < points.length; i++) {
    const p0 = points[i - 1];
    const p1 = points[i];
    const cx = (p0.x + p1.x) / 2;
    d += ` Q ${cx} ${p0.y} ${p1.x} ${p1.y}`;
  }
  return d;
}

function buildLabelsSmart(lo: number, hi: number) {
  const span = hi - lo || 1;
  const step = span / 4;

  const raw = [
    hi,
    hi - step,
    hi - step * 2,
    hi - step * 3,
    lo,
  ];

  // 0 zaten çok yakınsa tekrar ekleme
  const hasZero = raw.some(v => Math.abs(v) < span * 0.02);

  if (!hasZero && lo < 0 && hi > 0) {
    raw[2] = 0; // orta çizgi 0
  }

  return Array.from(new Set(raw)).sort((a, b) => b - a);
}

/* ======================
   COMPONENT
====================== */

export default function MiniPnLAreaLite({
  trades,
  height = 115,
}: {
  trades: FakeTrade[];
  height?: number;
}) {
  const gid = useId();

  const { line, area, labels, zeroY, positive } = useMemo(() => {
    if (!trades || trades.length === 0) {
      return {
        line: "",
        area: "",
        labels: [0],
        zeroY: 100,
        positive: true,
      };
    }

    // ⏱️ zaman sırası
    const sorted = [...trades].sort((a: any, b: any) => {
      const at = a?.raw?.closeTime ? new Date(a.raw.closeTime).getTime() : 0;
      const bt = b?.raw?.closeTime ? new Date(b.raw.closeTime).getTime() : 0;
      return at - bt;
    });

    // 📈 cumulative PnL (HER ZAMAN 0’dan başla)
    let acc = 0;
    const values = [0, ...sorted.map(t => (acc += t.pnlUsd ?? 0))];

    const min = Math.min(...values);
    const max = Math.max(...values);

    let lo: number;
    let hi: number;

    // 🎯 SADECE YUKARI
    if (min >= 0) {
      lo = 0;
      hi = max * 1.15 || 1;
    }
    // 🎯 SADECE AŞAĞI
    else if (max <= 0) {
      hi = 0;
      lo = min * 1.15 || -1;
    }
    // 🎯 KARIŞIK
    else {
      const abs = Math.max(Math.abs(min), Math.abs(max));
      hi = abs * 1.15;
      lo = -hi;
    }

    const range = hi - lo || 1;

    // 🟢 0 çizgisi (gerekliyse)
    const zeroY = hi === 0
      ? 0
      : lo === 0
      ? 100
      : 100 - ((0 - lo) / range) * 100;

    // 📍 noktalar
    const points = values.map((v, i) => ({
      x: (i / (values.length - 1)) * 100,
      y: 100 - ((v - lo) / range) * 100,
    }));

    const linePath = smoothPath(points);

    const areaPath =
      linePath +
      ` L ${points[points.length - 1].x} ${zeroY}` +
      ` L ${points[0].x} ${zeroY} Z`;

    const labels = buildLabelsSmart(lo, hi);
    const positive = values[values.length - 1] >= 0;

    return { line: linePath, area: areaPath, labels, zeroY, positive };
  }, [trades]);

  const color = positive ? "#14b8a6" : "#ef4444";

  return (
    <div className="flex items-stretch gap-2" style={{ height }}>
      {/* LEFT VALUES */}
      <div className="w-10 flex flex-col justify-between text-[10px] text-slate-500/90">
        {labels.map((v, i) => (
          <span key={i}>{fmtUsdCompact(v)}</span>
        ))}
      </div>

      {/* CHART */}
      <div className="flex-1 rounded-lg border border-slate-200 bg-white overflow-hidden">
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full">
          <defs>
            <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity="0.45" />
              <stop offset="100%" stopColor={color} stopOpacity="0.05" />
            </linearGradient>
          </defs>

          {/* GRID */}
          {[0, 25, 50, 75, 100].map((y) => (
            <line
              key={`h-${y}`}
              x1="0"
              y1={y}
              x2="100"
              y2={y}
              stroke="#e5e7eb"
              strokeWidth="0.6"
              strokeDasharray="2 3"
            />
          ))}
          {[0, 25, 50, 75, 100].map((x) => (
            <line
              key={`v-${x}`}
              x1={x}
              y1="0"
              x2={x}
              y2="100"
              stroke="#e5e7eb"
              strokeWidth="0.6"
              strokeDasharray="2 3"
            />
          ))}

          {/* ZERO LINE */}
          {(labels.includes(0)) && (
            <line
  x1="0"
  y1={zeroY}
  x2="100"
  y2={zeroY}
  stroke="#b5bac0ff"           // slate-300 (çok soft)
  strokeWidth="1"
  strokeDasharray="4 4"      // dotted
  strokeLinecap="round"
  vectorEffect="non-scaling-stroke"
/>


          )}

          {/* AREA */}
          <path d={area} fill={`url(#${gid})`} />

          {/* LINE */}
          <path
            d={line}
            fill="none"
            stroke={color}
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
      </div>
    </div>
  );
}
