import { useState } from "react";
import { Check, Copy, ExternalLink } from "lucide-react";
import { ANGLES, HEATS, SEED_TWEETS, localTweets, type Angle, type Heat } from "@/content/raid";
import { generateRaidTweets } from "@/lib/raid.functions";

type Source = "seed" | "pack" | "grok";

export function RaidDesk() {
  const [angle, setAngle] = useState<Angle>("shill");
  const [heat, setHeat] = useState<Heat>("loud");
  const [handle, setHandle] = useState("");
  const [note, setNote] = useState("");
  const [tweets, setTweets] = useState<string[]>(SEED_TWEETS);
  const [source, setSource] = useState<Source>("seed");
  const [noteMsg, setNoteMsg] = useState<string | null>(null);
  const [writing, setWriting] = useState(false);

  const brief = {
    angle,
    heat,
    handle: handle.replace(/^@/, "").replace(/[^A-Za-z0-9_]/g, "").slice(0, 15),
    note: note.replace(/\s+/g, " ").trim().slice(0, 80),
  };

  function shuffle() {
    setTweets(localTweets(brief));
    setSource("pack");
    setNoteMsg(null);
  }

  async function writeCustom() {
    if (writing) return;
    setWriting(true);
    setNoteMsg(null);
    try {
      const result = await generateRaidTweets({ data: brief });
      setTweets(result.tweets);
      setSource(result.source);
      setNoteMsg(result.error);
    } catch {
      setTweets(localTweets(brief));
      setSource("pack");
      setNoteMsg("Custom writing didn’t answer. These are pack drafts.");
    } finally {
      setWriting(false);
    }
  }

  const sourceLabel =
    source === "grok" ? "Written for this raid" : source === "pack" ? "Pack draft" : "Starter barks";

  return (
    <section id="raid" className="scroll-mt-24 border-b border-line bg-bg">
      <div className="mx-auto w-full max-w-6xl px-5 py-16 sm:py-24">
        <p className="text-xs font-medium tracking-widest text-accent uppercase">Raid desk</p>
        <div className="mt-3 flex flex-wrap items-end justify-between gap-4">
          <h2 className="max-w-xl font-display text-4xl tracking-wide text-fg sm:text-6xl">
            A different bark for every raider.
          </h2>
        </div>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted">
          Memecoins die when fifty people paste one tweet. Pick the angle, aim it if you want, and get four posts that
          aren’t copies. Pack drafts are instant. Custom writes are made for this raid — still no fake contract, still
          no price promises.
        </p>
        <div className="mt-10 grid items-start gap-8 lg:grid-cols-12">
          <form
            className="rounded-card border border-line bg-surface p-5 lg:col-span-5"
            onSubmit={(event) => {
              event.preventDefault();
              void writeCustom();
            }}
          >
            <fieldset>
              <legend className="text-xs tracking-widest text-muted uppercase">Angle</legend>
              <div className="mt-3 flex flex-wrap gap-2">
                {ANGLES.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    aria-pressed={angle === item.id}
                    onClick={() => setAngle(item.id)}
                    className={`min-h-11 rounded-full px-4 text-sm font-medium transition-colors duration-200 ${
                      angle === item.id ? "bg-fg text-deep" : "border border-line text-muted hover:text-fg"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </fieldset>
            <fieldset className="mt-6">
              <legend className="text-xs tracking-widest text-muted uppercase">Heat</legend>
              <div className="mt-3 flex flex-wrap gap-2">
                {HEATS.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    aria-pressed={heat === item.id}
                    onClick={() => setHeat(item.id)}
                    className={`min-h-11 rounded-full px-4 text-sm font-medium transition-colors duration-200 ${
                      heat === item.id ? "bg-fg text-deep" : "border border-line text-muted hover:text-fg"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </fieldset>
            <label className="mt-6 block text-xs tracking-widest text-muted uppercase" htmlFor="raid-handle">
              Aim at
            </label>
            <input
              id="raid-handle"
              value={handle}
              onChange={(event) => setHandle(event.target.value)}
              placeholder="@handle, optional"
              maxLength={16}
              className="mt-3 min-h-12 w-full rounded-full border border-line bg-deep px-4 text-base text-fg placeholder:text-muted"
            />
            <label className="mt-5 block text-xs tracking-widest text-muted uppercase" htmlFor="raid-note">
              This raid
            </label>
            <input
              id="raid-note"
              value={note}
              onChange={(event) => setNote(event.target.value)}
              placeholder="First hour. Keep it about the jaw."
              maxLength={80}
              className="mt-3 min-h-12 w-full rounded-full border border-line bg-deep px-4 text-base text-fg placeholder:text-muted"
            />
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <button
                type="submit"
                disabled={writing}
                className="inline-flex min-h-12 flex-1 items-center justify-center rounded-full bg-fg px-5 text-sm font-medium text-deep transition-colors duration-200 hover:bg-accent disabled:opacity-60"
              >
                {writing ? "Writing…" : "Write custom"}
              </button>
              <button
                type="button"
                onClick={shuffle}
                className="inline-flex min-h-12 items-center justify-center rounded-full border border-line px-5 text-sm font-medium text-fg transition-colors duration-200 hover:border-accent"
              >
                Shuffle pack
              </button>
            </div>
          </form>
          <div className="lg:col-span-7">
            <div className="mb-3 flex items-center justify-between gap-3">
              <p className="text-xs tracking-widest text-accent uppercase">{sourceLabel}</p>
              {noteMsg ? <p className="text-right text-xs text-muted">{noteMsg}</p> : null}
            </div>
            <ul className="flex flex-col gap-3">
              {tweets.map((tweet) => (
                <li key={tweet}>
                  <TweetCard text={tweet} dim={writing} />
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

function TweetCard({ text, dim }: { text: string; dim: boolean }) {
  const [copied, setCopied] = useState(false);
  const href = `https://x.com/intent/tweet?text=${encodeURIComponent(text)}`;

  return (
    <article className={`rounded-card border border-line bg-deep p-4 transition-opacity duration-200 sm:p-5 ${dim ? "opacity-60" : ""}`}>
      <div className="flex items-center gap-3">
        <span className="size-10 overflow-hidden rounded-full bg-bg">
          <img src="/barc-mark.jpg" alt="" className="size-full object-cover" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-fg">BARC</p>
          <p className="text-xs text-muted">raid copy</p>
        </div>
        <p className="text-xs text-muted tabular-nums">{text.length}</p>
      </div>
      <p className="mt-4 text-base leading-relaxed text-fg">{text}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={async () => {
            try {
              await navigator.clipboard.writeText(text);
              setCopied(true);
              window.setTimeout(() => setCopied(false), 1400);
            } catch {
              setCopied(false);
            }
          }}
          className="inline-flex min-h-11 items-center gap-2 rounded-full border border-line px-4 text-sm text-fg transition-colors duration-200 hover:border-accent"
        >
          {copied ? <Check className="size-4" aria-hidden="true" /> : <Copy className="size-4" aria-hidden="true" />}
          {copied ? "Copied" : "Copy"}
        </button>
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-11 items-center gap-2 rounded-full bg-fg px-4 text-sm font-medium text-deep transition-colors duration-200 hover:bg-accent"
        >
          <ExternalLink className="size-4" aria-hidden="true" />
          Post on X
        </a>
      </div>
    </article>
  );
}
