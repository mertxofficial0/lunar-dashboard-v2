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
  result: "win" | "loss";
};

export const fakeTrades = generateFakeTrades({
  startDate: "2024-01-01",
  endDate: "2025-12-31",
  tradeCount: 200,
});
