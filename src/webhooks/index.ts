import { createHmac } from "crypto";
import type { PaddleWebhooks } from "./types";

/**
 * Validates Paddle event using the secrete key and the signature.
 *
 * @param secret - The secret key
 * @param signature - The Paddle signature
 * @param body - The raw body string to validate
 *
 * @returns true if the body is authentic
 */
export function parseWebhookBody(
  secret: string,
  signature: string,
  body: string
): PaddleWebhooks.Event | null {
  const captures = signature.match(/^ts=(\d+);h1=(.+)$/);
  if (!captures) return null;

  const [_, ts, h1] = captures;
  const computedHmac = createHmac("sha256", secret)
    .update(ts + ":" + body)
    .digest("hex");

  if (computedHmac === h1) return JSON.parse(body);
  return null;
}
