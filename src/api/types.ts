import type { Paddle as Core } from "../types.js";
import type { PaddleUtils as Utils } from "../utils.js";

/**
 * The API Paddle types namespace. Contains all the types related to the API.
 */
export namespace PaddleAPI {
  /**
   * Function that returns the Paddle key.
   */
  export type ClientKeyFn = () => string;

  /**
   * The client interface that contains the authentication key and
   * the sandbox key.
   */
  export interface Client<_Def extends Core.CustomDataDef> {
    key: string | ClientKeyFn;
    sandbox?: boolean | undefined;
  }

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
   * The product's include map.
   */
  export type ProductResponseInclude = ResponseInclude<ProductInclude>;

  /**
   * The product's auto-assign fields.
   */
  export type ProductAutoAssignFields = "id" | "created_at";

  //// List products

  /**
   * The products list query.
   */
  export interface ProductsListQuery<
    Def extends Core.CustomDataDef,
    Include extends ProductResponseInclude | undefined
  > {
    /** Return entities after the specified cursor. Used for working through
     * paginated results. */
    after?: string | undefined;
    /** Return only the IDs specified. */
    id?: Core.ProductId | Core.ProductId[] | undefined;
    /** Include related entities in the response. */
    include?: Include;
    /** Order returned entities by the specified field and direction
     * [ASC] or [DESC]). */
    order_by?:
      | OrderQuery<Core.Product<Def>>
      | OrderQuery<Core.Product<Def>>[]
      | undefined;
    /** Set how many entities are returned per page. */
    per_page?: number | undefined;
    /** Return entities that match the specified status. */
    status?: Core.EntityStatus | Core.EntityStatus[] | undefined;
    /** Return entities that match the specified tax category. */
    tax_category?: Core.TaxCategory | undefined;
  }

  /**
   * The products list response.
   */
  export type ProductsListResponse<
    Def extends Core.CustomDataDef,
    Include extends ProductResponseInclude | undefined
  > = ProductsListResponseError | ProductsListResponseSuccess<Def, Include>;

  /**
   * The errored products list response.
   */
  export interface ProductsListResponseError
    extends ErrorResponse<ErrorCodeShared> {}

  /**
   * The successful products list response.
   */
  export interface ProductsListResponseSuccess<
    Def extends Core.CustomDataDef,
    Include extends ProductResponseInclude | undefined
  > extends ResponseBase<ProductsListDataItem<Def, Include>[], MetaPaginated> {}

  /**
   * The products list data item.
   */
  export interface ProductsListDataItem<
    Def extends Core.CustomDataDef,
    Include extends ProductResponseInclude | undefined
  > extends Core.Product<Def> {
    /** The product prices */
    prices: ResponseIncludedField<
      Include,
      "prices",
      Core.Price<Core.TimeInterval | null, Def>[]
    >;
  }

  //// Create a product

  /**
   * The create product body.
   */
  export type ProductCreateBody<Def extends Core.CustomDataDef> =
    Utils.MakeNullableFieldsOptional<
      Omit<Core.Product<Def>, ProductAutoAssignFields | "status">
    >;

  /**
   * The create product response.
   */
  export type ProductCreateResponse<Def extends Core.CustomDataDef> =
    | ProductCreateResponseError
    | ProductCreateResponseSuccess<Def>;

  /**
   * The errored product create response.
   */
  export interface ProductCreateResponseError
    extends ErrorResponse<ErrorCodeProducts> {}

  /**
   * The successful product create response.
   */
  export interface ProductCreateResponseSuccess<Def extends Core.CustomDataDef>
    extends ResponseBase<Core.Product<Def>, MetaBasic> {}

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
    Def extends Core.CustomDataDef,
    Include extends ProductInclude | undefined
  > = ProductGetResponseError | ProductGetResponseSuccess<Def, Include>;

  /**
   * The error response of getProduct function.
   */
  export interface ProductGetResponseError
    extends ErrorResponse<ErrorCodeShared> {}

  /**
   * The successful product get response.
   */
  export interface ProductGetResponseSuccess<
    Def extends Core.CustomDataDef,
    Include extends ProductInclude | undefined
  > extends ResponseBase<ProductGetData<Def, Include>, MetaBasic> {}

  /**
   * The get product data.
   */
  export interface ProductGetData<
    Def extends Core.CustomDataDef,
    Include extends ProductInclude | undefined
  > extends Core.Product<Def> {
    /** The product prices */
    prices: undefined extends Include
      ? never
      : Core.Price<Core.TimeInterval | null, Def>[];
  }

  //// Update a product

  /**
   * The update product body.
   */
  export type ProductUpdateBody<Def extends Core.CustomDataDef> =
    Utils.Optional<Omit<Core.Product<Def>, ProductAutoAssignFields>>;

  /**
   * The update product response.
   */
  export type ProductUpdateResponse<Def extends Core.CustomDataDef> =
    | ProductUpdateResponseError
    | ProductUpdateResponseSuccess<Def>;

  /**
   * The errored product update response.
   */
  export interface ProductUpdateResponseError
    extends ErrorResponse<ErrorCodeProducts> {}

  /**
   * The successful product update response.
   */
  export interface ProductUpdateResponseSuccess<Def extends Core.CustomDataDef>
    extends ResponseBase<Core.Product<Def>, MetaBasic> {}

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
    id?: Core.PriceId | Core.PriceId[] | undefined;
    /** Include related entities in the response. */
    include?: Include;
    /** Order returned entities by the specified field and direction
     * [ASC] or [DESC]). */
    order_by?: OrderQuery<Core.Price> | OrderQuery<Core.Price>[] | undefined;
    /** Set how many entities are returned per page. */
    per_page?: number | undefined;
    /** Return entities related to the specified product. */
    product_id?: Core.ProductId | Core.ProductId[] | undefined;
    /** Return entities that match the specified status. */
    status?: Core.EntityStatus | Core.EntityStatus[] | undefined;
    /** Determine whether returned entities are for recurring prices (true) or
     * one-time prices (false). */
    recurring?: boolean | undefined;
  }

  /**
   * The prices list response.
   */
  export type PricesListResponse<
    Def extends Core.CustomDataDef,
    Include extends PriceInclude | undefined
  > = PricesListResponseError | PricesListResponseSuccess<Def, Include>;

  /**
   * The errored prices list response.
   */
  export interface PricesListResponseError
    extends ErrorResponse<ErrorCodeShared> {}

  /**
   * The successful prices list response.
   */
  export interface PricesListResponseSuccess<
    Def extends Core.CustomDataDef,
    Include extends PriceInclude | undefined
  > extends ResponseBase<PricesListDataItem<Def, Include>[], MetaPaginated> {}

  /**
   * The prices list data item.
   */
  export interface PricesListDataItem<
    Def extends Core.CustomDataDef,
    Include extends PriceInclude | undefined
  > extends Core.Price<Core.TimeInterval | null, Def> {
    /** The related product object */
    product: undefined extends Include ? never : Core.Product<Def>;
  }

  /// Create a price

  /**
   * The create price body.
   */
  export type PriceCreateBody<Def extends Core.CustomDataDef> =
    Utils.MakeNullableFieldsOptional<
      Utils.MakeFieldsOptional<
        Omit<
          Core.Price<Core.TimeInterval | null, Def>,
          PriceAutoAssignFields | "status"
        >,
        "quantity"
      >
    >;

  /**
   * The create price response.
   */
  export type PriceCreateResponse<Def extends Core.CustomDataDef> =
    | PriceCreateResponseError
    | PriceCreateResponseSuccess<Def>;

  /**
   * The errored price create response.
   */
  export interface PriceCreateResponseError
    extends ErrorResponse<ErrorCodePrices> {}

  /**
   * The successful price create response.
   */
  export interface PriceCreateResponseSuccess<Def extends Core.CustomDataDef>
    extends ResponseBase<
      Core.Price<Core.TimeInterval | null, Def>,
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
    Def extends Core.CustomDataDef,
    Include extends PriceInclude | undefined
  > = PriceGetResponseError | PriceGetResponseSuccess<Def, Include>;

  /**
   * The error response of getPrice function.
   */
  export interface PriceGetResponseError
    extends ErrorResponse<ErrorCodeShared> {}

  /**
   * The successful price get response.
   */
  export interface PriceGetResponseSuccess<
    Def extends Core.CustomDataDef,
    Include extends PriceInclude | undefined
  > extends ResponseBase<PriceGetData<Def, Include>, MetaBasic> {}

  /**
   * The get price data.
   */
  export interface PriceGetData<
    Def extends Core.CustomDataDef,
    Include extends PriceInclude | undefined
  > extends Core.Price<Core.TimeInterval | null, Def> {
    /** The related product object */
    product: undefined extends Include ? never : Core.Product<Def>;
  }

  //// Update a price

  /**
   * The update price body.
   */
  export type PriceUpdateBody<Def extends Core.CustomDataDef> = Utils.Optional<
    Omit<Core.Price<Core.TimeInterval | null, Def>, PriceAutoAssignFields>
  >;

  /**
   * The update price response.
   */
  export type PriceUpdateResponse<Def extends Core.CustomDataDef> =
    | PriceUpdateResponseError
    | PriceUpdateResponseSuccess<Def>;

  /**
   * The errored price update response.
   */
  export interface PriceUpdateResponseError
    extends ErrorResponse<ErrorCodePrices> {}

  /**
   * The successful price update response.
   */
  export interface PriceUpdateResponseSuccess<Def extends Core.CustomDataDef>
    extends ResponseBase<
      Core.Price<Core.TimeInterval | null, Def>,
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
    id?: Core.DiscountId | Core.DiscountId[] | undefined;
    /** Order returned entities by the specified field and direction
     * ([ASC] or [DESC]). */
    order_by?:
      | OrderQuery<Core.Discount>
      | OrderQuery<Core.Discount>[]
      | undefined;
    /** Set how many entities are returned per page. */
    per_page?: number | undefined;
    /** Return entities that match the specified status. */
    status?: Core.DiscountStatus | Core.DiscountStatus[] | undefined;
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
    extends ResponseBase<Core.Discount[], MetaPaginated> {}

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
  export type DiscountCreateBody = Utils.MakeNullableFieldsOptional<
    Omit<Core.Discount, DiscountAutoAssignFields | "status">
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
    extends ResponseBase<Core.Discount, MetaBasic> {}

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
    extends ResponseBase<Core.Discount, MetaBasic> {}

  //// Update a discount

  /**
   * The update discount body.
   */
  export type DiscountUpdateBody = Utils.Optional<
    Utils.MakeNullableFieldsOptional<
      Omit<Core.Discount, DiscountAutoAssignFields>
    >
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
    extends ResponseBase<Core.Discount, MetaBasic> {}

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
  export interface CustomersListQuery<Def extends Core.CustomDataDef> {
    /** Return entities after the specified cursor. Used for working through
     * paginated results. */
    after?: string | undefined;
    /** Return only the IDs specified. */
    id?: Core.CustomerId | Core.CustomerId[] | undefined;
    /** Order returned entities by the specified field and direction
     * [ASC] or [DESC]). */
    order_by?: OrderQuery<Core.Customer<Def>> | undefined;
    /** Set how many entities are returned per page. */
    per_page?: number | undefined;
    /** Return entities that match a search query. Searches id, name, and email fields. */
    search?: string | undefined;
    /** Return entities that match the specified status. */
    status?: Core.EntityStatus | Core.EntityStatus[] | undefined;
  }

  /**
   * The customers list response.
   */
  export type CustomersListResponse<Def extends Core.CustomDataDef> =
    | CustomersListResponseError
    | CustomersListResponseSuccess<Def>;

  /**
   * The errored customers list response.
   */
  export interface CustomersListResponseError
    extends ErrorResponse<ErrorCodeShared> {}

  /**
   * The successful customers list response.
   */
  export interface CustomersListResponseSuccess<Def extends Core.CustomDataDef>
    extends ResponseBase<Core.Customer<Def>[], MetaPaginated> {}

  //// Create a customer

  /**
   * The create customer body.
   */
  export type CustomerCreateBody<Def extends Core.CustomDataDef> =
    Utils.MakeNullableFieldsOptional<
      Utils.MakeFieldsOptional<
        Omit<Core.Customer<Def>, CustomerAutoAssignFields | "status">,
        "locale"
      >
    >;

  /**
   * The create customer response.
   */
  export type CustomerCreateResponse<Def extends Core.CustomDataDef> =
    | CustomerCreateResponseError
    | CustomerCreateResponseSuccess<Def>;

  /**
   * The errored customer create response.
   */
  export interface CustomerCreateResponseError
    extends ErrorResponse<ErrorCodeCustomers> {}

  /**
   * The successful customer create response.
   */
  export interface CustomerCreateResponseSuccess<Def extends Core.CustomDataDef>
    extends ResponseBase<Core.Customer<Def>, MetaBasic> {}

  //// Get a customer

  /**
   * The get customer response.
   */
  export type CustomerGetResponse<Def extends Core.CustomDataDef> =
    | CustomerGetResponseError
    | CustomerGetResponseSuccess<Def>;

  /**
   * The error response of getCustomer function.
   */
  export interface CustomerGetResponseError
    extends ErrorResponse<ErrorCodeShared> {}

  /**
   * The successful customer get response.
   */
  export interface CustomerGetResponseSuccess<Def extends Core.CustomDataDef>
    extends ResponseBase<Core.Customer<Def>, MetaBasic> {}

  //// Update a customer

  /**
   * The update customer body.
   */
  export type CustomerUpdateBody<Def extends Core.CustomDataDef> =
    Utils.Optional<Omit<Core.Customer<Def>, CustomerAutoAssignFields>>;

  /**
   * The update customer response.
   */
  export type CustomerUpdateResponse<Def extends Core.CustomDataDef> =
    | CustomerUpdateResponseError
    | CustomerUpdateResponseSuccess<Def>;

  /**
   * The errored customer update response.
   */
  export interface CustomerUpdateResponseError
    extends ErrorResponse<ErrorCodeCustomers> {}

  /**
   * The successful customer update response.
   */
  export interface CustomerUpdateResponseSuccess<Def extends Core.CustomDataDef>
    extends ResponseBase<Core.Customer<Def>, MetaBasic> {}

  /// Addresses

  /**
   * The address's auto-assign fields.
   */
  export type AddressAutoAssignFields = "id" | "created_at" | "updated_at";

  //// List addresses for a customer

  /**
   * The customer's list addresses query.
   */
  export interface AddressListQuery<Def extends Core.CustomDataDef> {
    /** Return entities after the specified cursor. Used for working through
     * paginated results. */
    after?: string | undefined;
    /** Return only the IDs specified. */
    id?: Core.AddressId | Core.AddressId[] | undefined;
    /** Order returned entities by the specified field and direction
     * [ASC] or [DESC]. */
    order_by?:
      | OrderQuery<Core.Address<Def>>
      | OrderQuery<Core.Address<Def>>[]
      | undefined;
    /** Set how many entities are returned per page. */
    per_page?: number | undefined;
    /** Return entities that match a search query. Searches all fields except
     * status, created_at, and updated_at. */
    search?: string | undefined;
    /** Return entities that match the specified status. Use a comma
     * separated list to specify multiple status values. */
    status?: string | undefined;
  }

  /**
   * The list addresses response.
   */
  export type AddressListResponse<Def extends Core.CustomDataDef> =
    | AddressListResponseError
    | AddressListResponseSuccess<Def>;

  /**
   * The error response of list addresses function.
   */
  export interface AddressListResponseError
    extends ErrorResponse<ErrorCodeShared> {}

  /**
   * The successful list addresses response.
   */
  export interface AddressListResponseSuccess<Def extends Core.CustomDataDef>
    extends ResponseBase<Core.Address<Def>[], MetaPaginated> {}

  //// Create an address

  /**
   * The create address body.
   */
  export type AddressCreateBody<Def extends Core.CustomDataDef> =
    Utils.MakeNullableFieldsOptional<
      Omit<Core.Address<Def>, AddressAutoAssignFields | "status">
    >;

  /**
   * The create address response.
   */
  export type AddressCreateResponse<Def extends Core.CustomDataDef> =
    | AddressCreateResponseError
    | AddressCreateResponseSuccess<Def>;

  /**
   * The errored address create response.
   */
  export interface AddressCreateResponseError
    extends ErrorResponse<ErrorCodeAddresses> {}

  /**
   * The successful address create response.
   */
  export interface AddressCreateResponseSuccess<Def extends Core.CustomDataDef>
    extends ResponseBase<Core.Address<Def>, MetaBasic> {}

  //// Get an address

  /**
   * The get address response.
   */
  export type AddressGetResponse<Def extends Core.CustomDataDef> =
    | AddressGetResponseError
    | AddressGetResponseSuccess<Def>;

  /**
   * The error response of getAddress function.
   */
  export interface AddressGetResponseError
    extends ErrorResponse<ErrorCodeShared> {}

  /**
   * The successful address get response.
   */
  export interface AddressGetResponseSuccess<Def extends Core.CustomDataDef>
    extends ResponseBase<Core.Address<Def>, MetaBasic> {}

  //// Update an address

  /**
   * Address update body.
   */
  export type AddressUpdateBody<Def extends Core.CustomDataDef> =
    Utils.Optional<Omit<Core.Address<Def>, AddressAutoAssignFields>>;

  /**
   * The update address response.
   */
  export type AddressUpdateResponse<Def extends Core.CustomDataDef> =
    | AddressUpdateResponseError
    | AddressUpdateResponseSuccess<Def>;

  /**
   * The error response of the updateAddress function.
   */
  export interface AddressUpdateResponseError
    extends ErrorResponse<ErrorCodeAddresses> {}

  /**
   * The successful address update response.
   */
  export interface AddressUpdateResponseSuccess<Def extends Core.CustomDataDef>
    extends ResponseBase<Core.Address<Def>, MetaBasic> {}

  /// Businesses

  /**
   * The price's auto-assign fields.
   */
  export type BusinessAutoAssignFields = "id" | "created_at" | "updated_at";

  //// List businesses

  /**
   * The businesses list query.
   */
  export interface BusinessesListQuery<Def extends Core.CustomDataDef> {
    /** Return entities after the specified cursor. Used for working through
     * paginated results. */
    after?: string | undefined;
    /** Return only the IDs specified. */
    id?: Core.BusinessId | Core.BusinessId[] | undefined;
    /** Order returned entities by the specified field and direction
     * [ASC] or [DESC]). */
    order_by?:
      | OrderQuery<Core.Business<Def>>
      | OrderQuery<Core.Business<Def>>[]
      | undefined;
    /** Set how many entities are returned per page. */
    per_page?: number | undefined;
    /** Return entities that match a search query. Searches all fields,
     * including contacts, except status, created_at, and updated_at. */
    search?: string | undefined;
    /** Return entities that match the specified status. */
    status?: Core.EntityStatus | Core.EntityStatus[] | undefined;
  }

  /**
   * The businesses list response.
   */
  export type BusinessesListResponse<Def extends Core.CustomDataDef> =
    | BusinessesListResponseError
    | BusinessesListResponseSuccess<Def>;

  /**
   * The errored businesses list response.
   */
  export interface BusinessesListResponseError
    extends ErrorResponse<ErrorCodeShared> {}

  /**
   * The successful businesses list response.
   */
  export interface BusinessesListResponseSuccess<Def extends Core.CustomDataDef>
    extends ResponseBase<Core.Business<Def>[], MetaPaginated> {}

  //// Create Business

  /**
   * The create business request body.
   */
  export type BusinessCreateBody<Def extends Core.CustomDataDef> =
    Utils.MakeNullableFieldsOptional<
      Omit<Core.Business<Def>, BusinessAutoAssignFields | "status">
    >;

  /**
   * The create business response.
   */
  export type BusinessCreateResponse<Def extends Core.CustomDataDef> =
    | BusinessCreateResponseError
    | BusinessCreateResponseSuccess<Def>;

  /**
   * The errored create business response.
   */
  export interface BusinessCreateResponseError
    extends ErrorResponse<ErrorCodeShared> {}

  /**
   * The successful create business response.
   */
  export interface BusinessCreateResponseSuccess<Def extends Core.CustomDataDef>
    extends ResponseBase<Core.Business<Def>, MetaBasic> {}

  //// Get a business

  /**
   * The response for getBusiness function.
   */
  export type BusinessGetResponse<Def extends Core.CustomDataDef> =
    | BusinessGetResponseError
    | BusinessGetResponseSuccess<Def>;

  /**
   * The error response for getBusiness function.
   */
  export interface BusinessGetResponseError
    extends ErrorResponse<ErrorCodeShared> {}

  /**
   * The successful response for getBusiness function.
   */
  export interface BusinessGetResponseSuccess<Def extends Core.CustomDataDef>
    extends ResponseBase<Core.Business<Def>, MetaBasic> {}

  //// Update a business

  /**
   * The update business body.
   */
  export type BusinessUpdateBody<Def extends Core.CustomDataDef> =
    Utils.Optional<Omit<Core.Business<Def>, BusinessAutoAssignFields>>;

  /**
   * The update business response.
   */
  export type BusinessUpdateResponse<Def extends Core.CustomDataDef> =
    | BusinessUpdateResponseError
    | BusinessUpdateResponseSuccess<Def>;

  /**
   * The errored business update response.
   */
  export interface BusinessUpdateResponseError
    extends ErrorResponse<ErrorCodeShared> {}

  /**
   * The successful business update response.
   */
  export interface BusinessUpdateResponseSuccess<Def extends Core.CustomDataDef>
    extends ResponseBase<Core.Business<Def>, MetaBasic> {}

  /// Transactions

  /**
   * The transaction includes.
   */
  export type TransactionInclude =
    | "address"
    | "adjustment"
    | "adjustments_totals"
    | "business"
    | "customer"
    | "discount";

  /**
   * The transactions's include map.
   */
  export type TransactionResponseInclude = ResponseInclude<TransactionInclude>;

  /**
   * Transaction's auto-assign fields.
   */
  export type TransactionAutoAssignFields =
    | "id"
    | "origin"
    | "subscription_id"
    | "invoice_id"
    | "invoice_number"
    | "details"
    | "checkout"
    | "created_at"
    | "updated_at"
    | "billed_at";

  /**
   * Represents a transaction response entity with included entities.
   */
  export interface TransactionWithIncluded<
    Def extends Core.CustomDataDef,
    BillingCycle extends Core.TimeInterval | null,
    Include extends TransactionResponseInclude | undefined
  > extends Core.Transaction<BillingCycle, Def> {
    /** The address object related to the transaction */
    address: ResponseIncludedField<Include, "address", Core.Address<Def>>;
    /** The array of adjustments related to the transaction */
    adjustment: ResponseIncludedField<Include, "adjustment", Core.Adjustment[]>;
    /** The object that includes totals for all adjustments against the transaction */
    adjustments_totals: ResponseIncludedField<
      Include,
      "adjustments_totals",
      Core.AdjustmentsTotals
    >;
    /** The business object related to the transaction */
    business: ResponseIncludedField<Include, "business", Core.Business<Def>>;
    /** The customer object related to the transaction */
    customer: ResponseIncludedField<Include, "customer", Core.Customer<Def>>;
    /** The discount object related to the transaction */
    discount: ResponseIncludedField<Include, "discount", Core.Discount>;
  }

  //// List transactions

  /**
   * The transactions list query.
   */
  export interface TransactionsListQuery<
    Def extends Core.CustomDataDef,
    Include extends TransactionResponseInclude | undefined
  > {
    /** Return entities after the specified cursor. Used for working through
     * paginated results. */
    after?: string | undefined;
    /** Return entities billed at a specific time. Pass an RFC 3339 datetime
     * string, or use [LT] (less than), [LTE] (less than or equal to),
     * [GT] (greater than), or [GTE] (greater than or equal to) operators.
     * For example, billed_at=2023-04-18T17:03:26 or
     * billed_at[LT]=2023-04-18T17:03:26. */
    billed_at?: OperatorQuery | undefined;
    /** Return entities that match the specified collection mode. */
    collection_mode?: Core.CollectionMode | undefined;
    /** Return entities created at a specific time */
    created_at?: string | undefined;
    /** Return entities related to the specified customer */
    customer_id?: Core.CustomerId | Core.CustomerId[] | undefined;
    /** Return only the IDs specified */
    id?: Core.TransactionId | Core.TransactionId[] | undefined;
    /** Include related entities in the response */
    include?: Include;
    /** Return entities that match the invoice number */
    invoice_number?: string | string[] | undefined;
    /** Order returned entities by the specified field and direction */
    order_by?:
      | OrderQuery<Core.Transaction<Core.TimeInterval | null, Def>>
      | OrderQuery<Core.Transaction<Core.TimeInterval | null, Def>>[]
      | undefined;
    /** Return entities that match the specified status */
    status?: Core.TransactionStatus | Core.TransactionStatus[] | undefined;
    /** Return entities related to the specified subscription */
    subscription_id?: Core.SubscriptionId | Core.SubscriptionId[] | undefined;
    /** Set how many entities are returned per page */
    per_page?: number | undefined;
    /** Return entities updated at a specific time */
    updated_at?: OperatorQuery | undefined;
  }

  /**
   * The transactions list response.
   */
  export type TransactionsListResponse<
    Def extends Core.CustomDataDef,
    Include extends TransactionResponseInclude | undefined
  > =
    | TransactionsListResponseError
    | TransactionsListResponseSuccess<Def, Include>;

  /**
   * The errored transactions list response.
   */
  export interface TransactionsListResponseError
    extends ErrorResponse<ErrorCodeShared> {}

  /**
   * The successful transactions list response.
   */
  export interface TransactionsListResponseSuccess<
    Def extends Core.CustomDataDef,
    Include extends TransactionResponseInclude | undefined
  > extends ResponseBase<
      TransactionWithIncluded<Def, Core.TimeInterval | null, Include>[],
      MetaPaginated
    > {}

  //// Create a transaction

  /**
   * The create transaction query.
   */
  export interface TransactionCreateQuery<
    Include extends TransactionResponseInclude | undefined
  > {
    include?: Include;
  }

  /**
   * The create transaction body.
   */
  export type TransactionCreateBody<Def extends Core.CustomDataDef> =
    Utils.MakeNullableFieldsOptional<
      Omit<
        Core.Transaction<Core.TimeInterval | null, Def>,
        TransactionAutoAssignFields | "status" | "payments"
      >
    > & {
      /** Status of this transaction. */
      status?: "billed" | undefined;
    };

  /**
   * The create transaction response.
   */
  export type TransactionCreateResponse<
    Def extends Core.CustomDataDef,
    Include extends PaddleAPI.TransactionResponseInclude | undefined
  > =
    | TransactionCreateResponseError
    | TransactionCreateResponseSuccess<Def, Include>;

  /**
   * The errored transaction create response.
   */
  export interface TransactionCreateResponseError
    extends ErrorResponse<ErrorCodeTransactions> {}

  /**
   * The successful transaction create response.
   */
  export interface TransactionCreateResponseSuccess<
    Def extends Core.CustomDataDef,
    Include extends PaddleAPI.TransactionResponseInclude | undefined
  > extends ResponseBase<
      TransactionWithIncluded<Def, Core.TimeInterval | null, Include>,
      MetaBasic
    > {}

  //// Get a transaction

  /**
   * The get transaction query.
   */
  export interface TransactionGetQuery<
    Include extends TransactionResponseInclude | undefined
  > {
    /** Include related entities in the response. */
    include?: Include;
  }

  /**
   * The get transaction response.
   */
  export type TransactionGetResponse<
    Def extends Core.CustomDataDef,
    Include extends TransactionResponseInclude | undefined
  > = TransactionGetResponseError | TransactionGetResponseSuccess<Def, Include>;

  /**
   * The error response of getTransaction function.
   */
  export interface TransactionGetResponseError
    extends ErrorResponse<ErrorCodeShared> {}

  /**
   * The successful transaction get response.
   */
  export interface TransactionGetResponseSuccess<
    Def extends Core.CustomDataDef,
    Include extends TransactionResponseInclude | undefined
  > extends ResponseBase<
      TransactionWithIncluded<Def, Core.TimeInterval | null, Include>,
      MetaBasic
    > {}

  //// Update a transaction

  /**
   * The update transaction body.
   */
  export type TransactionUpdateBody<Def extends Core.CustomDataDef> =
    Utils.Optional<
      Omit<
        Core.Transaction<Core.TimeInterval | null, Def>,
        TransactionAutoAssignFields | "status"
      >
    > & {
      /** Status of this transaction. */
      status?: "billed" | "canceled" | undefined;
    };

  /**
   * The update transaction response.
   */
  export type TransactionUpdateResponse<Def extends Core.CustomDataDef> =
    | TransactionUpdateResponseError
    | TransactionUpdateResponseSuccess<Def>;

  /**
   * The errored transaction update response.
   */
  export interface TransactionUpdateResponseError
    extends ErrorResponse<ErrorCodeTransactions> {}

  /**
   * The successful transaction update response.
   */
  export interface TransactionUpdateResponseSuccess<
    Def extends Core.CustomDataDef
  > extends ResponseBase<Core.Transaction<Core.TimeInterval, Def>, MetaBasic> {}

  //// Preview a transaction

  /**
   * The transacation preview fields.
   */
  export type PreviewTransactionFields =
    | PreviewTransactionFieldsOptional
    | "items";

  /**
   * The optional transacation preview fields.
   */
  export type PreviewTransactionFieldsOptional =
    | "customer_id"
    | "address_id"
    | "business_id"
    | "currency_code"
    | "discount_id";

  /**
   * The payload for previewing a transaction.
   */
  export type TransactionPreviewBody<Def extends Core.CustomDataDef> =
    Utils.MakeFieldsOptional<
      Pick<
        Core.Transaction<Core.TimeInterval | null, Def>,
        PreviewTransactionFields
      >,
      PreviewTransactionFieldsOptional
    > & {
      /** IP address for this transaction preview. */
      customer_ip_address?: string | null;
      /** Address object to be used for the transaction preview. */
      address?: object | null;
      /** Determines whether trials should be ignored in transaction
       * preview calculations. */
      ignore_trials?: boolean;
    };

  /**
   * The response of the transaction preview API.
   */
  export type TransactionPreviewResponse<Def extends Core.CustomDataDef> =
    | TransactionPreviewResponseError
    | TransactionPreviewResponseSuccess<Def>;

  /**
   * The error response of transaction preview API.
   */
  export interface TransactionPreviewResponseError
    extends ErrorResponse<ErrorCodeShared> {}

  /**
   * The successful response of transaction preview API.
   */
  export interface TransactionPreviewResponseSuccess<
    Def extends Core.CustomDataDef
  > extends ResponseBase<
      Core.Transaction<Core.TimeInterval | null, Def>,
      MetaBasic
    > {}

  /// Invoices

  //// Get an invoice

  /**
   * The get invoice response.
   */
  export type InvoiceGetResponse =
    | InvoiceGetResponseError
    | InvoiceGetResponseSuccess;

  /**
   * The errored get invoice response.
   */
  export interface InvoiceGetResponseError
    extends ErrorResponse<ErrorCodeShared> {}

  /**
   * The successful get invoice response.
   */
  export interface InvoiceGetResponseSuccess
    extends ResponseBase<InvoiceGetData, MetaBasic> {}

  /**
   * The get invoice data.
   */
  export interface InvoiceGetData {
    /** URL of the invoice PDF. */
    url: string;
  }

  /// Subscriptions

  /**
   * When the charge takes effect.
   */
  export type SubscriptionChargeEffectiveFrom =
    | "next_billing_period" // Bill for one-time charges on the next billing period. Paddle adds the charges to the transaction created when the subscription next renews.
    | "immediately"; // Bill for one-time charges on the next billing period. Paddle adds the charges to the transaction created when the subscription next renews.

  /**
   * Preview of a transaction.
   */
  export interface SubscriptionDataTransaction<Def extends Core.CustomDataDef> {
    /** Billing period for the next transaction. */
    billing_period: Core.TimePeriod;
    /** Calculated totals for a transaction preview, including discounts, tax,
     * and currency conversion. Considered the source of truth for totals on
     * a transaction preview. */
    details: SubscriptionDataTransactionDetails<Def>;
    /** Not documented. TODO: Request documentation from Paddle. */
    adjustments: unknown[];
  }

  /**
   * Transaction preview details.
   */
  export interface SubscriptionDataTransactionDetails<
    Def extends Core.CustomDataDef
  > {
    /** List of tax rates applied to this transaction preview. */
    tax_rates_used: Core.TaxRate[];
    /** Breakdown of the total for a transaction preview. fee and earnings
     * always return null for transaction previews. */
    totals: SubscriptionDataTransactionTotals;
    /** Information about line items for this transaction preview. Different
     * from transaction preview items as they include totals calculated
     * by Paddle. Considered the source of truth for line item totals. */
    line_items: SubscriptionDataTransactionLineItem<Def>[];
  }

  /**
   * Breakdown of the total for a transaction.
   */
  export interface SubscriptionDataTransactionTotals extends Core.TotalsBase {
    /** Total discount as a result of any discounts applied. Except
     * for percentage discounts, Paddle applies tax to discounts based on
     * the line item price.tax_mode. If price.tax_mode for a line item
     * is internal, Paddle removes tax from the discount applied. */
    discount: string;
    /** Total credit applied to this transaction. This includes credits applied
     * using a customer's credit balance and adjustments to a billed
     * transaction. */
    credit: string;
    /** Total due on a transaction after credits and any payments. */
    balance: string;
    /** Total due on a transaction after credits but before any payments. */
    grand_total: string;
    /** Total fee taken by Paddle for this transaction. null until
     * the transaction is completed and the fee is processed. */
    fee: string | null;
    /** Total earnings for this transaction. This is the total minus
     * the Paddle fee. null until the transaction is completed and the fee
     * is processed. */
    earnings: string | null;
  }

  /**
   * Information about line items for this transaction preview.
   */
  export interface SubscriptionDataTransactionLineItem<
    Def extends Core.CustomDataDef
  > {
    /** Paddle ID for the price related to this transaction line item */
    price_id: Core.PriceId;
    /** Quantity of this transaction line item */
    quantity: number;
    /** Rate used to calculate tax for this transaction line item */
    tax_rate: string;
    /** Breakdown of the charge for one unit in the lowest denomination of
     * a curreny (e.g. cents for USD) */
    unit_totals: Core.TotalsWithDiscount;
    /** Breakdown of a charge in the lowest unit of a currency
     * (e.g. cents for USD) */
    totals: Core.TotalsWithDiscount;
    /** Related product entity for this trasaction line item price */
    product: Core.Product<Def>;
  }

  //// List subscriptions

  /**
   * The subscriptions list query.
   */
  export interface SubscriptionsListQuery<Def extends Core.CustomDataDef> {
    /** Return entities after the specified cursor. Used for working through
     * paginated results. */
    after?: string | undefined;
    /** Return entities related to the specified customer. */
    customer_id?: Core.CustomerId | Core.CustomerId[] | undefined;
    /** Order returned entities by the specified field and direction
     * [ASC] or [DESC]). */
    order_by?:
      | OrderQuery<
          Core.Subscription<Core.CollectionMode, Core.TimeInterval | null, Def>
        >
      | OrderQuery<
          Core.Subscription<Core.CollectionMode, Core.TimeInterval | null, Def>
        >[]
      | undefined;
    /** Set how many entities are returned per page. */
    per_page?: number | undefined;
    /** Return entities related to the specified price. */
    price_id?: Core.PriceId | Core.PriceId[] | undefined;
    /** Return entities that match the specified status. */
    status?: Core.SubscriptionStatus | Core.SubscriptionStatus[] | undefined;
  }

  /**
   * The Subscriptions list response.
   */
  export type SubscriptionsListResponse<Def extends Core.CustomDataDef> =
    | SubscriptionsListResponseError
    | SubscriptionsListResponseSuccess<Def>;

  /**
   * The errored subscriptions list response.
   */
  export interface SubscriptionsListResponseError
    extends ErrorResponse<ErrorCodeShared> {}

  /**
   * The successful subscriptions list response.
   */
  export interface SubscriptionsListResponseSuccess<
    Def extends Core.CustomDataDef
  > extends ResponseBase<
      Core.Subscription<Core.CollectionMode, Core.TimeInterval | null, Def>[],
      MetaPaginated
    > {}

  //// Get subscription

  /**
   * The subscription get's include query.
   */
  export type SubscriptionGetInclude =
    | "next_transaction"
    | "recurring_transaction_details";

  /**
   * The subscription get's include map.
   */
  export type SubscriptionGetResponseInclude =
    ResponseInclude<SubscriptionGetInclude>;

  export interface SubscriptionGetQuery<
    Include extends SubscriptionGetResponseInclude | undefined
  > {
    /** Include related entities in the response. */
    include?: Include;
  }

  /**
   * The get subscription response.
   */
  export type SubscriptionGetResponse<
    Def extends Core.CustomDataDef,
    Include extends SubscriptionGetResponseInclude | undefined
  > =
    | SubscriptionGetResponseError
    | SubscriptionGetResponseSuccess<Def, Include>;

  /**
   * The error response of getProduct function.
   */
  export interface SubscriptionGetResponseError
    extends ErrorResponse<ErrorCodeShared> {}

  /**
   * The successful subscription get response.
   */
  export interface SubscriptionGetResponseSuccess<
    Def extends Core.CustomDataDef,
    Include extends SubscriptionGetResponseInclude | undefined
  > extends ResponseBase<SubscriptionGetData<Def, Include>, MetaBasic> {}

  /**
   * The subscription get data.
   */
  export interface SubscriptionGetData<
    Def extends Core.CustomDataDef,
    Include extends SubscriptionGetResponseInclude | undefined
  > extends Core.Subscription<
      Core.CollectionMode,
      Core.TimeInterval | null,
      Def
    > {
    /** Preview of the next transaction for this subscription. May include
     * prorated charges that are not yet billed and one-time charges.
     * Returned when the include parameter is used with the next_transaction
     * value. null if the subscription is scheduled to cancel or pause. */
    next_transaction: ResponseIncludedField<
      Include,
      "next_transaction",
      SubscriptionDataTransaction<Def>
    >;
    /** Preview of the recurring transaction for this subscription. This is what
     * the customer can expect to be billed when there are no prorated or
     * one-time charges. Returned when the include parameter is used with
     * the recurring_transaction_details value.  */
    recurring_transaction_details: ResponseIncludedField<
      Include,
      "recurring_transaction_details",
      SubscriptionDataTransactionDetails<Def>
    >;
  }

  //// Update subscription

  /**
   * The subscription auto-assign fields.
   */
  export type SubscriptionUpdateAutoAssignFields =
    | "id"
    | "status"
    | "created_at"
    | "updated_at"
    | "started_at"
    | "first_billed_at"
    | "paused_at"
    | "canceled_at"
    | "current_billing_period"
    | "billing_cycle"
    | "management_urls";

  /**
   * The update subscription body.
   */
  export type SubscriptionUpdateBody<Def extends Core.CustomDataDef> =
    Utils.Optional<
      Omit<
        Core.Subscription<Core.CollectionMode, Core.TimeInterval | null, Def>,
        SubscriptionUpdateAutoAssignFields
      >
    >;

  /**
   * The update subscription response.
   */
  export type SubscriptionUpdateResponse<Def extends Core.CustomDataDef> =
    | SubscriptionUpdateResponseError
    | SubscriptionUpdateResponseSuccess<Def>;

  /**
   * The errored subscription update response.
   */
  export interface SubscriptionUpdateResponseError
    extends ErrorResponse<ErrorCodeSubscriptions> {}

  /**
   * The successful subscription update response.
   */
  export interface SubscriptionUpdateResponseSuccess<
    Def extends Core.CustomDataDef
  > extends ResponseBase<
      Core.Subscription<Core.CollectionMode, Core.TimeInterval | null, Def>,
      MetaBasic
    > {}

  //// Preview update transaction

  /**
   * The preview update subscription response.
   */
  export type SubscriptionPreviewUpdateResponse<
    Def extends Core.CustomDataDef
  > = SubscriptionUpdateResponseError | SubscriptionUpdateResponseSuccess<Def>;

  /**
   * The errored subscription preview update response.
   */
  export interface SubscriptionPreviewUpdateResponseError
    extends ErrorResponse<ErrorCodeSubscriptions> {}

  /**
   * The successful subscription preview update response.
   */
  export interface SubscriptionPreviewUpdateResponseSuccess<
    Def extends Core.CustomDataDef
  > extends ResponseBase<
      SubscriptionPreviewUpdateResponseData<Def>,
      MetaBasic
    > {}

  /**
   * The preview update subscription data.
   */
  export interface SubscriptionPreviewUpdateResponseData<
    Def extends Core.CustomDataDef
  > extends Omit<
      Core.Subscription<Core.CollectionMode, Core.TimeInterval | null, Def>,
      "id"
    > {
    /** Preview of the immediate transaction created as a result of changes
     * to the subscription. Returns a complete object where
     * proration_billing_mode is prorated_immediately or full_immediately;
     * null otherwise. */
    immediate_transaction: SubscriptionDataTransaction<
      Core.ResolveCustomData<Def>
    > | null;
    /** Preview of the next transaction for this subscription. Includes charges
     * created where proration_billing_mode is prorated_next_billing_period or
     * full_next_billing_period, as well as one-time charges. null if
     * the subscription is scheduled to cancel or pause. */
    next_transaction: SubscriptionDataTransaction<
      Core.ResolveCustomData<Def>
    > | null;
    /** Preview of the recurring transaction for this subscription. This is what
     * the customer can expect to be billed when there are no prorated or
     * one-time charges. */
    recurring_transaction_details: SubscriptionDataTransactionDetails<
      Core.ResolveCustomData<Def>
    >;
    /** Impact of this subscription change. Includes whether the change results
     * in a charge or credit, and totals for prorated amounts. */
    update_summary: SubscriptionPreviewUpdateDataSummary | null;
  }

  /**
   * Impact of this subscription change.
   */
  export interface SubscriptionPreviewUpdateDataSummary {
    /** Details of any credit adjustments. Paddle creates adjustments against
     * existing transactions when prorating. */
    credit: Core.UnitPrice;
    /** Details of the transaction to be created for this update. Paddle
     * creates a transaction to bill for new charges. */
    charge: Core.UnitPrice;
    /** Details of the result of credits and charges. Where the total of any
     * credit adjustments is greater than the total charge, the result is
     * a prorated credit; otherwise, the result is a prorated charge. */
    result: SubscriptionPreviewUpdateDataResult;
  }

  /**
   * Result of a subscription preview update.
   */
  export interface SubscriptionPreviewUpdateDataResult {
    /** Whether the subscription change results in a prorated credit or
     * a charge. */
    action: SubscriptionPreviewUpdateDataResultAction;
    /** Three-letter ISO 4217 currency code for the transaction or
     * adjustment. */
    currency_code: Core.CurrencyCode;
  }

  /**
   * Result actuib of a subscription preview update.
   */
  export type SubscriptionPreviewUpdateDataResultAction =
    | "credit" // Changes to the subscription results in a prorated credit.
    | "charge"; // Changes to the subscription results in a prorated charge.

  //// Update payment method transaction

  /**
   * The update payment method transaction response.
   */
  export type UpdatePaymentMethodTransactionResponse<
    Def extends Core.CustomDataDef
  > =
    | UpdatePaymentMethodTransactionResponseError
    | UpdatePaymentMethodTransactionSuccess<Def>;

  /**
   * The errored update payment method transaction response.
   */
  export interface UpdatePaymentMethodTransactionResponseError
    extends ErrorResponse<ErrorCodeSubscriptions> {}

  /**
   * The successful update payment method transaction response.
   */
  export interface UpdatePaymentMethodTransactionSuccess<
    Def extends Core.CustomDataDef
  > extends ResponseBase<
      Core.Transaction<Core.TimeInterval | null, Def>,
      MetaBasic
    > {}

  //// Pause subscription

  /**
   * The pause subscription body.
   */
  export interface SubscriptionPauseBody {
    /** When this scheduled change should take effect from. immediately is
     * only allowed when canceling or resuming a paused subscription. */
    effective_from?: SubscriptionChargeEffectiveFrom | null;
    /** RFC 3339 datetime string of when the paused subscription should resume.
     * Omit to pause indefinitely until resumed. */
    resume_at?: string | null;
  }

  //// Resume subscription

  /**
   * The resume subscription body.
   */
  export interface SubscriptionResumeBody {
    /** When this scheduled change should take effect from.
     *
     * You can pass:
     * - A timestamp following the RFC 3339 standard of when the subscription
     *   should resume. Valid where subscriptions are active with a scheduled
     *   change to pause, or where they have the status of paused.
     * - "next_billing_period" to resume on the next billing period. Valid where
     *   subscriptions are active with a scheduled change to pause.
     * - "immediately" to resume immediately. Valid where subscriptions have
     *   the status of paused.
     *
     * If a subscription has the status paused, you may omit to resume
     * immediately. */
    effective_from: SubscriptionChargeEffectiveFrom | (string & {}) | null;
  }

  //// Cancel subscription

  /**
   * Cancel subscription body.
   */
  export interface CancelSubscriptionRequestBody {
    /** When this scheduled change should take effect from. immediately is only
     * allowed when canceling or resuming a paused subscription. */
    effective_from?: SubscriptionChargeEffectiveFrom | null;
  }

  /// One-time charges

  /**
   * The item to add for billing.
   */
  export interface ChargeBillingItem {
    /** Price entity's Paddle ID to charge for. Must be a non-recurring price. */
    price_id: Core.PriceId;
    /** Quantity to charge for. */
    quantity: number;
  }

  //// Create one-time charge

  /**
   * The create charge body.
   */
  export interface ChargeCreateBody {
    /** When one-time charges should be billed. */
    effective_from: SubscriptionChargeEffectiveFrom;
    /** The items to charge according to their quantity. Corresponds to
     * non-recurring price entities (i.e., items where the billing_cycle
     * is null). */
    items: ChargeBillingItem[];
  }

  /// Adjustments

  //// List adjustments

  /**
   * Represents list adjustments query.
   */
  export interface AdjustmentsListQuery {
    /** Return entities for the specified action. */
    action?: Core.AdjustmentAction | undefined;
    /** Return entities after the specified cursor. Used for working through paginated results. */
    after?: string | undefined;
    /** Return entities related to the specified customer. Use a comma-separated list to specify multiple customer IDs. */
    customer_id?: Core.CustomerId | Core.CustomerId[] | undefined;
    /** Order returned entities by the specified field and direction ([ASC] or [DESC]). */
    order_by?:
      | OrderQuery<Core.Adjustment>
      | OrderQuery<Core.Adjustment>[]
      | undefined;
    /** Set how many entities are returned per page. */
    per_page?: number | undefined;
    /** Return entities that match the specified status. Use a comma-separated list to specify multiple status values. */
    status?: Core.AdjustmentStatus | Core.AdjustmentStatus[] | undefined;
    /** Return entities related to the specified subscription. Use a comma-separated list to specify multiple subscription IDs. */
    subscription_id?: Core.SubscriptionId | Core.SubscriptionId[] | undefined;
    /** Return entities related to the specified transaction. Use a comma-separated list to specify multiple transaction IDs. */
    transaction_id?: Core.TransactionId | Core.TransactionId[] | undefined;
    /** Return only the IDs specified. Use a comma separated list to get multiple entities. */
    id?: Core.AdjustmentId | Core.AdjustmentId[] | undefined;
  }

  /**
   * Represents list adjustments response.
   */
  export type AdjustmentsListResponse =
    | AdjustmentsListResponseError
    | AdjustmentsListResponseSuccess;

  /**
   * Represents list adjustments error response.
   */
  export interface AdjustmentsListResponseError
    extends ErrorResponse<ErrorCodeShared> {}

  /**
   * Represents list adjustments success response.
   */
  export interface AdjustmentsListResponseSuccess
    extends ResponseBase<Core.Adjustment[], MetaPaginated> {}

  //// Create adjustment

  /**
   * The create adjustment auto-assign fields.
   */
  export type AdjustmentCreateAutoAssignFields =
    | "id"
    | "subscription_id"
    | "customer_id"
    | "credit_applied_to_balance"
    | "currency_code"
    | "status"
    | "totals"
    | "payout_totals"
    | "created_at"
    | "updated_at";

  /**
   * The create adjustment body.
   */
  export type AdjustmentCreateBody = Utils.MakeNullableFieldsOptional<
    Omit<Core.Adjustment, AdjustmentCreateAutoAssignFields>
  >;

  /**
   * The create adjustment response.
   */
  export type AdjustmentCreateResponse =
    | AdjustmentCreateResponseError
    | AdjustmentCreateResponseSuccess;

  /**
   * The errored adjustment create response.
   */
  export interface AdjustmentCreateResponseError
    extends ErrorResponse<ErrorCodeAdjustments> {}

  /**
   * The successful adjustment create response.
   */
  export interface AdjustmentCreateResponseSuccess
    extends ResponseBase<Core.Adjustment, MetaBasic> {}

  /// Pricing preview

  //// Preview prices

  /**
   * The Request body for pricing-previews.
   */
  export interface PreviewPricesBody {
    /** List of items to preview price calculations for. */
    items: PreviewPricesItem[];
  }

  /**
   * Pricing item to preview calculation for.
   */
  interface PreviewPricesItem {
    /** Paddle ID for the price to add to this transaction, prefixed with pri_. */
    price_id: Core.PriceId;
    /** Quantity of the item. */
    quantity: number;
    /** Paddle ID of the customer, prefixed with ctm_. */
    customer_id?: Core.CustomerId | null;
    /** Paddle ID of the address, prefixed with add_. */
    address_id?: Core.AddressId | null;
    /** Paddle ID of the business, prefixed with biz_. */
    business_id?: Core.BusinessId | null;
    /** Supported three-letter ISO 4217 currency code. */
    currency_code?: string;
    /** Paddle ID of the discount applied, prefixed with dsc_. */
    discount_id?: Core.DiscountId | null;
    /** Address for this preview. */
    address?: Core.PricingPreviewAddress | null;
    /** IP address for transaction preview. */
    customer_ip_address?: string | null;
  }

  /**
   * Represents pricing previews response.
   */
  export type PreviewPricesResponse<Def extends Core.CustomDataDef> =
    | PreviewPricesResponseError
    | PreviewPricesResponseSuccess<Def>;

  /**
   * Represents pricing previews error response.
   */
  export interface PreviewPricesResponseError
    extends ErrorResponse<ErrorCodeShared> {}

  /**
   * Represents pricing previews success response.
   */
  export interface PreviewPricesResponseSuccess<Def extends Core.CustomDataDef>
    extends ResponseBase<Core.PricingPreview<Def>, MetaBasic> {}

  /// Event types

  //// List event types

  /**
   * The list event types response.
   */
  export type EventTypesListResponse =
    | EventTypesListResponseError
    | EventTypesListResponseSuccess;

  /**
   * The errored list event types response.
   */
  export interface EventTypesListResponseError
    extends ErrorResponse<ErrorCodeSubscriptions> {}

  /**
   * The successful list event types response.
   */
  export interface EventTypesListResponseSuccess
    extends ResponseBase<Core.EventType[], MetaBasic> {}

  /// Events

  //// List events

  /**
   * The event list query.
   */
  export interface EventsListQuery {
    /** Return entities after the specified cursor. Used for working through paginated results. */
    after?: string | undefined;
    /** Order returned entities by the specified field and direction ([ASC] or [DESC]). */
    order_by?: string | undefined;
    /** Set how many entities are returned per page. */
    per_page?: number | undefined;
  }

  /**
   * The list events response.
   */
  export type EventsListResponse<Def extends Core.CustomDataDef> =
    | EventsListResponseError
    | EventsListResponseSuccess<Def>;

  /**
   * The errored list events response.
   */
  export interface EventsListResponseError
    extends ErrorResponse<ErrorCodeSubscriptions> {}

  /**
   * The successful list events response.
   */
  export interface EventsListResponseSuccess<Def extends Core.CustomDataDef>
    extends ResponseBase<Core.Event<Def>[], MetaPaginated> {}

  /// Notification settings

  /**
   * The notification setting auto-assign fields.
   */
  export type NotificationSettingAutoAssignFields =
    | "id"
    | "endpoint_secret_key";

  //// List notification settings

  /**
   * The list notification settings response.
   */
  export type NotificationSettingsListResponse =
    | NotificationSettingsListResponseError
    | NotificationSettingsListResponseSuccess;

  /**
   * The errored list notification settings response.
   */
  export interface NotificationSettingsListResponseError
    extends ErrorResponse<ErrorCodeSubscriptions> {}

  /**
   * The successful list notification settings response.
   */
  export interface NotificationSettingsListResponseSuccess
    extends ResponseBase<Core.NotificationSetting[], MetaBasic> {}

  //// Create notification setting

  /**
   * The create notification setting body.
   */
  export type NotificationSettingCreateBody = Utils.MakeNullableFieldsOptional<
    Omit<Core.NotificationSetting, NotificationSettingAutoAssignFields>
  >;

  /**
   * The create notification setting response.
   */
  export type NotificationSettingCreateResponse =
    | NotificationSettingCreateResponseError
    | NotificationSettingCreateResponseSuccess;

  /**
   * The errored notification setting create response.
   */
  export interface NotificationSettingCreateResponseError
    extends ErrorResponse<ErrorCodeNotifications> {}

  /**
   * The successful notification setting create response.
   */
  export interface NotificationSettingCreateResponseSuccess
    extends ResponseBase<Core.NotificationSetting, MetaBasic> {}

  //// Get notification setting

  /**
   * The get notification setting response.
   */
  export type NotificationSettingGetResponse =
    | NotificationSettingGetResponseError
    | NotificationSettingGetResponseSuccess;

  /**
   * The errored notification setting get response.
   */
  export interface NotificationSettingGetResponseError
    extends ErrorResponse<ErrorCodeShared> {}

  /**
   * The successful notification setting get response.
   */
  export interface NotificationSettingGetResponseSuccess
    extends ResponseBase<Core.NotificationSetting, MetaBasic> {}

  //// Update notification setting

  /**
   * Body for updating a notification setting.
   */
  export type NotificationSettingUpdateBody = Utils.Optional<
    Omit<Core.NotificationSetting, NotificationSettingAutoAssignFields | "type">
  >;

  /**
   * Response of successful update of notification setting.
   */
  export interface NotificationSettingUpdateResponseSuccess
    extends ResponseBase<Core.NotificationSetting, MetaBasic> {}

  /**
   * The errored update notification setting response.
   */
  export interface NotificationSettingUpdateResponseError
    extends ErrorResponse<ErrorCodeNotifications> {}

  /**
   * Type of update notification response.
   */
  export type NotificationSettingUpdateResponse =
    | NotificationSettingUpdateResponseError
    | NotificationSettingUpdateResponseSuccess;

  //// Delete notification setting

  /**
   * The response type for deleting a notification setting.
   */
  export type NotificationSettingDeleteResponse = {};

  /// Notifications

  //// List notifications

  /**
   * The list notifications query.
   */
  export interface NotificationsListQuery {
    /** Return entities after the specified cursor */
    after?: string | undefined;
    /** Return entities related to the specified notification destination */
    notification_setting_id?:
      | Core.NotificationSettingId
      | Core.NotificationSettingId[]
      | undefined;
    /** Order returned entities by the specified field and direction */
    order_by?: string | undefined;
    /** Set how many entities are returned per page */
    per_page?: number | undefined;
    /** Return entities that match a search query */
    search?: string | undefined;
    /** Return entities that match the specified status */
    status?: Core.NotificationStatus | Core.NotificationStatus[] | undefined;
    /** Return entities that contain the Paddle ID specified */
    filter?:
      | Core.TransactionId
      | Core.CustomerId
      | Core.SubscriptionId
      | undefined;
    /** Return entities up to a specific time */
    to?: string | undefined;
    /** Return entities from a specific time */
    from?: string | undefined;
  }

  /**
   * The list notifications response.
   */
  export type NotificationsListResponse<Def extends Core.CustomDataDef> =
    | NotificationsListResponseError
    | NotificationsListResponseSuccess<Def>;

  /**
   * The errored list notifications response.
   */
  export interface NotificationsListResponseError
    extends ErrorResponse<ErrorCodeShared> {}

  /**
   * The successful list notifications response.
   */
  export interface NotificationsListResponseSuccess<
    Def extends Core.CustomDataDef
  > extends ResponseBase<Core.Notification<Def>[], MetaPaginated> {}

  //// Get notification

  /**
   * The get notification response.
   */
  export type NotificationGetResponse<Def extends Core.CustomDataDef> =
    | NotificationGetResponseError
    | NotificationGetResponseSuccess<Def>;

  /**
   * The errored get notification response.
   */
  export interface NotificationGetResponseError
    extends ErrorResponse<ErrorCodeShared> {}

  /**
   * The successful get notification response.
   */
  export interface NotificationGetResponseSuccess<
    Def extends Core.CustomDataDef
  > extends ResponseBase<Core.Notification<Def>, MetaBasic> {}

  //// Reply a notification

  /**
   * The replay notification response.
   */
  export type NotificationReplayResponse =
    | NotificationReplayResponseError
    | NotificationReplayResponseSuccess;

  /**
   * The successful replay notification response.
   */
  export interface NotificationReplayResponseSuccess
    extends ResponseBase<NotificationReplayData, MetaBasic> {}

  /**
   * The errored replay notification response.
   */
  export interface NotificationReplayResponseError
    extends ErrorResponse<ErrorCodeShared> {}

  /**
   * Replay notification data.
   */
  export interface NotificationReplayData {
    /** Unique Paddle ID for this new notification */
    notification_id: Core.NotificationId;
  }

  /// Notification logs

  /**
   * The notification logs list query.
   */
  export interface NotificationLogsListQuery {
    /** Return entities after the specified cursor. Used for working through
     * paginated results. */
    after?: string | undefined;
    /** Set how many entities are returned per page. */
    per_page?: number | undefined;
  }

  /**
   * The notification logs list response.
   */
  export type NotificationLogsListResponse =
    | NotificationLogsListResponseError
    | NotificationLogsListResponseSuccess;

  /**
   * The errored notification logs list response.
   */
  export interface NotificationLogsListResponseError
    extends ErrorResponse<ErrorCodeShared> {}

  /**
   * The successful notification logs list response.
   */
  export interface NotificationLogsListResponseSuccess
    extends ResponseBase<Core.NotificationLog[], MetaPaginated> {}

  ///

  /**
   * The order query.
   */
  export type OrderQuery<Type> = keyof Type extends string
    ? `${keyof Type}[ASC]` | `${keyof Type}[DESC]`
    : never;

  /**
   * The operator query. Used for filtering by date. Transforms to
   * Paddle's format:
   * created_at=[LT]2023-04-18T17:03:26 -> created_at[LT]=2023-04-18T17:03:26
   */
  export type OperatorQuery =
    | `[LT]${string}`
    | `[LTE]${string}`
    | `[GT]${string}`
    | `[GTE]${string}`
    | (string & {});

  /**
   * The response include query.
   */
  export type ResponseInclude<Include extends string> = {
    [Key in Include]?: boolean;
  };

  export type ResponseIncludedField<
    Include extends ResponseInclude<Key> | undefined,
    Key extends string,
    Field extends any
  > = Include extends ResponseInclude<Key>
    ? Include[Key] extends true
      ? Field
      : never
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
}
