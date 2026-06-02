<template>
  <div class="forgot-password-form">
    <div class="forgot-password-form__hero text-center">
      <div class="forgot-password-form__icon">
        <v-icon icon="mdi-email-outline" color="primary" size="28" />
      </div>

      <h1 class="forgot-password-form__title">Восстановление пароля</h1>
      <p class="forgot-password-form__desc auth-text-muted">
        Введите email, связанный с вашим аккаунтом. Мы отправим вам ссылку для сброса пароля.
      </p>
    </div>

    <v-alert
      v-if="error"
      type="error"
      variant="tonal"
      density="comfortable"
      class="forgot-password-form__error"
      closable
      @click:close="clearError"
    >
      {{ error }}
    </v-alert>

    <v-form class="forgot-password-form__form" @submit.prevent="handleSubmit">
      <AuthTextField
        v-model="email"
        label="Email"
        type="email"
        autocomplete="email"
        placeholder="name@example.com"
        :disabled="loading"
      />

      <v-btn
        type="submit"
        color="primary"
        size="large"
        block
        class="text-none forgot-password-form__submit"
        :loading="loading"
      >
        Отправить ссылку
      </v-btn>
    </v-form>

    <div class="forgot-password-form__back text-center">
      <RouterLink to="/auth/login" class="auth-link--primary font-weight-medium">
        Вернуться ко входу
      </RouterLink>
    </div>

    <div v-if="successMessage" class="auth-success-box forgot-password-form__success">
      <v-icon icon="mdi-check-circle" color="success" size="20" class="flex-shrink-0" />
      <span class="text-body-2">{{ successMessage }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink } from 'vue-router'

import AuthTextField from '@/components/auth/AuthTextField.vue'
import { useAuthMock } from '@/composables/useAuthMock'

const email = ref('')

const { loading, error, successMessage, handleForgotPassword, clearError } = useAuthMock()

const handleSubmit = async () => {
  await handleForgotPassword(email.value)
}
</script>

<style scoped>
.forgot-password-form {
  display: flex;
  flex-direction: column;
}

.forgot-password-form__icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 64px;
  height: 64px;
  margin: 0 auto 20px;
  border-radius: 50%;
  background: #ecfdf5;
}

.forgot-password-form__title {
  margin-bottom: 12px;
  font-size: 1.25rem;
  font-weight: 700;
  line-height: 1.3;
  color: #1c1917;
}

.forgot-password-form__desc {
  max-width: 340px;
  margin: 0 auto;
  font-size: 0.875rem;
  line-height: 1.5;
}

.forgot-password-form__error {
  margin-top: 16px;
  text-align: start;
}

.forgot-password-form__form {
  margin-top: 28px;
}

.forgot-password-form__submit {
  margin-top: 8px;
}

.forgot-password-form__back {
  margin-top: 16px;
}

.forgot-password-form__success {
  margin-top: 24px;
}
</style>
