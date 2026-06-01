<template>
  <AuthLayout>
    <AuthCard :max-width="500">
      <RegisterForm />
    </AuthCard>
  </AuthLayout>
</template>

<script setup lang="ts">
import AuthCard from '@/components/auth/AuthCard.vue'
import RegisterForm from '@/components/auth/RegisterForm.vue'
import AuthLayout from '@/layouts/AuthLayout.vue'
</script>
