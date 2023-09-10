import { client, createProduct, getProduct, listPrices, listProducts } from ".";

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
  products.data[0]?.custom_data.nope;
  products.data[0]?.custom_data.hello;
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
  order_by: `created_at[ASC]`,
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
  product.data.custom_data.hello;
  product.data.custom_data.world;
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

getProduct(api, `pro_123`).then((product) => {
  if (product.error) return;
  // @ts-expect-error: prices must be undefined unless include is set to "prices"
  products.data.prices[0]?.id;
});

getProduct(api, `pro_123`, { include: "prices" }).then((product) => {
  if (product.error) return;
  product.data.prices[0]?.id;
});

//// Update product

createProduct(api, {
  name: "My Product",
  tax_category: "digital-goods",
  custom_data: {
    hello: "world",
    foo: "bar",
  },
}).then((product) => {
  if (product.error) return;
  product.data.custom_data.hello;
  product.data.custom_data.world;
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

/// Prices

listPrices(api, {
  include: "product",
}).then((prices) => {
  if (prices.error) return;
  prices.data[0]?.product?.id;
  prices.data[0]?.custom_data.nope;
  prices.data[0]?.custom_data.hello;
});

listPrices(apiCustomData, {}).then((prices) => {
  if (prices.error) return;
  // @ts-expect-error: product must be undefined unless include is set to "prices"
  prices.data[0]?.product?.id;
  // @ts-expect-error: custom_data is specified
  prices.data[0]?.custom_data.nope;
  prices.data[0]?.custom_data.foo;
});

listPrices(api);

listPrices(api, {
  order_by: `unit_price[ASC]`,
});
