import type { ApiUuid, JwtTokenPair, MessageResponse, RefreshTokenPayload } from './common'

/** `POST /api/auth/login/` */
export interface LoginRequest {
  email: string
  password: string
}

export type LoginResponse = JwtTokenPair

/** `POST /api/auth/register/` */
export interface RegisterRequest {
  email: string
  password: string
  password_confirm: string
}

export interface RegisterResponse {
  id: ApiUuid
  email: string
}

/** `POST /api/auth/verify-email/` */
export interface VerifyEmailRequest {
  token: string
}

export type VerifyEmailResponse = MessageResponse

/** `POST /api/auth/password/reset/` */
export interface PasswordResetRequest {
  email: string
}

export type PasswordResetResponse = MessageResponse

/** `POST /api/auth/password/confirm/` */
export interface PasswordConfirmRequest {
  token: string
  password: string
  password_confirm: string
}

export type PasswordConfirmResponse = MessageResponse

/** `POST /api/auth/logout/` — body only; response is `204 No Content`. */
export type LogoutRequest = RefreshTokenPayload
