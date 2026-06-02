<template>
  <Transition name="app-toast">
    <div v-if="toastState.show" class="app-toast">
      <div class="app-toast__accent" />
      <div class="app-toast__icon">
        <v-icon icon="mdi-check" color="white" size="18" />
      </div>
      <div class="app-toast__content">
        <div class="app-toast__title">{{ toastState.title }}</div>
        <div v-if="toastState.message" class="app-toast__message">{{ toastState.message }}</div>
      </div>
      <v-btn
        icon="mdi-close"
        variant="text"
        size="small"
        class="app-toast__close"
        @click="hideToast"
      />
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { useAppNotify } from '@/composables/useAppNotify'

const { toastState, hideToast } = useAppNotify()
</script>

<style scoped>
.app-toast {
  position: fixed;
  right: 24px;
  bottom: 24px;
  z-index: 9999;
  display: flex;
  align-items: flex-start;
  gap: 12px;
  width: min(380px, calc(100vw - 48px));
  padding: 16px 16px 16px 0;
  border-radius: 12px;
  background: #ffffff;
  box-shadow: 0 8px 24px rgba(28, 25, 23, 0.12);
  overflow: hidden;
}

.app-toast__accent {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 4px;
  background: #16a34a;
}

.app-toast__icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  margin-left: 20px;
  border-radius: 50%;
  background: #16a34a;
  flex-shrink: 0;
}

.app-toast__content {
  flex: 1;
  min-width: 0;
}

.app-toast__title {
  font-size: 0.9375rem;
  font-weight: 700;
  color: #1c1917;
}

.app-toast__message {
  margin-top: 2px;
  font-size: 0.8125rem;
  color: #78716c;
  line-height: 1.4;
}

.app-toast__close {
  flex-shrink: 0;
}

.app-toast-enter-active,
.app-toast-leave-active {
  transition:
    opacity 0.2s ease,
    transform 0.2s ease;
}

.app-toast-enter-from,
.app-toast-leave-to {
  opacity: 0;
  transform: translateY(12px);
}
</style>
