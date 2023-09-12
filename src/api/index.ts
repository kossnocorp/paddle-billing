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
  productId: string,
  body: PaddleAPI.ProductUpdateBody
): Promise<PaddleAPI.ProductUpdateResponse<DataDef>> {
  return paddleFetch(client, {
    method: "PATCH",
    path: "products/" + productId,
    body,
  });
}

/// Prices

/**
 * Returns a paginated list of prices. Use the query parameters to page through results.
 *
 * By default, Paddle returns prices that are active. Use the status query parameter
 * to return prices that are archived.
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

  return q.size === 0 ? "" : "?" + q.toString();
}
