import type {
  AccessTokenResponse,
  LoginRequest,
  LoginResponse,
  LogoutRequest,
  PasswordConfirmRequest,
  PasswordConfirmResponse,
  PasswordResetRequest,
  PasswordResetResponse,
  RefreshTokenPayload,
  RegisterRequest,
  RegisterResponse,
  VerifyEmailRequest,
  VerifyEmailResponse,
} from '@/types'

import { useApi } from './useApi'

export function useAuthApi() {
  const api = useApi('/api/auth')

  return {
    /** `POST /api/auth/login/` */
    login: (body: LoginRequest) => api.post<LoginResponse>('/login/', body),

    /** `POST /api/auth/register/` */
    register: (body: RegisterRequest) => api.post<RegisterResponse>('/register/', body),

    /** `POST /api/auth/verify-email/` */
    verifyEmail: (body: VerifyEmailRequest) =>
      api.post<VerifyEmailResponse>('/verify-email/', body),

    /** `POST /api/auth/refresh/` */
    refresh: (body: RefreshTokenPayload) => api.post<AccessTokenResponse>('/refresh/', body),

    /** `POST /api/auth/logout/` — `204 No Content` */
    logout: (body: LogoutRequest) => api.post<void>('/logout/', body),

    /** `POST /api/auth/password/reset/` */
    requestPasswordReset: (body: PasswordResetRequest) =>
      api.post<PasswordResetResponse>('/password/reset/', body),

    /** `POST /api/auth/password/confirm/` */
    confirmPasswordReset: (body: PasswordConfirmRequest) =>
      api.post<PasswordConfirmResponse>('/password/confirm/', body),
  }
}
