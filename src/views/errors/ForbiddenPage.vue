<template>
  <main class="forbidden-page" id="main-content" tabindex="-1">
    <div class="forbidden-page__illustration">
      <v-icon icon="mdi-lock-outline" size="56" color="grey-lighten-1" />
      <div class="forbidden-page__badge">
        <v-icon icon="mdi-close" size="14" color="white" />
      </div>
    </div>

    <h1 class="forbidden-page__title">Нет доступа</h1>
    <p class="forbidden-page__text">
      У вас нет прав для просмотра этой страницы. Если вы считаете, что это ошибка, обратитесь к
      администратору.
    </p>

    <v-btn
      variant="outlined"
      color="primary"
      class="text-none mt-6"
      prepend-icon="mdi-arrow-left"
      @click="handleGoBack"
    >
      Вернуться назад
    </v-btn>
  </main>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const handleGoBack = () => {
  if (window.history.length > 1) {
    router.back()
    return
  }

  router.push('/workspace/select')
}
</script>

<style scoped>
.forbidden-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 32px 16px;
  background: #fafaf9;
  text-align: center;
}

.forbidden-page__illustration {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 120px;
  height: 120px;
  margin-bottom: 24px;
  border-radius: 50%;
  background: #f5f5f4;
}

.forbidden-page__badge {
  position: absolute;
  right: 8px;
  bottom: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: #b91c1c;
  border: 3px solid #fafaf9;
}

.forbidden-page__title {
  margin-bottom: 12px;
  font-size: 2rem;
  font-weight: 700;
  color: #1c1917;
}

.forbidden-page__text {
  max-width: 480px;
  font-size: 0.9375rem;
  color: #78716c;
  line-height: 1.6;
}
</style>
