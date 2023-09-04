import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  client,
  createProduct,
  getProduct,
  listProducts,
  paddleFetch,
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
