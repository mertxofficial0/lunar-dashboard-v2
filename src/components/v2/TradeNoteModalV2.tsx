import { useEffect, useMemo, useState } from "react";


function formatHeaderDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
}

export default function TradeNoteModalV2({
  open,
  date,
  initialNote,
  onClose,
  onSave,
  onAddTrade,
}: {
  open: boolean;
  date: string | null; // YYYY-MM-DD
  initialNote?: string;
  onClose: () => void;
  onSave: (note: string) => void;
  onAddTrade?: () => void;
}) {
  const [note, setNote] = useState(initialNote ?? "");

  useEffect(() => {
    // modal açılınca seçili günün notunu yükle
    if (open) setNote(initialNote ?? "");
  }, [open, initialNote]);

  const title = useMemo(() => {
    if (!date) return "Trade Note";
    return `Trade Note — ${formatHeaderDate(date)}`;
  }, [date]);

  if (!open || !date) return null;

  return (
    <div className="fixed inset-0 z-[999]">
      {/* backdrop */}
      <button
        className="absolute inset-0 bg-black/30"
        onClick={onClose}
        aria-label="Close"
      />

      {/* panel */}
      <div className="absolute right-0 top-0 h-full w-[520px] max-w-[92vw] bg-white shadow-2xl">
        <div className="h-14 px-5 border-b border-slate-200 flex items-center justify-between">
          <div className="text-[13px] font-bold text-slate-900">{title}</div>
          <button
            onClick={onClose}
            className="px-3 py-1.5 rounded-lg border border-slate-200 text-[12px] text-slate-700 hover:bg-slate-50"
          >
            Close
          </button>
        </div>

        <div className="p-5 space-y-4">
          <div>
            <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide">
              Note
            </div>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Write your day note… (plan, execution, mistakes, lessons)"
              className="
                mt-2 w-full h-[240px]
                rounded-xl border border-slate-200
                px-4 py-3 text-[13px] text-slate-800
                outline-none focus:ring-2 focus:ring-violet-200
                resize-none
              "
            />
          </div>

          <div className="flex items-center justify-between">
            <button
              onClick={onAddTrade}
              className="
                h-9 px-3 rounded-lg
                border border-slate-200 bg-white
                text-[13px] text-slate-700 hover:bg-slate-50
              "
            >
              + Add Trade
            </button>

            <button
              onClick={() => onSave(note.trim())}
              className="
                h-9 px-4 rounded-lg
                text-[13px] text-white
                bg-gradient-to-b from-[#8d6cf0ff] to-[#7C3AED]
                hover:from-[#7f5fe6] hover:to-[#6D28D9]
              "
            >
              Save Note
            </button>
          </div>

          <div className="text-[11px] text-slate-500">
            Notes are saved locally (localStorage) for now.
          </div>
        </div>
      </div>
    </div>
  );
}
