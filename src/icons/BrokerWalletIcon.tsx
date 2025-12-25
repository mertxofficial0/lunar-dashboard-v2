export default function BrokerSelectIcon({
  size = 20,
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
        x="2"
        y="4"
        width="18"
        height="12"
        rx="3"
        fill="url(#cardBack)"
      />

      {/* FRONT CARD */}
      <rect
        x="4"
        y="6"
        width="18"
        height="12"
        rx="4"
        fill="url(#cardFront)"
      />

      {/* STATUS DOT */}
      <circle
        cx="17.5"
        cy="12"
        r="1.4"
        fill="#dbdbdbff"
      />

      {/* SOFT GLOSS */}
      <rect
        x="4"
        y="6"
        width="18"
        height="12"
        rx="3"
        fill="url(#cardShine)"
      />

      <defs>
        {/* BACK CARD */}
        <linearGradient id="cardBack" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#6D28D9" />
          <stop offset="100%" stopColor="#3B0764" />
        </linearGradient>

        {/* FRONT CARD */}
        <linearGradient id="cardFront" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#A78BFA" />
          <stop offset="100%" stopColor="#7C3AED" />
        </linearGradient>

        {/* SHINE */}
        <linearGradient id="cardShine" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.18" />
          <stop offset="45%" stopColor="#FFFFFF" stopOpacity="0.06" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0.22" />
        </linearGradient>
      </defs>
    </svg>
  );
}
