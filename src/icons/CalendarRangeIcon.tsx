export default function CalendarRangeIcon({
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
      {/* MAIN BODY */}
      <rect
        x="3.5"
        y="4.5"
        width="17"
        height="16"
        rx="4"
        fill="url(#calBody)"
      />

      {/* TOP BAR */}
      <rect
        x="3.5"
        y="4.5"
        width="17"
        height="4"
        rx="4"
        fill="url(#calTop)"
      />

      {/* RINGS */}
      <rect x="7.5" y="2.8" width="2" height="3.8" rx="1" fill="#E9D5FF" />
      <rect x="14.5" y="2.8" width="2" height="3.8" rx="1" fill="#E9D5FF" />

      {/* DATE GRID (takvim hissi buradan geliyor) */}
      <rect x="8" y="10" width="2.6" height="2.4" rx="0.8" fill="#e9e9e9ff" />
      <rect x="13" y="10" width="2.6" height="2.4" rx="0.8" fill="#e9e9e9ff" />
     

      <rect x="8" y="14" width="2.6" height="2.4" rx="0.8" fill="#e9e9e9ff" />
      <rect x="13" y="14" width="2.6" height="2.4" rx="0.8" fill="#e9e9e9ff" />
      

      {/* SOFT DEPTH */}
      <rect
        x="3.5"
        y="4.5"
        width="17"
        height="16"
        rx="4"
        fill="url(#calDepth)"
      />

      <defs>
        <linearGradient id="calBody" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#7C3AED" />
          <stop offset="100%" stopColor="#4C1D95" />
        </linearGradient>

        <linearGradient id="calTop" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#C4B5FD" />
          <stop offset="100%" stopColor="#8B5CF6" />
        </linearGradient>

        <linearGradient id="calDepth" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.16" />
          <stop offset="100%" stopColor="#000000ff" stopOpacity="0.22" />
        </linearGradient>
      </defs>
    </svg>
  );
}
