
import CalendarDayCell from "./CalendarDayCell";
import { fakeTrades } from "../../lib/fakeTrades";
const dailyMap = buildDailyMap(fakeTrades);

type DaySummary = {
  pnlUsd: number;
  trades: number;
};

function buildDailyMap(trades: typeof fakeTrades) {
  const map: Record<string, DaySummary> = {};

  trades.forEach(t => {
    // t.date zaten "YYYY-MM-DD"
    if (!map[t.date]) {
      map[t.date] = { pnlUsd: 0, trades: 0 };
    }

    map[t.date].pnlUsd += t.pnlUsd;
    map[t.date].trades += 1;
  });

  return map;
}


export default function CalendarV2({
  currentDate,
}: {
  currentDate: Date;
}) {

      

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth(); // 0–11

  const firstDayOfMonth = new Date(year, month, 1);
  const startWeekDay = firstDayOfMonth.getDay(); // 0 = Sun

  const daysInMonth = new Date(year, month + 1, 0).getDate();

  return (
    <div className="h-full w-full flex flex-col">
      

      {/* WEEKDAYS */}
<div className="grid grid-cols-7 gap-2 mb-2">
  {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
    <div
      key={day}
      className="
        text-xs
        font-medium
        text-slate-600
        border
        rounded-md
        border border-slate-200

        px-2
        py-1
        text-center
        bg-white
      "
    >
      {day}
    </div>
  ))}
</div>


      {/* GRID */}
<div className="grid grid-cols-7 gap-2 flex-1 auto-rows-fr">
  {(() => {
    const totalCells =
      startWeekDay + daysInMonth <= 35 ? 35 : 42;

    return Array.from({ length: totalCells }).map((_, i) => {
      const dayNumber = i - startWeekDay + 1;

      const isOutsideMonth =
        dayNumber < 1 || dayNumber > daysInMonth;

      let variant: "empty" | "positive" | "negative" = "empty";
      let pnlUsd: number | undefined;
      let trades: number | undefined;

     if (!isOutsideMonth) {
  const dateKey = `${year}-${String(month + 1).padStart(2, "0")}-${String(dayNumber).padStart(2, "0")}`;
  const summary = dailyMap[dateKey];

  if (summary) {
    pnlUsd = summary.pnlUsd;
    trades = summary.trades;
    variant = summary.pnlUsd >= 0 ? "positive" : "negative";
  }
}


      return (
        <CalendarDayCell
          key={i}
          day={isOutsideMonth ?  undefined: dayNumber}
          variant={variant}
          pnlUsd={pnlUsd}
          trades={trades}
          disabled={isOutsideMonth}
        />
      );
    });
  })()}
</div>




    </div>
  );
}
