export default function TradeReplayIcon({
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
      {/* OUTER REPLAY ARC */}
      <path
        d="M12 4.4
           C7.7 4.4 4.4 7.7 4.4 12
           C4.4 16.3 7.7 19.6 12 19.6
           C14.6 19.6 16.9 18.4 18.3 16.6"
        stroke="url(#arcGradient)"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* ARROW HEAD */}
      <path
        d="M18.1 14.9
           L20.1 16.6
           L17.1 17.1
           Z"
        fill="url(#arcGradient)"
      />

      {/* PLAY TRIANGLE (SOFT) */}
      <path
        d="M10.4 8.9
           C10.4 8.3 11.0 8.0 11.5 8.3
           L15.6 11.1
           C16.1 11.4 16.1 12.6 15.6 12.9
           L11.5 15.7
           C11.0 16.0 10.4 15.7 10.4 15.1
           V8.9Z"
        fill="url(#playGradient)"
      />

      {/* GRADIENTS */}
      <defs>
        <linearGradient id="arcGradient" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FCE7F3" />
          <stop offset="100%" stopColor="#EC4899" />
        </linearGradient>

        <linearGradient id="playGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#F472B6" />
          <stop offset="100%" stopColor="#BE185D" />
        </linearGradient>
      </defs>
    </svg>
  );
}
