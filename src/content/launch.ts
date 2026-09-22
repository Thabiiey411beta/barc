export const CONTRACT = "0xCD78f7bd8A5095412BF820d7698b1aFb55924084";

export const ARGUS_URL = `https://argus.world/token/${CONTRACT}`;

export const CA_NOTE = `${CONTRACT} — $BARC on Arc, launched on Argus. Match this address. A different one in a DM is not this coin.`;

export const BITES = [
  {
    t: "One mishear",
    d: "Arc is the chain. Bark is the sound. $BARC is the wolf that answered.",
  },
  {
    t: "One chain",
    d: "Arc is EVM, gas is USDC, and finality is under a second. This coin launched on Argus.",
  },
  {
    t: "One line",
    d: "Not Circle. Not USDC. Not the ARC network token. If the address isn’t the one on this page, it isn’t the coin.",
  },
] as const;

export const STEPS = [
  {
    n: "01",
    t: "A wallet that can pay Arc",
    d: "Any EVM wallet. Gas on Arc is USDC, so you need a little of that on the chain before you can swap.",
  },
  {
    n: "02",
    t: "This contract, and no other",
    d: `${CONTRACT}. Copy it from here. Don’t take one from a reply, a group chat, or a lookalike ticker.`,
  },
  {
    n: "03",
    t: "Trade it on Argus",
    d: "The launch was on Argus, which opens the pool on Arc. Use the token page linked on this site. Check the tax there before you buy.",
  },
] as const;
