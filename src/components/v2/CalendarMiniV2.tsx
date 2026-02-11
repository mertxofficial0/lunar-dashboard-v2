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
  rangeStart,
  rangeEnd,
  onSelectDate,
}: {
  currentDate: Date;
  rangeStart?: string | null;
  rangeEnd?: string | null;
  onSelectDate?: (date: string) => void;
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
<div className="grid grid-cols-7 gap-1 mb-1.5">

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
          const isStart = rangeStart === dateKey;
const isEnd = rangeEnd === dateKey;

const isInRange =
  rangeStart &&
  rangeEnd &&
  dateKey > rangeStart &&
  dateKey < rangeEnd;

          const summary = dailyMap[dateKey];
const hasTrade = !!summary;            // ✅ trade var mı?
const pnl = summary?.pnlUsd ?? 0;      // ✅ trade varsa pnl

// ✅ trade yoksa daha belirgin gri
// ✅ trade yoksa daha AÇIK gri
let bgClass = "";

if (isStart || isEnd) {
  bgClass = "bg-violet-400 border-violet-400";
} else if (isInRange) {
  bgClass = "bg-violet-100 border-violet-200";
} else if (!hasTrade) {
  bgClass = "bg-slate-200/60 border-slate-200";
} else if (pnl > 0) {
  bgClass = "bg-[#0fa89a]/20 border-[#0fa89a]/40";
} else if (pnl < 0) {
  bgClass = "bg-[#e1395f]/20 border-[#e1395f]/40";
} else {
  bgClass = "bg-white border-slate-200";
}




// ✅ yazı HER ZAMAN siyah
const textClass = "text-slate-900";


return (
  <div
  key={i}
  onClick={() => onSelectDate?.(dateKey)}
  className={`aspect-square rounded-md border flex items-center justify-center cursor-pointer  ${bgClass}`}
  title={dateKey}
>

    <span
  className={`text-[11px] font-medium ${
    isStart || isEnd ? "text-white" : textClass
  }`}
>

      {dayNumber}
    </span>
  </div>
);

        })}
      </div>
    </div>
  );
}
