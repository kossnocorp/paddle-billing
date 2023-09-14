import type { Paddle } from "../types";
/**
 * The API Paddle types namespace. Contains all the types related to the API.
 */
export namespace PaddleAPI {
  export interface Client<_DataDef extends CustomDataDef> {
    key: string;
    sandbox?: boolean | undefined;
  }

  export interface CustomDataDef {
    Price?: Paddle.CustomData;
    Product?: Paddle.CustomData;
    SubscriptionItem?: Paddle.CustomData;
    Subscription?: Paddle.CustomData;
    Transaction?: Paddle.CustomData;
  }

  export type CustomData<Data extends Paddle.CustomData | undefined> =
    Data extends Paddle.CustomData ? Data : Paddle.CustomData;

  /**
   * The error response.
   */
  export interface ErrorResponse<Code extends ErrorCode> {
    /** The error object */
    error: Error<Code>;
    /** Information about this response. */
    meta: MetaBasic;
  }

  /**
   * The response error.
   */
  export interface Error<Code extends ErrorCode> {
    /** Type of error encountered. */
    type: ErrorType;
    /** Short snake case string that describes this error. Use to search
     * the error reference. */
    code: Code;
    /** Some information about what went wrong as a human-readable string. */
    detail: string;
    /** Link to a page in the error reference for this specific error. */
    documentation_url: string;
    /** List of validation errors. */
    errors?: ValidationError[];
  }

  /**
   * Type of error encountered.
   */
  export type ErrorType = "request_error" | "api_error";

  /**
   * Error codes alias.
   */
  export type ErrorCode =
    | ErrorCodeAddresses
    | ErrorCodeAdjustments
    | ErrorCodeCustomers
    | ErrorCodeDiscounts
    | ErrorCodeNotifications
    | ErrorCodePrices
    | ErrorCodeProducts
    | ErrorCodeSubscriptions
    | ErrorCodeTransactions;

  /**
   * Shared error codes.
   */
  export type ErrorCodeShared =
    | "not_found" // Entity not found: The entity you're trying to work with doesn't exist.
    | "invalid_url" // Invalid URL: The URL you have called is invalid.
    | "authentication_missing" // Authentication header missing: No Authorization header detected with your request.
    | "authentication_malformed" // Authentication header invalid: An Authorization header was sent with your request, but it isn't in a valid format.
    | "invalid_token" // Invalid API key: The API key included with your request isn't valid.
    | "paddle_billing_not_enabled" // Paddle Billing is not enabled: Your authentication is valid, but Paddle Billing is not enabled for this account.
    | "forbidden" // Forbidden: The authentication method you used does not have permission to perform that request.
    | "bad_request" // Bad request: Something isn't right with your request.
    | "internal_error" // Internal error: There's a temporary problem with the Paddle API. Your request was not processed.
    | "service_unavailable" // Service unavailable: The Paddle API is down for maintenance or temporarily unable to handle your request. Your request was not processed.
    | "method_not_allowed" // Method not allowed: The endpoint does not support the HTTP method you used.
    | "not_implemented" // Not implemented: The method used to make your request isn't recognized.
    | "bad_gateway" // Bad gateway: The Paddle API is temporarily unable to handle your request. Your request was not processed.
    | "too_many_requests" // Too many requests: There have been too many requests to the API from your IP address, so it's been temporarily rate-limited.
    | "entity_archived" // Entity archived and cannot be modified: The entity you're trying to modify is archived, so it can't be changed.
    | "invalid_field" // Request does not pass validation: One or more of the fields sent with your request aren't valid.
    | "concurrent_modification" // Concurrent modification: There were multiple concurrent requests to modify the same entity.
    | "conflict" // Conflict: Your request has conflicted with another change already made.
    | "invalid_json" // JSON payload invalid: Your request isn't valid JSON.
    | "invalid_time_query_parameter" // Unable to parse time query parameter: You are attempting to send an invalid timestamp as a query parameter
    | "unsupported_media_type"; // Invalid Content-Type header: The request has an invalid Content-Type header

  /**
   * Addresses
   * Encountered when working with address entities.
   */
  export type ErrorCodeAddresses = "address_location_not_allowed"; // Address cannot be created or updated with this country

  /**
   * Adjustments
   * Encountered when working with adjustment entities.
   */
  export type ErrorCodeAdjustments =
    | "adjustment_transaction_missing_customer_id" // Cannot create adjustments for a transaction with a missing customer_id
    | "adjustment_transaction_customer_mismatch" // Adjustment customer mismatch
    | "adjustment_transaction_subscription_mismatch" // Adjustment subscription mismatch
    | "adjustment_transaction_invalid_status_for_credit" // The transaction being adjusted (credit) has a non supported status
    | "adjustment_transaction_invalid_status_for_refund" // The transaction being adjusted (refund) has a non supported status
    | "adjustment_invalid_credit_action" // The adjustment action provided (credit) cannot be performed on the specified transaction
    | "adjustment_invalid_combination_of_types" // The adjustment has an invalid combination of types
    | "adjustment_amount_above_remaining_allowed" // Adjustment item amount defined is above the remaining allowed
    | "adjustment_total_amount_above_remaining_allowed" // Adjustment amount defined is above the remaining allowed
    | "adjustment_transaction_item_has_already_been_fully_adjusted" // Adjustment has already been made in full
    | "adjustment_no_tax_available_to_adjust" // No tax available to adjust
    | "adjustment_amount_cannot_be_zero" // Adjustment amount cannot be zero
    | "adjustment_pending_refund_request" // Pending refund adjustment
    | "adjustment_transaction_item_over_adjustment" // One or more adjustment items are being over adjusted.
    | "adjustment_transaction_item_invalid"; // One or more adjustment items cannot be processed

  /**
   * Customers error codes. Encountered when working with customer entities.
   */
  export type ErrorCodeCustomers =
    | ErrorCodeShared
    | "customer_already_exists" // Attempt to create a customer with an existing email
    | "customer_email_domain_not_allowed"; // Customer cannot be created or updated with this email address

  /**
   * Discounts error codes. Encountered when working with discount entities.
   */
  export type ErrorCodeDiscounts =
    | ErrorCodeShared
    | "discount_expired" // Discount has expired
    | "discount_usage_limit_exceeded" // Discount usage limit exceeded
    | "discount_code_conflict" // Duplicated discount code
    | "discount_restricted_product_not_active" // Product not active
    | "discount_restricted_product_price_not_active"; // Product Price not active

  /**
   * Notifications error codes. Encountered when working with notifications
   * and notification settings.
   */
  export type ErrorCodeNotifications =
    | ErrorCodeShared
    | "notification_maximum_active_settings_reached" // Maximum notification settings reached
    | "notification_cannot_replay" // Notification cannot be replayed
    | "url_notification_setting_incorrect" // URL Notification Setting destination must be a URL
    | "email_notification_setting_incorrect" // Email Notification Setting destination must be an email
    | "notification_replay_invalid_origin_type"; // Can only replay notifications with an origin of event

  /**
   * Prices error codes. Encountered when working with price entities.
   */
  export type ErrorCodePrices =
    | ErrorCodeShared
    | "price_trial_period_missing_fields" // Interval and frequency required for trial period
    | "price_trial_period_requires_billing_cycle" // Billing cycle required for trial period
    | "price_billing_cycle_frequency_below_1" // Billing cycle frequency must be equal to or higher than 1
    | "price_trial_period_frequency_below_1" // Trial period frequency must be 1 or greater
    | "price_duplicate_currency_override_for_country"; // Duplicate currency override for country

  /**
   * Products error codes. Encountered when working with product entities.
   */
  export type ErrorCodeProducts =
    | ErrorCodeShared
    | "product_tax_category_not_approved"; // Tax category not approved

  /**
   * Subscriptions error codes. Encountered when working with subscription entities.
   */
  export type ErrorCodeSubscriptions =
    | ErrorCodeShared
    | "subscription_locked_renewal" // Subscription locked for editing due to renewal
    | "subscription_locked_processing" // Subscription locked for editing due to processing
    | "subscription_locked_pending_changes" // Subscription locked for editing while there are pending changes
    | "subscription_update_when_canceled" // Subscription cannot be updated when canceled
    | "subscription_update_when_trialing" // Subscription cannot be updated when trialing
    | "subscription_cannot_be_paused" // Action can't be performed on paused subscription
    | "subscription_is_canceled_action_invalid" // Action can't be performed on canceled subscription
    | "subscription_is_inactive_action_invalid" // Action can't be performed on inactive subscription
    | "subscription_update_when_past_due" // Subscription cannot be updated when past due
    | "subscription_not_automatic_collection" // Subscription not in automatic collection mode
    | "subscription_not_active" // Subscription not active
    | "subscription_next_billed_at_too_soon" // New next_billed_at timestamp is less than 30m from now
    | "subscription_outstanding_transaction" // Subscription cannot update due to outstanding transaction
    | "subscription_must_be_paused" // Action can only be performed when subscription is paused
    | "subscription_all_items_removed" // Subscription update removes all items
    | "subscription_update_error_when_paused" // Subscription items update error when paused
    | "subscription_items_update_missing_proration_billing_mode" // Subscription items update without proration billing mode
    | "subscription_discount_not_valid_for_items" // Discount not valid for items on subscription
    | "subscription_one_off_discount_not_valid" // One-off discount not valid for subscription
    | "subscription_duplicate_price_ids" // Duplicate `price_id` fields sent in the items list
    | "subscription_scheduled_change_invalid_update" // Attempt to update a scheduled change
    | "subscription_only_update_items_on_paused_subscription" // Only items can be updated when subscription paused
    | "subscription_incorrect_proration_on_paused_subscription" // Proration billing mode not accepted on paused subscription
    | "subscription_payment_declined" // Payment declined
    | "subscription_billing_details_required" // Billing details required when creating transaction for manual collection mode subscription
    | "subscription_new_items_not_valid" // New items not valid in subscription update
    | "subscription_quantity_missing_for_new_items" // Quantity field missing for new items in subscription update
    | "subscription_charge_duplicate_price_ids" // Duplicate `price_id` fields sent in the items list
    | "subscription_no_recurring_items_remain" // No recurring items on subscription
    | "subscription_quantity_not_valid" // Item quantity out of range
    | "subscription_currency_code_not_valid_for_manual" // Currency code not valid for manual collection mode
    | "subscription_customer_not_suitable_for_collection_mode" // Customer entity not valid for current collection mode
    | "subscription_address_not_suitable_for_collection_mode" // Address entity not valid for current collection mode
    | "subscription_invalid_discount_currency" // Flat discount is for a currency other than that of the subscription
    | "subscription_trialing_items_update_invalid_options" // Invalid update options for items on a trialing subscription
    | "subscription_cannot_activate" // Subscription cannot activate
    | "subscription_outstanding_pending_refund" // Subscription pending refund
    | "subscription_outstanding_balance_different_currency" // Outstanding balance in a different currency
    | "subscription_trialing_discount_update_invalid_options"; // Invalid update options for discount on a trialing subscription

  /**
   * Transactions error codes. Encountered when working with transaction
   * entities.
   */
  export type ErrorCodeTransactions =
    | ErrorCodeShared
    | "transaction_immutable" // Transaction is in immutable state: You are trying to update a transaction which is not in the draft or ready state.
    | "transaction_discount_not_eligible" // Discount not applicable for transaction items: You are applying a discount that doesn't apply to any of the transaction items.
    | "transaction_not_ready_cannot_process_payment" // Cannot process payment for a transaction with non-ready status: You are processing payment for a transaction that's not in a ready state.
    | "transaction_default_checkout_url_not_set" // Default Checkout URL has not been defined: You are trying to create/update a transaction but no default checkout URL has been set on this account.
    | "transaction_checkout_not_enabled" // Checkout has not been enabled: You are trying to create/update a transaction but checkouts are disabled for this account.
    | "transaction_customer_is_required_with_address" // Customer ID is required for validating an address: customerID is required for validating an address.
    | "transaction_customer_is_required_for_business_validation" // Customer ID is required for validating an business: CustomerID is required for validating an business.
    | "transaction_price_different_billing_cycle" // Cannot have different price billing cycle intervals and/or frequencies: You are attempting to create a transaction with prices that have differing billing cycle intervals and/or frequencies.
    | "transaction_price_different_trial_period" // Cannot have different trial period intervals and/or frequencies: You are attempting to create a transaction with prices that have differing trial period intervals and/or frequencies.
    | "transaction_item_quantity_out_of_range" // Quantity provided is not within the price quantity range: You are attempting to provide an item quantity that is not within the price quantity range.
    | "transaction_both_price_id_and_object_found" // Cannot send both price ID and Price Object in the same line item: You are attempting to send both the Price ID and Price Object on the same line item.
    | "transaction_price_not_found" // Price ID cannot be found: You are attempting to send one or more Price ID(s) that can't be found.
    | "transaction_product_not_found" // Product ID cannot be found: You are attempting to send one or more Product ID(s) that cant be found.
    | "transaction_cannot_be_modified_and_canceled" // Transaction cannot be modified and canceled: You are attempting to cancel a transaction whilst passing fields to update.
    | "transaction_discount_not_found" // Discount Code or ID cannot be found: You are attempting to add a Discount Code/ID that cant be found.
    | "transaction_cannot_provide_both_discount_code_and_id" // Cannot provide both Discount Code and ID: You are attempting to add a Discount Code and ID.
    | "transaction_invalid_status_change" // Invalid status change: Invalid status change attempted.
    | "transaction_billing_details_must_be_null" // Billing details must be null if the collection mode is automatic: You are attempting to set billing details when the collection mode is automatic.
    | "transaction_billing_details_object_required" // Billing details must not be null if the collection mode is manual: You are attempting to set collection mode as manual without Billing Details being provided.
    | "transaction_payment_terms_object_required" // Payment Terms must be non null when initially setting Billing Details: You have not provided Payment Details whilst setting Billing Details.
    | "transaction_balance_less_than_charge_limit" // Transaction balance is less than charge limit: For a transaction to be ready for payment it must have a chargeable amount greater than 70 cent USD.
    | "transaction_status_must_be_ready" // Transaction status needs to be ready: You are attempting to perform an action that requires the transaction to be in the ready status.
    | "transaction_customer_not_suitable_for_collection_mode" // Customer entity not valid for current collection mode: You are attempting to create a transaction but the customer entity is not valid for the current collection mode.
    | "transaction_address_not_suitable_for_collection_mode" // Address entity not valid for current collection mode: You are attempting to create a transaction but the address entity is not valid for the current collection mode.
    | "transaction_currency_code_not_valid_for_manual" // Currency code not valid for manual collection mode: You are attempting to create a manual transaction but the currency code is not valid.
    | "transaction_preview_adjustment_subscription_conflict" // When previewing a transaction with multiple adjustments all the transaction need to belong to the same subscription: You are attempting to preview a transaction with several adjustments, but the transactions associated to them have different subscription IDs.
    | "transaction_invalid_discount_currency" // Flat discount is for a currency other than that of the transaction: You are attempting to apply a flat discount that has a different currency to that of the transaction.
    | "transaction_billing_period_starts_at_greater_than_now"; // New `billing_period.starts_at` timestamp is greater than now: The value for billing_period.starts_at cannot be in future.

  /**
   * Validation error details.
   */
  export interface ValidationError {
    /** Field where validation error occurred. */
    field: string;
    /** Information about how the field failed validation. */
    message: string;
  }

  /// Products

  /**
   * The product's include query.
   */
  export type ProductInclude = "prices";

  /**
   * The product's auto-assign fields.
   */
  export type ProductAutoAssignFields = "id" | "created_at";

  //// List products

  /**
   * The products list query.
   */
  export interface ProductsListQuery<
    Include extends ProductInclude | undefined
  > {
    /** Return entities after the specified cursor. Used for working through
     * paginated results. */
    after?: string | undefined;
    /** Return only the IDs specified. */
    id?: Paddle.ProductId | Paddle.ProductId[] | undefined;
    /** Include related entities in the response. */
    include?: Include;
    /** Order returned entities by the specified field and direction
     * [ASC] or [DESC]). */
    order_by?:
      | OrderQuery<Paddle.Product>
      | OrderQuery<Paddle.Product>[]
      | undefined;
    /** Set how many entities are returned per page. */
    per_page?: number | undefined;
    /** Return entities that match the specified status. */
    status?: Paddle.EntityStatus | Paddle.EntityStatus[] | undefined;
    /** Return entities that match the specified tax category. */
    tax_category?: Paddle.TaxCategory | undefined;
  }

  /**
   * THe products list response.
   */
  export type ProductsListResponse<
    DataDef extends CustomDataDef,
    Include extends ProductInclude | undefined
  > = ProductsListResponseError | ProductsListResponseSuccess<DataDef, Include>;

  /**
   * The errored products list response.
   */
  export interface ProductsListResponseError
    extends ErrorResponse<ErrorCodeShared> {}

  /**
   * The successful products list response.
   */
  export interface ProductsListResponseSuccess<
    DataDef extends CustomDataDef,
    Include extends ProductInclude | undefined
  > extends ResponseBase<
      ProductsListDataItem<
        CustomData<DataDef["Price"]>,
        CustomData<DataDef["Product"]>,
        Include
      >[],
      MetaPaginated
    > {}

  /**
   * The products list data item.
   */
  export interface ProductsListDataItem<
    PriceData extends Paddle.CustomData,
    ProductData extends Paddle.CustomData,
    Include extends ProductInclude | undefined
  > extends Paddle.Product<ProductData> {
    /** The product prices */
    prices: undefined extends Include
      ? never
      : Paddle.Price<Paddle.TimeInterval | null, PriceData>[];
  }

  //// Create a product

  /**
   * The create product body.
   */
  export type ProductCreateBody<DataDef extends CustomDataDef> =
    MakeNullableFieldsOptional<
      Omit<
        Paddle.Product<CustomData<DataDef["Product"]>>,
        ProductAutoAssignFields | "status"
      >
    >;

  /**
   * The create product response.
   */
  export type ProductCreateResponse<DataDef extends CustomDataDef> =
    | ProductCreateResponseError
    | ProductCreateResponseSuccess<CustomData<DataDef["Product"]>>;

  /**
   * The errored product create response.
   */
  export interface ProductCreateResponseError
    extends ErrorResponse<ErrorCodeProducts> {}

  /**
   * The successful product create response.
   */
  export interface ProductCreateResponseSuccess<
    ProductData extends Paddle.CustomData
  > extends ResponseBase<Paddle.Product<ProductData>, MetaBasic> {}

  //// Get a product

  /**
   * The get product query.
   */
  export interface ProductGetQuery<Include extends ProductInclude | undefined> {
    /** Include related entities in the response. */
    include?: Include;
  }

  /**
   * The get product response.
   */
  export type ProductGetResponse<
    DataDef extends CustomDataDef,
    Include extends ProductInclude | undefined
  > = ProductGetResponseError | ProductGetResponseSuccess<DataDef, Include>;

  /**
   * The error response of getProduct function.
   */
  export interface ProductGetResponseError
    extends ErrorResponse<ErrorCodeShared> {}

  /**
   * The successful product get response.
   */
  export interface ProductGetResponseSuccess<
    DataDef extends CustomDataDef,
    Include extends ProductInclude | undefined
  > extends ResponseBase<
      ProductGetData<
        CustomData<DataDef["Price"]>,
        CustomData<DataDef["Product"]>,
        Include
      >,
      MetaBasic
    > {}

  /**
   * The get product data.
   */
  export interface ProductGetData<
    PriceData extends Paddle.CustomData,
    ProductData extends Paddle.CustomData,
    Include extends ProductInclude | undefined
  > extends Paddle.Product<ProductData> {
    /** The product prices */
    prices: undefined extends Include
      ? never
      : Paddle.Price<Paddle.TimeInterval | null, PriceData>[];
  }

  //// Update a product

  /**
   * The update product body.
   */
  export type ProductUpdateBody<DataDef extends CustomDataDef> = Partial<
    Omit<
      Paddle.Product<CustomData<DataDef["Product"]>>,
      ProductAutoAssignFields
    >
  >;

  /**
   * The update product response.
   */
  export type ProductUpdateResponse<DataDef extends CustomDataDef> =
    | ProductUpdateResponseError
    | ProductUpdateResponseSuccess<DataDef>;

  /**
   * The errored product update response.
   */
  export interface ProductUpdateResponseError
    extends ErrorResponse<ErrorCodeProducts> {}

  /**
   * The successful product update response.
   */
  export interface ProductUpdateResponseSuccess<DataDef extends CustomDataDef>
    extends ResponseBase<
      Paddle.Product<CustomData<DataDef["Product"]>>,
      MetaBasic
    > {}

  /// Prices

  /**
   * The price's include query.
   */
  export type PriceInclude = "product";

  /**
   * The price's auto-assign fields.
   */
  export type PriceAutoAssignFields = "id" | "created_at";

  //// List prices

  /**
   * The prices list query.
   */
  export interface PricesListQuery<Include extends PriceInclude | undefined> {
    /** Return entities after the specified cursor. Used for working through
     * paginated results. */
    after?: string | undefined;
    /** Return only the IDs specified. */
    id?: Paddle.PriceId | Paddle.PriceId[] | undefined;
    /** Include related entities in the response. */
    include?: Include;
    /** Order returned entities by the specified field and direction
     * [ASC] or [DESC]). */
    order_by?:
      | OrderQuery<Paddle.Price>
      | OrderQuery<Paddle.Price>[]
      | undefined;
    /** Set how many entities are returned per page. */
    per_page?: number | undefined;
    /** Return entities related to the specified product. */
    product_id?: Paddle.ProductId | Paddle.ProductId[] | undefined;
    /** Return entities that match the specified status. */
    status?: Paddle.EntityStatus | Paddle.EntityStatus[] | undefined;
    /** Determine whether returned entities are for recurring prices (true) or
     * one-time prices (false). */
    recurring?: boolean | undefined;
  }

  /**
   * The prices list response.
   */
  export type PricesListResponse<
    DataDef extends CustomDataDef,
    Include extends PriceInclude | undefined
  > = PricesListResponseError | PricesListResponseSuccess<DataDef, Include>;

  /**
   * The errored prices list response.
   */
  export interface PricesListResponseError
    extends ErrorResponse<ErrorCodeShared> {}

  /**
   * The successful prices list response.
   */
  export interface PricesListResponseSuccess<
    DataDef extends CustomDataDef,
    Include extends PriceInclude | undefined
  > extends ResponseBase<
      PricesListDataItem<CustomData<DataDef["Price"]>, Include>[],
      MetaPaginated
    > {}

  /**
   * The prices list data item.
   */
  export interface PricesListDataItem<
    Data extends Paddle.CustomData,
    Include extends PriceInclude | undefined
  > extends Paddle.Price<Paddle.TimeInterval | null, Data> {
    /** The related product object */
    product: undefined extends Include ? never : Paddle.Product;
  }

  /// Create a price

  /**
   * The create price body.
   */
  export type PriceCreateBody<DataDef extends CustomDataDef> =
    MakeNullableFieldsOptional<
      MakeFieldsOptional<
        Omit<
          Paddle.Price<
            Paddle.TimeInterval | null,
            CustomData<DataDef["Price"]>
          >,
          PriceAutoAssignFields | "status"
        >,
        "quantity"
      >
    >;

  /**
   * The create price response.
   */
  export type PriceCreateResponse<DataDef extends CustomDataDef> =
    | PriceCreateResponseError
    | PriceCreateResponseSuccess<CustomData<DataDef["Price"]>>;

  /**
   * The errored price create response.
   */
  export interface PriceCreateResponseError
    extends ErrorResponse<ErrorCodePrices> {}

  /**
   * The successful price create response.
   */
  export interface PriceCreateResponseSuccess<
    PriceData extends Paddle.CustomData
  > extends ResponseBase<
      Paddle.Price<Paddle.TimeInterval | null, PriceData>,
      MetaBasic
    > {}

  //// Get Price

  /**
   * The get price query.
   */
  export interface PriceGetQuery<Include extends PriceInclude | undefined> {
    /** Include related entities in the response. */
    include?: Include;
  }

  /**
   * The get price response.
   */
  export type PriceGetResponse<
    DataDef extends CustomDataDef,
    Include extends PriceInclude | undefined
  > = PriceGetResponseError | PriceGetResponseSuccess<DataDef, Include>;

  /**
   * The error response of getPrice function.
   */
  export interface PriceGetResponseError
    extends ErrorResponse<ErrorCodeShared> {}

  /**
   * The successful price get response.
   */
  export interface PriceGetResponseSuccess<
    DataDef extends CustomDataDef,
    Include extends PriceInclude | undefined
  > extends ResponseBase<
      PriceGetData<CustomData<DataDef["Price"]>, Include>,
      MetaBasic
    > {}

  /**
   * The get price data.
   */
  export interface PriceGetData<
    PriceData extends Paddle.CustomData,
    Include extends PriceInclude | undefined
  > extends Paddle.Price<Paddle.TimeInterval | null, PriceData> {
    /** The related product object */
    product: undefined extends Include ? never : Paddle.Product;
  }

  //// Update a price

  /**
   * The update price body.
   */
  export type PriceUpdateBody<DataDef extends CustomDataDef> = Partial<
    Omit<
      Paddle.Price<Paddle.TimeInterval | null, CustomData<DataDef["Price"]>>,
      PriceAutoAssignFields
    >
  >;

  /**
   * The update price response.
   */
  export type PriceUpdateResponse<DataDef extends CustomDataDef> =
    | PriceUpdateResponseError
    | PriceUpdateResponseSuccess<DataDef>;

  /**
   * The errored price update response.
   */
  export interface PriceUpdateResponseError
    extends ErrorResponse<ErrorCodePrices> {}

  /**
   * The successful price update response.
   */
  export interface PriceUpdateResponseSuccess<DataDef extends CustomDataDef>
    extends ResponseBase<
      Paddle.Price<Paddle.TimeInterval | null, CustomData<DataDef["Price"]>>,
      MetaBasic
    > {}

  /// Discounts

  /**
   * The discount's auto-assign fields.
   */
  export type DiscountAutoAssignFields =
    | "id"
    | "created_at"
    | "times_used"
    | "updated_at";

  //// List discounts

  /**
   * The Discounts query parameters.
   */
  export interface DiscountsListQuery {
    /** Return entities after the specified cursor. Used for working through
     * paginated results. */
    after?: string | undefined;
    /** Return entities that match the discount code. */
    code?: string | string[] | undefined;
    /** Return only the IDs specified. */
    id?: Paddle.DiscountId | Paddle.DiscountId[] | undefined;
    /** Order returned entities by the specified field and direction
     * ([ASC] or [DESC]). */
    order_by?:
      | OrderQuery<Paddle.Discount>
      | OrderQuery<Paddle.Discount>[]
      | undefined;
    /** Set how many entities are returned per page. */
    per_page?: number | undefined;
    /** Return entities that match the specified status. */
    status?: Paddle.DiscountStatus | Paddle.DiscountStatus[] | undefined;
  }

  /**
   * The errored Discounts list response.
   */
  export interface DiscountsListResponseError
    extends ErrorResponse<ErrorCodeShared> {}

  /**
   * The successful Discounts list response.
   */
  export interface DiscountsListResponseSuccess
    extends ResponseBase<Paddle.Discount[], MetaPaginated> {}

  /**
   * The Discounts list response.
   */
  export type DiscountsListResponse =
    | DiscountsListResponseError
    | DiscountsListResponseSuccess;

  //// Create a discount

  /**
   * The create discount body.
   */
  export type DiscountCreateBody = MakeNullableFieldsOptional<
    Omit<Paddle.Discount, DiscountAutoAssignFields | "status">
  >;

  /**
   * The create discount response.
   */
  export type DiscountCreateResponse =
    | DiscountCreateResponseError
    | DiscountCreateResponseSuccess;

  /**
   * The errored discount create response.
   */
  export interface DiscountCreateResponseError
    extends ErrorResponse<ErrorCodeDiscounts> {}

  /**
   * The successful discount create response.
   */
  export interface DiscountCreateResponseSuccess
    extends ResponseBase<Paddle.Discount, MetaBasic> {}

  //// Get a discount

  /**
   * The get discount response.
   */
  export type DiscountGetResponse =
    | DiscountGetResponseError
    | DiscountGetResponseSuccess;

  /**
   * The errored discount get response.
   */
  export interface DiscountGetResponseError
    extends ErrorResponse<ErrorCodeShared> {}

  /**
   * The successful discount get response.
   */
  export interface DiscountGetResponseSuccess
    extends ResponseBase<Paddle.Discount, MetaBasic> {}

  //// Update a discount

  /**
   * The update discount body.
   */
  export type DiscountUpdateBody = Partial<
    MakeNullableFieldsOptional<Omit<Paddle.Discount, DiscountAutoAssignFields>>
  >;

  /**
   * The update discount response.
   */
  export type DiscountUpdateResponse =
    | DiscountUpdateResponseError
    | DiscountUpdateResponseSuccess;

  /**
   * The errored update discount response.
   */
  export interface DiscountUpdateResponseError
    extends ErrorResponse<ErrorCodeShared> {}

  /**
   * The successful update discount response.
   */
  export interface DiscountUpdateResponseSuccess
    extends ResponseBase<Paddle.Discount, MetaBasic> {}

  /// Customers

  /**
   * The price's auto-assign fields.
   */
  export type CustomerAutoAssignFields =
    | "id"
    | "created_at"
    | "updated_at"
    | "marketing_consent";

  //// List customers

  /**
   * The customers list query.
   */
  export interface CustomersListQuery {
    /** Return entities after the specified cursor. Used for working through
     * paginated results. */
    after?: string | undefined;
    /** Return only the IDs specified. */
    id?: Paddle.CustomerId | Paddle.CustomerId[] | undefined;
    /** Order returned entities by the specified field and direction
     * [ASC] or [DESC]). */
    order_by?: OrderQuery<Paddle.Customer> | undefined;
    /** Set how many entities are returned per page. */
    per_page?: number | undefined;
    /** Return entities that match a search query. Searches id, name, and email fields. */
    search?: string | undefined;
    /** Return entities that match the specified status. */
    status?: Paddle.EntityStatus | Paddle.EntityStatus[] | undefined;
  }

  /**
   * The customers list response.
   */
  export type CustomersListResponse =
    | CustomersListResponseError
    | CustomersListResponseSuccess;

  /**
   * The errored customers list response.
   */
  export interface CustomersListResponseError
    extends ErrorResponse<ErrorCodeShared> {}

  /**
   * The successful customers list response.
   */
  export interface CustomersListResponseSuccess
    extends ResponseBase<Paddle.Customer[], MetaPaginated> {}

  //// Create a customer

  /**
   * The create customer body.
   */
  export type CustomerCreateBody = MakeNullableFieldsOptional<
    MakeFieldsOptional<
      Omit<Paddle.Customer, CustomerAutoAssignFields | "status">,
      "locale"
    >
  >;

  /**
   * The create customer response.
   */
  export type CustomerCreateResponse =
    | CustomerCreateResponseError
    | CustomerCreateResponseSuccess;

  /**
   * The errored customer create response.
   */
  export interface CustomerCreateResponseError
    extends ErrorResponse<ErrorCodeCustomers> {}

  /**
   * The successful customer create response.
   */
  export interface CustomerCreateResponseSuccess
    extends ResponseBase<Paddle.Customer, MetaBasic> {}

  //// Get a customer

  /**
   * The get customer response.
   */
  export type CustomerGetResponse =
    | CustomerGetResponseError
    | CustomerGetResponseSuccess;

  /**
   * The error response of getCustomer function.
   */
  export interface CustomerGetResponseError
    extends ErrorResponse<ErrorCodeShared> {}

  /**
   * The successful customer get response.
   */
  export interface CustomerGetResponseSuccess
    extends ResponseBase<Paddle.Customer, MetaBasic> {}

  ///

  /**
   * The order query.
   */
  export type OrderQuery<Type> = keyof Type extends string
    ? `${keyof Type}[ASC]` | `${keyof Type}[DESC]`
    : never;

  /**
   * The response object.
   */
  export interface ResponseBase<Data, Meta> {
    /** The response data object. */
    data: Data;
    /** Information about this response. */
    meta: Meta;
    /** The error object */
    error?: undefined;
  }

  /**
   * The basic response meta.
   */
  export interface MetaBasic {
    /** Unique ID for the request relating to this response. Provide this when
     * contacting Paddle support about a specific request. */
    request_id: string;
  }

  /**
   * The response meta object with pagination.
   */
  export interface MetaPaginated extends MetaBasic {
    /** Keys used for working with paginated results. */
    pagination: Pagination;
  }

  /**
   * Object containing keys for working with paginated results.
   */
  export interface Pagination {
    /** Number of entities per page for this response. May differ from
     * the number requested if the requested number is too high. */
    per_page: number;
    /** URL containing the query parameters of the original request, along with
     * the after parameter that marks the starting point of the next page.
     * Always returned, even if has_more is false. */
    next: string;
    /** Whether this response has another page. */
    has_more: boolean;
    /** Estimated number of entities for this response. */
    estimated_total: number;
  }

  /**
   * Make all properties in the type optional
   */
  export type Optional<Type> = {
    [Key in keyof Type]?: Type[Key] | undefined;
  };

  /**
   * Makes the specified fields optional.
   */
  export type MakeFieldsOptional<Type, Field extends keyof Type> = Omit<
    Type,
    Field
  > &
    Optional<Pick<Type, Field>>;

  /**
   * Lists keys that extend null.
   */
  type NullbleKeys<Type> = {
    [Key in keyof Type]: null extends Type[Key] ? Key : never;
  }[keyof Type];

  /**
   * Makes nullable fields optional
   */
  export type MakeNullableFieldsOptional<Type> = MakeFieldsOptional<
    Type,
    NullbleKeys<Type>
  >;
}
