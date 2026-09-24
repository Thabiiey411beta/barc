import { PACK_CARD_FRAMES } from "@/content/pack-cards";

export function PackReel() {
  const n = PACK_CARD_FRAMES.length;
  const step = 0.85;

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
          <p className="mt-3 text-sm text-muted">{n} frames in the loop.</p>
        </div>
        <div className="justify-self-center">
          <div className="pack-reel relative aspect-[280/376] w-[min(100%,320px)] overflow-hidden rounded-card border border-line bg-surface shadow-[0_20px_60px_rgba(0,0,0,0.35)]">
            {PACK_CARD_FRAMES.map((src, i) => (
              <img
                key={i}
                src={src}
                alt=""
                className="pack-reel-frame absolute inset-0 h-full w-full object-cover"
                style={{
                  animationDuration: `${n * step}s`,
                  animationDelay: `${i * step}s`,
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
