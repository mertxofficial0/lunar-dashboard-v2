import { ReferenceLine } from "recharts";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { useMemo, useEffect, useRef, useState } from "react";

import { fakeTrades } from "../../lib/fakeTrades";

/* ======================
   FORMAT HELPERS
====================== */
function getWeekRangeFromKey(weekKey: string) {
  // "2024-W10"
  const [yearPart, weekPart] = weekKey.split("-W");
  const year = Number(yearPart);
  const week = Number(weekPart);

  // ISO week → Pazartesi başlangıç
  const firstDayOfYear = new Date(year, 0, 1);
  const daysOffset = (week - 1) * 7;

  const weekStart = new Date(firstDayOfYear);
  weekStart.setDate(
    firstDayOfYear.getDate() +
      daysOffset -
      ((firstDayOfYear.getDay() + 6) % 7)
  );

  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6);

  return { weekStart, weekEnd };
}

function formatXAxisLabel(label: string) {
  // WEEKLY → W10
  if (label.includes("W")) {
    return label.split("-")[1];
  }

  // MONTHLY → Mar
  if (label.length === 7) {
    return new Date(label + "-01").toLocaleDateString("en-US", {
      month: "short",
    });
  }

  // DAILY → Mar 12
  return new Date(label).toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
  });
}


// 👉 TARİHTEN HAFTA ANAHTARI ÜRETİR (2024-W12)
function getWeekKey(dateStr: string) {
  
  const d = new Date(dateStr);
  const firstDay = new Date(d.getFullYear(), 0, 1);
  const week = Math.ceil(
    (((d.getTime() - firstDay.getTime()) / 86400000) + firstDay.getDay() + 1) / 7
  );
  return `${d.getFullYear()}-W${week}`;
}

// 👉 TARİHTEN AY ANAHTARI ÜRETİR (2024-07)
function getMonthKey(dateStr: string) {
  const d = new Date(dateStr);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}


function getNiceStep(value: number) {
  const magnitude = Math.pow(10, Math.floor(Math.log10(value)));
  const residual = value / magnitude;

  if (residual <= 1) return 1 * magnitude;
  if (residual <= 2) return 2 * magnitude;
  if (residual <= 5) return 5 * magnitude;
  return 10 * magnitude;
}

function formatUsd(v: number) {
  const abs = Math.abs(v).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  if (v < 0) return `-$${abs}`;
  return `$${abs}`;
}



function getYAxisLayout(value: number) {
  const formatted = formatUsd(value);

  const CHAR_WIDTH = 7;
  const BASE_PADDING = 14;
  const MIN_WIDTH = 70;
  const MAX_WIDTH = 100;

  const calculated = formatted.length * CHAR_WIDTH + BASE_PADDING;

  return {
    dx: 0,
    width: Math.min(Math.max(calculated, MIN_WIDTH), MAX_WIDTH),
  };
}

/* ======================
   TOOLTIP (BİREBİR)
====================== */
function CustomDailyPnLTooltip({ active, payload, coordinate }: any) {
  
  if (!active || !payload || payload.length === 0) return null;

  // ✅ label kullanmıyoruz, date'i payload'dan alıyoruz
  const point = payload[0]?.payload;

  

  const v = point?.value ?? 0;
  const tradesToday = point?.tradesToday ?? 0;
  const isPositive = v >= 0;
let headerText = "";

if (point?.date?.includes("W")) {
  const { weekStart, weekEnd } = getWeekRangeFromKey(point.date);

  const startMonth = weekStart.toLocaleDateString("en-US", { month: "short" });
const endMonth = weekEnd.toLocaleDateString("en-US", { month: "short" });
const year = weekEnd.getFullYear();

headerText =
  startMonth === endMonth
    ? `${startMonth} ${weekStart.getDate()}–${weekEnd.getDate()}, ${year}`
    : `${startMonth} ${weekStart.getDate()} – ${endMonth} ${weekEnd.getDate()}, ${year}`;

} else if (point?.date?.length === 7) {
  // monthly
  headerText = new Date(point.date + "-01").toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
} else {
  // daily
  headerText = new Date(point.date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

  return (
    <div
      style={{
        position: "absolute",
        left: coordinate?.x ?? 0,
        top: coordinate?.y ?? 0,
        transform: "translate(-50%, -110%)",
        background: "#fff",
        borderRadius: 8,
        padding: "8px 12px",
        fontSize: 12,
        minWidth: 180,
        boxShadow: "0 0 8px rgba(15, 23, 42, 0.17)",
        pointerEvents: "none",
        zIndex: 50,
      }}
    >
      {/* ARROW */}
      <div
        style={{
          position: "absolute",
          bottom: -6,
          left: "50%",
          transform: "translateX(-50%)",
          width: 0,
          height: 0,
          borderLeft: "6px solid transparent",
          borderRight: "6px solid transparent",
          borderTop: "6px solid #fff",
        }}
      />

      {/* DATE */}
      {/* DATE */}
<div
  style={{
    fontSize: 11,
    color: "#64748b",
    fontWeight: 600,
    textAlign: "center",
    marginBottom: 4,
  }}
>
  {headerText}
</div>


      <div
        style={{
          height: 1,
          backgroundColor: "#e5e7eb",
          margin: "1px -12px 8px",
        }}
      />

      {/* DAILY NET PNL */}
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <span style={{ fontSize: 11, color: "#64748b", minWidth: 70 }}>
          Daily Net PnL
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

      {tradesToday > 0 && (
        <div style={{ marginTop: 6, fontSize: 11, color: "#475569" }}>
          {tradesToday} trades
        </div>
      )}
    </div>
  );
}


/* ======================
   COMPONENT
====================== */
export default function NetDailyPnLBarChart() {
    const containerRef = useRef<HTMLDivElement | null>(null);
  const [loading, setLoading] = useState(false);
const hasMountedRef = useRef(false);


  useEffect(() => {
  if (!containerRef.current) return;

  let timeout: any;

  const observer = new ResizeObserver(() => {
  // ⛔ ilk mount tetiklemesini yut
  if (!hasMountedRef.current) {
    hasMountedRef.current = true;
    return;
  }

  // ✅ SADECE resize olunca
  setLoading(true);

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

const uniqueDates = Array.from(
  new Set(fakeTrades.map(t => t.date))
);

const totalDays = uniqueDates.length;
type Mode = "daily" | "weekly" | "monthly";

const mode: Mode = useMemo(() => {
  if (totalDays <= 50) return "daily";
  if (totalDays <= 300) return "weekly";
  return "monthly";
}, [totalDays]);




  const data = useMemo(() => {
  const map: Record<string, number> = {};
  const tradesByBucket: Record<string, number> = {};

  fakeTrades.forEach(t => {
    let key = t.date;

    if (mode === "weekly") key = getWeekKey(t.date);
    if (mode === "monthly") key = getMonthKey(t.date);

    map[key] = (map[key] || 0) + t.pnlUsd;
    tradesByBucket[key] = (tradesByBucket[key] || 0) + 1;
  });

  return Object.entries(map)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value], index) => ({
      index,
      date: key,
      value,
      positiveValue: value >= 0 ? value : null,
      negativeValue: value < 0 ? value : null,
      tradesToday: tradesByBucket[key],
    }));
}, [mode]);




  const minValue = Math.min(...data.map((d) => d.value), 0);
  const maxValue = Math.max(...data.map((d) => d.value), 0);

  const effectiveMax = Math.max(Math.abs(minValue), Math.abs(maxValue));
  const PADDING_RATIO = 0.15;

  const range = maxValue - minValue || 1;
  const paddedMin =
    minValue >= 0 ? 0 : minValue - range * PADDING_RATIO;
  const paddedMax = maxValue + range * PADDING_RATIO;

  const yAxisLayout = getYAxisLayout(effectiveMax);

  const yTicks = useMemo(() => {
    const levels = 11;
    const step = getNiceStep(
      (paddedMax - paddedMin) / (levels - 1)
    );

    return Array.from({ length: levels }, (_, i) =>
      Math.round((paddedMin + i * step) / step) * step
    );
  }, [paddedMin, paddedMax]);

  return (
  <div
    ref={containerRef}
    className="relative h-full -ml-5 w-[calc(100%+32px)]"
  >
    {/* GRAFİK */}
    <div
      style={{
        height: "100%",
        opacity: loading ? 0 : 1,
        transition: "opacity 120ms ease",
      }}
    >
      <ResponsiveContainer width="100%" height="100%" debounce={200}>

        <BarChart
  data={data}
  margin={{ top: 8, right: 12, left: 4, bottom: 4 }}
  barCategoryGap="0%"   // 👈 ASIL OLAY BU
  barGap={0}             // 👈 pozitif / negatif arası boşluk
>

          <ReferenceLine
            y={0}
            stroke="#94a3b8"
            strokeDasharray="4 4"
            strokeWidth={1.5}
          />

          <CartesianGrid
            stroke="#e5e7eb"
            strokeDasharray="3 3"
            vertical={false}
            syncWithTicks
          />

          <XAxis
  dataKey="date"
  scale="band"           // 🔥 ASIL FIX
  tickFormatter={formatXAxisLabel}
  tick={{ fontSize: 11, fill: "#64748b" }}
  tickMargin={12}
  axisLine={false}
  tickLine={false}
  interval="preserveStartEnd"
  minTickGap={20}
  padding={{ left: 16, right: 4 }}
/>



          <YAxis
            ticks={yTicks}
            domain={[yTicks[0], yTicks[yTicks.length - 1]]}
            interval={0}
            tickFormatter={formatUsd}
            tick={{
              fontSize: 11,
              fill: "#64748b",
              textAnchor: "end",
              dx: -4,
            }}
            axisLine={false}
            tickLine={false}
            width={yAxisLayout.width}
          />

          <Tooltip
  shared={false}
  cursor={false}
  isAnimationActive={false}
  content={({ active, payload, coordinate }) => (
    <CustomDailyPnLTooltip
    
      active={active}
      payload={payload}
      coordinate={coordinate}
    />
  )}
/>




          <Bar
  dataKey="positiveValue"
  fill="#10b981"
  barSize={100}
  radius={[4, 4, 0, 0]}   // 👈 ÜST yuvarlak, ALT DÜZ
/>


<Bar
  dataKey="negativeValue"
  fill="#ef4444"
  barSize={28}
  radius={[4, 4, 0, 0]}   // 👈 ÜST DÜZ, ALT yuvarlak
/>


        </BarChart>
      </ResponsiveContainer>
    </div>

    {/* LOADING PERDESİ (AYRI KATMAN) */}
    {loading && (
      <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/100 pointer-events-none">
        <div className="flex flex-col items-center gap-2">
          <div className="w-6 h-6 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin" />
          <span className="text-xs text-slate-500">
            Updating chart…
          </span>
        </div>
      </div>
    )}
  </div>
);

}
