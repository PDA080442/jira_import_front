<template>
  <div class="forgot-password-form text-center">
    <div class="auth-icon-circle mx-auto mb-6">
      <v-icon icon="mdi-email-outline" color="primary" size="32" />
    </div>

    <h1 class="text-h5 font-weight-bold mb-3">Восстановление пароля</h1>
    <p class="text-body-2 auth-text-muted mb-6 px-sm-4">
      Введите email, связанный с вашим аккаунтом. Мы отправим вам ссылку для сброса пароля.
    </p>

    <v-alert
      v-if="error"
      type="error"
      variant="tonal"
      density="comfortable"
      class="mb-4 text-start"
      closable
      @click:close="clearError"
    >
      {{ error }}
    </v-alert>

    <v-form @submit.prevent="handleSubmit">
      <AuthTextField
        v-model="email"
        label="Email"
        type="email"
        autocomplete="email"
        placeholder="name@example.com"
        class="text-start"
        :disabled="loading"
      />

      <v-btn type="submit" color="primary" size="large" block class="text-none" :loading="loading">
        Отправить ссылку
      </v-btn>
    </v-form>

    <div class="mt-4">
      <RouterLink to="/auth/login" class="auth-link--primary font-weight-medium">
        Вернуться ко входу
      </RouterLink>
    </div>

    <div v-if="successMessage" class="auth-success-box mt-6">
      <v-icon icon="mdi-check-circle" color="success" size="22" class="flex-shrink-0 mt-1" />
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
