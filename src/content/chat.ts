import { ARGUS_URL, CONTRACT } from "@/content/launch";

export type ChatTurn = {
  role: "user" | "wolf";
  text: string;
};

export const GREETING =
  "Ask about the contract, Arc, or the Sunday desk. I won’t quote a price.";

export const STARTERS = ["What’s the contract?", "How do I add Arc?", "What does holding it do?"] as const;

/** Pack answers when the model is offline. Keyword match, same facts as the page. */
export function localReply(question: string): string {
  const q = question.toLowerCase();
  if (/contract|address|\bca\b|0x/.test(q)) {
    return `The only contract is ${CONTRACT}. It launched on Argus. Copy it from this page. A different address in a DM is not this coin.`;
  }
  if (/buy|ape|swap|argus|wallet|how do i buy/.test(q)) {
    return `Add Arc in a wallet that can pay gas in USDC, then trade on Argus: ${ARGUS_URL}. Match ${CONTRACT} before you sign. Tax was set at launch — read it on that page.`;
  }
  if (/add arc|chain id|rpc|5042|network|gas/.test(q)) {
    return "Arc mainnet is chain ID 5042. Gas is native USDC, 18 decimals. The button on this page adds RPC https://rpc.mainnet.arc.io. If the wallet prints ETH, the unit is still USDC.";
  }
  if (/sunday|send|desk|pack|hold|utility|use case/.test(q)) {
    return `Holding any ${CONTRACT} in the connected wallet opens the Sunday desk: a small send of native USDC on Arc. No $BARC, the desk stays closed. It is a key on this site, not a Circle product.`;
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
  if (/team|dev|founder|roadmap/.test(q)) {
    return "No doxxed team. The use on this page is the pack pass: hold $BARC, open the Sunday desk. If a contract says something else, the contract wins.";
  }
  if (/zero|safe|rug|lose|advice|price|moon/.test(q)) {
    return "It can go to zero. This is not financial advice, not a promise, and not an offer of a security. Only use money you can set on fire.";
  }
  if (/chain|arc|what is|who|joke|bark|husky|dog/.test(q)) {
    return "Every new chain gets a dog before it gets a bank. Circle built Arc so dollars can move on Sunday. $BARC is the husky that showed up. Not Circle. Not the official ARC token.";
  }
  return `That’s outside what this page knows. The contract is ${CONTRACT}. Trade it on Argus, and don’t take a different address from a reply.`;
}
