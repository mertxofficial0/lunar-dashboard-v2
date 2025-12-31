import { useEffect, useState } from "react";

type AvgWinLossBarProps = {
  avgWinUsd: number;
  avgLossUsd: number;
};

export default function AvgWinLossBar({
  avgWinUsd,
  avgLossUsd,
}: AvgWinLossBarProps) {
  const win = Math.max(avgWinUsd, 0);
  const loss = Math.max(avgLossUsd, 0);
  const total = win + loss || 1;

  const targetWinPct = (win / total) * 100;
  const targetLossPct = (loss / total) * 100;

  // animasyonlu state
  const [winPct, setWinPct] = useState(0);
  const [lossPct, setLossPct] = useState(0);

  useEffect(() => {
    // ilk render + veri değişimi için
    const raf = requestAnimationFrame(() => {
      setWinPct(targetWinPct);
      setLossPct(targetLossPct);
    });

    return () => cancelAnimationFrame(raf);
  }, [targetWinPct, targetLossPct]);

  return (
    <div className="w-full">
      {/* BAR */}
      <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden flex">
        {/* WIN */}
        <div
          className="h-full bg-emerald-500"
          style={{
            width: `${winPct}%`,
            transition: "width 900ms ease",
          }}
        />

        {/* LOSS */}
        <div
          className="h-full bg-rose-400"
          style={{
            width: `${lossPct}%`,
            transition: "width 900ms ease",
          }}
        />
      </div>

      {/* LABELS (BOXED) */}
      <div className="mt-1 flex items-center justify-between tabular-nums">
        {/* WIN BOX */}
        <div className="
          min-w-[32px]
          h-[16px]
          px-1.5
          rounded
          bg-emerald-200/50
          text-emerald-700
          text-[11px]
          font-semibold
          flex
          items-center
          justify-center
        ">
          +${Math.round(win).toLocaleString()}
        </div>

        {/* LOSS BOX */}
        <div className="
          min-w-[32px]
          h-[16px]
          px-1.5
          rounded
          bg-rose-200/50
          text-rose-700
          text-[11px]
          font-semibold
          flex
          items-center
          justify-center
        ">
          -${Math.round(loss).toLocaleString()}
        </div>
      </div>
    </div>
  );
}