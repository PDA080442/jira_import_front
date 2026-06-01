<template>
  <v-card
    class="auth-card mx-auto"
    :class="{ 'auth-card--tall': tall }"
    :max-width="maxWidth ?? 480"
    width="100%"
    elevation="0"
    rounded="xl"
  >
    <div class="auth-card__body pa-8 pa-sm-10">
      <slot />
    </div>
  </v-card>
</template>

<script setup lang="ts">
defineProps<{
  maxWidth?: number | string
  tall?: boolean
}>()
</script>

<style scoped>
.auth-card {
  border: 1px solid rgba(28, 25, 23, 0.06);
  box-shadow:
    0 4px 6px -1px rgba(0, 0, 0, 0.05),
    0 10px 30px -4px rgba(0, 0, 0, 0.08);
}

.auth-card--tall {
  min-height: 700px;
  display: flex;
  flex-direction: column;
}

.auth-card--tall .auth-card__body {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 100%;
}
</style>
