<template>
  <label class="visually-hidden" :for="fieldId">Поиск workspace</label>
  <v-text-field
    :id="fieldId"
    :model-value="modelValue"
    placeholder="Поиск workspace"
    prepend-inner-icon="mdi-magnify"
    aria-label="Поиск workspace"
    variant="outlined"
    density="comfortable"
    hide-details
    rounded="lg"
    class="workspace-search"
    @update:model-value="emit('update:modelValue', $event)"
  />
</template>

<script setup lang="ts">
import { useId } from 'vue'

defineProps<{
  modelValue: string
}>()

const fieldId = useId()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()
</script>

<style scoped>
.workspace-search :deep(.v-field) {
  background: #ffffff;
  font-size: 0.9375rem;
}

.workspace-search :deep(.v-field__outline) {
  color: #e7e5e4;
  opacity: 1;
}

.workspace-search :deep(.v-field__input) {
  min-height: 44px;
  padding-top: 0;
  padding-bottom: 0;
}

.workspace-search :deep(input::placeholder) {
  color: #a8a29e;
  opacity: 1;
}

.workspace-search :deep(.v-field__prepend-inner .v-icon) {
  color: #a8a29e;
  opacity: 1;
}
</style>
