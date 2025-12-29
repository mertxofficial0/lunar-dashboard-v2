export type FakeTrade = {
  id: string;
  date: string; // YYYY-MM-DD
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

export const fakeTrades: FakeTrade[] = [
  // DAY 1 → WIN
  {
    id: "T-001",
    date: "2025-08-01",
    symbol: "NASDAQ",
    direction: "long",
    entry: 18950,
    exit: 19040,
    riskUsd: 50,
    pnlUsd: 90,
    pnlR: 1.8,
    feeUsd: 5,
    result: "win",
  },
  {
    id: "T-001",
    date: "2025-08-01",
    symbol: "NASDAQ",
    direction: "long",
    entry: 18950,
    exit: 19040,
    riskUsd: 50,
    pnlUsd: -50,
    pnlR: 1.8,
    feeUsd: 5,
    result: "loss",
  },
  {
    id: "T-001",
    date: "2025-08-01",
    symbol: "NASDAQ",
    direction: "long",
    entry: 18950,
    exit: 19040,
    riskUsd: 50,
    pnlUsd: 50,
    pnlR: 1.8,
    feeUsd: 5,
    result: "win",
  },
{
    id: "T-001",
    date: "2025-08-02",
    symbol: "NASDAQ",
    direction: "long",
    entry: 18950,
    exit: 19040,
    riskUsd: 50,
    pnlUsd: -50,
    pnlR: 1.8,
    feeUsd: 5,
    result: "win",
  },
  
];
