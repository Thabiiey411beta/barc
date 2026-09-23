import { BARC } from "../src/config/utility";

const rpcUrl = process.env.BARC_RPC_URL || "https://rpc.mainnet.arc.io";
const expectedAddress = BARC.address.toLowerCase();
const requestHits = new Map<string, number[]>();

export function allowRequest(key: string): boolean {
  const now = Date.now();
  const hits = requestHits.get(key) || [];
  while (hits.length && now - hits[0] > 60_000) hits.shift();
  if (hits.length >= 60) return false;
  hits.push(now);
  requestHits.set(key, hits);
  return true;
}

async function rpc(method: string, params: unknown[] = []): Promise<unknown> {
  const response = await fetch(rpcUrl, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ jsonrpc: "2.0", id: 1, method, params }),
  });
  if (!response.ok) throw new Error(`Arc RPC returned ${response.status}`);
  const body = (await response.json()) as { result?: unknown; error?: { message?: string } };
  if (body.error) throw new Error(body.error.message || "Arc RPC error");
  return body.result;
}

function encodeBalanceOf(wallet: string): string {
  return `0x70a08231${wallet.slice(2).toLowerCase().padStart(64, "0")}`;
}

function encodeDecimals(): string {
  return "0x313ce567";
}

export function isWallet(value: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(value);
}

export async function readBarc(wallet: string) {
  if (!isWallet(wallet)) throw new Error("Invalid wallet address");
  const [balance, blockNumber, decimals, code] = await Promise.all([
    rpc("eth_call", [{ to: BARC.address, data: encodeBalanceOf(wallet) }, "latest"]),
    rpc("eth_blockNumber"),
    rpc("eth_call", [{ to: BARC.address, data: encodeDecimals() }, "latest"]),
    rpc("eth_getCode", [BARC.address, "latest"]),
  ]);
  return {
    wallet,
    isCanonicalBarc: BARC.address.toLowerCase() === expectedAddress,
    balance: BigInt(String(balance || "0x0")),
    decimals: Number.parseInt(String(decimals || "0x12"), 16),
    blockNumber: Number.parseInt(String(blockNumber || "0x0"), 16),
    codePresent: String(code || "0x") !== "0x",
  };
}

export async function rpcIsReachable(): Promise<boolean> {
  await rpc("eth_blockNumber");
  return true;
}