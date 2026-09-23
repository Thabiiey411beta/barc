# $BARC

Unofficial memecoin site for Arc. The wolf that heard bark.

The page is the launch front and a small set of Arc tools: add the chain, check a contract, and a Sunday desk that opens when the wallet holds $BARC.

Utility is access. The site reads the connected wallet's $BARC balance on Arc and labels access as Pup, Pack, or Wolf. Pack starts at 1,000 $BARC and Wolf at 100,000 $BARC; these are adjustable in `src/config/utility.ts` and are not investment tiers. Gas remains native USDC on Arc.

Not Circle. Not USDC. Not the ARC network token. Nothing here is financial advice.

## Run

```bash
npm install
npm run dev
```

The dev server listens on port 8080.

Custom raid tweets call the xAI API from the server when `XAI_API_KEY` is set. Without it, the raid desk still shuffles pack drafts. Never put that key in the browser or commit it.

## Environment

- `VITE_BARC_ADDRESS` is optional. When present, the build fails if it does not match the canonical contract in `src/config/utility.ts`.
- `BARC_RPC_URL` is optional and defaults to `https://rpc.mainnet.arc.io`.
- `XAI_API_KEY` is server-only and powers optional custom raid writing.
- `BARC_SPEND_ENABLED` is reserved for a future explicit spend flow and is off by default; the current invoice tool is copy-only.

Read-only server routes are `/api/health`, `/api/barc/:wallet`, and `/api/score/:address`. The score route only reports the canonical contract check, contract code/balance guard, and holder balance; it does not fake market data.
