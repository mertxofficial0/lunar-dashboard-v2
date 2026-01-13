type Trade = {
  date: string;
  pnlUsd: number;
};

type Props = {
  trades: Trade[];
  year: number;
  month: number; // 0–11
  totalRows: number; // 5 veya 6 (calendar ile aynı)
};

export default function WeeklyPnLColumn({
  trades,
  year,
  month,
  totalRows,
}: Props) {
  /* =========================
     WEEK BUCKETS
  ========================= */
  const weeks = [
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

    if (week) {
      week.pnl += t.pnlUsd;
      week.trades += 1;
    }
  });

  /* =========================
     STYLES (DAY CELL İLE AYNI)
  ========================= */
  const getWeekStyle = (pnl: number) => {
    if (pnl > 0) {
      return `
        bg-[#c8ffed]
        border border-emerald-300
        shadow-[0_2px_6px_rgba(16,185,129,0.25)]
        text-emerald-700
      `;
    }


    if (pnl < 0) {
      return `
        bg-[#ffdfdf]
        border border-rose-300
        shadow-[0_2px_6px_rgba(244,63,94,0.25)]
        text-rose-700
      `;
    }

    return `
      bg-[#f8fafc]
      border border-slate-200
      shadow-[inset_0_1px_0_rgba(255,255,255,0.6)]
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
            {w.trades > 0 && (
  <span className="text-[9px] font-medium text-slate-600">
    {w.trades} trades
  </span>
)}



          </div>
        ))}
      </div>
    </div>
  );
}
