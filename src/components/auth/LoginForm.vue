<template>
  <div class="login-form">
    <div class="login-form__header">
      <AuthLogo variant="card" />

      <v-alert
        v-if="error"
        type="error"
        variant="tonal"
        density="comfortable"
        class="mt-4"
        closable
        @click:close="clearError"
      >
        {{ error }}
      </v-alert>
    </div>

    <v-form class="login-form__form" @submit.prevent="handleSubmit">
      <div class="login-form__fields">
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
      </div>

      <v-btn
        type="submit"
        color="primary"
        size="large"
        block
        class="text-none login-form__submit"
        :loading="loading"
      >
        Войти
      </v-btn>
    </v-form>

    <div class="login-form__footer">
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

const { loading, error, handleLogin, clearError } = useAuthMock()

const handleSubmit = async () => {
  await handleLogin({
    email: email.value,
    password: password.value,
  })
}
</script>

<style scoped>
.login-form {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 100%;
}

.login-form__header {
  flex-shrink: 0;
}

.login-form__form {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-height: 0;
  margin-top: 8px;
}

.login-form__fields {
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  flex: 1;
}

.login-form__submit {
  flex-shrink: 0;
  margin-top: 24px;
}

.login-form__footer {
  flex-shrink: 0;
  margin-top: auto;
  padding-top: 8px;
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
