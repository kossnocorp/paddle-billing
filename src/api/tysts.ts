import { client, listProducts } from ".";

const api = client("test");

const apiCustomData = client<{
  Product: CustomDataProduct;
}>("test");

interface CustomDataProduct {
  hello: string;
}

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

listProducts(api).then((products) => {
  if (products.error) return;
  // @ts-expect-error: prices must be undefined unless include is set to "prices"
  products.data[0]?.prices[0]?.id;
});

listProducts(api, {
  order_by: `created_at[ASC]`,
});
