import { createFileRoute, Link } from "@tanstack/react-router";
import { MintDesk } from "@/components/mint-desk";

export const Route = createFileRoute("/mint")({ component: MintPage });

function MintPage() {
  return (
    <div className="min-h-screen bg-deep text-fg">
      <header className="border-b border-line bg-deep/90 px-5 py-5 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-3">
            <span className="size-10 overflow-hidden rounded-full bg-bg">
              <img src="/barc-mark.jpg" alt="" className="size-full object-cover" />
            </span>
            <span>
              <span className="block font-display text-2xl">$BARC</span>
              <span className="text-xs tracking-widest text-accent uppercase">mint desk · Arc 5042</span>
            </span>
          </Link>
          <nav className="flex items-center gap-4 text-sm">
            <Link to="/" className="text-muted hover:text-fg">
              Home
            </Link>
            <Link to="/den" className="text-muted hover:text-fg">
              The Den
            </Link>
          </nav>
        </div>
      </header>
      <MintDesk />
    </div>
  );
}
