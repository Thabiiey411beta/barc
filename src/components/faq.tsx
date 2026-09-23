import { ChevronDown } from "lucide-react";
import { FAQS } from "@/content/barc";

export function Faq() {
  return (
    <section id="faq" className="scroll-mt-24">
      <div className="mx-auto w-full max-w-6xl px-5 py-16 sm:py-24">
        <p className="text-xs font-medium tracking-[0.16em] text-muted uppercase">Before you sign</p>
        <h2 className="mt-3 font-display text-4xl leading-none text-fg sm:text-5xl">Read this with the lights on.</h2>
        <div className="mt-8 border-t border-line">
          {FAQS.map((item) => (
            <details key={item.q} className="group border-b border-line">
              <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 py-4 text-lg text-fg">
                {item.q}
                <ChevronDown className="size-5 shrink-0 text-muted transition-transform duration-200 group-open:rotate-180" />
              </summary>
              <p className="max-w-3xl pb-5 text-base leading-relaxed text-muted">{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-line bg-bg">
      <div className="mx-auto w-full max-w-6xl px-5 py-10">
        <p className="font-display text-3xl tracking-wide text-fg">$BARC</p>
        <p className="mt-4 max-w-3xl text-sm leading-relaxed text-muted">
          Unofficial memecoin. Not issued, endorsed, or affiliated with Circle, Arc, Argus, USDC, EURC, BlackRock, Visa,
          Mastercard, DTCC, or any validator. Not the ARC network token. Nothing on this page is an offer to sell a
          security, a solicitation, or financial advice. Tools can fail. Memecoins can go to zero. Match the contract on
          this page before you sign anything. You can lose all of it.
        </p>
        <p className="mt-6 text-xs tracking-[0.16em] text-muted uppercase">Community site · Arc · 2026</p>
      </div>
    </footer>
  );
}
