import React, { useMemo, useState, useEffect } from "react";
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
  trades: any[]; // FakeTrade[] (tipi karıştırmamak için any bıraktım)
  initialHtml: string;
  onClose: () => void;
  onSave: (html: string) => void;
}) {
  const [html, setHtml] = useState(initialHtml || "");

  useEffect(() => {
    if (open) setHtml(initialHtml || "");
  }, [open, initialHtml]);

  const stats = useMemo(() => {
    const totalTrades = trades.length;
    const winners = trades.filter((t) => t.pnlUsd > 0).length;
    const losers = trades.filter((t) => t.pnlUsd < 0).length;

    const commissionSigned = trades.reduce((s, t) => s + (t.feeUsd ?? 0), 0); // negatif
    const commissionAbs = Math.abs(commissionSigned);

    const net = trades.reduce((s, t) => s + (t.pnlUsd ?? 0), 0);
    const gross = trades.reduce((s, t) => s + ((t.pnlUsd ?? 0) - (t.feeUsd ?? 0)), 0);

    const winrate = totalTrades === 0 ? 0 : (winners / totalTrades) * 100;

    const grossProfit = trades.filter(t => t.pnlUsd > 0).reduce((s, t) => s + t.pnlUsd, 0);
    const grossLoss = Math.abs(trades.filter(t => t.pnlUsd < 0).reduce((s, t) => s + t.pnlUsd, 0));
    const profitFactor = grossLoss === 0 ? (grossProfit > 0 ? 99.99 : 0) : grossProfit / grossLoss;

    // senin sistemde volume = riskUsd toplamı gibi
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

  if (!open || !date) return null;

  return (
    <div className="fixed inset-0 z-[999]">
      {/* BACKDROP */}
      <button
        className="absolute inset-0 bg-black/30"
        onClick={onClose}
        aria-label="Close"
      />

      {/* MODAL */}
      <div
        className="
          absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2
          w-[1100px] max-w-[95vw] h-[90vh]
          bg-white rounded-2xl shadow-2xl
          overflow-hidden
        "
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER */}
        <div className="h-14 px-5 border-b border-slate-200 flex items-center justify-between">
          <div className="text-[16px] font-extrabold text-slate-900">Daily Log</div>

          <button
            onClick={onClose}
            className="h-9 w-9 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 flex items-center justify-center"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {/* TOP SUMMARY */}
        <div className="px-5 py-3 border-b border-slate-200">
          <div className="flex items-center gap-3 text-[13px]">
            <div className="font-semibold text-slate-700">{formatHeaderDate(date)}</div>
            <div className="text-slate-300">•</div>
            <div className={`font-extrabold ${positive ? "text-emerald-700" : "text-rose-700"}`}>
              Net P&amp;L {formatUsd(stats.net)}
            </div>
          </div>

          {/* Chart + stats row */}
          <div className="mt-3 grid grid-cols-12 gap-3 items-stretch">
            {/* mini chart placeholder (istersen burada DailySpark component koyarız) */}
            <div className="col-span-12 md:col-span-4 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-center">
              <div className="text-[12px] text-slate-500">
                Chart area (spark/cumulative)
              </div>
            </div>

            <div className="col-span-12 md:col-span-8 grid grid-cols-2 md:grid-cols-4 gap-3">
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
        <div className="h-[calc(90vh-56px-1px-120px)] px-5 py-4 overflow-y-auto">
          {/* HIZLI TEMPLATE BUTONLARI */}
          <div className="mb-3 flex flex-wrap gap-2">
            <TemplateBtn
              label="Insert Template"
              onClick={() => {
                const tpl = buildTemplateHtml();
                setHtml((prev) => (prev?.trim() ? prev : tpl));
              }}
            />
            <div className="text-[11px] text-slate-500 flex items-center">
              (İstersen template otomatik gelsin de yaparız)
            </div>
          </div>

          <RichTextEditorV2 valueHtml={html} onChangeHtml={setHtml} />
        </div>

        {/* FOOTER */}
        <div className="h-16 px-5 border-t border-slate-200 flex items-center justify-end gap-2">
          <button
            onClick={onClose}
            className="h-9 px-4 rounded-lg border border-slate-200 bg-white text-[13px] text-slate-700 hover:bg-slate-50"
          >
            Cancel
          </button>

          <button
            onClick={() => onSave(html)}
            className="
              h-9 px-4 rounded-lg
              text-[13px] text-white
              bg-gradient-to-b from-[#8d6cf0ff] to-[#7C3AED]
              hover:from-[#7f5fe6] hover:to-[#6D28D9]
            "
          >
            Save
          </button>
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
      <div className="text-[10px] text-slate-500 font-semibold uppercase tracking-wide">
        {label}
      </div>
      <div className={`text-[13px] tabular-nums ${strong ? "font-extrabold" : "font-semibold"} text-slate-900`}>
        {value}
      </div>
    </div>
  );
}

function TemplateBtn({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="h-8 px-3 rounded-lg border border-slate-200 bg-white text-[12px] text-slate-700 hover:bg-slate-50"
    >
      {label}
    </button>
  );
}

function buildTemplateHtml() {
  // TradeZella tarzı section’lı template
  return `
    <h2>🧠 Pre Market game Plan</h2>
    <p><b>Market</b></p>
    <ul>
      <li>News / events:</li>
      <li>Key levels:</li>
      <li>Bias:</li>
    </ul>
    <p><b>Watchlist</b></p>
    <ul>
      <li></li>
    </ul>

    <h2>🧾 Day Recap</h2>
    <p><b>Mistakes I made</b></p>
    <ul><li></li></ul>

    <p><b>What I did great</b></p>
    <ul><li></li></ul>

    <p><b>Reinforcement to myself</b></p>
    <ul><li></li></ul>

    <h2>📌 Overall Recap</h2>
    <ul>
      <li>1 lesson:</li>
      <li>1 action for tomorrow:</li>
    </ul>
  `;
}
