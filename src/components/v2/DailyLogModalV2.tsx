import React, { useMemo, useState, useEffect, useRef } from "react";
import RichTextEditorV2 from "./RichTextEditorV2";

function formatHeaderDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
}

function formatUsd(v: number) {
  const abs = Math.abs(v).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return v < 0 ? `-$${abs}` : `$${abs}`;
}



export default function DailyLogModalV2({
  open,
  date,
  trades,
  initialHtml,
  onClose,
  onSave,
}: {
  open: boolean;
  date: string | null; // YYYY-MM-DD
  trades: any[]; // FakeTrade[]
  initialHtml: string;
  onClose: () => void;
  onSave: (html: string) => void;
}) {
  const [html, setHtml] = useState(initialHtml || "");

  // autosave UI state
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved">("idle");
  const saveTimer = useRef<number | null>(null);
useEffect(() => {
  const el = document.getElementById("app-scroll-container");
  if (!el) return;

  if (open) {
    el.style.overflow = "hidden";
  } else {
    el.style.overflow = "";
  }

  return () => {
    el.style.overflow = "";
  };
}, [open]);

  // modal açılınca initial’i bas
  useEffect(() => {
    if (!open) return;
    setHtml(initialHtml || "");
    setSaveState("idle");
  }, [open, initialHtml]);

  const stats = useMemo(() => {
    const totalTrades = trades.length;
    const winners = trades.filter((t) => t.pnlUsd > 0).length;
    const losers = trades.filter((t) => t.pnlUsd < 0).length;

    const commissionSigned = trades.reduce((s, t) => s + (t.feeUsd ?? 0), 0);
    const commissionAbs = Math.abs(commissionSigned);

    const net = trades.reduce((s, t) => s + (t.pnlUsd ?? 0), 0);
    const gross = trades.reduce((s, t) => s + ((t.pnlUsd ?? 0) - (t.feeUsd ?? 0)), 0);

    const winrate = totalTrades === 0 ? 0 : (winners / totalTrades) * 100;

    const grossProfit = trades.filter((t) => t.pnlUsd > 0).reduce((s, t) => s + t.pnlUsd, 0);
    const grossLoss = Math.abs(trades.filter((t) => t.pnlUsd < 0).reduce((s, t) => s + t.pnlUsd, 0));
    const profitFactor = grossLoss === 0 ? (grossProfit > 0 ? 99.99 : 0) : grossProfit / grossLoss;

    const volume = trades.reduce((s, t) => s + (t.riskUsd ?? 0), 0);

    return {
      totalTrades,
      winners,
      losers,
      gross,
      net,
      commissionAbs,
      winrate,
      volume,
      profitFactor,
    };
  }, [trades]);

  const positive = (stats.net ?? 0) >= 0;

  // ✅ AUTOSAVE: html değişince 800ms sonra kaydet
  useEffect(() => {
    if (!open || !date) return;

    // initialHtml ile aynıysa autosave'e gerek yok
    if ((html || "") === (initialHtml || "")) {
      setSaveState("idle");
      return;
    }

    setSaveState("saving");

    if (saveTimer.current) window.clearTimeout(saveTimer.current);

    saveTimer.current = window.setTimeout(() => {
      // boşsa yine kaydedelim (senin parent saveLog boşsa siler)
      onSave(html);
      setSaveState("saved");

      // 1.2sn sonra “saved” yazısını idle’a çek
      window.setTimeout(() => setSaveState("idle"), 1200);
    }, 800);

    return () => {
      if (saveTimer.current) window.clearTimeout(saveTimer.current);
    };
  }, [html, open, date, initialHtml, onSave]);

  if (!open || !date) return null;

  return (
    <div className="fixed inset-0 z-[999]">
      {/* BACKDROP */}
      <button className="absolute inset-0 bg-black/50" onClick={onClose} aria-label="Close" />

      {/* MODAL */}
      <div
  className="
    absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2
    w-[900px] max-w-[95vw] h-[90vh]
    bg-white rounded-2xl shadow-2xl
    overflow-hidden
    flex flex-col
  "


        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER */}
        <div className="h-12 px-1.5 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-3 ml-2">

            <div className="text-[16px] font-extrabold text-slate-900">Daily Log</div>

            {/* SAVE STATE BADGE */}
            <div
              className={`
                text-[10px] px-1 py-0.5
 font-medium px-2 py-1 rounded-md border
                ${
                  saveState === "saving"
                    ? "bg-amber-50 text-amber-700 border-amber-200"
                    : saveState === "saved"
                    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                    : "bg-slate-50 text-slate-600 border-slate-200"
                }
              `}
            >
              {saveState === "saving" ? "Saving..." : saveState === "saved" ? "Saved ✓" : "Autosave"}
            </div>
          </div>

          <button
            onClick={onClose}
            className="cursor-pointer h-9 w-9 rounded-lg text-slate-700 hover:bg-slate-100 flex items-center justify-center"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {/* TOP SUMMARY */}
<div className="px-3 py-3">

          <div className="flex items-center gap-3 text-[13px]">
            <div className="font-semibold text-slate-700">{formatHeaderDate(date)}</div>
            <div className="text-slate-300">•</div>
            <div className={`font-extrabold ${positive ? "text-emerald-700" : "text-rose-700"}`}>
              Net P&amp;L {formatUsd(stats.net)}
            </div>
          </div>

          <div className="mt-2 grid grid-cols-12 gap-2.5 items-stretch">
            <div className="col-span-12 md:col-span-4 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-center">
              <div className="text-[12px] text-slate-500">Chart area (spark/cumulative)</div>
            </div>

            <div className="col-span-12 md:col-span-8 grid grid-cols-2 md:grid-cols-4 gap-2.5">
              <TopStat label="Total Trades" value={stats.totalTrades} />
              <TopStat label="Winners" value={stats.winners} />
              <TopStat label="Losers" value={stats.losers} />
              <TopStat label="Winrate" value={`${stats.winrate.toFixed(2)}%`} />
              <TopStat label="Gross P&L" value={formatUsd(stats.gross)} strong />
              <TopStat label="Commissions" value={`$${stats.commissionAbs.toFixed(2)}`} />
              <TopStat label="Volume" value={Math.round(stats.volume).toLocaleString("en-US")} />
              <TopStat label="Profit Factor" value={stats.profitFactor.toFixed(2)} />
            </div>
          </div>
        </div>

       {/* BODY */}
<div className="flex-1 min-h-0 flex flex-col px-3 pb-3">

  {/* EDITOR */}
  <div className="flex-1 min-h-0">
    <RichTextEditorV2
      valueHtml={html}
      onChangeHtml={setHtml}
    />
  </div>

</div>


        
      </div>
    </div>
  );
}

function TopStat({
  label,
  value,
  strong,
}: {
  label: string;
  value: React.ReactNode;
  strong?: boolean;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white px-3 py-2">
      <div className="text-[10px] text-slate-500 font-semibold uppercase tracking-wide">{label}</div>
      <div className={`text-[13px] tabular-nums ${strong ? "font-extrabold" : "font-semibold"} text-slate-900`}>
        {value}
      </div>
    </div>
  );
}




