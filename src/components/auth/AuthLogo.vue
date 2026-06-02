<template>
  <div
    class="auth-logo"
    :class="{
      'auth-logo--card': variant === 'card' || !variant,
      'auth-logo--register': variant === 'register',
      'auth-logo--header': variant === 'header',
    }"
  >
    <img
      :src="logoPrimary"
      alt="Sowline"
      class="auth-logo__image"
      :class="`auth-logo__image--${variant ?? 'card'}`"
    />
  </div>
</template>

<script setup lang="ts">
import logoPrimary from '@/assets/logo/logo-primary.png'

defineProps<{
  variant?: 'card' | 'register' | 'header'
}>()
</script>

<style scoped>
.auth-logo {
  display: flex;
  align-items: flex-start;
  overflow: visible;
}

.auth-logo--card {
  justify-content: center;
  width: 100%;
  height: 56px;
  margin-bottom: 24px;
}

.auth-logo--register {
  justify-content: center;
  width: 100%;
  height: 56px;
  margin-bottom: 16px;
}

.auth-logo--header {
  position: absolute;
  top: 28px;
  left: 40px;
  z-index: 2;
  justify-content: flex-start;
  height: 44px;
}

.auth-logo__image {
  display: block;
  width: auto;
  object-fit: contain;
  transform: scale(2);
}

.auth-logo__image--card {
  margin-top: -30px;
  height: 65px;
  transform-origin: center top;
}

.auth-logo__image--register {
  margin-top: -30px;
  height: 65px;
  transform-origin: center top;
}

.auth-logo__image--header {
  height: 44px;
  transform-origin: left top;
}
</style>
