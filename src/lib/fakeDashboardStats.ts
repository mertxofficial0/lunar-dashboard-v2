import { fakeTrades } from "./fakeTrades";

const wins = fakeTrades.filter(t => t.result === "win");
const losses = fakeTrades.filter(t => t.result === "loss");

export const dashboardStats = {
  netPnL: fakeTrades.reduce((acc, t) => acc + t.pnlUsd, 0),

  tradeWinRate:
    (wins.length / fakeTrades.length) * 100,

  profitFactor:
    Math.abs(
      wins.reduce((a, t) => a + t.pnlUsd, 0) /
      losses.reduce((a, t) => a + t.pnlUsd, 0)
    ),

  dayWinRate: 66.6, // şimdilik sabit, calendar bağlayınca hesaplanır

  avgWinLoss:
    Math.abs(
      wins.reduce((a, t) => a + t.pnlR, 0) /
      losses.reduce((a, t) => a + t.pnlR, 0)
    ),
};
