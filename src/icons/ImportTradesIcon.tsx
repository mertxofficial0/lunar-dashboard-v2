export default function ImportTradesIcon({
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
      {/* STEM */}
      <rect
        x="10.5"
        y="6"
        width="3"
        height="10"
        rx="1.5"
        fill="white"
      />

      {/* ARROW HEAD */}
      <path
  transform="translate(0 1.5)"
  d="M6.8 12.8
     C6.3 12.3 6.3 11.5 6.8 11
     C7.3 10.5 8.1 10.5 8.6 11
     L12 14.4
     L15.4 11
     C15.9 10.5 16.7 10.5 17.2 11
     C17.7 11.5 17.7 12.3 17.2 12.8
     L12.9 17.1
     C12.4 17.6 11.6 17.6 11.1 17.1
     L6.8 12.8Z"
  fill="white"
/>

    </svg>
  );
}
