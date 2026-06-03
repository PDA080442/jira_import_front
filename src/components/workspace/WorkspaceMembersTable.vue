<template>
  <div class="table-scroll">
    <v-table class="workspace-members-table" aria-label="Участники workspace">
      <thead>
        <tr>
          <th scope="col">Участник</th>
          <th scope="col">Роль</th>
          <th scope="col">Дата добавления</th>
          <th scope="col" class="text-right">Действия</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="member in members" :key="member.id">
          <td>
            <div class="workspace-members-table__member">
              <v-avatar size="40" color="grey-lighten-3">
                <v-img v-if="member.avatar" :src="member.avatar" :alt="member.name" />
                <span
                  v-else
                  class="text-caption font-weight-bold text-grey-darken-1"
                  aria-hidden="true"
                >
                  {{ initials(member.name) }}
                </span>
              </v-avatar>
              <div>
                <div class="workspace-members-table__name">{{ member.name }}</div>
                <div class="workspace-members-table__email">{{ member.email }}</div>
              </div>
            </div>
          </td>
          <td>
            <v-menu>
              <template #activator="{ props: menuProps }">
                <v-btn
                  v-bind="menuProps"
                  variant="text"
                  class="text-none pa-0 workspace-members-table__role-btn"
                  :disabled="member.role === 'Owner'"
                  :aria-label="`Изменить роль участника ${member.name}, текущая роль ${member.role}`"
                >
                  <WorkspaceRoleBadge :role="member.role" />
                  <v-icon
                    v-if="member.role !== 'Owner'"
                    icon="mdi-chevron-down"
                    size="16"
                    class="ml-1"
                    aria-hidden="true"
                  />
                </v-btn>
              </template>
              <v-list density="compact" min-width="140" role="menu" aria-label="Выбор роли">
                <v-list-item
                  v-for="role in roles"
                  :key="role"
                  :title="role"
                  role="menuitem"
                  @click="emit('updateRole', member.id, role)"
                />
              </v-list>
            </v-menu>
          </td>
          <td class="workspace-members-table__date">{{ member.addedAt }}</td>
          <td class="text-right">
            <v-menu>
              <template #activator="{ props: menuProps }">
                <v-btn
                  v-bind="menuProps"
                  icon="mdi-dots-horizontal"
                  variant="text"
                  size="small"
                  :disabled="member.role === 'Owner'"
                  :aria-label="`Действия для участника ${member.name}`"
                />
              </template>
              <v-list density="compact" min-width="180" role="menu">
                <v-list-item
                  title="Удалить участника"
                  prepend-icon="mdi-delete-outline"
                  role="menuitem"
                  @click="emit('delete', member.id, member.name)"
                />
              </v-list>
            </v-menu>
          </td>
        </tr>
      </tbody>
    </v-table>
  </div>
</template>

<script setup lang="ts">
import WorkspaceRoleBadge from '@/components/workspace/WorkspaceRoleBadge.vue'
import type { WorkspaceMemberView, WorkspaceRole } from '@/models/workspace'

defineProps<{
  members: WorkspaceMemberView[]
}>()

const emit = defineEmits<{
  updateRole: [memberId: string, role: WorkspaceRole]
  delete: [memberId: string, memberName: string]
}>()

const roles: WorkspaceRole[] = ['Admin', 'Editor', 'Viewer']

const initials = (name: string) =>
  name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
</script>

<style scoped>
.workspace-members-table {
  border: 1px solid #e7e5e4;
  border-radius: 12px;
  overflow: hidden;
  min-width: 640px;
}

@media (max-width: 480px) {
  .table-scroll {
    overflow-x: visible;
  }

  .workspace-members-table {
    min-width: 0;
    border: none;
    background: transparent;
  }

  .workspace-members-table :deep(thead) {
    display: none;
  }

  .workspace-members-table :deep(tbody tr) {
    display: flex;
    flex-direction: column;
    gap: 12px;
    padding: 16px;
    margin-bottom: 12px;
    border: 1px solid #e7e5e4;
    border-radius: 12px;
    background: #ffffff;
  }

  .workspace-members-table :deep(tbody td) {
    display: block;
    width: 100%;
    padding: 0 !important;
    border: none !important;
  }

  .workspace-members-table :deep(tbody td.text-right) {
    text-align: left !important;
  }

  .workspace-members-table__date {
    font-size: 0.8125rem;
  }
}

.workspace-members-table :deep(th) {
  background: #fafaf9;
  font-size: 0.8125rem !important;
  font-weight: 600 !important;
  color: #78716c !important;
  border-bottom: 1px solid #e7e5e4 !important;
}

.workspace-members-table :deep(td) {
  border-bottom: 1px solid #f5f5f4 !important;
  vertical-align: middle;
}

.workspace-members-table__member {
  display: flex;
  align-items: center;
  gap: 12px;
}

.workspace-members-table__name {
  font-size: 0.9375rem;
  font-weight: 600;
  color: #1c1917;
}

.workspace-members-table__email {
  font-size: 0.8125rem;
  color: #78716c;
}

.workspace-members-table__date {
  font-size: 0.875rem;
  color: #57534e;
}

.workspace-members-table__role-btn {
  min-width: 0;
  height: auto;
}
</style>
