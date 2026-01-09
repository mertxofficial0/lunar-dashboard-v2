
import {
  ResponsiveContainer,
  RadialBarChart,
  RadialBar,
} from "recharts";

/* ======================
   HELPERS
====================== */

function clamp(v: number, min = 0, max = 100) {
  return Math.max(min, Math.min(max, v));
}

function normalizeWinRate(winRate: number) {
  return clamp((winRate / 70) * 100);
}

function normalizeProfitFactor(pf: number) {
  return clamp((pf / 2) * 100);
}

function normalizeAvgWinLoss(ratio: number) {
  return clamp((ratio / 2) * 100);
}

/* ======================
   COMPONENT
====================== */

export default function LunarScoreRadarChart({
  winRate,
  profitFactor,
  avgWinLoss,
}: {
  winRate: number;
  profitFactor: number;
  avgWinLoss: number;
}) {
  /* 🎨 THEME */
  const PURPLE = "#8b8df8";
  const GRID = "#e5e7eb";

  /* 📐 SIZE CONTROL */
  const CHART_SIZE = 160;
  const CENTER_SIZE = 100;

  /* normalize */
  const winScore = normalizeWinRate(winRate);
  const pfScore = normalizeProfitFactor(profitFactor);
  const wlScore = normalizeAvgWinLoss(avgWinLoss);

  const lunarScore = clamp((winScore + pfScore + wlScore) / 3);

  const data = [{ name: "Lunar Score", value: lunarScore }];

  return (
    <div className="w-full h-full flex flex-col items-center justify-center overflow-hidden">
      {/* ======================
          LUNAR CIRCLE
      ====================== */}
      <div className="relative w-full h-[135px] flex items-center justify-center">
        <ResponsiveContainer width={CHART_SIZE} height={CHART_SIZE}>
          <RadialBarChart
            data={data}
            cx="50%"
            cy="50%"
            innerRadius="72%"
            outerRadius="90%"
            startAngle={90}
            endAngle={-270}
          >
            <RadialBar
              dataKey="value"
              background={{ fill: GRID }}
              fill={PURPLE}
              cornerRadius={999}
              
            />
          </RadialBarChart>
        </ResponsiveContainer>

        {/* CENTER */}
        <div className="absolute">
          <div
            className="rounded-full flex flex-col items-center justify-center"
            style={{
              width: CENTER_SIZE,
              height: CENTER_SIZE,
              background: "#ffffff",
              border: "1px solid #e5e7eb",
              boxShadow: "0 8px 28px rgba(15,23,42,0.14)",
            }}
          >
            <div className="text-[10px] font-semibold text-slate-500 tracking-wide">
              LUNAR SCORE
            </div>

            <div
              className="text-3xl font-bold tabular-nums"
              style={{ color: PURPLE }}
            >
              {lunarScore.toFixed(1)}
            </div>

            <div className="text-[10px] text-slate-400">
              out of 100
            </div>
          </div>
        </div>
      </div>

      {/* ======================
          METRICS + SCORE BAR
      ====================== */}
      <div className="w-full px-0 mt-2 space-y-2">
        <MetricRow
          label="Win %"
          raw={`${winRate.toFixed(2)}%`}
          score={winScore}
        />

        <MetricRow
          label="Profit Factor"
          raw={profitFactor.toFixed(2)}
          score={pfScore}
        />

        <MetricRow
          label="Avg Win/Loss"
          raw={avgWinLoss.toFixed(2)}
          score={wlScore}
        />
      </div>
    </div>
  );
}

/* ======================
   METRIC ROW (BARLI)
====================== */

function MetricRow({
  label,
  raw,
  score,
}: {
  label: string;
  raw: string;
  score: number;
}) {
  const PURPLE = "#8b8df8";

  return (
    <div className="px-3 py-2 rounded-lg border border-slate-200 bg-slate-50">
      {/* TOP ROW */}
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2">
          <span
            className="w-2.5 h-2.5 rounded-full"
            style={{ backgroundColor: PURPLE }}
          />
          <span className="text-xs font- text-slate-700">
            {label}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 tabular-nums">
            {raw}
          </span>

          <span
            className="text-xs font-semibold px-2 py-0.5 rounded-md"
            style={{
              backgroundColor: `${PURPLE}22`,
              color: PURPLE,
            }}
          >
            {Math.round(score)}
          </span>
        </div>
      </div>

      {/* SCORE BAR */}
      <div className="w-full h-1 rounded-full bg-slate-200 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{
            width: `${score}%`,
            backgroundColor: PURPLE,
          }}
        />
      </div>
    </div>
  );
}
