import { Paddle } from "../types";
import type { PaddleAPI } from "./types";

/// Generic

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
  /** The request query */
  query?: Object | undefined;
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

  const queryStr = props.query ? prepareQuery(props.query) : "";
  const url = (client.sandbox ? sandboxAPIURL : apiURL) + props.path + queryStr;

  const response = await fetch(url, {
    method: props.method,
    headers,
    body: props.body ? JSON.stringify(props.body) : null,
  });
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
  Include extends PaddleAPI.ProductResponseInclude | undefined
>(
  client: PaddleAPI.Client<DataDef>,
  query?: PaddleAPI.ProductsListQuery<Include>
): Promise<PaddleAPI.ProductsListResponse<DataDef, Include>> {
  return paddleFetch(client, {
    method: "GET",
    path: "products",
    query,
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
    path: "products/" + productId,
    query,
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
    path: "prices",
    query,
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
    path: "prices/" + priceId,
    query,
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
    path: "discounts",
    query,
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
 * @param body - the request body containing the discount's new details
 *
 * @returns the updated discount
 */
export function updateDiscount<DataDef extends PaddleAPI.CustomDataDef>(
  client: PaddleAPI.Client<DataDef>,
  discountId: Paddle.DiscountId,
  body: PaddleAPI.DiscountUpdateBody
): Promise<PaddleAPI.DiscountUpdateResponse> {
  return paddleFetch(client, {
    method: "PATCH",
    path: "discounts/" + discountId,
    body,
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
    path: "customers",
    query,
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

/// Addresses

/**
 * Returns a paginated list of addresses for a customer. Use the query parameters to page through results.
 *
 * By default, Paddle returns addresses that are active. Use the status query parameter to return addresses that are
 * archived.
 *
 * @param client - the Paddle API client
 * @param customerId - Paddle ID of the customer entity to work with
 * @param query - The customer's list addresses query
 *
 * @returns list of addresses for a customer
 */
export function listAddresses<DataDef extends PaddleAPI.CustomDataDef>(
  client: PaddleAPI.Client<DataDef>,
  customerId: Paddle.CustomerId,
  query?: PaddleAPI.AddressListQuery
): Promise<PaddleAPI.AddressListResponse> {
  return paddleFetch(client, {
    method: "GET",
    path: "customers/" + customerId + "/addresses",
    query,
  });
}

/**
 * Creates a new address for a customer.
 *
 * For tax calculation, fraud prevention, and compliance purposes,
 * you must include a postal_code when creating addresses for some countries.
 * For example, ZIP codes in the USA and postcodes in the UK.
 *
 * If successful, your response includes a copy of the new address entity.
 *
 * @param client - the Paddle API client
 * @param customerId - Paddle ID of the customer entity to work with
 * @param body - the request body containing the country code and other details
 *
 * @returns a copy of the new address entity if successful
 */
export function createAddress<DataDef extends PaddleAPI.CustomDataDef>(
  client: PaddleAPI.Client<DataDef>,
  customerId: Paddle.CustomerId,
  body: PaddleAPI.AddressCreateBody
): Promise<PaddleAPI.AddressCreateResponse> {
  return paddleFetch(client, {
    method: "POST",
    path: "customers/" + customerId + "/addresses",
    body,
  });
}

/**
 * Returns an address for a customer using its ID and related customer ID.
 *
 * @param client - the Paddle API client
 * @param customerId - Paddle ID of the customer entity to work with
 * @param addressId - Paddle ID of the address entity to work with
 *
 * @returns the requested address
 */
export function getAddress<DataDef extends PaddleAPI.CustomDataDef>(
  client: PaddleAPI.Client<DataDef>,
  customerId: Paddle.CustomerId,
  addressId: Paddle.AddressId
): Promise<PaddleAPI.AddressGetResponse> {
  return paddleFetch(client, {
    method: "GET",
    path: "customers/" + customerId + "/addresses/" + addressId,
  });
}

/**
 * Update an address for a customer using its ID and related customer ID.
 *
 * If successful, your response includes a copy of the updated address entity.
 *
 * @param client - the Paddle API client
 * @param customerId - Paddle ID of the customer entity to work with
 * @param addressId - Paddle ID of the address entity to work with
 * @param body - the request body containing the address update details
 *
 * @returns the updated address
 */
export function updateAddress<DataDef extends PaddleAPI.CustomDataDef>(
  client: PaddleAPI.Client<DataDef>,
  customerId: Paddle.CustomerId,
  addressId: Paddle.AddressId,
  body: PaddleAPI.AddressUpdateBody
): Promise<PaddleAPI.AddressUpdateResponse> {
  return paddleFetch(client, {
    method: "PATCH",
    path: "customers/" + customerId + "/addresses/" + addressId,
    body,
  });
}

/**
 * Returns a paginated list of businesses for a customer.
 * Use the query parameters to page through results.
 *
 * By default, Paddle returns businesses that are active.
 * Use the status query parameter to return businesses that are archived.
 *
 * @param client - the Paddle API client
 * @param path - the path parameters to filter the list of businesses
 * @param query - the query parameters to filter the list of businesses
 *
 * @returns list of businesses for a customer
 */
export function listBusinesses<DataDef extends PaddleAPI.CustomDataDef>(
  client: PaddleAPI.Client<DataDef>,
  customerId: Paddle.CustomerId,
  query?: PaddleAPI.BusinessesListQuery
): Promise<PaddleAPI.BusinessesListResponse> {
  return paddleFetch(client, {
    method: "GET",
    path: "customers/" + customerId + "/businesses",
    query,
  });
}

/**
 * Creates a new business for a customer.
 *
 * If successful, your response includes a copy of the new business entity.
 *
 * @param client - the Paddle API client
 * @param customerId - Paddle ID of the customer entity to work with
 * @param body - The details of the business to be created
 *
 * @returns the created business
 */
export function createBusiness<DataDef extends PaddleAPI.CustomDataDef>(
  client: PaddleAPI.Client<DataDef>,
  customerId: Paddle.CustomerId,
  body: PaddleAPI.BusinessCreateBody
): Promise<PaddleAPI.BusinessCreateResponse> {
  return paddleFetch(client, {
    method: "POST",
    path: "customers/" + customerId + "/businesses",
    body,
  });
}

/**
 * Returns a business for a customer using its ID and related customer ID.
 *
 * @param client - the Paddle API client
 * @param customerId - Paddle ID of the customer entity to work with
 * @param businessId - Paddle ID of the business entity to work with
 *
 * @returns the business entity
 */
export function getBusiness<DataDef extends PaddleAPI.CustomDataDef>(
  client: PaddleAPI.Client<DataDef>,
  customerId: Paddle.CustomerId,
  businessId: Paddle.BusinessId
): Promise<PaddleAPI.BusinessGetResponse> {
  return paddleFetch(client, {
    method: "GET",
    path: "customers/" + customerId + "/businesses/" + businessId,
  });
}

/**
 * Update a business for a customer using its ID and related customer ID.
 *
 * If successful, your response includes a copy of the updated business entity.
 *
 * @param client - the Paddle API client
 * @param customerId - Paddle ID of the customer entity to work with
 * @param businessId - Paddle ID of the business entity to work with
 * @param body - the request body containing the business update details
 *
 * @returns The updated business entity or an error response
 */
export function updateBusiness<DataDef extends PaddleAPI.CustomDataDef>(
  client: PaddleAPI.Client<DataDef>,
  customerId: Paddle.CustomerId,
  businessId: string,
  body: PaddleAPI.BusinessUpdateBody
): Promise<PaddleAPI.BusinessUpdateResponse> {
  return paddleFetch(client, {
    method: "PATCH",
    path: `customers/${customerId}/businesses/${businessId}`,
    body,
  });
}

/// Transactions

/**
 * Returns a paginated list of transactions. Uses the query parameters to
 * filter the results.
 *
 * Each transaction includes certain properties by default. Utilize
 * the `include` parameter to include related entities in the response.
 *
 * @param client - the Paddle API client
 * @param query - the query parameters to filter the list of transactions
 *
 * @returns list of transactions
 */
export function listTransactions<
  DataDef extends PaddleAPI.CustomDataDef,
  Include extends PaddleAPI.TransactionResponseInclude | undefined
>(
  client: PaddleAPI.Client<DataDef>,
  query?: PaddleAPI.TransactionsListQuery<Include>
): Promise<PaddleAPI.TransactionsListResponse<DataDef, Include>> {
  return paddleFetch(client, {
    method: "GET",
    path: "transactions",
    query,
  });
}

/**
 * Creates a new transaction.
 *
 * Transactions are typically created with the status of draft or
 * ready initially:
 *
 * Draft transactions have items against them, but don't have all of
 * the required fields for billing.
 *
 * Paddle creates draft transactions automatically when a checkout is opened.
 *
 * Paddle automatically marks transactions as ready when all of the required
 * fields are present for billing. This includes customer_id and address_id
 * for automatically-collected transactions, and billing_details
 * for manually-collected transactions.
 *
 * The collection_mode against a transaction determines how Paddle tries
 * to collect for payment.
 *
 * @param client - the Paddle API client
 * @param body - the request body containing the transaction details
 * @param query - the query parameters
 *
 * @returns the created transaction
 */
export function createTransaction<
  DataDef extends PaddleAPI.CustomDataDef,
  Include extends PaddleAPI.TransactionResponseInclude | undefined
>(
  client: PaddleAPI.Client<DataDef>,
  body: PaddleAPI.TransactionCreateBody<DataDef>,
  query?: PaddleAPI.TransactionCreateQuery<Include>
): Promise<PaddleAPI.TransactionCreateResponse<DataDef, Include>> {
  return paddleFetch(client, {
    method: "POST",
    path: "transactions",
    body,
    query,
  });
}

/**
 * Returns a transaction using its ID.
 *
 * Use the include parameter to include related entities in the response.
 *
 * @param client - the Paddle API client
 * @param transactionId - Paddle ID of the transaction entity to work with
 * @param query - The query parameters to include related entities in the response
 *
 * @returns the transaction
 */
export function getTransaction<
  DataDef extends PaddleAPI.CustomDataDef,
  Include extends PaddleAPI.TransactionResponseInclude | undefined
>(
  client: PaddleAPI.Client<DataDef>,
  transactionId: Paddle.TransactionId,
  query?: PaddleAPI.TransactionGetQuery<Include>
): Promise<PaddleAPI.TransactionGetResponse<DataDef, Include>> {
  return paddleFetch(client, {
    method: "GET",
    path: "transactions/" + transactionId,
    query,
  });
}

/**
 * Updates a transaction using its ID.
 *
 * You can update transactions that are draft or ready. billed and completed
 * transactions are considered records for tax and legal purposes, so they
 * can't be changed.
 *
 * @param client - the Paddle API client
 * @param transactionId - Paddle ID of the transaction
 * @param body - the request body containing the transaction update details
 *
 * @returns the updated transaction
 */
export function updateTransaction<DataDef extends PaddleAPI.CustomDataDef>(
  client: PaddleAPI.Client<DataDef>,
  transactionId: Paddle.TransactionId,
  body: PaddleAPI.TransactionUpdateBody<DataDef>
): Promise<PaddleAPI.TransactionUpdateResponse<DataDef>> {
  return paddleFetch(client, {
    method: "PATCH",
    path: "transactions/" + transactionId,
    body,
  });
}

/**
 * Previews a transaction without creating a transaction entity. Typically
 * used for creating more advanced, dynamic pricing pages where users can
 * build their own plans.
 *
 * You can provide location information to preview a transaction. Paddle
 * uses this to calculate tax. You can provide one of: customer_ip_address,
 * address, or customer_id, address_id, and business_id.
 *
 * When supplying items, you can exclude items from the total calculation
 * using the include_in_totals boolean.
 *
 * By default, recurring items with trials are considered to have a zero charge
 * when previewing. Set ignore_trials to true to ignore trial periods against
 * prices for transaction preview calculations.
 *
 * If successful, your response includes the data you sent with a details
 * object that includes totals for the supplied prices.
 *
 * Transaction previews do not create transactions, so no id is returned.
 *
 * @param client - the Paddle API client
 * @param body - the request body containing the preview transaction details
 *
 * @returns the previewed transaction
 */
export function previewTransaction<DataDef extends PaddleAPI.CustomDataDef>(
  client: PaddleAPI.Client<DataDef>,
  body: PaddleAPI.TransactionPreviewBody<DataDef>
): Promise<PaddleAPI.TransactionPreviewResponse<DataDef>> {
  return paddleFetch(client, {
    method: "POST",
    path: "transactions/preview",
    body,
  });
}

/// Invoices

/**
 * Returns a link to an invoice PDF for a transaction.
 *
 * Invoice PDFs are created for both automatically and manually-collected
 * transactions.
 *
 * The PDF for manually-collected transactions includes payment terms, purchase
 * order number, and notes for your customer. It's a demand for payment from
 * your customer.
 *
 * The PDF for automatically-collected transactions lets your customer know
 * that payment was taken successfully. Customers may require this for
 * tax-reporting purposes.
 *
 * The link returned is not a permanent link. It expires at the date and
 * time returned in the Expires header.
 *
 * @param client - the Paddle API client
 * @param transactionId - Paddle ID of the transaction entity to work with
 *
 * @returns a link to an invoice PDF for a transaction
 */
export function getInvoice<DataDef extends PaddleAPI.CustomDataDef>(
  client: PaddleAPI.Client<DataDef>,
  transactionId: Paddle.TransactionId
): Promise<PaddleAPI.InvoiceGetResponse> {
  return paddleFetch(client, {
    method: "GET",
    path: "transactions/" + transactionId + "/invoice",
  });
}

/**
 * Returns a paginated list of subscriptions. Use the query parameters to page
 * through results.
 *
 * @param client - the Paddle API client
 * @param query - the query parameters to filter the list of subscriptions
 *
 * @returns list of subscriptions
 */
export function listSubscriptions<DataDef extends PaddleAPI.CustomDataDef>(
  client: PaddleAPI.Client<DataDef>,
  query?: PaddleAPI.SubscriptionsListQuery
): Promise<PaddleAPI.SubscriptionsListResponse<DataDef>> {
  return paddleFetch(client, {
    method: "GET",
    path: "subscriptions",
    query,
  });
}

/**
 * Returns a subscription using its ID.
 *
 * Use the include parameter to include transaction information in the response.
 *
 * @param client - the Paddle API client
 * @param subscriptionId - Paddle ID of the subscription entity to work with
 * @param query - include related entities in the response
 *
 * @returns a subscription entity with included entities
 */
export function getSubscription<
  DataDef extends PaddleAPI.CustomDataDef,
  Include extends PaddleAPI.SubscriptionGetResponseInclude | undefined
>(
  client: PaddleAPI.Client<DataDef>,
  subscriptionId: Paddle.SubscriptionId,
  query?: PaddleAPI.SubscriptionGetQuery<Include>
): Promise<PaddleAPI.SubscriptionGetResponse<DataDef, Include>> {
  return paddleFetch(client, {
    method: "GET",
    path: "subscriptions/" + subscriptionId,
    query,
  });
}

/**
 * Previews an update for a subscription without applying those changes.
 * Typically used for previewing proration before making changes to
 * a subscription.
 *
 * If successful, your response includes immediate_transaction,
 * next_transaction, and recurring_transaction_details so you can see expected
 * transactions for the changes.
 *
 * The update_summary object contains details of prorated credits and charges
 * created, along with the overall result of the update.
 *
 * @param client - the Paddle API client
 * @param subscriptionId - Paddle ID of the subscription entity to work with
 * @param body - the request body containing the subscription update details
 *
 * @returns the updated subscription
 */
export function updateSubscription<DataDef extends PaddleAPI.CustomDataDef>(
  client: PaddleAPI.Client<DataDef>,
  subscriptionId: Paddle.SubscriptionId,
  body: PaddleAPI.SubscriptionUpdateBody<DataDef>
): Promise<PaddleAPI.SubscriptionUpdateResponse<DataDef>> {
  return paddleFetch(client, {
    method: "PATCH",
    path: "subscriptions/" + subscriptionId,
    body,
  });
}

/**
 * Updates a subscription using its ID.
 *
 * When making changes to items on a subscription, you must include
 * the proration_billing_mode field to tell Paddle how to bill for those
 * changes. Paddle returns an error if this field is missing when sending items.
 *
 * Send the complete list of items that you'd like to be on a subscription —
 * including existing items. If you omit items, they're removed from
 * the subscription.
 *
 * For each item, send price_id and quantity. Paddle responds with the full
 * price object for each price. If you're updating an existing item, you can
 * omit the quantity if you don't want to update it.
 *
 * If successful, your response includes a copy of the updated subscription
 * entity.
 *
 * @param client - the Paddle API client
 * @param subscriptionId - Paddle ID of the subscription entity to work with
 * @param body - the request body containing the subscription update details
 *
 * @returns the updated subscription
 */
export function previewUpdateSubscription<
  DataDef extends PaddleAPI.CustomDataDef
>(
  client: PaddleAPI.Client<DataDef>,
  subscriptionId: Paddle.SubscriptionId,
  body: PaddleAPI.SubscriptionUpdateBody<DataDef>
): Promise<PaddleAPI.SubscriptionPreviewUpdateResponse<DataDef>> {
  return paddleFetch(client, {
    method: "PATCH",
    path: "subscriptions/" + subscriptionId + "/preview",
    body,
  });
}

/**
 * Returns a transaction that you can pass to a checkout to let customers update
 * their payment details. Only for subscriptions where collection_mode
 * is automatic.
 *
 * The transaction returned depends on the status of the related subscription:
 * - Where a subscription is past_due, it returns the most recent past_due
 *   transaction.
 * - Where a subscription is active, it creates a new zero amount transaction
 *   for the items on a subscription.
 *
 * You can use the returned checkout.url, or pass the returned transaction ID
 * to Paddle.js to open a checkout to present customers with a way of updating
 * their payment details.
 *
 * @param client - the Paddle API client
 * @param subscriptionId - Paddle ID of the subscription entity to work with
 *
 * @returns a transaction that can be passed to a checkout to allow customers to update their payment details
 */
export function updatePaymentMethodTransaction<
  DataDef extends PaddleAPI.CustomDataDef
>(
  client: PaddleAPI.Client<DataDef>,
  subscriptionId: Paddle.SubscriptionId
): Promise<PaddleAPI.UpdatePaymentMethodTransactionResponse<DataDef>> {
  return paddleFetch(client, {
    method: "GET",
    path:
      "subscriptions/" + subscriptionId + "/update-payment-method-transaction",
  });
}

/// Charges

/**
 * Creates a new one-time charge for a subscription. Use to bill non-recurring
 * items to a subscription.  Non-recurring items are price entities where
 * the billing_cycle is null.
 *
 * If successful, Paddle responds with the updated subscription entity. However,
 * one-time charges aren't held against the subscription entity, so the charges
 * billed aren't returned in the response.
 *
 * @param client - the Paddle API client
 * @param params - Paddle ID of the subscription entity to work with
 * @param body - the request body
 *
 * @returns the updated subscription entity
 */
export function createCharge<DataDef extends PaddleAPI.CustomDataDef>(
  client: PaddleAPI.Client<DataDef>,
  subscriptionId: Paddle.SubscriptionId,
  body: PaddleAPI.ChargeCreateBody
): Promise<PaddleAPI.SubscriptionUpdateResponse<DataDef>> {
  return paddleFetch(client, {
    method: "POST",
    path: "subscriptions/" + subscriptionId + "/charge",
    body,
  });
}

/**
 * Previews creating a one-time charge for a subscription without billing that
 * charge. Typically used for previewing calculations before making changes to
 * a subscription.
 *
 * One-time charges are non-recurring items. These are price entities where
 * the billing_cycle is null.
 *
 * If successful, your response includes immediate_transaction,
 * next_transaction, and recurring_transaction_details so you can see expected
 * transactions for the changes.
 *
 * @param client - the Paddle API client
 * @param params - Paddle ID of the subscription entity to work with
 * @param body - the request body
 *
 * @returns the updated subscription entity
 */
export function previewCharge<DataDef extends PaddleAPI.CustomDataDef>(
  client: PaddleAPI.Client<DataDef>,
  subscriptionId: Paddle.SubscriptionId,
  body: PaddleAPI.ChargeCreateBody
): Promise<PaddleAPI.SubscriptionPreviewUpdateResponse<DataDef>> {
  return paddleFetch(client, {
    method: "POST",
    path: "subscriptions/" + subscriptionId + "/charge/preview",
    body,
  });
}

/// Private

function prepareQuery(query: Object | undefined): string {
  const q = new URLSearchParams();

  query &&
    Object.entries(query).forEach(([key, value]) => {
      if (value === undefined) return;

      if (Array.isArray(value)) {
        const str = value.filter((item) => item !== undefined).join(",");
        return q.append(key, str);
      } else if (key === "include" && value && typeof value === "object") {
        const val = Object.entries(value)
          .filter(([_, val]) => val)
          .map(([key, val]) => key)
          .join(",");
        return q.append(key, val);
      } else if (typeof value === "string") {
        const [_, op, val] = value.match(operatorRegExp) || [];
        if (op && val) return q.append(key + op, val);
      }

      q.append(key, value.toString());
    });

  const qStr = q.toString();
  return qStr ? `?${qStr}` : "";
}

const apiURL = `https://api.paddle.com/`;

const sandboxAPIURL = `https://sandbox-api.paddle.com/`;

const operatorRegExp = /^(\[(?:GT|GTE|LT|LTE)\])(.*)/;
