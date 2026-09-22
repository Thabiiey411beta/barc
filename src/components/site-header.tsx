import { useState } from "react";
import { Menu, X } from "lucide-react";
import { CONTRACT } from "@/content/launch";

const LINKS = [
  { href: "#raid", label: "Raid" },
  { href: "#buy", label: "Buy" },
  { href: "#listing", label: "Listing" },
  { href: "#faq", label: "FAQ" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  async function copyCa() {
    try {
      await navigator.clipboard.writeText(CONTRACT);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1400);
    } catch {
      setCopied(false);
    }
  }

  return (
    <header className="sticky top-0 z-20 border-b border-line bg-deep/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-4 px-5">
        <a href="#top" className="flex items-center gap-3">
          <span className="size-9 overflow-hidden rounded-full bg-bg">
            <img src="/barc-mark.jpg" alt="" className="size-full object-cover" />
          </span>
          <span className="font-display text-xl tracking-wide text-fg">$BARC</span>
        </a>
        <nav className="hidden items-center gap-6 md:flex" aria-label="Page">
          {LINKS.map((link) => (
            <a key={link.href} href={link.href} className="text-sm text-muted transition-colors duration-200 hover:text-fg">
              {link.label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={copyCa}
            className="inline-flex min-h-11 items-center rounded-full bg-fg px-4 text-sm font-medium text-deep transition-colors duration-200 hover:bg-accent"
          >
            {copied ? "Copied" : "Copy CA"}
          </button>
          <button
            type="button"
            className="inline-flex size-11 items-center justify-center rounded-full border border-line text-fg md:hidden"
            aria-expanded={open}
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((value) => !value)}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>
      {open ? (
        <nav className="border-t border-line px-5 py-3 md:hidden" aria-label="Page">
          {LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="flex min-h-11 items-center text-base text-fg"
            >
              {link.label}
            </a>
          ))}
        </nav>
      ) : null}
    </header>
  );
}
