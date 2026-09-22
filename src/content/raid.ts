import { CONTRACT } from "@/content/launch";

export const ANGLES = [
  { id: "shill", label: "Shill", hint: "Put it on a timeline" },
  { id: "lore", label: "Lore", hint: "The mishear" },
  { id: "reply", label: "Reply", hint: "Answer someone" },
  { id: "quote", label: "Quote", hint: "Annotate a post" },
  { id: "safety", label: "Safety", hint: "Kill the fake CAs" },
] as const;

export const HEATS = [
  { id: "dry", label: "Dry" },
  { id: "loud", label: "Loud" },
  { id: "feral", label: "Feral" },
] as const;

export type Angle = (typeof ANGLES)[number]["id"];
export type Heat = (typeof HEATS)[number]["id"];

export type RaidBrief = {
  angle: Angle;
  heat: Heat;
  handle: string;
  note: string;
};

export const SEED_TWEETS = [
  `$BARC is live on Arc. Launched on Argus. CA: ${CONTRACT}. Match it. Not Circle.`,
  "Say Arc too fast and you get bark. That’s $BARC. Unofficial. Not the ARC token.",
  `Gas on Arc is USDC. The noise is $BARC. Silver wolf. Contract: ${CONTRACT}.`,
  "They built the rail for banks. The wolf launched on Argus anyway. $BARC is the mishear.",
];

const LINES: Record<Angle, string[]> = {
  shill: [
    `$BARC is the wolf on Arc. Launched on Argus. Not Circle. Not the ARC token. CA: ${CONTRACT}.`,
    "The chain wanted silence. $BARC is the bark. Live on Arc, unofficial, meme only.",
    `If you can say Arc, you can say $BARC. Silver wolf. USDC gas. CA: ${CONTRACT}.`,
    "New chain, old instinct. $BARC launched on Argus. Arc, not a promise.",
    "They filled Arc with memes on day one. $BARC is the one with a jaw. Match the address on the site.",
    `$BARC. The ticker is the sound. The chain is Arc. The contract is ${CONTRACT}.`,
  ],
  lore: [
    "Circle built Arc for quiet money. Day one was not quiet. $BARC launched on Argus with a silver wolf.",
    "Banks on the validator list. A wolf in the blocks. $BARC is not theirs. It just barks on Arc.",
    "Arc settles in under a second. $BARC takes longer, because howling is a choice. Not Circle.",
    "Mishear the chain and you get the coin. Arc. Bark. $BARC. Live on Argus.",
    "Ten billion ARC, not promised for sale. One extra letter and a jaw. $BARC is the unofficial one.",
    `The mark is a wolf, mouth open. The ticker is $BARC. The chain is Arc. CA: ${CONTRACT}.`,
  ],
  reply: [
    `$BARC is live on Arc, launched on Argus. unofficial. CA: ${CONTRACT}.`,
    "you built a quiet chain and the timeline barked. $BARC. not Circle. not the ARC token.",
    "gas in USDC, noise in $BARC. Arc can settle. we can howl. launched on Argus.",
    "say it slower. Arc. now faster. bark. that’s $BARC. meme only.",
    "the banks got the rail. the wolf got the ticker. $BARC. match the address, don’t take a DM.",
    "day one was memes. $BARC launched on Argus. Arc. unofficial.",
  ],
  quote: [
    `quoting this so the wolf has a paper trail. $BARC on Arc, launched on Argus. CA: ${CONTRACT}.`,
    "the quiet-chain thesis, annotated by a howl. $BARC. meme only. not Circle.",
    "leaving this here. $BARC is the mishear. Arc is the chain. only the address on the site.",
    "for the timeline: silver wolf, ticker $BARC, chain Arc, launched on Argus.",
    "archive the bark. $BARC. unofficial on Arc. if the address doesn’t match the site, it isn’t the coin.",
    "one more time for the back row. $BARC is not the ARC token and not Circle.",
  ],
  safety: [
    `Raiders: the only $BARC contract is ${CONTRACT}. Do not post a different address. Chain is Arc.`,
    "If it isn’t the address on the $BARC site, it isn’t the coin. Ignore DMs. Arc. Not Circle.",
    "$BARC is a meme. You can lose all of it. It is not the ARC network token. Launched on Argus.",
    `No price talk. $BARC is a howl on Arc. Contract: ${CONTRACT}. Read the tax on Argus before you buy.`,
    `Don’t raid with a fake CA. $BARC is ${CONTRACT}. Anything else is not this coin.`,
    "Not advice. $BARC is unofficial, on Arc, launched on Argus, and not Circle’s ARC token.",
  ],
};

function applyHeat(text: string, heat: Heat): string {
  if (heat === "loud") {
    const next = text.endsWith(".") ? `${text} HOWL.` : `${text}. HOWL.`;
    return next.length <= 280 ? next : text;
  }
  if (heat === "feral") {
    const first = text.split(". ")[0] ?? text;
    const next = `${first.replace(/\.$/, "")}. The wolf is not asking.`;
    return next.length <= 280 ? next : first;
  }
  return text;
}

function aim(text: string, brief: RaidBrief): string {
  const handle = brief.handle.replace(/^@/, "");
  if (handle && brief.angle === "reply") return `@${handle} ${text}`;
  if (handle && brief.angle === "quote") {
    const next = `${text} @${handle}`;
    return next.length <= 280 ? next : text;
  }
  return text;
}

function withNote(text: string, note: string): string {
  const clean = note.trim();
  if (!clean) return text;
  const next = `${text} ${clean}`;
  return next.length <= 280 ? next : text;
}

export function localTweets(brief: RaidBrief, count = 4): string[] {
  const bank = LINES[brief.angle];
  const out: string[] = [];
  const used = new Set<number>();
  let guard = 0;
  while (out.length < count && guard < 30) {
    guard += 1;
    let index = Math.floor(Math.random() * bank.length);
    if (used.has(index)) index = (index + 1) % bank.length;
    used.add(index);
    const text = withNote(aim(applyHeat(bank[index] ?? SEED_TWEETS[0], brief.heat), brief), brief.note);
    if (!out.includes(text)) out.push(text);
  }
  return out;
}
