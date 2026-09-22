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
  "Arc asked for a quiet chain. $BARC cleared its throat. CA is TBA — if a reply hands you an address, it is not this coin.",
  "Say Arc too fast and you get bark. That’s $BARC. Unofficial. Not Circle. Not the ARC token.",
  "Gas on Arc is USDC. The noise is $BARC. Silver wolf, zero promises. The contract posts on the site, not in your DMs.",
  "They built the rail for banks. The wolf showed up anyway. $BARC is the mishear. Meme only. CA TBA.",
];

const LINES: Record<Angle, string[]> = {
  shill: [
    "$BARC is the wolf on Arc. Not a bank product. Not the ARC token. CA is TBA, so nobody in your replies has it.",
    "The chain wanted silence. $BARC is the bark. Arc mainnet, unofficial, meme only. Contract drops on the site.",
    "If you can say Arc, you can say $BARC. Silver wolf. USDC gas. Do not trust a DM with an address.",
    "New chain, old instinct. $BARC showed up howling. Arc, not a promise. CA TBA.",
    "They filled Arc with memes on day one. $BARC is the one with a jaw. Unofficial. Verify it yourself.",
    "$BARC. The ticker is the sound. The chain is Arc. The contract is not live yet.",
  ],
  lore: [
    "Circle built Arc for quiet money. Day one was not quiet. $BARC is that fact with a silver wolf on it.",
    "Banks on the validator list. A wolf in the blocks. $BARC is not theirs. It just barks on Arc.",
    "Arc settles in under a second. $BARC takes longer, because howling is a choice. Not Circle.",
    "Mishear the chain and you get the coin. Arc. Bark. $BARC. CA still TBA.",
    "Ten billion ARC, not promised for sale. One extra letter and a jaw. $BARC is the unofficial one.",
    "The mark is a wolf, mouth open. The ticker is $BARC. The chain is Arc. Nothing else is claimed.",
  ],
  reply: [
    "this is the part where the wolf answers. $BARC on Arc. unofficial. the CA is not in this reply.",
    "you built a quiet chain and the timeline barked. $BARC. not Circle. not the ARC token.",
    "gas in USDC, noise in $BARC. Arc can settle. we can howl. contract is TBA.",
    "say it slower. Arc. now faster. bark. that’s $BARC. meme only.",
    "the banks got the rail. the wolf got the ticker. $BARC. verify, don’t DM.",
    "day one was memes. $BARC is staying for the encore. Arc. unofficial.",
  ],
  quote: [
    "quoting this so the wolf has a paper trail. $BARC on Arc. not affiliated. CA TBA.",
    "the quiet-chain thesis, annotated by a howl. $BARC. meme only. not Circle.",
    "leaving this here. $BARC is the mishear. Arc is the chain. do not invent a contract.",
    "for the timeline: silver wolf, ticker $BARC, chain Arc, status pre-launch.",
    "archive the bark. $BARC. unofficial on Arc. if the CA isn’t on the site, it isn’t real.",
    "one more time for the back row. $BARC is not the ARC token and not Circle.",
  ],
  safety: [
    "Raiders: the $BARC contract is TBA. Do not post an address you were sent. Chain is Arc. Unofficial.",
    "If it isn’t on the $BARC site, it isn’t the coin. Ignore DMs. Arc. Not Circle.",
    "$BARC is a meme. You can lose all of it. CA is not live. It is not the ARC network token.",
    "No price talk. $BARC is a howl on Arc. Read the contract yourself when one exists.",
    "Don’t raid with a fake CA. $BARC posts the address on the site at launch. Until then: TBA.",
    "Not advice. $BARC is unofficial, on Arc, and not Circle’s ARC token. That’s the warning.",
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
