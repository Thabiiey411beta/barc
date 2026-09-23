import { createError, defineEventHandler, getQuery } from "h3";
import { allowRequest } from "../barc-rpc";

const ADDRESS = /^0x[a-fA-F0-9]{40}$/;
const CHAINS = new Set(["arc", "ethereum", "base", "solana"]);

export default defineEventHandler(async (event) => {
  if (!allowRequest(event.node?.req.socket.remoteAddress || "tape")) {
    throw createError({ statusCode: 429, statusMessage: "Too many requests" });
  }
  const query = getQuery(event);
  const ca = String(query.ca || "");
  const chain = String(query.chain || "arc").toLowerCase();
  if (!ADDRESS.test(ca) || !CHAINS.has(chain)) {
    throw createError({ statusCode: 400, statusMessage: "Provide a token address and supported chain." });
  }
  const response = await fetch(`https://api.dexscreener.com/token-pairs/v1/${chain}/${ca}`);
  if (!response.ok) throw createError({ statusCode: 502, statusMessage: "Tape source unavailable." });
  const pairs = (await response.json()) as Array<{ volume?: { h24?: number }; liquidity?: { usd?: number }; priceUsd?: string }>;
  const volume24h = pairs.reduce((total, pair) => total + Number(pair.volume?.h24 || 0), 0);
  const liquidityUsd = pairs.reduce((total, pair) => total + Number(pair.liquidity?.usd || 0), 0);
  return {
    ca,
    chain,
    heat: { volume24h, liquidityUsd, uniquePostersProxy: null, narrativeTag: "unclassified" },
    label: "heat, not a buy signal",
    pairs: pairs.length,
  };
});
