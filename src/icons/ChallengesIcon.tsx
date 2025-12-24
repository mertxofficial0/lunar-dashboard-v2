export default function ChallengesIcon({
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
      {/* LEFT HANDLE (BEHIND CUP) */}
      <path
        d="M7 6.2H4.8C4.8 9 6.2 10.6 8.4 11"
        stroke="url(#handleGradient)"
        strokeWidth="1.6"
        strokeLinecap="round"
      />

      {/* RIGHT HANDLE (BEHIND CUP) */}
      <path
        d="M17 6.2H19.2C19.2 9 17.8 10.6 15.6 11"
        stroke="url(#handleGradient)"
        strokeWidth="1.6"
        strokeLinecap="round"
      />

      {/* CUP BODY (ON TOP OF HANDLES) */}
      <path
        d="M7 4.5H17V9.8C17 12.7 14.9 14.8 12 14.8C9.1 14.8 7 12.7 7 9.8V4.5Z"
        fill="url(#cupGradient)"
      />

      {/* STEM */}
      <rect
        x="10.6"
        y="14.8"
        width="2.8"
        height="3.2"
        rx="1.2"
        fill="#D97706"
        fillOpacity="0.9"
      />

      {/* BASE */}
      <rect
        x="8.4"
        y="18.4"
        width="7.2"
        height="2"
        rx="1"
        fill="#B45309"
        fillOpacity="0.95"
      />

      {/* GRADIENTS */}
      <defs>
        <linearGradient id="cupGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FDE68A" />
          <stop offset="100%" stopColor="#F59E0B" />
        </linearGradient>

        <linearGradient id="handleGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FBBF24" />
          <stop offset="100%" stopColor="#D97706" />
        </linearGradient>
      </defs>
    </svg>
  );
}
