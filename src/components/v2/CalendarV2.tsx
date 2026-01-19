import CalendarDayCell from "./CalendarDayCell";
import { fakeTrades } from "../../lib/fakeTrades";

/* ======================
   TYPES
====================== */

type DaySummary = {
  pnlUsd: number;
  trades: number;
  equityBefore?: number;
  equityAfter?: number;
};

/* ======================
   DAILY MAP
====================== */

function buildDailyMap(trades: typeof fakeTrades) {
  const map: Record<string, DaySummary> = {};

  trades.forEach((t) => {
    if (!map[t.date]) {
      map[t.date] = {
        pnlUsd: 0,
        trades: 0,
        equityBefore: t.account.equityBefore,
        equityAfter: t.account.equityAfter,
      };
    }

    map[t.date].pnlUsd += t.pnlUsd;
    map[t.date].trades += 1;

    // gün içindeki son trade equityAfter
    map[t.date].equityAfter = t.account.equityAfter;
  });

  return map;
}

const dailyMap = buildDailyMap(fakeTrades);

/* ======================
   COMPONENT
====================== */

export default function CalendarV2({
  currentDate,
  showTradeCount,
  showDailyPercent,
  highlightExtremeDays,
}: {
  currentDate: Date;
  showTradeCount: boolean;
  showDailyPercent: boolean;
  highlightExtremeDays: boolean;
}) {

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth(); // 0–11
// ======================
// BEST / WORST DAY (Selected month)
// ======================

let bestPnl: number | null = null;
let worstPnl: number | null = null;

Object.entries(dailyMap).forEach(([date, summary]) => {
  const d = new Date(date);

  // sadece seçili ay
  if (d.getFullYear() !== year || d.getMonth() !== month) return;

  // sadece trade olan günleri dikkate al (0 pnl hariç)
  if (summary.pnlUsd === 0) return;

  if (bestPnl === null || summary.pnlUsd > bestPnl) bestPnl = summary.pnlUsd;
  if (worstPnl === null || summary.pnlUsd < worstPnl) worstPnl = summary.pnlUsd;
});

  const firstDayOfMonth = new Date(year, month, 1);
  const startWeekDay = firstDayOfMonth.getDay(); // 0 = Sun

  const daysInMonth = new Date(year, month + 1, 0).getDate();

  return (
    <div className="h-full w-full flex flex-col">
      {/* WEEKDAYS */}
      <div className="grid grid-cols-7 gap-2 mb-2">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div
            key={day}
            className="
              text-xs
              font-medium
              text-slate-800/70
              border
              rounded-md
              border-slate-200
              px-2
              py-1.5
              text-center
              bg-white
            "
          >
            {day}
          </div>
        ))}
      </div>

      {/* GRID */}
      <div className="grid grid-cols-7 gap-2 flex-1 auto-rows-fr overflow-visible isolation-isolate">


        {Array.from({
          length:
            startWeekDay + daysInMonth <= 35 ? 35 : 42,
        }).map((_, i) => {
          const dayNumber = i - startWeekDay + 1;
          const isOutsideMonth =
            dayNumber < 1 || dayNumber > daysInMonth;

          let variant: "empty" | "positive" | "negative" = "empty";
          let pnlUsd: number | undefined;
          let trades: number | undefined;
          let dailyPercent: number | undefined;
          let isBestDay = false;
let isWorstDay = false;


          if (!isOutsideMonth) {
            const dateKey = `${year}-${String(month + 1).padStart(
              2,
              "0"
            )}-${String(dayNumber).padStart(2, "0")}`;

            const summary = dailyMap[dateKey];

            if (summary) {
              pnlUsd = summary.pnlUsd;
              trades = summary.trades;
              variant =
                summary.pnlUsd >= 0
                  ? "positive"
                  : "negative";
if (
  highlightExtremeDays &&
  bestPnl !== null &&
  summary.pnlUsd === bestPnl
) {
  isBestDay = true;
}

if (
  highlightExtremeDays &&
  worstPnl !== null &&
  summary.pnlUsd === worstPnl
) {
  isWorstDay = true;
}


              if (
  summary.equityBefore !== undefined &&
  summary.equityAfter !== undefined &&
  summary.equityBefore !== 0
) {
  dailyPercent =
    ((summary.equityAfter - summary.equityBefore) /
      summary.equityBefore) *
    100;
}

            }
          }

          return (
            <CalendarDayCell
              key={i}
              day={
                isOutsideMonth ? undefined : dayNumber
              }
              variant={variant}
              pnlUsd={pnlUsd}
              trades={trades}
              disabled={isOutsideMonth}
              showTradeCount={showTradeCount}
              showDailyPercent={showDailyPercent}
              dailyPercent={dailyPercent}
              isBestDay={isBestDay}
isWorstDay={isWorstDay}

            />
          );
        })}
      </div>
    </div>
  );
}
