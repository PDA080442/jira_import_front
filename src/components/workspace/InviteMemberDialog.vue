<template>
  <v-dialog
    :model-value="modelValue"
    max-width="520"
    scrollable
    class="workspace-dialog"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <v-card rounded="xl" class="invite-member-dialog">
      <v-btn
        icon="mdi-close"
        aria-label="Закрыть"
        variant="text"
        size="small"
        class="invite-member-dialog__close"
        @click="handleClose"
      />

      <v-card-text class="pa-8">
        <h2 class="invite-member-dialog__title">Пригласить в workspace</h2>
        <p class="invite-member-dialog__subtitle">
          Пригласите участника в ваш workspace. Мы отправим письмо с приглашением на указанный
          email.
        </p>

        <v-form class="mt-6" @submit.prevent="handleSubmit">
          <div class="invite-member-dialog__field">
            <label class="invite-member-dialog__label">Email участника</label>
            <v-text-field
              v-model="email"
              placeholder="email@example.com"
              variant="outlined"
              hide-details="auto"
              :error-messages="fieldErrors.email"
              :disabled="loading"
            />
            <div class="invite-member-dialog__hint">
              На этот адрес будет отправлено приглашение для доступа к workspace.
            </div>
          </div>

          <div class="invite-member-dialog__field">
            <label class="invite-member-dialog__label">Роль</label>
            <v-select
              v-model="role"
              :items="roles"
              variant="outlined"
              hide-details
              :disabled="loading"
            />
            <div class="invite-member-dialog__hint">
              Определяет уровень доступа участника в workspace.
              <a href="#" class="invite-member-dialog__link" @click.prevent>Подробнее о ролях</a>
            </div>
          </div>

          <div class="invite-member-dialog__field">
            <label class="invite-member-dialog__label">Сообщение (необязательно)</label>
            <v-textarea
              v-model="message"
              placeholder="Добавьте сообщение к приглашению"
              variant="outlined"
              rows="3"
              hide-details
              :disabled="loading"
            />
            <div class="invite-member-dialog__hint">
              Пользователь увидит это сообщение в письме с приглашением.
            </div>
          </div>

          <div class="invite-member-dialog__actions">
            <v-btn variant="outlined" class="text-none" :disabled="loading" @click="handleClose">
              Отмена
            </v-btn>
            <v-btn type="submit" color="primary" class="text-none" :loading="loading">
              Отправить приглашение
            </v-btn>
          </div>
        </v-form>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

import { useWorkspaceMock } from '@/composables/useWorkspaceMock'
import type { WorkspaceRole } from '@/mocks/workspace'

const props = defineProps<{
  modelValue: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

const { loading, fieldErrors, handleInviteMember, resetState } = useWorkspaceMock()

const email = ref('')
const role = ref<WorkspaceRole>('Editor')
const message = ref('')

const roles: WorkspaceRole[] = ['Admin', 'Editor', 'Viewer']

const resetForm = () => {
  email.value = ''
  role.value = 'Editor'
  message.value = ''
  resetState()
}

const handleClose = () => {
  emit('update:modelValue', false)
  resetForm()
}

const handleSubmit = async () => {
  const success = await handleInviteMember({
    email: email.value,
    role: role.value,
    message: message.value,
  })

  if (success) {
    handleClose()
  }
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
.invite-member-dialog {
  position: relative;
}

.invite-member-dialog__close {
  position: absolute;
  top: 12px;
  right: 12px;
  z-index: 1;
}

.invite-member-dialog__title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1c1917;
}

.invite-member-dialog__subtitle {
  margin-top: 8px;
  font-size: 0.875rem;
  color: #78716c;
  line-height: 1.5;
}

.invite-member-dialog__field {
  margin-bottom: 20px;
}

.invite-member-dialog__label {
  display: block;
  margin-bottom: 8px;
  font-size: 0.875rem;
  font-weight: 600;
  color: #1c1917;
}

.invite-member-dialog__hint {
  margin-top: 6px;
  font-size: 0.8125rem;
  color: #78716c;
  line-height: 1.4;
}

.invite-member-dialog__link {
  color: #16a34a;
  text-decoration: underline;
}

.invite-member-dialog__actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding-top: 8px;
}
</style>
