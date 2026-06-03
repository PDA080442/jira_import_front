import { ref } from 'vue'
import { useRouter } from 'vue-router'

import { isApiRequestError } from '@/api/client'
import { setTokens } from '@/api/tokens'
import { useAuthApi, useProfileApi } from '@/composables/Requests'
import { useAuthStore } from '@/stores/auth'
import { applyApiError } from '@/utils/apiErrors'

export interface RegisterFormPayload {
  name: string
  email: string
  password: string
  passwordConfirm: string
  termsAccepted: boolean
}

export interface ResetPasswordFormPayload {
  token: string
  password: string
  passwordConfirm: string
}

export const useAuth = () => {
  const router = useRouter()
  const authStore = useAuthStore()
  const authApi = useAuthApi()
  const profileApi = useProfileApi()

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

  const validateRegisterForm = (payload: RegisterFormPayload): boolean => {
    const errors: Record<string, string> = {}

    if (!payload.name?.trim()) {
      errors.name = 'Введите имя'
    }

    if (!payload.email?.trim()) {
      errors.email = 'Введите email'
    }

    if (!payload.password) {
      errors.password = 'Введите пароль'
    }

    if (payload.password !== payload.passwordConfirm) {
      errors.password_confirm = 'Пароли не совпадают'
    }

    if (!payload.termsAccepted) {
      errors.terms = 'Примите условия соглашения'
    }

    fieldErrors.value = errors
    return Object.keys(errors).length === 0
  }

  const validateResetPasswordForm = (payload: ResetPasswordFormPayload): boolean => {
    const errors: Record<string, string> = {}

    if (!payload.password) {
      errors.password = 'Введите пароль'
    }

    if (payload.password !== payload.passwordConfirm) {
      errors.password_confirm = 'Пароли не совпадают'
    }

    fieldErrors.value = errors
    return Object.keys(errors).length === 0
  }

  const handleLogin = async ({ email, password }: { email: string; password: string }) => {
    resetState()
    loading.value = true

    try {
      const tokens = await authApi.login({ email, password })
      setTokens(tokens.access, tokens.refresh)
      authStore.setProfile(await profileApi.getProfile())
      await router.push('/workspace/select')
    } catch (err) {
      if (isApiRequestError(err) && err.body.code === 'EMAIL_NOT_VERIFIED') {
        error.value = 'Подтвердите email перед входом. Проверьте почту.'
        return
      }

      applyApiError(
        err,
        (message) => {
          error.value = message
        },
        (errors) => {
          fieldErrors.value = errors
        },
        'Неверный email или пароль',
      )
    } finally {
      loading.value = false
    }
  }

  const handleRegister = async (payload: RegisterFormPayload) => {
    resetState()

    if (!validateRegisterForm(payload)) {
      return
    }

    loading.value = true

    try {
      await authApi.register({
        email: payload.email,
        password: payload.password,
        password_confirm: payload.passwordConfirm,
      })

      await router.push('/auth/login')
    } catch (err) {
      applyApiError(
        err,
        (message) => {
          error.value = message
        },
        (errors) => {
          fieldErrors.value = errors
        },
      )
    } finally {
      loading.value = false
    }
  }

  const handleForgotPassword = async (email: string) => {
    resetState()
    loading.value = true

    try {
      const response = await authApi.requestPasswordReset({ email })
      successMessage.value = response.message
    } catch (err) {
      applyApiError(
        err,
        (message) => {
          error.value = message
        },
        (errors) => {
          fieldErrors.value = errors
        },
      )
    } finally {
      loading.value = false
    }
  }

  const handleValidateResetToken = async (token: string) => {
    resetState()

    if (!token.trim()) {
      error.value = 'Ссылка недействительна'
      return false
    }

    return true
  }

  const handleResetPassword = async (payload: ResetPasswordFormPayload) => {
    resetState()

    if (!validateResetPasswordForm(payload)) {
      return
    }

    loading.value = true

    try {
      const response = await authApi.confirmPasswordReset({
        token: payload.token,
        password: payload.password,
        password_confirm: payload.passwordConfirm,
      })

      successMessage.value = response.message
    } catch (err) {
      applyApiError(
        err,
        (message) => {
          error.value = message
        },
        (errors) => {
          fieldErrors.value = errors
        },
      )
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
