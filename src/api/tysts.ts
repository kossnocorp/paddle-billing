import {
  cancelSubscription,
  client,
  createAddress,
  createAdjustment,
  createBusiness,
  createCharge,
  createCustomer,
  createDiscount,
  createNotificationSetting,
  createPrice,
  createProduct,
  createTransaction,
  deleteNotificationSetting,
  getAddress,
  getBusiness,
  getCustomer,
  getDiscount,
  getInvoice,
  getNotification,
  getNotificationSetting,
  getPrice,
  getProduct,
  getSubscription,
  getTransaction,
  listAddresses,
  listAdjustments,
  listBusinesses,
  listCustomers,
  listDiscounts,
  listEventTypes,
  listEvents,
  listNotificationLogs,
  listNotificationSettings,
  listNotifications,
  listPrices,
  listProducts,
  listSubscriptions,
  listTransactions,
  pauseSubscription,
  previewCharge,
  previewPrices,
  previewUpdateSubscription,
  replayNotification,
  resumeSubscription,
  updateAddress,
  updateBusiness,
  updateCustomer,
  updateDiscount,
  updateNotificationSetting,
  updatePaymentMethodTransaction,
  updatePrice,
  updateProduct,
  updateSubscription,
  updateTransaction,
} from ".";
import { Paddle as Core } from "../types";

const api = client("test");

const apiCustomData = client<{
  Product: CustomDataProduct;
  Price: CustomDataPrice;
  Transaction: CustomDataTransaction;
  Subscription: CustomDataSubscription;
  SubscriptionItem: CustomDataSubscriptionItem;
  Customer: CustomDataCustomer;
  Address: CustomDataAddress;
  Business: CustomDataBusiness;
}>("test");

interface CustomDataProduct {
  hello: string;
}

interface CustomDataPrice {
  foo: "bar";
}

interface CustomDataTransaction {
  qwe?: "123";
  shared: boolean;
}

interface CustomDataSubscription {
  sub?: "scription";
  shared: boolean;
}

interface CustomDataSubscriptionItem {
  item: number;
}

interface CustomDataCustomer {
  name: string;
}

interface CustomDataAddress {
  city: string;
}

interface CustomDataBusiness {
  type: "b2b" | "b2c";
}

/// Client

//// Shared fields are equal

interface ClientSharedOKData {
  Transaction: CustomDataTransaction;
  Subscription: CustomDataSubscription;
}

const clientSharedOK = client<ClientSharedOKData>("test");

clientSharedOK.key;

type TestClientSharedOkResult =
  Core.SharedTransactionSubscriptionCustomData<ClientSharedOKData>;

type TestClientSharedOk = Assert<
  TestClientSharedOkResult,
  { shared: boolean }
> &
  Assert<{ shared: boolean }, TestClientSharedOkResult>;

//// Shared fields don't match

const clientSharedNope = client<{
  Transaction: CustomDataTransaction;
  Subscription: { notCool: true };
}>("test");

// @ts-expect-error: clientSharedNope should be never
clientSharedNope.key;

//// One of the types is not specified

interface ClientSharedNotSpecifiedTransaction {
  Subscription: CustomDataSubscription;
}

const clientSharedNotSpecifiedTransaction =
  client<ClientSharedNotSpecifiedTransaction>("test");

clientSharedNotSpecifiedTransaction.key;

type TestClientSharedNotSpecifiedTransactionResult =
  Core.SharedTransactionSubscriptionCustomData<ClientSharedNotSpecifiedTransaction>;

type TestClientSharedNotSpecifiedTransaction = Assert<
  TestClientSharedNotSpecifiedTransactionResult,
  { shared: boolean }
> &
  Assert<{ shared: boolean }, TestClientSharedNotSpecifiedTransactionResult>;

interface ClientSharedNotSpecifiedSubscription {
  Transaction: CustomDataTransaction;
}

const clientSharedNotSpecifiedSubscription =
  client<ClientSharedNotSpecifiedSubscription>("test");

clientSharedNotSpecifiedSubscription.key;

type TestClientSharedNotSpecifiedSubscriptionResult =
  Core.SharedTransactionSubscriptionCustomData<ClientSharedNotSpecifiedSubscription>;

type TestClientSharedNotSpecifiedSubscription = Assert<
  TestClientSharedNotSpecifiedSubscriptionResult,
  { shared: boolean }
> &
  Assert<{ shared: boolean }, TestClientSharedNotSpecifiedSubscriptionResult>;

//// Both are not specified

interface ClientSharedNotSpecified {}

const clientSharedNotSpecified = client<ClientSharedNotSpecified>("test");

clientSharedNotSpecified.key;

type TestClientSharedNotSpecifiedResult =
  Core.SharedTransactionSubscriptionCustomData<ClientSharedNotSpecified>;

type TestClientSharedNotSpecified = Assert<
  TestClientSharedNotSpecifiedResult,
  Record<string, any> | null
> &
  Assert<Record<string, any> | null, TestClientSharedNotSpecifiedResult>;

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
    foo: "bar",
    // @ts-expect-error: hello is not a valid custom_data key
    hello: "world",
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
}).then((customers) => {
  if (customers.error) return;

  // @ts-expect-error: custom_data can be null
  customers.data[0]?.custom_data.nope;
  // @ts-expect-error: custom_data can be null
  customers.data[0]?.custom_data.hello;
  customers.data[0]?.custom_data?.nope;
  customers.data[0]?.custom_data?.hello;
});

listCustomers(apiCustomData, { order_by: "created_at[ASC]" }).then(
  (customers) => {
    if (customers.error) return;

    // @ts-expect-error: custom_data is specified
    customers.data[0]?.custom_data.nope;
    customers.data[0]?.custom_data.name;
  }
);

//// Create customer

createCustomer(api, {
  email: "hello@example.com",
});

createCustomer(api, {
  email: "hello@example.com",
  // Allow setting locale to undefined
  locale: undefined,
});

createCustomer(api, {
  email: "hello@example.com",
  custom_data: {
    hello: "world",
    foo: "bar",
  },
});

createCustomer(apiCustomData, {
  email: "hello@example.com",
  custom_data: {
    name: "Sasha",
    // @ts-expect-error: hello is not a valid custom_data key
    hello: "world",
  },
});

//// Get customer

getCustomer(api, "ctm_123").then((customer) => {
  if (customer.error) return;
  // Locale must be defined
  customer.data.locale.toString();

  // @ts-expect-error: custom_data can be null
  customer.data.custom_data.nope;
  // @ts-expect-error: custom_data can be null
  customer.data.custom_data.hello;
  customer.data.custom_data?.nope;
  customer.data.custom_data?.hello;
});

getCustomer(apiCustomData, "ctm_123").then((customer) => {
  if (customer.error) return;

  // @ts-expect-error: custom_data is specified
  customer.data.custom_data.nope;
  customer.data.custom_data.name;
});

//// Update customer

updateCustomer(api, "ctm_123", {
  email: "hello@example.com",
  status: "archived",
});

updateCustomer(api, "ctm_123", {
  custom_data: {
    hello: "world",
    foo: "bar",
  },
});

updateCustomer(apiCustomData, "ctm_123", {
  custom_data: {
    name: "Sasha",
    // @ts-expect-error: hello is not a valid custom_data key
    hello: "world",
  },
});

/// Addresses

//// List addresses

listAddresses(api, "ctm_123", {
  order_by: "city[ASC]",
}).then((addresses) => {
  if (addresses.error) return;
  // @ts-expect-error: custom_data can be null
  addresses.data[0]?.custom_data.nope;
  // @ts-expect-error: custom_data can be null
  addresses.data[0]?.custom_data.hello;
  addresses.data[0]?.custom_data?.nope;
  addresses.data[0]?.custom_data?.hello;
});

listAddresses(apiCustomData, "ctm_123", {
  order_by: "city[ASC]",
}).then((addresses) => {
  if (addresses.error) return;
  // @ts-expect-error: custom_data is specified
  addresses.data[0]?.custom_data.nope;
  addresses.data[0]?.custom_data.city;
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

createAddress(api, "ctm_123", {
  country_code: "US",
  custom_data: {
    hello: "world",
    foo: "bar",
  },
});

createAddress(apiCustomData, "ctm_123", {
  country_code: "US",
  custom_data: {
    city: "Singapore",
    // @ts-expect-error: hello is not a valid custom_data key
    hello: "world",
  },
});

//// Get address

getAddress(api, "ctm_123", "add_123").then((address) => {
  if (address.error) return;
  address.data.city?.toString();

  // @ts-expect-error: custom_data can be null
  address.data.custom_data.nope;
  // @ts-expect-error: custom_data can be null
  address.data.custom_data.hello;
  address.data.custom_data?.nope;
  address.data.custom_data?.hello;
});

getAddress(apiCustomData, "ctm_123", "add_123").then((address) => {
  if (address.error) return;

  // @ts-expect-error: custom_data is specified
  address.data.custom_data.nope;
  address.data.custom_data.city;
});

//// Update address

updateAddress(api, "ctm_123", "add_456", {
  city: "Singapore",
});

updateAddress(api, "ctm_123", "add_456", {
  custom_data: {
    hello: "world",
    foo: "bar",
  },
});

updateAddress(apiCustomData, "ctm_123", "add_456", {
  custom_data: {
    city: "Singapore",
    // @ts-expect-error: hello is not a valid custom_data key
    hello: "world",
  },
});

/// Bussinesses

//// List businesses

listBusinesses(api, "ctm_123", {
  order_by: "name[ASC]",
}).then((businesses) => {
  if (businesses.error) return;

  // @ts-expect-error: custom_data can be null
  businesses.data[0]?.custom_data.nope;
  // @ts-expect-error: custom_data can be null
  businesses.data[0]?.custom_data.hello;
  businesses.data[0]?.custom_data?.nope;
  businesses.data[0]?.custom_data?.hello;
});

listBusinesses(apiCustomData, "ctm_123", {
  order_by: "name[ASC]",
}).then((businesses) => {
  if (businesses.error) return;

  // @ts-expect-error: custom_data is specified
  businesses.data[0]?.custom_data.nope;
  businesses.data[0]?.custom_data.type;
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

createBusiness(api, "ctm_123", {
  name: "Business Name",
  contacts: [],
  custom_data: {
    hello: "world",
    foo: "bar",
  },
});

createBusiness(apiCustomData, "ctm_123", {
  name: "Business Name",
  contacts: [],
  custom_data: {
    type: "b2b",
    // @ts-expect-error: hello is not a valid custom_data key
    hello: "world",
  },
});

//// Get business

getBusiness(api, "ctm_123", "biz_123").then((business) => {
  if (business.error) return;

  business.data.name.toString();

  // @ts-expect-error: custom_data can be null
  business.data.custom_data.nope;
  // @ts-expect-error: custom_data can be null
  business.data.custom_data.hello;
  business.data.custom_data?.nope;
  business.data.custom_data?.hello;
});

getBusiness(apiCustomData, "ctm_123", "biz_123").then((business) => {
  if (business.error) return;

  // @ts-expect-error: custom_data is specified
  business.data.custom_data.nope;
  business.data.custom_data.type;
});

//// Update businesses

updateBusiness(api, "ctm_123", "biz_123", {
  name: "ACME Inc.",
});

updateBusiness(api, "ctm_123", "biz_123", {
  custom_data: {
    hello: "world",
    foo: "bar",
  },
});

updateBusiness(apiCustomData, "ctm_123", "biz_123", {
  custom_data: {
    type: "b2b",
    // @ts-expect-error: hello is not a valid custom_data key
    hello: "world",
  },
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

  const item = transaction.data.items[0];
  if (!item) return;

  // @ts-expect-error: custom_data can be null
  item.price.custom_data.random;
  item.price.custom_data?.random;
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

  const item = transaction.data.items[0];
  if (!item) return;

  item.price.custom_data.foo.at(0);
  // @ts-expect-error: custom_data is specified
  item.price.custom_data.random;
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

//// Pause subscription

pauseSubscription(api, "sub_123", {
  effective_from: "next_billing_period",
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

pauseSubscription(apiCustomData, "sub_123", {
  effective_from: "next_billing_period",
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

//// Resume subscription

resumeSubscription(api, "sub_123", {
  effective_from: "next_billing_period",
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

resumeSubscription(apiCustomData, "sub_123", {
  effective_from: "next_billing_period",
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

//// Cancel subscription

cancelSubscription(api, "sub_123", {
  effective_from: "next_billing_period",
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

cancelSubscription(apiCustomData, "sub_123", {
  effective_from: "next_billing_period",
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

/// One-time charges

//// Create one-time charge

createCharge(api, "sub_123", {
  effective_from: "next_billing_period",
  items: [],
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

createCharge(apiCustomData, "sub_123", {
  effective_from: "next_billing_period",
  items: [],
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

//// Preview create one-time charge

previewCharge(api, "sub_123", {
  effective_from: "next_billing_period",
  items: [],
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

previewCharge(apiCustomData, "sub_123", {
  effective_from: "next_billing_period",
  items: [],
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

/// Adjustments

//// List adjustments

listAdjustments(api, {
  status: "rejected",
}).then((adjustments) => {
  if (adjustments.error) return;
  adjustments.data[0]?.credit_applied_to_balance;
});

//// Create adjustment

createAdjustment(api, {
  action: "refund",
  items: [],
  reason: "Customer request",
  transaction_id: "txn_123",
}).then((adjustment) => {
  if (adjustment.error) return;
  adjustment.data.credit_applied_to_balance;
});

/// Pricing preview

//// Preview prices

previewPrices(api, { items: [] }).then((result) => {
  if (result.error) return;

  const item = result.data.details.line_items[0];
  if (!item) return;

  // @ts-expect-error: custom_data can be null
  item.price.custom_data.random;
  item.price.custom_data?.random;

  // @ts-expect-error: custom_data can be null
  item.product.custom_data.hello;
  // @ts-expect-error: custom_data can be null
  item.product.custom_data.world;
  item.product.custom_data?.hello;
  item.product.custom_data?.world;
});

previewPrices(apiCustomData, { items: [] }).then((result) => {
  if (result.error) return;

  const item = result.data.details.line_items[0];
  if (!item) return;

  item.price.custom_data.foo.at(0);
  // @ts-expect-error: custom_data is specified
  item.price.custom_data.random;

  item.product.custom_data.hello;
  // @ts-expect-error: world is not a valid custom_data key
  item.product.custom_data.world;
});

/// Event types

listEventTypes(api).then((eventTypes) => {
  if (eventTypes.error) return;
  eventTypes.data[0]?.name;
});

/// Events

listEvents(api, { per_page: 5 }).then((events) => {
  if (events.error) return;

  const event = events.data[0];
  if (!event) return;

  switch (event.event_type) {
    case "subscription.activated":
    case "subscription.created":
    case "subscription.canceled":
    case "subscription.past_due":
    case "subscription.paused":
    case "subscription.resumed":
    case "subscription.trialing":
    case "subscription.updated": {
      const sub = event.data;

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

      return;
    }

    case "transaction.billed":
    case "transaction.created":
    case "transaction.canceled":
    case "transaction.completed":
    case "transaction.past_due":
    case "transaction.payment_failed":
    case "transaction.ready":
    case "transaction.updated": {
      const transaction = event.data;

      // @ts-expect-error: custom_data can be null
      transaction.custom_data.hello;
      // @ts-expect-error: custom_data can be null
      transaction.custom_data.world;
      transaction.custom_data?.hello;
      transaction.custom_data?.world;

      const item = transaction.items[0];
      if (!item) return;

      // @ts-expect-error: custom_data can be null
      item.price.custom_data.random;
      item.price.custom_data?.random;

      return;
    }

    case "product.created":
    case "product.updated": {
      const product = event.data;

      // @ts-expect-error: custom_data can be null
      product.custom_data.hello;
      product.custom_data?.hello;
      product.custom_data?.nope;

      return;
    }

    case "price.created":
    case "price.updated": {
      const price = event.data;

      // @ts-expect-error: custom_data can be null
      price.custom_data.random;
      price.custom_data?.random;

      return;
    }
  }
});

listEvents(apiCustomData).then((events) => {
  if (events.error) return;

  const event = events.data[0];
  if (!event) return;

  switch (event.event_type) {
    case "subscription.activated":
    case "subscription.created":
    case "subscription.canceled":
    case "subscription.past_due":
    case "subscription.paused":
    case "subscription.resumed":
    case "subscription.trialing":
    case "subscription.updated": {
      const sub = event.data;

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

      return;
    }

    case "transaction.billed":
    case "transaction.created":
    case "transaction.canceled":
    case "transaction.completed":
    case "transaction.past_due":
    case "transaction.payment_failed":
    case "transaction.ready":
    case "transaction.updated": {
      const transaction = event.data;

      transaction.custom_data.qwe;
      // @ts-expect-error: world is not a valid custom_data key
      transaction.custom_data.world;

      const item = transaction.items[0];
      if (!item) return;

      item.price.custom_data.foo.at(0);
      // @ts-expect-error: custom_data is specified
      item.price.custom_data.random;

      return;
    }

    case "product.created":
    case "product.updated": {
      const product = event.data;

      product.custom_data.hello;
      // @ts-expect-error: custom_data is defined
      product.custom_data.nope;
      return;
    }

    case "price.created":
    case "price.updated": {
      const price = event.data;

      price.custom_data.foo.at(0);
      // @ts-expect-error: custom_data is specified
      price.custom_data.random;

      return;
    }
  }
});

/// Notification settings

//// List notification settings

listNotificationSettings(api).then((settings) => {
  if (settings.error) return;
  settings.data[0]?.destination;
});

//// Create notification setting

createNotificationSetting(api, {
  description: "Notification Description",
  destination: "https://example.com/webhook",
  subscribed_events: [],
  type: "url" as const,
  active: true,
  api_version: 2,
  include_sensitive_fields: true,
}).then((setting) => {
  if (setting.error) return;
  setting.data.destination;
});

//// Get notification setting

getNotificationSetting(api, "ntfset_123").then((setting) => {
  if (setting.error) return;
  setting.data.destination;
});

//// Update notification setting

updateNotificationSetting(api, "ntfset_123", {
  destination: "https://example.com/webhook",
}).then((setting) => {
  if (setting.error) return;
  setting.data.destination;
});

//// Delete notification setting

deleteNotificationSetting(api, "ntfset_123");

/// Notifications

//// List notifications

listNotifications(api).then((notifications) => {
  if (notifications.error) return;
  notifications.data[0]?.notification_setting_id;
});

//// Get notification

getNotification(api, "ntf_123").then((notification) => {
  if (notification.error) return;
  notification.data.notification_setting_id;
});

//// Replay notification

replayNotification(api, "ntf_123").then((notification) => {
  if (notification.error) return;
  notification.data.notification_id;
});

/// Notification logs

//// List notification logs

listNotificationLogs(api, "ntf_123").then((logs) => {
  if (logs.error) return;
  logs.data[0]?.attempted_at;
});

/// Utils

type Assert<Type1, _Type2 extends Type1> = true;

function assertType<Type>(_value: Type) {}

type TypeEqual<T, U> = Exclude<T, U> extends never
  ? Exclude<U, T> extends never
    ? true
    : false
  : false;
