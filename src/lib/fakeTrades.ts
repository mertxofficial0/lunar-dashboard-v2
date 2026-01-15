import { generateFakeTrades } from "./fakeTradeGenerator";

export type FakeTrade = {
  id: string;
  date: string;
  symbol: string;
  direction: "long" | "short";

  entry: number;
  exit: number;

  riskUsd: number;
  pnlUsd: number;
  pnlR: number;

  feeUsd: number;
  result: "win" | "loss" | "breakeven";

  // 🔥 ACCOUNT SNAPSHOT (KURUMSAL JOURNAL)
  account: {
    equityBefore: number;
    equityAfter: number;
  };

  // 🔥 MT RAW DATA
  raw: {
    ticket: number;
    type: "BUY" | "SELL";
    lot: number;

    openTime: string;
    closeTime: string;

    stopLoss: number | null;
    takeProfit: number | null;

    commission: number;
    swap: number;
    comment?: string;
  };
};

export const fakeTrades: FakeTrade[] = generateFakeTrades({
  startDate: "2024-01-01",
  endDate: "2025-12-30",

  winRate: 0.33,
  totalTrades: 300,

  riskUsd: 50,

  // 🔥 BAŞLANGIÇ ACCOUNT SIZE
  initialEquity: 50000,
});
