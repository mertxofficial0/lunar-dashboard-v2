export default function NotificationBellIcon({
  size = 25,
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
      {/* ROUND BG */}
      <circle cx="12" cy="12" r="10" fill="url(#bellBg)" />

      {/* BELL BODY (FILLED) */}
      <path
        d="M12 5.8
           C9.35 5.8 7.45 7.72 7.45 10.15
           V13.55
           C7.45 14.05 7.25 14.53 6.9 14.9
           L6.25 15.6
           C5.85 16.03 6.16 16.75 6.76 16.75
           H17.24
           C17.84 16.75 18.15 16.03 17.75 15.6
           L17.1 14.9
           C16.75 14.53 16.55 14.05 16.55 13.55
           V10.15
           C16.55 7.72 14.65 5.8 12 5.8Z"
        fill="#FFFFFF"
        fillOpacity="0.96"
      />

      {/* CLAPPER */}
      <path
        d="M10.25 17.25
           C10.45 18.35 11.35 19.2 12.5 19.2
           C13.65 19.2 14.55 18.35 14.75 17.25"
        fill="#FFFFFF"
        fillOpacity="0.96"
      />

      {/* SMALL HIGHLIGHT (SUBTLE) */}
      <path
        d="M9.1 10.05
           C9.1 8.35 10.45 7.15 12 7.15"
        stroke="#ffffffff"
        strokeOpacity="0.35"
        strokeWidth="1.4"
        strokeLinecap="round"
      />

      {/* NOTIFICATION DOT (TOP RIGHT) */}
      <circle
        cx="18.2"
        cy="6.7"
        r="2.25"
        fill="url(#dotGrad)"
        stroke="#FFFFFF"
        strokeOpacity="0.9"
        strokeWidth="1.2"
      />

      <defs>
        {/* PURPLE BG GRADIENT */}
        <linearGradient id="bellBg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#A78BFA" />
          <stop offset="100%" stopColor="#4C1D95" />
        </linearGradient>[#7c6be6]

        {/* DOT GRADIENT */}
        <linearGradient id="dotGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#51ff00ff" />
          <stop offset="100%" stopColor="#00b309ff" />
        </linearGradient>
      </defs>
    </svg>
  );
}
