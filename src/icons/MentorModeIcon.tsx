export default function MentorModeIcon({
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
        fill="url(#cardGrad)"
        fillOpacity="0.95"
      />

      {/* HEAD */}
      <circle
        cx="12"
        cy="9.4"
        r="2.7"
        fill="url(#headGrad)"
      />

      {/* BODY */}
      <path
        d="M7.4 18.6
           C7.4 15.8 9.4 14.1 12 14.1
           C14.6 14.1 16.6 15.8 16.6 18.6
           V19.4
           H7.4
           V18.6Z"
        fill="url(#bodyGrad)"
        fillOpacity="0.95"
      />

      {/* GRADIENTS */}
      <defs>
        {/* Card depth */}
        <linearGradient id="cardGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#814349ff" />
          <stop offset="100%" stopColor="#3a151eff" />
        </linearGradient>

        {/* Head highlight */}
        <linearGradient id="headGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FECACA" />
          <stop offset="100%" stopColor="#FB7185" />
        </linearGradient>

        {/* Body stronger red */}
        <linearGradient id="bodyGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#F87171" />
          <stop offset="100%" stopColor="#E11D48" />
        </linearGradient>
      </defs>
    </svg>
  );
}
