const CARDS = [
  {
    t: "What Arc is",
    d: "A chain Circle shipped so dollars can move when the bank is closed. Gas is USDC. Settlement is fast. That part is boring on purpose.",
  },
  {
    t: "What $BARC is",
    d: "Bark, with the chain sitting inside the name. A husky on Argus. Something to point at while the grown-ups talked rails.",
  },
  {
    t: "What it is not",
    d: "Not Circle. Not official ARC. Not the other $BARC tickers already on this chain. If the contract is wrong, the joke is someone else’s.",
  },
] as const;

export function Path() {
  return (
    <section id="story" className="scroll-mt-24 border-b border-line">
      <div className="mx-auto w-full max-w-6xl px-5 py-16 sm:py-24">
        <h2 className="font-display text-4xl leading-none text-fg sm:text-5xl">The short version</h2>
        <p className="mt-4 max-w-xl text-base leading-relaxed text-muted">
          Your bank is closed on Sunday. Circle built Arc so the dollar doesn’t have to be.
        </p>
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {CARDS.map((card) => (
            <article key={card.t} className="rounded-card border border-line bg-surface p-5">
              <h3 className="text-base font-medium text-fg">{card.t}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{card.d}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
