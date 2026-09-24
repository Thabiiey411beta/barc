export function PackReel() {
  return (
    <section id="cards" className="border-b border-line">
      <div className="mx-auto grid w-full max-w-6xl gap-8 px-5 py-14 lg:grid-cols-[minmax(0,1fr)_minmax(240px,360px)] lg:items-center lg:py-16">
        <div>
          <p className="text-xs font-medium tracking-[0.16em] text-muted uppercase">Pack cards</p>
          <h2 className="mt-3 max-w-[18ch] font-display text-4xl leading-[0.95] text-fg sm:text-5xl">
            Twenty-five wolves. Same card. Different color.
          </h2>
          <p className="mt-4 max-w-md text-base leading-relaxed text-ice">
            The BARC template stays locked. Fur, kit, and the circle behind the head change. The reel
            flips the set so the pack can see them without opening a folder.
          </p>
        </div>
        <div className="justify-self-center">
          <div className="relative aspect-[280/376] w-[min(100%,320px)] overflow-hidden rounded-card border border-line bg-surface shadow-[0_20px_60px_rgba(0,0,0,0.35)]">
            <img
              src="/pack-reel.gif"
              alt="BARC wolf pack cards looping"
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
