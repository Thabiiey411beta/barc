import { createError, defineEventHandler } from "h3";
import { allowRequest, rpcIsReachable } from "../barc-rpc";

export default defineEventHandler(async (event) => {
  if (!allowRequest(event.node?.req.socket.remoteAddress || "health")) throw createError({ statusCode: 429, statusMessage: "Too many requests" });
  return {
    ok: await rpcIsReachable(),
    rpc: "https://rpc.mainnet.arc.io",
    commit: process.env.VERCEL_GIT_COMMIT_SHA || process.env.GIT_COMMIT_SHA || "unknown",
  };
});