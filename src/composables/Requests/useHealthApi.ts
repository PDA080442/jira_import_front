import type { HealthResponse, ReadinessResponse } from '@/types'

import { useApi } from './useApi'

export function useHealthApi() {
  const api = useApi('')

  return {
    /** `GET /health/` */
    getHealth: (headers?: { 'X-Trace-Id'?: string }) =>
      api.get<HealthResponse>('/health/', { headers }),

    /** `GET /ready/` */
    getReady: (headers?: { 'X-Trace-Id'?: string }) =>
      api.get<ReadinessResponse>('/ready/', { headers }),
  }
}
