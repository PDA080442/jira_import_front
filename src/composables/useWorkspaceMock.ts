import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { useAppNotify } from '@/composables/useAppNotify'
import {
  acceptInvite,
  createWorkspace,
  declineInvite,
  deleteWorkspace,
  duplicateWorkspace,
  fetchDashboardData,
  fetchInvite,
  fetchMembers,
  fetchWorkspaces,
  inviteMember,
  removeMember,
  updateMemberRole,
  updateWorkspace,
  type CreateWorkspacePayload,
  type DashboardData,
  type InviteMemberPayload,
  type MockFetchOptions,
  type UpdateWorkspacePayload,
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
  const dashboardData = ref<DashboardData | null>(null)

  const resetState = () => {
    error.value = ''
    fieldErrors.value = {}
  }

  const isForceLoading = () => route.query.state === 'loading'
  const isForceError = () => route.query.state === 'error'

  const isForceEmptyWorkspaces = () =>
    route.path === '/workspace/select' && route.query.state === 'empty'

  const isForceEmptyMembers = () =>
    route.path === '/workspace/members' && route.query.state === 'empty'

  const isForceEmptyDashboard = () => route.path === '/' && route.query.state === 'empty'

  const buildFetchOptions = (overrides?: MockFetchOptions): MockFetchOptions => ({
    forceLoading: overrides?.forceLoading ?? isForceLoading(),
    forceError: overrides?.forceError ?? isForceError(),
    forceEmpty: overrides?.forceEmpty,
  })

  const handleFetchWorkspaces = async () => {
    resetState()
    loading.value = true

    try {
      const result = await fetchWorkspaces({
        ...buildFetchOptions(),
        forceEmpty: isForceEmptyWorkspaces(),
      })

      if (!result.ok) {
        error.value = result.message
        return
      }

      workspaceStore.setWorkspaces(result.data)
    } finally {
      loading.value = false
    }
  }

  const handleFetchDashboard = async () => {
    resetState()
    loading.value = true

    try {
      const result = await fetchDashboardData({
        ...buildFetchOptions(),
        forceEmpty: isForceEmptyDashboard(),
      })

      if (!result.ok) {
        error.value = result.message
        dashboardData.value = null
        return
      }

      dashboardData.value = result.data
    } finally {
      loading.value = false
    }
  }

  const handleSelectWorkspace = async (
    workspaceId: string,
    options: { navigate?: boolean } = {},
  ) => {
    workspaceStore.setCurrentWorkspace(workspaceId)

    if (options.navigate ?? true) {
      await router.push('/')
    }
  }

  const handleCreateWorkspace = async (
    payload: CreateWorkspacePayload,
    options: { redirect?: boolean } = {},
  ) => {
    resetState()
    loading.value = true

    try {
      const result = await createWorkspace(payload)

      if (!result.ok) {
        error.value = result.message
        if (result.fieldErrors) {
          fieldErrors.value = result.fieldErrors
        }
        return null
      }

      workspaceStore.setWorkspaces([result.data, ...workspaceStore.workspaces])
      workspaceStore.setCurrentWorkspace(result.data.id)
      showSuccess('Успешно', 'Workspace успешно создан')

      if (options.redirect ?? true) {
        await router.push('/workspace/select')
      }

      return result.data
    } finally {
      loading.value = false
    }
  }

  const handleUpdateWorkspace = async (payload: UpdateWorkspacePayload) => {
    resetState()
    loading.value = true

    try {
      const result = await updateWorkspace(payload)

      if (!result.ok) {
        error.value = result.message
        if (result.fieldErrors) {
          fieldErrors.value = result.fieldErrors
        }
        return null
      }

      workspaceStore.setWorkspaces(
        workspaceStore.workspaces.map((ws) => (ws.id === result.data.id ? result.data : ws)),
      )
      showSuccess('Успешно', 'Workspace обновлён')

      return result.data
    } finally {
      loading.value = false
    }
  }

  const handleDeleteWorkspace = async (workspaceId: string) => {
    resetState()
    loading.value = true

    try {
      const result = await deleteWorkspace(workspaceId)

      if (!result.ok) {
        error.value = result.message
        showError(result.message)
        return false
      }

      const remaining = workspaceStore.workspaces.filter((ws) => ws.id !== workspaceId)
      workspaceStore.setWorkspaces(remaining)

      if (workspaceStore.currentWorkspaceId === workspaceId) {
        if (remaining[0]) {
          workspaceStore.setCurrentWorkspace(remaining[0].id)
        } else {
          workspaceStore.clearCurrentWorkspace()
        }
      }

      showSuccess('Успешно', 'Workspace удалён')
      return true
    } finally {
      loading.value = false
    }
  }

  const handleDuplicateWorkspace = async (workspaceId: string) => {
    resetState()
    loading.value = true

    try {
      const result = await duplicateWorkspace(workspaceId)

      if (!result.ok) {
        error.value = result.message
        showError(result.message)
        return null
      }

      workspaceStore.setWorkspaces([result.data, ...workspaceStore.workspaces])
      showSuccess('Успешно', 'Workspace продублирован')

      return result.data
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
        ...buildFetchOptions(),
        forceEmpty: isForceEmptyMembers(),
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
      return await fetchInvite(token, buildFetchOptions())
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
    dashboardData,
    resetState,
    handleFetchWorkspaces,
    handleFetchDashboard,
    handleSelectWorkspace,
    handleCreateWorkspace,
    handleUpdateWorkspace,
    handleDeleteWorkspace,
    handleDuplicateWorkspace,
    handleFetchMembers,
    handleInviteMember,
    handleFetchInvite,
    handleAcceptInvite,
    handleDeclineInvite,
    handleUpdateMemberRole,
    handleRemoveMember,
  }
}
