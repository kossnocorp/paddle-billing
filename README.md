# Paddle Billing

Paddle Billing [API](https://developer.paddle.com/api-reference/overview), [Webhooks](https://developer.paddle.com/webhooks/overview) and [web (Paddle.js)](https://developer.paddle.com/paddlejs/overview) wrapper with detailed TypeScript types.

## Installing

The library is available as an [npm package](https://www.npmjs.com/package/paddle-billing).

To install the package run:

```bash
npm install paddle-billing
```

The minimum required Node.js version is v18, as it uses Fetch API. It's possible to use older versions with `global.fetch` polyfill, but not recommended.

## Usage

- [API](#api)
- [Webhooks](#webhooks)
- [Web](#web)

### API

`paddle-billing` wraps all available Paddle Billing API methods, replicating the naming structure. Every API component (query, body, response, etc) is carefully typed, so you can use those as the documentation or read the [Paddle API Reference](https://developer.paddle.com/api-reference/overview) for more details.

To use a method, create a client with authentication details and call the method with it:

```ts
import { client, cancelSubscription } from "paddle-billing";

const paddle = client("PADDLE_SECRET");

cancelSubscription(paddle, "SUBCRIPTION_ID").then((subscription) => {
  if (subsription.error) {
    // The request failed:
    console.error(subscription.error); // See PaddleAPI.Error
    return;
  }

  // Do something with the subscription:
  subscription.data;
});
```

#### Sandbox

To use the Sandbox, pass `true` as the second argument to `client`:

```ts
import { client, cancelSubscription } from "paddle-billing";

const paddle = client("PADDLE_SECRET", true);

// Will send the request to Sandbox:
cancelSubscription(paddle, "SUBCRIPTION_ID");
```

#### Typing `custom_data`

To add types to `custom_data` fields to `Price`, `Product`, `SubscriptionItem`, `Subscription`, `Transaction`, `Customer`, `Address` and `Business` add the generic argument to `client`:

```ts
const paddle = client<{
  Product: CustomDataProduct;
  Price: CustomDataPrice;
  Transaction: CustomDataTransaction;
  Subscription: CustomDataSubscription;
  SubscriptionItem: CustomDataSubscriptionItem;
  Customer: CustomDataCustomer;
  Address: CustomDataAddress;
  Business: CustomDataBusiness;
}>("PADDLE_SECRET");
```

From now on, all corresponding entities will have `custom_data` typed.

> ⚠️ When specifing `Subscription` and `Transaction`, you should make sure they overlap. Fields that do not overlap should be optional. It's dictated by the web's custom data-assigning to relevant transaction and subscription simultaneously. Creating an API or web client with incompatible custom data definitions will result in the client function returning `never`.

All custom data fields are optional so that you can type only selected entities:

```ts
const paddle = client<{
  Product: CustomDataProduct;
  Price: CustomDataPrice;
}>("PADDLE_SECRET");
```

#### Key function

You can also pass a function that returns the key as the key argument, which allows the use of Google Cloud Secrets and calling `client` on the module level where the secrets aren't defined in `process`:

```ts
const paddle = client(() => "PADDLE_SECRET");
```

#### Methods List

- [**Products**](https://developer.paddle.com/api-reference/products/overview)

  - [`listProducts`](https://developer.paddle.com/api-reference/products/list-products)
  - [`createProduct`](https://developer.paddle.com/api-reference/products/create-product)
  - [`getProduct`](https://developer.paddle.com/api-reference/products/get-product)
  - [`updateProduct`](https://developer.paddle.com/api-reference/products/update-product)

- [**Prices**](https://developer.paddle.com/api-reference/prices/overview)

  - [`listPrices`](https://developer.paddle.com/api-reference/prices/list-prices)
  - [`createPrice`](https://developer.paddle.com/api-reference/prices/create-price)
  - [`getPrice`](https://developer.paddle.com/api-reference/prices/get-price)
  - [`updatePrice`](https://developer.paddle.com/api-reference/prices/update-price)

- [**Discounts**](https://developer.paddle.com/api-reference/discounts/overview)

  - [`listDiscounts`](https://developer.paddle.com/api-reference/discounts/list-discounts)
  - [`createDiscount`](https://developer.paddle.com/api-reference/discounts/create-discount)
  - [`getDiscount`](https://developer.paddle.com/api-reference/discounts/get-discount)
  - [`updateDiscount`](https://developer.paddle.com/api-reference/discounts/update-discount)

- [**Customers**](https://developer.paddle.com/api-reference/customers/overview)

  - [`listCustomers`](https://developer.paddle.com/api-reference/customers/list-customers)
  - [`createCustomer`](https://developer.paddle.com/api-reference/customers/create-customer)
  - [`getCustomer`](https://developer.paddle.com/api-reference/customers/get-customer)
  - [`updateCustomer`](https://developer.paddle.com/api-reference/customers/update-customer)

- [**Addresses**](https://developer.paddle.com/api-reference/addresses/overview)

  - [`listAddresses`](https://developer.paddle.com/api-reference/addresses/list-addresses)
  - [`createAddress`](https://developer.paddle.com/api-reference/addresses/create-address)
  - [`getAddress`](https://developer.paddle.com/api-reference/addresses/get-address)
  - [`updateAddress`](https://developer.paddle.com/api-reference/addresses/update-address)

- [**Businesses**](https://developer.paddle.com/api-reference/businesses/overview)

  - [`listBusinesses`](https://developer.paddle.com/api-reference/businesses/list-businesses)
  - [`createBusiness`](https://developer.paddle.com/api-reference/businesses/create-business)
  - [`getBusiness`](https://developer.paddle.com/api-reference/businesses/get-business)
  - [`updateBusiness`](https://developer.paddle.com/api-reference/businesses/update-business)

- [**Transactions**](https://developer.paddle.com/api-reference/transactions/overview)

  - [`listTransactions`](https://developer.paddle.com/api-reference/transactions/list-transactions)
  - [`createTransaction`](https://developer.paddle.com/api-reference/transactions/create-transaction)
  - [`getTransaction`](https://developer.paddle.com/api-reference/transactions/get-transaction)
  - [`updateTransaction`](https://developer.paddle.com/api-reference/transactions/update-transaction)
  - [`previewTransaction`](https://developer.paddle.com/api-reference/transactions/preview-transaction)
  - [`getInvoice`](https://developer.paddle.com/api-reference/transactions/get-invoice-pdf)

- [**Subscriptions**](https://developer.paddle.com/api-reference/subscriptions/overview)

  - [`listSubscriptions`](https://developer.paddle.com/api-reference/subscriptions/list-subscriptions)
  - [`getSubscription`](https://developer.paddle.com/api-reference/subscriptions/get-subscription)
  - [`updateSubscription`](https://developer.paddle.com/api-reference/subscriptions/update-subscription)
  - [`previewUpdateSubscription`](https://developer.paddle.com/api-reference/subscriptions/preview-subscription)
  - [`updatePaymentMethodTransaction`](https://developer.paddle.com/api-reference/subscriptions/update-payment-method)
  - [`createCharge`](https://developer.paddle.com/api-reference/subscriptions/create-one-time-charge)
  - [`previewCharge`](https://developer.paddle.com/api-reference/subscriptions/preview-subscription-charge)
  - [`pauseSubscription`](https://developer.paddle.com/api-reference/subscriptions/pause-subscription)
  - [`resumeSubscription`](https://developer.paddle.com/api-reference/subscriptions/resume-subscription)
  - [`cancelSubscription`](https://developer.paddle.com/api-reference/subscriptions/cancel-subscription)

- [**Adjustments**](https://developer.paddle.com/api-reference/adjustments/overview)

  - [`listAdjustments`](https://developer.paddle.com/api-reference/adjustments/list-adjustments)
  - [`createAdjustment`](https://developer.paddle.com/api-reference/adjustments/create-adjustment)

- [**Pricing Preview**](https://developer.paddle.com/api-reference/pricing-preview/overview)

  - [`previewPrices`](https://developer.paddle.com/api-reference/pricing-preview/preview-prices)

- [**Event Types**](https://developer.paddle.com/api-reference/event-types/overview)

  - [`listEventTypes`](https://developer.paddle.com/api-reference/event-types/list-event-types)

- [**Events**](https://developer.paddle.com/api-reference/events/overview)

  - [`listEvents`](https://developer.paddle.com/api-reference/events/list-events)

- [**Notification Settings**](https://developer.paddle.com/api-reference/notification-settings/overview)

  - [`listNotificationSettings`](https://developer.paddle.com/api-reference/notification-settings/list-notification-settings)
  - [`createNotificationSetting`](https://developer.paddle.com/api-reference/notification-settings/create-notification-setting)
  - [`getNotificationSetting`](https://developer.paddle.com/api-reference/notification-settings/get-notification-setting)
  - [`updateNotificationSetting`](https://developer.paddle.com/api-reference/notification-settings/update-notification-setting)
  - [`deleteNotificationSetting`](https://developer.paddle.com/api-reference/notification-settings/delete-notification-setting)

- [**Notifications**](https://developer.paddle.com/api-reference/notifications/overview)

  - [`listNotifications`](https://developer.paddle.com/api-reference/notifications/list-notifications)
  - [`getNotification`](https://developer.paddle.com/api-reference/notifications/get-notification)
  - [`replayNotification`](https://developer.paddle.com/api-reference/notifications/replay-notification)

- [**Notification Logs**](https://developer.paddle.com/api-reference/notification-logs/overview)
  - [`listNotificationLogs`](https://developer.paddle.com/api-reference/notification-logs/list-notification-logs)

### Webhooks

To verify and parse the Paddle webhook, use `parseWebhookBody` function:

```ts
import express from "express";
import { parseWebhookBody } from "paddle-billing";

const app = express();

app.use(express.raw());

// Use the webhook's secret that you get when creating it the Paddle admin:
const secret = process.env.PADDLE_WEBHOOK_SECRET;

app.get("/paddle-webhook", (request, response) => {
  // Extract the webhook signature from the headers
  const signature = request.headers["paddle-signature"];
  if (!signature) {
    response.status(400).send("Bad Request");
    return;
  }

  // Parse the webhook
  const webhook = parseWebhookBody(
    null,
    secret,
    signature,
    // ⚠️ the body must be raw string to parse!
    request.body.toString()
  );

  // If the webhook is invalid, it will be null
  if (!webhook) {
    response.status(400).send("Bad Request");
    return;
  }

  response.send("OK");
});
```

If you have custom data types defined, pass the `client` as the first argument so that the custom data is correctly inferred:

```ts
const paddle = client<{
  Product: CustomDataProduct;
  Price: CustomDataPrice;
  Transaction: CustomDataTransaction;
  Subscription: CustomDataSubscription;
  SubscriptionItem: CustomDataSubscriptionItem;
  Customer: CustomDataCustomer;
  Address: CustomDataAddress;
  Business: CustomDataBusiness;
}>("PADDLE_SECRET");

// ...later:

const webhook = parseWebhookBody(
  paddle,
  secret,
  signature,
  request.body.toString()
);
```

### Web

The package also provides the web portion of the Paddle Billing platform replacing the first-party package [`@paddle/paddle-js`](https://www.npmjs.com/package/@paddle/paddle-js). Unlike the official package, this one provides more elaborate types and integration with [custom data](#typing-custom_data) that you might use on the backend.

To load the web API (known as Paddle.js), use `loadScript`:

```ts
import { loadScript } from "paddle-billing";

loadScript().then((Paddle) => {
  Paddle.Checkout.open({
    settings: {
      displayMode: "overlay",
      theme: "light",
      locale: "en",
    },

    items: [
      {
        priceId: "pri_01gm81eqze2vmmvhpjg13bfeqg",
        quantity: 1,
      },
      {
        priceId: "pri_01gm82kny0ad1tk358gxmsq87m",
        quantity: 1,
      },
    ],
  });
});
```

If you have custom data assigned to Paddle entities, use the `loadScript` generic param, the same way as when [creating the API client](#typing-custom_data):

```ts
interface CustomData {
  Transaction: AccountData;
  Subscription: AccountData;
}

interface AccountData {
  accountId: string;
}

const paddle = client<CustomData>("PADDLE_SECRET");

// ...later on web:

loadScript<CustomData>().then((Paddle) => {
  Paddle.Checkout.open({
    items: [
      {
        priceId: "pri_01gm81eqze2vmmvhpjg13bfeqg",
        quantity: 1,
      },
    ],

    customData: {
      accountId: "ACCOUNT_ID",
    },
  });
});
```

> ⚠️ When specifing `Subscription` and `Transaction`, you should make sure they overlap. Fields that do not overlap should be optional. It's dictated by the web's custom data-assigning to relevant transaction and subscription simultaneously. Creating an API or web client with incompatible custom data definitions will result in the client function returning `never`.

Read more about using [custom data through API](#typing-custom_data).

## License

[MIT © Sasha Koss](./LICENSE.md)
