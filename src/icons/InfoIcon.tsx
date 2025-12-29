type InfoIconProps = {
  size?: number;
  className?: string;
};

export default function InfoIcon({
  size = 17,
  className = "",
}: InfoIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* OUTER CIRCLE */}
      <circle
        cx="12"
        cy="12"
        r="10"
        fill="url(#infoDark)"
      />

      {/* DOT */}
      <circle
        cx="12"
        cy="7.3"
        r="1"
        fill="white"
      />

      {/* BODY */}
      <rect
        x="11.25"
        y="11"
        width="1.5"
        height="6"
        rx="0.75"
        fill="white"
      />

      <defs>
        <linearGradient id="infoDark" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#262b36ff" />
          <stop offset="100%" stopColor="#1b0435ff" />
        </linearGradient>
      </defs>
    </svg>
  );
}
