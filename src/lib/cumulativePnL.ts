import type { FakeTrade } from "./fakeTrades";

export type CumulativePnLPoint = {
  date: string;
  value: number;
};

export function getDailyCumulativePnL(
  trades: FakeTrade[]
): CumulativePnLPoint[] {
  const dailyMap: Record<string, number> = {};

  // Günlük net PnL
  for (const t of trades) {
    dailyMap[t.date] = (dailyMap[t.date] || 0) + t.pnlUsd;
  }

  // Tarihe göre sırala
  const dates = Object.keys(dailyMap).sort();

  let cumulative = 0;

  return dates.map((date) => {
    cumulative += dailyMap[date];
    return { date, value: cumulative };
  });
}
