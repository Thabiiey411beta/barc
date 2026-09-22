import { BITES, STEPS } from "@/content/launch";

export function Path() {
  return (
    <section id="buy" className="scroll-mt-24 border-b border-line">
      <div className="mx-auto w-full max-w-6xl px-5 py-16 sm:py-24">
        <div className="grid gap-10 lg:grid-cols-3">
          {BITES.map((bite) => (
            <article key={bite.t}>
              <h2 className="font-display text-3xl tracking-wide text-fg">{bite.t}</h2>
              <p className="mt-3 text-base leading-relaxed text-muted">{bite.d}</p>
            </article>
          ))}
        </div>
        <div className="mt-16 border-t border-line pt-14">
          <p className="text-xs font-medium tracking-widest text-accent uppercase">How to buy</p>
          <h2 className="mt-3 max-w-xl font-display text-4xl tracking-wide text-fg sm:text-5xl">
            Three steps. None of them are a DM.
          </h2>
          <ol className="mt-10 grid gap-8 lg:grid-cols-3">
            {STEPS.map((step) => (
              <li key={step.n} className="border-t border-line pt-5">
                <p className="font-display text-sm tracking-widest text-accent">{step.n}</p>
                <h3 className="mt-2 font-display text-2xl tracking-wide text-fg">{step.t}</h3>
                <p className="mt-3 text-base leading-relaxed text-muted">{step.d}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
