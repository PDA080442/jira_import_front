<template>
  <div class="page-error-state" role="alert" aria-live="polite">
    <div class="page-error-state__icon-wrap" aria-hidden="true">
      <v-icon icon="mdi-alert-circle-outline" size="40" color="error" />
    </div>
    <h2 class="page-error-state__title">{{ title }}</h2>
    <p class="page-error-state__description">{{ description }}</p>
    <v-btn
      variant="outlined"
      color="primary"
      class="text-none"
      prepend-icon="mdi-refresh"
      :loading="loading"
      @click="emit('retry')"
    >
      Повторить
    </v-btn>
  </div>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    title?: string
    description?: string
    loading?: boolean
  }>(),
  {
    title: 'Не удалось загрузить данные',
    description: 'Проверьте подключение к интернету и попробуйте снова.',
    loading: false,
  },
)

const emit = defineEmits<{
  retry: []
}>()
</script>

<style scoped>
.page-error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 48px 24px;
  text-align: center;
}

.page-error-state__icon-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 80px;
  height: 80px;
  margin-bottom: 20px;
  border-radius: 50%;
  background: #fee2e2;
}

.page-error-state__title {
  margin: 0 0 8px;
  font-size: 1.125rem;
  font-weight: 700;
  color: #1c1917;
}

.page-error-state__description {
  max-width: 420px;
  margin: 0 0 24px;
  font-size: 0.9375rem;
  color: #78716c;
  line-height: 1.5;
}
</style>
