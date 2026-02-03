import React, { useMemo, useState, useCallback } from "react";

import CalendarMiniV2 from "./CalendarMiniV2";

import DailyLogModalV2 from "./DailyLogModalV2";

import MiniPnLAreaLite from "./MiniPnLAreaLite";

import { fakeTrades } from "../../lib/fakeTrades";


/* ======================
   HELPERS
====================== */

function calcDuration(openTime: string, closeTime: string) {
  const open = new Date(openTime.replace(" ", "T"));
  const close = new Date(closeTime.replace(" ", "T"));

  const diffMs = close.getTime() - open.getTime();
  if (diffMs <= 0) return "--";

  const totalSeconds = Math.floor(diffMs / 1000);

  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  // 1️⃣ Saat varsa → sadece saat + dakika
  if (hours > 0) {
    return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
  }

  // 2️⃣ Saat yok, dakika varsa → dakika + saniye
  if (minutes > 0) {
    return `${minutes}m ${seconds}s`;
  }

  // 3️⃣ Sadece saniye
  return `${seconds}s`;
}



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

function formatNum(v: number) {
  return v.toLocaleString("en-US");
}
function calcTradeNetRoiPct(t: any) {
  const before = t?.account?.equityBefore ?? 0;
  const after = t?.account?.equityAfter ?? 0;

  if (!before || before <= 0) return null;

  return ((after - before) / before) * 100;
}

function formatPct(v: number) {
  const sign = v >= 0 ? "+" : "";
  return `${sign}${v.toFixed(2)}%`;
}

type DayGroup = {
  date: string; // YYYY-MM-DD
  netPnl: number;
  tradeCount: number;
  winners: number;
  losers: number;
  breakeven: number;
};

function groupTradesByDay(trades: typeof fakeTrades): DayGroup[] {
  const map: Record<string, DayGroup> = {};

  for (const t of trades) {
    if (!map[t.date]) {
      map[t.date] = {
        date: t.date,
        netPnl: 0,
        tradeCount: 0,
        winners: 0,
        losers: 0,
        breakeven: 0,
      };
    }
    map[t.date].netPnl += t.pnlUsd;
    map[t.date].tradeCount += 1;

    if (t.result === "win") map[t.date].winners += 1;
    if (t.result === "loss") map[t.date].losers += 1;
    if (t.result === "breakeven") map[t.date].breakeven += 1;
  }

  return Object.values(map).sort((a, b) => b.date.localeCompare(a.date));
}

/* ======================
   PAGE
====================== */
export default function DailyJournalV2() {
  
  // Calendar: always first day of month
  const [calendarDate, setCalendarDate] = useState(() => {
    const d = new Date();
    d.setDate(1);
    return d;
  });

  const selectedYear = calendarDate.getFullYear();
  const selectedMonth = calendarDate.getMonth();

  const monthTrades = useMemo(() => {
    return fakeTrades.filter((t) => {
      const d = new Date(t.date);
      return d.getFullYear() === selectedYear && d.getMonth() === selectedMonth;
    });
  }, [selectedYear, selectedMonth]);

  const dayGroups = useMemo(() => groupTradesByDay(monthTrades), [monthTrades]);

  // Fast index: tradesByDay
  const tradesByDay = useMemo(() => {
    const map: Record<string, typeof fakeTrades> = {};
    for (const t of monthTrades) {
      (map[t.date] ||= []).push(t);
    }
    // Optional: stable order in day (by closeTime if exists)
    for (const k of Object.keys(map)) {
      map[k].sort((a, b) => {
        const at = a.raw?.closeTime ? new Date(a.raw.closeTime).getTime() : 0;
        const bt = b.raw?.closeTime ? new Date(b.raw.closeTime).getTime() : 0;
        return bt - at;
      });
    }
    return map;
  }, [monthTrades]);

  // Controlled accordion state (corporate behavior)
  const [openDays, setOpenDays] = useState<Record<string, boolean>>({});

  const toggleDay = useCallback((date: string) => {
  // 1️⃣ UI ANINDA tepki verir
  setOpenDays((p) => ({ ...p, [date]: !p[date] }));

  // 2️⃣ ağır işler bir frame SONRA
  requestAnimationFrame(() => {
    // boş bırakıyoruz ama React burada rahatlıyor
  });
}, []);


  const expandAll = useCallback(() => {
    const next: Record<string, boolean> = {};
    dayGroups.forEach((d) => (next[d.date] = true));
    setOpenDays(next);
  }, [dayGroups]);

  const collapseAll = useCallback(() => setOpenDays({}), []);
// ===== DAILY LOG NOTES (HTML) =====
const NOTES_KEY = "daily_log_html_v2";
type NotesMap = Record<string, string>; // { "YYYY-MM-DD": "<p>...</p>" }

const [notes, setNotes] = useState<NotesMap>(() => {
  try {
    const raw = localStorage.getItem(NOTES_KEY);
    return raw ? (JSON.parse(raw) as NotesMap) : {};
  } catch {
    return {};
  }
});

const persistNotes = useCallback((next: NotesMap) => {
  setNotes(next);
  try {
    localStorage.setItem(NOTES_KEY, JSON.stringify(next));
  } catch {}
}, []);

const [logOpen, setLogOpen] = useState(false);
const [activeDate, setActiveDate] = useState<string | null>(null);

const openLogForDay = useCallback((date: string) => {
  setLogOpen(true); // pencere ANINDA açılır

  // içeriği bir tık sonra yükle
  requestAnimationFrame(() => {
    setActiveDate(date);
  });
}, []);


const closeLog = useCallback(() => {
  // 1️⃣ GÖZDEN ANINDA KAYBOLUR
  setLogOpen(false);

  // 2️⃣ AĞIR TEMİZLİK SONRA
  setTimeout(() => {
    setActiveDate(null);
  }, 120);
}, []);


const saveLog = useCallback(
  (html: string) => {
    if (!activeDate) return;

    const next = { ...notes };

    // boşsa sil (text'e çevirip trim)
    const plain = (html || "").replace(/<[^>]*>/g, "").trim();
    if (!plain) delete next[activeDate];
    else next[activeDate] = html;

    persistNotes(next);
    
  },
  [activeDate, notes, persistNotes, closeLog]
);




  // Top summary (optional)
  const monthNet = useMemo(
    () => monthTrades.reduce((a, t) => a + t.pnlUsd, 0),
    [monthTrades]
  );

  return (
    <div className="w-full overflow-x-hidden">
      


      {/* PAGE BG */}
      <div className="bg-[#F5F6F8] p-4">
        {/* TOP ROW */}
        <div className="mb-3 -mt-1 flex items-center justify-between">
          <div className="flex items-center gap-3">
            

            <div className="hidden md:flex items-center gap-2 text-[12px] text-slate-500">
              <span className="px-2 py-1 rounded-md bg-white border border-slate-200">
                Month net:{" "}
                <span
                  className={
                    monthNet >= 0 ? "text-[#0fa89a] font-semibold" : "text-[#e1395f] font-semibold"
                  }
                >
                  {formatUsd(monthNet)}
                </span>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button className="h-8.5 px-3 rounded-lg border border-slate-200 bg-white text-[13px] text-slate-700 hover:bg-slate-50 cursor-pointer
">
              Filters
            </button>

            <button
              onClick={expandAll}
              className="h-8.5 px-3 rounded-lg border border-slate-200 bg-white text-[13px] text-slate-700 hover:bg-slate-50 cursor-pointer
"
            >
              Expand all
            </button>

            <button
              onClick={collapseAll}
              className="h-8.5 px-3 rounded-lg border border-slate-200 bg-white text-[13px] text-slate-700 hover:bg-slate-50 cursor-pointer"
            >
              Collapse all
            </button>

            <button
  onClick={(e) => {
    const button = e.currentTarget;
    const rect = button.getBoundingClientRect();

    const ripple = document.createElement("span");
    ripple.className = "ripple";

    const size = Math.max(rect.width, rect.height);
    ripple.style.width = ripple.style.height = `${size}px`;

    ripple.style.left = `${e.clientX - rect.left - size / 2}px`;
    ripple.style.top = `${e.clientY - rect.top - size / 2}px`;

    button.appendChild(ripple);

    setTimeout(() => {
      ripple.remove();
    }, 1100);

    // 🔥 ASIL LOG DAY AKSİYONU
    // openLogForDay(...)
  }}
  className="
    ripple-container
    h-8.5 px-3.5 rounded-lg
    text-[13px] font-medium text-white
    bg-gradient-to-b from-[#8d6cf0ff] to-[#7C3AED]
    hover:from-[#7f5fe6] hover:to-[#6D28D9]
    transition
    cursor-pointer

  "
>
  + Log Day
</button>

          </div>
        </div>

        {/* MAIN GRID */}
        <div className="grid grid-cols-12 gap-3">
          {/* LEFT: DAY LIST */}
          <div className="col-span-12 lg:col-span-10">
  <div className="space-y-2">
    {dayGroups.length === 0 && (
      <EmptyState
        title="No trades for this month"
        desc="Takvimden farklı bir ay seç veya fake trade generator ayarlarını değiştir."
      />
    )}

    {dayGroups.map((g) => (
      <DayAccordionRow
  key={g.date}
  group={g}
  trades={tradesByDay[g.date] || []}
  open={!!openDays[g.date]}
  onToggle={() => toggleDay(g.date)}
  hasNote={!!notes[g.date]}
  onOpenNote={() => openLogForDay(g.date)}
/>


    ))}
  </div>
</div>
<DailyLogModalV2
  open={logOpen}
  date={activeDate}
  trades={activeDate ? tradesByDay[activeDate] || [] : []}
  initialHtml={activeDate ? notes[activeDate] || "" : ""}
  onClose={closeLog}
  onSave={saveLog}
/>



          {/* RIGHT: MINI CALENDAR */}
          <div className="col-span-12 lg:col-span-2">


            <Card
  title={
    <div className="relative flex items-center w-full">

      {/* LEFT ARROW */}
      <button
  onClick={() => {
    const d = new Date(calendarDate);
    d.setMonth(d.getMonth() - 1);
    d.setDate(1);
    setCalendarDate(d);
  }}
  className="absolute left-0 p-1 text-slate-500 hover:text-slate-900 transition"
  aria-label="Previous month"
>
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
    <path
      d="M15 6l-6 6 6 6"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
</button>


      {/* CENTER DATE */}
      <div className="w-full text-center text-[12px] font-semibold text-slate-700">
        {calendarDate.toLocaleDateString("en-US", {
          month: "long",
          year: "numeric",
        })}
      </div>

      {/* RIGHT ARROW */}
      <button
  onClick={() => {
    const d = new Date(calendarDate);
    d.setMonth(d.getMonth() + 1);
    d.setDate(1);
    setCalendarDate(d);
  }}
  className="absolute right-0 p-1 text-slate-500 hover:text-slate-900 transition"
  aria-label="Next month"
>
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
    <path
      d="M9 18l6-6-6-6"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
</button>


    </div>
  }
>

              <div className="w-full h-full">
  <div className="w-full h-full flex items-start justify-center -mt-1">
    <div className="w-[280px]">
      <CalendarMiniV2 currentDate={calendarDate} />
    </div>
  </div>
</div>


            </Card>
          </div>
        </div>
      </div>
      
    </div>
  );
}

/* ======================
   DAY ROW
====================== */
function DayAccordionRow({
  group,
  trades,
  open,
  onToggle,
  hasNote,
  onOpenNote,
}: {
  group: DayGroup;
  trades: (typeof fakeTrades)[number][];

  open: boolean;
  onToggle: () => void;
  hasNote: boolean;
  onOpenNote: () => void;
}) {

  
  const positive = group.netPnl >= 0;
  const winTrades = trades.filter((t) => t.pnlUsd > 0);
  const lossTrades = trades.filter((t) => t.pnlUsd < 0);
  // COMMISSION (feeUsd genelde negatif, toplam komisyonu cost olarak göstereceğiz)
  const commissionSigned = trades.reduce((s, t) => s + (t.feeUsd ?? 0), 0); // negatif
  const commissionAbs = Math.abs(commissionSigned);

  // pnlUsd = NET (çünkü generator: netPnL = grossPnL + commission)
  const netPnl = trades.reduce((s, t) => s + t.pnlUsd, 0); // = group.netPnl ile aynı

  // grossPnL = netPnL - commission (commission negatif olduğu için çıkarınca eklenir)
  const grossPnl = trades.reduce((s, t) => s + (t.pnlUsd - t.feeUsd), 0);

  const winRate =
    trades.length === 0 ? 0 : (winTrades.length / trades.length) * 100;

  const grossProfit = winTrades.reduce((s, t) => s + t.pnlUsd, 0);
  const grossLoss = Math.abs(lossTrades.reduce((s, t) => s + t.pnlUsd, 0));

  const profitFactor =
  grossLoss === 0 ? (grossProfit > 0 ? 99.99 : 0) : grossProfit / grossLoss;

const totalRisk = trades.reduce((s, t) => s + (t.riskUsd ?? 0), 0);

 
 return (
  <div className="bg-white rounded-xl px-3 py-3 pt-1 shadow-[0_1px_1px_rgba(0,0,0,0.03)]">

    {/* HEADER */}
    <div className="flex items-center justify-between min-h-[44px] py-1">
      <button onClick={onToggle} className="flex items-center gap-3 text-left">
        <Chevron open={open} />

        <div className="flex items-center gap-3">
          <div className="text-[14px] font-semibold text-slate-900 flex items-center">
            {formatHeaderDate(group.date)}
            <span className="ml-2 -mr-0.5 text-slate-300">•</span>
          </div>

          <div className="text-[14px] font-semibold flex items-center">
            <span className={`mr-1.5 ${positive ? "text-[#0fa89a]" : "text-[#e1395f]"}`}>
              Net P&L
            </span>
            <span className={positive ? "text-[#0fa89a]" : "text-[#e1395f]"}>
              {formatUsd(group.netPnl)}
            </span>
          </div>
        </div>
      </button>


      <button
  onClick={(e) => {
    e.stopPropagation();
    onOpenNote();
  }}
  className={`
    h-8
    px-3.5
    rounded-lg
    flex
    items-center
    gap-1.5
    text-[11px]
    font-medium
    transition
    cursor-pointer
    ${
      hasNote
        ? "bg-slate-200/80 text-slate-600 hover:bg-slate-300/70"
        : "bg-violet-200/80   text-violet-500 hover:bg-violet-300/70"
    }
  `}
>
  <JournalNotebookIcon />
  <span>{hasNote ? "View Note" : "Add Note"}</span>
</button>



    </div>

    {/* MINI CHART + STATS (HER ZAMAN GÖRÜNÜR) */}
    <div className="mt-1 grid grid-cols-12 gap-3">
      <div className="col-span-12 lg:col-span-2">
        <MiniPnLAreaLite trades={trades} />





      </div>

      <div className="col-span-12 lg:col-span-10">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          <MiniStat label="Total Trades" value={group.tradeCount} />
          <MiniStat label="Winners" value={group.winners} />
          <MiniStat label="Losers" value={group.losers} />
          <MiniStat label="Breakeven" value={group.breakeven} />
          <MiniStat
            label="Volume"
            value={`$${totalRisk.toLocaleString("en-US")}`}
          />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mt-3">
          <MiniStat label="Win Rate" value={`${winRate.toFixed(1)}%`} />
          <MiniStat label="Profit Factor" value={profitFactor.toFixed(2)} />
          <MiniStat
            label="Commission"
            value={`-$${commissionAbs.toFixed(2)}`}
            tone="muted"
          />
          <MiniStat
  label="Gross PnL"
  value={formatUsd(grossPnl)}
  tone={grossPnl >= 0 ? "good" : "bad"}
  direction={grossPnl >= 0 ? "up" : "down"}
/>

          <MiniStat
  label="Net PnL"
  value={formatUsd(netPnl)}
  tone={netPnl >= 0 ? "good" : "bad"}
  direction={netPnl >= 0 ? "up" : "down"}
/>

        </div>
      </div>
    </div>

    {/* TRADE LIST (SADECE AÇIKKEN) */}
    {open && (
      <div className="mt-3">
        

        {trades.length === 0 ? (
          <div className="text-[12px] text-slate-500">
            No trades on this day.
          </div>
        ) : (
          <div className="rounded-lg border border-slate-200 overflow-hidden">
            <div className="grid grid-cols-18 bg-slate-200/60 text-[10.5px] font-semibold px-3 py-2">
              <div className="col-span-2">Open Time</div>
              <div className="col-span-2">Ticker</div>
              <div className="col-span-2">Direction</div>
              <div className="col-span-3">Entry → Exit</div>
              <div className="col-span-2">Volume</div>
              <div className="col-span-2">PnL</div>
              <div className="col-span-2">Net ROI</div>
              <div className="col-span-2">Duration</div>
              <div className="col-span-1 text-right">Result</div>
            </div>

            <div className="divide-y divide-slate-200">
              {trades.map((t) => {
                const pnlPos = t.pnlUsd >= 0;

                return (
                  <div
                    key={t.id}
                    className="grid grid-cols-18 px-3 py-2 text-[12px] hover:bg-slate-50"
                  >
                    <div className="col-span-2">{t.raw.openTime.slice(11, 19)}</div>
                    <div className="col-span-2">{t.symbol}</div>
                    <div className="col-span-2">
                      <span className={`px-2 py-0.5 rounded-md text-[11px] font-semibold ${
                        t.direction === "long"
                          ? "bg-emerald-100 text-[#0fa89a]"
                          : "bg-rose-100 text-[#e1395f]"
                      }`}>
                        {t.direction.toUpperCase()}
                      </span>
                    </div>
                    <div className="col-span-3">
                      {formatNum(t.entry)} → {formatNum(t.exit)}
                    </div>
                    <div className="col-span-2">
                      ${formatNum(Math.round(t.riskUsd))}
                    </div>
                    <div className={`col-span-2 font-semibold ${
                      pnlPos ? "text-[#0fa89a]" : "text-[#e1395f]"
                    }`}>
                      {formatUsd(t.pnlUsd)}
                    </div>
                    <div className="col-span-2">
                      {(() => {
                        const pct = calcTradeNetRoiPct(t);
                        return pct === null ? "--" : formatPct(pct);
                      })()}
                    </div>
                    <div className="col-span-2">
                      {calcDuration(t.raw.openTime, t.raw.closeTime)}
                    </div>
                    <div className="col-span-1 text-right">
                      {t.result.toUpperCase()}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    )}
  </div>
);

}

/* ======================
   UI PARTS
====================== */
function JournalNotebookIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* notebook body */}
      <rect x="4" y="4" width="16" height="16" rx="3" />

      {/* spiral rings */}
      <line x1="9" y1="2.5" x2="9" y2="6" />
      <line x1="15" y1="2.5" x2="15" y2="6" />

      

      {/* note lines */}
      <path d="M7.5 11h8" />
      <path d="M7.5 14.5h5" />
    </svg>
  );
}




function TrendUpIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 17l6-6 4 4 7-7" />
      <path d="M14 8h7v7" />
    </svg>
  );
}


function TrendDownIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 7l6 6 4-4 7 7" />
      <path d="M14 16h7v-7" />
    </svg>
  );
}

function MiniStat({
  label,
  value,
  tone = "neutral",
  direction, // 👈 EKLENDİ
}: {
  label: string;
  value: React.ReactNode;
  tone?: "good" | "bad" | "neutral" | "muted";
  direction?: "up" | "down";
}) {

  const toneClass =
  tone === "good"
    ? "text-[#0fa89a]"
    : tone === "bad"
    ? "text-[#e1395f]"
    : tone === "muted"
    ? "text-slate-800"
    : "text-black";


  return (
  <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 flex items-center justify-between">
    <div>
      <div className="text-[10px] text-slate-500 font-semibold uppercase tracking-wide">
        {label}
      </div>
      <div className={`text-[13px] font-semibold tabular-nums ${toneClass}`}>
        {value}
      </div>
    </div>

    {direction === "up" && (
  <div className="text-[#0fa89a]">
    <TrendUpIcon />
  </div>
)}

    {direction === "down" && (
  <div className="text-rose-600">
    <TrendDownIcon />
  </div>
)}
  </div>
);

}


function Chevron({ open }: { open: boolean }) {
  return (
    <div
  className={`w-8 h-8 rounded-lg flex cursor-pointer items-center justify-center transition ${
    open ? "rotate-90" : "rotate-0"
  } bg-slate-100 hover:bg-slate-200`}
>

      <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
        <path
          d="M9 18l6-6-6-6"
          stroke="#64748B" // slate-500

          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

function EmptyState({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 text-center">
      <div className="text-[14px] font-semibold text-slate-900">{title}</div>
      <div className="mt-1 text-[12px] text-slate-500">{desc}</div>
    </div>
  );
}

/* UI */
function Card({
  title,
  children,
  height,
}: {
  title: React.ReactNode;
  children: React.ReactNode;
  height?: string;
}) {
  return (
    <div className="bg-white rounded-xl p-4 shadow-[0_1px_1px_rgba(0,0,0,0.03)]">
      <div className="h-[12px] flex items-center text-[12px] font-semibold text-slate-700">
        {title}
      </div>

      <div className="relative -mx-5 mt-3 mb-3">
        <div className="h-px bg-slate-200 mx-1" />
      </div>

      {/* height verilirse uygula, verilmezse içerik kadar olsun */}
      <div className={height ? `w-full ${height}` : "w-full"}>{children}</div>
    </div>
  );
}

