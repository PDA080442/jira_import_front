<template>
  <div
    class="auth-logo"
    :class="{
      'auth-logo--card mb-6': variant === 'card' || !variant,
      'auth-logo--register mb-4': variant === 'register',
      'auth-logo--header': variant === 'header',
    }"
  >
    <img
      v-if="variant === 'register'"
      :src="logoTrees"
      alt=""
      class="auth-logo__mark auth-logo__mark--trees"
      width="60"
      height="56"
    />

    <img
      v-else
      :src="logoShield"
      alt=""
      class="auth-logo__mark auth-logo__mark--shield"
      :width="variant === 'header' ? 36 : 44"
      :height="variant === 'header' ? 40 : 48"
    />

    <div class="auth-logo__text" :class="{ 'auth-logo__text--stacked': variant === 'register' }">
      <template v-if="variant === 'register'">
        <span class="auth-logo__title">Backlog</span>
        <span class="auth-logo__title auth-logo__title--accent">Import</span>
      </template>

      <template v-else>
        <span class="auth-logo__title">Backlog Import</span>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import logoShield from '@/assets/auth/logo-shield.svg'
import logoTrees from '@/assets/auth/logo-trees.svg'

defineProps<{
  variant?: 'card' | 'register' | 'header'
}>()
</script>

<style scoped>
.auth-logo {
  display: flex;
  align-items: center;
  gap: 12px;
}

.auth-logo--register {
  justify-content: center;
  align-items: center;
  width: 100%;
  gap: 10px;
}

.auth-logo__mark {
  display: block;
  flex-shrink: 0;
}

.auth-logo__mark--trees {
  width: 60px;
  height: 56px;
}

.auth-logo__text {
  display: flex;
  align-items: center;
}

.auth-logo__text--stacked {
  flex-direction: column;
  align-items: center;
  gap: 0;
  line-height: 1.1;
  text-align: center;
}

.auth-logo__title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1c1917;
  letter-spacing: -0.01em;
}

.auth-logo--register .auth-logo__title {
  font-size: 1rem;
}

.auth-logo__title--accent {
  color: #16a34a;
}

.auth-logo--header {
  position: absolute;
  top: 28px;
  left: 40px;
  z-index: 2;
}
</style>
