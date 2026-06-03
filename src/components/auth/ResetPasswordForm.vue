<template>
  <div class="reset-password-form">
    <div v-if="tokenInvalid" class="reset-password-form__invalid text-center">
      <div class="reset-password-form__icon reset-password-form__icon--error">
        <v-icon icon="mdi-link-off" color="error" size="28" />
      </div>

      <h1 class="reset-password-form__title">Ссылка недействительна</h1>
      <p class="reset-password-form__desc auth-text-muted">
        Ссылка для сброса пароля истекла или уже была использована.
      </p>

      <RouterLink to="/auth/forgot-password" class="auth-link--primary font-weight-medium">
        Запросить новую ссылку
      </RouterLink>
    </div>

    <template v-else-if="successMessage">
      <div class="reset-password-form__hero text-center">
        <div class="reset-password-form__icon">
          <v-icon icon="mdi-check-circle-outline" color="success" size="28" />
        </div>

        <h1 class="reset-password-form__title">Пароль изменён</h1>
        <p class="reset-password-form__desc auth-text-muted">
          {{ successMessage }}
        </p>
      </div>

      <div class="reset-password-form__back text-center">
        <RouterLink to="/auth/login" class="auth-link--primary font-weight-medium">
          Перейти ко входу
        </RouterLink>
      </div>
    </template>

    <template v-else>
      <div class="reset-password-form__hero text-center">
        <div class="reset-password-form__icon">
          <v-icon icon="mdi-lock-reset" color="primary" size="28" />
        </div>

        <h1 class="reset-password-form__title">Новый пароль</h1>
        <p class="reset-password-form__desc auth-text-muted">
          Придумайте новый пароль для вашего аккаунта
        </p>
      </div>

      <v-alert
        v-if="error"
        type="error"
        variant="tonal"
        density="comfortable"
        class="reset-password-form__error"
        closable
        @click:close="clearError"
      >
        {{ error }}
      </v-alert>

      <v-form class="reset-password-form__form" @submit.prevent="handleSubmit">
        <AuthTextField
          v-model="password"
          label="Новый пароль"
          :type="showPassword ? 'text' : 'password'"
          autocomplete="new-password"
          placeholder="Введите новый пароль"
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
          :type="showPasswordConfirm ? 'text' : 'password'"
          autocomplete="new-password"
          placeholder="Повторите пароль"
          prepend-inner-icon="mdi-lock-check-outline"
          :disabled="loading"
          :error-messages="fieldErrors.password_confirm || fieldErrors.passwordConfirm"
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

        <v-btn
          type="submit"
          color="primary"
          size="large"
          block
          class="text-none reset-password-form__submit"
          :loading="loading"
        >
          Сохранить пароль
        </v-btn>
      </v-form>

      <div class="reset-password-form__back text-center">
        <RouterLink to="/auth/login" class="auth-link--primary font-weight-medium">
          Вернуться ко входу
        </RouterLink>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { RouterLink, useRoute } from 'vue-router'

import AuthTextField from '@/components/auth/AuthTextField.vue'
import { useAuth } from '@/composables/useAuth'

const route = useRoute()
const password = ref('')
const passwordConfirm = ref('')
const showPassword = ref(false)
const showPasswordConfirm = ref(false)
const tokenInvalid = ref(false)

const {
  loading,
  error,
  successMessage,
  fieldErrors,
  handleValidateResetToken,
  handleResetPassword,
  clearError,
} = useAuth()

const getToken = () => {
  const token = route.query.token

  return typeof token === 'string' ? token : ''
}

onMounted(async () => {
  const isValid = await handleValidateResetToken(getToken())
  tokenInvalid.value = !isValid
})

const handleSubmit = async () => {
  await handleResetPassword({
    token: getToken(),
    password: password.value,
    passwordConfirm: passwordConfirm.value,
  })
}
</script>

<style scoped>
.reset-password-form {
  display: flex;
  flex-direction: column;
}

.reset-password-form__icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 64px;
  height: 64px;
  margin: 0 auto 20px;
  border-radius: 50%;
  background: #ecfdf5;
}

.reset-password-form__icon--error {
  background: #fef2f2;
}

.reset-password-form__title {
  margin-bottom: 12px;
  font-size: 1.25rem;
  font-weight: 700;
  line-height: 1.3;
  color: #1c1917;
}

.reset-password-form__desc {
  max-width: 340px;
  margin: 0 auto;
  font-size: 0.875rem;
  line-height: 1.5;
}

.reset-password-form__invalid .reset-password-form__desc {
  margin-bottom: 20px;
}

.reset-password-form__error {
  margin-top: 16px;
  text-align: start;
}

.reset-password-form__form {
  margin-top: 28px;
}

.reset-password-form__submit {
  margin-top: 8px;
}

.reset-password-form__back {
  margin-top: 16px;
}
</style>
