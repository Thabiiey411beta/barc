const ARC_TOKEN_PAIRS = "https://api.dexscreener.com/token-pairs/v1/arc";

type DexPair = {
  chainId?: string;
  baseToken?: { address?: string; name?: string; symbol?: string };
  quoteToken?: { symbol?: string };
  priceUsd?: string;
  priceNative?: string;
  priceChange?: { h24?: number };
  liquidity?: { usd?: number };
  volume?: { h24?: number };
  pairAddress?: string;
  url?: string;
};

export type ArcTokenPrice = {
  address: string;
  name: string;
  symbol: string;
  priceUsd: string;
  priceNative: string;
  change24h: number | null;
  liquidityUsd: number | null;
  volume24h: number | null;
  pairAddress: string;
  pairUrl: string;
  source: "Dexscreener";
  updatedAt: string;
};

function isAddress(value: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(value);
}

function finiteNumber(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

export async function readArcTokenPrice(address: string): Promise<ArcTokenPrice> {
  if (!isAddress(address)) throw new Error("Invalid token address");

  const response = await fetch(`${ARC_TOKEN_PAIRS}/${address}`, {
    headers: { accept: "application/json" },
    signal: AbortSignal.timeout(8_000),
  });
  if (!response.ok) throw new Error(`Dexscreener returned ${response.status}`);

  const pairs = (await response.json()) as DexPair[];
  const pair = pairs
    .filter((candidate) => candidate.chainId === "arc" && candidate.priceUsd && candidate.pairAddress && candidate.url)
    .sort((left, right) => (right.liquidity?.usd || 0) - (left.liquidity?.usd || 0))[0];
  if (!pair?.priceUsd || !pair.pairAddress || !pair.url) throw new Error("No Arc market found for this token");

  return {
    address,
    name: pair.baseToken?.name || "Unknown token",
    symbol: pair.baseToken?.symbol || "TOKEN",
    priceUsd: pair.priceUsd,
    priceNative: pair.priceNative || "0",
    change24h: finiteNumber(pair.priceChange?.h24),
    liquidityUsd: finiteNumber(pair.liquidity?.usd),
    volume24h: finiteNumber(pair.volume?.h24),
    pairAddress: pair.pairAddress,
    pairUrl: pair.url,
    source: "Dexscreener",
    updatedAt: new Date().toISOString(),
  };
}