const CARDS = [
  {
    t: "What Arc is",
    d: "A chain Circle shipped so dollars can move when the bank is closed. Gas is USDC. Settlement is fast. That part is boring on purpose — and that is why a web2 checkout can live here.",
  },
  {
    t: "What $BARC is",
    d: "The pack meter. It opens desks, sets Den quota, stamps a commercial-rights certificate, and bonds the API. It is not the vault and it is not a yield token.",
  },
  {
    t: "What the wolf is",
    d: "Bored Apex Rally Club. Ten thousand seats. Origin rooms in the Den. Commercial rights to the face. Mint on this site or on nfts2.me. Same contract.",
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
