# $BARC

Unofficial memecoin site for Arc. The wolf that heard bark.

The page is the launch front and a small set of Arc tools: add the chain, check a contract, and a Sunday desk that opens when the wallet holds $BARC.

Utility is access. The site reads the connected wallet's $BARC balance on Arc and labels access as Pup, Pack, or Wolf. Pack starts at 1,000 $BARC and Wolf at 100,000 $BARC; these are adjustable in `src/config/utility.ts` and are not investment tiers. Gas remains native USDC on Arc.

Not Circle. Not USDC. Not the ARC network token. Nothing here is financial advice.

## The Den

The product is a three-part stack on Arc:

- **USDC** is gas and settlement. No separate gas token to explain to a web2 user.
- **Rally Club NFT** (`0xffb20f430f409829fCA99FeA64D40979cF2aA799`) is the seat. Origin trait opens Gaia / Aurora / Cyber / Tempest rooms. Holders keep commercial rights to their wolf.
- **$BARC** is the meter. Pack / Wolf desks, DenMeter quota once deployed, and the LicenseRegistry stamp fee. It is not the vault and it pays no yield.

Mint from `/mint` (wallet call to the NFTs2Me contract) or the official page at https://bored-apex-rally-club.nfts2.me/.

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
