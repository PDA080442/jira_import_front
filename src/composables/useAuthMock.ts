import { ref } from 'vue'
import { useRouter } from 'vue-router'

import {
  login,
  register,
  requestPasswordReset,
  resetPassword,
  validateResetToken,
  type RegisterPayload,
  type ResetPasswordPayload,
} from '@/mocks/auth'

export const useAuthMock = () => {
  const router = useRouter()
  const loading = ref(false)
  const error = ref('')
  const successMessage = ref('')
  const fieldErrors = ref<Record<string, string>>({})

  const resetState = () => {
    error.value = ''
    successMessage.value = ''
    fieldErrors.value = {}
  }

  const clearError = () => {
    error.value = ''
  }

  const handleLogin = async ({ email, password }: { email: string; password: string }) => {
    resetState()
    loading.value = true

    try {
      const result = await login(email, password)

      if (!result.ok) {
        error.value = result.message
        return
      }

      await router.push('/workspace/select')
    } finally {
      loading.value = false
    }
  }

  const handleRegister = async (payload: RegisterPayload) => {
    resetState()
    loading.value = true

    try {
      const result = await register(payload)

      if (!result.ok) {
        if (result.fieldErrors) {
          fieldErrors.value = result.fieldErrors
        }
        if (result.message) {
          error.value = result.message
        }
        return
      }

      await router.push('/workspace/select')
    } finally {
      loading.value = false
    }
  }

  const handleForgotPassword = async (email: string) => {
    resetState()
    loading.value = true

    try {
      const result = await requestPasswordReset(email)

      if (!result.ok) {
        error.value = result.message
        return
      }

      successMessage.value = result.message
    } finally {
      loading.value = false
    }
  }

  const handleValidateResetToken = async (token: string) => {
    resetState()
    loading.value = true

    try {
      const result = await validateResetToken(token)

      if (!result.ok) {
        error.value = result.message
        return false
      }

      return true
    } finally {
      loading.value = false
    }
  }

  const handleResetPassword = async (payload: ResetPasswordPayload) => {
    resetState()
    loading.value = true

    try {
      const result = await resetPassword(payload)

      if (!result.ok) {
        if (result.fieldErrors) {
          fieldErrors.value = result.fieldErrors
        }
        if (result.message) {
          error.value = result.message
        }
        return
      }

      successMessage.value = result.message
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    error,
    successMessage,
    fieldErrors,
    handleLogin,
    handleRegister,
    handleForgotPassword,
    handleValidateResetToken,
    handleResetPassword,
    clearError,
  }
}
