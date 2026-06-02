<template>
  <AuthLayout show-header-logo no-scroll>
    <AuthCard :max-width="480">
      <ResetPasswordForm />
    </AuthCard>
  </AuthLayout>
</template>

<script setup lang="ts">
import AuthCard from '@/components/auth/AuthCard.vue'
import ResetPasswordForm from '@/components/auth/ResetPasswordForm.vue'
import AuthLayout from '@/layouts/AuthLayout.vue'
</script>
