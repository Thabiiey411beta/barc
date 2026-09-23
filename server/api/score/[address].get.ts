import { createError, defineEventHandler, getRouterParam } from "h3";
import { allowRequest, readBarc } from "../../barc-rpc";

export default defineEventHandler(async (event) => {
  const address = getRouterParam(event, "address") || "";
  if (!allowRequest(`score:${address}`)) throw createError({ statusCode: 429, statusMessage: "Too many requests" });
  const result = await readBarc(address);
  return {
    isCanonicalBarc: result.isCanonicalBarc,
    codePresent: result.codePresent,
    isContract: result.codePresent,
    balance: result.balance.toString(),
    decimals: result.decimals,
    // TODO: OmniScore Arc comment. Do not synthesize third-party market data.
  };
});