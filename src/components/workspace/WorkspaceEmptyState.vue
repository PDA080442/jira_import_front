<template>
  <AppEmptyState
    title="Пока нет участников"
    description="Пригласите участников в рабочее пространство, чтобы начать совместную работу."
    action-label="Пригласить"
    @action="emit('invite')"
  >
    <template #icon>
      <v-icon icon="mdi-pine-tree" size="48" color="primary" />
      <v-icon
        icon="mdi-image-filter-hdr"
        size="32"
        color="primary-lighten-1"
        class="workspace-empty-state__hill"
      />
    </template>
  </AppEmptyState>
</template>

<script setup lang="ts">
import AppEmptyState from '@/components/common/AppEmptyState.vue'

const emit = defineEmits<{
  invite: []
}>()
</script>

<style scoped>
:deep(.app-empty-state__illustration) {
  position: relative;
}

.workspace-empty-state__hill {
  position: absolute;
  bottom: 24px;
  opacity: 0.6;
}
</style>
