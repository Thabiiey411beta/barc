export const ONE_LINE =
  "$BARC — the howl on Arc. Banks built the rails. The wolf took the night.";

export const BIO =
  "$BARC is the silver wolf of Arc — Circle’s institutional chain that filled with memes on day one. Not a payment rail, not Circle, and not the ARC network token. Just a howl with a ticker. Meme only. No promises. Verify the contract yourself.";

export const LORE = `BARC ($BARC) is a memecoin on Arc, Circle’s EVM Layer 1 for fast settlement and USDC-denominated gas.

The chain came out dressed for banks. BlackRock, Visa, Mastercard, and DTCC sat on the founding validator list, and the public story was quiet money. Day one was not quiet. Accounts piled up, contracts deployed by the tens of thousands, and memecoins did what memecoins do.

The mark is a silver wolf on navy, mouth open. The ticker is the noise it makes. Bark, if you are listening. Arc, if you mishear it. $BARC is that mishearing with a supply.

It is not Circle, not USDC, not EURC, and not the ARC network token. There is no product roadmap hiding under the joke. One billion supply. Zero stated tax. Whatever the contract actually does, you read it on the explorer before you buy. This page is the howl, not the audit.`;

export const LAUNCH_POST = `Arc wanted silence.
The wolf cleared its throat.

$BARC — the howl on Arc.
Chain: Arc
CA: TBA

Unofficial. Not Circle. Meme only.`;

export const BLURBS = [
  { id: "line", label: "One line", hint: "Pin, bio opener, group name", text: ONE_LINE },
  { id: "bio", label: "Bio", hint: "Dexscreener, X, Telegram", text: BIO },
  { id: "lore", label: "Lore", hint: "The description. Paste this.", text: LORE },
  { id: "post", label: "Launch post", hint: "First thing you publish", text: LAUNCH_POST },
] as const;

export type BlurbId = (typeof BLURBS)[number]["id"];

export function fullKit(): string {
  return [
    "BARC ($BARC) — the howl on Arc",
    "Chain: Arc · EVM · gas in USDC",
    "Status: pre-launch · contract TBA",
    "",
    ...BLURBS.flatMap((blurb) => [blurb.label.toUpperCase(), blurb.text, ""]),
    "Unofficial. Not issued or endorsed by Circle, Arc, USDC, or any validator. Not the ARC network token. Not financial advice. You can lose everything.",
  ].join("\n");
}

export const SHEET = [
  { k: "Name", v: "BARC" },
  { k: "Ticker", v: "$BARC" },
  { k: "Chain", v: "Arc mainnet" },
  { k: "Standard", v: "EVM token" },
  { k: "Gas", v: "Paid in USDC" },
  { k: "Total supply", v: "1,000,000,000" },
  { k: "Buy / sell tax", v: "0% / 0%, as stated" },
  { k: "Contract", v: "TBA — this page updates at launch" },
  { k: "Channels", v: "Open with the contract. None until then." },
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
    q: "When does the contract go live?",
    a: "At launch. Until an address is printed on this site, there is no official contract. A CA sent in a reply, a fake explorer link, or a lookalike ticker is not this page. Wait for the address here, then match it yourself.",
  },
  {
    q: "How would someone buy it?",
    a: "After a real pool exists, on an Arc DEX, from a wallet that can pay gas in USDC. This site will not point at a pool that is not live. Arc is EVM-compatible, so the mechanics will feel familiar. The asset will not.",
  },
  {
    q: "What is the team, and what is the utility?",
    a: "The mark, the ticker, and this page. No doxxed team, no revenue share, no phase-two product. If a future contract says something else, the contract wins and this paragraph was a wish.",
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
  "BARC  ·  THE HOWL ON ARC  ·  NOT CIRCLE  ·  NOT THE ARC TOKEN  ·  GAS IN USDC  ·  CA TBA  ·  MEME ONLY  ·  ";
