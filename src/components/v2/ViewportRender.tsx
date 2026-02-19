import { useEffect, useRef, useState } from "react";

export default function ViewportRender({
  children,
  height = 120,
  delay = 180,
}: {
  children: React.ReactNode;
  height?: number;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const hasRendered = useRef(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!ref.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];

        if (entry.isIntersecting && !hasRendered.current) {
          hasRendered.current = true;

          setTimeout(() => {
            setIsVisible(true);
          }, delay);

          observer.disconnect();
        }
      },
      {
        rootMargin: "0px",
        threshold: 0.15,
      }
    );

    observer.observe(ref.current);

    return () => observer.disconnect();
  }, [delay]);

  return (
    <div ref={ref} style={{ minHeight: height }}>
      {isVisible ? (
        children
      ) : (
        <div
          className="shimmer-skeleton rounded-lg"
          style={{ minHeight: height }}
        />
      )}
    </div>
  );
}
