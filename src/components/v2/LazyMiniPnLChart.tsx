import { useEffect, useRef, useState } from "react";
import MiniNetPnLSparkV2 from "./MiniNetPnLSparkV2";
import type { FakeTrade } from "../../lib/fakeTrades";

export default function LazyMiniPnLChart({
  trades,
  height = 115,
}: {
  trades: FakeTrade[];
  height?: number;
}) {
  const ref = useRef<HTMLDivElement | null>(null);

  // chart bir kere render edildi mi?
  const [hasRendered, setHasRendered] = useState(false);
const shouldRender = trades.length > 0;

  useEffect(() => {
    if (hasRendered) return;

    const el = ref.current;
    if (!el) return;

    // Observer yoksa direkt render
    if (typeof IntersectionObserver === "undefined") {
      setHasRendered(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;

        // 🧠 bilinçli gecikme (algısal lazy)
        setTimeout(() => {
          if (el.offsetWidth > 0) {
            setHasRendered(true);
            observer.disconnect(); // ⛔ bir kere yeter
          }
        }, 180);
      },
      {
        threshold: 0.5,
        rootMargin: "0px 0px -120px 0px",
      }
    );

    observer.observe(el);

    return () => observer.disconnect();
  }, [hasRendered]);

  return (
    <div ref={ref} style={{ height }}>
      {/* 1️⃣ CHART (bir kere render olur, sonra hep kalır) */}
      {hasRendered && shouldRender && (
  <MiniNetPnLSparkV2 trades={trades} height={height} />
)}


      {/* 2️⃣ LOADING (chart gelene kadar HER ZAMAN VAR) */}
      {!hasRendered && (
        <div className="h-full rounded-lg border border-slate-200 bg-slate-50 flex flex-col items-center justify-center gap-2 animate-pulse">
          <div className="w-4 h-4 border-2 border-slate-300 border-t-slate-500 rounded-full animate-spin" />
          <div className="text-[10px] text-slate-500 font-medium">
            Updating chart…
          </div>
        </div>
      )}
    </div>
  );
}
