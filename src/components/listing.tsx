import { useState } from "react";
import { CopyButton } from "@/components/copy-button";
import { BLURBS, fullKit, type BlurbId } from "@/content/barc";

export function Listing() {
  const [id, setId] = useState<BlurbId>("lore");
  const active = BLURBS.find((blurb) => blurb.id === id) ?? BLURBS[2];

  return (
    <section id="listing" className="scroll-mt-24 border-b border-line">
      <div className="mx-auto w-full max-w-6xl px-5 py-16 sm:py-24">
        <p className="text-xs font-medium tracking-[0.16em] text-muted uppercase">Copy</p>
        <h2 className="mt-3 font-display text-4xl leading-none text-fg sm:text-5xl">The block, four lengths.</h2>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted">
          For the Dex page, the pinned post, and the bio. Lore is the description. The full kit copies all of them.
        </p>
        <div className="mt-8 flex gap-2 overflow-x-auto pb-1" role="tablist" aria-label="Description length">
          {BLURBS.map((blurb) => {
            const on = blurb.id === id;
            return (
              <button
                key={blurb.id}
                type="button"
                role="tab"
                aria-selected={on}
                onClick={() => setId(blurb.id)}
                className={`min-h-11 shrink-0 rounded-full px-4 text-sm font-medium transition-colors duration-200 ${
                  on ? "bg-fg text-deep" : "border border-line text-muted hover:text-fg"
                }`}
              >
                {blurb.label}
              </button>
            );
          })}
        </div>
        <article className="mt-6 rounded-card border border-line bg-surface p-5 sm:p-8">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <p className="text-sm text-muted">{active.hint}</p>
            <p className="text-sm text-accent tabular-nums">{active.text.length} characters</p>
          </div>
          <p className="mt-5 text-base leading-relaxed whitespace-pre-wrap text-fg sm:text-lg">{active.text}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <CopyButton text={active.text} label={`Copy ${active.label.toLowerCase()}`} />
            <CopyButton text={fullKit()} tone="line" label="Copy full kit" />
          </div>
        </article>
      </div>
    </section>
  );
}
