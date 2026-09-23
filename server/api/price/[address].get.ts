import { createError, defineEventHandler, getRouterParam } from "h3";
import { allowRequest } from "../../barc-rpc";
import { readArcTokenPrice } from "../../token-price";

export default defineEventHandler(async (event) => {
  const address = getRouterParam(event, "address") || "";
  if (!allowRequest(`price:${address}`)) throw createError({ statusCode: 429, statusMessage: "Too many requests" });

  try {
    return await readArcTokenPrice(address);
  } catch (error) {
    throw createError({ statusCode: 502, statusMessage: error instanceof Error ? error.message : "Price unavailable" });
  }
});