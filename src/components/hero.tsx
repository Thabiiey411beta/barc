import { useState } from "react";
import { TICKER } from "@/content/barc";
import { ARGUS_URL, CONTRACT } from "@/content/launch";

const STATS = [
  { k: "Supply", v: "1B", s: "Argus launch" },
  { k: "Tax", v: "Argus", s: "set at launch" },
  { k: "Chain", v: "Arc", s: "gas in USDC" },
  { k: "Pool", v: "Live", s: "on Argus" },
];

export function Hero() {
  const [hear, setHear] = useState<"bark" | "arc">("bark");

  return (
    <>
      <section id="top" className="border-b border-line">
        <div className="grid lg:min-h-[calc(100vh-4rem)] lg:grid-cols-2">
          <div className="relative order-1 min-h-72 lg:order-2 lg:min-h-full">
            <img
              src="/barc-mark.jpg"
              alt="Silver howling wolf, the BARC mark, on deep navy"
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="wolf-scrim pointer-events-none absolute inset-0" />
          </div>
          <div className="order-2 flex flex-col justify-center px-5 py-12 sm:px-8 lg:order-1 lg:px-10 lg:py-16">
            <p className="text-xs font-medium tracking-widest text-accent uppercase">Live on Argus · Arc</p>
            <h1 className="mt-3 font-display text-6xl leading-none tracking-tight text-fg sm:text-8xl">$BARC</h1>
            <p className="mt-4 max-w-md text-lg leading-snug text-fg sm:text-xl">
              They named the chain Arc. The wolf heard bark.
            </p>
            <div className="mt-6 flex flex-wrap gap-2" role="group" aria-label="How to hear the ticker">
              <HearChip current={hear} value="bark" label="Bark" onPick={setHear} />
              <HearChip current={hear} value="arc" label="Arc" onPick={setHear} />
            </div>
            <p className="mt-4 font-display text-6xl leading-none tracking-wide text-fg sm:text-7xl">
              {hear === "bark" ? "BARK" : "ARC"}
            </p>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-muted">
              {hear === "bark"
                ? "Said correctly. Jaw open. That is the ticker."
                : "Said like the chain. Drop the B and you are on someone else’s rails."}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="#raid"
                className="inline-flex min-h-11 items-center justify-center rounded-full bg-fg px-5 text-sm font-medium text-deep transition-colors duration-200 hover:bg-accent"
              >
                Get raid tweets
              </a>
              <a
                href={ARGUS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-11 items-center justify-center rounded-full border border-line px-5 text-sm font-medium text-fg transition-colors duration-200 hover:border-accent"
              >
                Trade on Argus
              </a>
            </div>
            <div className="mt-8 rounded-card border border-line bg-surface p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-xs tracking-widest text-muted uppercase">Contract · Arc</p>
                  <p className="mt-1 break-all text-sm leading-relaxed text-fg">{CONTRACT}</p>
                </div>
                <CopyCa />
              </div>
              <a
                href={ARGUS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex min-h-11 items-center text-sm text-accent"
              >
                View on Argus
              </a>
            </div>
          </div>
        </div>
      </section>
      <section className="grid grid-cols-2 divide-x divide-y divide-line border-b border-line sm:grid-cols-4 sm:divide-y-0" aria-label="Launch facts">
        {STATS.map((stat) => (
          <div key={stat.k} className="px-5 py-5 sm:py-6">
            <p className="text-xs tracking-widest text-muted uppercase">{stat.k}</p>
            <p className="mt-1 font-display text-4xl tracking-wide text-fg sm:text-5xl">{stat.v}</p>
            <p className="mt-1 text-xs text-muted">{stat.s}</p>
          </div>
        ))}
      </section>
      <div className="overflow-hidden border-b border-line" aria-hidden="true">
        <div className="barc-ticker flex w-max py-3">
          <p className="px-4 font-display text-sm tracking-widest text-muted whitespace-nowrap">{TICKER.repeat(4)}</p>
          <p className="px-4 font-display text-sm tracking-widest text-muted whitespace-nowrap">{TICKER.repeat(4)}</p>
        </div>
      </div>
    </>
  );
}

function HearChip({
  current,
  value,
  label,
  onPick,
}: {
  current: "bark" | "arc";
  value: "bark" | "arc";
  label: string;
  onPick: (value: "bark" | "arc") => void;
}) {
  const on = current === value;
  return (
    <button
      type="button"
      aria-pressed={on}
      onClick={() => onPick(value)}
      className={`min-h-11 rounded-full px-4 text-sm font-medium transition-colors duration-200 ${
        on ? "bg-fg text-deep" : "border border-line text-muted hover:text-fg"
      }`}
    >
      {label}
    </button>
  );
}

function CopyCa() {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(CONTRACT);
          setCopied(true);
          window.setTimeout(() => setCopied(false), 1400);
        } catch {
          setCopied(false);
        }
      }}
      className="inline-flex min-h-11 shrink-0 items-center rounded-full bg-fg px-4 text-sm font-medium text-deep transition-colors duration-200 hover:bg-accent"
    >
      {copied ? "Copied" : "Copy"}
    </button>
  );
}
