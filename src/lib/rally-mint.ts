import { keccak_256 } from "@noble/hashes/sha3.js";
import { bytesToHex } from "@noble/hashes/utils.js";
import { RALLY } from "@/config/assets";
import { ensureArc, getEthereum, isAddress, MIN_MAX_FEE_PER_GAS, norm } from "@/lib/arc";

function selector(signature: string): `0x${string}` {
  return `0x${bytesToHex(keccak_256(new TextEncoder().encode(signature))).slice(0, 8)}`;
}

function word(value: string | bigint | number): string {
  const hex = typeof value === "string" && value.startsWith("0x") ? value.slice(2) : BigInt(value).toString(16);
  return hex.replace(/^0x/, "").padStart(64, "0");
}

function addressArg(address: string): string {
  return word(address.toLowerCase());
}

function callData(sel: string, ...args: Array<string | bigint | number>): string {
  return `${sel}${args.map((arg) => (typeof arg === "string" && arg.length === 64 ? arg : word(arg))).join("")}`;
}

function decodeUint(value: unknown): bigint {
  const result = String(value || "0x0");
  return result === "0x" || result === "0x0" ? 0n : BigInt(result);
}

function decodeBool(value: unknown): boolean {
  return decodeUint(value) !== 0n;
}

const SEL = {
  mintAmount: selector("mint(uint256)"),
  mintAmountAffiliate: selector("mint(uint256,address)"),
  mintFee: selector("mintFee(uint256)"),
  protocolFee: selector("protocolFee()"),
  collectionSize: selector("collectionSize()"),
  totalSupply: selector("totalSupply()"),
  isOpen: selector("isOpen()"),
  maxPerAddress: selector("maxPerAddress()"),
  balanceOf: selector("balanceOf(address)"),
} as const;

export type RallyMintState = {
  open: boolean;
  minted: bigint;
  size: bigint;
  feeForOne: bigint;
  protocolFee: bigint;
  maxPerAddress: bigint;
  owned: bigint;
};

export function formatNativeUsdc(value: bigint, digits = 2): string {
  const whole = value / 10n ** 18n;
  const fraction = (value % 10n ** 18n).toString().padStart(18, "0").slice(0, digits);
  return fraction.replace(/0+$/, "").length === 0 ? whole.toLocaleString() : `${whole.toLocaleString()}.${fraction.replace(/0+$/, "")}`;
}

async function rpcCall(to: string, data: string): Promise<unknown> {
  const response = await fetch("https://rpc.mainnet.arc.io", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ jsonrpc: "2.0", id: 1, method: "eth_call", params: [{ to, data }, "latest"] }),
  });
  if (!response.ok) throw new Error("Arc RPC could not read the Rally Club contract.");
  const payload = (await response.json()) as { result?: unknown; error?: { message?: string } };
  if (payload.error) throw new Error(payload.error.message || "Arc RPC rejected the call.");
  return payload.result;
}

async function ethCall(to: string, data: string): Promise<unknown> {
  const eth = getEthereum();
  if (eth) {
    try {
      return await eth.request({ method: "eth_call", params: [{ to, data }, "latest"] });
    } catch {
      return rpcCall(to, data);
    }
  }
  return rpcCall(to, data);
}

export async function readRallyMintState(wallet?: string | null): Promise<RallyMintState> {
  const amountOne = 1n;
  const [open, minted, size, feeForOne, protocol, maxPerAddress, owned] = await Promise.all([
    ethCall(RALLY.address, SEL.isOpen).then(decodeBool),
    ethCall(RALLY.address, SEL.totalSupply).then(decodeUint),
    ethCall(RALLY.address, SEL.collectionSize).then(decodeUint),
    ethCall(RALLY.address, callData(SEL.mintFee, amountOne)).then(decodeUint),
    ethCall(RALLY.address, SEL.protocolFee).then(decodeUint).catch(() => 0n),
    ethCall(RALLY.address, SEL.maxPerAddress).then(decodeUint),
    wallet && isAddress(norm(wallet))
      ? ethCall(RALLY.address, callData(SEL.balanceOf, addressArg(wallet))).then(decodeUint)
      : Promise.resolve(0n),
  ]);
  return { open, minted, size, feeForOne, protocolFee: protocol, maxPerAddress, owned };
}

export async function mintRallyWolves(amount: number, affiliate?: string): Promise<string> {
  if (!Number.isInteger(amount) || amount < 1 || amount > 20) {
    throw new Error("Mint between 1 and 20 wolves in one pass.");
  }
  const eth = await ensureArc();
  const accounts = (await eth.request({ method: "eth_requestAccounts" })) as string[];
  const from = accounts[0];
  if (!from) throw new Error("The wallet did not return an account.");

  const qty = BigInt(amount);
  const fee = decodeUint(await eth.request({
    method: "eth_call",
    params: [{ to: RALLY.address, data: callData(SEL.mintFee, qty), from }, "latest"],
  }));
  const protocol = decodeUint(await eth.request({
    method: "eth_call",
    params: [{ to: RALLY.address, data: SEL.protocolFee }, "latest"],
  }).catch(() => "0x0"));

  const value = fee + protocol * qty;
  const cleanAffiliate = affiliate?.trim() ? norm(affiliate.trim()) : "";
  const data =
    cleanAffiliate && isAddress(cleanAffiliate)
      ? callData(SEL.mintAmountAffiliate, qty, addressArg(cleanAffiliate))
      : callData(SEL.mintAmount, qty);

  await eth.request({
    method: "eth_call",
    params: [{ from, to: RALLY.address, data, value: `0x${value.toString(16)}` }, "latest"],
  });

  return String(
    await eth.request({
      method: "eth_sendTransaction",
      params: [
        {
          from,
          to: RALLY.address,
          data,
          value: `0x${value.toString(16)}`,
          maxFeePerGas: `0x${MIN_MAX_FEE_PER_GAS.toString(16)}`,
        },
      ],
    }),
  );
}

export const RALLY_EXPLORER = `https://explorer.arc.io/address/${RALLY.address}`;
export const RALLY_SCAN = `https://arc.etherscan.io/address/${RALLY.address}`;
