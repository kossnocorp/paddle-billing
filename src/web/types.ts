import type { PaddleAPI as API } from "../api/types";
import type { Paddle as Core } from "../types";
import type { PaddleUtils as Utils } from "../utils";

/**
 * The web Paddle types namespace. Contains all the types related to Paddle.js.
 */
export namespace PaddleWeb {
  /**
   * Window type with Paddle global.
   */
  export type WindowWithPaddle = Window &
    typeof globalThis & { Paddle: Global<any> };

  /**
   * Global Paddle client present on window.Paddle
   */
  export interface Global<Def extends Core.CustomDataDef> {
    /**
     * Initializes Paddle.js and Retain.
     *
     * @param props - The settings object.
     */
    Setup(
      props: SetupProps<Core.SharedTransactionSubscriptionCustomData<Def>>
    ): void;

    /** The environment API. */
    Environment: Environment;

    /** The checkout API. */
    Checkout: Checkout<Core.SharedTransactionSubscriptionCustomData<Def>>;

    /**
     * Previews localized prices given location information supplied.
     *
     * @param request - The request object to preview.
     *
     * @returns Promise to object of price details for the products
     */
    PricePreview(
      request: Utils.DeepSnakeToCamelCase<API.PreviewPricesBody>
    ): Promise<Utils.DeepSnakeToCamelCase<API.PreviewPricesResponse<Def>>>;

    /** The spinner API. */
    Spinner: Spinner;

    /** The library status */
    Status: Status;
  }

  /**
   * The environment interface.
   */
  export interface Environment {
    /**
     * Sets environment to sandbox or live.
     *
     * @param environment - The environment to set.
     */
    set(environment: Core.Environment): void;
  }

  /**
   * The checkout interface.
   */
  export interface Checkout<Data extends Core.CustomData> {
    /**
     * Opens a checkout with settings, items, and customer information.
     *
     * @param props - The checkout props.
     */
    open(props: CheckoutProps<Data>): void;

    /**
     * Updates the list of items, discounts, customer, address, and business
     * for an open checkout.
     *
     * @param props - The checkout props.
     */
    updateCheckout(props: UpdateCheckoutProps): void;

    /**
     * Updates the list of items for an open checkout.
     *
     * @param items - List of items for this checkout.
     */
    updateItems(items: Items): void;

    /**
     * Closes an opened checkout.
     */
    close(): void;
  }

  /**
   * The checkout discount.
   */
  export type CheckoutDiscount = CheckoutDiscountCode | CheckoutDiscountId;

  /**
   * The checkout discount code.
   */
  export interface CheckoutDiscountCode {
    /** Discount code to apply to this checkout. Use to pre-populate a discount.
     * Pass either discountCode or discountId. */
    discountCode?: string | undefined;
  }

  /**
   * The checkout discount id.
   */
  export interface CheckoutDiscountId {
    /** Paddle ID of a discount to apply to this checkout. Use to pre-populate
     * a discount. Pass either discountCode or discountId. */
    discountId?: Core.DiscountId | undefined;
  }

  /**
   * The checkout open function props.
   */
  export type CheckoutProps<Data extends Core.CustomData> = {
    /** Set general checkout settings. */
    settings?: CheckoutSettingsObject | undefined;
  } & CheckoutPropsPayload<Data> &
    CheckoutDiscount;

  /**
   * The checkout open function items.
   */
  export type CheckoutPropsPayload<Data extends Core.CustomData> =
    | Utils.MakeNullableFieldsOptional<CheckoutPropsItems<Data>>
    | CheckoutPropsTransactionId;

  /**
   * The checkout open function items list.
   */
  export interface CheckoutPropsItems<Data extends Core.CustomData> {
    /** List of items for this checkout. You must pass at least one item. Use
     * the updateItems() or updateCheckout() method to update the items list. */
    items: Items;
    /** Information about the customer for this checkout. Pass either
     * an existing id, or the other fields. */
    customer?: CheckoutCustomer | undefined;
    /** Custom key-value data to include with the checkout. Must be valid JSON
     * and contain at least one key. */
    customData: Data;
  }

  /**
   * The checkout open function transaction id.
   */
  export interface CheckoutPropsTransactionId {
    // Paddle ID of an existing transaction to use for this checkout. Use this instead of an items array to create a checkout for a transaction you previously created.
    transactionId: Core.TransactionId;
  }

  /**
   * The checkout customer.
   */
  export type CheckoutCustomer =
    | CheckoutCustomerId
    | CheckoutCustomerEmail
    | CheckoutCustomerPayload;

  /**
   * The checkout customer id.
   */
  export interface CheckoutCustomerId {
    /** Paddle ID of the customer for this checkout. Use if you know
     * the customer, like if they're authenticated and making a change
     * to their subscription. */
    id: Core.CustomerId;
  }

  /**
   * The checkout email payload
   */
  export interface CheckoutCustomerEmail {
    /** Email address for the customer. */
    email?: string | undefined;
  }

  /**
   * The checkout customer payload
   */
  export interface CheckoutCustomerPayload {
    /** Email address for the customer. */
    email?: string | undefined;
    /** Information about the customer billing address on this checkout. */
    address: CheckoutAddress;
    /** Information about the customer business on this checkout. */
    business: CheckoutBusiness;
  }

  /**
   * The checkout address.
   */
  export type CheckoutAddress = CheckoutAddressId | CheckoutAddressPayload;

  /**
   * The checkout address id.
   */
  export interface CheckoutAddressId {
    /** Paddle ID for the customer address for this checkout. You can't use if
     * you're passing any of the other address fields. */
    id: Core.AddressId;
  }

  /**
   * The checkout address payload.
   */
  export type CheckoutAddressPayload = Omit<Address, "id">;

  /**
   * The checkout business.
   */
  export type CheckoutBusiness = CheckoutBusinessId | CheckoutBusinessPayload;

  /**
   * The checkout business id.
   */
  export interface CheckoutBusinessId {
    /** Paddle ID for the customer business for this checkout. You can't use
     * if you're passing name or taxIdentifier. Requires address. */
    id: Core.BusinessId;
  }

  /**
   * The checkout business payload.
   */
  export type CheckoutBusinessPayload = Omit<Business, "id">;
  /**
   * The updateCheckout function props.
   */
  export type UpdateCheckoutProps = {
    /** List of items for this checkout. You must pass at least one item. Use
     * the updateItems() or updateCheckout)() method to update the items list. */
    items: Items;
    /** Information about the customer for this checkout. Pass either
     * an existing id, or the other fields. */
    customer?: CheckoutCustomer | undefined;
  } & CheckoutDiscount;

  /**
   * The checkout items array. Expects at least one item.
   */
  export type Items = [Item, ...Item[]];

  /**
   * The checkout item.
   */
  export interface Item {
    /** Paddle ID of the price for this item. */
    priceId: Core.PriceId;
    /** Quantity for this line item. */
    quantity?: number;
  }

  /**
   * The spinner interface.
   */
  export interface Spinner {
    /** Shows a loading spinner. */
    show(): void;
    /** Hides a previously called loading spinner. */
    hide(): void;
  }

  /**
   * The library status.
   */
  export interface Status {
    /** The library version. */
    libraryVersion: string;
  }

  /**
   * The setup function props.
   */
  export interface SetupProps<EventData extends Core.CustomData> {
    /** Client-side token for authentication. You can create and manage
     * client-side tokens in Paddle > Developer tools > Authentication. */
    token: string;
    /** Retain API key. Required if using Retain. You can find your key in
     * ProfitWell > Account Settings > Integrations > API keys/Dev Kit. */
    pwAuth?: string | undefined;
    /** Identifier for a logged-in customer for Retain Notifications. Pass
     * either id or email, or an empty object if you don't have a logged-in
     * customer. */
    pwCustomer?: ProfitWellCustomer | undefined;
    /** Set general checkout settings. Settings here apply to all checkouts
     * pened on the page. */
    checkout?: CheckoutSettings | undefined;
    /** Function to call for Paddle.js events. */
    eventCallback?: EventCallback<EventData> | undefined;
  }

  /**
   * The ProfitWell customer identifier.
   */
  export type ProfitWellCustomer =
    | ProfitWellCustomerEmail
    | ProfitWellCustomerId
    | {}; // The customer is not logged in

  /**
   * The ProfitWell customer email identifier.
   */
  export interface ProfitWellCustomerEmail {
    /** Customer email address. */
    email: string;
  }

  /**
   * The ProfitWell customer ID identifier.
   */
  export interface ProfitWellCustomerId {
    /** Customer ID. */
    id: Core.CustomerId;
  }

  /**
   * The checkout settings.
   */
  export interface CheckoutSettings {
    /** The settings object. */
    settings: CheckoutSettingsObject;
  }

  /**
   * The checkout settings object.
   */
  export interface CheckoutSettingsObject {
    /** Display mode for the checkout. */
    displayMode?: DisplayMode | undefined;
    /** Theme for the checkout. */
    theme?: Theme | undefined;
    /** Language for the checkout. */
    locale?: Locale | undefined;
    /** Whether the option to add a tax number is displayed at checkout.
     * Defaults to true. */
    showAddTaxId?: boolean | undefined;
    /** Whether the user can change their email once on the checkout. */
    allowLogout?: boolean | undefined;
    /** Whether the option to add a discount is displayed at checkout.
     * Defaults to true. */
    showAddDiscounts?: boolean | undefined;
    /** Class name of the <div> element where the checkout should be rendered. */
    frameTarget?: string | undefined;
    /** Styles to apply to the checkout <div>. min-width must be set to 286px
     * or above with checkout padding off; 312px with checkout padding on.
     * Use frameInitialHeight to set height. */
    frameStyle?: string | undefined;
    /** Height in pixels of the <div> on load. Do not include px.
     * Recommended 450. */
    frameInitialHeight?: string | undefined;
    /** URL to redirect to on checkout completion. */
    successUrl?: string | undefined;
  }

  /**
   * The checkout display mode.
   */
  export type DisplayMode =
    | "inline" // Inline checkout mode. Checkout embedded as a frame in the page. Requires settings.frameTarget in Paddle.Setup().
    | "overlay"; // Overlay checkout mode. Checkout opens in an overlay.

  /**
   * The checkout theme.
   */
  export type Theme = "light" | "dark";

  /**
   * The checkout locale.
   */
  export type Locale =
    | "ar" // Arabic (العربية)
    | "zh-Hans" // Chinese (Simplified) (简体中文)
    | "da" // Danish (Dansk)
    | "nl" // Dutch (Nederlands)
    | "en" // English (English)
    | "fr" // French (Français)
    | "de" // German (Deutsch)
    | "it" // Italian (Italiano)
    | "ja" // Japanese (日本語)
    | "ko" // Korean (한국어)
    | "no" // Norwegian (Norsk)
    | "pl" // Polish (Polski)
    | "pt" // Portuguese (Português)
    | "ru" // Russian (Русский)
    | "es" // Spanish (Español)
    | "sv"; // Swedish (Svenska)

  /**
   * Customer billing address.
   */
  export interface Address {
    /** Unique Paddle ID for the address related to this checkout, prefixed
     * with add_ */
    id: Core.AddressId;
    /** Two-letter ISO 3166 country code. */
    country_code: Core.CountryCode;
    /** ZIP or postal code of the customer billing address. Required for
     * countries with postal codes. */
    postal_code: string;
    /** First line of the customer billing address. */
    first_line: string;
    /** City of the customer billing address. */
    city: string;
    /** State, county, or region of the customer billing address. */
    region: string;
  }

  /**
   * Customer business.
   */
  export interface Business {
    /** Unique Paddle ID for the business related to this checkout, prefixed
     * with biz_ */
    id: Core.BusinessId;
    /** Name of this business. */
    name: string;
    /** Tax or VAT Number for this business. */
    tax_identifier: string;
  }

  /**
   * Event callback.
   */
  export type EventCallback<EventData extends Core.CustomData> = (
    event: Event<EventData>
  ) => void;

  /**
   * The event data.
   */
  export interface Event<Data extends Core.CustomData> {
    /** The event name. */
    name: EventName;
    /** Event payload. */
    data: EventData<Data>;
  }

  /**
   * The event name.
   */
  export type EventName =
    | "checkout.loaded" // Checkout created and loaded on the page.
    | "checkout.closed" // Checkout closed on the page.
    | "checkout.completed" // Checkout completed successfully.
    | "checkout.items.updated" // Item updated on the checkout. For example, a quantity change.
    | "checkout.items.removed" // Item removed from the checkout.
    | "checkout.customer.created" // Customer created.
    | "checkout.customer.updated" // Customer information updated. This includes business and address information.
    | "checkout.customer.removed" // Customer removed from the checkout, e.g. they logged out.
    | "checkout.payment.selected" // Payment method selected.
    | "checkout.payment.initiated" // Customer attempted payment using the selected payment method.
    | "checkout.payment.failed" // Payment attempt failed.
    | "checkout.discount.applied" // Discount applied to the checkout.
    | "checkout.discount.removed" // Discount removed from the checkout.
    | "checkout.warning" // Warning occurred on the checkout.
    | "checkout.error"; // Error occurred on the checkout.

  /**
   * The event data.
   */
  export interface EventData<Data extends Core.CustomData> {
    /** Unique Paddle ID for this checkout, prefixed with che_. */
    id: Core.CheckoutId;
    /** Unique Paddle ID for the transaction related to this checkout,
     * prefixed with txn_. */
    transaction_id: Core.TransactionId;
    /** Status of this checkout. Mirrors the status of the related
     * transaction. */
    status: Core.TransactionStatus;
    /** Key-value pairs of custom data. Must be valid JSON and contain at least
     * one key. */
    custom_data: Data;
    /** Supported three-letter ISO 4217 currency code for this checkout. */
    currency_code: Core.CurrencyCode;
    /** Information about the customer on this checkout. */
    customer: EventCustomer;
    /** Items to bill for. */
    items: EventItem[];
    /** Financial breakdown of the total for this checkout, calculated
     * by Paddle. */
    totals: EventTotals;
    /** Financial breakdown of the recurring total for this checkout, calculated
     * by Paddle. Only included for recurring items. */
    recurring_totals: EventTotals;
    /** Information about the payment details used on this checkout. */
    payment: EventPayment;
    /** Checkout settings. */
    settings: EventCheckoutSettings;
    /** Information about the discount applied to this checkout. Only included
     * when a discount is applied. */
    discount: EventDiscount | null;
  }

  /**
   * The event customer
   */
  export interface EventCustomer {
    /** Unique Paddle ID for the customer related to this checkout, prefixed
     * with ctm_ */
    id: Core.CustomerId | null;
    /** Email address for the customer. */
    email: string | null;
    /** Information about the customer billing address on this checkout. */
    address: Address | null;
    /** Information about the customer business on this checkout. */
    business: Business | null;
  }

  /**
   * The event item to bill for.
   */
  export interface EventItem {
    /** Unique Paddle ID for a price to bill for, prefixed with pri_. */
    price_id: Core.PriceId;
    /** Related product object for this price. */
    product: EventProduct;
    /** How often this items bills. */
    billing_cycle: Core.TimeInterval | null;
    /** How long the trial period is for this item. */
    trial_period: Core.TimeInterval | null;
    /** Quantity to bill for. */
    quantity: number;
    /** Financial breakdown of the total for this checkout item, calculated
     * by Paddle. */
    totals: EventTotals;
    /** Financial breakdown of the recurring total for this checkout item,
     * calculated by Paddle. Only included for recurring items. */
    recurring_totals: EventTotals;
  }

  /**
   * The product associated with the price for a checkout item.
   */
  export interface EventProduct {
    /** Unique Paddle ID for the product related to the price on this checkout,
     * prefixed with pro_ */
    id: Core.ProductId;
    /** Name of this product. */
    name: string;
    /** Short description for this product. Included on some customer documents,
     * like receipts. */
    description: string | null;
    /** Image for this product. Included in the overlay checkout and on some
     * receipts. */
    image_url: string | null;
  }

  /**
   * The event totals.
   */
  export interface EventTotals {
    /** The total amount obtained from multiplying quantity and unit_price */
    subtotal: number;
    /** The total discount applied to this checkout */
    discount: number;
    /** The total tax applied on the subtotal */
    tax: number;
    /** Sum of subtotal and tax */
    total: number;
    /** Total credits applied to this checkout */
    credit: number;
    /** Amount due after deducting credits from total */
    balance: number;
  }

  /**
   * The event payment.
   */
  export interface EventPayment {
    /** Information about the payment method used for a payment attempt. */
    method_details: EventPaymentMethod | null;
  }

  /**
   * The event payment method details.
   */
  export interface EventPaymentMethod {
    /** Type of payment method used. */
    type: EventPaymentMethodType;
    /** Information about the card used for this checkout. */
    card: EventPaymentMethodCard | null;
  }

  /**
   * The event payment method type.
   */
  export type EventPaymentMethodType =
    | "alipay" // Alipay, popular in China.
    | "apple-pay" // Apple Pay on a supported Apple device.
    | "card" // Credit or debit card.
    | "google-pay" // Google Pay.
    | "ideal" // iDEAL, popular in the Netherlands.
    | "paypal" // PayPal.
    | "wire-transfer" // Wire transfer, sometimes called bank transfer.
    | "none"; // No payment method, or payment method not yet known.

  /**
   * The event payment method card
   */
  export interface EventPaymentMethodCard {
    /** Type of credit or debit card used to pay. */
    type: Core.CardType;
    /** Last four digits of the card number used. */
    last4: string;
    /** Number of the month of the year that this card expires in
     * the format MM. */
    expiry_month: number;
    /** Year that this card expires in the format YYYY. */
    expiry_year: number;
  }

  /**
   * The event checkout settings.
   */
  export interface EventCheckoutSettings {
    /** Display mode for the checkout. */
    displayMode: DisplayMode;
    /** Theme for the checkout. */
    theme: Theme;
  }

  /**
   * The event discount.
   */
  export interface EventDiscount {
    /** Unique Paddle ID for the discount applied to this event, prefixed
     * with dsc_. */
    id: Core.DiscountId;
    /** Code for this discount. */
    code: string | null;
  }
}
