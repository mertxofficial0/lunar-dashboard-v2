export default function InsightsIcon({
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
      {/* BULB BODY */}
      <path
        d="M12 2.4
           C7.9 2.4 4.8 5.5 4.8 9.3
           C4.8 12 6.2 14.1 8.2 15.4
           C9.1 16 9.6 16.8 9.6 17.8
           V18.4
           H14.4
           V17.8
           C14.4 16.8 14.9 16 15.8 15.4
           C17.8 14.1 19.2 12 19.2 9.3
           C19.2 5.5 16.1 2.4 12 2.4Z"
        fill="url(#bulbGradient)"
      />

      {/* FILAMENT */}
      <path
        d="M9.6 11.4
           C10.4 12.1 11.2 12.4 12 12.4
           C12.8 12.4 13.6 12.1 14.4 11.4"
        stroke="url(#filamentGradient)"
        strokeWidth="1.6"
        strokeLinecap="round"
      />

      {/* BASE */}
      <rect
        x="9.4"
        y="18.6"
        width="5.2"
        height="2.2"
        rx="1.1"
        fill="url(#baseGradient)"
      />

      <rect
        x="10"
        y="21"
        width="4"
        height="1.4"
        rx="0.7"
        fill="url(#baseGradient)"
        fillOpacity="0.85"
      />

      {/* GRADIENTS */}
      <defs>
        {/* Bulb main */}
        <linearGradient id="bulbGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#BAE6FD" />
          <stop offset="100%" stopColor="#38BDF8" />
        </linearGradient>

        {/* Filament */}
        <linearGradient id="filamentGradient" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#0284C7" />
          <stop offset="100%" stopColor="#0369A1" />
        </linearGradient>

        {/* Base */}
        <linearGradient id="baseGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0369A1" />
          <stop offset="100%" stopColor="#075985" />
        </linearGradient>
      </defs>
    </svg>
  );
}
