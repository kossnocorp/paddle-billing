import type { Paddle } from "../types";

/**
 * The webhooks Paddle types namespace. Contains all the types related to
 * the Paddle webhooks.
 */
export namespace PaddleWebhooks {
  /**
   * Event alias. Lists all possible events.
   */
  export type Event =
    | EventSubscription
    | EventTransaction
    | EventProduct
    | EventPrice
    | EventAddress
    | EventAdjustment
    | EventBusiness
    | EventCustomer;

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
   * Event ID.
   */
  export type EventId = `evt_${string}`;

  /**
   * Notification ID.
   */
  export type NotificationId = `ntf_${string}`;

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
    SubscriptionItemData extends Paddle.CustomData = Paddle.CustomData,
    SubscriptionData extends Paddle.CustomData = Paddle.CustomData
  > = EventBase<
    "subscription.activated",
    Paddle.Subscription<SubscriptionItemData, SubscriptionData>
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
    SubscriptionItemData extends Paddle.CustomData = Paddle.CustomData,
    SubscriptionData extends Paddle.CustomData = Paddle.CustomData
  > = EventBase<
    "subscription.canceled",
    Paddle.Subscription<SubscriptionItemData, SubscriptionData>
  >;

  /**
   * Occurs when a subscription is created.
   *
   * subscription.trialing or subscription.activated typically follow.
   */
  export type EventSubscriptionCreated<
    SubscriptionItemData extends Paddle.CustomData = Paddle.CustomData,
    SubscriptionData extends Paddle.CustomData = Paddle.CustomData
  > = EventBase<
    "subscription.created",
    Paddle.Subscription<SubscriptionItemData, SubscriptionData>
  >;

  /**
   * Occurs when a subscription has an unpaid transaction. Its status changes
   * to past_due.
   */
  export type EventSubscriptionPastDue<
    SubscriptionItemData extends Paddle.CustomData = Paddle.CustomData,
    SubscriptionData extends Paddle.CustomData = Paddle.CustomData
  > = EventBase<
    "subscription.past_due",
    Paddle.Subscription<SubscriptionItemData, SubscriptionData>
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
    SubscriptionItemData extends Paddle.CustomData = Paddle.CustomData,
    SubscriptionData extends Paddle.CustomData = Paddle.CustomData
  > = EventBase<
    "subscription.paused",
    Paddle.Subscription<SubscriptionItemData, SubscriptionData>
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
    SubscriptionItemData extends Paddle.CustomData = Paddle.CustomData,
    SubscriptionData extends Paddle.CustomData = Paddle.CustomData
  > = EventBase<
    "subscription.resumed",
    Paddle.Subscription<SubscriptionItemData, SubscriptionData>
  >;

  /**
   * Occurs when a subscription enters trial period.
   */
  export type EventSubscriptionTrialing<
    SubscriptionItemData extends Paddle.CustomData = Paddle.CustomData,
    SubscriptionData extends Paddle.CustomData = Paddle.CustomData
  > = EventBase<
    "subscription.trialing",
    Paddle.Subscription<SubscriptionItemData, SubscriptionData>
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
    SubscriptionItemData extends Paddle.CustomData = Paddle.CustomData,
    SubscriptionData extends Paddle.CustomData = Paddle.CustomData
  > = EventBase<
    "subscription.updated",
    Paddle.Subscription<SubscriptionItemData, SubscriptionData>
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
    PriceData extends Paddle.CustomData = Paddle.CustomData,
    TransactionData extends Paddle.CustomData = Paddle.CustomData
  > = EventBase<
    "transaction.billed",
    Paddle.Transaction<PriceData, TransactionData>
  >;

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
    PriceData extends Paddle.CustomData = Paddle.CustomData,
    TransactionData extends Paddle.CustomData = Paddle.CustomData
  > = EventBase<
    "transaction.canceled",
    Paddle.Transaction<PriceData, TransactionData>
  >;

  /**
   * Occurs when a transaction is completed. Its status field changes
   * to completed.
   */
  export type EventTransactionCompleted<
    PriceData extends Paddle.CustomData = Paddle.CustomData,
    TransactionData extends Paddle.CustomData = Paddle.CustomData
  > = EventBase<
    "transaction.completed",
    Paddle.Transaction<PriceData, TransactionData>
  >;

  /**
   * Occurs when a transaction is created.
   */
  export type EventTransactionCreated<
    PriceData extends Paddle.CustomData = Paddle.CustomData,
    TransactionData extends Paddle.CustomData = Paddle.CustomData
  > = EventBase<
    "transaction.created",
    Paddle.Transaction<PriceData, TransactionData>
  >;

  /**
   * Occurs when a transaction becomes past due. Its status field changes
   * to past_due.
   */
  export type EventTransactionPastDue<
    PriceData extends Paddle.CustomData = Paddle.CustomData,
    TransactionData extends Paddle.CustomData = Paddle.CustomData
  > = EventBase<
    "transaction.past_due",
    Paddle.Transaction<PriceData, TransactionData>
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
    PriceData extends Paddle.CustomData = Paddle.CustomData,
    TransactionData extends Paddle.CustomData = Paddle.CustomData
  > = EventBase<
    "transaction.payment_failed",
    Paddle.Transaction<PriceData, TransactionData>
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
    PriceData extends Paddle.CustomData = Paddle.CustomData,
    TransactionData extends Paddle.CustomData = Paddle.CustomData
  > = EventBase<
    "transaction.ready",
    Paddle.Transaction<PriceData, TransactionData>
  >;

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
    PriceData extends Paddle.CustomData = Paddle.CustomData,
    TransactionData extends Paddle.CustomData = Paddle.CustomData
  > = EventBase<
    "transaction.updated",
    Paddle.Transaction<PriceData, TransactionData>
  >;

  /**
   * Product event alias.
   */
  export type EventProduct = EventProductCreated | EventProductUpdated;

  /**
   * Occurs when a product is created.
   */
  export type EventProductCreated<
    ProductData extends Paddle.CustomData = Paddle.CustomData
  > = EventBase<"product.created", Paddle.Product<ProductData>>;

  /**
   * Occurs when a product is updated.
   */
  export type EventProductUpdated<
    ProductData extends Paddle.CustomData = Paddle.CustomData
  > = EventBase<"product.updated", Paddle.Product<ProductData>>;

  /**
   * Price event alias.
   */
  export type EventPrice = EventPriceCreated | EventPriceUpdated;

  /**
   * Occurs when a price is created.
   */
  export type EventPriceCreated<
    PriceData extends Paddle.CustomData = Paddle.CustomData
  > = EventBase<"price.created", Paddle.Price<PriceData>>;

  /**
   * Occurs when a price is updated.
   */
  export type EventPriceUpdated<
    PriceData extends Paddle.CustomData = Paddle.CustomData
  > = EventBase<"price.updated", Paddle.Price<PriceData>>;

  /**
   * Address event alias.
   */
  export type EventAddress = EventAddressCreated | EventAddressUpdated;

  /**
   * Occurs when an address is created.
   */
  export type EventAddressCreated = EventBase<
    "address.created",
    Paddle.Address
  >;

  /**'
   * Occurs when an address is updated.
   */
  export type EventAddressUpdated = EventBase<
    "address.updated",
    Paddle.Address
  >;

  /**
   * Adjustments event alias.
   */
  export type EventAdjustment = EventAdjustmentCreated | EventAdjustmentUpdated;

  /**
   * Occurs when an adjustment is created.
   */
  export type EventAdjustmentCreated = EventBase<
    "adjustment.created",
    Paddle.Adjustment
  >;

  /**
   * Occurs when an adjustment is updated.
   */
  export type EventAdjustmentUpdated = EventBase<
    "adjustment.updated",
    Paddle.Adjustment
  >;

  /**
   * Businesses event alias.
   */
  export type EventBusiness = EventBusinessCreated | EventBusinessUpdated;

  /**
   * Occurs when a business is created.
   */
  export type EventBusinessCreated = EventBase<
    "business.created",
    Paddle.Business
  >;

  /**
   * Occurs when a business is updated.
   */
  export type EventBusinessUpdated = EventBase<
    "business.updated",
    Paddle.Business
  >;

  /**
   * Customer event alias.
   */
  export type EventCustomer = EventCustomerCreated | EventCustomerUpdated;

  /**
   * Occurs when a customer is created.
   */
  export type EventCustomerCreated = EventBase<
    "customer.created",
    Paddle.Customer
  >;

  /**
   * Occurs when a customer is updated.
   */
  export type EventCustomerUpdated = EventBase<
    "customer.updated",
    Paddle.Customer
  >;
}
