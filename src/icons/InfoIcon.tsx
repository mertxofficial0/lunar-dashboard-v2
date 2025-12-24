export default function InfoIcon({
  size = 17,
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
      {/* OUTER CIRCLE */}
      <circle
        cx="12"
        cy="12"
        r="10"
        fill="url(#infoDark)"
      />

      {/* DOT – daha yuvarlak */}
      <circle
        cx="12"
        cy="7.3"
        r="1"
        fill="white"
      />

      {/* BODY – daha ince & oval */}
      <rect
        x="11.25"
        y="11"
        width="1.5"
        height="6"
        rx="0.75"
        fill="white"
      />

      <defs>
        {/* Dark premium gradient */}
        <linearGradient id="infoDark" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#262b36ff" /> {/* gray-900 */}
          <stop offset="100%" stopColor="#1b0435ff" /> {/* near black */}
        </linearGradient>
      </defs>
    </svg>
  );
}
