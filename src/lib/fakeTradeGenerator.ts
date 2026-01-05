import type { FakeTrade } from "./fakeTrades";

/* ======================
   RANDOM (HER F5 FARKLI)
====================== */
function random() {
  return Math.random();
}

/* ======================
   DATE HELPERS
====================== */
function addDays(date: Date, days: number) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

function formatDate(d: Date) {
  return d.toISOString().split("T")[0];
}

/* ======================
   GENERATOR
====================== */
export function generateFakeTrades(config: {
  startDate: string;
  endDate: string;
  tradeCount: number;
}): FakeTrade[] {
  const { startDate, endDate, tradeCount } = config;

  const start = new Date(startDate);
  const end = new Date(endDate);
  const totalDays =
    Math.floor((end.getTime() - start.getTime()) / 86400000);

  let equity = 0;
  const trades: FakeTrade[] = [];

  /* ======================================
     🔒 BAŞLANGIÇ TRADE (HER ZAMAN 0 $)
  ====================================== */
  trades.push({
    id: "T-0000",
    date: formatDate(start),
    symbol: "NASDAQ",
    direction: "long",
    entry: 0,
    exit: 0,
    riskUsd: 0,
    pnlUsd: 0,
    pnlR: 0,
    feeUsd: 0,
    result: "win", // veya "breakeven" (önemsiz)
  });

  /* ======================================
     GERÇEK FAKE TRADE’LER
  ====================================== */
  for (let i = 0; i < tradeCount; i++) {
    const dateOffset = Math.floor((i / tradeCount) * totalDays);
    const date = addDays(start, dateOffset);

    const riskUsd = 1000;
    const win = random() > 0.60; // ~70% winrate

    let pnlR: number;
    let pnlUsd: number;

    if (win) {
      pnlR = 1 + random() * 3; // 1R – 4R
      pnlUsd = Math.round(pnlR * riskUsd);
    } else {
      pnlR = -1;
      pnlUsd = -riskUsd;
    }

    equity += pnlUsd;

    trades.push({
      id: `T-${String(i + 1).padStart(4, "0")}`,
      date: formatDate(date),
      symbol: "NASDAQ",
      direction: random() > 0.5 ? "long" : "short",
      entry: 19000 + Math.floor(random() * 500),
      exit: 19000 + Math.floor(random() * 500),
      riskUsd,
      pnlUsd,
      pnlR,
      feeUsd: 5,
      result: pnlUsd > 0 ? "win" : "loss",
    });
  }

  return trades;
}
