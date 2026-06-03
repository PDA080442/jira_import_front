<template>
  <section class="app-empty-state" aria-labelledby="empty-state-title">
    <div class="app-empty-state__illustration">
      <slot name="icon">
        <v-icon :icon="icon" size="48" color="primary" />
      </slot>
    </div>
    <h2 id="empty-state-title" class="app-empty-state__title">{{ title }}</h2>
    <p class="app-empty-state__description">{{ description }}</p>
    <v-btn
      v-if="actionLabel"
      color="primary"
      class="text-none"
      size="large"
      @click="emit('action')"
    >
      {{ actionLabel }}
    </v-btn>
  </section>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    title: string
    description: string
    actionLabel?: string
    icon?: string
  }>(),
  {
    icon: 'mdi-inbox-outline',
  },
)

const emit = defineEmits<{
  action: []
}>()
</script>

<style scoped>
.app-empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 64px 24px;
  text-align: center;
}

.app-empty-state__illustration {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 120px;
  height: 120px;
  margin-bottom: 24px;
  border-radius: 50%;
  background: linear-gradient(180deg, #ecfdf5 0%, #f0fdf4 100%);
}

.app-empty-state__title {
  margin: 0 0 8px;
  font-size: 1.25rem;
  font-weight: 700;
  color: #1c1917;
}

.app-empty-state__description {
  max-width: 420px;
  margin: 0 0 24px;
  font-size: 0.9375rem;
  color: #78716c;
  line-height: 1.5;
}
</style>
