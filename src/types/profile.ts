import type { ApiUuid, IsoDateTimeString } from './common'

/** `GET /api/me/` and `PATCH /api/me/` response. */
export interface UserProfile {
  id: ApiUuid
  email: string
  locale: string
  timezone: string
  notification_preferences: string
  created_at: IsoDateTimeString
  updated_at: IsoDateTimeString
}

/** `PATCH /api/me/` — partial update of profile fields. */
export interface UpdateUserProfileRequest {
  locale?: string
  timezone?: string
  notification_preferences?: string
}
