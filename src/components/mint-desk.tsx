import { useEffect, useState } from "react";
import { ExternalLink } from "lucide-react";
import { RALLY } from "@/config/assets";
import { addArc, readWalletSnapshot } from "@/lib/arc";
import {
  formatNativeUsdc,
  mintRallyWolves,
  readRallyMintState,
  RALLY_EXPLORER,
  type RallyMintState,
} from "@/lib/rally-mint";

function shortAddress(value: string): string {
  return `${value.slice(0, 6)}...${value.slice(-4)}`;
}

export function MintDesk({ compact = false }: { compact?: boolean }) {
  const [amount, setAmount] = useState(1);
  const [affiliate, setAffiliate] = useState("");
  const [wallet, setWallet] = useState<string | null>(null);
  const [onArc, setOnArc] = useState(false);
  const [state, setState] = useState<RallyMintState | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [hash, setHash] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function refresh(requestAccounts = false) {
    setError(null);
    try {
      const snapshot = await readWalletSnapshot(requestAccounts);
      setWallet(snapshot?.wallet ?? null);
      setOnArc(Boolean(snapshot?.onArc));
      setState(await readRallyMintState(snapshot?.wallet));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not read the Rally Club contract.");
    }
  }

  useEffect(() => {
    void refresh();
  }, []);

  async function onMint() {
    setBusy(true);
    setError(null);
    setHash(null);
    setStatus("Asking the wallet to mint on Arc…");
    try {
      if (!onArc) await addArc();
      const next = await mintRallyWolves(amount, affiliate);
      setHash(next);
      setStatus("Mint sent. The wolf lands after the next Arc block.");
      await refresh();
    } catch (err) {
      setStatus(null);
      setError(err instanceof Error ? err.message : "The wallet rejected the mint.");
    } finally {
      setBusy(false);
    }
  }

  const total = state ? state.feeForOne * BigInt(amount) + state.protocolFee * BigInt(amount) : null;
  const remaining = state && state.size > 0n ? state.size - state.minted : null;

  return (
    <section id="mint" className="scroll-mt-24 border-b border-line bg-bg">
      <div className="mx-auto w-full max-w-6xl px-5 py-16 sm:py-24">
        <p className="text-xs font-medium tracking-[0.16em] text-accent uppercase">Rally Club mint</p>
        <div className="mt-3 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="font-display text-4xl leading-none text-fg sm:text-5xl">
              {compact ? "Mint the seat." : "Mint a wolf. Take a seat in the Den."}
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted">
              Bored Apex Rally Club is a 10,000 PFP pack on Arc. The wolf is the account. $BARC is the meter.
              Gas and mint price settle in USDC. Official drop page stays on NFTs2Me if you want their widget.
            </p>
          </div>
          <a
            href={RALLY.mint}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-11 items-center gap-2 rounded-full border border-line px-4 text-sm text-fg hover:border-accent"
          >
            Official mint page <ExternalLink className="size-4" />
          </a>
        </div>
        <div className="mt-8 grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
          <article className="rounded-card border border-line bg-surface p-5 sm:p-8">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-xs tracking-[0.16em] text-muted uppercase">Mint from this site</p>
              <button type="button" onClick={() => void refresh(true)} className="text-sm text-accent">
                {wallet ? shortAddress(wallet) : "Connect wallet"}
              </button>
            </div>
            <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
              <Stat label="Minted" value={state ? state.minted.toLocaleString() : "\u2014"} />
              <Stat label="Supply" value={state && state.size > 0n ? state.size.toLocaleString() : "10,000"} />
              <Stat label="Left" value={remaining !== null ? remaining.toLocaleString() : "\u2014"} />
              <Stat label="Your wolves" value={state ? state.owned.toString() : "\u2014"} />
            </div>
            <label className="mt-6 block text-xs text-muted" htmlFor="mint-amount">How many</label>
            <div className="mt-2 flex items-center gap-3">
              <input id="mint-amount" type="number" min={1} max={20} value={amount} onChange={(event) => setAmount(Math.min(20, Math.max(1, Number(event.target.value) || 1)))} className="min-h-12 w-24 rounded-xl border border-line bg-deep px-3 text-fg" />
              <p className="text-sm text-muted">{state ? `${formatNativeUsdc(state.feeForOne)} USDC each${state.protocolFee ? ` + ${formatNativeUsdc(state.protocolFee)} protocol` : ""}` : "Reading live USDC price from Arc\u2026"}</p>
            </div>
            <label className="mt-5 block text-xs text-muted" htmlFor="mint-affiliate">Referral wallet \u00b7 optional \u00b7 0.1 USDC per mint on NFTs2Me</label>
            <input id="mint-affiliate" value={affiliate} onChange={(event) => setAffiliate(event.target.value)} placeholder="0x\u2026" className="mt-2 min-h-12 w-full rounded-xl border border-line bg-deep px-3 text-sm text-fg placeholder:text-muted" />
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <button type="button" onClick={() => void onMint()} disabled={busy} className="inline-flex min-h-12 items-center rounded-full bg-fg px-5 text-sm font-medium text-deep hover:bg-accent disabled:opacity-50">
                {busy ? "Minting" : total !== null ? `Mint \u00b7 ${formatNativeUsdc(total)} USDC` : "Mint on Arc"}
              </button>
              {!onArc && wallet ? <button type="button" onClick={() => void addArc().then(() => refresh())} className="text-sm text-accent">Switch to Arc</button> : null}
            </div>
            {state && !state.open ? <p className="mt-4 text-sm text-warn">The contract currently reports the public sale as closed.</p> : null}
            {status ? <p className="mt-4 text-sm text-good">{status}</p> : null}
            {hash ? <a href={`https://explorer.arc.io/tx/${hash}`} target="_blank" rel="noreferrer" className="mt-2 inline-flex text-sm text-accent">View transaction</a> : null}
            {error ? <p className="mt-4 text-sm text-bad">{error}</p> : null}
            <p className="mt-6 text-xs leading-relaxed text-muted">This tool calls the live Rally Club contract {RALLY.address} on Arc 5042. You pay native USDC. The site never holds a key. Match the address on the official mint page before you sign.</p>
          </article>
          <aside className="grid gap-4">
            <article className="rounded-card border border-line bg-surface p-5">
              <p className="text-xs tracking-[0.16em] text-muted uppercase">What the wolf is for</p>
              <ul className="mt-4 space-y-3 text-sm leading-relaxed text-muted">
                <li><span className="text-fg">Seat.</span> Origin rooms in the Den open on the wolf you hold — Gaia, Aurora, Cyber, Tempest.</li>
                <li><span className="text-fg">License.</span> Commercial rights to that face. Register the certificate when LicenseRegistry is live.</li>
                <li><span className="text-fg">Meter boost.</span> A Rally holder multiplies the $BARC daily quota by 1.5.</li>
              </ul>
              <a href="/den" className="mt-5 inline-flex min-h-11 items-center text-sm text-accent">Open the Den →</a>
            </article>
            <article className="rounded-card border border-line bg-surface p-5">
              <p className="text-xs tracking-[0.16em] text-muted uppercase">Contracts</p>
              <p className="mt-3 break-all font-mono text-xs text-ice">{RALLY.address}</p>
              <div className="mt-4 flex flex-wrap gap-4 text-sm">
                <a href={RALLY.mint} target="_blank" rel="noreferrer" className="text-accent">nfts2.me</a>
                <a href={RALLY_EXPLORER} target="_blank" rel="noreferrer" className="text-accent">Explorer</a>
              </div>
            </article>
          </aside>
        </div>
      </div>
    </section>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-muted">{label}</p>
      <p className="mt-1 font-display text-3xl leading-none text-fg">{value}</p>
    </div>
  );
}
