export default function NotebookIcon({
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
      {/* LEFT PAGE (BACK) */}
      <path
        d="M4.8 7.2L11.6 4.6V17.8L4.8 20.4V7.2Z"
        fill="url(#leftPageGradient)"
      />

      {/* RIGHT PAGE (FRONT) */}
      <path
        d="M11.6 4.6L19.8 7.2V20.4L11.6 17.8V4.6Z"
        fill="url(#rightPageGradient)"
      />

      {/* SPINE */}
      <rect
        x="11.2"
        y="5.2"
        width="1.2"
        height="12.2"
        rx="0.6"
        fill="url(#spineGradient)"
      />

      {/* GRADIENTS */}
      <defs>
        {/* Back page – darker */}
        <linearGradient id="leftPageGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f5cd7eff" />
          <stop offset="100%" stopColor="#8F6A1C" />
        </linearGradient>

        {/* Front page – lighter */}
        <linearGradient id="rightPageGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFE08A" />
          <stop offset="100%" stopColor="#F4C430" />
        </linearGradient>

        {/* Spine */}
        <linearGradient id="spineGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#c2a05bff" />
          <stop offset="100%" stopColor="#5E430F" />
        </linearGradient>
      </defs>
    </svg>
  );
}
