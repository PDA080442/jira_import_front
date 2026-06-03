<template>
  <v-card
    ref="cardRef"
    class="workspace-card"
    :class="{ 'workspace-card--selected': selected }"
    variant="outlined"
    rounded="lg"
    tabindex="0"
    role="button"
    :aria-pressed="selected"
    :aria-label="cardAriaLabel"
    @click="emit('select')"
    @keydown="handleKeydown"
    @contextmenu.prevent="emit('contextmenu', $event)"
  >
    <v-card-text class="workspace-card__body">
      <div class="workspace-card__header">
        <div class="workspace-card__icon" aria-hidden="true">
          <v-icon :icon="iconMap[workspace.icon]" color="primary" size="22" />
        </div>
        <div class="workspace-card__title-row">
          <h3 class="workspace-card__title">{{ workspace.name }}</h3>
          <WorkspaceRoleBadge :role="workspace.role" />
        </div>
      </div>

      <v-divider class="workspace-card__divider" />

      <div class="workspace-card__meta">
        <div class="workspace-card__meta-row">
          <v-icon
            icon="mdi-account-group-outline"
            size="16"
            class="workspace-card__meta-icon"
            aria-hidden="true"
          />
          <span class="workspace-card__meta-label">Участники</span>
          <span class="workspace-card__meta-value">{{ membersLabel }}</span>
        </div>
        <div class="workspace-card__meta-row">
          <v-icon
            icon="mdi-clock-outline"
            size="16"
            class="workspace-card__meta-icon"
            aria-hidden="true"
          />
          <span class="workspace-card__meta-label">Последняя активность</span>
          <span class="workspace-card__meta-value">{{ workspace.lastActivityLabel }}</span>
        </div>
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

import WorkspaceRoleBadge from '@/components/workspace/WorkspaceRoleBadge.vue'
import type { WorkspaceListItem, WorkspaceIcon } from '@/models/workspace'

const props = defineProps<{
  workspace: WorkspaceListItem
  selected?: boolean
}>()

const emit = defineEmits<{
  select: []
  contextmenu: [event: MouseEvent]
}>()

const cardRef = ref<{ $el?: HTMLElement } | null>(null)

const iconMap: Record<WorkspaceIcon, string> = {
  tree: 'mdi-pine-tree',
  leaf: 'mdi-leaf',
  mountain: 'mdi-image-filter-hdr',
}

const membersLabel = computed(() => {
  const count = props.workspace.membersCount
  const mod10 = count % 10
  const mod100 = count % 100

  if (mod10 === 1 && mod100 !== 11) {
    return `${count} участник`
  }

  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) {
    return `${count} участника`
  }

  return `${count} участников`
})

const cardAriaLabel = computed(
  () =>
    `${props.workspace.name}, роль ${props.workspace.role}, ${membersLabel.value}. ${props.selected ? 'Выбран' : 'Не выбран'}. Нажмите Enter для выбора, Shift+F10 для меню.`,
)

const getCardElement = (): HTMLElement | null => {
  const el = cardRef.value?.$el ?? cardRef.value
  return el instanceof HTMLElement ? el : null
}

const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault()
    emit('select')
    return
  }

  if (event.key === 'ContextMenu' || (event.shiftKey && event.key === 'F10')) {
    event.preventDefault()
    const element = getCardElement()

    if (!element) {
      return
    }

    const rect = element.getBoundingClientRect()
    emit(
      'contextmenu',
      new MouseEvent('contextmenu', {
        bubbles: true,
        cancelable: true,
        clientX: rect.left + rect.width / 2,
        clientY: rect.top + 24,
      }),
    )
  }
}
</script>

<style scoped>
.workspace-card {
  cursor: pointer;
  border: 1px solid #e7e5e4 !important;
  box-shadow: none !important;
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease;
}

.workspace-card:hover {
  box-shadow: 0 4px 16px rgba(28, 25, 23, 0.06) !important;
}

.workspace-card--selected {
  border: 2px solid #16a34a !important;
}

.workspace-card__body {
  padding: 20px !important;
}

.workspace-card__header {
  display: flex;
  gap: 12px;
}

.workspace-card__icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: #dcfce7;
  flex-shrink: 0;
}

.workspace-card__title-row {
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 0;
  padding-top: 2px;
}

.workspace-card__title {
  margin: 0;
  font-size: 1rem;
  font-weight: 700;
  color: #1c1917;
  line-height: 1.3;
}

.workspace-card__divider {
  margin: 16px 0;
  border-color: #f5f5f4;
  opacity: 1;
}

.workspace-card__meta {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.workspace-card__meta-row {
  display: grid;
  grid-template-columns: 16px 1fr auto;
  align-items: center;
  gap: 8px;
}

.workspace-card__meta-icon {
  color: #a8a29e;
}

.workspace-card__meta-label {
  font-size: 0.8125rem;
  color: #78716c;
}

.workspace-card__meta-value {
  font-size: 0.8125rem;
  font-weight: 500;
  color: #1c1917;
  white-space: nowrap;
}
</style>
