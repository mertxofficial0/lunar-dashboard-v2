export default function DashboardIcon({
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
      {/* TOP LEFT – WHITE */}
      <rect
        x="2.5"
        y="2.5"
        width="8"
        height="8"
        rx="9"
        fill="url(#dashWhite)"
        fillOpacity="0.95"
      />

      {/* TOP RIGHT – GRAY */}
      <rect
        x="13"
        y="2.5"
        width="8.5"
        height="8.5"
        rx="3"
        fill="url(#dashGray)"
        fillOpacity="0.9"
      />

      {/* BOTTOM LEFT – GRAY */}
      <rect
        x="2.5"
        y="13"
        width="8.5"
        height="8.5"
        rx="3"
        fill="url(#dashGray)"
        fillOpacity="0.9"
      />

      {/* BOTTOM RIGHT – WHITE */}
      <rect
        x="13.5"
        y="13.5"
        width="8"
        height="8"
        rx="9"
        fill="url(#dashWhite)"
        fillOpacity="0.95"
      />

      {/* GRADIENTS */}
      <defs>
        {/* WHITE CARD */}
        <linearGradient id="dashWhite" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="100%" stopColor="#E5E7EB" />
        </linearGradient>

        {/* GRAY CARD */}
        <linearGradient id="dashGray" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f3f4f67e" />
          <stop offset="100%" stopColor="#CBD5E1" />
        </linearGradient>
      </defs>
    </svg>
  );
}
