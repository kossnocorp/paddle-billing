import {
  client,
  createCustomer,
  createDiscount,
  createPrice,
  createProduct,
  getCustomer,
  getDiscount,
  getPrice,
  getProduct,
  listCustomers,
  listDiscounts,
  listPrices,
  listProducts,
  updateCustomer,
  updateDiscount,
  updatePrice,
  updateProduct,
} from ".";

const api = client("test");

const apiCustomData = client<{
  Product: CustomDataProduct;
  Price: CustomDataPrice;
}>("test");

interface CustomDataProduct {
  hello: string;
}

interface CustomDataPrice {
  foo: "bar";
}

/// Products

//// List products

listProducts(api, {
  include: "prices",
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
  product.data[0]?.custom_data.hello;
  // @ts-expect-error: custom_data can be null
  product.data[0]?.custom_data.world;
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
  price.data[0]?.custom_data.hello;
  // @ts-expect-error: custom_data can be null
  price.data[0]?.custom_data.world;
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
  product.data[0]?.custom_data.hello;
  // @ts-expect-error: custom_data can be null
  product.data[0]?.custom_data.world;
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
