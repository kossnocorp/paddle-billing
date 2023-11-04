import { createHmac } from "crypto";
import type { Paddle as Core } from "../types";
import type { PaddleAPI as API } from "../api/types";

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
export function parseWebhookBody<DataDef extends Core.CustomDataDef>(
  _client: API.Client<DataDef> | null,
  secret: string,
  signature: string,
  body: string
): Core.Event<
  API.CustomData<DataDef["Price"]>,
  API.CustomData<DataDef["Product"]>,
  API.CustomData<DataDef["SubscriptionItem"]>,
  API.CustomData<DataDef["Subscription"]>,
  API.CustomData<DataDef["Transaction"]>,
  API.CustomData<DataDef["Customer"]>,
  API.CustomData<DataDef["Address"]>,
  API.CustomData<DataDef["Business"]>
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
