<template>
  <v-dialog
    :model-value="modelValue"
    max-width="560"
    scrollable
    class="workspace-dialog"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <v-card rounded="xl" class="create-import-dialog">
      <v-btn
        icon="mdi-close"
        aria-label="Закрыть"
        variant="text"
        size="small"
        class="create-import-dialog__close"
        @click="handleClose"
      />

      <v-card-text class="pa-8">
        <h2 class="create-import-dialog__title">Создать импорт</h2>
        <p class="create-import-dialog__subtitle">
          Настройте новый импорт данных. Файл можно будет загрузить на следующем шаге.
        </p>

        <v-form class="mt-6" @submit.prevent="handleSubmit">
          <div class="create-import-dialog__field">
            <label class="create-import-dialog__label">Название импорта</label>
            <v-text-field
              v-model="name"
              placeholder="Например, customers_2024_05"
              variant="outlined"
              hide-details="auto"
              :error-messages="nameError"
              :disabled="loading"
            />
            <div class="create-import-dialog__hint">
              Это название будет отображаться в списке последних импортов.
            </div>
          </div>

          <div class="create-import-dialog__field">
            <label class="create-import-dialog__label">Источник данных</label>
            <v-select
              v-model="source"
              :items="sources"
              variant="outlined"
              hide-details
              :disabled="loading"
            />
            <div class="create-import-dialog__hint">
              Выберите тип источника, из которого будут импортированы данные.
            </div>
          </div>

          <div class="create-import-dialog__field">
            <label class="create-import-dialog__label">Шаблон</label>
            <v-select
              v-model="template"
              :items="templates"
              variant="outlined"
              hide-details
              :disabled="loading"
            />
          </div>

          <div class="create-import-dialog__actions">
            <v-btn variant="outlined" class="text-none" :disabled="loading" @click="handleClose">
              Отмена
            </v-btn>
            <v-btn type="submit" color="primary" class="text-none" :loading="loading">
              Создать импорт
            </v-btn>
          </div>
        </v-form>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

import { useAppNotify } from '@/composables/useAppNotify'

const props = defineProps<{
  modelValue: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

const { showSuccess } = useAppNotify()

const loading = ref(false)
const name = ref('')
const source = ref('CSV файл')
const template = ref('Без шаблона')
const nameError = ref('')

const sources = ['CSV файл', 'Jira Backlog', 'Excel файл']
const templates = ['Без шаблона', 'Customers import', 'Orders import', 'Products update']

const resetForm = () => {
  loading.value = false
  name.value = ''
  source.value = 'CSV файл'
  template.value = 'Без шаблона'
  nameError.value = ''
}

const handleClose = () => {
  emit('update:modelValue', false)
  resetForm()
}

const handleSubmit = async () => {
  nameError.value = ''

  if (!name.value.trim()) {
    nameError.value = 'Введите название импорта'
    return
  }

  loading.value = true

  await new Promise((resolve) => setTimeout(resolve, 500))

  showSuccess('Успешно', 'Импорт создан')
  handleClose()
}

watch(
  () => props.modelValue,
  (open) => {
    if (!open) {
      resetForm()
    }
  },
)
</script>

<style scoped>
.create-import-dialog {
  position: relative;
}

.create-import-dialog__close {
  position: absolute;
  top: 12px;
  right: 12px;
  z-index: 1;
}

.create-import-dialog__title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1c1917;
}

.create-import-dialog__subtitle {
  margin-top: 8px;
  font-size: 0.875rem;
  color: #78716c;
  line-height: 1.5;
}

.create-import-dialog__field {
  margin-bottom: 20px;
}

.create-import-dialog__label {
  display: block;
  margin-bottom: 8px;
  font-size: 0.875rem;
  font-weight: 600;
  color: #1c1917;
}

.create-import-dialog__hint {
  margin-top: 6px;
  font-size: 0.8125rem;
  color: #78716c;
  line-height: 1.4;
}

.create-import-dialog__actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding-top: 8px;
}
</style>
