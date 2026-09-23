const FALLBACK_BARC_ADDRESS = "0xCD78f7bd8A5095412BF820d7698b1aFb55924084";

const configuredBarcAddress = import.meta.env.VITE_BARC_ADDRESS?.trim();
if (configuredBarcAddress && configuredBarcAddress.toLowerCase() !== FALLBACK_BARC_ADDRESS.toLowerCase()) {
  throw new Error("VITE_BARC_ADDRESS does not match the canonical $BARC contract.");
}

export const BARC = {
  chainId: 5042,
  address: configuredBarcAddress || FALLBACK_BARC_ADDRESS,
  decimals: 18,
} as const;

const units = (whole: bigint): bigint => whole * 10n ** BigInt(BARC.decimals);

export const TIERS = {
  pup: { min: 0n, tools: ["add-arc", "ca-check"] },
  pack: { min: units(1000n), tools: ["sunday-desk", "raid-custom", "score-lite"] },
  wolf: { min: units(100000n), tools: ["invoice-draft", "score-full", "kit-api"] },
} as const;

export type BarcTier = keyof typeof TIERS;

export function tierForBalance(balance: bigint): BarcTier {
  if (balance >= TIERS.wolf.min) return "wolf";
  if (balance >= TIERS.pack.min) return "pack";
  return "pup";
}

export function formatBarc(balance: bigint): string {
  const whole = balance / 10n ** BigInt(BARC.decimals);
  const fraction = (balance % 10n ** BigInt(BARC.decimals)).toString().padStart(BARC.decimals, "0").slice(0, 2);
  return fraction === "00" ? whole.toLocaleString() : `${whole.toLocaleString()}.${fraction}`;
}