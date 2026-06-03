export type HealthStatus = 'ok' | string

export interface HealthResponse {
  status: HealthStatus
}

export interface ReadinessCheckResult {
  status: HealthStatus
  detail: string
}

export interface ReadinessResponse {
  status: HealthStatus
  checks: Record<string, ReadinessCheckResult>
}
