import { useEffect, useState } from "react";

type ProfitFactorGaugeProps = {
  value: number;   // profit factor
  small?: boolean;
};

export default function ProfitFactorGauge({
  value,
  small = true,
}: ProfitFactorGaugeProps) {
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    const t = requestAnimationFrame(() => setAnimated(true));
    return () => cancelAnimationFrame(t);
  }, []);

  /* =========================
     ÖLÇÜLER (WIN GAUGE İLE AYNI DİL)
  ========================= */

  const size = small ? 58 : 80;
  const stroke = small ? 6 : 8;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;

  /* =========================
     PROFIT FACTOR → YÜZDE
  ========================= */

  const MAX_PF = 2.5;
  const clamped = Math.min(Math.max(value, 0), MAX_PF);
  const winPct = (clamped / MAX_PF) * 100;
  const lossPct = 100 - winPct;

  /* =========================
     ANİMASYON (AYNI MODEL)
  ========================= */

  const winLen  = animated ? (winPct / 100) * circumference : 0;
  const lossLen = animated ? (lossPct / 100) * circumference : 0;

  return (
    <div className="flex flex-col items-center">
      {/* DONUT – TAM DAİRE */}
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
      >
        <g transform={`rotate(-90 ${size / 2} ${size / 2})`}>
          {/* WIN (GREEN) */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="#10b981"
            strokeWidth={stroke}
            strokeLinecap="butt"
            strokeDasharray={`${winLen} ${circumference}`}
            strokeDashoffset={0}
            style={{
              transition:
                "stroke-dasharray 900ms ease, stroke-dashoffset 900ms ease",
            }}
          />

          {/* LOSS (RED) */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="#f87171"
            strokeWidth={stroke}
            strokeDasharray={`${lossLen} ${circumference}`}
            strokeDashoffset={-winLen}
            style={{
              transition:
                "stroke-dasharray 900ms ease, stroke-dashoffset 900ms ease",
            }}
          />
        </g>
      </svg>
    </div>
  );
}
