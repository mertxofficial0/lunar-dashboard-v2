import React from "react";
import DashboardHeaderV2 from "./DashboardHeaderV2";
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

function BetaBadge() {
  return (
    <span className="
      text-[10px]
      font-bold
      px-2
      py-0.5
      rounded-lg
      bg-yellow-100
      text-yellow-700
      border
      border-yellow-200
      tracking-wide
    ">
      BETA
    </span>
  );
}

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

const dayWinRate =
  countedDays === 0 ? 0 : (dayWinCount / countedDays) * 100;



  // fakeTrades'ta breakeven yoksa 0 kalır (ileride eklersen otomatik olur)
  const breakevenCount = fakeTrades.filter(
    (t: any) => t.result === "breakeven"
  ).length;

  return (

    <div className="flex-1 overflow-y-auto overflow-x-hidden">


   <DashboardHeaderV2 />
   






{/* DASHBOARD CONTENT */}
<div className="bg-[#F5F6F8] p-5">

  <DashboardGreetingActionsV2 greeting={getGreeting()} />



  {/* STATS */}
  <div className="grid grid-cols-5 gap-4 mb-4">
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
  <div className="grid grid-cols-12 gap-4">
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
      <BetaBadge />

    </div>
  }
  height="h-[300px]"
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
  height="h-[300px]"
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
      <BetaBadge />

    </div>
  }
  height="h-[300px]"
>

  <div className="relative w-full h-full">
  {showNetPnL ? <NetDailyPnLBarChart /> : <ChartSpinner />}
</div>


</Card>


  </div>
</div>

{/* LOWER GRID */}
<div className="grid grid-cols-12 gap-4 mt-4">
  {/* LEFT COLUMN */}
  <div className="col-span-4 space-y-4">
    <Card title="Recent Trades" height="h-[400px]">
      Recent trades table
    </Card>

    <Card title="Account Balance" height="h-[180px]">
      Balance chart / number
    </Card>
  </div>

  {/* RIGHT COLUMN */}
  <div className="col-span-8">
    <Card
  title={
    <div className="relative -top-1 inline-flex items-center justify-between w-full">



      
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
  px-2 py-1
  text-slate-600
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
<div className="flex items-center gap-4 text-sm">

  {/* Label */}
  <span className="text-slate-600 font-medium">
    Monthly Stats:
  </span>

  {/* Monthly PnL Badge */}
  <span
    className={`
      inline-flex items-center justify-center
      px-2.5 py-0.5
      rounded-md
      text-xs font-semibold
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
      px-2.5 py-0.5
      rounded-md
      text-xs font-semibold
      min-w-[72px]
      bg-slate-100
      text-slate-700
    "
  >
    {monthlyTradeDays} days
  </span>

</div>




    </div>
  }
  height="h-[500px]"
  tightHeader
>
  <CalendarV2 currentDate={calendarDate} />

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
        <span className="text-xs text-slate-500">
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
  tightHeader = false,
}: {
  title: React.ReactNode;
  children: React.ReactNode;
  height?: string;
  tightHeader?: boolean;
}) {


  return (
    <div className="
      bg-white
      rounded-xl
      p-5
      shadow-[0_1px_1px_rgba(0,0,0,0.03)]
    ">
      {/* TITLE */}
      <div className="text-sm font-semibold text-slate-700 -mt-1.5
 ">
        {title}
      </div>

      {/* FULL-WIDTH DIVIDER */}
      <div
  className={`
    -mx-5
    ${tightHeader ? "mt-1 mb-3" : "mt-3 mb-4"}
    h-px bg-slate-200
  `}
/>


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
