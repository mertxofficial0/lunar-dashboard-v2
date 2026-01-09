import type { FakeTrade } from "./fakeTrades";

/* ======================
   HELPERS
====================== */

function random(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

function randomInt(min: number, max: number) {
  return Math.floor(random(min, max));
}

function formatDate(d: Date) {
  return d.toISOString().split("T")[0];
}

function formatDateTime(d: Date) {
  return d.toISOString().replace("T", " ").slice(0, 19);
}

function isWeekend(d: Date) {
  const day = d.getDay();
  return day === 0 || day === 6;
}

function addMinutes(date: Date, min: number, max: number) {
  const d = new Date(date);
  d.setMinutes(d.getMinutes() + randomInt(min, max));
  return d;
}

/* ======================
   SYMBOL SETTINGS
====================== */

const SYMBOLS = {
  NAS100: {
    basePrice: 17500,
    pointValue: 1,
    commissionPerLot: -6.5,
  },
  EURUSD: {
    basePrice: 1.08,
    pointValue: 100,
    commissionPerLot: -7,
  },
};

/* ======================
   GENERATOR
====================== */

export function generateFakeTrades(config: {
  startDate: string;
  endDate: string;
  winRate?: number;
  totalTrades?: number;   // 🔥 YENİ
  riskUsd?: number;       // 🔥 YENİ
}): FakeTrade[] {
  const {
    startDate,
    endDate,
    winRate = 0.20,
    totalTrades= 100,
    riskUsd = 50,          // default eski gibi
  } = config;

  const start = new Date(startDate);
  const end = new Date(endDate);

  const trades: FakeTrade[] = [];
  let ticket = 10000001;

  for (
    let d = new Date(start);
    d <= end;
    d.setDate(d.getDate() + 1)
  ) {
    if (isWeekend(d)) continue;
    if (totalTrades && trades.length >= totalTrades) break;

    // 🔥 ARTIK HER GÜN EN AZ 1 TRADE
    const tradesToday = randomInt(1, 2);

    for (let i = 0; i < tradesToday; i++) {
      if (totalTrades && trades.length >= totalTrades) break;

      const symbolKeys = Object.keys(SYMBOLS);
      const symbol =
        symbolKeys[randomInt(0, symbolKeys.length)] as keyof typeof SYMBOLS;

      const settings = SYMBOLS[symbol];

      const direction = Math.random() > 0.5 ? "long" : "short";
      const type = direction === "long" ? "BUY" : "SELL";

      const lot = [0.5, 1, 1.5][randomInt(0, 3)];

      const openTime = addMinutes(d, 9 * 60, 17 * 60);
      const closeTime = addMinutes(openTime, 5, 60);

      const openPrice =
        settings.basePrice + random(-50, 50);

      const win = Math.random() < winRate;
      const move = win ? random(40, 80) : -random(20, 50);

      const priceMove =
        type === "BUY" ? move : -move;

      const closePrice =
        openPrice + priceMove;

      const pnlUsd =
        priceMove * settings.pointValue * lot;

      const commission =
        settings.commissionPerLot * lot;

      const netPnL =
        pnlUsd + commission;

      const tradeRiskUsd = Math.abs(riskUsd * lot);

      trades.push({
        id: `MT-${ticket++}`,
        date: formatDate(closeTime),

        symbol,
        direction,

        entry: Number(openPrice.toFixed(2)),
        exit: Number(closePrice.toFixed(2)),

        // 🔥 ARTIK DIŞARIDAN AYARLANABİLİR
        riskUsd: tradeRiskUsd,
        pnlUsd: Number(netPnL.toFixed(2)),
        pnlR: netPnL / tradeRiskUsd,

        feeUsd: commission,
        result:
          netPnL > 0
            ? "win"
            : netPnL < 0
            ? "loss"
            : "breakeven",

        raw: {
          ticket,
          type,
          lot,
          openTime: formatDateTime(openTime),
          closeTime: formatDateTime(closeTime),
          stopLoss: win
            ? openPrice - 60
            : openPrice + 60,
          takeProfit: win
            ? openPrice + 80
            : null,
          commission,
          swap: 0,
          comment: "EA simulated trade",
        },
      } as FakeTrade & any);
    }
  }

  return trades;
}
