const MOCK_DELAY_MS = 800

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

export type LoginResult =
  | { ok: true; user: { email: string; name: string } }
  | { ok: false; message: string }

export type RegisterResult =
  | { ok: true; user: { email: string; name: string } }
  | { ok: false; message?: string; fieldErrors?: Record<string, string> }

export type PasswordResetResult = { ok: true; message: string } | { ok: false; message: string }

export const MOCK_USERS: MockUser[] = [
  {
    email: 'demo@example.com',
    password: 'demo1234',
    name: 'Demo User',
  },
]

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

  return {
    ok: true,
    message: 'Если аккаунт существует, мы отправим вам письмо со ссылкой для сброса пароля.',
  }
}
