/**
 * The API Paddle types namespace. Contains all the types related to the API.
 */
export namespace PaddleAPI {
  /**
   * The error response.
   */
  export interface ErrorResponse extends ResponseBase<Error, MetaBasic> {}

  /**
   * The response error.
   */
  export interface Error {
    /** Type of error encountered. */
    type: ErrorType;
    /** Short snake case string that describes this error. Use to search
     * the error reference. */
    code: string;
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
   * Validation error details.
   */
  export interface ValidationError {
    /** Field where validation error occurred. */
    field: string;
    /** Information about how the field failed validation. */
    message: string;
  }

  /**
   * The response object.
   */
  export interface ResponseBase<Data, Meta> {
    /** The response data object. */
    data: Data;
    /** Information about this response. */
    meta: Meta;
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
