import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  client,
  createDiscount,
  createPrice,
  createProduct,
  getPrice,
  getProduct,
  listDiscounts,
  listPrices,
  listProducts,
  paddleFetch,
  updatePrice,
  updateProduct,
} from ".";

global.fetch = vi.fn();

const testClient = { key: "test" };

describe("client", () => {
  it("creates client", () => {
    expect(client("secret")).toEqual({
      key: "secret",
      sandbox: undefined,
    });

    expect(client("secret", true)).toEqual({
      key: "secret",
      sandbox: true,
    });
  });
});

describe("paddleFetch", () => {
  mockFetch();

  it("sends request to the correct URL", async () => {
    await paddleFetch(
      { key: "test", sandbox: true },
      {
        method: "POST",
        path: "test",
        body: { hello: "world" },
      }
    );

    expect(global.fetch).toHaveBeenCalledWith(
      "https://sandbox-api.paddle.com/test",
      {
        method: "POST",
        headers: {
          Authorization: "Bearer test",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ hello: "world" }),
      }
    );
  });

  it('sends a request to the sandbox API if the "sandbox" option is set to true', async () => {
    await paddleFetch(
      { key: "test", sandbox: true },
      {
        method: "GET",
        path: "products",
      }
    );

    expect(global.fetch).toHaveBeenCalledWith(
      "https://sandbox-api.paddle.com/products",
      {
        method: "GET",
        headers: { Authorization: "Bearer test" },
        body: null,
      }
    );
  });
});

/// Products

describe("listProducts", () => {
  mockFetch();

  it("sends a GET request to the correct URL", async () => {
    const result = await listProducts(testClient);

    expect(global.fetch).toHaveBeenCalledWith(
      "https://api.paddle.com/products",
      {
        method: "GET",
        headers: { Authorization: "Bearer test" },
        body: null,
      }
    );

    expect(result.error).toBeUndefined();
    expect(!result.error && result.data).toBeInstanceOf(Array);
  });

  it("sends a GET request to the correct URL with query params", async () => {
    await listProducts(testClient, {
      after: "qwe",
      id: ["pro_123", "pro_456"],
      include: "prices",
      order_by: ["created_at[ASC]", "name[DESC]"],
      per_page: 10,
      status: "active",
      tax_category: "digital-goods",
    });

    expect(global.fetch).toHaveBeenCalledWith(
      "https://api.paddle.com/products?after=qwe&id=pro_123%2Cpro_456&include=prices&order_by=created_at%5BASC%5D%2Cname%5BDESC%5D&per_page=10&status=active&tax_category=digital-goods",
      {
        method: "GET",
        headers: { Authorization: "Bearer test" },
        body: null,
      }
    );
  });

  it("excludes undefined query params", async () => {
    await listProducts(testClient, {
      after: undefined,
      id: "pro_123",
      include: undefined,
      order_by: "created_at[ASC]",
      per_page: undefined,
      status: undefined,
      tax_category: undefined,
    });

    expect(global.fetch).toHaveBeenCalledWith(
      "https://api.paddle.com/products?id=pro_123&order_by=created_at%5BASC%5D",
      {
        method: "GET",
        headers: { Authorization: "Bearer test" },
        body: null,
      }
    );
  });
});

describe("createProduct", () => {
  mockFetch();

  it("sends a POST request to the correct URL", async () => {
    const productData = {
      name: "Product Name",
      tax_category: "digital-goods" as const,
      description: "Product Description",
      image_url: "https://example.com/image.jpg",
      custom_data: { key1: "value1", key2: "value2" },
    };

    const result = await createProduct(testClient, productData);

    expect(global.fetch).toHaveBeenCalledWith(
      "https://api.paddle.com/products",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer test",
        },
        body: JSON.stringify(productData),
      }
    );

    expect(result.error).toBeUndefined();
    expect(!result.error && result.data).toBeInstanceOf(Object);
  });
});

describe("getProduct", () => {
  mockFetch();

  it("sends a GET request to the correct URL with product_id as path param", async () => {
    const result = await getProduct(testClient, "pro_123");

    expect(global.fetch).toHaveBeenCalledWith(
      "https://api.paddle.com/products/pro_123",
      {
        method: "GET",
        headers: { Authorization: "Bearer test" },
        body: null,
      }
    );

    expect(result.error).toBeUndefined();
    expect(!result.error && result.data).toBeInstanceOf(Object);
  });

  it("sends a GET request to the correct URL with include query param", async () => {
    await getProduct(testClient, "pro_123", { include: "prices" });

    expect(global.fetch).toHaveBeenCalledWith(
      "https://api.paddle.com/products/pro_123?include=prices",
      {
        method: "GET",
        headers: { Authorization: "Bearer test" },
        body: null,
      }
    );
  });
});

describe("updateProduct", () => {
  mockFetch();

  it("sends a PUT request to the correct URL", async () => {
    const productData = {
      name: "Updated Product Name",
      custom_data: { key1: "value1", key2: "value2" },
      status: "active" as const,
    };

    const result = await updateProduct(testClient, "pro_123", productData);

    expect(global.fetch).toHaveBeenCalledWith(
      "https://api.paddle.com/products/pro_123",
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer test",
        },
        body: JSON.stringify(productData),
      }
    );

    expect(result.error).toBeUndefined();
    expect(!result.error && result.data).toBeInstanceOf(Object);
  });
});

/// Prices

describe("listPrices", () => {
  mockFetch();

  it("sends a GET request to the correct URL", async () => {
    const result = await listPrices(testClient);

    expect(global.fetch).toHaveBeenCalledWith("https://api.paddle.com/prices", {
      method: "GET",
      headers: { Authorization: "Bearer test" },
      body: null,
    });

    expect(result.error).toBeUndefined();
    expect(!result.error && result.data).toBeInstanceOf(Array);
  });

  it("sends a GET request to the correct URL with query params", async () => {
    await listPrices(testClient, {
      after: "qwe",
      id: "pri_123",
      include: "product",
      order_by: "unit_price[ASC]",
      per_page: 10,
      product_id: "pro_123",
      status: "active",
      recurring: true,
    });

    expect(global.fetch).toHaveBeenCalledWith(
      "https://api.paddle.com/prices?after=qwe&id=pri_123&include=product&order_by=unit_price%5BASC%5D&per_page=10&product_id=pro_123&status=active&recurring=true",
      {
        method: "GET",
        headers: { Authorization: "Bearer test" },
        body: null,
      }
    );
  });

  it("excludes undefined query params", async () => {
    await listPrices(testClient, {
      after: undefined,
      id: "pri_123",
      include: undefined,
      order_by: "unit_price[ASC]",
      per_page: undefined,
      product_id: undefined,
      status: undefined,
      recurring: undefined,
    });

    expect(global.fetch).toHaveBeenCalledWith(
      "https://api.paddle.com/prices?id=pri_123&order_by=unit_price%5BASC%5D",
      {
        method: "GET",
        headers: { Authorization: "Bearer test" },
        body: null,
      }
    );
  });
});

describe("createPrice", () => {
  mockFetch();

  it("sends a POST request to the correct URL", async () => {
    const priceData = {
      description: "Monthly Subscription",
      product_id: "pro_123" as const,
      unit_price: { currency_code: "USD" as const, amount: "10.00" },
      billing_cycle: { interval: "month" as const, frequency: 1 },
      trial_period: null,
      tax_mode: "internal" as const,
      unit_price_overrides: [],
      quantity: { minimum: 1, maximum: 100 },
      custom_data: { key1: "value1", key2: "value2" },
    };

    const result = await createPrice(testClient, priceData);

    expect(global.fetch).toHaveBeenCalledWith("https://api.paddle.com/prices", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer test",
      },
      body: JSON.stringify(priceData),
    });

    expect(result.error).toBeUndefined();
    expect(!result.error && result.data).toBeInstanceOf(Object);
  });
});

describe("getPrice", () => {
  mockFetch();

  it("sends a GET request to the correct URL with price_id as path param", async () => {
    const result = await getPrice(testClient, "pri_123");

    expect(global.fetch).toHaveBeenCalledWith(
      "https://api.paddle.com/prices/pri_123",
      {
        method: "GET",
        headers: { Authorization: "Bearer test" },
        body: null,
      }
    );

    expect(result.error).toBeUndefined();
    expect(!result.error && result.data).toBeInstanceOf(Object);
  });

  it("sends a GET request to the correct URL with include query param", async () => {
    await getPrice(testClient, "pri_123", { include: "product" });

    expect(global.fetch).toHaveBeenCalledWith(
      "https://api.paddle.com/prices/pri_123?include=product",
      {
        method: "GET",
        headers: { Authorization: "Bearer test" },
        body: null,
      }
    );
  });
});

describe("updatePrice", () => {
  it("sends a PATCH request to the correct URL with priceId as path param", async () => {
    const priceUpdateBody = {
      description: "New Subscription Price",
      billing_cycle: { interval: "month" as const, frequency: 1 },
      unit_price: { currency_code: "USD" as const, amount: "10.00" },
    };

    const result = await updatePrice(testClient, "pri_123", priceUpdateBody);

    expect(global.fetch).toHaveBeenCalledWith(
      "https://api.paddle.com/prices/pri_123",
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer test",
        },
        body: JSON.stringify(priceUpdateBody),
      }
    );

    expect(result.error).toBeUndefined();
  });
});

/// Discounts

describe("listDiscounts", () => {
  mockFetch();

  it("sends a GET request to the correct URL", async () => {
    const result = await listDiscounts(testClient);

    expect(global.fetch).toHaveBeenCalledWith(
      "https://api.paddle.com/discounts",
      {
        method: "GET",
        headers: { Authorization: "Bearer test" },
        body: null,
      }
    );

    expect(result.error).toBeUndefined();
    expect(!result.error && result.data).toBeInstanceOf(Array);
  });

  it("sends a GET request to the correct URL with query params", async () => {
    await listDiscounts(testClient, {
      after: "qwe",
      code: ["dis_123", "dis_456"],
      id: ["dsc_123", "dsc_456"],
      order_by: ["created_at[ASC]", "amount[DESC]"],
      per_page: 10,
      status: "active",
    });

    expect(global.fetch).toHaveBeenCalledWith(
      "https://api.paddle.com/discounts?after=qwe&code=dis_123%2Cdis_456&id=dsc_123%2Cdsc_456&order_by=created_at%5BASC%5D%2Camount%5BDESC%5D&per_page=10&status=active",
      {
        method: "GET",
        headers: { Authorization: "Bearer test" },
        body: null,
      }
    );
  });

  it("excludes undefined query params", async () => {
    await listDiscounts(testClient, {
      after: undefined,
      code: undefined,
      id: "dsc_123",
      order_by: "created_at[ASC]",
      per_page: undefined,
      status: undefined,
    });

    expect(global.fetch).toHaveBeenCalledWith(
      "https://api.paddle.com/discounts?id=dsc_123&order_by=created_at%5BASC%5D",
      {
        method: "GET",
        headers: { Authorization: "Bearer test" },
        body: null,
      }
    );
  });
});

describe("createDiscount", () => {
  mockFetch();

  it("sends a POST request to the correct URL", async () => {
    const discountData = {
      amount: "20",
      description: "20% off",
      type: "percentage" as const,
      enabled_for_checkout: true,
      code: "DISC20",
      currency_code: null,
      recur: true,
      maximum_recurring_intervals: null,
      usage_limit: 50,
      restrict_to: null,
      expires_at: null,
    };

    const result = await createDiscount(testClient, discountData);

    expect(global.fetch).toHaveBeenCalledWith(
      "https://api.paddle.com/discounts",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer test",
        },
        body: JSON.stringify(discountData),
      }
    );

    expect(result.error).toBeUndefined();
    expect(!result.error && result.data).toBeInstanceOf(Object);
  });
});

function mockFetch() {
  beforeEach(() => {
    vi.mocked(global.fetch as any).mockImplementation(async () => ({
      json: async () => ({
        data: [],
      }),
    }));
  });

  afterEach(() => {
    vi.clearAllMocks();
  });
}
