<template>
  <div class="login-form">
    <AuthLogo variant="card" />

    <div v-if="error" class="login-form__error-banner mb-4" role="alert" aria-live="assertive">
      <div class="login-form__error-content">
        <v-icon icon="mdi-alert-circle" color="white" size="20" class="mr-2" />
        <span>{{ error }}</span>
      </div>
      <v-btn
        variant="text"
        class="text-none login-form__retry-btn"
        aria-label="Повторить попытку входа"
        :disabled="loading"
        @click="handleRetry"
      >
        <v-icon icon="mdi-refresh" size="18" class="mr-1" />
        Повторить
      </v-btn>
    </div>

    <v-form @submit.prevent="handleSubmit">
      <AuthTextField
        v-model="email"
        label="Email"
        type="email"
        autocomplete="email"
        placeholder="you@example.com"
        prepend-inner-icon="mdi-email-outline"
        :disabled="loading"
      />

      <AuthTextField
        v-model="password"
        label="Пароль"
        :type="showPassword ? 'text' : 'password'"
        autocomplete="current-password"
        placeholder="••••••••"
        prepend-inner-icon="mdi-lock-outline"
        :disabled="loading"
      >
        <template #append-inner>
          <v-btn
            variant="text"
            size="small"
            class="text-none auth-field__toggle"
            :disabled="loading"
            @click="showPassword = !showPassword"
          >
            <v-icon
              :icon="showPassword ? 'mdi-eye-off-outline' : 'mdi-eye-outline'"
              size="18"
              class="mr-1"
            />
            {{ showPassword ? 'Скрыть' : 'Показать' }}
          </v-btn>
        </template>
      </AuthTextField>

      <v-btn
        type="submit"
        color="primary"
        size="large"
        block
        class="text-none mt-2"
        :loading="loading"
      >
        Войти
      </v-btn>
    </v-form>

    <AuthDivider />

    <div class="login-form__links">
      <RouterLink to="/auth/forgot-password" class="auth-link login-form__link">
        <v-icon icon="mdi-lock-reset" size="18" />
        Забыли пароль?
      </RouterLink>

      <v-divider />

      <RouterLink to="/auth/register" class="auth-link login-form__link">
        <v-icon icon="mdi-account-plus-outline" size="18" />
        Создать аккаунт
      </RouterLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink } from 'vue-router'

import AuthDivider from '@/components/auth/AuthDivider.vue'
import AuthLogo from '@/components/auth/AuthLogo.vue'
import AuthTextField from '@/components/auth/AuthTextField.vue'
import { useAuthMock } from '@/composables/useAuthMock'

const email = ref('demo@example.com')
const password = ref('demo1234')
const showPassword = ref(false)

const { loading, error, handleLogin } = useAuthMock()

const handleSubmit = async () => {
  await handleLogin({
    email: email.value,
    password: password.value,
  })
}

const handleRetry = async () => {
  await handleSubmit()
}
</script>

<style scoped>
.login-form__error-banner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 12px 16px;
  border-radius: 12px;
  background: #b91c1c;
  color: #ffffff;
}

.login-form__error-content {
  display: flex;
  align-items: center;
  font-size: 0.875rem;
  font-weight: 500;
}

.login-form__retry-btn {
  color: #ffffff !important;
  flex-shrink: 0;
}

.login-form__links {
  display: flex;
  flex-direction: column;
}

.login-form__link {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 0;
  font-size: 0.9375rem;
}
</style>
