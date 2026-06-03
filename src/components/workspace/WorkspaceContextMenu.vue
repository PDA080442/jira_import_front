<template>
  <v-menu
    :model-value="modelValue"
    :target="target"
    location="bottom start"
    :close-on-content-click="true"
    aria-label="Действия с workspace"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <v-list density="compact" min-width="220" class="workspace-context-menu py-2" role="menu">
      <v-list-item
        prepend-icon="mdi-pencil-outline"
        title="Редактировать"
        role="menuitem"
        class="workspace-context-menu__item"
        @click="emit('edit')"
      />
      <v-list-item
        prepend-icon="mdi-content-copy"
        title="Дублировать"
        role="menuitem"
        class="workspace-context-menu__item"
        @click="emit('duplicate')"
      />
      <v-divider class="my-1" />
      <v-list-item
        prepend-icon="mdi-delete-outline"
        title="Удалить"
        role="menuitem"
        base-color="error"
        class="workspace-context-menu__item workspace-context-menu__item--danger"
        @click="emit('delete')"
      />
    </v-list>
  </v-menu>
</template>

<script setup lang="ts">
defineProps<{
  modelValue: boolean
  target: [number, number]
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  edit: []
  duplicate: []
  delete: []
}>()
</script>

<style scoped>
.workspace-context-menu {
  border: 1px solid #e7e5e4;
  box-shadow: 0 8px 24px rgba(28, 25, 23, 0.08) !important;
}

.workspace-context-menu__item {
  min-height: 40px;
}

.workspace-context-menu__item--danger :deep(.v-list-item-title) {
  color: #b91c1c;
}
</style>
