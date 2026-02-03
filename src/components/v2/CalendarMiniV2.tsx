import { fakeTrades } from "../../lib/fakeTrades";

/* ======================
   TYPES
====================== */
type DaySummary = {
  pnlUsd: number;
};

/* ======================
   DAILY MAP (only pnl)
====================== */
function buildDailyMap(trades: typeof fakeTrades) {
  const map: Record<string, DaySummary> = {};

  trades.forEach((t) => {
    if (!map[t.date]) map[t.date] = { pnlUsd: 0 };
    map[t.date].pnlUsd += t.pnlUsd;
  });

  return map;
}

const dailyMap = buildDailyMap(fakeTrades);

function ymd(year: number, month0: number, day: number) {
  return `${year}-${String(month0 + 1).padStart(2, "0")}-${String(day).padStart(
    2,
    "0"
  )}`;
}

export default function CalendarMiniV2({
  
  currentDate,
}: {
  currentDate: Date;
}) {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth(); // 0-11

  const firstDayOfMonth = new Date(year, month, 1);
  const startWeekDay = firstDayOfMonth.getDay(); // 0=Sun
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cellCount = startWeekDay + daysInMonth <= 35 ? 35 : 42;

  return (
    <div className="w-full">
      {/* WEEKDAYS */}
<div className="grid grid-cols-7 gap-1 mb-2">
  {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
    <div
      key={day}
      className="
        h-7
        rounded-md
        border border-slate-200
        bg-white
        flex items-center justify-center
        text-[10px]
        font-semibold
        text-slate-600
      "
    >
      {day}
    </div>
  ))}
</div>



      {/* GRID */}
      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: cellCount }).map((_, i) => {
          const dayNumber = i - startWeekDay + 1;
          const isOutsideMonth = dayNumber < 1 || dayNumber > daysInMonth;

          if (isOutsideMonth) {
            return (
              <div
                key={i}
                className="aspect-square rounded-md border border-slate-200 bg-white/60"
              />
            );
          }

          const dateKey = ymd(year, month, dayNumber);
          const summary = dailyMap[dateKey];
const hasTrade = !!summary;            // ✅ trade var mı?
const pnl = summary?.pnlUsd ?? 0;      // ✅ trade varsa pnl

// ✅ trade yoksa daha belirgin gri
// ✅ trade yoksa daha AÇIK gri
const bgClass = !hasTrade
  ? "bg-slate-50 border-slate-200"     // <- daha açık gri
  : pnl > 0
  ? "bg-emerald-100 border-emerald-200"
  : pnl < 0
  ? "bg-rose-100 border-rose-200"
  : "bg-white border-slate-200";

// ✅ yazı HER ZAMAN siyah
const textClass = "text-slate-800";


return (
  <div
    key={i}
    className={`aspect-square rounded-md border flex items-center justify-center ${bgClass}`}
    title={dateKey}
  >
    <span className={`text-[11px] font-medium ${textClass}`}>
      {dayNumber}
    </span>
  </div>
);

        })}
      </div>
    </div>
  );
}
