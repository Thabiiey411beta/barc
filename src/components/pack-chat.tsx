import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import { GREETING, STARTERS, type ChatTurn } from "@/content/chat";
import { askWolf } from "@/lib/chat.functions";

export function PackChat() {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState("");
  const [pending, setPending] = useState(false);
  const [messages, setMessages] = useState<ChatTurn[]>([{ role: "wolf", text: GREETING }]);
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    inputRef.current?.focus();
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => {
    const list = listRef.current;
    if (list) list.scrollTop = list.scrollHeight;
  }, [messages, open, pending]);

  async function send(text: string) {
    const question = text.replace(/\s+/g, " ").trim().slice(0, 400);
    if (!question || pending) return;
    const history = messages.slice(-6);
    const next = [...messages, { role: "user" as const, text: question }];
    setMessages(next);
    setDraft("");
    setPending(true);
    try {
      const result = await askWolf({ data: { question, history } });
      setMessages([...next, { role: "wolf", text: result.reply }]);
    } catch {
      setMessages([
        ...next,
        { role: "wolf", text: "The line dropped. Ask again, or copy the contract from the top of the page." },
      ]);
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="fixed right-4 bottom-4 z-30 flex flex-col items-end sm:right-6 sm:bottom-6">
      {open ? (
        <section
          className="mb-3 flex w-[min(24rem,calc(100vw-2rem))] flex-col overflow-hidden rounded-card border border-line bg-bg shadow-none"
          style={{ height: "min(32rem, calc(100dvh - 7rem))" }}
          aria-label="Ask BARC"
        >
          <header className="flex items-center justify-between border-b border-line px-4 py-3">
            <div>
              <p className="font-display text-2xl leading-none text-fg">Ask BARC</p>
              <p className="text-xs text-muted">Facts from this page. Not advice.</p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-full text-muted hover:text-fg"
              aria-label="Close chat"
            >
              <X size={18} />
            </button>
          </header>
          <div ref={listRef} className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto px-4 py-4">
            {messages.map((message, index) => (
              <p
                key={`${message.role}-${index}`}
                className={`max-w-[90%] rounded-card px-3 py-2 text-sm leading-relaxed ${
                  message.role === "user" ? "self-end bg-fg text-deep" : "self-start bg-surface text-fg"
                }`}
              >
                {message.text}
              </p>
            ))}
            {pending ? <p className="self-start text-xs tracking-widest text-muted uppercase">Listening</p> : null}
            {messages.length === 1 && !pending ? (
              <div className="mt-1 flex flex-col items-start gap-2">
                {STARTERS.map((starter) => (
                  <button
                    key={starter}
                    type="button"
                    onClick={() => send(starter)}
                    className="min-h-11 rounded-full border border-line px-3 text-left text-sm text-fg hover:border-accent"
                  >
                    {starter}
                  </button>
                ))}
              </div>
            ) : null}
          </div>
          <form
            className="flex gap-2 border-t border-line p-3"
            onSubmit={(event) => {
              event.preventDefault();
              void send(draft);
            }}
          >
            <input
              ref={inputRef}
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              placeholder="Ask about $BARC"
              maxLength={400}
              className="min-h-11 min-w-0 flex-1 rounded-full border border-line bg-surface px-4 text-sm text-fg outline-none placeholder:text-muted"
            />
            <button
              type="submit"
              disabled={pending || !draft.trim()}
              className="inline-flex min-h-11 shrink-0 items-center rounded-full bg-fg px-4 text-sm font-medium text-deep hover:bg-accent disabled:opacity-40"
            >
              Send
            </button>
          </form>
        </section>
      ) : null}
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
        className="inline-flex min-h-11 items-center rounded-full bg-fg px-5 text-sm font-medium text-deep hover:bg-accent"
      >
        {open ? "Close" : "Ask BARC"}
      </button>
    </div>
  );
}
