export default function ReportsIcon({
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
      {/* BACK CARD – BASE */}
      <rect
        x="1.5"
        y="1.5"
        width="21"
        height="21"
        rx="4"
        fill="url(#reportDark)"
        fillOpacity="0.95"
      />

      {/* PREMIUM 3D SHINE */}
      <rect
        x="1.5"
        y="1.5"
        width="21"
        height="21"
        rx="4"
        fill="url(#reportHighlight)"
        fillOpacity="0.7"
      />

      {/* PIE BASE (FLAT) */}
      <circle
        cx="12"
        cy="12"
        r="6.8"
        fill="#6dffc9ff"
        fillOpacity="0.28"
      />

      {/* PIE SLICE (FLAT) */}
      <path
        d="M12 5.2
           A6.8 6.8 0 0 1 18.8 12
           L12 12 Z"
        fill="#34D399"
        fillOpacity="0.95"
      />

      {/* GRADIENTS */}
      <defs>
        {/* Card base */}
        <linearGradient id="reportDark" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#155E4B" />
          <stop offset="100%" stopColor="#0B3B2E" />
        </linearGradient>

        {/* Card shine */}
        <linearGradient
          id="reportHighlight"
          x1="0"
          y1="0"
          x2="1"
          y2="1"
        >
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.18" />
          <stop offset="40%" stopColor="#ffffff" stopOpacity="0.05" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0.22" />
        </linearGradient>
      </defs>
    </svg>
  );
}
