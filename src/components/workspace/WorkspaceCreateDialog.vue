<template>
  <v-dialog
    :model-value="modelValue"
    max-width="720"
    scrollable
    class="workspace-dialog"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <v-card rounded="xl" class="workspace-create-dialog">
      <v-btn
        icon="mdi-close"
        aria-label="Закрыть"
        variant="text"
        size="small"
        class="workspace-create-dialog__close"
        @click="handleClose"
      />

      <v-card-text class="workspace-create-dialog__body pa-8">
        <h2 class="workspace-create-dialog__title">Создание workspace</h2>

        <WorkspaceCreateForm
          ref="formRef"
          class="mt-6"
          @cancel="handleClose"
          @success="handleSuccess"
        />
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

import WorkspaceCreateForm from '@/components/workspace/WorkspaceCreateForm.vue'
import type { WorkspaceListItem } from '@/models/workspace'

const props = defineProps<{
  modelValue: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  success: [workspace: WorkspaceListItem]
}>()

const formRef = ref<InstanceType<typeof WorkspaceCreateForm> | null>(null)

const handleClose = () => {
  emit('update:modelValue', false)
}

const handleSuccess = (workspace: WorkspaceListItem) => {
  emit('success', workspace)
  emit('update:modelValue', false)
}

watch(
  () => props.modelValue,
  (open) => {
    if (!open) {
      formRef.value?.resetForm()
    }
  },
)
</script>

<style scoped>
.workspace-create-dialog {
  position: relative;
}

.workspace-create-dialog__close {
  position: absolute;
  top: 12px;
  right: 12px;
  z-index: 1;
}

.workspace-create-dialog__title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1c1917;
}

@media (max-width: 480px) {
  .workspace-create-dialog__body {
    padding: 48px 16px 20px !important;
  }

  .workspace-create-dialog__title {
    font-size: 1.25rem;
    padding-right: 32px;
  }
}
</style>
