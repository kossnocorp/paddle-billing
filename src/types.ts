/**
 * The Paddle types namespace. Contains all types used by the Paddle Billing API.
 */
export namespace Paddle {
  /**
   * Price entities describe how much and how often you charge for your
   * products. They hold charging information.
   */
  export type Price<Data extends CustomData = CustomData> =
    | PriceSubscription<Data>
    | PriceOneTime<Data>;

  /**
   * Base price interface.
   */
  export interface PriceBase<Data extends CustomData> {
    /** Unique Paddle ID for this price, prefixed with pri_ */
    id: PriceId;
    /** Paddle ID for the product that this price is for, prefixed with pro_ */
    product_id: ProductId;
    /** Short description for this price. Typically describes how often
     * the related product bills. */
    description: string;
    /** How tax is calculated for this price */
    tax_mode: TaxMode;
    /** Base price. This price applies to all customers, except for customers
     * located in countries where you have unit_price_overrides. */
    unit_price: UnitPrice;
    /** List of unit price overrides. Use to override the base price with
     * a custom price and currency for a country or group of countries */
    unit_price_overrides: UnitPriceOverride[];
    /** Limits on how many times the related product can be purchased
     * at this price. Useful for discount campaigns. */
    quantity: Quantity;
    /** Whether this entity can be used in Paddle. */
    status: EntityStatus;
    /** Your own structured key-value data. */
    custom_data: Data;
  }

  /**
   * Subcription price.
   */
  export interface PriceSubscription<Data extends CustomData = CustomData>
    extends PriceBase<Data> {
    /** How often this price should be charged. null if price is non-recurring
     * (one-time) */
    billing_cycle: TimeInterval;
    /** Trial period for the product related to this price. The billing cycle
     * begins once the trial period is over. null for no trial period.
     * Requires billing_cycle. */
    trial_period: null | TimeInterval;
  }

  /**
   * One-time price.
   */
  export interface PriceOneTime<Data extends CustomData = CustomData>
    extends PriceBase<Data> {
    /** How often this price should be charged. null if price is non-recurring
     * (one-time) */
    billing_cycle: null;
    /** Trial period for the product related to this price. The billing cycle
     * begins once the trial period is over. null for no trial period.
     * Requires billing_cycle. */
    trial_period: null;
  }

  /**
   * Unique Paddle ID for this price, prefixed with pri_
   */
  export type PriceId = `pri_${string}`;

  /**
   * Paddle ID for the product that this price is for, prefixed with pro_
   */
  export type ProductId = `pro_${string}`;

  /**
   * How tax is calculated for this price.
   */
  export type TaxMode =
    | "account_setting" // Prices use the setting from your account
    | "external" // Prices are exclusive of tax
    | "internal"; // Prices are inclusive of tax

  /**
   * Supported three-letter ISO 4217 currency code.
   */
  export type CurrencyCode =
    | "ARS" // Argentine Peso
    | "AUD" // Australian Dollar
    | "BRL" // Brazilian Real
    | "CAD" // Canadian Dollar
    | "CHF" // Swiss Franc
    | "CNY" // Chinese Yuan
    | "CZK" // Czech Koruna
    | "DKK" // Danish Krone
    | "EUR" // Euro
    | "GBP" // British Pound Sterling
    | "HKD" // Hong Kong Dollar
    | "HUF" // Hungarian Forint
    | "ILS" // Israeli New Sheqel
    | "INR" // Indian Rupee
    | "JPY" // Japanese Yen
    | "KRW" // South Korean Won
    | "MXN" // Mexican Peso
    | "NOK" // Norwegian Krone
    | "NZD" // New Zealand Dollar
    | "PLN" // Polish Zloty
    | "RUB" // Russian Ruble
    | "SEK" // Swedish Krona
    | "SGD" // Singapore Dollar
    | "THB" // Thai Baht
    | "TRY" // Turkish Lira
    | "TWD" // New Taiwan Dollar
    | "UAH" // Ukrainian Hryvnia
    | "USD" // United States Dollar
    | "ZAR"; // South African Rand

  /**
   * Time unit.
   */
  export type TimeUnit = "day" | "week" | "month" | "year";

  /**
   * Time interval. Used to define subscription billing cycles, trial periods,
   * etc.
   */
  export interface TimeInterval {
    /** Unit of time */
    interval: TimeUnit;
    /** Amount of time */
    frequency: number;
  }

  /**
   * Time period. Used to define trial periods, etc.
   */
  export interface TimePeriod {
    /** RFC 3339 datetime string of when this period starts. */
    starts_at: string;
    /** RFC 3339 datetime string of when this period ends. */
    ends_at: string;
  }

  /**
   * The actual price information.
   */
  export interface UnitPrice {
    /** Amount in the lowest denomination for the currency,
     * e.g. 10 USD = 1000 (cents) */
    amount: string;
    /** Supported three-letter ISO 4217 currency code */
    currency_code: CurrencyCode;
  }

  /**
   * Override price. This price applies to customers located in the countries
   * for this unit price override.
   */
  export interface UnitPriceOverride {
    /** Supported two-letter ISO 3166-1 alpha-2 country code. */
    country_codes: string[];
    /** Override price details */
    unit_price: UnitPrice;
  }

  /**
   * Limits on how many times the related product can be purchased at this price.
   * Useful for discount campaigns.
   */
  export type Quantity = QuantitySet | QuantityUnset;

  /**
   * Set quantity limits.
   */
  export interface QuantitySet {
    /** Minimum quantity of the product related to this price that can be
     * bought.Required if maximum set. */
    minimum: number;
    /** Maximum quantity of the product related to this price that can be
     * bought. Required if minimum set. Must be greater than the minimum value. */
    maximum: number;
  }

  /**
   * Unset quantity limits.
   */
  export interface QuantityUnset {
    /** Minimum quantity of the product related to this price that can be
     * bought.Required if maximum set. */
    minimum: undefined;
    /** Maximum quantity of the product related to this price that can be
     * bought. Required if minimum set. Must be greater than the minimum value. */
    maximum: undefined;
  }

  /**
   * Whether this entity can be used in Paddle.
   */
  export type EntityStatus =
    | "active" // Entity is active and can be used.
    | "archived"; // Entity is archived, so can't be used.

  /**
   * Your own structured key-value data.
   */
  export type CustomData = Record<string, any>;

  /**
   * Tax category for the product. Used for charging the correct rate of tax.
   * Selected tax category must be enabled on your Paddle account.
   */
  export type TaxCategory =
    | "digital-goods" // Non-customizable digital files or media (not software) acquired with an up front payment that can be accessed without any physical product being delivered.
    | "ebooks" // Digital books and educational material which is sold with permanent rights for use by the customer.
    | "implementation-services" // Remote configuration, set-up, and integrating software on behalf of a customer.
    | "professional-services" // Services that involve the application of your expertise and specialized knowledge of a software product.
    | "saas" // Products that allow users to connect to and use online or cloud-based applications over the Internet.
    | "software-programming-services" // Services that can be used to customize and white label software products.
    | "standard" // Software products that are pre-written and can be downloaded and installed onto a local device.
    | "training-services" // Training and education services related to software products.
    | "website-hosting"; // Cloud storage service for personal or corporate information, assets, or intellectual property.

  /**
   * Represents the Product object.
   */
  export interface Product<Data extends CustomData = CustomData> {
    /** Unique Paddle ID for this product, prefixed with pro_. */
    id: ProductId;
    /** Name of this product. */
    name: string;
    /** Short description for this product. Included in the checkout and on
     * some customer documents. */
    description: string | null;
    /** Tax category for this product. */
    tax_category: TaxCategory;
    /** Image for this product. Included in the checkout and on some
     * customer documents. */
    image_url: string | null;
    /** Your own structured key-value data. */
    custom_data: Data;
    /** Whether this entity can be used in Paddle. */
    status: EntityStatus;
    /** RFC 3339 datetime string of when this entity was created. Set
     * automatically by Paddle. */
    created_at: string;
  }

  /**
   * Subscription interface.
   */
  export type Subscription<
    SubscriptionItemData extends CustomData = CustomData,
    SubscriptionData extends CustomData = CustomData
  > =
    | SubscriptionManual<SubscriptionItemData, SubscriptionData>
    | SubscriptionAutomatic<SubscriptionItemData, SubscriptionData>;

  /**
   * Base subscription interface.
   */
  export interface SubscriptionBase<
    SubscriptionItemData extends CustomData,
    SubscriptionData extends CustomData
  > {
    /** Unique Paddle ID for this subscription entity, prefixed with sub_. */
    id: SubscriptionId;
    /** Status of this subscription. */
    status: SubscriptionStatus;
    /** Paddle ID of the customer that this subscription is for, prefixed
     * with ctm_ */
    customer_id: CustomerId;
    /** Paddle ID of the address that this subscription is for, prefixed
     * with add_ */
    address_id: AddressId;
    /** Paddle ID of the business that this subscription is for, prefixed
     * with biz_ */
    business_id: BusinessId | null;
    /** Supported three-letter ISO 4217 currency code. Transactions for this
     * subscription are created in this currency. */
    currency_code: CurrencyCode;
    /** RFC 3339 datetime string of when this entity was created. */
    created_at: string;
    /** RFC 3339 datetime string of when this entity was updated. */
    updated_at: string;
    /** RFC 3339 datetime string of when this subscription started. */
    started_at: string | null;
    /** RFC 3339 datetime string of when this subscription was first billed. */
    first_billed_at: string | null;
    /** RFC 3339 datetime string of when this subscription is next scheduled
     * to be billed. */
    next_billed_at: string | null;
    /** RFC 3339 datetime string of when this subscription was paused. */
    paused_at: string | null;
    /** RFC 3339 datetime string of when this subscription was canceled. */
    canceled_at: string | null;
    /** Details of the discount applied to this subscription. */
    discount: Discount | null;
    /** Current billing period for this subscription. Set automatically
     * by Paddle based on the billing cycle. */
    current_billing_period: TimeInterval | null;
    /** How often this subscription renews. */
    billing_cycle: TimeInterval;
    /** Change that's scheduled to be applied to a subscription. */
    scheduled_change: ScheduledChange | null;
    /** Public URLs that customers can use to make changes to this subscription. */
    management_urls: ManagementURLs;
    /** Represents subscription items. */
    items: SubscriptionItem<SubscriptionItemData>[];
    /** Your own structured key-value data. */
    custom_data: SubscriptionData;
  }

  /**
   * Manual subscription interface.
   */
  export interface SubscriptionManual<
    SubscriptionItemData extends CustomData = CustomData,
    SubscriptionData extends CustomData = CustomData
  > extends SubscriptionBase<SubscriptionItemData, SubscriptionData> {
    /** How payment is collected for transactions created for this
     * subscription. */
    collection_mode: CollectionMode & "manual";
    /** Details for invoicing. Required if collection_mode is manual. */
    billing_details: BillingDetails;
  }

  /**
   * Automatic subscription interface.
   */
  export interface SubscriptionAutomatic<
    SubscriptionItemData extends CustomData = CustomData,
    SubscriptionData extends CustomData = CustomData
  > extends SubscriptionBase<SubscriptionItemData, SubscriptionData> {
    /** How payment is collected for transactions created for this
     * subscription. */
    collection_mode: CollectionMode & "automatic";
    /** Details for invoicing. Required if collection_mode is manual. */
    billing_details: BillingDetails | null;
  }

  /**
   * Subscription ID.
   */
  export type SubscriptionId = `sub_${string}`;

  /**
   * Paddle ID of the customer that this subscription is for, prefixed with ctm_
   */
  export type CustomerId = `ctm_${string}`;

  /**
   * Paddle ID of the address that this subscription is for, prefixed with add_
   */
  export type AddressId = `add_${string}`;

  /**
   * Paddle ID of the business that this subscription is for, prefixed with biz_
   */
  export type BusinessId = `biz_${string}`;

  /**
   * Subscription status.
   */
  export type SubscriptionStatus =
    | "active" // Subscription is active. Paddle is billing for this subscription and related transactions are not past due.
    | "canceled" // Subscription is canceled. Automatically set by Paddle when a scheduled change for a cancelation takes effect.
    | "past_due" // Subscription has an overdue payment. Automatically set by Paddle when payment fails for an automatically-collected transaction, or payment terms have elapsed for a manually-collected transaction
    | "paused" // Subscription is paused. Automatically set by Paddle when a scheduled change for a pause takes effect.
    | "trialing"; // Subscription is in trial.

  /**
   * Details of the discount applied to this subscription.
   */
  export interface Discount {
    /** Unique Paddle ID for this discount, prefixed with dsc_. */
    id: DiscountId;
    /** RFC 3339 datetime string of when this discount was first applied. */
    starts_at: string;
    /** RFC 3339 datetime string of when this discount no longer applies. */
    ends_at: string;
  }

  /**
   * Unique Paddle ID for this discount, prefixed with dsc_
   */
  export type DiscountId = `dsc_${string}`;

  /**
   * Details for invoicing. Required if collection_mode is manual.
   */
  export interface BillingDetails {
    /** Whether the related transaction may be paid using a Paddle Checkout. */
    enable_checkout: boolean;
    /** Customer purchase order number. Appears on invoice documents. */
    purchase_order_number: string;
    /** Notes or other information to include on this invoice. Appears
     * on invoice documents. */
    additional_information: string;
    /** How long a customer has to pay this invoice once issued. */
    payment_terms: TimeInterval;
  }

  /**
   * Represents a subscription item.
   */
  export interface SubscriptionItem<Data extends CustomData = CustomData> {
    /** Status of this subscription item. */
    status: SubscriptionItemStatus;
    /** Quantity of this item on the subscription. */
    quantity: number;
    /** Whether this is a recurring item. */
    recurring: boolean;
    /** RFC 3339 datetime string of when this item was added to
     * this subscription. */
    created_at: string;
    /** RFC 3339 datetime string of when this item was last updated on
     * this subscription. */
    updated_at: string;
    /** RFC 3339 datetime string of when this item was last billed. */
    previously_billed_at: string | null;
    /** RFC 3339 datetime string of when this item is next scheduled
     * to be billed. */
    next_billed_at: string | null;
    /** Trial dates for this item. */
    trial_dates: TimePeriod | null;
    /** Price object for this item. */
    price: Price;
    /** Your own structured key-value data. */
    custom_data: Data;
  }

  /**
   * Subscription item status values.
   */
  export type SubscriptionItemStatus =
    | "active" // This item is active. It is not in trial and Paddle bills for it.
    | "inactive" // This item is not active. Set when the related subscription is paused.
    | "trialing"; // This item is in trial. Paddle has not billed for it.

  /**
   * Collection mode values.
   */
  export type CollectionMode =
    | "automatic" // Payment is collected automatically using a checkout initially, then using a payment method on file.
    | "manual"; // Payment is collected manually. Customers are sent an invoice with payment terms and can make a payment offline or using a checkout. Requires billing_details.

  /**
   * Public URLs that customers can use to make changes to this subscription.
   */
  export interface ManagementURLs {
    /** Public URL that lets customers update the payment method for
     * this subscription. */
    update_payment_method: string | null;
    /** Public URL that lets customers cancel this subscription. */
    cancel: string | null;
  }

  /**
   * Change that's scheduled to be applied to a subscription.
   */
  export interface ScheduledChange {
    /** Kind of change that's scheduled to be applied to this subscription. */
    action: ScheduledAction;
    /** RFC 3339 datetime string of when this scheduled change takes effect. */
    effective_at: string;
    /** RFC 3339 datetime string of when a paused subscription should resume.
     * Only used for pause scheduled changes. */
    resume_at: string | null;
  }

  /**
   * Scheduled change action values.
   */
  export type ScheduledAction =
    | "cancel" // Subscription is scheduled to cancel. Its status changes to canceled on the effective_at date.
    | "pause" // Subscription is scheduled to pause. Its status changes to pause on the effective_at date.
    | "resume"; // Subscription is scheduled to resume. Its status changes to active on the resume_at date.

  /**
   * Event ID.
   */
  export type EventId = `evt_${string}`;

  /**
   * Notification ID.
   */
  export type NotificationId = `ntf_${string}`;

  /**
   * Status of the transaction.
   */
  export type TransactionStatus =
    | "draft" // Transaction is missing required fields. Typically the first stage of a checkout before customer details are captured.
    | "ready" // Transaction has all of the required fields to be marked as billed or completed.
    | "billed" // Transaction has been updated to billed. Billed transactions get an invoice number and are considered a legal record. They cannot be changed. Typically used as part of an invoice workflow.
    | "completed" // Transaction is completed. Typically means payment collected successfully.
    | "canceled" // Transaction has been updated to canceled. If an invoice, it's no longer due.
    | "past_due"; // Transaction is past due. Occurs for automatically-collected transactions when the related subscription is in dunning, and for manually-collected transactions when payment terms have elapsed.

  /**
   * Origin of the transaction.
   */
  export type TransactionOrigin =
    | "api" // Transaction created via the Paddle API.
    | "subscription_charge" // Transaction created automatically by Paddle as a result of a one-time charge for a subscription.
    | "subscription_payment_method_change" // Transaction created automatically as part of updating a payment method. May be a zero value transaction.
    | "subscription_recurring" // Transaction created automatically by Paddle as a result of a subscription renewal.
    | "subscription_update" // Transaction created automatically by Paddle as a result of an update to a subscription.
    | "web"; // Transaction created automatically by Paddle.js for a checkout.

  /**
   * Represents the transaction entity.
   */
  export interface Transaction<
    PriceData extends CustomData = CustomData,
    TransactionData extends CustomData = CustomData
  > {
    /** Unique Paddle ID for this transaction entity, prefixed with txn_. */
    id: TransactionId;
    /** Status of this transaction. */
    status: TransactionStatus;
    /** Paddle ID of the customer that this transaction is for, prefixed
     * with ctm_. */
    customer_id: CustomerId | null;
    /** Paddle ID of the address that this transaction is for, prefixed
     * with add_. */
    address_id: AddressId | null;
    /** Paddle ID of the business that this transaction is for, prefixed
     * with biz_. */
    business_id: BusinessId | null;
    /** Your own structured key-value data. */
    custom_data: TransactionData;
    /** Supported three-letter ISO 4217 currency code. */
    currency_code: CurrencyCode;
    /** Describes how this transaction was created. */
    origin: TransactionOrigin;
    /** Paddle ID of the subscription that this transaction is for, prefixed
     * with sub_. */
    subscription_id: SubscriptionId | null;
    /** Paddle ID of the invoice that this transaction is related to, prefixed
     * with inv_. */
    invoice_id: InvoiceId | null;
    /** Invoice number for this transaction. */
    invoice_number: string | null;
    /** How payment is collected for this transaction. */
    collection_mode: CollectionMode;
    /** Paddle ID of the discount applied to this transaction, prefixed
     * with dsc_. */
    discount_id: DiscountId | null;
    /** Details for invoicing. */
    billing_details: BillingDetails | null;
    /** List of items on this transaction. */
    items: TransactionItem<PriceData>[];
    /** Details for this transaction. */
    details: TransactionDetails;
    /** Paddle Checkout details for this transaction. */
    checkout: Checkout | null;
    /** RFC 3339 datetime string of when this entity was created. */
    created_at: string;
    /** RFC 3339 datetime string of when this entity was updated. */
    updated_at: string;
    /** RFC 3339 datetime string of when this transaction was marked
     * as billed. */
    billed_at: string | null;
  }

  /**
   * Transaction ID.
   */
  export type TransactionId = `txn_${string}`;

  /**
   * Invoice ID.
   */
  export type InvoiceId = `inv_${string}`;

  /**
   * Represents an item in the transaction.
   */
  export interface TransactionItem<PriceData extends CustomData> {
    /** Paddle ID for the price to add to this transaction, prefixed
     * with pri_. */
    price_id: string;
    /** Represents a price entity. */
    price: Price<PriceData>;
    /** Quantity of this item on the transaction. */
    quantity: number;
    /** How proration was calculated for this item. */
    proration: Proration | null;
  }

  /**
   * Represents proration information.
   */
  export interface Proration {
    /** Rate used to calculate proration. */
    rate: string;
    /** Billing period that proration is based on. */
    billing_period: TimePeriod;
  }

  /**
   * Represents transaction details.
   */
  export interface TransactionDetails {
    /** List of tax rates applied for this transaction. */
    tax_rates_used: TaxRate[];
    /** Breakdown of the total for a transaction. */
    totals: Totals;
    /** Breakdown of the payout totals for a transaction after adjustments. */
    adjusted_totals: AdjustedTotals | null;
    /** Breakdown of the payout total for a transaction. */
    payout_totals: PayoutTotals | null;
    /** Information about line items for this transaction. */
    line_items: LineItem[];
    /** List of payment attempts for this transaction. */
    payments: Payment[];
  }

  /**
   * Represents a tax rate.
   */
  export interface TaxRate {
    /** Rate used to calculate tax for this transaction. */
    tax_rate: string;
    /** Calculated totals for the tax applied to this transaction. */
    totals: TotalsWithDiscount;
  }

  /**
   * Represents calculated totals for the tax applied to a transaction.
   */
  export interface TotalsWithDiscount {
    /** Subtotal before discount, tax, and deductions. If an item, unit price
     * multiplied by quantity. */
    subtotal: string;
    /** Total discount as a result of any discounts applied. */
    discount: string;
    /** Total tax on the subtotal. */
    tax: string;
    /** Total after discount and tax. */
    total: string;
  }

  /**
   * Base interface for totals related structures.
   */
  export interface TotalsBase {
    /** Subtotal before discount, tax, and deductions. If an item, unit price
     * multiplied by quantity. */
    subtotal: string;
    /** Total tax on the subtotal. */
    tax: string;
    /** Total after discount and tax. */
    total: string;
    /** Three-letter ISO 4217 currency code. */
    currency_code: CurrencyCode;
  }

  /**
   * Breakdown of the total for a transaction.
   */
  export interface Totals extends TotalsBase {
    /** Total discount as a result of any discounts applied. */
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
    /** Breakdown of the payout totals for a transaction after adjustments.
     * null until the transaction is completed. */
    adjusted_totals: AdjustedTotals | null;
    /** Breakdown of the payout total for a transaction. null until
     * the transaction is completed. */
    payout_totals: PayoutTotals | null;
    /** Details of any chargeback fees incurred for this transaction. */
    chargeback_fee: ChargebackFee;
  }

  /**
   * Breakdown of the payout totals for a transaction after adjustments.
   */
  export interface AdjustedTotals extends TotalsBase {
    /** Total fee taken by Paddle for this transaction. null until
     * the transaction is completed and the fee is processed. */
    fee: string | null;
    /** Total earnings for this transaction after all deductions. */
    earnings: string | null;
  }

  /**
   * Breakdown of the payout total for a transaction.
   */
  export interface PayoutTotals extends TotalsBase {
    /** Total discount as a result of any discounts applied. */
    discount: string;
    /** Total credit applied to this transaction. This includes credits
     * applied using a customer's credit balance and adjustments to
     * a billed transaction. */
    credit: string;
    /** Total due on a transaction after credits and any payments. */
    balance: string;
    /** Total due on a transaction after credits but before any payments. */
    grand_total: string;
    /** Total fee taken by Paddle for this payout. */
    fee: string;
    /** Total earnings for this payout. This is the subtotal minus
     * the Paddle fee. */
    earnings: string;
    /** Breakdown of the payout total for a transaction after adjustments.
     * null until the transaction is completed. */
    adjusted_payout_totals: AdjustedPayoutTotals | null;
  }

  /**
   * Breakdown of the payout total for a transaction after adjustments.
   */
  export interface AdjustedPayoutTotals extends TotalsBase {
    /** Total fee taken by Paddle for this payout. */
    fee: string;
    /** Total earnings for this payout. This is the subtotal minus
     * the Paddle fee. */
    earnings: string;
  }

  /**
   * Details of any chargeback fees incurred for this transaction.
   */
  export interface ChargebackFee extends UnitPrice {
    /** Chargeback fee before conversion to the payout currency. null when
     * the chargeback fee is the same as the payout currency. */
    original: UnitPrice | null;
    /** Total earnings after deductions due to chargeback. */
    earnings: string;
  }

  /**
   * Information about line items for a transaction.
   */
  export interface LineItem {
    /** Unique Paddle ID for this transaction item, prefixed with txnitm_. */
    id: TransactionItemId;
    /** Paddle ID for the price related to this transaction line item,
     * prefixed with pri_. */
    price_id: PriceId;
    /** Quantity of this transaction line item. */
    quantity: number;
    /** How proration was calculated for this item. */
    proration: Proration | null;
    /** Rate used to calculate tax for this transaction line item. */
    tax_rate: string;
    /** Breakdown of the charge for one unit. */
    unit_totals: TotalsWithDiscount;
    /** Breakdown of a charge in the lowest denomination of a currency
     * (e.g. cents for USD). */
    totals: TotalsWithDiscount;
    /** Related product entity for this transaction line item price. */
    product: Product;
  }

  /**
   * Transaction item ID.
   */
  export type TransactionItemId = `txnitm_${string}`;

  /**
   * List of payment attempts for this transaction.
   */
  export interface Payment {
    /** UUID for this payment attempt. */
    payment_attempt_id: string;
    /** UUID for the stored payment method used for this payment attempt. */
    stored_payment_method_id: string;
    /** Amount for collection in the lowest denomination of a currency (e.g.
     * cents for USD). */
    amount: string;
    /** Status of this payment attempt. */
    status: string;
    /** Error code relating to a payment issue. */
    error_code: string | null;
    /** Information about the payment method used for a payment attempt. */
    method_details: MethodDetails;
    /** RFC 3339 datetime string of when this entity was created. */
    created_at: string;
    /** RFC 3339 datetime string of when this payment was captured. null
     * if status is not captured. */
    captured_at: string | null;
  }

  /**
   * Information about the payment method used for a payment attempt.
   */
  export interface MethodDetails {
    /** Type of payment method used for this payment attempt. */
    type: PaymentMethodType;
    /** Information about the credit or debit card used to pay. Only returned
     * when type is card. */
    card?: CardDetails;
  }

  /**
   * Type of payment method used.
   */
  export type PaymentMethodType =
    | "card" // Credit or debit card.
    | "paypal" // PayPal
    | "apple_pay" // Apple Pay on a supported Apple device
    | "wire_transfer" // Wire transfer, sometimes called bank transfer
    | "alipay" // Alipay, popular in China
    | "ideal" // iDEAL, popular in the Netherlands
    | "google_pay" // Google Pay
    | "offline" // Payment recorded offline
    | "unknown"; // Payment method not known

  /**
   * Information about the credit or debit card used to pay.
   */
  export interface CardDetails {
    /** Type of credit or debit card used to pay. */
    type: CardType;
    /** Last four digits of the card used to pay. */
    last4: string;
    /** Month of the expiry date of the card used to pay. */
    expiry_month: number;
    /** Year of the expiry year of the card used to pay. */
    expiry_year: number;
  }

  /**
   * Type of credit or debit card used to pay.
   */
  export type CardType =
    | "visa" // Visa
    | "mastercard" // Mastercard
    | "maestro" // Maestro (debit card)
    | "american_express" // American Express
    | "discover" // Discover Card
    | "diners_club" // Diners Club
    | "jcb" // JCB Card
    | "union_pay" // UnionPay, popular in China
    | "mada" // Mada Card, popular in Saudi Arabia
    | "unknown"; // Card type unknown;

  /**
   * Paddle Checkout details for this transaction.
   */
  export interface Checkout {
    /** Paddle Checkout URL for this transaction. */
    url: string;
  }

  /**
   * Address attributes.
   */
  export interface Address {
    /** Unique Paddle ID for this address entity */
    id: AddressId;
    /** Memorable description for this address */
    description: string | null;
    /** First line of this address */
    first_line: string | null;
    /** Second line of this address */
    second_line: string | null;
    /** City of this address */
    city: string | null;
    /** ZIP or postal code of this address */
    postal_code: string | null;
    /** State, county, or region of this address */
    region: string | null;
    /** Supported two-letter ISO 3166-1 alpha-2 country code for this address */
    country_code: CountryCode;
    /** Whether this entity can be used in Paddle */
    status: EntityStatus;
    /** RFC 3339 datetime string of when this entity was created */
    created_at: string; // could be more specific with a "date-time" type or a Date type
    /** RFC 3339 datetime string of when this entity was updated */
    updated_at: string; // could be more specific with a "date-time" type or a Date type
  }

  /**
   * Country code.
   */
  export type CountryCode =
    | "AD" // Andorra
    | "AE" // United Arab Emirates
    | "AG" // Antigua and Barbuda
    | "AI" // Anguilla
    | "AL" // Albania
    | "AM" // Armenia
    | "AO" // Angola
    | "AR" // Argentina
    | "AS" // American Samoa
    | "AT" // Austria
    | "AU" // Australia
    | "AW" // Aruba
    | "AX" // Aland Islands
    | "AZ" // Azerbaijan
    | "BA" // Bosnia and Herzegovina
    | "BB" // Barbados
    | "BD" // Bangladesh
    | "BE" // Belgium
    | "BF" // Burkina Faso
    | "BG" // Bulgaria
    | "BH" // Bahrain
    | "BI" // Burundi
    | "BJ" // Benin
    | "BM" // Bermuda
    | "BN" // Brunei
    | "BO" // Bolivia
    | "BQ" // Bonaire, Sint Eustatius and Saba
    | "BR" // Brazil
    | "BS" // Bahamas
    | "BT" // Bhutan
    | "BV" // Bouvet Island
    | "BW" // Botswana
    | "BZ" // Belize
    | "CA" // Canada
    | "CC" // Cocos Islands
    | "CG" // Republic of Congo
    | "CH" // Switzerland
    | "CI" // Cote D’Ivoire
    | "CK" // Cook Islands
    | "CL" // Chile
    | "CM" // Cameroon
    | "CN" // China
    | "CO" // Colombia
    | "CR" // Costa Rica
    | "CV" // Cape Verde
    | "CW" // Curaçao
    | "CX" // Christmas Island
    | "CY" // Cyprus
    | "CZ" // Czech Republic
    | "DE" // Germany
    | "DJ" // Djibouti
    | "DK" // Denmark
    | "DM" // Dominica
    | "DO" // Dominican Republic
    | "DZ" // Algeria
    | "EC" // Ecuador
    | "EE" // Estonia
    | "EG" // Egypt
    | "EH" // Western Sahara
    | "ER" // Eritrea
    | "ES" // Spain
    | "ET" // Ethiopia
    | "FI" // Finland
    | "FJ" // Fiji
    | "FK" // Falkland Islands
    | "FM" // Micronesia
    | "FO" // Faroe Islands
    | "FR" // France
    | "GA" // Gabon
    | "GB" // United Kingdom
    | "GD" // Grenada
    | "GE" // Georgia
    | "GF" // French Guiana
    | "GG" // Guernsey
    | "GH" // Ghana
    | "GI" // Gibraltar
    | "GL" // Greenland
    | "GM" // Gambia
    | "GN" // Guinea
    | "GP" // Guadeloupe
    | "GQ" // Equatorial Guinea
    | "GR" // Greece
    | "GS" // S. Georgia/ Sandwich Islands
    | "GT" // Guatemala
    | "GU" // Guam
    | "GW" // Guinea-Bissau
    | "GY" // Guyana
    | "HK" // Hong Kong
    | "HM" // Heard Island and McDonald Islands
    | "HN" // Honduras
    | "HR" // Croatia
    | "HU" // Hungary
    | "ID" // Indonesia
    | "IE" // Ireland
    | "IL" // Israel
    | "IM" // Isle of Man
    | "IN" // India
    | "IO" // British Indian Ocean
    | "IQ" // Iraq
    | "IS" // Iceland
    | "IT" // Italy
    | "JE" // Jersey
    | "JM" // Jamaica
    | "JO" // Jordan
    | "JP" // Japan
    | "KE" // Kenya
    | "KG" // Kyrgyzstan
    | "KH" // Cambodia
    | "KI" // Kiribati
    | "KM" // Comoros
    | "KN" // Saint Kitts and Nevis
    | "KR" // South Korea
    | "KW" // Kuwait
    | "KY" // Cayman Islands
    | "KZ" // Kazakhstan
    | "LA" // Lao People’s DR
    | "LB" // Lebanon
    | "LC" // Saint Lucia
    | "LI" // Liechtenstein
    | "LK" // Sri Lanka
    | "LR" // Liberia
    | "LS" // Lesotho
    | "LT" // Lithuania
    | "LU" // Luxembourg
    | "LV" // Latvia
    | "MA" // Morocco
    | "MC" // Monaco
    | "MD" // Moldova
    | "ME" // Montenegro
    | "MF" // Saint Martin
    | "MG" // Madagascar
    | "MH" // Marshall Islands
    | "MK" // Macedonia
    | "MN" // Mongolia
    | "MO" // Macao
    | "MP" // Northern Mariana Islands
    | "MQ" // Martinique
    | "MR" // Mauritania
    | "MS" // Montserrat
    | "MT" // Malta
    | "MU" // Mauritius
    | "MV" // Maldives
    | "MW" // Malawi
    | "MX" // Mexico
    | "MY" // Malaysia
    | "MZ" // Mozambique
    | "NA" // Namibia
    | "NC" // New Caledonia
    | "NE" // Niger
    | "NF" // Norfolk Island
    | "NG" // Nigeria
    | "NL" // Netherlands
    | "NO" // Norway
    | "NP" // Nepal
    | "NR" // Nauru
    | "NU" // Niue
    | "NZ" // New Zealand
    | "OM" // Oman
    | "PA" // Panama
    | "PE" // Peru
    | "PF" // French Polynesia
    | "PG" // Papua New Guinea
    | "PH" // Philippines
    | "PK" // Pakistan
    | "PL" // Poland
    | "PM" // Saint Pierre and Miquelon
    | "PN" // Pitcairn
    | "PR" // Puerto Rico
    | "PS" // Palestinian Territory
    | "PT" // Portugal
    | "PW" // Palau
    | "PY" // Paraguay
    | "QA" // Qatar
    | "RE" // Reunion
    | "RO" // Romania
    | "RS" // Republic of Serbia
    | "RW" // Rwanda
    | "SA" // Saudi Arabia
    | "SB" // Solomon Islands
    | "SC" // Seychelles
    | "SE" // Sweden
    | "SG" // Singapore
    | "SH" // Saint Helena
    | "SI" // Slovenia
    | "SJ" // Svalbard and Jan Mayen
    | "SK" // Slovakia
    | "SL" // Sierra Leone
    | "SM" // San Marino
    | "SN" // Senegal
    | "SR" // Suriname
    | "ST" // Sao Tome and Principe
    | "SV" // El Salvador
    | "SZ" // Swaziland
    | "TC" // Turks and Caicos Islands
    | "TD" // Chad
    | "TF" // French Southern Terr.
    | "TG" // Togo
    | "TH" // Thailand
    | "TJ" // Tajikistan
    | "TK" // Tokelau
    | "TL" // Timor-Leste
    | "TM" // Turkmenistan
    | "TN" // Tunisia
    | "TO" // Tonga
    | "TR" // Turkey
    | "TT" // Trinidad and Tobago
    | "TV" // Tuvalu
    | "TW" // Taiwan
    | "TZ" // Tanzania
    | "UA" // Ukraine
    | "UG" // Uganda
    | "UM" // United States (M.O.I.)
    | "US" // United States
    | "UY" // Uruguay
    | "UZ" // Uzbekistan
    | "VA" // Holy See/ Vatican City
    | "VC" // Saint Vincent/ Grenadines
    | "VG" // British Virgin Islands
    | "VI" // U.S. Virgin Islands
    | "VN" // Vietnam
    | "VU" // Vanuatu
    | "WF" // Wallis and Futuna
    | "WS" // Samoa
    | "XK" // Kosovo
    | "YT" // Mayotte
    | "ZA" // South Africa
    | "ZM"; // Zambia

  /**
   * Represents an adjustment entity.
   */
  export interface Adjustment {
    /** Unique Paddle ID for this adjustment entity, prefixed with adj_. */
    id: AdjustmentId;
    /** How this adjustment impacts the related transaction. */
    action: AdjustmentAction;
    /** Paddle ID for the transaction related to this adjustment, prefixed
     * with txn_. */
    transaction_id: TransactionId;
    /** Paddle ID for the subscription related to this adjustment, prefixed
     * with sub_. Set automatically by Paddle based on the subscription_id
     * of the related transaction. */
    subscription_id: SubscriptionId | null;
    /** Paddle ID for the customer related to this adjustment, prefixed with
     * ctm_. Set automatically by Paddle based on the customer_id of
     * the related transaction. */
    customer_id: CustomerId;
    /** Why this adjustment was created. Appears in the Paddle Dashboard.
     * Retained for record-keeping purposes. */
    reason: string;
    /** Whether this adjustment was applied to the related customer's credit
     * balance. Only returned for credit adjustments. */
    credit_applied_to_balance: boolean;
    /** Three-letter ISO 4217 currency code for this adjustment. Set
     * automatically by Paddle based on the currency_code of the related
     * transaction. */
    currency_code: CurrencyCode;
    /** Status of this adjustment. Set automatically by Paddle. */
    status: AdjustmentStatus;
    /** List of items on this adjustment. */
    items: AdjustmentItem[];
    /** Breakdown of the total for an adjustment. */
    totals: AdjustmentTotals;
    /** Breakdown of how this adjustment affects your payout balance. */
    payout_totals: AdjustmentPayoutTotals | null;
    /** RFC 3339 datetime string of when this entity was created.
     * Set automatically by Paddle. */
    created_at: string;
    /** RFC 3339 datetime string of when this entity was updated.
     * Set automatically by Paddle. */
    updated_at: string;
  }

  /**
   * Adjustment ID.
   */
  export type AdjustmentId = `adj_${string}`;

  /**
   * Represents an adjustment action type.
   */
  export type AdjustmentAction =
    | "credit"
    | "refund"
    | "chargeback"
    | "chargeback_warning";

  /**
   * Represents an adjustment status.
   */
  export type AdjustmentStatus = "pending_approval" | "approved" | "rejected";

  /**
   * Represents a single adjustment item.
   */
  export interface AdjustmentItem {
    /** Unique Paddle ID for this adjustment item, prefixed with adjitm_. */
    id: string;
    /** Paddle ID for the transaction item that this adjustment item relates
     * to, prefixed with adjitm_. */
    item_id: AdjustmentItemId;
    /** Type of adjustment for this transaction item. */
    type: AdjustmentType;
    /** Amount adjusted for this transaction item. Required when adjustment
     * type is partial. */
    amount: string | null;
    /** How proration was calculated for this adjustment item. Set
     * automatically by Paddle. */
    proration: Proration | null;
    /** Breakdown of the total for an adjustment item. */
    totals: AdjustmentItemTotals;
  }

  /**
   * Represents the breakdown of the total for an adjustment item.
   */
  export interface AdjustmentItemTotals {
    /** Amount multiplied by quantity. */
    subtotal: string;
    /** Total tax on the subtotal. */
    tax: string;
    /** Total after tax. */
    total: string;
  }

  /**
   * Adjustment item ID.
   */
  export type AdjustmentItemId = `adjitm_${string}`;

  /**
   * Represents an adjustment type for a transaction item.
   */
  export type AdjustmentType = "full" | "partial" | "tax" | "proration";

  /**
   * Represents the breakdown of the total for an adjustment.
   */
  export interface AdjustmentTotals {
    /** Total before tax. For tax adjustments, the value is 0. */
    subtotal: string;
    /** Total tax on the subtotal. */
    tax: string;
    /** Total after tax. */
    total: string;
    /** Total fee taken by Paddle for this adjustment. */
    fee: string;
    /** Total earnings. This is the subtotal minus the Paddle fee. */
    earnings: string;
    /** Three-letter ISO 4217 currency code used for this adjustment. */
    currency_code: CurrencyCode;
  }

  /**
   * Represents the breakdown of how an adjustment affects payout balance.
   */
  export interface AdjustmentPayoutTotals {
    /** Adjustment total before tax and fees. */
    subtotal: string;
    /** Total tax on the adjustment subtotal. */
    tax: string;
    /** Adjustment total after tax. */
    total: string;
    /** Adjusted Paddle fee. */
    fee: string;
    /** Chargeback fees incurred for this adjustment. Only returned when
     * the adjustment action is chargeback or chargeback_warning. */
    chargeback_fee: ChargebackFee;
    /** Adjusted payout earnings. This is the adjustment total plus adjusted
     * Paddle fees, minus chargeback fees. */
    earnings: string;
    /** Three-letter ISO 4217 currency code used for the payout for this
     * transaction. */
    currency_code: CurrencyCode;
  }

  /**
   * Event alias. Lists all possible events.
   */
  export type Event =
    | EventSubscription
    | EventTransaction
    | EventProduct
    | EventPrice
    | EventAddress;

  /**
   * Base event interface.
   */
  export interface EventBase<Type extends string, Data> {
    /** Unique Paddle ID for this event, prefixed with evt_. */
    event_id: EventId;
    /** Type of event sent by Paddle, in the format entity.event_type. */
    event_type: Type;
    /** RFC 3339 datetime string of when this event occurred. */
    occurred_at: string;
    /** Unique Paddle ID for this notification, prefixed with ntf_. **/
    notification_id: NotificationId;
    /** The associated data. */
    data: Data;
  }

  /**
   * Subscription event alias.
   */
  export type EventSubscription =
    | EventSubscriptionActivated
    | EventSubscriptionUpdated
    | EventSubscriptionCanceled
    | EventSubscriptionPastDue
    | EventSubscriptionPaused
    | EventSubscriptionResumed
    | EventSubscriptionTrialing
    | EventSubscriptionCreated;

  /**
   * Occurs when a subscription becomes active. Its status field changes
   * to active.
   *
   * This means any trial period has elapsed and Paddle has successfully billed
   * the customer.
   */
  export type EventSubscriptionActivated<
    SubscriptionItemData extends CustomData = CustomData,
    SubscriptionData extends CustomData = CustomData
  > = EventBase<
    "subscription.activated",
    Subscription<SubscriptionItemData, SubscriptionData>
  >;

  /**
   * Occurs when a subscription is canceled. Its status field changes
   * to canceled.
   *
   * When you request to cancel a subscription, Paddle creates a scheduled
   * change to say the subscription should be canceled on the next billing date.
   * subscription.updated occurs at this point.
   *
   * On the next billing date, the subscription status changes to canceled and
   * subscription.canceled occurs.
   */
  export type EventSubscriptionCanceled<
    SubscriptionItemData extends CustomData = CustomData,
    SubscriptionData extends CustomData = CustomData
  > = EventBase<
    "subscription.canceled",
    Subscription<SubscriptionItemData, SubscriptionData>
  >;

  /**
   * Occurs when a subscription is created.
   *
   * subscription.trialing or subscription.activated typically follow.
   */
  export type EventSubscriptionCreated<
    SubscriptionItemData extends CustomData = CustomData,
    SubscriptionData extends CustomData = CustomData
  > = EventBase<
    "subscription.created",
    Subscription<SubscriptionItemData, SubscriptionData>
  >;

  /**
   * Occurs when a subscription has an unpaid transaction. Its status changes
   * to past_due.
   */
  export type EventSubscriptionPastDue<
    SubscriptionItemData extends CustomData = CustomData,
    SubscriptionData extends CustomData = CustomData
  > = EventBase<
    "subscription.past_due",
    Subscription<SubscriptionItemData, SubscriptionData>
  >;

  /**
   * Occurs when a subscription is paused. Its status field changes to paused.
   *
   * When you request to pause a subscription, Paddle creates a scheduled change
   * to say the subscription should be paused on the next billing date.
   * subscription.updated occurs at this point.
   *
   * On the next billing date, the subscription status changes to paused and
   * subscription.paused occurs.
   */
  export type EventSubscriptionPaused<
    SubscriptionItemData extends CustomData = CustomData,
    SubscriptionData extends CustomData = CustomData
  > = EventBase<
    "subscription.paused",
    Subscription<SubscriptionItemData, SubscriptionData>
  >;

  /**
   * Occurs when a subscription is resumed after being paused. Its status field
   * changes to active.
   *
   * When resumed, Paddle bills for the subscription immediately.
   * transaction.created and other transaction events occur, depending on
   * the collection mode.
   */
  export type EventSubscriptionResumed<
    SubscriptionItemData extends CustomData = CustomData,
    SubscriptionData extends CustomData = CustomData
  > = EventBase<
    "subscription.resumed",
    Subscription<SubscriptionItemData, SubscriptionData>
  >;

  /**
   * Occurs when a subscription enters trial period.
   */
  export type EventSubscriptionTrialing<
    SubscriptionItemData extends CustomData = CustomData,
    SubscriptionData extends CustomData = CustomData
  > = EventBase<
    "subscription.trialing",
    Subscription<SubscriptionItemData, SubscriptionData>
  >;

  /**
   * Transaction event alias.
   */
  export type EventTransaction =
    | EventTransactionBilled
    | EventTransactionCanceled
    | EventTransactionCompleted
    | EventTransactionCreated
    | EventTransactionPastDue
    | EventTransactionPaymentFailed
    | EventTransactionReady
    | EventTransactionUpdated;

  /**
   * Occurs when a subscription is updated.
   */
  export type EventSubscriptionUpdated<
    SubscriptionItemData extends CustomData = CustomData,
    SubscriptionData extends CustomData = CustomData
  > = EventBase<
    "subscription.updated",
    Subscription<SubscriptionItemData, SubscriptionData>
  >;

  /**
   * Occurs when a transaction is billed. Its status field changes to billed
   * and billed_at is populated.
   *
   * Marking a transaction as billed is typically used when working with
   * manually-collected transactions to issue an invoice. It's not typically
   * part of checkout workflows, where collection mode is automatic.
   */
  export type EventTransactionBilled<
    PriceData extends CustomData = CustomData,
    TransactionData extends CustomData = CustomData
  > = EventBase<"transaction.billed", Transaction<PriceData, TransactionData>>;

  /**
   * Occurs when a transaction is canceled. Its status field changes
   * to canceled.
   *
   * Marking a transaction as canceled is typically used when working with
   * manually-collected transactions to say that an invoice was created
   * in error. It's not typically part of checkout workflows, where collection
   * mode is automatic.
   */
  export type EventTransactionCanceled<
    PriceData extends CustomData = CustomData,
    TransactionData extends CustomData = CustomData
  > = EventBase<
    "transaction.canceled",
    Transaction<PriceData, TransactionData>
  >;

  /**
   * Occurs when a transaction is completed. Its status field changes
   * to completed.
   */
  export type EventTransactionCompleted<
    PriceData extends CustomData = CustomData,
    TransactionData extends CustomData = CustomData
  > = EventBase<
    "transaction.completed",
    Transaction<PriceData, TransactionData>
  >;

  /**
   * Occurs when a transaction is created.
   */
  export type EventTransactionCreated<
    PriceData extends CustomData = CustomData,
    TransactionData extends CustomData = CustomData
  > = EventBase<"transaction.created", Transaction<PriceData, TransactionData>>;

  /**
   * Occurs when a transaction becomes past due. Its status field changes
   * to past_due.
   */
  export type EventTransactionPastDue<
    PriceData extends CustomData = CustomData,
    TransactionData extends CustomData = CustomData
  > = EventBase<
    "transaction.past_due",
    Transaction<PriceData, TransactionData>
  >;

  /**
   * Occurs when a payment fails for a transaction. The payments array is
   * updated with details of the payment attempt.
   *
   * Typically happens for automatically-collected transactions, but may occur
   * for manually-collected transactions (invoices) where a customer pays using
   * Paddle Checkout and their payment is declined.
   */
  export type EventTransactionPaymentFailed<
    PriceData extends CustomData = CustomData,
    TransactionData extends CustomData = CustomData
  > = EventBase<
    "transaction.payment_failed",
    Transaction<PriceData, TransactionData>
  >;

  /**
   * Occurs when a transaction is ready to be billed. Its status field changes
   * to ready.
   *
   * Transactions are ready when they have all the required fields against them
   * to be transitioned to billed or completed. This includes items,
   * customer_id, and address_id. Paddle automatically marks transactions
   * as ready when these fields are present.
   *
   * When working with manually-collected transactions (invoices),
   * transaction.updated may occur immediately after to add invoice_id
   * and adjusted_totals.
   */
  export type EventTransactionReady<
    PriceData extends CustomData = CustomData,
    TransactionData extends CustomData = CustomData
  > = EventBase<"transaction.ready", Transaction<PriceData, TransactionData>>;

  /**
   * Occurs when a transaction is updated.
   *
   * Specific events occur for status changes. transaction.updated may also
   * occur after a status change events to add additional fields to
   * the transaction after Paddle has completed internal processing for
   * a transaction.
   *
   * For example, transaction.billed occurs when a transaction status changes
   * to billed. transaction.updated occurs immediately after to add
   * an invoice_number.
   */
  export type EventTransactionUpdated<
    PriceData extends CustomData = CustomData,
    TransactionData extends CustomData = CustomData
  > = EventBase<"transaction.updated", Transaction<PriceData, TransactionData>>;

  /**
   * Product event alias.
   */
  export type EventProduct = EventProductCreated | EventProductUpdated;

  /**
   * Occurs when a product is created.
   */
  export type EventProductCreated<ProductData extends CustomData = CustomData> =
    EventBase<"product.created", Product<ProductData>>;

  /**
   * Occurs when a product is updated.
   */
  export type EventProductUpdated<ProductData extends CustomData = CustomData> =
    EventBase<"product.updated", Product<ProductData>>;

  /**
   * Price event alias.
   */
  export type EventPrice = EventPriceCreated | EventPriceUpdated;

  /**
   * Occurs when a price is created.
   */
  export type EventPriceCreated<PriceData extends CustomData = CustomData> =
    EventBase<"price.created", Price<PriceData>>;

  /**
   * Occurs when a price is updated.
   */
  export type EventPriceUpdated<PriceData extends CustomData = CustomData> =
    EventBase<"price.updated", Price<PriceData>>;

  /*
  Businesses
  business.created
  business.updated
  Customers
  customer.created
  customer.updated
  */

  /**
   * Address event alias.
   */
  export type EventAddress = EventAddressCreated | EventAddressUpdated;

  /**
   * Occurs when an address is created.
   */
  export type EventAddressCreated = EventBase<"address.created", Address>;

  /**'
   * Occurs when an address is updated.
   */
  export type EventAddressUpdated = EventBase<"address.updated", Address>;

  /**
   * Adjustments event alias.
   */
  export type EventAdjustments =
    | EventAdjustmentCreated
    | EventAdjustmentUpdated;

  /**
   * Occurs when an adjustment is created.
   */
  export type EventAdjustmentCreated = EventBase<
    "adjustment.created",
    Adjustment
  >;

  /**
   * Occurs when an adjustment is updated.
   */
  export type EventAdjustmentUpdated = EventBase<
    "adjustment.updated",
    Adjustment
  >;
}
