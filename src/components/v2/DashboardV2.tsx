import React from "react";

import DashboardGreetingActionsV2 from "./DashboardGreetingActionsV2";
import { dashboardStats } from "../../lib/fakeDashboardStats";
import { fakeTrades } from "../../lib/fakeTrades";
import StatCard from "./StatCard";
import InfoTooltip from "../ui/InfoTooltip";
import DailyCumulativePnLChart from "./DailyCumulativePnLChart";
import NetDailyPnLBarChart from "./NetDailyPnLBarChart";
import { useEffect, useState } from "react";
import LunarScoreRadarChart from "./LunarScoreRadarChart";
import CalendarV2 from "./CalendarV2";
import WeeklyPnLColumn from "./WeeklyPnLColumn";



function getGreeting() {
  const hour = new Date().getHours();

  if (hour >= 5 && hour < 12) return "Good morning";
  if (hour >= 12 && hour < 18) return "Good afternoon";
  return "Good evening";
}

export default function DashboardV2() {
  const [calendarDate, setCalendarDate] = useState(() => {
  const d = new Date();
  d.setDate(1);
  return d;
});


const selectedYear = calendarDate.getFullYear();
const selectedMonth = calendarDate.getMonth(); // 0–11
const [showWeekly, setShowWeekly] = useState(true);
const [showCalendarSettings, setShowCalendarSettings] = useState(false);
const [showTradeCount, setShowTradeCount] = useState(true);
const [showDailyPercent, setShowDailyPercent] = useState(false);
const [highlightExtremeDays, setHighlightExtremeDays] = useState(false);

const monthlyTrades = fakeTrades.filter(t => {
  const d = new Date(t.date);
  return (
    d.getFullYear() === selectedYear &&
    d.getMonth() === selectedMonth
  );
});

const monthlyPnL = monthlyTrades.reduce(
  (sum, t) => sum + t.pnlUsd,
  0
);

// trade atılan UNIQUE gün sayısı
const monthlyTradeDays = new Set(
  monthlyTrades.map(t => t.date)
).size;

const monthlyTradeCount = monthlyTrades.length;

  const [showCumulative, setShowCumulative] = useState(false);
  const [showNetPnL, setShowNetPnL] = useState(false);
    useEffect(() => {
    // ⏱️ Site açıldıktan ~2sn sonra cumulative
    const t1 = setTimeout(() => {
      setShowCumulative(true);
    }, 1000);

    // ⏱️ Cumulative’den ~2sn sonra net pnl
    const t2 = setTimeout(() => {
      setShowNetPnL(true);
    }, 2500);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  const winTrades = fakeTrades.filter(t => t.pnlUsd > 0);
const lossTrades = fakeTrades.filter(t => t.pnlUsd < 0);

const avgWin =
  winTrades.length === 0
    ? 0
    : winTrades.reduce((s, t) => s + t.pnlUsd, 0) / winTrades.length;

const avgLoss =
  lossTrades.length === 0
    ? 0
    : Math.abs(
        lossTrades.reduce((s, t) => s + t.pnlUsd, 0) /
          lossTrades.length
      );

const avgWinLossTrade =
  avgLoss === 0 ? 0 : avgWin / avgLoss;

  const winCount = fakeTrades.filter((t) => t.result === "win").length;
  const lossCount = fakeTrades.filter((t) => t.result === "loss").length;
// ---- DAY BASED RESULTS ----
const dayMap: Record<string, number> = {};

fakeTrades.forEach((t) => {
  dayMap[t.date] = (dayMap[t.date] || 0) + t.pnlUsd;
});

const dayResults = Object.values(dayMap);

const dayWinCount = dayResults.filter((v) => v > 0).length;
const dayLossCount = dayResults.filter((v) => v < 0).length;
const dayBreakevenCount = dayResults.filter((v) => v === 0).length;
const countedDays = dayWinCount + dayLossCount; // BE hariç (TradeZella gibi)
const firstDayOfMonth = new Date(selectedYear, selectedMonth, 1);
const startWeekDay = firstDayOfMonth.getDay();
const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();

const totalCells =
  startWeekDay + daysInMonth <= 35 ? 35 : 42;

const dayWinRate =
  countedDays === 0 ? 0 : (dayWinCount / countedDays) * 100;
type MonthlyBadgeMode = "days" | "trades" | "both";

const [monthlyBadgeMode, setMonthlyBadgeMode] =
  useState<MonthlyBadgeMode>("both");



  // fakeTrades'ta breakeven yoksa 0 kalır (ileride eklersen otomatik olur)
  const breakevenCount = fakeTrades.filter(
    (t: any) => t.result === "breakeven"
  ).length;

  return (

    <div className="flex-1 overflow-y-auto overflow-x-hidden">


   
   






{/* DASHBOARD CONTENT */}
<div className="bg-[#F5F6F8] p-4">

  <DashboardGreetingActionsV2 greeting={getGreeting()} />



  {/* STATS */}
  <div className="grid grid-cols-5 gap-3 mb-3">
    <StatCard
    prefix="$"
  title="Net P&L"
  tooltip="Seçilen zaman aralığında yaptığın tüm işlemlerin toplam kâr ve zarar sonucunu gösterir."
  value={dashboardStats.netPnL}

positive={dashboardStats.netPnL >= 0}

  
  showTradeCount
  
/>




    <StatCard
  title="Trade Win %"
  tooltip="Stratejinin başarı oranını gösterir."
  value={dashboardStats.tradeWinRate.toFixed(2)}
  suffix="%"
  gauge={{
    win: winCount,
    breakeven: breakevenCount,
    loss: lossCount,
  }}
/>



    <StatCard
  title="Profit Factor"
  tooltip="Kazanan işlemlerden elde edilen toplam kârın, kaybeden işlemlerin toplam zararına oranıdır."
  value={dashboardStats.profitFactor.toFixed(2)}
  profitFactorGauge={{
  value: dashboardStats.profitFactor,
}}

/>


    <StatCard
  title="Day Win %"
  tooltip="Seçilen zaman aralığında pozitif sonuçlanan günlerin yüzdesini gösterir."
  value={dayWinRate.toFixed(1)}
  suffix="%"
  gauge={{
    win: dayWinCount,
    breakeven: dayBreakevenCount,
    loss: dayLossCount,
  }}
/>


    <StatCard
  title="Avg Win/Loss Trade"
  tooltip="Tüm tradelerin ortalama kazanç ile ortalama zarar arasındaki oranı gösterir."
  value={avgWinLossTrade.toFixed(2)}
  avgWinLossBar={{
    avgWinUsd: avgWin,
    avgLossUsd: avgLoss,
  }}
/>




  </div>


  {/* GRID */}
  <div className="grid grid-cols-12 gap-3">
  <div className="col-span-4">
    <Card
  title={
    <div className="flex items-center justify-between w-full">
      
      {/* SOL TARAF */}
      <div className="flex items-center gap-2">
        <span>Lunar Score</span>

        <InfoTooltip tooltip="Kazanma oranı, risk–ödül dengesi ve tutarlılığı bir araya getirerek genel performansını ölçer." />
      </div>

      {/* SAĞ TARAF */}
      

    </div>
  }
  height="h-[270px]"
>

  <LunarScoreRadarChart
  winRate={dashboardStats.tradeWinRate}
  profitFactor={dashboardStats.profitFactor}
  avgWinLoss={avgWinLossTrade}
/>

</Card>

  </div>

  <div className="col-span-4">
    <Card
  title={
    <div className="flex items-center gap-2">
      <span>Daily Net Cumulative P&L</span>
      <InfoTooltip tooltip="Her günün net sonucunun önceki günlere eklenmesiyle oluşan toplam performansı ifade eder." />
    </div>
  }
  height="h-[270px]"
>
  <div className="relative w-full h-full">
  {showCumulative ? <DailyCumulativePnLChart /> : <ChartSpinner />}
</div>

</Card>



  </div>

  <div className="col-span-4">
    <Card
  title={
    <div className="flex items-center justify-between w-full">
      
      {/* SOL TARAF */}
      <div className="flex items-center gap-2">
        <span>Net Daily P&L</span>
        <InfoTooltip tooltip="Günlük bazda elde edilen toplam kazanç ve kayıpların net sonucunu ifade eder." />
      </div>

      {/* SAĞ TARAF */}
     

    </div>
  }
  height="h-[270px]"
>

  <div className="relative w-full h-full">
  {showNetPnL ? <NetDailyPnLBarChart /> : <ChartSpinner />}
</div>


</Card>


  </div>
</div>

{/* LOWER GRID */}
<div className="grid grid-cols-12 gap-3 mt-2.5">
  {/* LEFT COLUMN */}
  <div className="col-span-4 space-y-3">
    <Card title="Recent Trades" height="h-[250px]">
      Recent trades table
    </Card>

    <Card title="Account Balance" height="h-[160px]">
      Balance chart / number
    </Card>
  </div>

  {/* RIGHT COLUMN */}
  <div className="col-span-8">
    <Card
  title={
    <div className="relative z-30 inline-flex items-center justify-between w-full translate-y-[-1px]">





      
      {/* SOL TARAF */}
      <div className="flex items-center gap-2">
        <button
  onClick={() => {
    const d = new Date(calendarDate);
    d.setMonth(d.getMonth() - 1);
    setCalendarDate(d);
  }}
  className="p-1 text-slate-600 hover:text-slate-900 transition"
>
  <ArrowLeft />
</button>



        <button
  onClick={() => {
    const d = new Date();
    d.setDate(1);
    setCalendarDate(d);
  }}
  className="
  px-3 py-1
  text-slate-700
  hover:text-slate-900
  transition
"

>
  {calendarDate.toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  })}
</button>




        <button
  onClick={() => {
    const d = new Date(calendarDate);
    d.setMonth(d.getMonth() + 1);
    setCalendarDate(d);
  }}
  className="p-1 text-slate-600 hover:text-slate-900 transition"
>
  <ArrowRight />
</button>


      </div>

      {/* SAĞ TARAF – MONTHLY SUMMARY */}
<div className="flex items-center gap-2 text-[11px]">

  {/* Label */}
  <span className="text-slate-600 font-medium">
    Monthly Stats:
  </span>

  {/* Monthly PnL Badge */}
  <span
    className={`
      inline-flex items-center justify-center
      px-1 py-0
      rounded-md
      text-[10px] font-semibold
      min-w-[72px]
      ${
        monthlyPnL >= 0
          ? "bg-emerald-100 text-emerald-700"
          : "bg-rose-100 text-rose-700"
      }
    `}
  >
    {monthlyPnL >= 0 ? "+" : ""}
    ${monthlyPnL.toLocaleString()}
  </span>

  {/* Trade Days Badge */}
  <span
  className="
    inline-flex items-center justify-center
    px-3 py-0
    rounded-md
    text-[10px] font-semibold
    bg-slate-200/70
    text-slate-700
    gap-1
  "
>
  {(monthlyBadgeMode === "days" ||
    monthlyBadgeMode === "both") && (
    <span>{monthlyTradeDays} days</span>
  )}

  {monthlyBadgeMode === "both" && (
    <span className="mx-0.5 h-2.5 w-px bg-slate-400/70" />
  )}

  {(monthlyBadgeMode === "trades" ||
    monthlyBadgeMode === "both") && (
    <span>{monthlyTradeCount} trades</span>
  )}
</span>

<button
  onClick={() => setShowCalendarSettings(v => !v)}
  className="
    -ml-1
    p-1
    rounded-md
    text-slate-500

    
   
    hover:bg-violet-100
    

    transition
    duration-150
    relative
  "
  
>

  <SettingsIcon />

  {showCalendarSettings && (
  <div
    onClick={(e) => e.stopPropagation()}
    className="
      absolute
      top-full
      right-0
      mt-2
      w-[240px]
      bg-white
      border
      border-slate-200
      rounded-xl
      shadow-xl
      p-4
      z-50
    "
  >
    {/* ===== VIEW ===== */}
<div className="mb-4">
  <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">
    View
  </div>
  <div className="h-px bg-slate-200 mt-1 mb-2" />

  <div className="space-y-1.5">
    <label className="flex items-center gap-2 text-xs cursor-pointer">
      <input
        type="checkbox"
        checked={showWeekly}
        onChange={() => setShowWeekly(v => !v)}
        className="accent-violet-600"
      />
      Show weekly summary
    </label>

    <label className="flex items-center gap-2 text-xs cursor-pointer">
      <input
        type="checkbox"
        checked={showTradeCount}
        onChange={() => setShowTradeCount(v => !v)}
        className="accent-violet-600"
      />
      Show trade count
    </label>

    <label className="flex items-center gap-2 text-xs cursor-pointer">
      <input
        type="checkbox"
        checked={showDailyPercent}
        onChange={() => setShowDailyPercent(v => !v)}
        className="accent-violet-600"
      />
      Show daily % change
    </label>
  </div>
</div>


    
    

    {/* ===== HIGHLIGHTS ===== */}
    <div className="mb-4">
  {/* divider */}
  <div className="h-px bg-slate-200/70 mb-3" />

  <label className="flex items-center gap-2 text-xs text-slate-600 cursor-pointer select-none">
    <input
      type="checkbox"
      checked={highlightExtremeDays}
      onChange={() => setHighlightExtremeDays(v => !v)}
      className="
        accent-violet-600
        rounded
        focus:ring-0
        focus:outline-none
      "
    />
    Highlight best / worst day
    
  </label>
</div>


    {/* ===== MONTHLY BADGE ===== */}
    <div>
      <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide">
        Monthly badge
      </div>
      <div className="h-px bg-slate-200 mt-1 mb-2" />

      <div className="space-y-1.5 pl-1">
        <label className="flex items-center gap-2 text-xs cursor-pointer">
          <input
            type="radio"
            checked={monthlyBadgeMode === "days"}
            onChange={() => setMonthlyBadgeMode("days")}
            className="accent-violet-600"
          />
          Days only
        </label>

        <label className="flex items-center gap-2 text-xs cursor-pointer">
          <input
            type="radio"
            checked={monthlyBadgeMode === "trades"}
            onChange={() => setMonthlyBadgeMode("trades")}
            className="accent-violet-600"
          />
          Trades only
        </label>

        <label className="flex items-center gap-2 text-xs cursor-pointer">
          <input
            type="radio"
            checked={monthlyBadgeMode === "both"}
            onChange={() => setMonthlyBadgeMode("both")}
            className="accent-violet-600"
          />
          Days + trades
        </label>
      </div>
    </div>
  </div>



  )}
</button>



</div>




    </div>
  }
  height="h-[510px]"
  
>
  <div
  className={`relative z-0 grid h-full w-full gap-[14px] ${
    showWeekly
      ? "grid-cols-[1fr_120px]"
      : "grid-cols-1"
  }`}
>


  {/* SOL: CALENDAR */}
  <CalendarV2
  currentDate={calendarDate}
  showTradeCount={showTradeCount}
  showDailyPercent={showDailyPercent}
  highlightExtremeDays={highlightExtremeDays}
/>




  {/* SAĞ: WEEKLY PNL */}
  {showWeekly && (
  <WeeklyPnLColumn
  trades={monthlyTrades}
  year={selectedYear}
  month={selectedMonth}
  totalRows={totalCells / 7}
  showTradeCount={showTradeCount}
  showDailyPercent={showDailyPercent}
/>

)}



</div>


</Card>


  </div>
</div>



</div>


      
      
        
      
    </div>
  );
}
function ChartSpinner() {
  return (
    
    <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/100 pointer-events-none">
      <div className="flex flex-col items-center gap-2">
        <div className="w-6 h-6 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin" />
        <span className="text-[11px] text-slate-500">
          Updating chart…
        </span>
      </div>
    </div>
  );
}


/* UI */
function Card({
  title,
  children,
  height = "h-[240px]",
}: {
  title: React.ReactNode;
  children: React.ReactNode;
  height?: string;
}) {



  return (
    <div className="
      bg-white
      rounded-xl
      p-4
      shadow-[0_1px_1px_rgba(0,0,0,0.03)]
    ">
      {/* TITLE */}
      <div className="h-[12px] flex items-center text-[12px] font-semibold text-slate-700">
  {title}
</div>

{/* DIVIDER */}
<div className="relative -mx-5 mt-3 mb-3">
  <div className="h-px bg-slate-200 mx-1" />

</div>


      {/* CONTENT */}
      <div
        className={`flex items-center justify-center text-slate-400 text-sm ${height}`}
      >
        {children}
      </div>
    </div>
  );
  
}
function ArrowLeft() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M15 18l-6-6 6-6" />
    </svg>
  );
}
function SettingsIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51h.09a1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9c0 .66.39 1.26 1 1.51H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  );
}

function ArrowRight() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M9 18l6-6-6-6" />
    </svg>
  );
  
}
