const billing = require("../lib");

const paddle = billing.client(process.env.PADDLE_SECRET, true);

billing.listPrices(paddle).then((prices) => {
  console.log(prices);
});
