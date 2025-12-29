import { useEffect, useState } from "react";

type DayWinGaugeProps = {
  win: number;
  breakeven: number;
  loss: number;
  small?: boolean;
};

export default function DayWinGauge({
  win,
  breakeven,
  loss,
  small = false,
}: DayWinGaugeProps) {
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    const t = requestAnimationFrame(() => setAnimated(true));
    return () => cancelAnimationFrame(t);
  }, []);

  const total = win + breakeven + loss;

  const winPct = total ? (win / total) * 100 : 0;
  const bePct = total ? (breakeven / total) * 100 : 0;
  const lossPct = total ? (loss / total) * 100 : 0;

  const size = small ? 90 : 120;
  const stroke = small ? 7 : 9;
  const radius = (size - stroke) / 2;
  const circumference = Math.PI * radius;

  const winLen  = animated ? (winPct / 100) * circumference : 0;
  const beLen   = animated ? (bePct / 100) * circumference : 0;
  const lossLen = animated ? (lossPct / 100) * circumference : 0;

  return (
    <div className="flex flex-col items-center">
      <svg
        width={size}
        height={size / 2}
        viewBox={`0 0 ${size} ${size / 2}`}
      >
        <g transform={`rotate(180 ${size / 2} ${size / 2})`}>
          {/* WIN DAY */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="#34d399"
            strokeLinecap="round"
            strokeWidth={stroke}
            strokeDasharray={`${winLen} ${circumference}`}
            strokeDashoffset={0}
            style={{ transition: "stroke-dasharray 900ms ease" }}
          />

          {/* BREAKEVEN DAY */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="#94a3b8"
            strokeWidth={stroke}
            strokeDasharray={`${beLen} ${circumference}`}
            strokeDashoffset={-winLen}
            style={{ transition: "stroke-dasharray 900ms ease" }}
          />

          {/* LOSS DAY */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="#f87171"
            strokeWidth={stroke}
            strokeDasharray={`${lossLen} ${circumference}`}
            strokeDashoffset={-(winLen + beLen)}
            style={{ transition: "stroke-dasharray 900ms ease" }}
          />
        </g>
      </svg>

      {/* DAY BADGES */}
      <div className="mt-1 flex items-center gap-2">
        <div className="min-w-[18px] h-[14px] px-1 rounded bg-emerald-200/40 text-emerald-700 text-[10px] font-semibold flex items-center justify-center">
          {win}
        </div>
        <div className="min-w-[18px] h-[14px] px-1 rounded bg-slate-200/70 text-slate-700 text-[10px] font-semibold flex items-center justify-center">
          {breakeven}
        </div>
        <div className="min-w-[18px] h-[14px] px-1 rounded bg-rose-200/40 text-rose-700 text-[10px] font-semibold flex items-center justify-center">
          {loss}
        </div>
      </div>
    </div>
  );
}
