import React from "react";
import DashboardHeaderV2 from "./DashboardHeaderV2";
import DashboardGreetingActionsV2 from "./DashboardGreetingActionsV2";
import { dashboardStats } from "../../lib/fakeDashboardStats";
import { fakeTrades } from "../../lib/fakeTrades";
import StatCard from "./StatCard";
import InfoTooltip from "../ui/InfoTooltip";
import DailyCumulativePnLChart from "./DailyCumulativePnLChart";



function getGreeting() {
  const hour = new Date().getHours();

  if (hour >= 5 && hour < 12) return "Good morning";
  if (hour >= 12 && hour < 18) return "Good afternoon";
  return "Good evening";
}

export default function DashboardV2() {
  
  
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

    <div className="flex-1 overflow-y-auto">

   <DashboardHeaderV2 />
   






{/* DASHBOARD CONTENT */}
<div className="bg-[#F5F6F8] p-5">

  <DashboardGreetingActionsV2 greeting={getGreeting()} />



  {/* STATS */}
  <div className="grid grid-cols-5 gap-4 mb-6">
    <StatCard
  title="Net P&L"
  tooltip="Seçilen zaman aralığında yaptığın tüm işlemlerin toplam kâr ve zarar sonucunu gösterir."
  value={`$${dashboardStats.netPnL}`}
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
    <div className="flex items-center gap-2">
      <span>Lunar Score</span>

      <InfoTooltip tooltip="Kazanma oranı, risk–ödül dengesi ve tutarlılığı bir araya getirerek genel performansını ölçer." />
    </div>
  }
  height="h-[300px]"
>


      Radar chart
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
  <DailyCumulativePnLChart />
</Card>


  </div>

  <div className="col-span-4">
    <Card
  title={
    <div className="flex items-center gap-2">
      <span>Net Daily P&L</span>

      <InfoTooltip tooltip="Günlük bazda elde edilen toplam kazanç ve kayıpların net sonucunu ifade eder." />
    </div>
  }
  height="h-[300px]"
>

      Bar chart
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
    <Card title="Calendar" height="h-[600px]">
      Calendar view
    </Card>
  </div>
</div>



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
      p-5
      shadow-[0_1px_1px_rgba(0,0,0,0.03)]
    ">
      {/* TITLE */}
      <div className="text-sm font-semibold text-slate-700 -mt-1.5
 ">
        {title}
      </div>

      {/* FULL-WIDTH DIVIDER */}
      <div className="-mx-5 mt-3 mb-4 h-px bg-slate-200" />

      {/* CONTENT */}
      <div
        className={`flex items-center justify-center text-slate-400 text-sm ${height}`}
      >
        {children}
      </div>
    </div>
  );
}