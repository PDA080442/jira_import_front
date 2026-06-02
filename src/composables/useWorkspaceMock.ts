import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { useAppNotify } from '@/composables/useAppNotify'
import {
  acceptInvite,
  createWorkspace,
  declineInvite,
  fetchInvite,
  fetchMembers,
  fetchWorkspaces,
  inviteMember,
  removeMember,
  updateMemberRole,
  type CreateWorkspacePayload,
  type InviteMemberPayload,
  type WorkspaceMember,
  type WorkspaceRole,
} from '@/mocks/workspace'
import { useWorkspaceStore } from '@/stores/workspace'

export const useWorkspaceMock = () => {
  const router = useRouter()
  const route = useRoute()
  const workspaceStore = useWorkspaceStore()
  const { showSuccess, showError } = useAppNotify()

  const loading = ref(false)
  const error = ref('')
  const fieldErrors = ref<Record<string, string>>({})
  const members = ref<WorkspaceMember[]>([])

  const resetState = () => {
    error.value = ''
    fieldErrors.value = {}
  }

  const isForceLoading = () => route.query.state === 'loading'
  const isForceEmpty = () => route.query.state === 'empty'

  const handleFetchWorkspaces = async () => {
    resetState()
    loading.value = true

    try {
      const result = await fetchWorkspaces(isForceLoading())

      if (!result.ok) {
        error.value = result.message
        return
      }

      workspaceStore.setWorkspaces(result.data)
    } finally {
      loading.value = false
    }
  }

  const handleSelectWorkspace = async (workspaceId: string) => {
    workspaceStore.setCurrentWorkspace(workspaceId)
    await router.push('/')
  }

  const handleCreateWorkspace = async (payload: CreateWorkspacePayload) => {
    resetState()
    loading.value = true

    try {
      const result = await createWorkspace(payload)

      if (!result.ok) {
        error.value = result.message
        if (result.fieldErrors) {
          fieldErrors.value = result.fieldErrors
        }
        return false
      }

      workspaceStore.setWorkspaces([result.data, ...workspaceStore.workspaces])
      showSuccess('Успешно', 'Workspace успешно создан')
      await router.push('/workspace/select')
      return true
    } finally {
      loading.value = false
    }
  }

  const handleFetchMembers = async (workspaceId?: string) => {
    resetState()
    loading.value = true

    const id = workspaceId ?? workspaceStore.currentWorkspaceId ?? 'ws-1'

    try {
      const result = await fetchMembers(id, {
        forceLoading: isForceLoading(),
        forceEmpty: isForceEmpty(),
      })

      if (!result.ok) {
        error.value = result.message
        return
      }

      members.value = result.data
    } finally {
      loading.value = false
    }
  }

  const handleInviteMember = async (payload: Omit<InviteMemberPayload, 'workspaceId'>) => {
    resetState()
    loading.value = true

    const workspaceId = workspaceStore.currentWorkspaceId ?? 'ws-1'

    try {
      const result = await inviteMember({ ...payload, workspaceId })

      if (!result.ok) {
        if (result.fieldErrors) {
          fieldErrors.value = result.fieldErrors
        }
        error.value = result.message
        showError(result.message)
        return false
      }

      showSuccess('Успешно', result.data.message)
      return true
    } finally {
      loading.value = false
    }
  }

  const handleFetchInvite = async (token: string) => {
    resetState()
    loading.value = true

    try {
      return await fetchInvite(token)
    } finally {
      loading.value = false
    }
  }

  const handleAcceptInvite = async (token: string) => {
    resetState()
    loading.value = true

    try {
      const result = await acceptInvite(token)

      if (!result.ok) {
        error.value = result.message
        showError(result.message)
        return false
      }

      showSuccess('Успешно', result.data.message)
      await router.push('/workspace/select')
      return true
    } finally {
      loading.value = false
    }
  }

  const handleDeclineInvite = async (token: string) => {
    resetState()
    loading.value = true

    try {
      const result = await declineInvite(token)

      if (!result.ok) {
        error.value = result.message
        showError(result.message)
        return false
      }

      await router.push('/auth/login')
      return true
    } finally {
      loading.value = false
    }
  }

  const handleUpdateMemberRole = async (memberId: string, role: WorkspaceRole) => {
    const workspaceId = workspaceStore.currentWorkspaceId ?? 'ws-1'

    try {
      const result = await updateMemberRole(workspaceId, memberId, role)

      if (!result.ok) {
        showError(result.message)
        return false
      }

      const index = members.value.findIndex((item) => item.id === memberId)

      if (index !== -1) {
        members.value[index] = result.data
      }

      showSuccess('Успешно', 'Роль участника обновлена')
      return true
    } catch {
      showError('Не удалось сохранить изменения.')
      return false
    }
  }

  const handleRemoveMember = async (memberId: string) => {
    const workspaceId = workspaceStore.currentWorkspaceId ?? 'ws-1'

    try {
      const result = await removeMember(workspaceId, memberId)

      if (!result.ok) {
        showError(result.message)
        return false
      }

      members.value = members.value.filter((item) => item.id !== memberId)
      showSuccess('Успешно', 'Участник успешно удалён из рабочего пространства.')
      return true
    } catch {
      showError('Не удалось сохранить изменения.')
      return false
    }
  }

  return {
    loading,
    error,
    fieldErrors,
    members,
    resetState,
    handleFetchWorkspaces,
    handleSelectWorkspace,
    handleCreateWorkspace,
    handleFetchMembers,
    handleInviteMember,
    handleFetchInvite,
    handleAcceptInvite,
    handleDeclineInvite,
    handleUpdateMemberRole,
    handleRemoveMember,
  }
}
