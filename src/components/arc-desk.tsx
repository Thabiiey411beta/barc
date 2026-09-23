import { useState } from "react";
import { ARGUS_URL, CONTRACT } from "@/content/launch";
import { TIERS, tierForBalance } from "@/config/utility";
import {
  ALT_RPC,
  EXPLORER_ADDRESS,
  addArc,
  isAddress,
  judgeContract,
  norm,
  parseUsdc,
  readPack,
  sendNative,
} from "@/lib/arc";

function Status({ text, kind }: { text: string; kind: "good" | "warn" | "bad" | "idle" }) {
  const tone =
    kind === "good" ? "text-good" : kind === "warn" ? "text-warn" : kind === "bad" ? "text-bad" : "text-muted";
  return <p className={`mt-3 min-h-6 text-sm leading-relaxed ${tone}`}>{text}</p>;
}

export function ArcDesk() {
  const [netMsg, setNetMsg] = useState("Adds Arc mainnet. Chain ID 5042. Gas is USDC.");
  const [netKind, setNetKind] = useState<"good" | "warn" | "bad" | "idle">("idle");
  const [ca, setCa] = useState("");
  const [caMsg, setCaMsg] = useState("Paste any address.");
  const [caKind, setCaKind] = useState<"good" | "warn" | "bad" | "idle">("idle");
  const [packMsg, setPackMsg] = useState("No wallet yet.");
  const [packKind, setPackKind] = useState<"good" | "warn" | "bad" | "idle">("idle");
  const [packOk, setPackOk] = useState(false);
  const [to, setTo] = useState("");
  const [amount, setAmount] = useState("");
  const [sendMsg, setSendMsg] = useState("Locked until this wallet holds $BARC on Arc.");
  const [sendKind, setSendKind] = useState<"good" | "warn" | "bad" | "idle">("idle");
  const [busy, setBusy] = useState<"net" | "pack" | "send" | null>(null);

  async function onAdd() {
    setBusy("net");
    try {
      await addArc();
      setNetKind("good");
      setNetMsg("Arc is in the wallet. If the balance says ETH, the unit is still USDC.");
    } catch (err) {
      setNetKind("bad");
      setNetMsg(err instanceof Error ? err.message : "Could not add Arc.");
    } finally {
      setBusy(null);
    }
  }

  function onCheck() {
    const verdict = judgeContract(ca);
    setCaKind(verdict.kind);
    setCaMsg(verdict.text);
  }

  async function onPack() {
    setBusy("pack");
    try {
      const { wallet, balance } = await readPack();
      const short = `${wallet.slice(0, 6)}…${wallet.slice(-4)}`;
      const tier = tierForBalance(balance);
      if (balance >= TIERS.pack.min) {
        setPackOk(true);
        setPackKind("good");
        setPackMsg(`${tier} access is live for ${short}.`);
        setSendKind("good");
        setSendMsg("Desk is open. Send a small amount you can afford to lose.");
      } else {
        setPackOk(false);
        setPackKind("warn");
        setPackMsg(`Connected, but this wallet is ${tier}. Hold 1,000 $BARC for Pack access.`);
        setSendKind("warn");
        setSendMsg("Locked until this wallet holds $BARC on Arc.");
      }
    } catch (err) {
      setPackOk(false);
      setPackKind("bad");
      setPackMsg(err instanceof Error ? err.message : "Could not read the balance.");
    } finally {
      setBusy(null);
    }
  }

  async function onSend() {
    if (!packOk) {
      await onPack();
      return;
    }
    const recipient = norm(to);
    if (!isAddress(recipient)) {
      setSendKind("bad");
      setSendMsg("Need a real recipient address.");
      return;
    }
    const value = parseUsdc(amount);
    if (value === null) {
      setSendKind("bad");
      setSendMsg("Need an amount greater than zero, up to 12 digits, 18 decimal places.");
      return;
    }
    setBusy("send");
    try {
      const hash = await sendNative(recipient, value);
      setSendKind("good");
      setSendMsg(`Sent. ${hash}`);
    } catch (err) {
      setSendKind("bad");
      setSendMsg(err instanceof Error ? err.message : "Send failed.");
    } finally {
      setBusy(null);
    }
  }

  return (
    <>
      <section id="tools" className="scroll-mt-24 border-b border-line">
        <div className="mx-auto w-full max-w-6xl px-5 py-16 sm:py-24">
          <p className="text-xs font-medium tracking-[0.16em] text-muted uppercase">Arc tools</p>
          <h2 className="mt-3 max-w-xl font-display text-4xl leading-none text-fg sm:text-5xl">
            Getting onto the chain should not feel like homework.
          </h2>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-muted">
            Three jobs. Add the network, check you have the right contract, prove the wallet holds $BARC.
          </p>
          <div className="mt-10 grid gap-4 lg:grid-cols-3">
            <article className="rounded-card border border-line bg-surface p-5">
              <h3 className="text-base font-medium text-fg">Get on the chain</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                Arc mainnet. Chain ID 5042. Gas is USDC, 18 decimals on the native balance. A wallet that does not know
                custom gas may still show “ETH”. The unit is still USDC.
              </p>
              <button
                type="button"
                onClick={() => void onAdd()}
                disabled={busy === "net"}
                className="mt-5 inline-flex min-h-11 items-center rounded-full bg-fg px-4 text-sm font-medium text-deep hover:bg-accent disabled:opacity-40"
              >
                {busy === "net" ? "Waiting" : "Add Arc"}
              </button>
              <dl className="mt-5 text-sm">
                {[
                  ["RPC", "https://rpc.mainnet.arc.io"],
                  ["Chain ID", "5042 · 0x13b2"],
                  ["Explorer", "explorer.arc.io"],
                  ["Alt RPC", ALT_RPC.replace("https://", "")],
                ].map(([k, v]) => (
                  <div key={k} className="grid grid-cols-[5.5rem_1fr] gap-3 border-t border-line py-2">
                    <dt className="text-muted">{k}</dt>
                    <dd className="break-all text-fg">{v}</dd>
                  </div>
                ))}
              </dl>
              <Status text={netMsg} kind={netKind} />
            </article>
            <article className="rounded-card border border-line bg-surface p-5">
              <h3 className="text-base font-medium text-fg">Check a contract</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                Paste any address. This tells you if it is this $BARC, a known lookalike, or something else.
              </p>
              <label htmlFor="ca-input" className="mt-5 block text-xs text-muted">
                Contract
              </label>
              <input
                id="ca-input"
                value={ca}
                onChange={(event) => setCa(event.target.value)}
                placeholder="0x…"
                autoComplete="off"
                spellCheck={false}
                className="mt-2 min-h-11 w-full rounded-xl border border-line bg-deep px-3 text-sm text-fg outline-none placeholder:text-muted"
              />
              <button
                type="button"
                onClick={onCheck}
                className="mt-3 inline-flex min-h-11 items-center rounded-full bg-fg px-4 text-sm font-medium text-deep hover:bg-accent"
              >
                Check
              </button>
              <Status text={caMsg} kind={caKind} />
            </article>
            <article id="pack" className="scroll-mt-24 rounded-card border border-line bg-surface p-5">
              <h3 className="text-base font-medium text-fg">Prove you hold it</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                Connect on Arc. If this wallet holds $BARC, you get a pack pass. That pass opens the Sunday desk.
              </p>
              <button
                type="button"
                onClick={() => void onPack()}
                disabled={busy === "pack"}
                className="mt-5 inline-flex min-h-11 items-center rounded-full bg-fg px-4 text-sm font-medium text-deep hover:bg-accent disabled:opacity-40"
              >
                {busy === "pack" ? "Reading" : "Connect and check pack"}
              </button>
              <Status text={packMsg} kind={packKind} />
              <a
                href={ARGUS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex min-h-11 items-center text-sm text-accent"
              >
                Buy on Argus if you need the token
              </a>
            </article>
          </div>
        </div>
      </section>

      <section className="border-b border-line">
        <div className="mx-auto w-full max-w-6xl px-5 py-16 sm:py-24">
          <h2 className="max-w-xl font-display text-4xl leading-none text-fg sm:text-5xl">Why $BARC sits on these tools</h2>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-muted">
            A mascot with no job dies in a week. A key that opens the first useful door lasts longer.
          </p>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            <article className="rounded-card border border-line p-5">
              <h3 className="text-base font-medium text-fg">Today</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                Holding $BARC marks you as pack. The Sunday desk — a small USDC send on Arc — only lights up if you have
                the token.
              </p>
            </article>
            <article className="rounded-card border border-line p-5">
              <h3 className="text-base font-medium text-fg">Next</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                The same pass can gate a contract watchlist, an Argus launch filter, and a public pack board. No new
                token. Same husky, more doors.
              </p>
            </article>
            <article className="rounded-card border border-line p-5">
              <h3 className="text-base font-medium text-fg">Still true</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                This is not an official Arc product. Circle built the rails. The pack built a key that lives on those
                rails.
              </p>
            </article>
          </div>
        </div>
      </section>

      <section id="sunday" className="scroll-mt-24 border-b border-line">
        <div className="mx-auto w-full max-w-6xl px-5 py-16 sm:py-24">
          <p className="text-xs font-medium tracking-[0.16em] text-muted uppercase">Sunday desk</p>
          <h2 className="mt-3 max-w-xl font-display text-4xl leading-none text-fg sm:text-5xl">
            Your bank is closed. Arc is not.
          </h2>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-muted">
            Send a small amount of native USDC on Arc. Pack holders first. That is the use case, not a speech.
          </p>
          <article className="mt-8 max-w-xl rounded-card border border-line bg-surface p-5 sm:p-6">
            <label htmlFor="to-input" className="block text-xs text-muted">
              Send to
            </label>
            <input
              id="to-input"
              value={to}
              onChange={(event) => setTo(event.target.value)}
              placeholder="0x recipient on Arc"
              autoComplete="off"
              spellCheck={false}
              className="mt-2 min-h-11 w-full rounded-xl border border-line bg-deep px-3 text-sm text-fg outline-none placeholder:text-muted"
            />
            <label htmlFor="amt-input" className="mt-4 block text-xs text-muted">
              Amount in USDC
            </label>
            <input
              id="amt-input"
              value={amount}
              onChange={(event) => setAmount(event.target.value)}
              placeholder="1"
              inputMode="decimal"
              className="mt-2 min-h-11 w-full rounded-xl border border-line bg-deep px-3 text-sm text-fg outline-none placeholder:text-muted"
            />
            <div className="mt-4 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => void onSend()}
                disabled={busy !== null}
                className="inline-flex min-h-11 items-center rounded-full bg-fg px-4 text-sm font-medium text-deep hover:bg-accent disabled:opacity-40"
              >
                {busy === "send" ? "Waiting on wallet" : "Send on Arc"}
              </button>
              <button
                type="button"
                onClick={() => void onPack()}
                disabled={busy !== null}
                className="inline-flex min-h-11 items-center rounded-full border border-line px-4 text-sm text-fg hover:border-accent disabled:opacity-40"
              >
                Refresh pack
              </button>
            </div>
            <Status text={sendMsg} kind={sendKind} />
            <p className="mt-3 text-xs leading-relaxed text-muted">
              This sends native USDC on chain 5042 — the gas asset, 18 decimals, not a separate token contract. The desk
              checks {CONTRACT} in this browser only. Anyone can still send from a wallet directly. Double-check the
              address. A send cannot be undone.
            </p>
          </article>
          <p className="mt-6 text-sm text-muted">
            Trade the token on{" "}
            <a href={ARGUS_URL} className="text-accent" target="_blank" rel="noopener noreferrer">
              Argus
            </a>
            . Read the contract on{" "}
            <a href={EXPLORER_ADDRESS} className="text-accent" target="_blank" rel="noopener noreferrer">
              the Arc explorer
            </a>
            .
          </p>
        </div>
      </section>
    </>
  );
}
