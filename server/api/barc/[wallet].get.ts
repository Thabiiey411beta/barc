import { createError, defineEventHandler, getRouterParam } from "h3";
import { allowRequest, readBarc } from "../../barc-rpc";

export default defineEventHandler(async (event) => {
  const wallet = getRouterParam(event, "wallet") || "";
  if (!allowRequest(`barc:${wallet}`)) throw createError({ statusCode: 429, statusMessage: "Too many requests" });
  return readBarc(wallet);
});