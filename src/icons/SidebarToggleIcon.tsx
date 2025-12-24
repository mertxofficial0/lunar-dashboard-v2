export default function SidebarToggleIcon({
  className = "w-6 h-6", // 👈 daha büyük
  collapsed = false,
}: {
  className?: string;
  collapsed?: boolean;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={`${className} transition-transform duration-200 ${
        collapsed ? "rotate-180" : ""
      }`}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="arrowGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#d1d5db" />
        </linearGradient>
      </defs>

      {/* DOUBLE CHEVRON – modern, özgür */}
      <path
        d="M14.5 6.8L9.8 12l4.7 5.2c.35.4.32 1-.08 1.35-.4.35-1 .32-1.35-.08L8 12.8a1.2 1.2 0 010-1.6l5.15-5.7c.35-.4.95-.43 1.35-.08.4.35.43.95.08 1.35z"
        fill="url(#arrowGrad)"
      />
    </svg>
  );
}
