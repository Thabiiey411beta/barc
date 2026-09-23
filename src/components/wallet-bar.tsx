import { useEffect, useState } from "react";
import { formatBarc } from "@/config/utility";
import { addArc, getEthereum, readWalletSnapshot, type WalletSnapshot } from "@/lib/arc";

function formatUsdc(value: bigint): string {
  const whole = value / 10n ** 18n;
  const fraction = (value % 10n ** 18n).toString().padStart(18, "0").slice(0, 2);
  return fraction === "00" ? whole.toLocaleString() : `${whole.toLocaleString()}.${fraction}`;
}

function shortAddress(address: string): string {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function WalletBar() {
  const [snapshot, setSnapshot] = useState<WalletSnapshot | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function refresh(requestAccounts = false) {
    setBusy(requestAccounts);
    setMessage(null);
    try {
      setSnapshot(await readWalletSnapshot(requestAccounts));
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Could not read the wallet.");
    } finally {
      setBusy(false);
    }
  }

  async function connect() {
    try {
      await refresh(true);
      const next = await readWalletSnapshot();
      if (next && !next.onArc) await addArc();
      await refresh();
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Could not connect the wallet.");
    }
  }

  useEffect(() => {
    void refresh();
    const ethereum = getEthereum();
    if (!ethereum || !("on" in ethereum)) return;
    const handleWalletChange = () => void refresh();
    ethereum.on?.("accountsChanged", handleWalletChange);
    ethereum.on?.("chainChanged", handleWalletChange);
    return () => {
      ethereum.removeListener?.("accountsChanged", handleWalletChange);
      ethereum.removeListener?.("chainChanged", handleWalletChange);
    };
  }, []);

  return (
    <section className="border-b border-line bg-bg" aria-label="Wallet access">
      <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center gap-3 px-5 py-3">
        <button
          type="button"
          onClick={() => void connect()}
          disabled={busy}
          className="inline-flex min-h-10 items-center rounded-full bg-fg px-4 text-sm font-medium text-deep hover:bg-accent disabled:opacity-50"
        >
          {busy ? "Reading" : snapshot ? shortAddress(snapshot.wallet) : "Connect wallet"}
        </button>
        <span className={`rounded-full border px-3 py-2 text-xs ${snapshot?.onArc ? "border-good text-good" : "border-line text-muted"}`}>
          {snapshot?.onArc ? "Arc · 5042" : snapshot ? "Wrong chain" : "Arc · wallet optional"}
        </span>
        {snapshot && !snapshot.onArc ? (
          <button type="button" onClick={() => void addArc().then(() => refresh())} className="text-sm text-accent">
            Add / switch Arc
          </button>
        ) : null}
        {snapshot?.onArc ? (
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted">
            <span>USDC gas: <strong className="font-medium text-fg">{formatUsdc(snapshot.nativeUsdc)}</strong></span>
            <span>$BARC: <strong className="font-medium text-fg">{formatBarc(snapshot.barcBalance)}</strong></span>
            <span className="text-accent">{snapshot.tier} access</span>
          </div>
        ) : null}
        <p className="basis-full text-xs text-muted sm:basis-auto">Gas is USDC. The pass is $BARC.</p>
        {message ? <p className="basis-full text-xs text-bad sm:basis-auto">{message}</p> : null}
      </div>
    </section>
  );
}