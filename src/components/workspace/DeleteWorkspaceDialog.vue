<template>
  <v-dialog
    :model-value="modelValue"
    max-width="440"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <v-card rounded="xl" class="delete-workspace-dialog">
      <v-btn
        icon="mdi-close"
        variant="text"
        size="small"
        class="delete-workspace-dialog__close"
        @click="emit('update:modelValue', false)"
      />

      <v-card-text class="text-center pa-8 pt-10">
        <div class="delete-workspace-dialog__icon-wrap">
          <v-icon icon="mdi-delete-outline" size="28" color="error" />
        </div>

        <h2 class="delete-workspace-dialog__title">Удалить workspace?</h2>
        <p class="delete-workspace-dialog__text">
          Вы уверены, что хотите удалить
          <strong v-if="workspaceName">{{ workspaceName }}</strong
          >? Это действие нельзя отменить.
        </p>
      </v-card-text>

      <v-card-actions class="pa-6 pt-0 justify-center ga-3">
        <v-btn variant="outlined" class="text-none" @click="emit('update:modelValue', false)">
          Отмена
        </v-btn>
        <v-btn color="error" class="text-none" :loading="loading" @click="emit('confirm')">
          Удалить
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
defineProps<{
  modelValue: boolean
  workspaceName?: string
  loading?: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  confirm: []
}>()
</script>

<style scoped>
.delete-workspace-dialog {
  position: relative;
}

.delete-workspace-dialog__close {
  position: absolute;
  top: 12px;
  right: 12px;
}

.delete-workspace-dialog__icon-wrap {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 56px;
  height: 56px;
  margin-bottom: 16px;
  border-radius: 50%;
  background: #fee2e2;
}

.delete-workspace-dialog__title {
  margin-bottom: 8px;
  font-size: 1.125rem;
  font-weight: 700;
  color: #1c1917;
}

.delete-workspace-dialog__text {
  font-size: 0.9375rem;
  color: #57534e;
  line-height: 1.5;
}
</style>
