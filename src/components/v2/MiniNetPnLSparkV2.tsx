import { useMemo } from "react";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  YAxis,
  CartesianGrid,
  ReferenceLine,
} from "recharts";
import type { FakeTrade } from "../../lib/fakeTrades";

/* ===== helpers ===== */

function formatUsd(v: number) {
  const abs = Math.abs(v).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return v < 0 ? `-$${abs}` : `$${abs}`;
}

// “güzel” tick adımı (DailyCumulativePnLChart’ındaki mantık)
function getNiceStep(value: number) {
  if (value <= 0) return 1;
  const magnitude = Math.pow(10, Math.floor(Math.log10(value)));
  const residual = value / magnitude;

  if (residual <= 1) return 1 * magnitude;
  if (residual <= 2) return 2 * magnitude;
  if (residual <= 5) return 5 * magnitude;
  return 10 * magnitude;
}

function buildTicks(minV: number, maxV: number, levels = 5) {
  if (minV === maxV) return [minV];

  const range = maxV - minV;
  const step = getNiceStep(range / (levels - 1));

  // ✅ minV’den başla (yuvarlamayı azalt)
  const ticks = Array.from({ length: levels }, (_, i) => minV + i * step);

  // ✅ step’e göre en yakın yuvarlama (daha düzgün)
  return ticks.map((t) => Math.round(t / step) * step);
}


export default function MiniNetPnLSparkV2({
  trades,
  height = 115,
}: {
  trades: FakeTrade[];
  height?: number;
}) {
  const { data, ticks, domain } = useMemo(() => {
    if (!trades || trades.length === 0) {
      return {
        data: [] as any[],
        ticks: [0],
        domain: [0, 1] as [number, number],
      };
    }

    // trade sırası: closeTime
    const sorted = [...trades].sort((a, b) => {
      const at = a.raw?.closeTime ? new Date(a.raw.closeTime).getTime() : 0;
      const bt = b.raw?.closeTime ? new Date(b.raw.closeTime).getTime() : 0;
      return at - bt;
    });

    // 0’dan başla -> kümülatif net pnl
    let cum = 0;
    const points: any[] = [{ i: 0, value: 0, pos: 0, neg: 0 }];

    for (let i = 0; i < sorted.length; i++) {
      const prev = cum;
      cum += sorted[i].pnlUsd;

      // 0 crossing varsa araya 0 noktası sok (renk boşluğu olmasın)
      if (prev * cum < 0) {
        points.push({
          i: i + 0.5,
          value: 0,
          pos: 0,
          neg: 0,
        });
      }

      points.push({
        i: i + 1,
        value: cum,
        pos: cum >= 0 ? cum : null,
        neg: cum < 0 ? cum : null,
      });
    }

    const vals = points.map((p) => p.value);
const rawMin = Math.min(...vals);
const rawMax = Math.max(...vals);

// ✅ data'nın işaretine göre 0’ı sadece gerekli tarafta tut
const allBelowZero = rawMax <= 0;
const allAboveZero = rawMin >= 0;

let minV = allAboveZero ? 0 : rawMin; // hepsi pozitifse alt 0
let maxV = allBelowZero ? 0 : rawMax; // hepsi negatifse üst 0

// ✅ padding: mini chart daha sıkı dursun
const range = Math.max(1, maxV - minV);
const pad = range * 0.10;

let paddedMin = minV - pad;
let paddedMax = maxV + pad;

// ✅ eğer tamamen negatifse: üstte padding'i çok abartma, yine 0 civarında kalsın
if (allBelowZero) paddedMax = 0 + range * 0.02; // 0'ın üstüne minicik
// ✅ tamamen pozitifse: altta minicik boşluk
if (allAboveZero) paddedMin = 0 - range * 0.02;

// ✅ Tick sayısını duruma göre ayarla
// tamamen negatif / pozitifse 4 tick yeterli, mixed ise 5
const levels = allBelowZero || allAboveZero ? 4 : 5;

const t = buildTicks(paddedMin, paddedMax, levels);
// ✅ 0 mutlaka görünsün (boş üst/alt satır hissi gider)
if (!t.includes(0)) {
  t.push(0);
  t.sort((a, b) => a - b);
}

// domain'i tick'lere kilitle (grid düzgün olsun)
const d: [number, number] = [t[0], t[t.length - 1]];

return { data: points, ticks: t, domain: d };

  }, [trades]);

  if (!trades || trades.length === 0) {
    return (
      <div className="h-[115px] rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center text-[11px] text-slate-500">
        No trades
      </div>
    );
  }

  return (
    <div
      className="rounded-lg border border-slate-200 bg-white overflow-hidden"
      style={{ height }}
    >
      <div className="w-full h-full ">

        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 10, right: 10, left: -6, bottom: 8 }}

          >
            {/* Yatay grid (TradeZella gibi) */}
            <CartesianGrid
              stroke="#e5e7eb"
              strokeDasharray="3 3"
              vertical={false}
              horizontal
              syncWithTicks
            />

            {/* 0 çizgisi */}
            <ReferenceLine
              y={0}
              stroke="#94a3b8"
              strokeDasharray="3 3"
              strokeWidth={1}
              ifOverflow="extendDomain"
            />

            <defs>
              <linearGradient id="miniPos" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10b981" stopOpacity={0.30} />
                <stop offset="100%" stopColor="#10b981" stopOpacity={0.06} />
              </linearGradient>

              <linearGradient id="miniNeg" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#ef4444" stopOpacity={0.30} />
                <stop offset="100%" stopColor="#ef4444" stopOpacity={0.06} />
              </linearGradient>
            </defs>

            {/* Sol Y ekseni (küçük ama okunur) */}
            <YAxis
              ticks={ticks}
              domain={domain}
              interval={0}
              tickFormatter={formatUsd}
              tick={{
                fontSize: 10,
                fill: "#94a3b8",
                textAnchor: "end",
                dx: -4,
              }}
              axisLine={false}
              tickLine={false}
              width={78} // TradeZella gibi geniş bırak
            />

            {/* Pozitif alan */}
            <Area
              type="monotone"
              dataKey="pos"
              stroke="#10b981"
              strokeWidth={1.6}
              fill="url(#miniPos)"
              dot={false}
              isAnimationActive={false}
              baseValue={0}
            />

            {/* Negatif alan */}
            <Area
              type="monotone"
              dataKey="neg"
              stroke="#ef4444"
              strokeWidth={1.6}
              fill="url(#miniNeg)"
              dot={false}
              isAnimationActive={false}
              baseValue={0}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
