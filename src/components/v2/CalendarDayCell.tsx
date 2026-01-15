type Props = {
  day?: number;
  variant?: "empty" | "positive" | "negative";
  pnlUsd?: number;
  trades?: number;
  disabled?: boolean;

  showTradeCount?: boolean;
  showDailyPercent?: boolean;

  // 🔥 YENİ
  dailyPercent?: number;
};



export default function CalendarDayCell({
  day,
  variant = "empty",
  pnlUsd,
  trades,
  disabled = false,
  showTradeCount = true,
  showDailyPercent = false,
  dailyPercent,
}: Props) {


  const styles = {
    /* 🔘 Trade olmayan gün */
    empty: `
      bg-[#f8fafc]
      border border-slate-200
      shadow-[inset_0_1px_0_rgba(255,255,255,0.6)]
    `,

    /* 🟢 Pozitif gün */
    positive: `
  bg-emerald-100
border border-emerald-300
text-emerald-800

  shadow-[0_1px_2px_rgba(0,0,0,0.04)]
`,


    /* 🔴 Negatif gün */
    negative: `
  bg-rose-100
border border-rose-300
text-rose-800

  shadow-[0_1px_2px_rgba(0,0,0,0.04)]
`,


    /* ⚪ Ay dışı */
    disabled: `
      bg-white
      border border-slate-200
      text-slate-400
    `,
  };

  const appliedStyle = disabled
    ? styles.disabled
    : styles[variant];
const hoverBorder = disabled
  ? ""
  : variant === "positive"
  ? "hover:border-emerald-400"
  : variant === "negative"
  ? "hover:border-rose-400"
  : "hover:border-slate-300";



  return (
    <div
  className={`
    rounded-lg
    p-2
    h-full
    flex flex-col

    transition-colors
    duration-150

    ${appliedStyle}

    ${
      disabled
        ? "cursor-default"
        : `
            cursor-pointer
            ${hoverBorder}
          `
    }
  `}
>



      {/* 📅 GÜN NUMARASI */}
      <div
        className={`
          text-right
          text-[10px]
          font-medium
          ${
            disabled
              ? "text-slate-400"
              : "text-slate-700"
          }
        `}
      >
        {day}
      </div>

      {/* 📊 DATA */}
      {!disabled && variant !== "empty" && (
  <div className="flex-1 relative">
    
    {/* SAĞ ALT BLOK */}
    <div className="absolute bottom-1.5 right-1.5 text-right space-y-[3px]">

      {/* PNL */}
      <div
        className={`
          text-[13px]
          font-semibold
          leading-tight
          z-0
          ${
            variant === "positive"
              ? "text-slate-900"
              : variant === "negative"
              ? "text-slate-900"
              : "text-slate-800"
          }
        `}
      >
        {pnlUsd! >= 0 ? "+" : "-"}${Math.abs(Math.round(pnlUsd!)).toLocaleString()}
      </div>

      {/* TRADES */}
      {showTradeCount && (
  <div className="text-[10px] text-slate-600 leading-none">
    {trades} trades
  </div>
)}
{showDailyPercent && dailyPercent !== undefined && (
  <div
    className={`
      text-[10px]
      font-medium
      leading-none
      ${
        dailyPercent >= 0
          ? "text-emerald-700"
          : "text-rose-700"
      }
    `}
  >
    {dailyPercent >= 0 ? "+" : ""}
    {dailyPercent.toFixed(2)}%
  </div>
)}


    </div>
  </div>
)}

    </div>
  );
}
