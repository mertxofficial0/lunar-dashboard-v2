export default function CurrentDollarIcon({
  size = 25,
}: {
  size?: number;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* ROUND BACKGROUND */}
      <circle cx="12" cy="12" r="10" fill="url(#bgGradient)" />

      {/* DOLLAR SYMBOL (TEXT, PERFECTLY CENTERED) */}
      <text
        x="12"
        y="12"
        textAnchor="middle"
        dominantBaseline="central"
        fontSize="14"
        fontWeight="500"
        fill="#FFFFFF"
        style={{
          fontFamily:
            "Inter, system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
        }}
      >
        $
      </text>

      <defs>
        <linearGradient id="bgGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#C4B5FD" />
          <stop offset="100%" stopColor="#6D28D9" />
        </linearGradient>
      </defs>
    </svg>
  );
}
