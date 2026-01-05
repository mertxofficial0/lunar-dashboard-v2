
import { ReferenceLine } from "recharts";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { useMemo, useEffect, useRef, useState } from "react";

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

function getYAxisLayout(value: number) {
  const abs = Math.abs(value);

  // 0 – 999
  if (abs >= 0 && abs < 1_000) {
    return {
      dx: 0,
      width: 45,
    };
  }

  // 1.000 – 9.999
  if (abs >= 1_000 && abs < 10_000) {
    return {
      dx: 0,
      width: 50,
    };
  }

  // 10.000 – 99.999
  if (abs >= 10_000 && abs < 100_000) {
    return {
      dx: 0,
      width: 60,
    };
  }

  // 100.000 – 999.999
  if (abs >= 100_000 && abs < 1_000_000) {
    return {
      dx: 0,
      width: 70,
    };
  }

  // 1.000.000 – 9.999.999
  if (abs >= 1_000_000 && abs < 10_000_000) {
    return {
      dx: 0,
      width: 75,
    };
  }

  // 10.000.000+
  return {
    dx: 0,
    width: 78,
  };
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

function CustomPnLTooltip({ active, payload, label, coordinate }: any) {

  
  if (!active || !payload || payload.length === 0) return null;

  const v =
    payload.find(
      (p: any) => typeof p?.value === "number" && p.value !== null
    )?.value ?? 0;

  const point = payload?.[0]?.payload;
  const fromPeak = point?.fromPeak ?? 0;
const tradesToday = point?.tradesToday ?? 0;

  const isPositive = v >= 0;

  return (
    
  <div
  style={{
    position: "absolute",
    left: coordinate?.x ?? 0,
    top: coordinate?.y ?? 0,
    transform: "translate(-50%, -110%)", // noktanın üstüne alır

    background: "#fff",
    borderRadius: 8,
    padding: "8px 12px",
    fontSize: 12,
    minWidth: 180,

    boxShadow: "0 0 8px rgba(15, 23, 42, 0.17)",
    pointerEvents: "none",
  }}
>

{/* ARROW */}
<div
  style={{
    position: "absolute",
    bottom: -6,          // ⬅️ kutunun altına al
    left: "50%",
    transform: "translateX(-50%)",

    width: 0,
    height: 0,

    borderLeft: "6px solid transparent",
    borderRight: "6px solid transparent",
    borderTop: "6px solid #fff", // ⬅️ aşağı bakan ok

    filter: "drop-shadow(0 1px 1px rgba(15, 23, 42, 0.18))",
  }}
/>



    {/* DATE */}
<div
  style={{
    fontSize: 11,
    color: "#64748b",
    fontWeight: 600,        // ⬅️ kalınlık
    textAlign: "center",    // ⬅️ tam orta
    marginBottom: 4,
  }}
>
  {new Date(label).toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  })}
</div>
{/* DIVIDER */}
<div
  style={{
    height: 1,
    backgroundColor: "#e5e7eb",
    margin: "1px -12px 8px", // ⬅️ sol–sağ padding’i kırar
  }}
/>



    {/* NET PNL */}
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 6,
        marginBottom: 2,
      }}
    >
      <span
        style={{
          fontSize: 11,
          color: "#64748b",
          fontWeight: 500,
          minWidth: 70,
        }}
      >
        Net PnL
      </span>

      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 4,
          padding: "1px 6px",
          fontSize: 11,
          fontWeight: 600,
          color: isPositive ? "#007a55" : "#c90f3c",
          backgroundColor: isPositive ? "#dbfaec" : "#ffebed",
          borderRadius: 5,
        }}
      >
        <span>{isPositive ? "▲" : "▼"}</span>
        <span>{formatUsd(v)}</span>
      </div>
    </div>

    {/* DAILY PNL */}
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 6,
        marginBottom: 4,
      }}
    >
      <span
        style={{
          fontSize: 11,
          color: "#64748b",
          fontWeight: 500,
          minWidth: 70,
        }}
      >
        Daily PnL
      </span>

      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 4,
          padding: "1px 6px",
          fontSize: 11,
          fontWeight: 600,
          color:
            (point?.dailyPnL ?? 0) >= 0 ? "#007a55" : "#c90f3c",
          backgroundColor:
            (point?.dailyPnL ?? 0) >= 0 ? "#dbfaec" : "#ffebed",
          borderRadius: 5,
        }}
      >
        <span>
          {(point?.dailyPnL ?? 0) >= 0 ? "▲" : "▼"}
        </span>
        <span>{formatUsd(point?.dailyPnL ?? 0)}</span>
      </div>
    </div>

    {/* FROM PEAK */}
    {fromPeak < 0 && (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          marginBottom: 4,
        }}
      >
        <span
          style={{
            fontSize: 11,
            color: "#64748b",
            fontWeight: 500,
            minWidth: 70,
          }}
        >
          From peak
        </span>

        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 4,
            padding: "1px 6px",
            fontSize: 11,
            fontWeight: 600,
            color: "#c90f3c",
            backgroundColor: "#ffebed",
            borderRadius: 5,
          }}
        >
          <span>▼</span>
          <span>{formatUsd(fromPeak)}</span>
        </div>
      </div>
    )}

    {/* DAILY TRADES */}
    {tradesToday > 0 && (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          marginTop: 4,
        }}
      >
        <span
          style={{
            fontSize: 11,
            color: "#64748b",
            fontWeight: 500,
            minWidth: 70,
          }}
        >
          Daily trades
        </span>

        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            padding: "1px 6px",
            fontSize: 11,
            fontWeight: 600,
            color: "#314662",
            backgroundColor: "#eaeef4",
            borderRadius: 5,
          }}
        >
          {tradesToday} Trades
        </div>
      </div>
    )}
  </div>
);





}




/* ======================
   COMPONENT
====================== */



export default function DailyCumulativePnLChart() {
  

  const containerRef = useRef<HTMLDivElement | null>(null);
const [loading, setLoading] = useState(false);



useEffect(() => {
  if (!containerRef.current) return;

  let timeout: any;

  const observer = new ResizeObserver(() => {
  if (!loading) {
    setLoading(true);
  }

  clearTimeout(timeout);
  timeout = setTimeout(() => {
    setLoading(false);
  }, 250);
});



  observer.observe(containerRef.current);

  return () => {
    observer.disconnect();
    clearTimeout(timeout);
  };
}, []);
  const data = useMemo(() => {
  const raw = getDailyCumulativePnL(fakeTrades);
  const tradesByDate: Record<string, number> = {};

fakeTrades.forEach(t => {
  tradesByDate[t.date] = (tradesByDate[t.date] || 0) + 1;
});
  const fixed: any[] = [];

  if (raw.length === 0) return [];

  // 🔒 HER ZAMAN BAŞLANGIÇ 0 NOKTASI
  if (raw[0].value !== 0) {
    fixed.push({
      ...raw[0],
      value: 0,
      positiveValue: 0,
      negativeValue: 0,
    });
  }


  for (let i = 0; i < raw.length; i++) {
    const curr = raw[i];
    const prev = raw[i - 1];

    // mevcut noktayı ekle
    fixed.push({
      ...curr,
      positiveValue: curr.value >= 0 ? curr.value : null,
      negativeValue: curr.value < 0 ? curr.value : null,
    });

    // 🔥 0 crossing yakala (KIRMIZI ↔ YEŞİL ARASI BOŞLUK YOK)
    if (prev && prev.value * curr.value < 0) {
      fixed.splice(fixed.length - 1, 0, {
        ...curr,
        value: 0,
        positiveValue: 0,
        negativeValue: 0,
      });
    }
  }

  let peak = -Infinity;
let prevValue = 0;

const enriched = fixed.map((p) => {
  peak = Math.max(peak, p.value);

  const dailyPnL = p.value - prevValue;
  prevValue = p.value;

  return {
    ...p,
    peak,
    fromPeak: p.value - peak,
    tradesToday: tradesByDate[p.date] || 0,
    dailyPnL, // ✅ ARTIK GERÇEK DEĞER
  };
});


return enriched;
;
}, []);








const minValue =
  data.length > 0
    ? Math.min(...data.map((d) => d.value))
    : 0;


const maxValue =
  data.length > 0
    ? Math.max(...data.map((d) => d.value))
    : 0;
const effectiveMax = Math.max(
  Math.abs(minValue),
  Math.abs(maxValue)
);
const PADDING_RATIO = 0.15;

const range = maxValue - minValue || 1;

const paddedMin =
  minValue >= 0
    ? 0
    : minValue - range * PADDING_RATIO;

const paddedMax =
  maxValue + range * PADDING_RATIO;


const yAxisLayout = getYAxisLayout(effectiveMax);

// 🔴 Y ekseni – 11 adet grid / para seviyesi
const yTicks = useMemo(() => {
  const levels = 11;

  if (paddedMax === paddedMin) return [paddedMax];

  const range = paddedMax - paddedMin;
  const step = getNiceStep(range / (levels - 1));

  return Array.from({ length: levels }, (_, i) =>
    Math.round((paddedMin + i * step) / step) * step
  );
}, [paddedMin, paddedMax]);



  return (
  <div ref={containerRef} className="relative w-full h-full">

    {/* GRAFİK WRAPPER – LOADING SIRASINDA OPACITY 0 */}
    <div
  style={{
    height: "100%",
    width: "100%",
    opacity: loading ? 0 : 1,
    transition: "opacity 120ms ease",
  }}
>

      <ResponsiveContainer width="100%" height="100%" debounce={200}>
        <AreaChart data={data} margin={{ top: 8, right: 5, left: 4, bottom: 4 }}>

          <ReferenceLine
            y={0}
            stroke="#94a3b8"
            strokeDasharray="4 4"
            strokeWidth={1.5}
            ifOverflow="extendDomain"
          />

          <defs>
            <linearGradient id="positivePnL" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10b981" stopOpacity={0.35} />
              <stop offset="100%" stopColor="#10b981" stopOpacity={0.05} />
            </linearGradient>

            <linearGradient id="negativePnL" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ef4444" stopOpacity={0.35} />
              <stop offset="100%" stopColor="#ef4444" stopOpacity={0.05} />
            </linearGradient>
          </defs>

          <CartesianGrid
  stroke="#e5e7eb"
  strokeDasharray="3 3"
  vertical={false}
  horizontal
  syncWithTicks
/>


          <XAxis
            dataKey="date"
            tickFormatter={formatDate}
            tick={{ fontSize: 11, fill: "#64748b" }}
            tickMargin={12}
            axisLine={false}
            tickLine={false}
            interval="preserveStartEnd"
            minTickGap={32}
            padding={{ left: 16, right: 0 }}
          />

          <YAxis
  ticks={yTicks}
  domain={[yTicks[0], yTicks[yTicks.length - 1]]}
  interval={0}
  tickFormatter={formatUsd}
  tick={{ fontSize: 11, fill: "#64748b", dx: yAxisLayout.dx }}
  axisLine={false}
  tickLine={false}
  width={yAxisLayout.width}
/>


          <Tooltip
  isAnimationActive={false}
  cursor={{
    stroke: "#94a3b8",
    strokeDasharray: "4 4",
    strokeOpacity: 0.6,
  }}
  content={({ active, payload, label, coordinate }) => (
    <CustomPnLTooltip
      active={active}
      payload={payload}
      label={label}
      coordinate={coordinate}
    />
  )}
/>



          <Area
            type="monotone"
            dataKey="positiveValue"
            stroke="#10b981"
            fill="url(#positivePnL)"
            strokeWidth={2}
            dot={false}
            baseValue={0}
            
          />

          <Area
            type="monotone"
            dataKey="negativeValue"
            stroke="#ef4444"
            fill="url(#negativePnL)"
            strokeWidth={2}
            dot={false}
            baseValue={0}
            
          />
          
        </AreaChart>
      </ResponsiveContainer>
    </div>

    {/* LOADING – SADECE ÜSTÜNE PERDE */}
    {loading && (
      <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/100 pointer-events-none">
        <div className="flex flex-col items-center gap-2">
          <div className="w-6 h-6 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin" />
          <span className="text-xs text-slate-500">Updating chart…</span>
        </div>
      </div>
    )}

  </div>
);


}
