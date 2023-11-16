import { loadScript } from ".";

loadScript().then((Paddle) => {
  // Items

  Paddle.Checkout.open({
    items: [{ priceId: "pri_123" }, { priceId: "pri_456" }],
    customer: { id: "ctm_123" },
    customData: {},
  });

  Paddle.Checkout.open({
    items: [{ priceId: "pri_123" }],
    customer: { id: "ctm_123" },
    customData: {},
  });

  Paddle.Checkout.open({
    items: [{ priceId: "pri_123" }],
    customData: {},
  });

  Paddle.Checkout.open({
    items: [{ priceId: "pri_123" }],
  });

  Paddle.Checkout.open({
    // @ts-expect-error: At least one item is required
    items: [],
  });

  // Transaction

  Paddle.Checkout.open({
    transactionId: "txn_123",
    customData: {},
  });

  Paddle.Checkout.open({
    transactionId: "txn_123",
  });
});
