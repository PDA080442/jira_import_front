const MOCK_DELAY_MS = 800
export const MOCK_RESET_TOKEN = 'demo-reset-token'

export interface MockUser {
  email: string
  password: string
  name: string
}

export interface RegisterPayload {
  name: string
  email: string
  password: string
  passwordConfirm: string
  termsAccepted: boolean
}

export interface ResetPasswordPayload {
  token: string
  password: string
  passwordConfirm: string
}

export type LoginResult =
  | { ok: true; user: { email: string; name: string } }
  | { ok: false; message: string }

export type RegisterResult =
  | { ok: true; user: { email: string; name: string } }
  | { ok: false; message?: string; fieldErrors?: Record<string, string> }

export type PasswordResetResult = { ok: true; message: string } | { ok: false; message: string }

export type ValidateResetTokenResult = { ok: true } | { ok: false; message: string }

export type ResetPasswordResult =
  | { ok: true; message: string }
  | { ok: false; message?: string; fieldErrors?: Record<string, string> }

export const MOCK_USERS: MockUser[] = [
  {
    email: 'demo@example.com',
    password: 'demo1234',
    name: 'Demo User',
  },
]

let pendingResetEmail: string | null = null

const delay = (ms = MOCK_DELAY_MS) => new Promise((resolve) => setTimeout(resolve, ms))

export const login = async (email: string, password: string): Promise<LoginResult> => {
  await delay()

  const user = MOCK_USERS.find((item) => item.email === email && item.password === password)

  if (!user) {
    return {
      ok: false,
      message: 'Неверный email или пароль',
    }
  }

  return {
    ok: true,
    user: { email: user.email, name: user.name },
  }
}

export const register = async (payload: RegisterPayload): Promise<RegisterResult> => {
  const { name, email, password, passwordConfirm, termsAccepted } = payload

  await delay()

  const fieldErrors: Record<string, string> = {}

  if (!name?.trim()) {
    fieldErrors.name = 'Введите имя'
  }

  if (!email?.trim()) {
    fieldErrors.email = 'Введите email'
  }

  if (!password) {
    fieldErrors.password = 'Введите пароль'
  }

  if (password !== passwordConfirm) {
    fieldErrors.passwordConfirm = 'Пароли не совпадают'
  }

  if (!termsAccepted) {
    fieldErrors.terms = 'Примите условия соглашения'
  }

  if (Object.keys(fieldErrors).length > 0) {
    return { ok: false, fieldErrors }
  }

  const exists = MOCK_USERS.some((item) => item.email === email)

  if (exists) {
    return {
      ok: false,
      message: 'Пользователь с таким email уже существует',
    }
  }

  MOCK_USERS.push({ email, password, name: name.trim() })

  return {
    ok: true,
    user: { email, name: name.trim() },
  }
}

export const requestPasswordReset = async (email: string): Promise<PasswordResetResult> => {
  await delay()

  if (!email?.trim()) {
    return {
      ok: false,
      message: 'Введите email',
    }
  }

  pendingResetEmail = email.trim()

  return {
    ok: true,
    message: 'Если аккаунт существует, мы отправим вам письмо со ссылкой для сброса пароля.',
  }
}

export const validateResetToken = async (token: string): Promise<ValidateResetTokenResult> => {
  await delay(300)

  if (!token?.trim()) {
    return {
      ok: false,
      message: 'Ссылка недействительна или истекла',
    }
  }

  if (token !== MOCK_RESET_TOKEN) {
    return {
      ok: false,
      message: 'Ссылка недействительна или истекла',
    }
  }

  if (!pendingResetEmail) {
    pendingResetEmail = MOCK_USERS[0]?.email ?? 'demo@example.com'
  }

  return { ok: true }
}

export const resetPassword = async (
  payload: ResetPasswordPayload,
): Promise<ResetPasswordResult> => {
  const { token, password, passwordConfirm } = payload

  await delay()

  const tokenResult = await validateResetToken(token)

  if (!tokenResult.ok) {
    return { ok: false, message: tokenResult.message }
  }

  const fieldErrors: Record<string, string> = {}

  if (!password) {
    fieldErrors.password = 'Введите пароль'
  }

  if (!passwordConfirm) {
    fieldErrors.passwordConfirm = 'Повторите пароль'
  }

  if (password && passwordConfirm && password !== passwordConfirm) {
    fieldErrors.passwordConfirm = 'Пароли не совпадают'
  }

  if (Object.keys(fieldErrors).length > 0) {
    return { ok: false, fieldErrors }
  }

  const user = MOCK_USERS.find((item) => item.email === pendingResetEmail)

  if (!user) {
    return {
      ok: false,
      message: 'Не удалось найти аккаунт для сброса пароля',
    }
  }

  user.password = password
  pendingResetEmail = null

  return {
    ok: true,
    message: 'Пароль успешно изменён. Теперь вы можете войти с новым паролем.',
  }
}
