/** UUID string returned by the API (e.g. `550e8400-e29b-41d4-a716-446655440000`). */
export type ApiUuid = string

/** ISO 8601 datetime string from the API. */
export type IsoDateTimeString = string

/**
 * Optional correlation id for request tracing.
 * If omitted, the server generates one and returns it in the response header.
 */
export interface ApiRequestHeaders {
  'X-Trace-Id'?: string
}

export type ApiErrorCode =
  | 'UNAUTHORIZED'
  | 'INVALID_CREDENTIALS'
  | 'AUTHENTICATION_FAILED'
  | 'EMAIL_NOT_VERIFIED'
  | 'VALIDATION_ERROR'
  | 'TOKEN_INVALID'
  | 'TOKEN_EXPIRED'
  | 'FORBIDDEN'
  | 'NOT_FOUND'

export type FieldErrors = Record<string, string[]>

/** Standard error body for 4xx responses. */
export interface ApiErrorResponse {
  traceId: ApiUuid
  code: ApiErrorCode
  message: string
  fieldErrors: FieldErrors
}

/** Generic `{ message: string }` success payload. */
export interface MessageResponse {
  message: string
}

/** JWT access + refresh pair (login). */
export interface JwtTokenPair {
  access: string
  refresh: string
}

/** Body for refresh and logout endpoints. */
export interface RefreshTokenPayload {
  refresh: string
}

/** Response from `POST /api/auth/refresh/`. */
export interface AccessTokenResponse {
  access: string
}
