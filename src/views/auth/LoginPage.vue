<template>
  <AuthLayout no-scroll>
    <AuthCard :max-width="480">
      <LoginForm />
    </AuthCard>
  </AuthLayout>
</template>

<script setup lang="ts">
import AuthCard from '@/components/auth/AuthCard.vue'
import LoginForm from '@/components/auth/LoginForm.vue'
import AuthLayout from '@/layouts/AuthLayout.vue'
</script>
