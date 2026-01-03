import TradeWinGauge from "./TradeWinGauge";
import { fakeTrades } from "../../lib/fakeTrades";
import InfoTooltip from "../ui/InfoTooltip";
import AvgWinLossBar from "./AvgWinLossBar";

import ProfitFactorGauge from "./ProfitFactorGauge";

function formatNumberTR(value: string | number) {
  if (typeof value !== "number") return value;
  return value.toLocaleString("tr-TR");
}


type StatCardProps = {
  title: string;
  tooltip: string;
  value: string | number;
  prefix?: string;   // ✅ EKLENDİ
  suffix?: string;
  positive?: boolean;
  showTradeCount?: boolean;


  // Trade Win % / Day Win %
  gauge?: {
    win: number;
    breakeven: number;
    loss: number;
  };

  // Avg Win / Loss Trade
  avgWinLossBar?: {
    avgWinUsd: number;
    avgLossUsd: number;
  };

  // Profit Factor (donut)
  profitFactorGauge?: {
    value: number;
  };
};


export default function StatCard({
  title,
  tooltip,
  value,
prefix,   
suffix,
positive,

  showTradeCount = false,
  gauge,
  avgWinLossBar,
profitFactorGauge,

  
}: StatCardProps) {
  return (
    <div className="bg-white rounded-xl p-5 min-h-[100px] shadow-[0_1px_1px_rgba(0,0,0,0.03)]">
      <div className="flex items-center gap-4">

        {/* LEFT */}
<div className="flex flex-col min-w-0 flex-1">



          {/* HEADER */}
          <div
  className={`
    flex items-center gap-2 text-xs text-slate-500 mb-1
    mt-[1px]
  `}
>



            <span>{title}</span>
            

            <div className="flex items-center gap-1.5">
              <InfoTooltip tooltip={tooltip} />

              {showTradeCount && (
                <div className="px-1 h-[15px] rounded bg-slate-200/70 text-[11px] font-semibold text-slate-700 flex items-center justify-center leading-none">
                  {fakeTrades.length}
                </div>
              )}
            </div>
          </div>

          {/* VALUE + AVG WIN/LOSS BAR */}
<div className="flex items-center gap-4 mt-1 w-full min-w-0">


  <div
  className={`
    text-[22px]
    font-semibold
    tracking-tight
    tabular-nums
    ${avgWinLossBar ? "-translate-y-[4px]" : "translate-y-[-3px]"}
    ${
      positive === undefined
        ? "text-slate-900"
        : positive
        ? "text-[#14b8a6]"
        : "text-rose-600"
    }
  `}
>
  {prefix}
{formatNumberTR(value)}
{suffix}



</div>


  {/* AVG WIN / LOSS BAR (SAĞDA) */}
  {avgWinLossBar && (
  <div className="flex-1 min-w-0 overflow-hidden hidden lg:block mt-2.5 pr-3 ml-3">
    <AvgWinLossBar
      avgWinUsd={avgWinLossBar.avgWinUsd}
      avgLossUsd={avgWinLossBar.avgLossUsd}
    />
  </div>
)}






</div>


          
        </div>

        {/* RIGHT – GAUGE (SADECE GAUGE VARSA VE AVG BAR YOKSA) */}
{gauge && !avgWinLossBar && (
  <div className="ml-4 shrink-0 hidden lg:flex">
  <TradeWinGauge
    win={gauge.win}
    breakeven={gauge.breakeven}
    loss={gauge.loss}
    small
  />
</div>

)}

{profitFactorGauge && !avgWinLossBar && !gauge && (
  <div className="ml-4 shrink-0 hidden lg:flex items-center justify-center h-full">
  <ProfitFactorGauge value={profitFactorGauge.value} small />
</div>

)}




      </div>
    </div>
  );
}