import { useState } from "react";
import { TICKER } from "@/content/barc";
import { ARGUS_URL, CONTRACT } from "@/content/launch";
import { EXPLORER_ADDRESS, addArc } from "@/lib/arc";

const FACTS = [
  { k: "Chain", v: "5042", s: "Arc mainnet" },
  { k: "Gas", v: "USDC", s: "18 decimals" },
  { k: "Supply", v: "1B", s: "Argus launch" },
  { k: "Key", v: "Pack", s: "holds $BARC" },
];

export function Hero() {
  const [copied, setCopied] = useState(false);
  const [net, setNet] = useState<string | null>(null);

  async function copyCa() {
    try {
      await navigator.clipboard.writeText(CONTRACT);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1400);
    } catch {
      setCopied(false);
    }
  }

  async function onAdd() {
    try {
      await addArc();
      setNet("Arc is in the wallet.");
    } catch (err) {
      setNet(err instanceof Error ? err.message : "Could not add Arc.");
    }
  }

  return (
    <>
      <section id="top" className="border-b border-line">
        <div className="grid lg:min-h-[calc(100vh-4rem)] lg:grid-cols-2">
          <div className="relative order-1 min-h-80 lg:order-2 lg:min-h-full">
            <img
              src="/barc-mark.jpg"
              alt="Silver husky, mouth open, the BARC mark, on deep navy"
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="wolf-scrim pointer-events-none absolute inset-0" />
          </div>
          <div className="order-2 flex flex-col justify-center px-5 py-14 sm:px-8 lg:order-1 lg:px-12 lg:py-20">
            <p className="text-xs font-medium tracking-[0.16em] text-muted uppercase">Community coin · Arc · Argus</p>
            <h1 className="mt-4 max-w-[14ch] font-display text-5xl leading-[0.95] text-fg sm:text-7xl">
              Every new chain gets a dog before it gets a bank.
            </h1>
            <div className="mt-6 max-w-md space-y-3 text-lg leading-snug text-ice">
              <p>Circle built Arc for payments. $BARC is the husky that showed up anyway.</p>
              <p className="text-base leading-relaxed text-muted">
                Not Circle. Not the official token. A community coin on Argus — the pack key for the tools on this page.
              </p>
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => void onAdd()}
                className="inline-flex min-h-11 items-center justify-center rounded-full bg-fg px-5 text-sm font-medium text-deep hover:bg-accent"
              >
                Add Arc to wallet
              </button>
              <a
                href="#tools"
                className="inline-flex min-h-11 items-center justify-center rounded-full border border-line px-5 text-sm font-medium text-fg hover:border-accent"
              >
                Verify a contract
              </a>
            </div>
            {net ? <p className="mt-3 max-w-md text-sm text-muted">{net}</p> : null}
            <div className="mt-8 rounded-card border border-line bg-surface p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-xs tracking-[0.16em] text-muted uppercase">The contract we mean</p>
                  <p className="mt-2 break-all text-sm leading-relaxed text-ice">{CONTRACT}</p>
                </div>
                <button
                  type="button"
                  onClick={() => void copyCa()}
                  className="inline-flex min-h-11 shrink-0 items-center rounded-full bg-fg px-4 text-sm font-medium text-deep hover:bg-accent"
                >
                  {copied ? "Copied" : "Copy"}
                </button>
              </div>
              <div className="mt-3 flex flex-wrap gap-4">
                <a href={ARGUS_URL} target="_blank" rel="noopener noreferrer" className="text-sm text-accent">
                  Argus
                </a>
                <a href={EXPLORER_ADDRESS} target="_blank" rel="noopener noreferrer" className="text-sm text-accent">
                  Explorer
                </a>
              </div>
            </div>
            <p className="mt-3 max-w-md text-xs leading-relaxed text-muted">
              There is more than one dog on Arc. If someone DMs you a different address and says it is the same one, it
              is not.
            </p>
          </div>
        </div>
      </section>
      <section className="grid grid-cols-2 divide-x divide-y divide-line border-b border-line sm:grid-cols-4 sm:divide-y-0" aria-label="Chain facts">
        {FACTS.map((fact) => (
          <div key={fact.k} className="px-5 py-5 sm:py-6">
            <p className="text-xs tracking-[0.16em] text-muted uppercase">{fact.k}</p>
            <p className="mt-1 font-display text-4xl leading-none text-fg">{fact.v}</p>
            <p className="mt-1 text-xs text-muted">{fact.s}</p>
          </div>
        ))}
      </section>
      <div className="overflow-hidden border-b border-line" aria-hidden="true">
        <div className="barc-ticker flex w-max py-3">
          <p className="px-4 text-xs tracking-[0.14em] text-muted whitespace-nowrap uppercase">{TICKER.repeat(4)}</p>
          <p className="px-4 text-xs tracking-[0.14em] text-muted whitespace-nowrap uppercase">{TICKER.repeat(4)}</p>
        </div>
      </div>
    </>
  );
}
