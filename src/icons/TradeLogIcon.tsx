export default function TradeLogIcon({
  size = 23,
}: {
  size?: number;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* BACK CARD */}
      <rect
        x="1.5"
        y="1.5"
        width="21"
        height="21"
        rx="4"
        fill="#866d39ff"          /* koyu amber / premium zemin */
        fillOpacity="0.96"
      />

      {/* SOFT 3D SHINE */}
      <rect
        x="2"
        y="2"
        width="20"
        height="20"
        rx="4"
        fill="url(#logGlow)"
      />

      {/* LOG ITEM 1 */}
      <circle
        cx="7"
        cy="8"
        r="1.35"
        fill="#FACC15"          /* canlı sarı */
      />
      <rect
        x="9.5"
        y="7"
        width="8"
        height="2"
        rx="1"
        fill="#FDE68A"          /* soft sarı */
        fillOpacity="0.95"
      />

      {/* LOG ITEM 2 */}
      <circle
        cx="7"
        cy="12"
        r="1.35"
        fill="#EAB308"          /* koyu sarı */
        fillOpacity="0.95"
      />
      <rect
        x="9.5"
        y="11"
        width="8"
        height="2"
        rx="1"
        fill="#FDE68A"
        fillOpacity="0.75"
      />

      {/* LOG ITEM 3 */}
      <circle
        cx="7"
        cy="16"
        r="1.35"
        fill="#FACC15"
        fillOpacity="0.9"
      />
      <rect
        x="9.5"
        y="15"
        width="8"
        height="2"
        rx="1"
        fill="#FDE68A"
        fillOpacity="0.85"
      />

      {/* GRADIENT */}
      <defs>
        <linearGradient
          id="logGlow"
          x1="0"
          y1="0"
          x2="1"
          y2="1"
        >
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.18" />
          <stop offset="40%" stopColor="#ffffff" stopOpacity="0.05" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0.25" />
        </linearGradient>
      </defs>
    </svg>
  );
}
