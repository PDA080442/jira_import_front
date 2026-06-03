<template>
  <div class="register-form">
    <div class="register-form__header">
      <AuthLogo variant="register" />

      <h1 class="register-form__title text-h5 font-weight-bold">Создайте аккаунт</h1>
      <p class="register-form__subtitle text-body-2 auth-text-muted">
        Зарегистрируйтесь, чтобы начать импортировать ваши задачи и управлять проектами
      </p>

      <div v-if="error" class="register-form__error mt-4" role="alert" aria-live="assertive">
        <v-alert
          type="error"
          variant="tonal"
          density="comfortable"
          closable
          @click:close="clearError"
        >
          {{ error }}
        </v-alert>
        <v-btn
          variant="text"
          color="error"
          class="text-none register-form__retry-btn"
          prepend-icon="mdi-refresh"
          :disabled="loading"
          @click="handleRetry"
        >
          Повторить
        </v-btn>
      </div>
    </div>

    <v-form class="register-form__form" @submit.prevent="handleSubmit">
      <div class="register-form__fields">
        <AuthTextField
          v-model="name"
          label="Имя"
          compact
          autocomplete="name"
          placeholder="Введите ваше имя"
          prepend-inner-icon="mdi-account-outline"
          :disabled="loading"
          :error-messages="fieldErrors.name"
        />

        <AuthTextField
          v-model="email"
          label="Email"
          compact
          type="email"
          autocomplete="email"
          placeholder="Введите ваш email"
          prepend-inner-icon="mdi-email-outline"
          :disabled="loading"
          :error-messages="fieldErrors.email"
        />

        <AuthTextField
          v-model="password"
          label="Пароль"
          compact
          :type="showPassword ? 'text' : 'password'"
          autocomplete="new-password"
          placeholder="Введите пароль"
          prepend-inner-icon="mdi-lock-outline"
          :disabled="loading"
          :error-messages="fieldErrors.password"
        >
          <template #append-inner>
            <v-btn
              variant="text"
              size="small"
              class="text-none auth-field__toggle px-1"
              :disabled="loading"
              @click="showPassword = !showPassword"
            >
              <v-icon :icon="showPassword ? 'mdi-eye-off-outline' : 'mdi-eye-outline'" />
            </v-btn>
          </template>
        </AuthTextField>

        <AuthTextField
          v-model="passwordConfirm"
          label="Подтверждение пароля"
          compact
          :type="showPasswordConfirm ? 'text' : 'password'"
          autocomplete="new-password"
          placeholder="Повторите пароль"
          prepend-inner-icon="mdi-lock-outline"
          :disabled="loading"
          :error-messages="fieldErrors.passwordConfirm"
        >
          <template #append-inner>
            <v-btn
              variant="text"
              size="small"
              class="text-none auth-field__toggle px-1"
              :disabled="loading"
              @click="showPasswordConfirm = !showPasswordConfirm"
            >
              <v-icon :icon="showPasswordConfirm ? 'mdi-eye-off-outline' : 'mdi-eye-outline'" />
            </v-btn>
          </template>
        </AuthTextField>
      </div>

      <div class="register-form__actions">
        <v-checkbox
          v-model="termsAccepted"
          :disabled="loading"
          :error-messages="fieldErrors.terms"
          hide-details="auto"
          class="register-form__checkbox"
        >
          <template #label>
            <span class="text-body-2 auth-text-muted">
              Я принимаю условия
              <a href="#" class="auth-link--primary" @click.prevent>Пользовательского соглашения</a>
              и
              <a href="#" class="auth-link--primary" @click.prevent>Политики конфиденциальности</a>
            </span>
          </template>
        </v-checkbox>

        <v-btn
          type="submit"
          color="primary"
          size="large"
          block
          class="text-none"
          :loading="loading"
        >
          Зарегистрироваться
        </v-btn>
      </div>
    </v-form>

    <p class="register-form__footer text-body-2 text-center auth-text-muted">
      Уже есть аккаунт?
      <RouterLink to="/auth/login" class="auth-link--primary font-weight-medium">
        Войти
      </RouterLink>
    </p>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink } from 'vue-router'

import AuthLogo from '@/components/auth/AuthLogo.vue'
import AuthTextField from '@/components/auth/AuthTextField.vue'
import { useAuthMock } from '@/composables/useAuthMock'

const name = ref('')
const email = ref('')
const password = ref('')
const passwordConfirm = ref('')
const termsAccepted = ref(false)
const showPassword = ref(false)
const showPasswordConfirm = ref(false)

const { loading, error, fieldErrors, handleRegister, clearError } = useAuthMock()

const handleSubmit = async () => {
  await handleRegister({
    name: name.value,
    email: email.value,
    password: password.value,
    passwordConfirm: passwordConfirm.value,
    termsAccepted: termsAccepted.value,
  })
}

const handleRetry = async () => {
  await handleSubmit()
}
</script>

<style scoped>
.register-form {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 100%;
}

.register-form__header {
  flex-shrink: 0;
}

.register-form__title {
  margin-top: 8px;
  margin-bottom: 8px;
  font-size: 1.5rem;
  font-weight: 700;
  text-align: center;
}

.register-form__subtitle {
  margin-bottom: 0;
  text-align: center;
}

.register-form__error {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 8px;
}

.register-form__error :deep(.v-alert) {
  flex: 1;
  min-width: 0;
}

.register-form__retry-btn {
  flex-shrink: 0;
  margin-top: 4px;
}

.register-form__form {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
  margin-top: 20px;
}

.register-form__fields {
  gap: 10px;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
}

.register-form__actions {
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 16px;
}

.register-form__checkbox {
  margin: 0;
}

.register-form__footer {
  flex-shrink: 0;
  margin-top: auto;
  padding-top: 24px;
}
</style>
