import { createHmac } from "crypto";
import type { Paddle } from "../types";
import type { PaddleAPI } from "../api/types";

/**
 * Validates Paddle event using the secret key and the signature.
 *
 * @param client - The Paddle Billing client
 * @param secret - The secret key
 * @param signature - The Paddle signature
 * @param body - The raw body string to validate
 *
 * @returns true if the body is authentic
 */
export function parseWebhookBody<DataDef extends PaddleAPI.CustomDataDef>(
  _client: PaddleAPI.Client<DataDef> | null,
  secret: string,
  signature: string,
  body: string
): Paddle.Event<
  PaddleAPI.CustomData<DataDef["Price"]>,
  PaddleAPI.CustomData<DataDef["Product"]>,
  PaddleAPI.CustomData<DataDef["SubscriptionItem"]>,
  PaddleAPI.CustomData<DataDef["Subscription"]>,
  PaddleAPI.CustomData<DataDef["Transaction"]>,
  PaddleAPI.CustomData<DataDef["Customer"]>,
  PaddleAPI.CustomData<DataDef["Address"]>,
  PaddleAPI.CustomData<DataDef["Business"]>
> | null {
  const captures = signature.match(/^ts=(\d+);h1=(.+)$/);
  if (!captures) return null;

  const [_, ts, h1] = captures;
  const computedHmac = createHmac("sha256", secret)
    .update(ts + ":" + body)
    .digest("hex");

  if (computedHmac === h1) return JSON.parse(body);
  return null;
}
