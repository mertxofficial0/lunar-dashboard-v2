export default function DailyJournalIcon({
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
      {/* LEFT BAR */}
      <rect
        x="3"
        y="12.4"
        width="4.3"
        height="9"
        rx="1.8"
        fill="url(#mintDark)"
        fillOpacity="0.95"
      />

      {/* MIDDLE BAR */}
      <rect
        x="10.2"
        y="3.2"
        width="4.3"
        height="18.5"
        rx="1.8"
        fill="url(#mintLight)"
        fillOpacity="0.9"
      />

      {/* RIGHT BAR */}
      <rect
        x="17.5"
        y="8.6"
        width="4.3"
        height="13"
        rx="1.8"
        fill="url(#mintDark)"
        fillOpacity="0.9"
      />

      {/* BASE LINE */}
      <rect
        x="1.4"
        y="20.5"
        width="21.2"
        height="2"
        rx="0.8"
        fill="url(#mintLight)"
        fillOpacity="0.95"
      />

      {/* GRADIENTS */}
      <defs>
        {/* Dark mint gradient */}
        <linearGradient
          id="mintDark"
          x1="0"
          y1="0"
          x2="0"
          y2="1"
        >
          <stop offset="0%" stopColor="#3B7C77" />
          <stop offset="100%" stopColor="#1F4F4B" />
        </linearGradient>

        {/* Light mint gradient */}
        <linearGradient
          id="mintLight"
          x1="0"
          y1="0"
          x2="0"
          y2="1"
        >
          <stop offset="0%" stopColor="#7FF3E1" />
          <stop offset="100%" stopColor="#34D399" />
        </linearGradient>
      </defs>
    </svg>
  );
}
