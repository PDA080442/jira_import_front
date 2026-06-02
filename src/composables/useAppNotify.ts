import { reactive } from 'vue'

interface ToastState {
  show: boolean
  title: string
  message: string
}

interface SnackbarState {
  show: boolean
  message: string
}

const toastState = reactive<ToastState>({
  show: false,
  title: '',
  message: '',
})

const snackbarState = reactive<SnackbarState>({
  show: false,
  message: '',
})

let toastTimer: ReturnType<typeof setTimeout> | null = null

export const useAppNotify = () => {
  const showSuccess = (title: string, message = '') => {
    if (toastTimer) {
      clearTimeout(toastTimer)
    }

    toastState.title = title
    toastState.message = message
    toastState.show = true

    toastTimer = setTimeout(() => {
      toastState.show = false
    }, 5000)
  }

  const hideToast = () => {
    toastState.show = false

    if (toastTimer) {
      clearTimeout(toastTimer)
      toastTimer = null
    }
  }

  const showError = (message: string) => {
    snackbarState.message = message
    snackbarState.show = true
  }

  const hideSnackbar = () => {
    snackbarState.show = false
  }

  return {
    toastState,
    snackbarState,
    showSuccess,
    hideToast,
    showError,
    hideSnackbar,
  }
}
