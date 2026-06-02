<template>
  <v-table class="workspace-members-table">
    <thead>
      <tr>
        <th>Участник</th>
        <th>Роль</th>
        <th>Дата добавления</th>
        <th class="text-right">Действия</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="member in members" :key="member.id">
        <td>
          <div class="workspace-members-table__member">
            <v-avatar size="40" color="grey-lighten-3">
              <v-img v-if="member.avatar" :src="member.avatar" :alt="member.name" />
              <span v-else class="text-caption font-weight-bold text-grey-darken-1">
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
              >
                <WorkspaceRoleBadge :role="member.role" />
                <v-icon
                  v-if="member.role !== 'Owner'"
                  icon="mdi-chevron-down"
                  size="16"
                  class="ml-1"
                />
              </v-btn>
            </template>
            <v-list density="compact" min-width="140">
              <v-list-item
                v-for="role in roles"
                :key="role"
                :title="role"
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
              />
            </template>
            <v-list density="compact" min-width="180">
              <v-list-item
                title="Удалить участника"
                prepend-icon="mdi-delete-outline"
                @click="emit('delete', member.id, member.name)"
              />
            </v-list>
          </v-menu>
        </td>
      </tr>
    </tbody>
  </v-table>
</template>

<script setup lang="ts">
import WorkspaceRoleBadge from '@/components/workspace/WorkspaceRoleBadge.vue'
import type { WorkspaceMember, WorkspaceRole } from '@/mocks/workspace'

defineProps<{
  members: WorkspaceMember[]
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
