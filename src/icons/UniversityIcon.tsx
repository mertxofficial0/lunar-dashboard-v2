export default function UniversityIcon({
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
      {/* TOP FACE */}
      <path
        d="M12 2.8L20 7.2L12 11.6L4 7.2L12 2.8Z"
        fill="url(#topFaceGradient)"
      />

      {/* LEFT FACE */}
      <path
        d="M4 7.2V15.2L12 19.6V11.6L4 7.2Z"
        fill="url(#leftFaceGradient)"
      />

      {/* RIGHT FACE */}
      <path
        d="M20 7.2V15.2L12 19.6V11.6L20 7.2Z"
        fill="url(#rightFaceGradient)"
      />

      {/* GRADIENTS */}
      <defs>
        {/* Top – soft highlight */}
        <linearGradient id="topFaceGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#E9D5FF" />
          <stop offset="100%" stopColor="#C4B5FD" />
        </linearGradient>

        {/* Left – deep shadow */}
        <linearGradient id="leftFaceGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#7C3AED" />
          <stop offset="100%" stopColor="#5B21B6" />
        </linearGradient>

        {/* Right – mid tone */}
        <linearGradient id="rightFaceGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#A78BFA" />
          <stop offset="100%" stopColor="#8B5CF6" />
        </linearGradient>
      </defs>
    </svg>
  );
}
