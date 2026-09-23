import { useState } from "react";
import { Copy } from "lucide-react";
import { formatBarc, type BarcTier } from "@/config/utility";
import { addArc, judgeContract, readFeeQuote, readWalletSnapshot } from "@/lib/arc";

const tierOrder: BarcTier[] = ["pup", "pack", "wolf"];

function hasTier(current: BarcTier, required: BarcTier): boolean {
  return tierOrder.indexOf(current) >= tierOrder.indexOf(required);
}

function ToolCard({ required, title, children }: { required: BarcTier; title: string; children: React.ReactNode }) {
  return (
    <article className="rounded-card border border-line bg-surface p-5">
      <div className="flex items-start justify-between gap-4">
        <h3 className="text-base font-medium text-fg">{title}</h3>
        <span className="shrink-0 text-xs text-muted">{required} desk</span>
      </div>
      {children}
    </article>
  );
}

export function ToolDesk() {
  const [tier, setTier] = useState<BarcTier>("pup");
  const [balance, setBalance] = useState(0n);
  const [wallet, setWallet] = useState<string | null>(null);
  const [address, setAddress] = useState("");
  const [guard, setGuard] = useState("Paste an address to compare it.");
  const [score, setScore] = useState<string | null>(null);
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [payTo, setPayTo] = useState("");
  const [receipt, setReceipt] = useState("");
  const [fee, setFee] = useState<string | null>(null);

  async function refreshWallet() {
    const snapshot = await readWalletSnapshot(true);
    if (!snapshot) return;
    const nextTier = snapshot.onArc ? snapshot.tier : "pup";
    setWallet(snapshot.wallet);
    setBalance(snapshot.barcBalance);
    setTier(nextTier);
  }

  function runGuard() {
    const verdict = judgeContract(address);
    setGuard(verdict.kind === "good" ? "THIS IS $BARC" : "NOT THIS COIN");
  }

  async function runScore() {
    if (!wallet || !hasTier(tier, "pack")) return;
    const response = await fetch(`/api/score/${wallet}`);
    setScore(response.ok ? JSON.stringify(await response.json(), null, 2) : "Score is unavailable.");
  }

  function draftInvoice() {
    if (!hasTier(tier, "wolf")) return;
    const recipient = payTo || wallet || "connected wallet";
    setReceipt(
      `BARC pack receipt\nAmount: ${amount || "0"} USD\nNote: ${note || "none"}\nPay to: ${recipient}\n\nSuggested rail: native USDC on Arc for a simple wallet payment. Use an ERC-20 transfer only when a contract explicitly requires it.\nGas extra in USDC; this invoice is not $BARC.`,
    );
  }

  return (
    <section className="border-b border-line bg-bg">
      <div className="mx-auto w-full max-w-6xl px-5 py-16 sm:py-24">
        <p className="text-xs font-medium tracking-[0.16em] text-accent uppercase">Tool desk</p>
        <div className="mt-3 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="font-display text-4xl leading-none text-fg sm:text-5xl">The pass opens doors.</h2>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted">
              All tools stay visible. Holding $BARC on Arc decides which desk opens. These are access tiers, not investment tiers.
            </p>
          </div>
          <button type="button" onClick={() => void refreshWallet()} className="min-h-11 rounded-full border border-line px-4 text-sm text-fg hover:border-accent">
            Connect / refresh pass
          </button>
        </div>
        <p className="mt-5 text-sm text-muted">
          Current desk: <strong className="text-fg">{tier}</strong> · {formatBarc(balance)} $BARC
          {tier === "pup" ? " · Need 1,000 more $BARC for Pack desk." : tier === "pack" ? " · Need 99,000 more $BARC for Wolf desk." : " · Wolf desk open."}
        </p>
        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <ToolCard required="pup" title="Add Arc + USDC helper">
            <p className="mt-3 text-sm leading-relaxed text-muted">One USDC balance: native 18dp for gas and value, ERC-20 6dp for approve or transfer.</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <button type="button" onClick={() => void addArc()} className="min-h-10 rounded-full bg-fg px-4 text-sm font-medium text-deep hover:bg-accent">Add / switch Arc</button>
              <button type="button" onClick={() => void readFeeQuote().then((quote) => setFee(`About $${quote.cents} at ${quote.gasPriceGwei} gwei${quote.warning ? ` · ${quote.warning}` : ""}`)).catch(() => setFee("Fee quote unavailable."))} className="min-h-10 rounded-full border border-line px-4 text-sm text-fg hover:border-accent">Quote fee</button>
            </div>
            {fee ? <p className="mt-3 text-xs text-muted">{fee}</p> : null}
          </ToolCard>
          <ToolCard required="pup" title="CA guard">
            <input value={address} onChange={(event) => setAddress(event.target.value)} placeholder="Paste contract address" className="mt-4 min-h-11 w-full rounded-xl border border-line bg-deep px-3 text-sm text-fg placeholder:text-muted" />
            <button type="button" onClick={runGuard} className="mt-3 min-h-10 rounded-full border border-line px-4 text-sm text-fg hover:border-accent">Check</button>
            <p className="mt-3 text-sm text-muted">{guard}</p>
          </ToolCard>
          <ToolCard required="pack" title="Sunday desk / Pack lounge">
            <p className="mt-3 text-sm leading-relaxed text-muted">Extra raid angles, the full listing kit, and a “Not ARC token” explainer. Circle minted ARC is not $BARC.</p>
            {!hasTier(tier, "pack") ? <p className="mt-4 text-sm text-warn">Locked. Hold 1,000 $BARC for Pack access.</p> : <p className="mt-4 text-sm text-good">Pack lounge open.</p>}
          </ToolCard>
          <ToolCard required="pack" title="Custom raid">
            <p className="mt-3 text-sm leading-relaxed text-muted">The existing raid desk remains public. Custom xAI writing opens here for Pack wallets; pack-draft shuffle stays available without a key.</p>
            <p className="mt-4 text-sm text-muted">{hasTier(tier, "pack") ? "Custom raid access is open." : "Locked until this wallet reaches Pack."}</p>
          </ToolCard>
          <ToolCard required="pack" title="Score lite">
            <p className="mt-3 text-sm leading-relaxed text-muted">Canonical contract, bytecode presence, and holder balance only. No invented market data.</p>
            <button type="button" onClick={() => void runScore()} disabled={!hasTier(tier, "pack")} className="mt-4 min-h-10 rounded-full border border-line px-4 text-sm text-fg disabled:opacity-40">Read score</button>
            {score ? <pre className="mt-3 max-h-32 overflow-auto text-xs text-muted">{score}</pre> : null}
          </ToolCard>
          <ToolCard required="wolf" title="Invoice draft">
            <div className="mt-4 grid gap-2">
              <input value={amount} onChange={(event) => setAmount(event.target.value)} placeholder="Amount USD" className="min-h-10 rounded-xl border border-line bg-deep px-3 text-sm text-fg placeholder:text-muted" />
              <input value={note} onChange={(event) => setNote(event.target.value)} placeholder="Note" className="min-h-10 rounded-xl border border-line bg-deep px-3 text-sm text-fg placeholder:text-muted" />
              <input value={payTo} onChange={(event) => setPayTo(event.target.value)} placeholder={wallet || "Pay-to address"} className="min-h-10 rounded-xl border border-line bg-deep px-3 text-sm text-fg placeholder:text-muted" />
            </div>
            <button type="button" onClick={draftInvoice} disabled={!hasTier(tier, "wolf")} className="mt-3 min-h-10 rounded-full border border-line px-4 text-sm text-fg disabled:opacity-40">Draft receipt</button>
            {receipt ? <button type="button" onClick={() => void navigator.clipboard.writeText(receipt)} className="mt-3 ml-2 inline-flex min-h-10 items-center gap-2 text-sm text-accent"><Copy className="size-4" />Copy</button> : null}
            {receipt ? <pre className="mt-3 whitespace-pre-wrap text-xs leading-relaxed text-muted">{receipt}</pre> : null}
          </ToolCard>
        </div>
      </div>
    </section>
  );
}