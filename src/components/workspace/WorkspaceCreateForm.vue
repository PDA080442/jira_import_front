<template>
  <v-form class="workspace-create-form" @submit.prevent="handleSubmit">
    <div class="workspace-create-form__field">
      <label class="workspace-create-form__label">
        Название workspace <span class="workspace-create-form__required">*</span>
      </label>
      <v-text-field
        v-model="name"
        placeholder="Введите название workspace"
        variant="outlined"
        hide-details="auto"
        :error-messages="fieldErrors.name"
        :disabled="loading"
        @update:model-value="handleNameChange"
      />
      <div class="workspace-create-form__hint">
        <v-icon icon="mdi-information-outline" size="14" color="grey" />
        Это название будет отображаться для вашей команды и участников.
      </div>
    </div>

    <div class="workspace-create-form__field">
      <label class="workspace-create-form__label">URL slug</label>
      <div class="workspace-create-form__slug">
        <span class="workspace-create-form__slug-prefix">forest-trust.io/workspace/</span>
        <v-text-field
          :model-value="slugPreview"
          variant="outlined"
          hide-details="auto"
          readonly
          :disabled="loading"
          class="workspace-create-form__slug-input"
        />
      </div>
      <div class="workspace-create-form__hint">
        <v-icon icon="mdi-information-outline" size="14" color="grey" />
        Slug создаётся автоматически на сервере при создании workspace.
      </div>
    </div>

    <div class="workspace-create-form__actions">
      <v-btn variant="outlined" class="text-none" :disabled="loading" @click="emit('cancel')">
        Отмена
      </v-btn>
      <v-btn type="submit" color="primary" class="text-none" :loading="loading">
        {{ submitLabel }}
      </v-btn>
    </div>
  </v-form>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'

import { useWorkspace } from '@/composables/useWorkspace'
import { slugify, type WorkspaceListItem } from '@/models/workspace'

const props = defineProps<{
  workspace?: WorkspaceListItem | null
}>()

const emit = defineEmits<{
  cancel: []
  success: [workspace: WorkspaceListItem]
}>()

const { loading, fieldErrors, handleCreateWorkspace, handleUpdateWorkspace, resetState } =
  useWorkspace()

const name = ref('')

const isEditMode = computed(() => Boolean(props.workspace))
const submitLabel = computed(() => (isEditMode.value ? 'Сохранить' : 'Создать workspace'))
const slugPreview = computed(() => {
  if (isEditMode.value && props.workspace) {
    return props.workspace.slug
  }

  return slugify(name.value) || 'workspace-name'
})

const fillForm = (workspace: WorkspaceListItem | null | undefined) => {
  if (!workspace) {
    resetForm()
    return
  }

  name.value = workspace.name
  resetState()
}

const resetForm = () => {
  name.value = ''
  resetState()
}

const handleNameChange = () => {
  // Slug preview updates reactively via computed.
}

const handleSubmit = async () => {
  if (isEditMode.value && props.workspace) {
    const workspace = await handleUpdateWorkspace({
      id: props.workspace.id,
      name: name.value,
    })

    if (workspace) {
      emit('success', workspace)
      resetForm()
    }

    return
  }

  const workspace = await handleCreateWorkspace({ name: name.value }, { redirect: false })

  if (workspace) {
    emit('success', workspace)
    resetForm()
  }
}

watch(
  () => props.workspace,
  (workspace) => {
    fillForm(workspace)
  },
  { immediate: true },
)

defineExpose({
  resetForm,
})
</script>

<style scoped>
.workspace-create-form {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.workspace-create-form__field {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.workspace-create-form__label {
  font-size: 0.875rem;
  font-weight: 600;
  color: #1c1917;
}

.workspace-create-form__required {
  color: #b91c1c;
}

.workspace-create-form__hint {
  display: flex;
  align-items: flex-start;
  gap: 6px;
  font-size: 0.8125rem;
  color: #78716c;
  line-height: 1.4;
}

.workspace-create-form__slug {
  display: flex;
  align-items: stretch;
  gap: 0;
}

.workspace-create-form__slug-prefix {
  display: flex;
  align-items: center;
  padding: 0 14px;
  border: 1px solid #d6d3d1;
  border-right: none;
  border-radius: 12px 0 0 12px;
  background: #f5f5f4;
  font-size: 0.875rem;
  color: #78716c;
  white-space: nowrap;
}

.workspace-create-form__slug-input {
  flex: 1;
}

.workspace-create-form__slug-input :deep(.v-field) {
  border-radius: 0 12px 12px 0 !important;
}

.workspace-create-form__actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding-top: 8px;
}

@media (max-width: 480px) {
  .workspace-create-form {
    gap: 18px;
  }

  .workspace-create-form__slug {
    flex-direction: column;
    align-items: stretch;
  }

  .workspace-create-form__slug-prefix {
    width: 100%;
    border-right: 1px solid #d6d3d1;
    border-bottom: none;
    border-radius: 12px 12px 0 0;
    padding: 10px 12px;
    font-size: 0.75rem;
    line-height: 1.3;
    white-space: normal;
    overflow-wrap: anywhere;
  }

  .workspace-create-form__slug-input :deep(.v-field) {
    border-radius: 0 0 12px 12px !important;
  }

  .workspace-create-form__actions {
    flex-direction: column-reverse;
    align-items: stretch;
  }

  .workspace-create-form__actions :deep(.v-btn) {
    width: 100%;
  }
}
</style>
