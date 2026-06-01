<template>
  <div class="auth-field" :class="{ 'auth-field--compact': compact }">
    <label v-if="label" class="auth-field__label" :for="fieldId">{{ label }}</label>

    <v-text-field
      :id="fieldId"
      :model-value="modelValue"
      variant="outlined"
      density="comfortable"
      rounded="lg"
      hide-details="auto"
      bg-color="surface"
      base-color="#D6D3D1"
      color="primary"
      class="auth-field__input"
      v-bind="$attrs"
      @update:model-value="emit('update:modelValue', $event)"
    >
      <template v-for="(_, slotName) in $slots" #[slotName]="slotProps">
        <slot :name="slotName" v-bind="slotProps ?? {}" />
      </template>
    </v-text-field>
  </div>
</template>

<script setup lang="ts">
import { useId } from 'vue'

defineOptions({
  inheritAttrs: false,
})

defineProps<{
  label?: string
  modelValue?: string
  compact?: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const fieldId = useId()
</script>

<style scoped>
.auth-field {
  margin-bottom: 18px;
}

.auth-field--compact {
  margin-bottom: 6px;
}

.auth-field--compact .auth-field__label {
  margin-bottom: 4px;
}

.auth-field--compact:last-child {
  margin-bottom: 0;
}

.auth-field__label {
  display: block;
  margin-bottom: 6px;
  font-size: 0.8125rem;
  font-weight: 600;
  line-height: 1.2;
  color: #1c1917;
}

.auth-field__input :deep(.v-field) {
  background: #ffffff;
  font-size: 0.9375rem;
}

.auth-field__input :deep(.v-field__outline) {
  --v-field-border-opacity: 1;
  color: #d6d3d1;
}

.auth-field__input :deep(.v-field--focused .v-field__outline) {
  color: #16a34a;
}

.auth-field__input :deep(.v-field__prepend-inner .v-icon) {
  color: #78716c;
  opacity: 1;
}

.auth-field__input :deep(input::placeholder),
.auth-field__input :deep(textarea::placeholder) {
  color: #a8a29e;
  opacity: 1;
}

.auth-field--compact .auth-field__input :deep(.v-input__details) {
  min-height: 0;
  padding-top: 2px;
}
</style>
