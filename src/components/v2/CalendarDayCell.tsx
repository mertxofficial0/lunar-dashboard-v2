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
    /* 🔘 Trade olmayan gün */
    empty: `
      bg-[#f8fafc]
      border border-slate-200
      shadow-[inset_0_1px_0_rgba(255,255,255,0.6)]
    `,

    /* 🟢 Pozitif gün */
    positive: `
      bg-[#c8ffed]
      border border-emerald-300
      shadow-[0_2px_6px_rgba(16,185,129,0.25)]
      
    `,

    /* 🔴 Negatif gün */
    negative: `
      bg-[#ffdfdf]
      border border-rose-300
      shadow-[0_2px_6px_rgba(244,63,94,0.25)]
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
  : "hover:border-slate-300s";

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
        <div className="flex-1 flex flex-col items-center justify-center">
          <div
  className={`
    text-sm
    font-semibold
    ${
      variant === "positive"
        ? "text-emerald-700"
        : variant === "negative"
        ? "text-rose-700"
        : "text-slate-700"
    }
  `}
>
  ${Math.round(pnlUsd ?? 0).toLocaleString()}
</div>

          <div className="text-[10px] text-slate-600">
            {trades} trades
          </div>
        </div>
      )}
    </div>
  );
}
