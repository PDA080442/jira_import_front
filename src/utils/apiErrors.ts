import { isApiRequestError } from '@/api/client'
import type { FieldErrors } from '@/types'

export const mapFieldErrorsToRecord = (fieldErrors: FieldErrors): Record<string, string> => {
  const result: Record<string, string> = {}

  for (const [field, messages] of Object.entries(fieldErrors)) {
    if (messages[0]) {
      result[field] = messages[0]
    }
  }

  return result
}

export const getApiErrorMessage = (error: unknown, fallback = 'Произошла ошибка'): string => {
  if (isApiRequestError(error)) {
    return error.body.message
  }

  if (error instanceof Error) {
    return error.message
  }

  return fallback
}

export const applyApiError = (
  error: unknown,
  setError: (message: string) => void,
  setFieldErrors: (errors: Record<string, string>) => void,
  fallback = 'Произошла ошибка',
): void => {
  if (isApiRequestError(error)) {
    setError(error.body.message)
    setFieldErrors(mapFieldErrorsToRecord(error.body.fieldErrors))
    return
  }

  setError(getApiErrorMessage(error, fallback))
}
