import { useEffect, useState } from "react";

type TradeWinGaugeProps = {
  win: number;
  breakeven: number;
  loss: number;
  small?: boolean;
};

export default function TradeWinGauge({
    
  win,
  breakeven,
  loss,
  small = false,
}: TradeWinGaugeProps) {
    const [animated, setAnimated] = useState(false);

useEffect(() => {
  const t = requestAnimationFrame(() => setAnimated(true));
  return () => cancelAnimationFrame(t);
}, []);

  const total = win + breakeven + loss;

  const winPct = (win / total) * 100;
  const bePct = (breakeven / total) * 100;
  const lossPct = (loss / total) * 100;

  const size = small ? 84 : 112;
  const stroke = small ? 6 : 8;
  const radius = (size - stroke) / 2;
  const circumference = Math.PI * radius;

  const winLen  = animated ? (winPct / 100) * circumference : 0;
const beLen   = animated ? (bePct / 100) * circumference : 0;
const lossLen = animated ? (lossPct / 100) * circumference : 0;


  return (
    <div className="flex flex-col items-center">
      {/* GAUGE (AYNEN KALDI) */}
      <svg
        width={size}
        height={size / 2}
        viewBox={`0 0 ${size} ${size / 2}`}
      >
        <g transform={`rotate(180 ${size / 2} ${size / 2})`}>
          {/* WIN */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="#10b981"
            strokeLinecap="butt"
            strokeWidth={stroke}
            strokeDasharray={`${winLen} ${circumference}`}
            strokeDashoffset={0}
            style={{
  transition: "stroke-dasharray 900ms ease, stroke-dashoffset 900ms ease",
}}
          />

          {/* BREAKEVEN */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="#94a3b8"
            strokeWidth={stroke}
            strokeDasharray={`${beLen} ${circumference}`}
            strokeDashoffset={-winLen}
            style={{
  transition: "stroke-dasharray 900ms ease, stroke-dashoffset 900ms ease",
}}
          />

          {/* LOSS */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="#f87171"
            strokeWidth={stroke}
            strokeDasharray={`${lossLen} ${circumference}`}
            strokeDashoffset={-(winLen + beLen)}
            style={{
  transition: "stroke-dasharray 900ms ease, stroke-dashoffset 900ms ease",
}}
          />
        </g>
      </svg>

      {/* STATS BADGES */}
<div className="mt-1 flex items-center gap-2">
  {/* WIN */}
  <div
    className="
      min-w-[18px]
      h-[13px]
      px-1
      rounded
      bg-emerald-200/40
      text-emerald-700
      text-[9px]
      font-semibold
      flex
      items-center
      justify-center
      tabular-nums
    "
  >
    {win}
  </div>

  {/* BREAKEVEN */}
  <div
    className="
      min-w-[18px]
      h-[13px]
      px-1
      rounded
      bg-slate-200/70
      text-slate-700
      text-[9px]
      font-semibold
      flex
      items-center
      justify-center
      tabular-nums
    "
  >
    {breakeven}
  </div>

  {/* LOSS */}
  <div
    className="
      min-w-[18px]
      h-[13px]
      px-1
      rounded
      bg-rose-200/40
      text-rose-700
      text-[9px]
      font-semibold
      flex
      items-center
      justify-center
      tabular-nums
    "
  >
    {loss}
  </div>
</div>


    </div>
  );
}