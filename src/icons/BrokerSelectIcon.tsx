export default function BrokerSelectIcon({
  size = 18,
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
      {/* BRIEFCASE BODY */}
      <rect
        x="3"
        y="7"
        width="18"
        height="12"
        rx="3"
        fill="url(#caseGradient)"
      />

      {/* HANDLE */}
      <rect
        x="8"
        y="4"
        width="8"
        height="3"
        rx="1.5"
        fill="url(#handleGradient)"
      />

      <defs>
        <linearGradient id="caseGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#C4B5FD" />
          <stop offset="100%" stopColor="#7C6BE6" />
        </linearGradient>

        <linearGradient id="handleGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#A78BFA" />
          <stop offset="100%" stopColor="#6D28D9" />
        </linearGradient>
      </defs>
    </svg>
  );
}
