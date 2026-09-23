import { useCallback, useEffect, useState } from "react";
import { BARC, DEN_METER, RALLY } from "@/config/assets";
import { addArc, getEthereum, MIN_MAX_FEE_PER_GAS } from "@/lib/arc";

export type Origin = "Gaia" | "Aurora" | "Cyber" | "Tempest";
export type RallyToken = { tokenId: string; origin: Origin | null; metadataUrl: string | null };

export type PackAccount = {
  address: string | null;
  chainId: number | null;
  onArc: boolean;
  barcBalance: bigint;
  barcDecimals: number;
  nativeUsdc: bigint;
  rallyTokens: RallyToken[];
  activeTokenId: string | null;
  quota: number;
  nftMultiplier: number;
  loading: boolean;
  error: string | null;
  refresh: (requestAccounts?: boolean) => Promise<void>;
  connect: () => Promise<void>;
  addArc: () => Promise<void>;
  setActiveTokenId: (tokenId: string) => void;
};

const ORIGINS: Origin[] = ["Gaia", "Aurora", "Cyber", "Tempest"];
const ERC20_BALANCE_OF = "0x70a08231";
const ERC20_DECIMALS = "0x313ce567";
const ERC721_BALANCE_OF = "0x70a08231";
const ERC721_TOKEN_OF_OWNER_BY_INDEX = "0x2f745c59";
const ERC721_TOKEN_URI = "0xc87b56dd";
const DEN_METER_STAKED_OF = "0x2e17de78";

function word(value: string): string {
  return value.replace(/^0x/, "").padStart(64, "0");
}

function callData(selector: string, ...args: string[]): string {
  return `${selector}${args.map(word).join("")}`;
}

function addressArg(address: string): string {
  return word(address.toLowerCase());
}

function decodeUint(value: unknown): bigint {
  const result = String(value || "0x0");
  return result === "0x" ? 0n : BigInt(result);
}

function decodeString(value: unknown): string | null {
  const raw = String(value || "0x").replace(/^0x/, "");
  if (!raw) return null;
  try {
    const offset = Number.parseInt(raw.slice(0, 64), 16) * 2;
    const length = Number.parseInt(raw.slice(offset, offset + 64), 16);
    const payload = raw.slice(offset + 64, offset + 64 + length * 2);
    const bytes = new Uint8Array(payload.match(/.{1,2}/g)?.map((byte) => Number.parseInt(byte, 16)) ?? []);
    return new TextDecoder().decode(bytes).replace(/\0+$/, "") || null;
  } catch {
    return null;
  }
}

function originFromMetadata(metadata: unknown): Origin | null {
  if (!metadata || typeof metadata !== "object") return null;
  const record = metadata as { origin?: unknown; attributes?: Array<{ trait_type?: unknown; value?: unknown }> };
  const direct = typeof record.origin === "string" ? record.origin : null;
  const trait = record.attributes?.find((item) => String(item.trait_type).toLowerCase() === "origin")?.value;
  const candidate = String(direct ?? trait ?? "");
  return ORIGINS.find((origin) => origin.toLowerCase() === candidate.toLowerCase()) ?? null;
}

function quotaForBalance(balance: bigint, decimals: number): number {
  const unit = 10n ** BigInt(decimals);
  if (balance >= 100_000n * unit) return 500;
  if (balance >= 1_000n * unit) return 50;
  return 5;
}

async function metadataOrigin(url: string | null): Promise<Origin | null> {
  if (!url || typeof fetch !== "function") return null;
  try {
    const response = await fetch(url.startsWith("ipfs://") ? `https://ipfs.io/ipfs/${url.slice(7)}` : url);
    if (!response.ok) return null;
    return originFromMetadata(await response.json());
  } catch {
    return null;
  }
}

export function usePackAccount(): PackAccount {
  const [account, setAccount] = useState<Omit<PackAccount, "refresh" | "connect" | "addArc" | "setActiveTokenId">>({
    address: null,
    chainId: null,
    onArc: false,
    barcBalance: 0n,
    barcDecimals: 18,
    nativeUsdc: 0n,
    rallyTokens: [],
    activeTokenId: null,
    quota: 5,
    nftMultiplier: 1,
    loading: false,
    error: null,
  });

  const refresh = useCallback(async (requestAccounts = false) => {
    const eth = getEthereum();
    if (!eth) {
      setAccount((current) => ({ ...current, error: "Connect an EVM wallet to enter the Den." }));
      return;
    }
    setAccount((current) => ({ ...current, loading: true, error: null }));
    try {
      const accounts = (await eth.request({ method: requestAccounts ? "eth_requestAccounts" : "eth_accounts" })) as string[];
      const address = accounts[0];
      const rawChainId = String(await eth.request({ method: "eth_chainId" }));
      const chainId = Number.parseInt(rawChainId, 16);
      if (!address) {
        setAccount((current) => ({ ...current, address: null, chainId, onArc: chainId === 5042, loading: false }));
        return;
      }
      if (chainId !== 5042) {
        setAccount((current) => ({ ...current, address, chainId, onArc: false, loading: false }));
        return;
      }
      const results = await Promise.all([
        eth.request({ method: "eth_call", params: [{ to: BARC.address, data: callData(ERC20_BALANCE_OF, addressArg(address)) }, "latest"] }),
        eth.request({ method: "eth_call", params: [{ to: BARC.address, data: ERC20_DECIMALS }, "latest"] }),
        eth.request({ method: "eth_getBalance", params: [address, "latest"] }),
        eth.request({ method: "eth_call", params: [{ to: RALLY.address, data: callData(ERC721_BALANCE_OF, addressArg(address)) }, "latest"] }),
        DEN_METER ? eth.request({ method: "eth_call", params: [{ to: DEN_METER, data: callData(DEN_METER_STAKED_OF, addressArg(address)) }, "latest"] }) : Promise.resolve(null),
      ]);
      const barcBalance = decodeUint(results[0]);
      const barcDecimals = Number(decodeUint(results[1]));
      const tokenCount = Number(decodeUint(results[3]));
      const stakedBalance = results[4] === null ? null : decodeUint(results[4]);
      const ids = await Promise.all(Array.from({ length: Math.min(tokenCount, 100) }, (_, index) =>
        eth.request({ method: "eth_call", params: [{ to: RALLY.address, data: callData(ERC721_TOKEN_OF_OWNER_BY_INDEX, addressArg(address), word(String(index))) }, "latest"] }).then(decodeUint),
      ));
      const rallyTokens = await Promise.all(ids.map(async (tokenId) => {
        const metadataRaw = await eth.request({ method: "eth_call", params: [{ to: RALLY.address, data: callData(ERC721_TOKEN_URI, word(tokenId.toString())) }, "latest"] });
        const metadataUrl = decodeString(metadataRaw);
        return { tokenId: tokenId.toString(), metadataUrl, origin: await metadataOrigin(metadataUrl) };
      }));
      const stored = typeof localStorage === "undefined" ? null : localStorage.getItem(`barc-active-rally:${address.toLowerCase()}`);
      const activeTokenId = rallyTokens.some((token) => token.tokenId === stored) ? stored : rallyTokens[0]?.tokenId ?? null;
      setAccount({ address, chainId, onArc: true, barcBalance, barcDecimals, nativeUsdc: decodeUint(results[2]), rallyTokens, activeTokenId, quota: quotaForBalance(stakedBalance ?? barcBalance, barcDecimals), nftMultiplier: rallyTokens.length ? 1.5 : 1, loading: false, error: null });
    } catch (error) {
      setAccount((current) => ({ ...current, loading: false, error: error instanceof Error ? error.message : "Could not read this wallet." }));
    }
  }, []);

  useEffect(() => { void refresh(); }, [refresh]);

  const setActiveTokenId = useCallback((tokenId: string) => {
    if (!account.address || !account.rallyTokens.some((token) => token.tokenId === tokenId)) return;
    localStorage.setItem(`barc-active-rally:${account.address.toLowerCase()}`, tokenId);
    setAccount((current) => ({ ...current, activeTokenId: tokenId }));
  }, [account.address, account.rallyTokens]);

  return { ...account, quota: Math.floor(account.quota * account.nftMultiplier), refresh, connect: () => refresh(true), addArc, setActiveTokenId };
}

export async function stakeBarc(amount: bigint): Promise<string> {
  if (!DEN_METER) throw new Error("DenMeter has not been deployed on Arc yet.");
  const eth = getEthereum();
  if (!eth) throw new Error("No wallet in this browser.");
  const accounts = (await eth.request({ method: "eth_requestAccounts" })) as string[];
  const from = accounts[0];
  if (!from || amount <= 0n) throw new Error("Enter a positive $BARC amount.");
  const approveData = `0x095ea7b3${addressArg(DEN_METER)}${word(amount.toString(16))}`;
  await eth.request({ method: "eth_sendTransaction", params: [{ from, to: BARC.address, data: approveData, maxFeePerGas: `0x${MIN_MAX_FEE_PER_GAS.toString(16)}` }] });
  const stakeData = `0xa694fc3a${word(amount.toString(16))}`;
  await eth.request({ method: "eth_call", params: [{ from, to: DEN_METER, data: stakeData }, "latest"] });
  return String(await eth.request({ method: "eth_sendTransaction", params: [{ from, to: DEN_METER, data: stakeData, maxFeePerGas: `0x${MIN_MAX_FEE_PER_GAS.toString(16)}` }] }));
}