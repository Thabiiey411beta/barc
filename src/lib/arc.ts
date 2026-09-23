import { CONTRACT } from "@/content/launch";
import { BARC, type BarcTier, tierForBalance } from "@/config/utility";
import { ARC, MIN_MAX_FEE_PER_GAS } from "@/config/assets";

export { MIN_MAX_FEE_PER_GAS };

export const BARC_ADDRESS = BARC.address.toLowerCase();

/** Other tickers that use the same letters. Not this coin. */
export const LOOKALIKES: Record<string, string> = {
  "0x4753c45fb550fecaa143a47968659117e6ffc2ce":
    "Different $BARC. Genesis-wallet story on barcdog.com. Not this page.",
  "0x1d26cfecc3792f18b70d409f104d38917f4f0df5": "Different $BARC ticker on Arc. Not this contract.",
  "0x997caf127536de5410dc7a17a920d0a1223d866d": "Different $BARC ticker on Arc. Not this contract.",
};

export const ARC_CHAIN = {
  chainId: `0x${ARC.id.toString(16)}`,
  chainName: ARC.name,
  nativeCurrency: ARC.nativeCurrency,
  rpcUrls: [ARC.rpc],
  blockExplorerUrls: [ARC.explorer],
} as const;

export const EXPLORER_ADDRESS = `https://explorer.arc.io/address/${CONTRACT}`;
export const ALT_RPC = "https://rpc.arc-scan.org";

export function norm(addr: string): string {
  return addr.trim().toLowerCase();
}

export function isAddress(addr: string): boolean {
  return /^0x[a-f0-9]{40}$/.test(addr);
}

export type CaVerdict = { kind: "good" | "warn" | "bad"; text: string };

export function judgeContract(raw: string): CaVerdict {
  const address = norm(raw);
  if (!isAddress(address)) return { kind: "bad", text: "That does not look like an address." };
  if (address === BARC_ADDRESS) return { kind: "good", text: "This is the $BARC this page means." };
  const other = LOOKALIKES[address];
  if (other) return { kind: "warn", text: other };
  return { kind: "bad", text: "Unknown contract. Not the $BARC on this page." };
}

/** Native USDC on Arc uses 18 decimals, same as gas. */
export function parseUsdc(amount: string): bigint | null {
  const trimmed = amount.trim();
  if (!/^\d+(\.\d+)?$/.test(trimmed)) return null;
  const [whole, frac = ""] = trimmed.split(".");
  if (frac.length > 18 || whole.length > 12) return null;
  const padded = (frac + "0".repeat(18)).slice(0, 18);
  const value = BigInt(whole) * 10n ** 18n + BigInt(padded);
  return value > 0n ? value : null;
}

type Eip1193 = {
  request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
  on?: (event: string, listener: () => void) => void;
  removeListener?: (event: string, listener: () => void) => void;
};

export function getEthereum(): Eip1193 | null {
  if (typeof window === "undefined") return null;
  const eth = (window as Window & { ethereum?: Eip1193 }).ethereum;
  return eth && typeof eth.request === "function" ? eth : null;
}

function messageOf(err: unknown): string {
  if (err && typeof err === "object" && "message" in err && typeof err.message === "string") return err.message;
  return "The wallet rejected that.";
}

export async function addArc(): Promise<void> {
  const eth = getEthereum();
  if (!eth) throw new Error("No wallet in this browser. Use MetaMask, Rabby, or another EVM wallet.");
  try {
    await eth.request({ method: "wallet_switchEthereumChain", params: [{ chainId: ARC_CHAIN.chainId }] });
  } catch (err) {
    const code = err && typeof err === "object" && "code" in err ? err.code : undefined;
    if (code !== 4902) throw new Error(messageOf(err));
    try {
      await eth.request({ method: "wallet_addEthereumChain", params: [ARC_CHAIN] });
    } catch (addError) {
      throw new Error(messageOf(addError));
    }
  }
}

function onArc(chainId: string): boolean {
  return chainId.toLowerCase() === ARC_CHAIN.chainId || Number.parseInt(chainId, 16) === 5042;
}

export async function ensureArc(): Promise<Eip1193> {
  const eth = getEthereum();
  if (!eth) throw new Error("No wallet in this browser.");
  const chainId = String(await eth.request({ method: "eth_chainId" }));
  if (!onArc(chainId)) {
    await addArc();
    const again = String(await eth.request({ method: "eth_chainId" }));
    if (!onArc(again)) throw new Error("Switch to Arc (chain 5042) and try again.");
  }
  return eth;
}

export type WalletSnapshot = {
  wallet: string;
  chainId: number | null;
  onArc: boolean;
  nativeUsdc: bigint;
  barcBalance: bigint;
  tier: BarcTier;
};

export type FeeQuote = { cents: string; gasPriceGwei: string; warning: string | null };

export async function readFeeQuote(): Promise<FeeQuote> {
  const eth = getEthereum();
  if (!eth) throw new Error("Connect an EVM wallet to read the Arc fee floor.");
  const raw = BigInt(String(await eth.request({ method: "eth_gasPrice" })));
  const effective = raw < MIN_MAX_FEE_PER_GAS ? MIN_MAX_FEE_PER_GAS : raw;
  const cents = Number(effective * 21_000n * 100n / 10n ** 18n) / 100;
  const gwei = Number(effective) / 1e9;
  return {
    cents: cents.toFixed(2),
    gasPriceGwei: gwei.toFixed(2),
    warning: raw < MIN_MAX_FEE_PER_GAS ? "Arc fee quote was clamped to Arc's 20 gwei floor." : null,
  };
}

function encodeBalanceOf(wallet: string): string {
  return `0x70a08231${wallet.slice(2).toLowerCase().padStart(64, "0")}`;
}

export async function readPack(): Promise<{ wallet: string; balance: bigint }> {
  const eth = await ensureArc();
  const accounts = (await eth.request({ method: "eth_requestAccounts" })) as string[];
  const wallet = accounts[0];
  if (!wallet || !isAddress(norm(wallet))) throw new Error("The wallet did not return an account.");
  const result = String(
    await eth.request({
      method: "eth_call",
      params: [{ to: BARC.address, data: encodeBalanceOf(wallet) }, "latest"],
    }),
  );
  const balance = !result || result === "0x" ? 0n : BigInt(result);
  return { wallet, balance };
}

export async function readWalletSnapshot(requestAccounts = false): Promise<WalletSnapshot | null> {
  const eth = getEthereum();
  if (!eth) return null;
  const accounts = (await eth.request({ method: requestAccounts ? "eth_requestAccounts" : "eth_accounts" })) as string[];
  const wallet = accounts[0];
  if (!wallet || !isAddress(norm(wallet))) return null;
  const rawChainId = String(await eth.request({ method: "eth_chainId" }));
  const chainId = Number.parseInt(rawChainId, 16);
  const onArc = chainId === BARC.chainId;
  if (!onArc) {
    return { wallet, chainId, onArc, nativeUsdc: 0n, barcBalance: 0n, tier: "pup" };
  }
  const [nativeResult, barcResult] = await Promise.all([
    eth.request({ method: "eth_getBalance", params: [wallet, "latest"] }),
    eth.request({ method: "eth_call", params: [{ to: BARC.address, data: encodeBalanceOf(wallet) }, "latest"] }),
  ]);
  const nativeUsdc = BigInt(String(nativeResult || "0x0"));
  const barcBalance = BigInt(String(barcResult || "0x0"));
  return { wallet, chainId, onArc, nativeUsdc, barcBalance, tier: tierForBalance(barcBalance) };
}

export async function sendNative(to: string, amount: bigint): Promise<string> {
  const eth = await ensureArc();
  const accounts = (await eth.request({ method: "eth_requestAccounts" })) as string[];
  const from = accounts[0];
  if (!from) throw new Error("The wallet did not return an account.");
  const hash = await eth.request({
    method: "eth_sendTransaction",
    params: [{ from, to, value: `0x${amount.toString(16)}` }],
  });
  return String(hash);
}
