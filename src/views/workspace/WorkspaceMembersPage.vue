<template>
  <AppLayout>
    <div class="workspace-members-page">
      <WorkspaceMembersHeader />

      <div class="workspace-members-page__header">
        <h1 class="workspace-members-page__title">Участники workspace</h1>
        <v-btn
          color="primary"
          class="text-none"
          prepend-icon="mdi-plus"
          @click="inviteDialogOpen = true"
        >
          Пригласить
        </v-btn>
      </div>

      <WorkspaceMembersSkeleton v-if="loading" />

      <PageErrorState
        v-else-if="error"
        :description="error"
        :loading="loading"
        @retry="handleFetchMembers"
      />

      <WorkspaceEmptyState v-else-if="members.length === 0" @invite="inviteDialogOpen = true" />

      <template v-else>
        <WorkspaceMembersTable
          :members="members"
          @update-role="handleUpdateRole"
          @delete="handleDeleteRequest"
        />
        <p class="workspace-members-page__footer">Всего участников: {{ members.length }}</p>
      </template>

      <InviteMemberDialog v-model="inviteDialogOpen" />

      <DeleteMemberDialog
        v-model="deleteDialogOpen"
        :member-name="deleteMemberName"
        :loading="deleteLoading"
        @confirm="handleDeleteConfirm"
      />
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'

import PageErrorState from '@/components/common/PageErrorState.vue'
import DeleteMemberDialog from '@/components/workspace/DeleteMemberDialog.vue'
import InviteMemberDialog from '@/components/workspace/InviteMemberDialog.vue'
import WorkspaceEmptyState from '@/components/workspace/WorkspaceEmptyState.vue'
import WorkspaceMembersHeader from '@/components/workspace/WorkspaceMembersHeader.vue'
import WorkspaceMembersSkeleton from '@/components/workspace/WorkspaceMembersSkeleton.vue'
import WorkspaceMembersTable from '@/components/workspace/WorkspaceMembersTable.vue'
import { useWorkspaceMock } from '@/composables/useWorkspaceMock'
import AppLayout from '@/layouts/AppLayout.vue'
import type { WorkspaceRole } from '@/mocks/workspace'

import { useWorkspaceStore } from '@/stores/workspace'

const workspaceStore = useWorkspaceStore()
const {
  loading,
  error,
  members,
  handleFetchWorkspaces,
  handleFetchMembers,
  handleUpdateMemberRole,
  handleRemoveMember,
} = useWorkspaceMock()

const inviteDialogOpen = ref(false)
const deleteDialogOpen = ref(false)
const deleteMemberId = ref('')
const deleteMemberName = ref('')
const deleteLoading = ref(false)

const handleUpdateRole = async (memberId: string, role: WorkspaceRole) => {
  await handleUpdateMemberRole(memberId, role)
}

const handleDeleteRequest = (memberId: string, memberName: string) => {
  deleteMemberId.value = memberId
  deleteMemberName.value = memberName
  deleteDialogOpen.value = true
}

const handleDeleteConfirm = async () => {
  deleteLoading.value = true

  try {
    const success = await handleRemoveMember(deleteMemberId.value)

    if (success) {
      deleteDialogOpen.value = false
    }
  } finally {
    deleteLoading.value = false
  }
}

onMounted(async () => {
  if (workspaceStore.workspaces.length === 0) {
    await handleFetchWorkspaces()
  }

  handleFetchMembers()
})
</script>

<style scoped>
.workspace-members-page__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 24px;
}

.workspace-members-page__title {
  font-size: 1.75rem;
  font-weight: 700;
  color: #1c1917;
}

.workspace-members-page__footer {
  margin-top: 16px;
  font-size: 0.875rem;
  color: #78716c;
}
</style>
