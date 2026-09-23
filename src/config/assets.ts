export const ARC = {
  id: 5042,
  name: "Arc",
  rpc: "https://rpc.mainnet.arc.io",
  explorer: "https://explorer.arc.io",
  nativeCurrency: { name: "USDC", symbol: "USDC", decimals: 18 },
} as const;

export const BARC = {
  address: "0xCD78f7bd8A5095412BF820d7698b1aFb55924084",
  symbol: "$BARC",
  trade: "https://argus.world/token/0xCD78f7bd8A5095412BF820d7698b1aFb55924084",
} as const;

export const RALLY = {
  address: "0xffb20f430f409829fCA99FeA64D40979cF2aA799",
  name: "Bored Apex Rally Club",
  mint: "https://bored-apex-rally-club.nfts2.me/",
  supply: 10_000,
} as const;

export const USDC_ERC20 = "0x3600000000000000000000000000000000000000" as const;

export const CCTP = {
  domain: 26,
  tokenMessengerV2: "0x8FE6B999Dc680CcFDD5Bf7EB0974218be2542DAA",
  messageTransmitterV2: "0xE737e5cEBEEBa77EFE34D4aa090756590b1CE275",
} as const;

export const MIN_MAX_FEE_PER_GAS = 20_000_000_000n;
export const DEN_METER: string | undefined = undefined;
export const LICENSE: string | undefined = undefined;