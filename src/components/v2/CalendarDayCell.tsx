type Props = {
  day?: number;
  variant?: "empty" | "positive" | "negative";
  pnlUsd?: number;
  trades?: number;
  disabled?: boolean;
};



export default function CalendarDayCell({
  day,
  variant = "empty",
  pnlUsd,
  trades,
  disabled = false,
}: Props) {
  const styles = {
  empty: "bg-[#f8fafc] border border-slate-200",

  positive: "bg-[#c9f2e3] border border-transparent",

  negative: "bg-[#ffd6db] border border-transparent",

  // 🔥 AY DIŞI = BEYAZ
  disabled: "bg-white border border-slate-200 text-slate-400",
};


  const appliedStyle = disabled
    ? styles.disabled
    : styles[variant];

  return (
    <div
      className={`
        rounded-lg
        p-2
        h-full
        
        transition
        ${appliedStyle}
        ${!disabled ? "hover:border-slate-300" : ""}

        flex flex-col
      `}
    >
      <div className="text-right text-[10px] text-slate-400">
        {day}
      </div>

      {!disabled && variant !== "empty" && (
        <div className="flex-1 flex flex-col items-center justify-center">
          <div className="text-sm font-semibold text-slate-800">
            ${pnlUsd?.toLocaleString()}
          </div>
          <div className="text-[10px] text-slate-500">
            {trades} trades
          </div>
        </div>
      )}
    </div>
  );
}

