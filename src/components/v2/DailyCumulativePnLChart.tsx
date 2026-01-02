
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { useMemo } from "react";
import { fakeTrades } from "../../lib/fakeTrades";
import { getDailyCumulativePnL } from "../../lib/cumulativePnL";

/* ======================
   FORMAT HELPERS
====================== */
function getNiceStep(value: number) {
  const magnitude = Math.pow(10, Math.floor(Math.log10(value)));
  const residual = value / magnitude;

  if (residual <= 1) return 1 * magnitude;
  if (residual <= 2) return 2 * magnitude;
  if (residual <= 5) return 5 * magnitude;
  return 10 * magnitude;
}

function getYAxisLayout(maxValue: number) {
  if (maxValue < 10_000) {
    return { dx: -10, width: 55 };
  }

  if (maxValue < 100_000) {
    return { dx: -5, width: 55 };
  }

  if (maxValue < 1_000_000) {
    return { dx: 0, width: 55 };
  }

  // 1.000.000 ve üzeri
  return { dx: 0, width: 65 };
}



function formatUsd(v: number) {
  if (v === 0) return "$0.00";
  return `$${v.toLocaleString()}`;
}


function formatDate(d: string) {
  const date = new Date(d);
  return date.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
  });
}


/* ======================
   COMPONENT
====================== */

export default function DailyCumulativePnLChart() {
  const data = useMemo(() => {
  return getDailyCumulativePnL(fakeTrades).map((d, i) => ({
    ...d,
    x: i,          // 🔴 GERÇEK X DEĞERİ
  }));
}, []);
const xTicks = useMemo(() => {
  const step = Math.ceil(data.length / 6); // 👈 YOĞUNLUK BURADA
  return data.map((_, i) => i).filter(i => i % step === 0);
}, [data]);

const maxValue =
  data.length > 0
    ? Math.max(...data.map((d) => d.value))
    : 0;

const yAxisLayout = getYAxisLayout(maxValue);
// 🔴 Y ekseni – 11 adet grid / para seviyesi
const yTicks = useMemo(() => {
  if (maxValue <= 0) return [0];

  const levels = 11; // 👈 İSTEDİĞİN GRID SAYISI
  const rawStep = maxValue / (levels - 1);
const step = getNiceStep(rawStep);


  return Array.from({ length: levels }, (_, i) => i * step);
}, [maxValue]);

  return (
    <div className="w-full h-full">
      <ResponsiveContainer width="100%" height="100%" debounce={120}>

        <AreaChart
          data={data}
          margin={{ top: 8, right:5, left: 4, bottom: 4 }}
        >
          {/* GRADIENT */}
          <defs>
            <linearGradient id="cumulativePnL" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10b981" stopOpacity={0.35} />
              <stop offset="100%" stopColor="#10b981" stopOpacity={0.05} />
            </linearGradient>
          </defs>

          {/* SOFT GRID (TradeZella feel) */}
          <CartesianGrid
  stroke="#e5e7eb"
  strokeDasharray="3 3"
  vertical={false}
  horizontal={true}
/>


          {/* X AXIS */}
          <XAxis
  dataKey="x"
  type="number"
  domain={['dataMin', 'dataMax']}
  ticks={xTicks}   // 🔴 YOĞUNLUK ARTIK BURADA
  tickFormatter={(i) => formatDate(data[i]?.date)}
  tick={{ fontSize: 11, fill: "#64748b", dy: 17 }}
  axisLine={false}
  tickLine={false}
  padding={{ left: 10, right: 0 }}

  

/>



          {/* Y AXIS */}
          <YAxis
  ticks={yTicks}        // 🔴 GRID SAYISI ARTIK BURADAN
  tickFormatter={formatUsd}
  tick={{
    fontSize: 11,
    fill: "#64748b",
    dx: yAxisLayout.dx,
  }}
  axisLine={false}
  tickLine={false}
  width={yAxisLayout.width}
/>





          {/* TOOLTIP */}
          <Tooltip
            formatter={(v) => formatUsd(typeof v === "number" ? v : 0)}

            labelFormatter={(l) => `Date: ${l}`}
            cursor={{ stroke: "#10b981", strokeOpacity: 0.15 }}
            contentStyle={{
              borderRadius: 10,
              border: "1px solid #e2e8f0",
              fontSize: 12,
              boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
            }}
          />

          {/* AREA */}
          <Area
  type="monotone"
  dataKey="value"
  stroke="#10b981"
  strokeWidth={2}
  fill="url(#cumulativePnL)"
  dot={false}
/>

        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
