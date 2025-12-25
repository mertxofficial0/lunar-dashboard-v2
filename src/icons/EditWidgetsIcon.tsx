export default function EditWidgetsIcon({
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
      {/* PANEL (widget) */}
      <rect
        x="3"
        y="4"
        width="15"
        height="16"
        rx="4"
        fill="url(#panelGradient)"
      />

      {/* PANEL LINES – daha kalın */}
      <rect
        x="6"
        y="7"
        width="9"
        height="2.4"
        rx="1.2"
        fill="#FFFFFF"
        fillOpacity="0.95"
      />
      <rect
        x="6"
        y="11"
        width="7"
        height="2.4"
        rx="1.2"
        fill="#FFFFFF"
        fillOpacity="0.75"
      />

      {/* EDIT PENCIL – daha net silüet */}
      <path
        d="M14.8 13.8L19.2 9.4
           C19.6 9 19.6 8.4 19.2 8L17.9 6.7
           C17.5 6.3 16.9 6.3 16.5 6.7L12.1 11.1
           C11.9 11.3 11.8 11.6 11.7 11.9L11.3 14.6
           C11.2 15.1 11.6 15.5 12.1 15.4L14.8 15
           C15.1 14.9 15.4 14.8 15.6 14.6Z"
        fill="url(#pencilGradient)"
      />

      <defs>
        {/* PANEL GRADIENT – daha koyu */}
        <linearGradient id="panelGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#7C5CF5" />
          <stop offset="100%" stopColor="#6D28D9" />
        </linearGradient>

        {/* PENCIL GRADIENT – kontrastlı */}
        <linearGradient id="pencilGradient" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#4C1D95" />
          <stop offset="100%" stopColor="#312E81" />
        </linearGradient>
      </defs>
    </svg>
  );
}
