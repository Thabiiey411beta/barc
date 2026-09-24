import { Link } from "@tanstack/react-router";
import { RALLY } from "@/config/assets";

const PIECES = [
  {
    k: "USDC",
    t: "The rail",
    d: "Arc charges gas in USDC. Invoices, bridges, and mint price use the same dollar. Web2 checkout energy on a public chain.",
  },
  {
    k: "Wolf",
    t: "The seat",
    d: "A Rally Club NFT is the account. Origin trait picks the room: Gaia market, Aurora settlement, Cyber signals, Tempest invoices. Commercial rights stay with the holder.",
  },
  {
    k: "$BARC",
    t: "The meter",
    d: "Not the vault. Not yield. $BARC is the pack pass, the DenMeter bond, the license stamp fee, and the daily API quota. Hold more, get more calls. Stake when the meter is deployed.",
  },
] as const;

export function DenProduct() {
  return (
    <section id="den" className="scroll-mt-24 border-b border-line">
      <div className="mx-auto w-full max-w-6xl px-5 py-16 sm:py-24">
        <p className="text-xs font-medium tracking-[0.16em] text-accent uppercase">The product</p>
        <h2 className="mt-3 max-w-[18ch] font-display text-4xl leading-[0.95] text-fg sm:text-5xl">
          A dollar rail, a wolf seat, a pack meter.
        </h2>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted">
          Circle built Arc so a payment can look like software. The Den is the pack&apos;s version of that: USDC moves
          value, the NFT is identity, $BARC is access. No second token. No APY.
        </p>
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {PIECES.map((piece) => (
            <article key={piece.k} className="rounded-card border border-line bg-surface p-5">
              <p className="text-xs tracking-[0.16em] text-accent uppercase">{piece.k}</p>
              <h3 className="mt-3 text-lg font-medium text-fg">{piece.t}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{piece.d}</p>
            </article>
          ))}
        </div>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            to="/mint"
            className="inline-flex min-h-11 items-center rounded-full bg-fg px-5 text-sm font-medium text-deep hover:bg-accent"
          >
            Mint a wolf
          </Link>
          <Link
            to="/den"
            className="inline-flex min-h-11 items-center rounded-full border border-line px-5 text-sm font-medium text-fg hover:border-accent"
          >
            Enter the Den
          </Link>
          <a
            href={RALLY.mint}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-11 items-center px-2 text-sm text-accent"
          >
            nfts2.me drop
          </a>
        </div>
      </div>
    </section>
  );
}
