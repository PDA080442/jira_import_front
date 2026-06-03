import type { Method } from 'axios'

import { apiClient, parseApiError } from '@/api/client'
import type { ApiRequestHeaders } from '@/types'

export interface ApiCallOptions {
  headers?: ApiRequestHeaders
  params?: Record<string, unknown>
}

export function useApi(basePath = '') {
  const buildUrl = (path: string) => `${basePath}${path}`

  async function request<T>(
    path: string,
    options: {
      method: Method
      data?: unknown
      params?: Record<string, unknown>
      headers?: ApiRequestHeaders
    },
  ): Promise<T> {
    try {
      const response = await apiClient.request<T>({
        method: options.method,
        url: buildUrl(path),
        data: options.data,
        params: options.params,
        headers: options.headers as Record<string, string> | undefined,
      })

      return response.data as T
    } catch (error) {
      throw parseApiError(error)
    }
  }

  function get<T>(path: string, options?: ApiCallOptions): Promise<T> {
    return request<T>(path, {
      method: 'get',
      params: options?.params,
      headers: options?.headers,
    })
  }

  function post<T>(path: string, data?: unknown, options?: ApiCallOptions): Promise<T> {
    return request<T>(path, {
      method: 'post',
      data,
      headers: options?.headers,
    })
  }

  function patch<T>(path: string, data?: unknown, options?: ApiCallOptions): Promise<T> {
    return request<T>(path, {
      method: 'patch',
      data,
      headers: options?.headers,
    })
  }

  function del<T = void>(path: string, options?: ApiCallOptions): Promise<T> {
    return request<T>(path, {
      method: 'delete',
      headers: options?.headers,
    })
  }

  /** @deprecated Prefer typed get/post/patch/delete helpers. */
  async function call(path: string, data: object, method: Method = 'get'): Promise<unknown> {
    const normalizedMethod = method.toLowerCase()

    return request(path, {
      method,
      data: normalizedMethod === 'get' ? undefined : data,
      params: normalizedMethod === 'get' ? (data as Record<string, unknown>) : undefined,
    })
  }

  return {
    get,
    post,
    patch,
    delete: del,
    call,
    request,
  }
}
