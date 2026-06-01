<template>
  <div class="auth-layout">
    <AuthLogo v-if="showHeaderLogo" variant="header" />

    <div
      class="auth-layout__bg"
      aria-hidden="true"
      :style="{ backgroundImage: `url(${forestBackground})` }"
    />

    <div class="auth-layout__content">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import forestBackground from '@/assets/auth/forest-background.png'
import AuthLogo from '@/components/auth/AuthLogo.vue'

defineProps<{
  showHeaderLogo?: boolean
}>()
</script>

<style scoped>
.auth-layout {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  min-height: 100dvh;
  overflow: hidden;
  background-color: #fafaf9;
}

.auth-layout__bg {
  position: absolute;
  inset: 0;
  background-size: cover;
  background-position: center bottom;
  background-repeat: no-repeat;
  pointer-events: none;
}

.auth-layout__content {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 32px 16px;
}
</style>
