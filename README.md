# $BARC

Unofficial memecoin site for Arc. The wolf that heard bark.

The page is the launch front: the mark, the contract status, paste-ready listing copy, how to buy, and a raid desk that writes a different tweet for every raider.

Not Circle. Not USDC. Not the ARC network token. Nothing here is financial advice.

## Run

```bash
npm install
npm run dev
```

The dev server listens on port 8080.

Custom raid tweets call the xAI API from the server when `XAI_API_KEY` is set. Without it, the raid desk still shuffles pack drafts. Never put that key in the browser or commit it.
