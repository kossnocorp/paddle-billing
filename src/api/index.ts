import { Paddle } from "../types";
import type { PaddleAPI } from "./types";

/**
 * Creates a Paddle API client.
 *
 * @param key - the Paddle key
 * @param sandbox - if to use the sandbox API
 *
 * @returns the Paddle API client
 */
export function client<DataDef extends PaddleAPI.CustomDataDef>(
  key: string,
  sandbox?: boolean
): PaddleAPI.Client<DataDef> {
  return { key, sandbox };
}

/**
 * The Paddle API request props.
 */
export interface PaddleFetchProps {
  /** The request method */
  method: "GET" | "POST" | "PATCH" | "DELETE";
  /** The API path */
  path: string;
  /** The request body */
  body?: Object;
}

/**
 * Sends a request to the Paddle API.
 *
 * @param client - the Paddle API client
 * @param props - the fetch props
 *
 * @returns promise to the response
 */
export async function paddleFetch(
  client: PaddleAPI.Client<PaddleAPI.CustomDataDef>,
  props: PaddleFetchProps
) {
  const headers: Record<string, string> = {
    Authorization: `Bearer ${client.key}`,
  };

  if (props.body) headers["Content-Type"] = "application/json";

  const response = await fetch(
    (client.sandbox ? sandboxAPIURL : apiURL) + props.path,
    {
      method: props.method,
      headers,
      body: props.body ? JSON.stringify(props.body) : null,
    }
  );
  return response.json();
}

/// Products

/**
 * Returns a paginated list of products. Use the query parameters to page
 * through results.
 *
 * By default, Paddle returns products that are active. Use the status query
 * parameter to return products that are archived.
 *
 * Use the include parameter to include related price entities in the response.
 *
 * @param client - the Paddle API client
 * @param query - the query parameters to filter the list of products
 *
 * @returns list of products
 */
export function listProducts<
  DataDef extends PaddleAPI.CustomDataDef,
  Include extends PaddleAPI.ProductInclude | undefined
>(
  client: PaddleAPI.Client<DataDef>,
  query?: PaddleAPI.ProductsListQuery<Include>
): Promise<PaddleAPI.ProductsListResponse<DataDef, Include>> {
  return paddleFetch(client, {
    method: "GET",
    path: "products" + prepareQuery(query),
  });
}

/**
 * Creates a new product with the specified details.
 *
 * @param client - the Paddle API client
 * @param body - the request body containing the product details
 *
 * @returns the created product
 */
export function createProduct<DataDef extends PaddleAPI.CustomDataDef>(
  client: PaddleAPI.Client<DataDef>,
  body: PaddleAPI.ProductCreateBody<DataDef>
): Promise<PaddleAPI.ProductCreateResponse<DataDef>> {
  return paddleFetch(client, {
    method: "POST",
    path: "products",
    body,
  });
}

/**
 * Returns a product using its ID.
 *
 * Use the include parameter to include related price entities in the response.
 *
 * @param client - the Paddle API client
 * @param productId - Paddle ID of the product entity to work with
 * @param query - the query
 *
 * @returns the product
 */
export function getProduct<
  DataDef extends PaddleAPI.CustomDataDef,
  Include extends PaddleAPI.ProductInclude | undefined
>(
  client: PaddleAPI.Client<DataDef>,
  productId: Paddle.ProductId,
  query?: PaddleAPI.ProductGetQuery<Include>
): Promise<PaddleAPI.ProductGetResponse<DataDef, Include>> {
  return paddleFetch(client, {
    method: "GET",
    path: "products/" + productId + prepareQuery(query),
  });
}

/**
 * Update a product with the specified details.
 *
 * @param client - the Paddle API client
 * @param productId - Paddle ID of the product entity to work with
 * @param body - the request body containing the product update details
 *
 * @returns the updated product
 */
export function updateProduct<DataDef extends PaddleAPI.CustomDataDef>(
  client: PaddleAPI.Client<DataDef>,
  productId: Paddle.ProductId,
  body: PaddleAPI.ProductUpdateBody<DataDef>
): Promise<PaddleAPI.ProductUpdateResponse<DataDef>> {
  return paddleFetch(client, {
    method: "PATCH",
    path: "products/" + productId,
    body,
  });
}

/// Prices

/**
 * Returns a paginated list of prices. Use the query parameters to page through
 * results.
 *
 * By default, Paddle returns prices that are active. Use the status query
 * parameter to return prices that are archived.
 *
 * Use the include parameter to include the related product entity in the response.
 *
 * @param client - the Paddle API client
 * @param query - the query parameters to filter the list of prices
 *
 * @returns list of prices
 */
export function listPrices<
  DataDef extends PaddleAPI.CustomDataDef,
  Include extends PaddleAPI.PriceInclude | undefined
>(
  client: PaddleAPI.Client<DataDef>,
  query?: PaddleAPI.PricesListQuery<Include>
): Promise<PaddleAPI.PricesListResponse<DataDef, Include>> {
  return paddleFetch(client, {
    method: "GET",
    path: "prices" + prepareQuery(query),
  });
}

/**
 * Creates a new price.
 *
 * Prices describe how you charge for products. You must include a product_id
 * in your request to relate this price to a product.
 *
 * If you omit the quantity object, Paddle automatically sets a minimum of 1
 * and a maximum of 100 for you. This means the most units that a customer can
 * buy is 100. Set a quantity if you'd like to offer a different amount.
 *
 * If successful, your response includes a copy of the new price entity.
 *
 * @param client - the Paddle API client
 * @param body - the request body detailing the price settings
 *
 * @returns the created price entity
 */
export function createPrice<DataDef extends PaddleAPI.CustomDataDef>(
  client: PaddleAPI.Client<DataDef>,
  body: PaddleAPI.PriceCreateBody<DataDef>
): Promise<PaddleAPI.PriceCreateResponse<DataDef>> {
  return paddleFetch(client, {
    method: "POST",
    path: "prices",
    body,
  });
}

/**
 * Returns a price using its ID.
 *
 * Use the include parameter to include the related product entity in
 * the response.
 *
 * @param client - The Paddle API client
 * @param priceId - Paddle ID of the price entity to work with
 * @param query - The query parameters used to filter the results
 *
 * @returns The price entity with included entities
 */
export function getPrice<
  DataDef extends PaddleAPI.CustomDataDef,
  Include extends PaddleAPI.PriceInclude | undefined
>(
  client: PaddleAPI.Client<DataDef>,
  priceId: Paddle.PriceId,
  query?: PaddleAPI.PriceGetQuery<Include>
): Promise<PaddleAPI.PriceGetResponse<DataDef, Include>> {
  return paddleFetch(client, {
    method: "GET",
    path: "prices/" + priceId + prepareQuery(query),
  });
}

/**
 * Update a price using its ID. If successful, your response includes a
 * copy of the updated price entity.
 *
 * @param client - the Paddle API client
 * @param priceId - Paddle ID of the price entity to work with
 * @param body - The request body containing the price update details
 *
 * @returns The updated price
 */
export function updatePrice<DataDef extends PaddleAPI.CustomDataDef>(
  client: PaddleAPI.Client<DataDef>,
  priceId: Paddle.PriceId,
  body: PaddleAPI.PriceUpdateBody<DataDef>
): Promise<PaddleAPI.PriceUpdateResponse<DataDef>> {
  return paddleFetch(client, {
    method: "PATCH",
    path: "prices/" + priceId,
    body,
  });
}

/// Discounts

/**
 * Returns a paginated list of discounts. Use the query parameters to page
 * through results.
 *
 * By default, Paddle returns discounts that are active. Use the status query
 * parameter to return discounts that are archived or expired.
 *
 * @param client - the Paddle API client
 * @param query - the query parameters to filter the list of discounts
 *
 * @returns list of discounts
 */
export function listDiscounts<DataDef extends PaddleAPI.CustomDataDef>(
  client: PaddleAPI.Client<DataDef>,
  query?: PaddleAPI.DiscountsListQuery
): Promise<PaddleAPI.DiscountsListResponse> {
  return paddleFetch(client, {
    method: "GET",
    path: "discounts" + prepareQuery(query),
  });
}

/**
 * Creates a new discount.
 *
 * If successful, your response includes a copy of the new discount entity.
 *
 * @param client - the Paddle API client
 * @param body - The request body for creating the discount
 *
 * @returns The created discount
 */
export function createDiscount<DataDef extends PaddleAPI.CustomDataDef>(
  client: PaddleAPI.Client<DataDef>,
  body: PaddleAPI.DiscountCreateBody
): Promise<PaddleAPI.DiscountCreateResponse> {
  return paddleFetch(client, {
    method: "POST",
    path: "discounts",
    body,
  });
}

/**
 * Returns a discount using its ID.
 *
 * @param client - the Paddle API client
 * @param discountId - Paddle ID of the discount entity to work with
 *
 * @returns the discount
 */
export function getDiscount<DataDef extends PaddleAPI.CustomDataDef>(
  client: PaddleAPI.Client<DataDef>,
  discountId: Paddle.DiscountId
): Promise<PaddleAPI.DiscountGetResponse> {
  return paddleFetch(client, {
    method: "GET",
    path: "discounts/" + discountId,
  });
}

/**
 * Updates a discount using its ID.
 *
 * If successful, your response includes a copy of the updated discount entity.
 *
 * @param client - the Paddle API client
 * @param discountId - Paddle ID of the discount entity to work with
 * @param paybodyoad - the request body containing the discount's new details
 *
 * @returns the updated discount
 */
export function updateDiscount<DataDef extends PaddleAPI.CustomDataDef>(
  client: PaddleAPI.Client<DataDef>,
  discountId: Paddle.DiscountId,
  paybodyoad: PaddleAPI.DiscountUpdateBody
): Promise<PaddleAPI.DiscountUpdateResponse> {
  return paddleFetch(client, {
    method: "PATCH",
    path: "discounts/" + discountId,
    body: paybodyoad,
  });
}

/**
 * Returns a paginated list of customers. Use the query parameters to page
 * through results.
 *
 * By default, Paddle returns customers that are active. Use the status query
 * parameter to return customers that are archived.
 *
 * Use the include parameter to include related price entities in the response.
 *
 * @param client - the Paddle API client
 * @param query - the query parameters to filter the list of customers
 *
 * @returns list of customers
 */
export function listCustomers<DataDef extends PaddleAPI.CustomDataDef>(
  client: PaddleAPI.Client<DataDef>,
  query?: PaddleAPI.CustomersListQuery
): Promise<PaddleAPI.CustomersListResponse> {
  return paddleFetch(client, {
    method: "GET",
    path: "customers" + prepareQuery(query),
  });
}

/**
 * Creates a new customer with the specified details.
 *
 * If successful, your response includes a copy of the new customer entity.
 *
 * @param client - the Paddle API client
 * @param body - The request body containing the customer details
 *
 * @returns The created customer
 */
export function createCustomer<DataDef extends PaddleAPI.CustomDataDef>(
  client: PaddleAPI.Client<DataDef>,
  body: PaddleAPI.CustomerCreateBody
): Promise<PaddleAPI.CustomerCreateResponse> {
  return paddleFetch(client, {
    method: "POST",
    path: "customers",
    body,
  });
}

/**
 * Returns a customer using its ID.
 *
 * @param client - the Paddle API client
 * @param customerId - Paddle ID of the customer entity to work with
 *
 * @returns the customer
 */
export function getCustomer<DataDef extends PaddleAPI.CustomDataDef>(
  client: PaddleAPI.Client<DataDef>,
  customerId: Paddle.CustomerId
): Promise<PaddleAPI.CustomerGetResponse> {
  return paddleFetch(client, {
    method: "GET",
    path: "customers/" + customerId,
  });
}

/**
 * Update a customer with the specified details.
 *
 * If successful, your response includes a copy of the updated customer entity.
 *
 * @param client - the Paddle API client
 * @param customerId - Paddle ID of the customer entity to work with
 * @param body - the request body containing the customer update details
 *
 * @returns the updated customer
 */
export function updateCustomer<DataDef extends PaddleAPI.CustomDataDef>(
  client: PaddleAPI.Client<DataDef>,
  customerId: Paddle.CustomerId,
  body: PaddleAPI.CustomerUpdateBody
): Promise<PaddleAPI.CustomerUpdateResponse> {
  return paddleFetch(client, {
    method: "PATCH",
    path: "customers/" + customerId,
    body,
  });
}

const apiURL = `https://api.paddle.com/`;

const sandboxAPIURL = `https://sandbox-api.paddle.com/`;

function prepareQuery(query: Object | undefined): string {
  const q = new URLSearchParams();

  query &&
    Object.entries(query).forEach(([key, value]) => {
      if (value === undefined) return;

      if (Array.isArray(value)) {
        const str = value.filter((item) => item !== undefined).join(",");
        q.append(key, str);
      } else {
        q.append(key, value.toString());
      }
    });

  const qStr = q.toString();
  return qStr ? `?${qStr}` : "";
}
