import {
  client,
  createAddress,
  createBusiness,
  createCustomer,
  createDiscount,
  createPrice,
  createProduct,
  createTransaction,
  getAddress,
  getBusiness,
  getCustomer,
  getDiscount,
  getInvoice,
  getPrice,
  getProduct,
  getSubscription,
  getTransaction,
  listAddresses,
  listBusinesses,
  listCustomers,
  listDiscounts,
  listPrices,
  listProducts,
  listSubscriptions,
  listTransactions,
  previewUpdateSubscription,
  updateAddress,
  updateBusiness,
  updateCustomer,
  updateDiscount,
  updatePaymentMethodTransaction,
  updatePrice,
  updateProduct,
  updateSubscription,
  updateTransaction,
} from ".";

const api = client("test");

const apiCustomData = client<{
  Product: CustomDataProduct;
  Price: CustomDataPrice;
  Transaction: CustomDataTransaction;
  Subscription: CustomDataSubscription;
  SubscriptionItem: CustomDataSubscriptionItem;
}>("test");

interface CustomDataProduct {
  hello: string;
}

interface CustomDataPrice {
  foo: "bar";
}

interface CustomDataTransaction {
  qwe: "123";
}

interface CustomDataSubscription {
  sub: "scription";
}

interface CustomDataSubscriptionItem {
  item: number;
}

/// Products

//// List products

listProducts(api, {
  include: { prices: true },
}).then((products) => {
  if (products.error) return;
  products.data[0]?.prices[0]?.id;
  // @ts-expect-error: custom_data can be null
  products.data[0]?.custom_data.nope;
  // @ts-expect-error: custom_data can be null
  products.data[0]?.custom_data.hello;
  products.data[0]?.custom_data?.nope;
  products.data[0]?.custom_data?.hello;
});

listProducts(apiCustomData, {}).then((products) => {
  if (products.error) return;
  // @ts-expect-error: prices must be undefined unless include is set to "prices"
  products.data[0]?.prices[0]?.id;
  // @ts-expect-error: custom_data is specified
  products.data[0]?.custom_data.nope;
  products.data[0]?.custom_data.hello;
});

listProducts(api);

listProducts(api, {
  order_by: "created_at[ASC]",
});

//// Create product

createProduct(api, {
  name: "My Product",
  tax_category: "digital-goods",
  custom_data: {
    hello: "world",
    foo: "bar",
  },
}).then((product) => {
  if (product.error) return;
  // @ts-expect-error: custom_data can be null
  product.data.custom_data.hello;
  // @ts-expect-error: custom_data can be null
  product.data.custom_data.world;
  product.data.custom_data?.hello;
  product.data.custom_data?.world;
});

createProduct(apiCustomData, {
  name: "My Product",
  tax_category: "digital-goods",
  custom_data: {
    hello: "world",
    // @ts-expect-error: foo is not a valid custom_data key
    foo: "bar",
  },
}).then((product) => {
  if (product.error) return;
  product.data.custom_data.hello;
  // @ts-expect-error: world is not a valid custom_data key
  product.data.custom_data.world;
});

//// Get product

getProduct(api, "pro_12").then((product) => {
  if (product.error) return;
  // @ts-expect-error: prices must be undefined unless include is set to "prices"
  product.data.prices[0]?.id;

  // @ts-expect-error: custom_data can be null
  product.data.custom_data.hello;
  product.data.custom_data?.hello;
  product.data.custom_data?.nope;
});

getProduct(api, "pro_123", { include: "prices" }).then((product) => {
  if (product.error) return;
  product.data.prices[0]?.id;
});

getProduct(apiCustomData, "pro_123").then((product) => {
  if (product.error) return;
  product.data.custom_data.hello;
  // @ts-expect-error: custom_data is defined
  product.data.custom_data.nope;
});

//// Update product

updateProduct(api, "pro_12", {
  name: "My Product",
  tax_category: "digital-goods",
  custom_data: {
    hello: "world",
    foo: "bar",
  },
}).then((product) => {
  if (product.error) return;
  // @ts-expect-error: custom_data can be null
  product.data[0]?.custom_data.hello;
  // @ts-expect-error: custom_data can be null
  product.data[0]?.custom_data.world;
  product.data.custom_data?.hello;
  product.data.custom_data?.world;
});

updateProduct(apiCustomData, "pro_12", {
  name: "My Product",
  tax_category: "digital-goods",
  custom_data: {
    hello: "world",
    // @ts-expect-error: foo is not a valid custom_data key
    foo: "bar",
  },
}).then((product) => {
  if (product.error) return;
  product.data.custom_data.hello;
  // @ts-expect-error: world is not a valid custom_data key
  product.data.custom_data.world;
});

/// Prices

//// List prices

listPrices(api, {
  include: "product",
}).then((prices) => {
  if (prices.error) return;
  prices.data[0]?.product.id;
  // @ts-expect-error: custom_data can be null
  prices.data[0]?.custom_data.nope;
  // @ts-expect-error: custom_data can be null
  prices.data[0]?.custom_data.hello;
  prices.data[0]?.custom_data?.nope;
  prices.data[0]?.custom_data?.hello;
});

listPrices(apiCustomData, {}).then((prices) => {
  if (prices.error) return;
  // @ts-expect-error: product must be undefined unless include is set to "product"
  prices.data[0]?.product?.id;
  // @ts-expect-error: custom_data is defined
  prices.data[0]?.custom_data.nope;
  prices.data[0]?.custom_data.foo;
});

listPrices(api);

listPrices(api, {
  order_by: "unit_price[ASC]",
});

//// Create price

createPrice(api, {
  description: "Monthly Subscription",
  product_id: "pro_123",
  unit_price: { currency_code: "USD", amount: "10.00" },
  billing_cycle: { interval: "month", frequency: 1 },
  trial_period: null,
  tax_mode: "internal",
  unit_price_overrides: [],
  quantity: { minimum: 1, maximum: 100 },
  custom_data: {
    hello: "world",
    foo: "bar",
  },
}).then((price) => {
  if (price.error) return;
  // @ts-expect-error: custom_data can be null
  price.data.custom_data.hello;
  // @ts-expect-error: custom_data can be null
  price.data.custom_data.world;
  price.data.custom_data?.hello;
  price.data.custom_data?.world;
});

createPrice(apiCustomData, {
  description: "Monthly Subscription",
  product_id: "pro_123",
  unit_price: { currency_code: "USD", amount: "10.00" },
  billing_cycle: { interval: "month", frequency: 1 },
  trial_period: null,
  tax_mode: "internal",
  unit_price_overrides: [],
  quantity: { minimum: 1, maximum: 100 },
  custom_data: {
    // @ts-expect-error: hello is not a valid custom_data key
    hello: "world",
    foo: "bar",
  },
}).then((price) => {
  if (price.error) return;
  // @ts-expect-error: hello is not a valid custom_data key
  price.data.custom_data.hello;
  price.data.custom_data.foo;
});

// @ts-expect-error: custom_data must be defined
createPrice(apiCustomData, {
  description: "Monthly Subscription",
  product_id: "pro_123",
  unit_price: { currency_code: "USD", amount: "10.00" },
  billing_cycle: { interval: "month", frequency: 1 },
  trial_period: null,
  tax_mode: "internal",
  unit_price_overrides: [],
  quantity: { minimum: 1, maximum: 100 },
});

// quantity is optional
createPrice(api, {
  description: "Monthly Subscription",
  product_id: "pro_123",
  unit_price: { currency_code: "USD", amount: "10.00" },
  billing_cycle: { interval: "month", frequency: 1 },
  trial_period: null,
  tax_mode: "internal",
  unit_price_overrides: [],
});

//// Get price

getPrice(api, "pri_123").then((price) => {
  if (price.error) return;
  // @ts-expect-error: product must be undefined unless include is set to "prices"
  price.data.product?.id;

  // @ts-expect-error: custom_data can be null
  price.data.custom_data.hello;
  price.data.custom_data?.hello;
});

getPrice(api, "pri_123", { include: "product" }).then((price) => {
  if (price.error) return;
  price.data.product?.id;
});

getPrice(apiCustomData, "pri_123").then((product) => {
  if (product.error) return;
  product.data.custom_data.foo;
  // @ts-expect-error: custom_data is defined
  product.data.custom_data.hello;
});

//// Update product

updatePrice(api, "pri_12", {
  description: "My Price",
  billing_cycle: { interval: "month", frequency: 1 },
  custom_data: {
    hello: "world",
    foo: "bar",
  },
}).then((product) => {
  if (product.error) return;
  // @ts-expect-error: custom_data can be null
  product.data.custom_data.hello;
  // @ts-expect-error: custom_data can be null
  product.data.custom_data.world;
  product.data.custom_data?.hello;
  product.data.custom_data?.world;
});

updatePrice(apiCustomData, "pri_12", {
  description: "My Price",
  billing_cycle: { interval: "month", frequency: 1 },
  custom_data: {
    // @ts-expect-error: hello is not a valid custom_data key
    hello: "world",
    foo: "bar",
  },
}).then((product) => {
  if (product.error) return;
  product.data.custom_data.foo;
  // @ts-expect-error: world is not a valid custom_data key
  product.data.custom_data.world;
});

/// Discounts

//// List discounts

listDiscounts(api, {
  order_by: "created_at[ASC]",
});

//// Create discount

createDiscount(api, {
  amount: "10.00",
  description: "Discount Description",
  type: "percentage",
  enabled_for_checkout: true,
  code: "DISCOUNTCODE",
  currency_code: "USD",
  recur: false,
  maximum_recurring_intervals: 3,
  usage_limit: 100,
  restrict_to: ["prod_123", "prod_456"],
  expires_at: "2022-12-31T23:59:59Z",
});

//// Get discount

getDiscount(api, "dsc_123");

//// Update discount

updateDiscount(api, "dsc_123", {
  amount: "10.00",
  description: "Discount Description",
  type: "percentage",
  enabled_for_checkout: true,
  code: "DISCOUNTCODE",
  currency_code: "USD",
  recur: false,
  maximum_recurring_intervals: 3,
  usage_limit: 100,
  restrict_to: ["prod_123", "prod_456"],
  expires_at: "2022-12-31T23:59:59Z",
});

/// Customers

//// List customers

listCustomers(api, {
  order_by: "created_at[ASC]",
});

//// Create customer

createCustomer(api, {
  email: "hello@example.com",
});

createCustomer(api, {
  email: "hello@example.com",
  // Allow setting locale to undefined
  locale: undefined,
});

//// Get customer

getCustomer(api, "ctm_123").then((customer) => {
  if (customer.error) return;
  // Locale must be defined
  customer.data.locale.toString();
});

//// Update customer

updateCustomer(api, "ctm_123", {
  email: "hello@example.com",
  status: "archived",
});

/// Addresses

//// List addresses

listAddresses(api, "ctm_123", {
  order_by: "city[ASC]",
});

//// Create address

createAddress(api, "ctm_123", {
  country_code: "US",
  description: "Main Address",
  first_line: "123 Main St",
  second_line: undefined,
  city: "San Francisco",
  postal_code: "94102",
  region: "California",
});

//// Get address

getAddress(api, "ctm_123", "add_123").then((address) => {
  if (address.error) return;
  address.data.city?.toString();
});

//// Update address

updateAddress(api, "ctm_123", "add_456", {
  city: "Singapore",
});

/// Bussinesses

//// List businesses

listBusinesses(api, "ctm_123", {
  order_by: "name[ASC]",
});

//// Create business

createBusiness(api, "ctm_123", {
  name: "Business Name",
  company_number: "1234567890",
  tax_identifier: "GB1234567890",
  contacts: [
    {
      name: "John Doe",
      email: "johndoe@example.com",
    },
  ],
});

//// Get business

getBusiness(api, "ctm_123", "biz_123").then((business) => {
  if (business.error) return;
  business.data.name.toString();
});

//// Update businesses

updateBusiness(api, "ctm_123", "biz_123", {
  name: "ACME Inc.",
});

/// Transactions

//// List transactions

listTransactions(api, {
  include: {
    address: true,
    adjustment: true,
    adjustments_totals: true,
    business: true,
    customer: true,
    discount: true,
  },
}).then((transactions) => {
  if (transactions.error) return;
  transactions.data[0]?.address?.id;
  transactions.data[0]?.adjustment?.[0]?.toString();
  transactions.data[0]?.adjustments_totals?.total;
  transactions.data[0]?.business?.id;
  transactions.data[0]?.customer?.id;
  transactions.data[0]?.discount?.id;
  // @ts-expect-error: custom_data can be null
  transactions.data[0]?.custom_data.nope;
  // @ts-expect-error: custom_data can be null
  transactions.data[0]?.custom_data.hello;
  transactions.data[0]?.custom_data?.nope;
  transactions.data[0]?.custom_data?.hello;
});

listTransactions(apiCustomData, {}).then((transactions) => {
  if (transactions.error) return;
  // @ts-expect-error: it's not included
  transactions.data[0]?.adjustment?.[0]?.toString();
  // @ts-expect-error: it's not included
  transactions.data[0]?.adjustments_totals?.total;
  // @ts-expect-error: it's not included
  transactions.data[0]?.business?.id;
  // @ts-expect-error: it's not included
  transactions.data[0]?.customer?.id;
  // @ts-expect-error: it's not included
  transactions.data[0]?.discount?.id;
  transactions.data[0]?.custom_data.qwe;
  // @ts-expect-error: custom_data is defined
  transactions.data[0]?.custom_data.asd;
});

listTransactions(api);

listTransactions(api, {
  order_by: "created_at[ASC]",
  billed_at: "[GT]2021-01-01T00:00:00Z",
});

listTransactions(api, {
  // @ts-expect-error: invalid field
  order_by: "nope[ASC]",
});

//// Create product

createTransaction(api, {
  items: [],
  customer_id: "ctm_789",
  address_id: "add_101",
  status: "billed",
  currency_code: "USD",
  collection_mode: "manual",
  custom_data: { hello: "world" },
}).then((transaction) => {
  if (transaction.error) return;

  // @ts-expect-error: custom_data can be null
  transaction.data.custom_data.hello;
  // @ts-expect-error: custom_data can be null
  transaction.data.custom_data.world;
  transaction.data.custom_data?.hello;
  transaction.data.custom_data?.world;
});

createTransaction(apiCustomData, {
  items: [],
  customer_id: "ctm_789",
  address_id: "add_101",
  status: "billed",
  currency_code: "USD",
  collection_mode: "manual",
  custom_data: {
    qwe: "123",
    // @ts-expect-error: foo is not a valid custom_data key
    nope: "nah",
  },
}).then((transaction) => {
  if (transaction.error) return;

  transaction.data.custom_data.qwe;
  // @ts-expect-error: world is not a valid custom_data key
  transaction.data.custom_data.world;
});

createTransaction(
  api,
  {
    items: [],
    customer_id: "ctm_789",
    address_id: "add_101",
    status: "billed",
    currency_code: "USD",
    collection_mode: "manual",
    custom_data: { hello: "world" },
  },
  {
    include: {
      address: true,
      adjustment: true,
      adjustments_totals: true,
      business: true,
      customer: true,
      discount: true,
    },
  }
).then((transaction) => {
  if (transaction.error) return;
  transaction.data.address?.id;
  transaction.data.adjustment?.[0]?.toString();
  transaction.data.adjustments_totals?.total;
  transaction.data.business?.id;
  transaction.data.customer?.id;
  transaction.data.discount?.id;
});

createTransaction(api, {
  items: [],
  customer_id: "ctm_789",
  address_id: "add_101",
  status: "billed",
  currency_code: "USD",
  collection_mode: "manual",
}).then((transaction) => {
  if (transaction.error) return;
  // @ts-expect-error: it's not included
  transaction.data.adjustment?.[0]?.toString();
  // @ts-expect-error: it's not included
  transaction.data.adjustments_totals?.total;
  // @ts-expect-error: it's not included
  transaction.data.business?.id;
  // @ts-expect-error: it's not included
  transaction.data.customer?.id;
  // @ts-expect-error: it's not included
  transaction.data.discount?.id;
});

//// Get product

getTransaction(api, "txn_123").then((product) => {
  if (product.error) return;
  // @ts-expect-error: custom_data can be null
  product.data.custom_data.hello;
  product.data.custom_data?.hello;
  product.data.custom_data?.nope;
});

getTransaction(api, "txn_123", {
  include: {
    address: true,
    adjustment: true,
    adjustments_totals: true,
    business: true,
    customer: true,
    discount: true,
  },
}).then((transaction) => {
  if (transaction.error) return;
  transaction.data.address?.id;
  transaction.data.adjustment?.[0]?.toString();
  transaction.data.adjustments_totals?.total;
  transaction.data.business?.id;
  transaction.data.customer?.id;
  transaction.data.discount?.id;
});

getTransaction(api, "txn_123").then((product) => {
  if (product.error) return;
  // @ts-expect-error: it's not included
  transaction.data.adjustment?.[0]?.toString();
  // @ts-expect-error: it's not included
  transaction.data.adjustments_totals?.total;
  // @ts-expect-error: it's not included
  transaction.data.business?.id;
  // @ts-expect-error: it's not included
  transaction.data.customer?.id;
  // @ts-expect-error: it's not included
  transaction.data.discount?.id;
});

//// Update product

updateTransaction(api, "txn_123", {
  status: "billed",
  custom_data: {
    hello: "world",
    foo: "bar",
  },
}).then((product) => {
  if (product.error) return;
  // @ts-expect-error: custom_data can be null
  product.data.custom_data.hello;
  product.data.custom_data?.hello;
  product.data.custom_data?.nope;
});

updateTransaction(apiCustomData, "txn_123", {
  status: "billed",
  custom_data: {
    qwe: "123",
    // @ts-expect-error: foo is not a valid custom_data key
    foo: "bar",
  },
}).then((product) => {
  if (product.error) return;
  product.data.custom_data.qwe;
  // @ts-expect-error: world is not a valid custom_data key
  product.data.custom_data.world;
});

/// Invoices

//// Get invoice

getInvoice(api, "txn_123").then((invoice) => {
  if (invoice.error) return;
  invoice.data.url;
});

/// Subscriptions

//// List subscriptions

listSubscriptions(api, {
  order_by: "created_at[ASC]",
}).then((subscriptions) => {
  if (subscriptions.error) return;

  const sub = subscriptions.data[0];
  if (!sub) return;
  // @ts-expect-error: custom_data can be null
  sub.custom_data.random;
  sub.custom_data?.random;

  const item = sub.items[0];
  if (!item) return;

  // @ts-expect-error: custom_data can be null
  item.custom_data.random;
  item.custom_data?.random;

  // @ts-expect-error: custom_data can be null
  item.price.custom_data.random;
  item.price.custom_data?.random;
});

listSubscriptions(apiCustomData, {
  order_by: "created_at[ASC]",
}).then((subscriptions) => {
  if (subscriptions.error) return;

  const sub = subscriptions.data[0];
  if (!sub) return;
  sub.custom_data.sub;
  // @ts-expect-error: custom_data is specified
  sub.custom_data.random;

  const item = sub.items[0];
  if (!item) return;

  item.custom_data.item.toFixed(2);
  // @ts-expect-error: custom_data is specified
  item.custom_data.random;

  item.price.custom_data.foo.at(0);
  // @ts-expect-error: custom_data is specified
  item.price.custom_data.random;
});

//// Get subscription

getSubscription(api, "sub_123").then((subscription) => {
  if (subscription.error) return;

  // @ts-expect-error: custom_data can be null
  subscription.data.custom_data.random;
  subscription.data.custom_data?.random;

  const item = subscription.data.items[0];
  if (!item) return;

  // @ts-expect-error: custom_data can be null
  item.custom_data.random;
  item.custom_data?.random;

  // @ts-expect-error: custom_data can be null
  item.price.custom_data.random;
  item.price.custom_data?.random;
});

getSubscription(apiCustomData, "sub_123").then((subscription) => {
  if (subscription.error) return;

  subscription.data.custom_data.sub;
  // @ts-expect-error: custom_data is specified
  subscription.data.custom_data.random;

  const item = subscription.data.items[0];
  if (!item) return;

  item.custom_data.item.toFixed(2);
  // @ts-expect-error: custom_data is specified
  item.custom_data.random;

  item.price.custom_data.foo.at(0);
  // @ts-expect-error: custom_data is specified
  item.price.custom_data.random;
});

getSubscription(api, "sub_123").then((subscription) => {
  if (subscription.error) return;

  // @ts-expect-error: next_transaction is never
  subscription.data.next_transaction?.billing_period;
  // @ts-expect-error: next_transaction is never
  subscription.data.recurring_transaction_details.tax_rates_used;
});

getSubscription(api, "sub_123", { include: { next_transaction: true } }).then(
  (subscription) => {
    if (subscription.error) return;

    subscription.data.next_transaction?.billing_period;
    // @ts-expect-error: next_transaction is never
    subscription.data.recurring_transaction_details.tax_rates_used;
  }
);

getSubscription(api, "sub_123", {
  include: { recurring_transaction_details: true },
}).then((subscription) => {
  if (subscription.error) return;

  // @ts-expect-error: next_transaction is never
  subscription.data.next_transaction?.billing_period;
  subscription.data.recurring_transaction_details.tax_rates_used;
});

//// Create subscription

updateSubscription(api, "sub_123", {
  scheduled_change: null,
  items: [],
  custom_data: {
    nope: "okay",
    what: "ever",
  },
}).then((subscription) => {
  if (subscription.error) return;

  // @ts-expect-error: custom_data can be null
  subscription.data.custom_data.random;
  subscription.data.custom_data?.random;

  const item = subscription.data.items[0];
  if (!item) return;

  // @ts-expect-error: custom_data can be null
  item.custom_data.random;
  item.custom_data?.random;

  // @ts-expect-error: custom_data can be null
  item.price.custom_data.random;
  item.price.custom_data?.random;
});

updateSubscription(apiCustomData, "sub_123", {
  scheduled_change: null,
  items: [],
  custom_data: {
    sub: "scription",
    // @ts-expect-error: nope is not a valid custom_data key
    nope: "okay",
  },
}).then((subscription) => {
  if (subscription.error) return;

  subscription.data.custom_data.sub;
  // @ts-expect-error: custom_data is specified
  subscription.data.custom_data.random;

  const item = subscription.data.items[0];
  if (!item) return;

  item.custom_data.item.toFixed(2);
  // @ts-expect-error: custom_data is specified
  item.custom_data.random;

  item.price.custom_data.foo.at(0);
  // @ts-expect-error: custom_data is specified
  item.price.custom_data.random;
});

//// Preview create subscription

previewUpdateSubscription(api, "sub_123", {
  scheduled_change: null,
  items: [],
  custom_data: {
    nope: "okay",
    what: "ever",
  },
}).then((subscription) => {
  if (subscription.error) return;

  // @ts-expect-error: custom_data can be null
  subscription.data.custom_data.random;
  subscription.data.custom_data?.random;

  const item = subscription.data.items[0];
  if (!item) return;

  // @ts-expect-error: custom_data can be null
  item.custom_data.random;
  item.custom_data?.random;

  // @ts-expect-error: custom_data can be null
  item.price.custom_data.random;
  item.price.custom_data?.random;
});

previewUpdateSubscription(apiCustomData, "sub_123", {
  scheduled_change: null,
  items: [],
  custom_data: {
    sub: "scription",
    // @ts-expect-error: nope is not a valid custom_data key
    nope: "okay",
  },
}).then((subscription) => {
  if (subscription.error) return;

  subscription.data.custom_data.sub;
  // @ts-expect-error: custom_data is specified
  subscription.data.custom_data.random;

  const item = subscription.data.items[0];
  if (!item) return;

  item.custom_data.item.toFixed(2);
  // @ts-expect-error: custom_data is specified
  item.custom_data.random;

  item.price.custom_data.foo.at(0);
  // @ts-expect-error: custom_data is specified
  item.price.custom_data.random;
});

//// Update payment method transaction

updatePaymentMethodTransaction(api, "sub_123").then((transaction) => {
  if (transaction.error) return;

  // @ts-expect-error: custom_data can be null
  transaction.data.custom_data.hello;
  // @ts-expect-error: custom_data can be null
  transaction.data.custom_data.world;
  transaction.data.custom_data?.hello;
  transaction.data.custom_data?.world;

  const item = transaction.data.items[0];
  if (!item) return;

  // @ts-expect-error: custom_data can be null
  item.price.custom_data.random;
  item.price.custom_data?.random;
});

updatePaymentMethodTransaction(apiCustomData, "sub_123").then((transaction) => {
  if (transaction.error) return;

  transaction.data.custom_data.qwe;
  // @ts-expect-error: world is not a valid custom_data key
  transaction.data.custom_data.world;

  const item = transaction.data.items[0];
  if (!item) return;

  item.price.custom_data.foo.at(0);
  // @ts-expect-error: custom_data is specified
  item.price.custom_data.random;
});
