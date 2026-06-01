<template>
  <AuthLayout show-header-logo no-scroll>
    <AuthCard :max-width="480">
      <ForgotPasswordForm />
    </AuthCard>
  </AuthLayout>
</template>

<script setup lang="ts">
import AuthCard from '@/components/auth/AuthCard.vue'
import ForgotPasswordForm from '@/components/auth/ForgotPasswordForm.vue'
import AuthLayout from '@/layouts/AuthLayout.vue'
</script>
