type WeekBucket = {
  label: string;
  from: number;
  to: number;
  pnl: number;
  trades: number;
  equityBefore?: number;
  equityAfter?: number;
};

type Trade = {
  date: string;
  pnlUsd: number;
  account: {
    equityBefore: number;
    equityAfter: number;
  };
};


type Props = {
  trades: Trade[];
  year: number;
  month: number;
  totalRows: number;
  showTradeCount: boolean;

  // 🔥 YENİ
  showDailyPercent: boolean;
};



export default function WeeklyPnLColumn({
  trades,
  year,
  month,
  totalRows,
  showTradeCount,
  showDailyPercent,
}: Props) {


  /* =========================
     WEEK BUCKETS
  ========================= */
  const weeks: WeekBucket[] = [
  { label: "Week 1", from: 1, to: 7, pnl: 0, trades: 0 },
  { label: "Week 2", from: 8, to: 14, pnl: 0, trades: 0 },
  { label: "Week 3", from: 15, to: 21, pnl: 0, trades: 0 },
  { label: "Week 4", from: 22, to: 28, pnl: 0, trades: 0 },
  { label: "Week 5", from: 29, to: 31, pnl: 0, trades: 0 },
  { label: "Week 6", from: 32, to: 38, pnl: 0, trades: 0 },
];




  /* =========================
     PNL + TRADE COUNT
  ========================= */
  trades.forEach((t) => {
  const d = new Date(t.date);
  if (d.getFullYear() !== year) return;
  if (d.getMonth() !== month) return;

  const day = d.getDate();
  const week = weeks.find((w) => day >= w.from && day <= w.to);
  if (!week) return;

  week.pnl += t.pnlUsd;
  week.trades += 1;

  // 🔥 HAFTA BAŞI EQUITY (ilk trade)
  if (week.equityBefore === undefined) {
    week.equityBefore = t.account.equityBefore;
  }

  // 🔥 HAFTA SONU EQUITY (son trade overwrite)
  week.equityAfter = t.account.equityAfter;
});

const getWeeklyPercent = (w: WeekBucket) => {

  if (
    w.equityBefore === undefined ||
    w.equityAfter === undefined ||
    w.equityBefore === 0
  ) {
    return undefined;
  }

  return (
    ((w.equityAfter - w.equityBefore) / w.equityBefore) *
    100
  );
};

  /* =========================
     STYLES (DAY CELL İLE AYNI)
  ========================= */
  const getWeekStyle = (pnl: number) => {
  if (pnl > 0) {
    return `
      bg-emerald-100
      border border-emerald-300
      text-slate-800
      shadow-[0_1px_1px_rgba(0,0,0,0.04)]
    `;
  }

  if (pnl < 0) {
    return `
      bg-rose-100
      border border-rose-300
      text-slate-800
      shadow-[0_1px_1px_rgba(0,0,0,0.04)]
    `;
  }

  return `
    bg-slate-50
    border border-slate-200
    text-slate-800
  `;
};

const getHoverBorder = (pnl: number) => {
  if (pnl > 0) return "hover:border-emerald-400";
  if (pnl < 0) return "hover:border-rose-400";
  return "hover:border-slate-300";
};

  /* =========================
     RENDER
  ========================= */
  return (
    <div className="flex flex-col h-full">
      {/* HEADER */}
      <div className="h-[29px] mb-2 flex items-center justify-center text-xs font-semibold text-slate-600 bg-white border border-slate-200 rounded-md">
        Weeks
      </div>

      {/* WEEK ROWS */}
      <div className="flex flex-col flex-1 gap-[8px]">

        {weeks.slice(0, totalRows).map((w) => (
          <div
  key={w.label}
  className={`
    rounded-lg
    flex flex-col
    flex-1
    min-h-0
    overflow-hidden
    p-2
    gap-[4px]

    transition-colors
    duration-150
    cursor-pointer

    ${getWeekStyle(w.pnl)}
    ${getHoverBorder(w.pnl)}
  `}
>



            {/* WEEK LABEL */}
            <div className="text-[11px] font-medium text-slate-600">
              {w.label}
            </div>

            {/* PNL */}
            <div className="text-sm font-semibold leading-tight">
              {w.pnl >= 0 ? "+" : ""}
              ${Math.round(w.pnl).toLocaleString()}
            </div>

            {/* TRADE BADGE */}
            {(showTradeCount || showDailyPercent) && (
  <div className="flex items-center gap-2 text-[9px] font-medium">
    
    {/* TRADE COUNT */}
    {showTradeCount && w.trades > 0 && (
      <span className="text-slate-600">
        {w.trades} trades
      </span>
    )}

    {/* WEEKLY % */}
    {showDailyPercent && (() => {
      const weeklyPercent = getWeeklyPercent(w);
      if (weeklyPercent === undefined) return null;

      return (
        <span
          className={
            weeklyPercent >= 0
              ? "text-emerald-700"
              : "text-rose-700"
          }
        >
          {weeklyPercent >= 0 ? "+" : ""}
          {weeklyPercent.toFixed(2)}%
        </span>
      );
    })()}

  </div>
)}





          </div>
        ))}
      </div>
    </div>
  );
}
