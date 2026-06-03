import type { UpdateUserProfileRequest, UserProfile } from '@/types'

import { useApi } from './useApi'

export function useProfileApi() {
  const api = useApi('/api')

  return {
    /** `GET /api/me/` */
    getProfile: (headers?: { 'X-Trace-Id'?: string }) => api.get<UserProfile>('/me/', { headers }),

    /** `PATCH /api/me/` */
    updateProfile: (body: UpdateUserProfileRequest, headers?: { 'X-Trace-Id'?: string }) =>
      api.patch<UserProfile>('/me/', body, { headers }),
  }
}
