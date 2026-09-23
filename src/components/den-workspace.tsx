import { useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Copy, ExternalLink, Plus, ShieldCheck } from "lucide-react";
import { keccak_256 } from "@noble/hashes/sha3.js";
import { bytesToHex } from "@noble/hashes/utils.js";
import { ARC, BARC, CCTP, USDC_ERC20 } from "@/config/assets";
import { formatBarc } from "@/config/utility";
import { usePackAccount, type Origin } from "@/lib/use-pack-account";

const ORIGIN_ROOMS: Array<{ origin: Origin; label: string; path: string }> = [
  { origin: "Gaia", label: "Gaia / market", path: "/den/gaia" },
  { origin: "Aurora", label: "Aurora / settlement", path: "/den/aurora" },
  { origin: "Cyber", label: "Cyber / signals", path: "/den/cyber" },
  { origin: "Tempest", label: "Tempest / invoices", path: "/den/tempest" },
];

function shortAddress(value: string): string {
  return `${value.slice(0, 6)}...${value.slice(-4)}`;
}

function formatNativeUsdc(value: bigint): string {
  const whole = value / 10n ** 18n;
  const fraction = (value % 10n ** 18n).toString().padStart(18, "0").slice(0, 2);
  return fraction === "00" ? whole.toLocaleString() : `${whole.toLocaleString()}.${fraction}`;
}

export function DenWorkspace({ room }: { room?: Origin }) {
  const account = usePackAccount();
  const activeWolf = account.rallyTokens.find((token) => token.tokenId === account.activeTokenId);
  const allowed = !room || activeWolf?.origin === room;

  return (
    <div className="min-h-screen bg-deep text-fg">
      <header className="border-b border-line bg-deep/90 px-5 py-5 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4">
          <Link to="/den" className="flex items-center gap-3">
            <span className="size-10 overflow-hidden rounded-full bg-bg"><img src="/barc-mark.jpg" alt="" className="size-full object-cover" /></span>
            <span><span className="block font-display text-2xl">The Den</span><span className="text-xs tracking-widest text-accent uppercase">barc-five / Arc 5042</span></span>
          </Link>
          <div className="flex items-center gap-2">
            {account.address ? <span className="rounded-full border border-line px-3 py-2 text-xs text-muted">{shortAddress(account.address)}</span> : null}
            <button type="button" onClick={() => void account.connect()} disabled={account.loading} className="inline-flex min-h-11 items-center gap-2 rounded-full bg-fg px-4 text-sm font-medium text-deep hover:bg-accent disabled:opacity-60">
              {account.loading ? "Reading" : account.address ? "Refresh pack" : "Connect wallet"}
            </button>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-5 py-10 sm:py-16">
        <div className="grid gap-8 lg:grid-cols-[0.72fr_1.28fr]">
          <aside className="space-y-5">
            <AccountPanel account={account} activeWolf={activeWolf?.tokenId ?? null} />
            <nav className="border-y border-line py-4" aria-label="Origin rooms">
              <p className="mb-3 text-xs tracking-widest text-muted uppercase">Origin rooms</p>
              <div className="grid gap-1">
                {ORIGIN_ROOMS.map((item) => (
                  <Link key={item.origin} to={item.path} className={`flex min-h-11 items-center justify-between px-3 text-sm ${activeWolf?.origin === item.origin ? "text-fg" : "text-muted hover:text-fg"}`}>
                    <span>{item.label}</span><span className="text-xs">{activeWolf?.origin === item.origin ? "active" : "locked"}</span>
                  </Link>
                ))}
              </div>
            </nav>
            <p className="text-xs leading-relaxed text-muted">Unofficial community token. Not Circle. Not the ARC network token. USDC is gas and settlement. Vaults can lose money. Not financial advice.</p>
          </aside>
          <section>
            {!account.address ? <EmptyState title="Connect to enter the Den" body="Your wallet stays in your browser. The Den reads live $BARC and Rally Club ownership on Arc." onClick={() => void account.connect()} /> : !account.onArc ? <EmptyState title="Arc is the doorway" body="Switch to Arc before the Den reads balances or wolves." onClick={() => void account.addArc()} button="Add / switch Arc" /> : !allowed ? <EmptyState title="This room is not your origin" body={`Your active wolf is ${activeWolf?.origin ?? "unknown"}. Choose its origin room from the left.`} /> : <RoomContent room={room} />}
            {account.error ? <p className="mt-4 text-sm text-bad">{account.error}</p> : null}
          </section>
        </div>
      </main>
    </div>
  );
}

function AccountPanel({ account, activeWolf }: { account: ReturnType<typeof usePackAccount>; activeWolf: string | null }) {
  return <section className="border border-line bg-surface p-5">
    <div className="flex items-center justify-between"><p className="text-xs tracking-widest text-accent uppercase">Pack account</p><span className="text-xs text-muted">{account.onArc ? "final · 1 block" : "offline"}</span></div>
    <div className="mt-5 grid grid-cols-2 gap-4"><div><p className="text-xs text-muted">$BARC balance</p><p className="mt-1 text-xl tabular-nums">{formatBarc(account.barcBalance)}</p></div><div><p className="text-xs text-muted">USDC gas</p><p className="mt-1 text-xl tabular-nums">{formatNativeUsdc(account.nativeUsdc)}</p></div></div>
    <div className="mt-5 border-t border-line pt-4"><p className="text-xs text-muted">Daily quota</p><p className="mt-1 font-display text-4xl">{account.quota}</p><p className="mt-1 text-xs text-muted">derived from BARC balance · Rally holder ×1.5</p></div>
    {account.rallyTokens.length ? <div className="mt-5 border-t border-line pt-4"><p className="text-xs text-muted">Active wolf</p><select value={activeWolf ?? ""} onChange={(event) => account.setActiveTokenId(event.target.value)} className="mt-2 min-h-11 w-full border border-line bg-deep px-3 text-sm text-fg"><option value="" disabled>Select a Rally Club token</option>{account.rallyTokens.map((token) => <option key={token.tokenId} value={token.tokenId}>#{token.tokenId} · {token.origin ?? "origin pending"}</option>)}</select></div> : <p className="mt-5 border-t border-line pt-4 text-sm text-muted">No Rally Club wolves found for this wallet.</p>}
  </section>;
}

function EmptyState({ title, body, onClick, button = "Connect wallet" }: { title: string; body: string; onClick?: () => void; button?: string }) {
  return <div className="border border-line bg-bg p-8 sm:p-12"><p className="text-xs tracking-widest text-accent uppercase">Den access</p><h1 className="mt-3 font-display text-5xl leading-none">{title}</h1><p className="mt-5 max-w-lg leading-relaxed text-muted">{body}</p>{onClick ? <button type="button" onClick={onClick} className="mt-8 inline-flex min-h-12 items-center gap-2 rounded-full bg-fg px-5 text-sm font-medium text-deep hover:bg-accent">{button}</button> : null}</div>;
}

function RoomContent({ room }: { room?: Origin }) {
  if (!room) return <Dashboard />;
  if (room === "Gaia") return <GaiaRoom />;
  if (room === "Aurora") return <AuroraRoom />;
  if (room === "Cyber") return <CyberRoom />;
  return <TempestRoom />;
}

function Dashboard() {
  return <div><p className="text-xs tracking-widest text-accent uppercase">Operational utility</p><h1 className="mt-3 max-w-2xl font-display text-6xl leading-[0.9]">A seat, a meter, a room.</h1><p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted">$BARC is the meter and bond. The Rally Club wolf is the account and origin seat. USDC is the only vault and settlement asset.</p><div className="mt-10 grid gap-4 sm:grid-cols-2">{ORIGIN_ROOMS.map((item) => <Link key={item.origin} to={item.path} className="border border-line bg-surface p-5 hover:border-accent"><p className="text-xs text-accent">{item.origin}</p><p className="mt-6 font-display text-3xl">{item.label.split(" / ")[1]}</p><p className="mt-2 text-sm text-muted">Enter with the matching active wolf.</p></Link>)}</div></div>;
}

function RoomFrame({ title, eyebrow, children }: { title: string; eyebrow: string; children: React.ReactNode }) { return <div><p className="text-xs tracking-widest text-accent uppercase">{eyebrow}</p><h1 className="mt-3 font-display text-6xl leading-[0.9]">{title}</h1><div className="mt-10 grid gap-4">{children}</div></div>; }
function GaiaRoom() { return <RoomFrame title="Gaia market" eyebrow="Origin room / Gaia"><div className="border border-line bg-surface p-5"><p className="text-sm text-muted">CA guard</p><p className="mt-3 break-all font-mono text-sm text-fg">{BARC.address}</p><a href={BARC.trade} target="_blank" rel="noreferrer" className="mt-4 inline-flex items-center gap-2 text-sm text-accent">Read Argus tax and listing <ExternalLink className="size-4" /></a></div><div className="border border-line bg-surface p-5"><p className="text-sm text-muted">Trading rule</p><p className="mt-3 text-lg">$BARC is meter, bond, and API credit. It is never the vault asset. No emissions. No APY.</p></div></RoomFrame>; }
function AuroraRoom() { return <RoomFrame title="Aurora settlement" eyebrow="Origin room / Aurora"><div className="border border-line bg-surface p-5"><p className="text-sm text-muted">Two faces, one USDC balance</p><p className="mt-3 text-lg">Native `eth_getBalance` uses 18 decimals for Arc gas. ERC-20 USDC at {USDC_ERC20} uses 6 decimals for settlement.</p><p className="mt-3 text-sm text-warn">Never deploy wrapped USDC. Never use ETH as gas.</p></div><div className="border border-line bg-surface p-5"><p className="text-sm text-muted">Bridge in with Circle CCTP</p><p className="mt-3 leading-relaxed">Burn USDC on the source chain, then mint native USDC on Arc domain {CCTP.domain}. After mint, you have gas. This site does not build a bridge.</p><a href="https://developers.circle.com/cctp" target="_blank" rel="noreferrer" className="mt-4 inline-flex items-center gap-2 text-sm text-accent">Read Circle CCTP docs <ExternalLink className="size-4" /></a></div><a href={`https://chainlist.org/chain/${ARC.id}`} target="_blank" rel="noreferrer" className="inline-flex min-h-11 items-center gap-2 text-sm text-accent"><Plus className="size-4" />Add Arc manually</a></RoomFrame>; }
function CyberRoom() { return <RoomFrame title="Cyber signals" eyebrow="Origin room / Cyber"><div className="border border-line bg-surface p-5"><p className="text-sm text-muted">API key</p><p className="mt-3 font-mono text-sm text-muted">Coming with the DenMeter. Keys never live in the browser.</p></div><Link to="/den/tape" className="border border-dashed border-line p-8 text-center hover:border-accent"><p className="text-sm text-muted">Tape panel stub</p><p className="mt-2 text-xs text-muted">/den/tape · heat, not a buy signal</p></Link></RoomFrame>; }
function TempestRoom() { const [amount, setAmount] = useState(""); const [memo, setMemo] = useState(""); return <RoomFrame title="Tempest invoice" eyebrow="Origin room / Tempest"><div className="border border-line bg-surface p-5"><label className="block text-xs text-muted" htmlFor="invoice-amount">USDC amount · 6 decimals</label><input id="invoice-amount" inputMode="decimal" value={amount} onChange={(event) => setAmount(event.target.value)} placeholder="0.00" className="mt-2 min-h-12 w-full border border-line bg-deep px-3 text-fg" /><label className="mt-5 block text-xs text-muted" htmlFor="invoice-memo">Memo</label><textarea id="invoice-memo" value={memo} onChange={(event) => setMemo(event.target.value)} placeholder="What is this for?" className="mt-2 min-h-24 w-full border border-line bg-deep p-3 text-fg" /><button type="button" onClick={() => void navigator.clipboard.writeText(`USDC invoice\nAmount: ${amount}\nMemo: ${memo}`)} className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-full bg-fg px-4 text-sm font-medium text-deep hover:bg-accent"><Copy className="size-4" />Copy draft</button></div></RoomFrame>; }

export function LicensePage({ tokenId }: { tokenId: string }) {
  const account = usePackAccount();
  const token = account.rallyTokens.find((item) => item.tokenId === tokenId);
  const [copied, setCopied] = useState(false);
  const certificate = useMemo(() => token && account.address ? `Bored Apex Rally Club commercial-rights certificate\nToken ID: ${tokenId}\nOwner: ${account.address}\nOrigin: ${token.origin ?? "unknown"}\nIssued: ${new Date().toISOString()}` : "", [account.address, token, tokenId]);
  const hash = useMemo(() => certificate ? bytesToHex(keccak_256(new TextEncoder().encode(certificate))) : null, [certificate]);
  return <div className="min-h-screen bg-deep text-fg"><main className="mx-auto max-w-3xl px-5 py-16"><Link to="/den" className="text-sm text-accent">Back to the Den</Link><p className="mt-12 text-xs tracking-widest text-accent uppercase">License lookup</p><h1 className="mt-3 font-display text-6xl">Wolf #{tokenId}</h1>{!token || !account.address ? <p className="mt-6 text-bad">This certificate is available only to the current owner connected in this browser.</p> : <div className="mt-8 border border-line bg-surface p-6"><ShieldCheck className="size-6 text-good" /><pre className="mt-6 whitespace-pre-wrap text-sm leading-relaxed text-fg">{certificate}</pre><p className="mt-6 break-all border-t border-line pt-4 font-mono text-xs text-muted">Document hash: {hash}</p><button type="button" onClick={() => { void navigator.clipboard.writeText(certificate); setCopied(true); }} className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-full bg-fg px-4 text-sm font-medium text-deep hover:bg-accent"><Copy className="size-4" />{copied ? "Copied" : "Copy certificate"}</button><p className="mt-4 text-xs text-warn">Client certificate only in v0. No chain write. Verify ownerOf before relying on it.</p></div>}</main></div>;
}