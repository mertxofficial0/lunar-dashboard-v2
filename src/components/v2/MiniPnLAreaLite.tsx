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


 
function smoothPathNatural(points: { x: number; y: number }[]) {
  if (points.length < 2) return "";

  let d = `M ${points[0].x} ${points[0].y}`;

  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i - 1] || points[i];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2] || p2;

    const cx1 = p1.x + (p2.x - p0.x) / 8;
    const cy1 = p1.y + (p2.y - p0.y) / 8;

    const cx2 = p2.x - (p3.x - p1.x) / 8;
    const cy2 = p2.y - (p3.y - p1.y) / 8;

    d += ` C ${cx1} ${cy1}, ${cx2} ${cy2}, ${p2.x} ${p2.y}`;
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

  const { area, labels, zeroY, showZeroLine, linePath } = useMemo(() => {







    if (!trades || trades.length === 0) {
  return {
    segments: [],
    area: "",
    labels: [0],
    zeroY: 100,
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
const showZeroLine = lo < 0 && hi > 0;

    // 🟢 0 çizgisi (gerekliyse)
    const zeroY = hi === 0
      ? 0
      : lo === 0
      ? 100
      : 100 - ((0 - lo) / range) * 100;

    // 📍 noktalar
    const points: { x: number; y: number; v: number }[] = [];

for (let i = 0; i < values.length; i++) {
  const v = values[i];
  const prev = values[i - 1];

  const x = (i / (values.length - 1)) * 100;
  const y = 100 - ((v - lo) / range) * 100;

  // 👉 0 kesişimi varsa ARAYA EKLE
  if (prev !== undefined && (prev > 0 && v < 0 || prev < 0 && v > 0)) {
  const t = prev / (prev - v);
  const ix = ((i - 1 + t) / (values.length - 1)) * 100;
  const iy = 100 - ((0 - lo) / range) * 100;

  points.push({ x: ix, y: iy, v: 0 });
}



  points.push({ x, y, v });
}


    const linePath = smoothPathNatural(points);


    const areaPath =
      linePath +
      ` L ${points[points.length - 1].x} ${zeroY}` +
      ` L ${points[0].x} ${zeroY} Z`;

    const labels = buildLabelsSmart(lo, hi);
    

    const segments: {
  d: string;
  positive: boolean;
  startX: number;
  endX: number;
}[] = [];


let current: { x: number; y: number }[] = [];

for (let i = 0; i < points.length; i++) {
  current.push({ x: points[i].x, y: points[i].y });


 const curr = points[i].v;
const next = points[i + 1]?.v;


  const crossedZero =
    next !== undefined &&
    ((curr >= 0 && next < 0) || (curr < 0 && next >= 0));

  if (crossedZero || i === points.length - 1) {
    segments.push({
  d: smoothPathNatural(current),
  positive: curr >= 0,
  startX: current[0].x,
  endX: current[current.length - 1].x,
});

    current = [points[i]];
  }
}

return {
  segments,
  area: areaPath,
  labels,
  zeroY,
  points,
  showZeroLine,
  linePath, 
};




  }, [trades]);

  

  return (
    <div className="flex items-stretch gap-2" style={{ height }}>
      {/* LEFT VALUES */}
      <div className="w-10 flex flex-col justify-between text-[10px] text-slate-500/90">
        {labels.map((v, i) => (
          <span key={i}>{fmtUsdCompact(v)}</span>
        ))}
      </div>

      {/* CHART */}
      <div className="flex-1 rounded-lg bg-white overflow-hidden will-change-transform">

        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full">
          <defs>
            <linearGradient id={`${gid}-green`} x1="0" y1="0" x2="0" y2="1">
  <stop offset="0%" stopColor="#14b8a6" stopOpacity="0.45" />
  <stop offset="100%" stopColor="#14b8a6" stopOpacity="0.05" />
</linearGradient>

<linearGradient id={`${gid}-red`} x1="0" y1="0" x2="0" y2="1">
  <stop offset="0%" stopColor="#ef4444" stopOpacity="0.45" />
  <stop offset="100%" stopColor="#ef4444" stopOpacity="0.05" />
</linearGradient>
<mask id={`${gid}-pos-mask`}>
  {/* 0 çizgisinin ÜSTÜ: pozitif */}
  <rect x="0" y="0" width="100" height={zeroY} fill="white" />
</mask>

<mask id={`${gid}-neg-mask`}>
  {/* 0 çizgisinin ALTI: negatif */}
  <rect x="0" y={zeroY} width="100" height={100 - zeroY} fill="white" />
</mask>


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
          {showZeroLine && (
  <line
    x1="0"
    y1={zeroY}
    x2="100"
    y2={zeroY}
    stroke="#b5bac0ff"
    strokeWidth="1"
    strokeDasharray="4 4"
    strokeLinecap="round"
    vectorEffect="non-scaling-stroke"
  />
)}


          {/* AREA */}
<path
  d={area}
  fill={`url(#${gid}-green)`}
  mask={`url(#${gid}-pos-mask)`}
  opacity="1"
/>
<path
  d={area}
  fill={`url(#${gid}-red)`}
  mask={`url(#${gid}-neg-mask)`}
  opacity="1"
/>




          {/* LINE (tek path, mask ile iki renk) */}
<path
  d={linePath}
  fill="none"
  stroke="#14b8a6"
  strokeWidth="1.8"
  strokeLinecap="round"
  strokeLinejoin="round"
  mask={`url(#${gid}-pos-mask)`}
  vectorEffect="non-scaling-stroke"
/>

<path
  d={linePath}
  fill="none"
  stroke="#ef4444"
  strokeWidth="1.8"
  strokeLinecap="round"
  strokeLinejoin="round"
  mask={`url(#${gid}-neg-mask)`}
  vectorEffect="non-scaling-stroke"
/>





        </svg>
      </div>
    </div>
  );
}
