import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
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
  paddleFetch,
  previewTransaction,
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

  it("includes query", async () => {
    await paddleFetch(
      { key: "test" },
      {
        method: "GET",
        path: "products",
        query: {
          hello: "world",
          ids: [1, 2, 3],
          nope: undefined,
        },
      }
    );

    expect(global.fetch).toHaveBeenCalledWith(
      "https://api.paddle.com/products?hello=world&ids=1%2C2%2C3",
      {
        method: "GET",
        headers: { Authorization: "Bearer test" },
        body: null,
      }
    );
  });

  it("transforms query operators", async () => {
    await paddleFetch(
      { key: "test" },
      {
        method: "GET",
        path: "products",
        query: {
          a: "[GT]ok",
          b: "[GTE]ok",
          c: "[LT]ok",
          d: "[LTE]ok",
          e: "ok",
        },
      }
    );

    expect(global.fetch).toHaveBeenCalledWith(
      "https://api.paddle.com/products?a%5BGT%5D=ok&b%5BGTE%5D=ok&c%5BLT%5D=ok&d%5BLTE%5D=ok&e=ok",
      {
        method: "GET",
        headers: { Authorization: "Bearer test" },
        body: null,
      }
    );
  });

  it("transforms include query parameter", async () => {
    await paddleFetch(
      { key: "test" },
      {
        method: "GET",
        path: "products",
        query: {
          include: {
            prices: true,
            something: false,
            else: true,
          },
        },
      }
    );

    expect(global.fetch).toHaveBeenCalledWith(
      "https://api.paddle.com/products?include=prices%2Celse",
      {
        method: "GET",
        headers: { Authorization: "Bearer test" },
        body: null,
      }
    );
  });
});

describe("products", () => {
  describe("listProducts", () => {
    mockFetch();

    it("sends a GET request", async () => {
      await listProducts(testClient, {
        after: "qwe",
        id: ["pro_123", "pro_456"],
        include: { prices: true },
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
  });

  describe("createProduct", () => {
    mockFetch();

    it("sends a POST request", async () => {
      const body = {
        name: "Product Name",
        tax_category: "digital-goods" as const,
        description: "Product Description",
        image_url: "https://example.com/image.jpg",
        custom_data: { key1: "value1", key2: "value2" },
      };

      const result = await createProduct(testClient, body);

      expect(global.fetch).toHaveBeenCalledWith(
        "https://api.paddle.com/products",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer test",
          },
          body: JSON.stringify(body),
        }
      );

      expect(result.error).toBeUndefined();
      expect(!result.error && result.data).toBeInstanceOf(Object);
    });
  });

  describe("getProduct", () => {
    mockFetch();

    it("sends a GET request", async () => {
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

    it("sends a PUT request", async () => {
      const body = {
        name: "Updated Product Name",
        custom_data: { key1: "value1", key2: "value2" },
        status: "active" as const,
      };

      const result = await updateProduct(testClient, "pro_123", body);

      expect(global.fetch).toHaveBeenCalledWith(
        "https://api.paddle.com/products/pro_123",
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer test",
          },
          body: JSON.stringify(body),
        }
      );

      expect(result.error).toBeUndefined();
      expect(!result.error && result.data).toBeInstanceOf(Object);
    });
  });
});

describe("prices", () => {
  describe("listPrices", () => {
    mockFetch();

    it("sends a GET request", async () => {
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
  });

  describe("createPrice", () => {
    mockFetch();

    it("sends a POST request", async () => {
      const body = {
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

      const result = await createPrice(testClient, body);

      expect(global.fetch).toHaveBeenCalledWith(
        "https://api.paddle.com/prices",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer test",
          },
          body: JSON.stringify(body),
        }
      );

      expect(result.error).toBeUndefined();
      expect(!result.error && result.data).toBeInstanceOf(Object);
    });
  });

  describe("getPrice", () => {
    mockFetch();

    it("sends a GET request", async () => {
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
    it("sends a PATCH request", async () => {
      const body = {
        description: "New Subscription Price",
        billing_cycle: { interval: "month" as const, frequency: 1 },
        unit_price: { currency_code: "USD" as const, amount: "10.00" },
      };

      const result = await updatePrice(testClient, "pri_123", body);

      expect(global.fetch).toHaveBeenCalledWith(
        "https://api.paddle.com/prices/pri_123",
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer test",
          },
          body: JSON.stringify(body),
        }
      );

      expect(result.error).toBeUndefined();
    });
  });
});

describe("discounts", () => {
  describe("listDiscounts", () => {
    mockFetch();

    it("sends a GET request", async () => {
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
  });

  describe("createDiscount", () => {
    mockFetch();

    it("sends a POST request", async () => {
      const body = {
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

      const result = await createDiscount(testClient, body);

      expect(global.fetch).toHaveBeenCalledWith(
        "https://api.paddle.com/discounts",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer test",
          },
          body: JSON.stringify(body),
        }
      );

      expect(result.error).toBeUndefined();
      expect(!result.error && result.data).toBeInstanceOf(Object);
    });
  });

  describe("getDiscount", () => {
    mockFetch();

    it("sends a GET request", async () => {
      const result = await getDiscount(testClient, "dsc_123");

      expect(global.fetch).toHaveBeenCalledWith(
        "https://api.paddle.com/discounts/dsc_123",
        {
          method: "GET",
          headers: { Authorization: "Bearer test" },
          body: null,
        }
      );

      expect(result.error).toBeUndefined();
      expect(!result.error && result.data).toBeInstanceOf(Object);
    });
  });

  describe("updateDiscount", () => {
    mockFetch();

    it("sends a PATCH request", async () => {
      const body = {
        status: "active" as const,
        description: "New Year Sale",
        enabled_for_checkout: true,
        code: "NY2022",
        type: "flat" as const,
        amount: "50",
        currency_code: "USD" as const,
        recur: true,
        maximum_recurring_intervals: 12,
        usage_limit: 100,
        restrict_to: ["prod_123"],
        expires_at: "2023-01-01T00:00:00Z",
      };

      const result = await updateDiscount(testClient, "dsc_123", body);

      expect(global.fetch).toHaveBeenCalledWith(
        "https://api.paddle.com/discounts/dsc_123",
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer test",
          },
          body: JSON.stringify(body),
        }
      );

      expect(result.error).toBeUndefined();
      expect(!result.error && result.data).toBeInstanceOf(Object);
    });
  });
});

describe("customers", () => {
  describe("listCustomers", () => {
    mockFetch();

    it("sends a GET request", async () => {
      await listCustomers(testClient, {
        after: "qwe",
        id: "ctm_123",
        order_by: "created_at[ASC]",
        per_page: 10,
        search: "john",
        status: "active",
      });

      expect(global.fetch).toHaveBeenCalledWith(
        "https://api.paddle.com/customers?after=qwe&id=ctm_123&order_by=created_at%5BASC%5D&per_page=10&search=john&status=active",
        {
          method: "GET",
          headers: { Authorization: "Bearer test" },
          body: null,
        }
      );
    });
  });

  describe("createCustomer", () => {
    mockFetch();

    it("sends a POST request", async () => {
      const body = {
        email: "test@test.com",
        name: "Test Customer",
        locale: "en",
      };

      const result = await createCustomer(testClient, body);

      expect(global.fetch).toHaveBeenCalledWith(
        "https://api.paddle.com/customers",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer test",
          },
          body: JSON.stringify(body),
        }
      );

      expect(result.error).toBeUndefined();
      expect(!result.error && result.data).toBeInstanceOf(Object);
    });
  });

  describe("getCustomer", () => {
    mockFetch();

    it("sends a GET request", async () => {
      const result = await getCustomer(testClient, "ctm_123");

      expect(global.fetch).toHaveBeenCalledWith(
        "https://api.paddle.com/customers/ctm_123",
        {
          method: "GET",
          headers: { Authorization: "Bearer test" },
          body: null,
        }
      );

      expect(result.error).toBeUndefined();
      expect(!result.error && result.data).toBeInstanceOf(Object);
    });
  });

  describe("updateCustomer", () => {
    mockFetch();

    it("sends a PATCH request", async () => {
      const body = {
        name: "Updated Customer Name",
        email: "updatedcustomer@example.com",
        status: "active" as const,
        locale: "en",
      };

      const result = await updateCustomer(testClient, "ctm_123", body);

      expect(global.fetch).toHaveBeenCalledWith(
        "https://api.paddle.com/customers/ctm_123",
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer test",
          },
          body: JSON.stringify(body),
        }
      );

      expect(result.error).toBeUndefined();
      expect(!result.error && result.data).toBeInstanceOf(Object);
    });
  });
});

describe("addresses", () => {
  describe("listAddresses", () => {
    mockFetch();

    it("sends a GET request", async () => {
      await listAddresses(testClient, "ctm_123", {
        after: "add_456",
        id: ["add_789", "add_012"],
        order_by: ["city[ASC]", "country_code[DESC]"],
        per_page: 10,
        search: "New York",
        status: "active",
      });

      expect(global.fetch).toHaveBeenCalledWith(
        "https://api.paddle.com/customers/ctm_123/addresses?after=add_456&id=add_789%2Cadd_012&order_by=city%5BASC%5D%2Ccountry_code%5BDESC%5D&per_page=10&search=New+York&status=active",
        {
          method: "GET",
          headers: { Authorization: "Bearer test" },
          body: null,
        }
      );
    });
  });

  describe("createAddress", () => {
    mockFetch();

    it("sends a POST request", async () => {
      const body = {
        country_code: "US" as const,
        description: "Main Address",
        first_line: "123 Main St",
        second_line: null,
        city: "San Francisco",
        postal_code: "94102",
        region: "California",
      };

      const result = await createAddress(testClient, "ctm_123", body);

      expect(global.fetch).toHaveBeenCalledWith(
        `https://api.paddle.com/customers/ctm_123/addresses`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer test",
          },
          body: JSON.stringify(body),
        }
      );

      expect(result.error).toBeUndefined();
      expect(!result.error && result.data).toBeInstanceOf(Object);
    });
  });

  describe("getAddress", () => {
    mockFetch();

    it("sends a GET request", async () => {
      const result = await getAddress(testClient, "ctm_123", "add_456");

      expect(global.fetch).toHaveBeenCalledWith(
        "https://api.paddle.com/customers/ctm_123/addresses/add_456",
        {
          method: "GET",
          headers: { Authorization: "Bearer test" },
          body: null,
        }
      );

      expect(result.error).toBeUndefined();
      expect(!result.error && result.data).toBeInstanceOf(Object);
    });
  });

  describe("updateAddress", () => {
    mockFetch();

    it("sends a PATCH request", async () => {
      const body = {
        description: "Work Address",
        first_line: "123 Elm Street",
        second_line: null,
        city: "New York",
        postal_code: "10001",
        region: "NY",
        country_code: "US" as const,
        status: "active" as const,
      };

      const result = await updateAddress(
        testClient,
        "ctm_123",
        "add_456",
        body
      );

      expect(global.fetch).toHaveBeenCalledWith(
        "https://api.paddle.com/customers/ctm_123/addresses/add_456",
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer test",
          },
          body: JSON.stringify(body),
        }
      );

      expect(result.error).toBeUndefined();
      expect(!result.error && result.data).toBeInstanceOf(Object);
    });
  });
});

describe("businesses", () => {
  describe("listBusinesses", () => {
    mockFetch();

    it("sends a GET request", async () => {
      await listBusinesses(testClient, "ctm_123", {
        after: "qwe",
        id: ["biz_123", "biz_456"],
        order_by: ["created_at[ASC]", "name[DESC]"],
        per_page: 10,
        search: "business_name",
        status: "active",
      });

      expect(global.fetch).toHaveBeenCalledWith(
        "https://api.paddle.com/customers/ctm_123/businesses?after=qwe&id=biz_123%2Cbiz_456&order_by=created_at%5BASC%5D%2Cname%5BDESC%5D&per_page=10&search=business_name&status=active",
        {
          method: "GET",
          headers: { Authorization: "Bearer test" },
          body: null,
        }
      );
    });
  });

  describe("createBusiness", () => {
    mockFetch();

    it("sends a POST request", async () => {
      const body = {
        name: "Business Name",
        company_number: "1234567890",
        tax_identifier: "GB1234567890",
        contacts: [
          {
            name: "John Doe",
            email: "johndoe@example.com",
          },
        ],
      };

      const result = await createBusiness(testClient, "ctm_123", body);

      expect(global.fetch).toHaveBeenCalledWith(
        "https://api.paddle.com/customers/ctm_123/businesses",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer test",
          },
          body: JSON.stringify(body),
        }
      );

      expect(result.error).toBeUndefined();
      expect(!result.error && result.data).toBeInstanceOf(Object);
    });
  });

  describe("getBusiness", () => {
    mockFetch();

    it("sends a GET request", async () => {
      await getBusiness(testClient, "ctm_123", "biz_456");

      expect(global.fetch).toHaveBeenCalledWith(
        "https://api.paddle.com/customers/ctm_123/businesses/biz_456",
        {
          method: "GET",
          headers: { Authorization: "Bearer test" },
          body: null,
        }
      );
    });
  });

  describe("updateBusiness", () => {
    mockFetch();

    it("sends a PATCH request", async () => {
      const body = {
        name: "Business Name",
        company_number: "12345678",
        tax_identifier: "AB123",
        status: "active" as const,
        contacts: [{ name: "John Doe", email: "johndoe@example.com" }],
      };

      const result = await updateBusiness(
        testClient,
        "ctm_123",
        "bus_456",
        body
      );

      expect(global.fetch).toHaveBeenCalledWith(
        "https://api.paddle.com/customers/ctm_123/businesses/bus_456",
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer test",
          },
          body: JSON.stringify(body),
        }
      );

      expect(result.error).toBeUndefined();
      expect(!result.error && result.data).toBeInstanceOf(Object);
    });
  });
});

describe("transactions", () => {
  describe("listTransactions", () => {
    mockFetch();

    it("sends a GET request", async () => {
      await listTransactions(testClient, {
        created_at: "2023-04-18T17:03:26",
        customer_id: ["ctm_123", "ctm_456"],
        id: ["txn_123", "txn_456"],
        include: { customer: true, address: true },
        order_by: ["created_at[ASC]", "id[DESC]"],
        per_page: 10,
        subscription_id: "sub_123",
      });

      expect(global.fetch).toHaveBeenCalledWith(
        "https://api.paddle.com/transactions?created_at=2023-04-18T17%3A03%3A26&customer_id=ctm_123%2Cctm_456&id=txn_123%2Ctxn_456&include=customer%2Caddress&order_by=created_at%5BASC%5D%2Cid%5BDESC%5D&per_page=10&subscription_id=sub_123",
        {
          method: "GET",
          headers: { Authorization: "Bearer test" },
          body: null,
        }
      );
    });
  });

  describe("createTransaction", () => {
    mockFetch();

    it("sends a POST request", async () => {
      const body = {
        items: [],
        customer_id: "ctm_789" as const,
        address_id: "add_101" as const,
        status: "billed" as const,
        currency_code: "USD" as const,
        collection_mode: "manual" as const,
        custom_data: { key1: "value1", key2: "value2" },
      };

      const result = await createTransaction(testClient, body);

      expect(global.fetch).toHaveBeenCalledWith(
        "https://api.paddle.com/transactions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer test",
          },
          body: JSON.stringify(body),
        }
      );

      expect(result.error).toBeUndefined();
      expect(!result.error && result.data).toBeInstanceOf(Object);
    });
  });

  describe("getTransaction", () => {
    mockFetch();

    it("sends a GET request", async () => {
      await getTransaction(testClient, "txn_123", {
        include: { address: true, customer: true },
      });

      expect(global.fetch).toHaveBeenCalledWith(
        "https://api.paddle.com/transactions/txn_123?include=address%2Ccustomer",
        {
          method: "GET",
          headers: { Authorization: "Bearer test" },
          body: null,
        }
      );
    });
  });

  describe("updateTransaction", () => {
    mockFetch();

    it("sends a PATCH request", async () => {
      const body = {
        status: "billed" as const,
        customer_id: "ctm_123" as const,
        address_id: "add_123" as const,
        business_id: "biz_123" as const,
        currency_code: "USD" as const,
        collection_mode: "manual" as const,
      };

      const result = await updateTransaction(testClient, "txn_123", body);

      expect(global.fetch).toHaveBeenCalledWith(
        "https://api.paddle.com/transactions/txn_123",
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer test",
          },
          body: JSON.stringify(body),
        }
      );

      expect(result.error).toBeUndefined();
      expect(!result.error && result.data).toBeInstanceOf(Object);
    });
  });

  describe("previewTransaction", () => {
    it("sends a POST request", async () => {
      const body = {
        items: [],
        customer_id: "ctm_321" as const,
        currency_code: "USD" as const,
        discount_id: "dsc_456" as const,
        customer_ip_address: "192.0.2.0",
        address: { country: "US", postcode: "90210" },
        ignore_trials: true,
      };

      const result = await previewTransaction(testClient, body);

      expect(global.fetch).toHaveBeenCalledWith(
        "https://api.paddle.com/transactions/preview",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer test",
          },
          body: JSON.stringify(body),
        }
      );

      expect(result.error).toBeUndefined();
      expect(!result.error && result.data).toBeInstanceOf(Object);
    });
  });
});

describe("invoices", () => {
  describe("getInvoice", () => {
    mockFetch();

    it("sends a GET request", async () => {
      await getInvoice(testClient, "txn_123");

      expect(global.fetch).toHaveBeenCalledWith(
        `https://api.paddle.com/transactions/txn_123/invoice`,
        {
          method: "GET",
          headers: { Authorization: "Bearer test" },
          body: null,
        }
      );
    });
  });
});

describe("subscriptions", () => {
  describe("listSubscriptions", () => {
    mockFetch();

    it("sends a GET request", async () => {
      await listSubscriptions(testClient, {
        after: "abc",
        customer_id: ["ctm_123", "ctm_456"],
        order_by: ["created_at[ASC]", "status[DESC]"],
        per_page: 10,
        status: "active",
        price_id: ["pri_123", "pri_456"],
      });

      expect(global.fetch).toHaveBeenCalledWith(
        "https://api.paddle.com/subscriptions?after=abc&customer_id=ctm_123%2Cctm_456&order_by=created_at%5BASC%5D%2Cstatus%5BDESC%5D&per_page=10&status=active&price_id=pri_123%2Cpri_456",
        {
          method: "GET",
          headers: { Authorization: "Bearer test" },
          body: null,
        }
      );
    });
  });

  describe("getSubscription", () => {
    mockFetch();

    it("sends a GET request", async () => {
      const subscriptionId = "sub_123";
      await getSubscription(testClient, subscriptionId, {
        include: { next_transaction: true },
      });

      expect(global.fetch).toHaveBeenCalledWith(
        `https://api.paddle.com/subscriptions/${subscriptionId}?include=next_transaction`,
        {
          method: "GET",
          headers: { Authorization: "Bearer test" },
          body: null,
        }
      );
    });
  });

  describe("updateSubscription", () => {
    mockFetch();

    it("sends a PATCH request", async () => {
      const body = {
        customer_id: "ctm_123" as const,
        address_id: "add_123" as const,
        business_id: "biz_123" as const,
        currency_code: "USD" as const,
        next_billed_at: "2022-12-31T23:59:59Z",
        collection_mode: "automatic" as const,
        scheduled_change: null,
        items: [],
        custom_data: { key1: "value1", key2: "value2" },
        proration_billing_mode: "prorate",
      };

      const result = await updateSubscription(testClient, "sub_123", body);

      expect(global.fetch).toHaveBeenCalledWith(
        "https://api.paddle.com/subscriptions/sub_123",
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer test",
          },
          body: JSON.stringify(body),
        }
      );

      expect(result.error).toBeUndefined();
      expect(!result.error && result.data).toBeInstanceOf(Object);
    });
  });

  describe("previewUpdateSubscription", () => {
    mockFetch();

    it("sends a PATCH request", async () => {
      const body = {
        customer_id: "ctm_123" as const,
        address_id: "add_123" as const,
        business_id: "biz_123" as const,
        currency_code: "USD" as const,
        next_billed_at: "2022-12-31T23:59:59Z",
        collection_mode: "automatic" as const,
        scheduled_change: null,
        items: [],
        custom_data: { key1: "value1", key2: "value2" },
        proration_billing_mode: "prorate",
      };

      const result = await previewUpdateSubscription(
        testClient,
        "sub_123",
        body
      );

      expect(global.fetch).toHaveBeenCalledWith(
        "https://api.paddle.com/subscriptions/sub_123/preview",
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer test",
          },
          body: JSON.stringify(body),
        }
      );

      expect(result.error).toBeUndefined();
      expect(!result.error && result.data).toBeInstanceOf(Object);
    });
  });

  describe("updatePaymentMethodTransaction", () => {
    mockFetch();

    it("sends a GET request", async () => {
      const subscriptionId = "sub_123";

      const result = await updatePaymentMethodTransaction(
        testClient,
        subscriptionId
      );

      expect(global.fetch).toHaveBeenCalledWith(
        `https://api.paddle.com/subscriptions/${subscriptionId}/update-payment-method-transaction`,
        {
          method: "GET",
          headers: { Authorization: "Bearer test" },
          body: null,
        }
      );

      expect(result.error).toBeUndefined();
      expect(!result.error && result.data).toBeInstanceOf(Object);
    });
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
