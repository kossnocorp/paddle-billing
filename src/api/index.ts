import type { Paddle as Core } from "../types";
import type { PaddleAPI as API } from "./types";

/// Generic

/**
 * Creates a Paddle API client.
 *
 * When specifying the custom data definition, you should bear in mind that
 * Subscription and Transaction should overlap and the fields that don not
 * overlap should be optional. It's dictated by the web's custom data-assigning
 * to relevant transaction and subscription  simultaneously. Creating an API
 * or web client with incompatible custom data definitions will result in
 * the client function returning never.
 *
 * @param key - the Paddle key
 * @param sandbox - if to use the sandbox API
 *
 * @returns the Paddle API client
 */
export function client<DataDef extends Core.CustomDataDef>(
  key: string,
  sandbox?: boolean
): Core.WithValidatedDataDef<DataDef, API.Client<DataDef>> {
  // @ts-expect-error: Because of WithValidatedDataDef, TS will complain but
  // this is ok!
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
  body?: Object | undefined;
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
  client: API.Client<Core.CustomDataDef>,
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
  DataDef extends Core.CustomDataDef,
  Include extends API.ProductResponseInclude | undefined
>(
  client: API.Client<DataDef>,
  query?: API.ProductsListQuery<Include>
): Promise<API.ProductsListResponse<DataDef, Include>> {
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
export function createProduct<DataDef extends Core.CustomDataDef>(
  client: API.Client<DataDef>,
  body: API.ProductCreateBody<DataDef>
): Promise<API.ProductCreateResponse<DataDef>> {
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
  DataDef extends Core.CustomDataDef,
  Include extends API.ProductInclude | undefined
>(
  client: API.Client<DataDef>,
  productId: Core.ProductId,
  query?: API.ProductGetQuery<Include>
): Promise<API.ProductGetResponse<DataDef, Include>> {
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
export function updateProduct<DataDef extends Core.CustomDataDef>(
  client: API.Client<DataDef>,
  productId: Core.ProductId,
  body: API.ProductUpdateBody<DataDef>
): Promise<API.ProductUpdateResponse<DataDef>> {
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
 * Use the include parameter to include the related product entity in
 * the response.
 *
 * @param client - the Paddle API client
 * @param query - the query parameters to filter the list of prices
 *
 * @returns list of prices
 */
export function listPrices<
  DataDef extends Core.CustomDataDef,
  Include extends API.PriceInclude | undefined
>(
  client: API.Client<DataDef>,
  query?: API.PricesListQuery<Include>
): Promise<API.PricesListResponse<DataDef, Include>> {
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
export function createPrice<DataDef extends Core.CustomDataDef>(
  client: API.Client<DataDef>,
  body: API.PriceCreateBody<DataDef>
): Promise<API.PriceCreateResponse<DataDef>> {
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
  DataDef extends Core.CustomDataDef,
  Include extends API.PriceInclude | undefined
>(
  client: API.Client<DataDef>,
  priceId: Core.PriceId,
  query?: API.PriceGetQuery<Include>
): Promise<API.PriceGetResponse<DataDef, Include>> {
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
export function updatePrice<DataDef extends Core.CustomDataDef>(
  client: API.Client<DataDef>,
  priceId: Core.PriceId,
  body: API.PriceUpdateBody<DataDef>
): Promise<API.PriceUpdateResponse<DataDef>> {
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
export function listDiscounts<DataDef extends Core.CustomDataDef>(
  client: API.Client<DataDef>,
  query?: API.DiscountsListQuery
): Promise<API.DiscountsListResponse> {
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
export function createDiscount<DataDef extends Core.CustomDataDef>(
  client: API.Client<DataDef>,
  body: API.DiscountCreateBody
): Promise<API.DiscountCreateResponse> {
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
export function getDiscount<DataDef extends Core.CustomDataDef>(
  client: API.Client<DataDef>,
  discountId: Core.DiscountId
): Promise<API.DiscountGetResponse> {
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
export function updateDiscount<DataDef extends Core.CustomDataDef>(
  client: API.Client<DataDef>,
  discountId: Core.DiscountId,
  body: API.DiscountUpdateBody
): Promise<API.DiscountUpdateResponse> {
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
export function listCustomers<DataDef extends Core.CustomDataDef>(
  client: API.Client<DataDef>,
  query?: API.CustomersListQuery<DataDef>
): Promise<API.CustomersListResponse<DataDef>> {
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
export function createCustomer<DataDef extends Core.CustomDataDef>(
  client: API.Client<DataDef>,
  body: API.CustomerCreateBody<DataDef>
): Promise<API.CustomerCreateResponse<DataDef>> {
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
export function getCustomer<DataDef extends Core.CustomDataDef>(
  client: API.Client<DataDef>,
  customerId: Core.CustomerId
): Promise<API.CustomerGetResponse<DataDef>> {
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
export function updateCustomer<DataDef extends Core.CustomDataDef>(
  client: API.Client<DataDef>,
  customerId: Core.CustomerId,
  body: API.CustomerUpdateBody<DataDef>
): Promise<API.CustomerUpdateResponse<DataDef>> {
  return paddleFetch(client, {
    method: "PATCH",
    path: "customers/" + customerId,
    body,
  });
}

/// Addresses

/**
 * Returns a paginated list of addresses for a customer. Use the query
 * parameters to page through results.
 *
 * By default, Paddle returns addresses that are active. Use the status query
 * parameter to return addresses that are archived.
 *
 * @param client - the Paddle API client
 * @param customerId - Paddle ID of the customer entity to work with
 * @param query - The customer's list addresses query
 *
 * @returns list of addresses for a customer
 */
export function listAddresses<DataDef extends Core.CustomDataDef>(
  client: API.Client<DataDef>,
  customerId: Core.CustomerId,
  query?: API.AddressListQuery<DataDef>
): Promise<API.AddressListResponse<DataDef>> {
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
export function createAddress<DataDef extends Core.CustomDataDef>(
  client: API.Client<DataDef>,
  customerId: Core.CustomerId,
  body: API.AddressCreateBody<DataDef>
): Promise<API.AddressCreateResponse<DataDef>> {
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
export function getAddress<DataDef extends Core.CustomDataDef>(
  client: API.Client<DataDef>,
  customerId: Core.CustomerId,
  addressId: Core.AddressId
): Promise<API.AddressGetResponse<DataDef>> {
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
export function updateAddress<DataDef extends Core.CustomDataDef>(
  client: API.Client<DataDef>,
  customerId: Core.CustomerId,
  addressId: Core.AddressId,
  body: API.AddressUpdateBody<DataDef>
): Promise<API.AddressUpdateResponse<DataDef>> {
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
export function listBusinesses<DataDef extends Core.CustomDataDef>(
  client: API.Client<DataDef>,
  customerId: Core.CustomerId,
  query?: API.BusinessesListQuery<DataDef>
): Promise<API.BusinessesListResponse<DataDef>> {
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
export function createBusiness<DataDef extends Core.CustomDataDef>(
  client: API.Client<DataDef>,
  customerId: Core.CustomerId,
  body: API.BusinessCreateBody<DataDef>
): Promise<API.BusinessCreateResponse<DataDef>> {
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
export function getBusiness<DataDef extends Core.CustomDataDef>(
  client: API.Client<DataDef>,
  customerId: Core.CustomerId,
  businessId: Core.BusinessId
): Promise<API.BusinessGetResponse<DataDef>> {
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
export function updateBusiness<DataDef extends Core.CustomDataDef>(
  client: API.Client<DataDef>,
  customerId: Core.CustomerId,
  businessId: string,
  body: API.BusinessUpdateBody<DataDef>
): Promise<API.BusinessUpdateResponse<DataDef>> {
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
  DataDef extends Core.CustomDataDef,
  Include extends API.TransactionResponseInclude | undefined
>(
  client: API.Client<DataDef>,
  query?: API.TransactionsListQuery<Include>
): Promise<API.TransactionsListResponse<DataDef, Include>> {
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
  DataDef extends Core.CustomDataDef,
  Include extends API.TransactionResponseInclude | undefined
>(
  client: API.Client<DataDef>,
  body: API.TransactionCreateBody<DataDef>,
  query?: API.TransactionCreateQuery<Include>
): Promise<API.TransactionCreateResponse<DataDef, Include>> {
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
 * @param query - The query parameters to include related entities in
 * the response
 *
 * @returns the transaction
 */
export function getTransaction<
  DataDef extends Core.CustomDataDef,
  Include extends API.TransactionResponseInclude | undefined
>(
  client: API.Client<DataDef>,
  transactionId: Core.TransactionId,
  query?: API.TransactionGetQuery<Include>
): Promise<API.TransactionGetResponse<DataDef, Include>> {
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
export function updateTransaction<DataDef extends Core.CustomDataDef>(
  client: API.Client<DataDef>,
  transactionId: Core.TransactionId,
  body: API.TransactionUpdateBody<DataDef>
): Promise<API.TransactionUpdateResponse<DataDef>> {
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
export function previewTransaction<DataDef extends Core.CustomDataDef>(
  client: API.Client<DataDef>,
  body: API.TransactionPreviewBody<DataDef>
): Promise<API.TransactionPreviewResponse<DataDef>> {
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
export function getInvoice<DataDef extends Core.CustomDataDef>(
  client: API.Client<DataDef>,
  transactionId: Core.TransactionId
): Promise<API.InvoiceGetResponse> {
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
export function listSubscriptions<DataDef extends Core.CustomDataDef>(
  client: API.Client<DataDef>,
  query?: API.SubscriptionsListQuery
): Promise<API.SubscriptionsListResponse<DataDef>> {
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
  DataDef extends Core.CustomDataDef,
  Include extends API.SubscriptionGetResponseInclude | undefined
>(
  client: API.Client<DataDef>,
  subscriptionId: Core.SubscriptionId,
  query?: API.SubscriptionGetQuery<Include>
): Promise<API.SubscriptionGetResponse<DataDef, Include>> {
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
export function updateSubscription<DataDef extends Core.CustomDataDef>(
  client: API.Client<DataDef>,
  subscriptionId: Core.SubscriptionId,
  body: API.SubscriptionUpdateBody<DataDef>
): Promise<API.SubscriptionUpdateResponse<DataDef>> {
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
export function previewUpdateSubscription<DataDef extends Core.CustomDataDef>(
  client: API.Client<DataDef>,
  subscriptionId: Core.SubscriptionId,
  body: API.SubscriptionUpdateBody<DataDef>
): Promise<API.SubscriptionPreviewUpdateResponse<DataDef>> {
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
 * @returns a transaction that can be passed to a checkout to allow customers
 * to update their payment details
 */
export function updatePaymentMethodTransaction<
  DataDef extends Core.CustomDataDef
>(
  client: API.Client<DataDef>,
  subscriptionId: Core.SubscriptionId
): Promise<API.UpdatePaymentMethodTransactionResponse<DataDef>> {
  return paddleFetch(client, {
    method: "GET",
    path:
      "subscriptions/" + subscriptionId + "/update-payment-method-transaction",
  });
}

/**
 * Pauses a subscription using its ID.
 *
 * To create an open-ended pause, send an empty request body. The subscription
 * remains paused until you send a resume request.
 *
 * To set a resume date, include the resume_at field in your request.
 * The subscription remains paused until the resume date, or until you send
 * a resume request.
 *
 * Pauses take place at the end of a subscription billing period.
 * If successful, your response includes a copy of the updated subscription
 * entity with a schedule_change to say that the subscription should pause
 * at the end of the billing period. Its status remains the same until after
 * the effective date of the scheduled change, at which point it changes
 * to paused.
 *
 * @param client - the Paddle API client
 * @param subscriptionId - Paddle ID of the subscription entity to work with
 * @param body - the request body containing the pause subscription details
 *
 * @returns a promise that resolves with the updated subscription
 */
export function pauseSubscription<DataDef extends Core.CustomDataDef>(
  client: API.Client<DataDef>,
  subscriptionId: Core.SubscriptionId,
  body?: API.SubscriptionPauseBody
): Promise<API.SubscriptionUpdateResponse<DataDef>> {
  return paddleFetch(client, {
    method: "POST",
    path: `subscriptions/${subscriptionId}/pause`,
    body,
  });
}

/**
 * Resumes a paused subscription using its ID. Only paused subscriptions can
 * be resumed. You cannot resume a canceled subscription.
 *
 * On resume, Paddle bills for a subscription immediately. Subscription billing
 * dates are recalculated based on the resume date.
 *
 * If successful, Paddle returns a copy of the updated subscription entity.
 * The subscription status is active, and billing dates are updated to reflect
 * the resume date.
 *
 * @param client - the Paddle API client
 * @param subscriptionId - Paddle ID of the subscription entity to work with
 * @param body - the request body containing when the subscription should resume
 *
 * @returns the updated subscription entity
 */
export function resumeSubscription<DataDef extends Core.CustomDataDef>(
  client: API.Client<DataDef>,
  subscriptionId: Core.SubscriptionId,
  body: API.SubscriptionResumeBody
): Promise<API.SubscriptionUpdateResponse<DataDef>> {
  return paddleFetch(client, {
    method: "POST",
    path: "subscriptions/" + subscriptionId + "/resume",
    body,
  });
}

/**
 * Cancels a subscription using its ID.
 *
 * For active subscriptions, cancellation takes place at the end of
 * a subscription billing period. If successful, your response includes a copy
 * of the updated subscription entity with a schedule_change to say that
 * the subscription should cancel at the end of the billing period. Its status
 * remains the same until after the effective date of the scheduled change,
 * at which point it changes to canceled.
 *
 * For paused subscriptions, cancellation takes place immediately. If
 * successful, your response includes a copy of the updated subscription
 * entity with the status of canceled.
 *
 * You cannot reactivate a canceled subscription.
 *
 * @param client - the Paddle API client
 * @param subscriptionId - Paddle ID of the subscription entity to work with
 * @param body - the request body
 *
 * @returns updated subscription entity
 */
export function cancelSubscription<DataDef extends Core.CustomDataDef>(
  client: API.Client<DataDef>,
  subscriptionId: Core.SubscriptionId,
  body: API.CancelSubscriptionRequestBody
): Promise<API.SubscriptionUpdateResponse<DataDef>> {
  return paddleFetch(client, {
    method: "POST",
    path: "subscriptions/" + subscriptionId + "/cancel",
    body,
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
export function createCharge<DataDef extends Core.CustomDataDef>(
  client: API.Client<DataDef>,
  subscriptionId: Core.SubscriptionId,
  body: API.ChargeCreateBody
): Promise<API.SubscriptionUpdateResponse<DataDef>> {
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
export function previewCharge<DataDef extends Core.CustomDataDef>(
  client: API.Client<DataDef>,
  subscriptionId: Core.SubscriptionId,
  body: API.ChargeCreateBody
): Promise<API.SubscriptionPreviewUpdateResponse<DataDef>> {
  return paddleFetch(client, {
    method: "POST",
    path: "subscriptions/" + subscriptionId + "/charge/preview",
    body,
  });
}

/// Adjustments

/**
 * Returns a paginated list of adjustments. Use the query parameters to page
 * through results.
 *
 * @param client - the Paddle API client
 * @param query - the query parameters to filter the list of adjustments
 *
 * @returns list of adjustments
 */
export function listAdjustments<DataDef extends Core.CustomDataDef>(
  client: API.Client<DataDef>,
  query?: API.AdjustmentsListQuery
): Promise<API.AdjustmentsListResponse> {
  return paddleFetch(client, {
    method: "GET",
    path: "adjustments",
    query,
  });
}

/**
 * Creates an adjustment for one or more transaction items.
 *
 * You may create adjustments for billed or completed transactions:
 *
 * Where an adjustment is for a manually-collected transaction with the status
 * of billed (an issued invoice), credit adjustments reduce the balance to pay
 * on the invoice.
 *
 * Where an adjustment is a refund, the total is returned to a customer's
 * original payment method.
 *
 * Refunds must be approved by Paddle. They're created with the status
 * pending_approval, before moving to approved or rejected.
 *
 * Adjustments can apply to some or all items on a transaction. You'll need
 * the Paddle ID of the transaction to create a refund or credit for, along with
 * the Paddle ID of any transaction items.
 *
 * @param client - the Paddle API client
 * @param body - the request body containing the adjustment details
 *
 * @returns the created adjustment
 */
export function createAdjustment<DataDef extends Core.CustomDataDef>(
  client: API.Client<DataDef>,
  body: API.AdjustmentCreateBody
): Promise<API.AdjustmentCreateResponse> {
  return paddleFetch(client, {
    method: "POST",
    path: "adjustments",
    body,
  });
}

/// Pricing preview

/**
 * Previews calculations for one or more prices. Typically used for building
 * pricing pages.
 *
 * You can provide location information when previewing prices. Paddle uses
 * this to calculate tax. You can provide one of: customer_ip_address, address,
 * customer_id, address_id, business_id.
 *
 * If successful, your response includes the data you sent with a details object
 * that includes totals for the supplied prices. Each line item includes
 * formatted_unit_totals and formatted_totals objects that return totals
 * formatted for the country or region you're working with, including
 * the currency symbol.
 *
 * @param client - the Paddle API client
 * @param body - the request body containing the details for the products
 *
 * @returns object of price details for the products
 */
export function previewPrices<DataDef extends Core.CustomDataDef>(
  client: API.Client<DataDef>,
  body: API.PreviewPricesBody
): Promise<API.PreviewPricesResponse<DataDef>> {
  return paddleFetch(client, {
    method: "POST",
    path: "pricing-preview",
    body,
  });
}

/// Event types

/**
 * Returns a list of event types.
 *
 * The response is not paginated.
 *
 * @param client - the Paddle API client
 *
 * @returns a list of event types
 */
export function listEventTypes<DataDef extends Core.CustomDataDef>(
  client: API.Client<DataDef>
): Promise<API.EventTypesListResponse> {
  return paddleFetch(client, {
    method: "GET",
    path: "event-types",
  });
}

/// Events

/**
 * Returns a paginated list of events that have occurred. Use the query
 * parameters to page through results.
 *
 * This is sometimes referred to as "the event stream."
 *
 * @param client - the Paddle API client
 * @param query - the query parameters to filter and page through the list
 * of events
 *
 * @returns list of events
 */
export function listEvents<DataDef extends Core.CustomDataDef>(
  client: API.Client<DataDef>,
  query?: API.EventsListQuery
): Promise<API.EventsListResponse<DataDef>> {
  return paddleFetch(client, {
    method: "GET",
    path: "events",
    query,
  });
}

/// Notification settings

/**
 * Returns a list of notification settings (notification destinations).
 *
 * The response is not paginated.
 *
 * @param client - the Paddle API client
 *
 * @returns list of notification settings
 */
export function listNotificationSettings<DataDef extends Core.CustomDataDef>(
  client: API.Client<DataDef>
): Promise<API.NotificationSettingsListResponse> {
  return paddleFetch(client, {
    method: "GET",
    path: "notification-settings",
  });
}

/**
 * Create a new notification setting (notification destination).
 *
 * Pass an array of event type names to subscribed_events to say which events
 * you'd like to subscribe to. Paddle responds with the full event type object
 * for each event type.
 *
 * If successful, your response includes a copy of the new notification setting
 * entity. Use the returned endpoint_secret_key for webhook
 * signature verification.
 *
 * @param client - the Paddle API client
 * @param body - the body of the request containing the details for
 * the notification setting creation
 *
 * @returns the notification setting entity and request information
 */
export function createNotificationSetting<DataDef extends Core.CustomDataDef>(
  client: API.Client<DataDef>,
  body: API.NotificationSettingCreateBody
): Promise<API.NotificationSettingCreateResponse> {
  return paddleFetch(client, {
    method: "POST",
    path: "notification-settings",
    body,
  });
}

/**
 * Returns a notification setting (notification destination) using its ID.
 *
 * @param client - The Paddle API client
 * @param notificationSettingId - Paddle ID of the notification setting entity to work with
 *
 * @returns a notification destination
 */
export async function getNotificationSetting<
  DataDef extends Core.CustomDataDef
>(
  client: API.Client<DataDef>,
  notificationSettingId: Core.NotificationSettingId
): Promise<API.NotificationSettingGetResponse> {
  return await paddleFetch(client, {
    method: "GET",
    path: `notification-settings/${notificationSettingId}`,
  });
}

/**
 * Update a notification setting (notification destination) using its ID.
 *
 * When updating subscribed events, send the complete list of event types that
 * you'd like to subscribe to. Include existing event types as omission would
 * lead to their removal from the notification setting. Only the event type name
 * needs to be passed, and Paddle responds with the full event type object for
 * each event type.
 *
 * If successful, your response includes a copy of the updated notification
 * setting entity.
 *
 * @param client - The Paddle API client
 * @param notificationSettingId - Paddle ID of the notification setting entity to work with
 * @param body - The request body containing the update details
 *
 * @returns The updated notification setting entity
 */
export function updateNotificationSetting<DataDef extends Core.CustomDataDef>(
  client: API.Client<DataDef>,
  notificationSettingId: Core.NotificationSettingId,
  body: API.NotificationSettingUpdateBody
): Promise<API.NotificationSettingUpdateResponse> {
  return paddleFetch(client, {
    method: "PATCH",
    path: "notification-settings/" + notificationSettingId,
    body,
  });
}

/**
 * Deletes a notification setting using its ID.
 *
 * When you delete a notification setting, it's permanently removed from your
 * account. Paddle stops sending events to your destination, and you'll lose
 * access to all the logs for this notification setting.
 *
 * There's no way to recover a deleted notification setting. Deactivate
 * a notification setting using the update notification setting operation if
 * you'll need access to the logs or want to reactivate later on.
 *
 * @param client - Instance of the Paddle API client
 * @param pathParams - Contains the ID of the notification setting to be deleted
 *
 * @returns A promise that resolves to a response object, containing either
 * a success or error response
 */
export function deleteNotificationSetting<DataDef extends Core.CustomDataDef>(
  client: API.Client<DataDef>,
  notificationSettingId: Core.NotificationSettingId
): Promise<API.NotificationSettingDeleteResponse> {
  return paddleFetch(client, {
    method: "DELETE",
    path: "notification-settings/" + notificationSettingId,
  });
}

/// Notifications

/**
 * Returns a paginated list of notifications. Use the query parameters to page
 * through results.
 *
 * @param client - the Paddle API client
 * @param query - the query parameters to filter the list of notifications
 *
 * @returns list of notifications
 */
export function listNotifications<DataDef extends Core.CustomDataDef>(
  client: API.Client<DataDef>,
  query?: API.NotificationsListQuery
): Promise<API.NotificationsListResponse<DataDef>> {
  return paddleFetch(client, {
    method: "GET",
    path: "notifications",
    query,
  });
}

/**
 * Returns a notification using its ID.
 *
 * @param client - the Paddle API client
 * @param notificationId - Paddle ID of the notification entity to work with
 *
 * @returns the notification
 */
export function getNotification<DataDef extends Core.CustomDataDef>(
  client: API.Client<DataDef>,
  notificationId: Core.NotificationId
): Promise<API.NotificationGetResponse<DataDef>> {
  return paddleFetch(client, {
    method: "GET",
    path: "notifications/" + notificationId,
  });
}

/**
 * Attempts to resend a delivered or failed notification using its ID.
 *
 * Paddle creates a new notification entity for the replay, related to
 * the same event_id. The new notification replay is sent to the destination
 * against the notification_setting_id.
 *
 * @param client - the Paddle API client
 * @param notificationId - Paddle ID of the notification entity to work with
 *
 * @returns object with replayed notification id
 */
export function replayNotification<DataDef extends Core.CustomDataDef>(
  client: API.Client<DataDef>,
  notificationId: string
): Promise<API.NotificationReplayResponse> {
  return paddleFetch(client, {
    method: "POST",
    path: "notifications/" + notificationId + "/replay",
  });
}

/// Notification logs

/**
 * Returns a paginated list of notification logs for a notification. A log
 * includes information about delivery attempts, including failures.
 *
 * @param client - the Paddle API client
 * @param notificationId - Paddle ID of the notification entity to work with
 * @param query - the query parameters to filter the list of notification logs
 *
 * @returns list of notification logs
 */
export function listNotificationLogs<DataDef extends Core.CustomDataDef>(
  client: API.Client<DataDef>,
  notificationId: Core.NotificationId,
  query?: API.NotificationLogsListQuery
): Promise<API.NotificationLogsListResponse> {
  return paddleFetch(client, {
    method: "GET",
    path: "notifications/" + notificationId + "/logs",
    query,
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
