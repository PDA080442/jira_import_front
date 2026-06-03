import axios, { AxiosError, isAxiosError } from 'axios'

import type { ApiErrorResponse } from '@/types'

import { getAccessToken } from './tokens'

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? '',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
})

apiClient.interceptors.request.use((config) => {
  const token = getAccessToken()

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

export class ApiRequestError extends Error {
  readonly status: number
  readonly body: ApiErrorResponse

  constructor(status: number, body: ApiErrorResponse) {
    super(body.message)
    this.name = 'ApiRequestError'
    this.status = status
    this.body = body
  }
}

export const isApiRequestError = (error: unknown): error is ApiRequestError =>
  error instanceof ApiRequestError

export const parseApiError = (error: unknown): ApiRequestError | Error => {
  if (isApiRequestError(error)) {
    return error
  }

  if (isAxiosError(error)) {
    const axiosError = error as AxiosError<ApiErrorResponse>
    const status = axiosError.response?.status ?? 0
    const body = axiosError.response?.data

    if (body && typeof body === 'object' && 'code' in body && 'message' in body) {
      return new ApiRequestError(status, body)
    }

    return new Error(axiosError.message || 'Network request failed')
  }

  if (error instanceof Error) {
    return error
  }

  return new Error('Unknown error')
}
