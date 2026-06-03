<template>
  <div class="auth-layout" :class="{ 'auth-layout--no-scroll': noScroll }">
    <SkipToContentLink />
    <AuthLogo v-if="showHeaderLogo" variant="header" />

    <div
      class="auth-layout__bg"
      aria-hidden="true"
      :style="{ backgroundImage: `url(${forestBackground})` }"
    />

    <main
      id="main-content"
      class="auth-layout__content"
      tabindex="-1"
      aria-label="Форма авторизации"
    >
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'

import forestBackground from '@/assets/auth/forest-background.png'
import SkipToContentLink from '@/components/common/SkipToContentLink.vue'
import AuthLogo from '@/components/auth/AuthLogo.vue'

const props = defineProps<{
  showHeaderLogo?: boolean
  noScroll?: boolean
}>()

let savedOverflow = ''

const lockScroll = () => {
  savedOverflow = document.documentElement.style.overflow
  document.documentElement.style.overflow = 'hidden'
  document.body.style.overflow = 'hidden'

  const main = document.querySelector('.v-main')
  if (main instanceof HTMLElement) {
    main.style.overflow = 'hidden'
  }
}

const unlockScroll = () => {
  document.documentElement.style.overflow = savedOverflow
  document.body.style.overflow = ''

  const main = document.querySelector('.v-main')
  if (main instanceof HTMLElement) {
    main.style.overflow = ''
  }
}

onMounted(() => {
  if (props.noScroll) {
    lockScroll()
  }
})

onUnmounted(() => {
  if (props.noScroll) {
    unlockScroll()
  }
})
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

.auth-layout--no-scroll {
  height: 100dvh;
  max-height: 100dvh;
  min-height: 100dvh;
}

.auth-layout--no-scroll .auth-layout__content {
  max-height: 100%;
  overflow: hidden;
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

@media (max-width: 480px) {
  .auth-layout__content {
    padding: 20px 12px;
  }
}
</style>
