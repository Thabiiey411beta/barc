import { ARGUS_URL, CONTRACT } from "@/content/launch";

export const ONE_LINE =
  "Every new chain gets a dog before it gets a bank. $BARC is the husky on Arc.";

export const BIO =
  `Circle built Arc so dollars can move on Sunday. $BARC is the husky that showed up anyway. Launched on Argus. Not Circle. Not official ARC. CA: ${CONTRACT}.`;

export const LORE = `Every new chain gets a dog before it gets a bank.

Circle built Arc so dollars can move on Sunday. $BARC is the husky that showed up anyway.

It launched on Argus. It is not Circle and it is not the official ARC token. There are other tickers with the same letters. Ours is one contract.

Hold it if you want the joke, and because this page treats it as a key — add the chain, check the CA, open the Sunday desk.

Utility is the pack pass. Tools on this site read your $BARC on Arc. Gas stays USDC. No yield. No Circle. Contract wins if it ever says otherwise.

Contract: ${CONTRACT}
Argus: ${ARGUS_URL}

Tax was set at launch on Argus. Read it there before you buy. This page is not the audit.`;

export const LAUNCH_POST = `Your bank is closed on Sunday.
Circle built Arc so the dollar doesn’t have to be.
The husky on that chain is $BARC.

Chain: Arc
Launched: Argus
CA: ${CONTRACT}
${ARGUS_URL}

Not Circle. Not the official ARC token.`;

export const BLURBS = [
  { id: "line", label: "One line", hint: "Pin, bio opener, group name", text: ONE_LINE },
  { id: "bio", label: "Bio", hint: "Dexscreener, X, Telegram", text: BIO },
  { id: "lore", label: "Lore", hint: "The description. Paste this.", text: LORE },
  { id: "post", label: "Launch post", hint: "First thing you publish", text: LAUNCH_POST },
] as const;

export type BlurbId = (typeof BLURBS)[number]["id"];

export function fullKit(): string {
  return [
    "BARC ($BARC) — the husky on Arc",
    "Chain: Arc · EVM · gas in USDC",
    "Status: live on Argus",
    "",
    ...BLURBS.flatMap((blurb) => [blurb.label.toUpperCase(), blurb.text, ""]),
    "Unofficial meme only. $BARC gates the desk. Not issued or endorsed by Circle, Arc, USDC, or any validator. Not the ARC network token. Not financial advice. You can lose everything.",
  ].join("\n");
}

export const SHEET = [
  { k: "Name", v: "BARC" },
  { k: "Ticker", v: "$BARC" },
  { k: "Chain", v: "Arc mainnet" },
  { k: "Standard", v: "EVM token" },
  { k: "Gas", v: "Paid in USDC" },
  { k: "Total supply", v: "1,000,000,000" },
  { k: "Buy / sell tax", v: "Set at launch on Argus. Read it there." },
  { k: "Contract", v: CONTRACT },
  { k: "Launched", v: `Argus — ${ARGUS_URL}` },
  { k: "Affiliation", v: "None. An unofficial meme." },
] as const;

export const CHAIN = [
  {
    n: "01",
    t: "The rail",
    d: "Arc is Circle’s public Layer 1. Mainnet opened on 16 September 2026 with deterministic finality under a second and fees denominated in USDC.",
  },
  {
    n: "02",
    t: "The room",
    d: "The chain is EVM-compatible. Uniswap, Aave, and Morpho were named among day-one markets. A $BARC pool is not promised here. If one exists later, the explorer is the source of truth.",
  },
  {
    n: "03",
    t: "The joke",
    d: "The pitch was institutional quiet. The first day belonged to new wallets, fresh contracts, and memecoins. $BARC is that punchline, wearing a jaw.",
  },
  {
    n: "04",
    t: "The line",
    d: "Circle has a network token called ARC. They minted ten billion and said the mint was not a promise to sell it. $BARC is a different word. Do not mix them up, on purpose or by accident, when you are buying.",
  },
] as const;

export const FAQS = [
  {
    q: "Is this Circle’s ARC token?",
    a: "No. ARC, without the B, is Circle’s network token. They minted a full supply of ten billion and described that mint as a technical step, not a public sale. $BARC is a separate, unofficial memecoin. The extra letter is the entire joke — and the entire difference.",
  },
  {
    q: "Where is the contract?",
    a: `It is live: ${CONTRACT}. Launched on Argus at ${ARGUS_URL}. Copy it from this site and match it yourself. A different address in a reply, a DM, or a lookalike ticker is not this coin.`,
  },
  {
    q: "How would someone buy it?",
    a: "On Argus, with a wallet that can pay gas in USDC on Arc. The token page is linked on this site. Tax was chosen at launch — Argus shows it. This site is not the trade. The Argus page is.",
  },
  {
    q: "What is the use, besides the joke?",
    a: "Holding $BARC is the pack pass on this site. It opens the Sunday desk: a small native-USDC send on Arc, which stays closed for wallets that do not hold the token. Same contract later can gate a watchlist. No second token, no revenue share, no hidden product.",
  },
  {
    q: "Can this go to zero?",
    a: "Yes. Assume it can, and assume you can lose every unit you put in. Nothing here is an offer of a security, a promise of profit, or financial advice. Howl with money you can set on fire.",
  },
] as const;

export const SEED_HOWLS = [
  { id: "s1", text: "Heard it from the other side of finality.", tag: "day one" },
  { id: "s2", text: "Visa can settle. We can clear our throats.", tag: "the pack" },
  { id: "s3", text: "Gas in USDC. Voice in BARC.", tag: "the rail" },
  { id: "s4", text: "They minted ten billion ARC. We brought one jaw.", tag: "unofficial" },
] as const;

export const TICKER =
  "BARC  ·  THE HUSKY ON ARC  ·  SUNDAY STILL SETTLES  ·  NOT CIRCLE  ·  NOT THE ARC TOKEN  ·  GAS IN USDC  ·  ";
