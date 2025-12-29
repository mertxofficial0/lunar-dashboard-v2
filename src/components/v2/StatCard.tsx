import TradeWinGauge from "./TradeWinGauge";
import { fakeTrades } from "../../lib/fakeTrades";
import InfoTooltip from "../ui/InfoTooltip";


type StatCardProps = {
  title: string;
  tooltip: string;
  value: string | number;
  suffix?: string;
  positive?: boolean;
  showTradeCount?: boolean;
  gauge?: {
    win: number;
    breakeven: number;
    loss: number;
  };
};

export default function StatCard({
    
  title,
  tooltip,
  value,
  suffix,
  positive,
  showTradeCount = false,
  gauge,
}: StatCardProps) {
  return (
    <div className="bg-white rounded-xl p-5 min-h-[100px] shadow-[0_1px_1px_rgba(0,0,0,0.03)]">
      <div className="flex items-center justify-between">
        
        {/* LEFT */}
        <div>
          {/* HEADER */}
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <span>{title}</span>

            <div className="flex items-center gap-1.5">
              <InfoTooltip tooltip={tooltip} />

              {showTradeCount && (
                <div
                  className="
                    px-2
                    h-[18px]
                    rounded-md
                    bg-slate-100
                    text-[11px]
                    font-semibold
                    text-slate-600
                    flex
                    items-center
                    justify-center
                    leading-none
                  "
                >
                  {fakeTrades.length}
                </div>
              )}
            </div>
          </div>

          {/* VALUE */}
          <div
            className={`
              text-[22px]
              font-semibold
              tracking-tight
              tabular-nums
              ${
                positive === undefined
                  ? "text-slate-900"
                  : positive
                  ? "text-emerald-600"
                  : "text-rose-600"
              }
            `}
            style={{ fontFamily: "Inter, system-ui, sans-serif" }}
          >
            {value}
            {suffix}
          </div>
        </div>

        {/* RIGHT – GAUGE (SADECE VARSA) */}
        {gauge && (
          <div className="ml-4 shrink-0">
            <TradeWinGauge
              win={gauge.win}
              breakeven={gauge.breakeven}
              loss={gauge.loss}
              small
            />
          </div>
        )}
      </div>
    </div>
  );
}
