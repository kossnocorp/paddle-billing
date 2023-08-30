import { describe, expect, it } from "vitest";
import { parseWebhookBody } from ".";

describe("parseWebhookBody", () => {
  const body =
    '{"data":{"id":"pro_01h8jy59d77z0we4jcna878t5b","name":"Team","status":"active","image_url":"https://paddle-sandbox.s3.amazonaws.com/user/13640/subs_62568_icon.png","created_at":"2023-08-24T04:52:05.159Z","custom_data":null,"description":"Daisy Chain Team plan","tax_category":"standard"},"event_id":"evt_01h8n7s48p3ryvgcg1x4a2nx0e","event_type":"product.updated","occurred_at":"2023-08-25T02:18:41.302186Z","notification_id":"ntf_01h8n7s4cahy2sc0hmza6fqvah"}';

  const signature =
    "ts=1692931025;h1=46cc682ee2517fb633c0d109a864f792f92b2c428de732abbcd75d43355d038c";

  const secret =
    "pdl_aj42_jskIsj83Jasd_asdajpmn3us7agf49sdgihHsdikUIVhs94hHjsdK3hKash77";

  it("returns the event if the event signatures match", () => {
    expect(parseWebhookBody(secret, signature, body)).toEqual(JSON.parse(body));
  });

  it("returns null if the event signatures doesn't match", () => {
    expect(
      parseWebhookBody(
        secret,
        signature,
        '{"data":{"id":"pro_01h8jy59d77z0we4jcna878t5b","name":"Team","status":"active","image_url":"https://paddle-sandbox.s3.amazonaws.com/user/13640/subs_62568_icon.png","created_at":"2023-08-24T04:52:05.159Z","custom_data":null,"description":"Daisy Chain Team plan subscription","tax_category":"standard"},"event_id":"evt_01h8n9cb4nzqb4hvndgedw1jqw","event_type":"product.updated","occurred_at":"2023-08-25T02:46:39.509701Z","notification_id":"ntf_01h8n9cb6km4exp0vxbk0m21zr"}'
      )
    ).toBe(null);
    expect(parseWebhookBody("nope", signature, body)).toBe(null);
    expect(parseWebhookBody(secret, "nope", body)).toBe(null);
  });
});
