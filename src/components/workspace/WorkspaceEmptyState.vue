<template>
  <div class="workspace-empty-state">
    <div class="workspace-empty-state__illustration">
      <v-icon icon="mdi-pine-tree" size="48" color="primary" />
      <v-icon
        icon="mdi-image-filter-hdr"
        size="32"
        color="primary-lighten-1"
        class="workspace-empty-state__hill"
      />
    </div>
    <h2 class="workspace-empty-state__title">Пока нет участников</h2>
    <p class="workspace-empty-state__description">
      Пригласите участников в рабочее пространство, чтобы начать совместную работу.
    </p>
    <v-btn color="primary" class="text-none" size="large" @click="emit('invite')">
      Пригласить
    </v-btn>
  </div>
</template>

<script setup lang="ts">
const emit = defineEmits<{
  invite: []
}>()
</script>

<style scoped>
.workspace-empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 64px 24px;
  text-align: center;
}

.workspace-empty-state__illustration {
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

.workspace-empty-state__hill {
  position: absolute;
  bottom: 24px;
  opacity: 0.6;
}

.workspace-empty-state__title {
  margin-bottom: 8px;
  font-size: 1.25rem;
  font-weight: 700;
  color: #1c1917;
}

.workspace-empty-state__description {
  max-width: 420px;
  margin-bottom: 24px;
  font-size: 0.9375rem;
  color: #78716c;
  line-height: 1.5;
}
</style>
