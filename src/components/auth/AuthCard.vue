<template>
  <v-card
    class="auth-card mx-auto"
    :max-width="maxWidth ?? 600"
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
}>()
</script>

<style scoped>
.auth-card {
  min-height: 700px;
  display: flex;
  flex-direction: column;
}

.auth-card__body {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 100%;
}
</style>
