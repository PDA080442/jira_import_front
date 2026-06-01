<template>
  <div class="forgot-password-form">
    <div class="forgot-password-form__header text-center">
      <div class="auth-icon-circle mx-auto mb-6">
        <v-icon icon="mdi-email-outline" color="primary" size="32" />
      </div>

      <h1 class="text-h5 font-weight-bold mb-3">Восстановление пароля</h1>
      <p class="text-body-2 auth-text-muted px-sm-4">
        Введите email, связанный с вашим аккаунтом. Мы отправим вам ссылку для сброса пароля.
      </p>
    </div>

    <v-alert
      v-if="error"
      type="error"
      variant="tonal"
      density="comfortable"
      class="mt-4 text-start"
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

    <div class="forgot-password-form__footer text-center">
      <RouterLink to="/auth/login" class="auth-link--primary font-weight-medium">
        Вернуться ко входу
      </RouterLink>

      <div v-if="successMessage" class="auth-success-box mt-6">
        <v-icon icon="mdi-check-circle" color="success" size="22" class="flex-shrink-0 mt-1" />
        <span class="text-body-2">{{ successMessage }}</span>
      </div>
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
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 100%;
}

.forgot-password-form__header {
  flex-shrink: 0;
}

.forgot-password-form__form {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 24px;
  min-height: 0;
  margin-top: 24px;
}

.forgot-password-form__submit {
  flex-shrink: 0;
}

.forgot-password-form__footer {
  flex-shrink: 0;
  margin-top: auto;
  padding-top: 24px;
}
</style>
