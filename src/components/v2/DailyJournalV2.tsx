import React, { useMemo, useState, useCallback } from "react";
import DashboardHeaderV2 from "./DashboardHeaderV2";
import InfoTooltip from "../ui/InfoTooltip";
import CalendarMiniV2 from "./CalendarMiniV2";

import { fakeTrades } from "../../lib/fakeTrades";

/* ======================
   HELPERS
====================== */


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
    setOpenDays((p) => ({ ...p, [date]: !p[date] }));
  }, []);

  const expandAll = useCallback(() => {
    const next: Record<string, boolean> = {};
    dayGroups.forEach((d) => (next[d.date] = true));
    setOpenDays(next);
  }, [dayGroups]);

  const collapseAll = useCallback(() => setOpenDays({}), []);

  // Top summary (optional)
  const monthNet = useMemo(
    () => monthTrades.reduce((a, t) => a + t.pnlUsd, 0),
    [monthTrades]
  );

  return (
    <div className="w-full overflow-x-hidden">
      <DashboardHeaderV2 title="Daily Journal" />


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
                    monthNet >= 0 ? "text-emerald-700 font-semibold" : "text-rose-700 font-semibold"
                  }
                >
                  {formatUsd(monthNet)}
                </span>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button className="h-8.5 px-3 rounded-lg border border-slate-200 bg-white text-[13px] text-slate-700 hover:bg-slate-50">
              Filters
            </button>

            <button
              onClick={expandAll}
              className="h-8.5 px-3 rounded-lg border border-slate-200 bg-white text-[13px] text-slate-700 hover:bg-slate-50"
            >
              Expand all
            </button>

            <button
              onClick={collapseAll}
              className="h-8.5 px-3 rounded-lg border border-slate-200 bg-white text-[13px] text-slate-700 hover:bg-slate-50"
            >
              Collapse all
            </button>

            <button className="h-8.5 px-3.5 rounded-lg text-[13px] text-white bg-gradient-to-b from-[#8d6cf0ff] to-[#7C3AED] hover:from-[#7f5fe6] hover:to-[#6D28D9]">
              + Log Day
            </button>
          </div>
        </div>

        {/* MAIN GRID */}
        <div className="grid grid-cols-12 gap-3">
          {/* LEFT: DAY LIST */}
          <div className="col-span-12 lg:col-span-10">
            <Card
              title={
                <div className="flex items-center gap-2">
                  <span>Daily Journal</span>
                  <InfoTooltip tooltip="Günlük performans özetlerini ve o güne ait trade detaylarını burada görürsün." />
                </div>
              }
              height="h-[760px]"
            >
              <div className="w-full h-full overflow-y-auto pr-2">
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
                    />
                  ))}
                </div>
              </div>
            </Card>
          </div>

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
}: {
  group: DayGroup;
  trades: typeof fakeTrades;
  open: boolean;
  onToggle: () => void;
}) {
  const positive = group.netPnl >= 0;

  return (
    <div className="bg-white rounded-xl p-4 shadow-[0_1px_1px_rgba(0,0,0,0.03)] border border-slate-200/70">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <button onClick={onToggle} className="flex items-center gap-3 text-left">
          <Chevron open={open} />
          <div className="flex items-center gap-3">
            <div className="text-[13px] font-semibold text-slate-900">
              {formatHeaderDate(group.date)}
            </div>

            <div className="text-[13px] font-semibold">
              <span className="text-slate-500 mr-2">Net P&L</span>
              <span className={positive ? "text-emerald-700" : "text-rose-700"}>
                {formatUsd(group.netPnl)}
              </span>
            </div>

            <div className="hidden md:flex items-center gap-2 text-[11px] text-slate-500">
              <span className="px-2 h-[18px] rounded bg-slate-200/70 text-slate-700 font-semibold flex items-center">
                {group.tradeCount} trades
              </span>
            </div>
          </div>
        </button>

        <div className="flex items-center gap-2">
          <button className="h-8 px-3 rounded-lg border border-slate-200 bg-white text-[12px] text-slate-700 hover:bg-slate-50">
            View Note
          </button>
          <button className="h-8 px-3 rounded-lg border border-slate-200 bg-white text-[12px] text-slate-700 hover:bg-slate-50">
            Details
          </button>
        </div>
      </div>

      {/* BODY */}
      {open && (
        <div className="mt-4">
          <div className="grid grid-cols-12 gap-3">
            {/* LEFT MINI CHART PLACEHOLDER */}
            <div className="col-span-12 lg:col-span-4">
              <div className="h-[130px] rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center text-xs text-slate-500">
                Mini equity curve (next)
              </div>
            </div>

            {/* STATS */}
            <div className="col-span-12 lg:col-span-8">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <MiniStat label="Total Trades" value={group.tradeCount} />
                <MiniStat label="Winners" value={group.winners} />
                <MiniStat label="Losers" value={group.losers} />
                <MiniStat label="Breakeven" value={group.breakeven} />
              </div>

              <div className="mt-3 h-[1px] bg-slate-200/70" />

              {/* TRADES TABLE */}
              <div className="mt-3">
                <div className="text-[11px] font-semibold text-slate-700 mb-2">
                  Trades
                </div>

                {trades.length === 0 ? (
                  <div className="text-[12px] text-slate-500">
                    No trades on this day.
                  </div>
                ) : (
                  <div className="rounded-lg border border-slate-200 overflow-hidden">
                    <div className="grid grid-cols-12 gap-0 bg-slate-50 text-[10px] font-semibold text-slate-600 px-3 py-2">
                      <div className="col-span-2">Symbol</div>
                      <div className="col-span-2">Direction</div>
                      <div className="col-span-2">Entry → Exit</div>
                      <div className="col-span-2">Risk</div>
                      <div className="col-span-2">PnL</div>
                      <div className="col-span-2 text-right">Result</div>
                    </div>

                    <div className="divide-y divide-slate-200">
                      {trades.map((t) => {
                        const pnlPos = t.pnlUsd >= 0;
                        return (
                          <button
                            key={t.id}
                            className="w-full text-left grid grid-cols-12 px-3 py-2 text-[12px] hover:bg-slate-50 transition"
                            onClick={() => {
                              // later: open a drawer/modal for full trade detail
                              // For now: quick dev signal
                              console.log("trade", t);
                            }}
                          >
                            <div className="col-span-2 font-semibold text-slate-900">
                              {t.symbol}
                            </div>

                            <div className="col-span-2">
                              <span
                                className={`px-2 py-0.5 rounded-md text-[11px] font-semibold ${
                                  t.direction === "long"
                                    ? "bg-emerald-100 text-emerald-800"
                                    : "bg-rose-100 text-rose-800"
                                }`}
                              >
                                {t.direction.toUpperCase()}
                              </span>
                            </div>

                            <div className="col-span-2 text-slate-700 tabular-nums">
                              {formatNum(t.entry)} → {formatNum(t.exit)}
                            </div>

                            <div className="col-span-2 text-slate-700 tabular-nums">
                              ${formatNum(Math.round(t.riskUsd))}
                            </div>

                            <div
                              className={`col-span-2 tabular-nums font-semibold ${
                                pnlPos ? "text-emerald-700" : "text-rose-700"
                              }`}
                            >
                              {formatUsd(t.pnlUsd)}
                              <span className="text-[10px] text-slate-500 font-medium ml-2">
                                ({t.pnlR >= 0 ? "+" : ""}
                                {t.pnlR.toFixed(2)}R)
                              </span>
                            </div>

                            <div className="col-span-2 text-right">
                              <span
                                className={`px-2 py-0.5 rounded-md text-[11px] font-semibold ${
                                  t.result === "win"
                                    ? "bg-emerald-100 text-emerald-800"
                                    : t.result === "loss"
                                    ? "bg-rose-100 text-rose-800"
                                    : "bg-slate-100 text-slate-700"
                                }`}
                              >
                                {t.result.toUpperCase()}
                              </span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-3 text-[11px] text-slate-500">
                (Next: Trade detail drawer + day note + mini curve)
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ======================
   UI PARTS
====================== */
function MiniStat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white px-3 py-2">
      <div className="text-[10px] text-slate-500 font-medium">{label}</div>
      <div className="text-[13px] font-semibold text-slate-900 tabular-nums">{value}</div>
    </div>
  );
}

function Chevron({ open }: { open: boolean }) {
  return (
    <div
      className={`w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center bg-white transition ${
        open ? "rotate-90" : "rotate-0"
      }`}
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
        <path
          d="M9 18l6-6-6-6"
          stroke="#64748B"
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

