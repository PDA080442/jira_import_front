<template>
  <v-text-field
    :model-value="modelValue"
    placeholder="Поиск workspace"
    prepend-inner-icon="mdi-magnify"
    variant="outlined"
    density="comfortable"
    hide-details
    class="workspace-search"
    @update:model-value="emit('update:modelValue', $event)"
  />
</template>

<script setup lang="ts">
defineProps<{
  modelValue: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()
</script>

<style scoped>
.workspace-search :deep(.v-field) {
  background: #ffffff;
}
</style>
