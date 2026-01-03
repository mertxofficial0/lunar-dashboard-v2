
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

function getYAxisLayout(maxValue: number) {
  // < 1.000
  if (maxValue < 1_000) {
    return {
      dx: 0,
      width: 40,
    };
  }

  // 1.000 – 10.000
  if (maxValue < 10_000) {
    return {
      dx: 0,
      width: 50,
    };
  }

  // 10.000 – 100.000
  if (maxValue < 100_000) {
    return {
      dx: 0,
      width: 60,
    };
  }

  // 100.000 – 1.000.000
  if (maxValue < 1000_000) {
    return {
      dx: 0,
      width: 60,
    };
  }

  // 500.000 – 1.000.000
  if (maxValue < 10_000_000) {
    return {
      dx: 0,
      width: 70,
    };
  }

  // 10.000.000+
  return {
    dx: 0,
    width: 70,
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

function CustomPnLTooltip({ active, payload, label }: any) {
  if (!active || !payload || payload.length === 0) return null;

  // Recharts payload içinde bazen positiveValue/negativeValue ayrı ayrı gelir.
  // Hangisi doluysa onu alıyoruz.
  const v =
    payload.find((p: any) => typeof p?.value === "number" && p.value !== null)?.value ?? 0;

  // Fake crossing noktasında (0 eklediğin nokta) tooltip gösterme
  if (v === 0) return null;

  const isPositive = v >= 0;

  return (
    <div
      style={{
        background: "#fff",
        border: "1px solid #e2e8f0",
        borderRadius: 10,
        padding: "8px 12px",
        fontSize: 12,
        boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
      }}
    >
      <div style={{ color: "#64748b", marginBottom: 4 }}>
        {new Date(label).toLocaleDateString("en-US", {
          month: "short",
          day: "2-digit",
          year: "numeric",
        })}
      </div>

      <div
        style={{
          fontWeight: 600,
          color: isPositive ? "#69d3b0" : "#ef4444",
        }}
      >
        Net PnL: {formatUsd(v)}
      </div>
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

  return fixed;
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

const yAxisLayout = getYAxisLayout(effectiveMax);

// 🔴 Y ekseni – 11 adet grid / para seviyesi
const yTicks = useMemo(() => {
  if (maxValue === minValue) return [maxValue];

  const levels = 11;
  const range = maxValue - minValue;
  const step = getNiceStep(range / (levels - 1));

  return Array.from({ length: levels }, (_, i) =>
    Math.round((minValue + i * step) / step) * step
  );
}, [minValue, maxValue]);


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
            allowDataOverflow
            tickFormatter={formatUsd}
            tick={{ fontSize: 11, fill: "#64748b", dx: yAxisLayout.dx }}
            axisLine={false}
            tickLine={false}
            width={yAxisLayout.width}
          />

          <Tooltip
            isAnimationActive={false}
            cursor={{ stroke: "#10b981", strokeOpacity: 0.2 }}
            content={<CustomPnLTooltip />}
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
