export default function LunarMark({
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
      {/* OUTER CIRCLE */}
      <circle
        cx="12"
        cy="12"
        r="9"
        stroke="url(#lunarGradient)"
        strokeWidth="2"
      />

      {/* INNER CUT */}
      <path
        d="M14.5 6.5
           A6 6 0 1 0 14.5 17.5
           A4.5 4.5 0 1 1 14.5 6.5Z"
        fill="#1c1a2e"
      />

      <defs>
        <linearGradient id="lunarGradient" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#E9D5FF" />
          <stop offset="100%" stopColor="#8B5CF6" />
        </linearGradient>
      </defs>
    </svg>
  );
}
