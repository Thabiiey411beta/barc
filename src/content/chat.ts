import { ARGUS_URL, CONTRACT } from "@/content/launch";

export type ChatTurn = {
  role: "user" | "wolf";
  text: string;
};

export const GREETING =
  "Ask about the contract, how to buy, or why the ticker sounds like bark. I won’t quote a price.";

export const STARTERS = ["What’s the contract?", "How do I buy?", "Is this Circle’s ARC?"] as const;

/** Pack answers when the model is offline. Keyword match, same facts as the page. */
export function localReply(question: string): string {
  const q = question.toLowerCase();
  if (/contract|address|\bca\b|0x/.test(q)) {
    return `The only contract is ${CONTRACT}. It launched on Argus. Copy it from this page. A different address in a DM is not this coin.`;
  }
  if (/buy|ape|swap|argus|wallet|how do/.test(q)) {
    return `Use a wallet that can pay gas in USDC on Arc. Trade on Argus: ${ARGUS_URL}. Match ${CONTRACT} before you sign. Tax was set at launch — read it on that page.`;
  }
  if (/circle|official|network token|\barc token\b|usdc|eurc/.test(q)) {
    return "No. ARC without the B is Circle’s network token. $BARC is an unofficial memecoin. Not Circle, not USDC, not endorsed by anyone on the validator list.";
  }
  if (/tax|fee/.test(q)) {
    return "Buy and sell tax were set on Argus at launch. This page does not invent the rate. Open the Argus token page and read it there.";
  }
  if (/supply|how many/.test(q)) {
    return "Argus launches one billion tokens. $BARC followed that. The chain is Arc. Gas is USDC.";
  }
  if (/team|dev|founder|utility|roadmap/.test(q)) {
    return "The mark, the ticker, and this page. No doxxed team and no product hiding under the joke. If a contract says something else, the contract wins.";
  }
  if (/zero|safe|rug|lose|advice|price|moon/.test(q)) {
    return "It can go to zero. This is not financial advice, not a promise, and not an offer of a security. Only use money you can set on fire.";
  }
  if (/chain|arc|gas|what is|who|joke|bark|wolf/.test(q)) {
    return "Arc is the chain. Bark is the sound. $BARC is the wolf that answered. Live on Arc, launched on Argus, gas paid in USDC. Not the ARC network token.";
  }
  return `That’s outside what this page knows. The contract is ${CONTRACT}. Trade it on Argus, and don’t take a different address from a reply.`;
}
