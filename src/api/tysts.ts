import { listProducts } from ".";

listProducts("test", {
  include: "prices",
}).then((products) => {
  if (products.error) return;
  products.data[0]?.prices[0]?.id;
});

listProducts("test").then((products) => {
  if (products.error) return;
  // @ts-expect-error: prices must be undefined unless include is set to "prices"
  products.data[0]?.prices[0]?.id;
});
