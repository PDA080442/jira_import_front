import { ref } from 'vue'
import { useRouter } from 'vue-router'

import { useWorkspaceApi } from '@/composables/Requests'
import { useAppNotify } from '@/composables/useAppNotify'
import { buildEmptyDashboardData, type DashboardData } from '@/models/dashboard'
import {
  mapApiMemberToView,
  mapApiWorkspaceToListItem,
  type AcceptInviteView,
  type WorkspaceListItem,
  type WorkspaceMemberView,
  type WorkspaceRole,
  uiRoleToInviteApi,
} from '@/models/workspace'
import { useAuthStore } from '@/stores/auth'
import { useWorkspaceStore } from '@/stores/workspace'
import { applyApiError } from '@/utils/apiErrors'

export interface CreateWorkspaceFormPayload {
  name: string
}

export interface UpdateWorkspaceFormPayload {
  id: string
  name: string
}

export interface InviteMemberFormPayload {
  email: string
  role: WorkspaceRole
}

export const useWorkspace = () => {
  const router = useRouter()
  const workspaceStore = useWorkspaceStore()
  const authStore = useAuthStore()
  const workspaceApi = useWorkspaceApi()
  const { showSuccess, showError } = useAppNotify()

  const loading = ref(false)
  const error = ref('')
  const fieldErrors = ref<Record<string, string>>({})
  const members = ref<WorkspaceMemberView[]>([])
  const dashboardData = ref<DashboardData | null>(null)

  const resetState = () => {
    error.value = ''
    fieldErrors.value = {}
  }

  const getCurrentUserId = () => authStore.profile?.id ?? null

  const handleFetchWorkspaces = async () => {
    resetState()
    loading.value = true

    try {
      const apiWorkspaces = await workspaceApi.list()
      const mapped = apiWorkspaces.map((workspace) =>
        mapApiWorkspaceToListItem(workspace, { currentUserId: getCurrentUserId() }),
      )

      workspaceStore.setWorkspaces(mapped)

      if (
        workspaceStore.currentWorkspaceId &&
        !mapped.some((item) => item.id === workspaceStore.currentWorkspaceId)
      ) {
        workspaceStore.clearCurrentWorkspace()
      }
    } catch (err) {
      applyApiError(
        err,
        (message) => {
          error.value = message
        },
        (errors) => {
          fieldErrors.value = errors
        },
      )
    } finally {
      loading.value = false
    }
  }

  const handleFetchDashboard = async () => {
    resetState()
    loading.value = true

    try {
      const workspaceName = workspaceStore.selectedWorkspace?.name
      dashboardData.value = buildEmptyDashboardData(workspaceName ?? undefined)
    } catch (err) {
      applyApiError(
        err,
        (message) => {
          error.value = message
        },
        (errors) => {
          fieldErrors.value = errors
        },
      )
      dashboardData.value = null
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
    payload: CreateWorkspaceFormPayload,
    options: { redirect?: boolean } = {},
  ) => {
    resetState()
    loading.value = true

    try {
      const created = await workspaceApi.create({ name: payload.name.trim() })
      const listItem = mapApiWorkspaceToListItem(created, {
        currentUserId: getCurrentUserId(),
        membersCount: 1,
        role: 'owner',
      })

      workspaceStore.setWorkspaces([listItem, ...workspaceStore.workspaces])
      workspaceStore.setCurrentWorkspace(listItem.id)
      showSuccess('Успешно', 'Workspace успешно создан')

      if (options.redirect ?? true) {
        await router.push('/workspace/select')
      }

      return listItem
    } catch (err) {
      applyApiError(
        err,
        (message) => {
          error.value = message
        },
        (errors) => {
          fieldErrors.value = errors
        },
      )
      return null
    } finally {
      loading.value = false
    }
  }

  const handleUpdateWorkspace = async (payload: UpdateWorkspaceFormPayload) => {
    resetState()
    loading.value = true

    try {
      const updated = await workspaceApi.update(payload.id, { name: payload.name.trim() })
      const existing = workspaceStore.workspaces.find((item) => item.id === payload.id)
      const listItem: WorkspaceListItem = {
        ...mapApiWorkspaceToListItem(updated, { currentUserId: getCurrentUserId() }),
        membersCount: existing?.membersCount ?? 0,
        role: existing?.role ?? 'Owner',
        icon: existing?.icon ?? mapApiWorkspaceToListItem(updated).icon,
      }

      workspaceStore.setWorkspaces(
        workspaceStore.workspaces.map((ws) => (ws.id === listItem.id ? listItem : ws)),
      )
      showSuccess('Успешно', 'Workspace обновлён')

      return listItem
    } catch (err) {
      applyApiError(
        err,
        (message) => {
          error.value = message
        },
        (errors) => {
          fieldErrors.value = errors
        },
      )
      return null
    } finally {
      loading.value = false
    }
  }

  const handleDeleteWorkspace = async (workspaceId: string) => {
    resetState()
    loading.value = true

    try {
      await workspaceApi.delete(workspaceId)

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
    } catch (err) {
      const message = applyApiErrorMessage(err)
      error.value = message
      showError(message)
      return false
    } finally {
      loading.value = false
    }
  }

  const handleDuplicateWorkspace = async (
    _workspaceId: string,
  ): Promise<WorkspaceListItem | null> => {
    showError('Дублирование workspace пока не поддерживается API')
    return null
  }

  const handleFetchMembers = async (workspaceId?: string) => {
    resetState()
    loading.value = true

    const id = workspaceId ?? workspaceStore.currentWorkspaceId

    if (!id) {
      error.value = 'Выберите workspace'
      loading.value = false
      return
    }

    try {
      const response = await workspaceApi.listMembers(id)
      members.value = response.members.map(mapApiMemberToView)
    } catch (err) {
      applyApiError(
        err,
        (message) => {
          error.value = message
        },
        (errors) => {
          fieldErrors.value = errors
        },
      )
    } finally {
      loading.value = false
    }
  }

  const handleInviteMember = async (payload: InviteMemberFormPayload) => {
    resetState()
    loading.value = true

    const workspaceId = workspaceStore.currentWorkspaceId

    if (!workspaceId) {
      showError('Выберите workspace')
      loading.value = false
      return false
    }

    try {
      await workspaceApi.createInvite(workspaceId, {
        email: payload.email.trim(),
        role: uiRoleToInviteApi(payload.role),
      })

      showSuccess('Успешно', 'Приглашение отправлено на email')
      return true
    } catch (err) {
      applyApiError(
        err,
        (message) => {
          error.value = message
        },
        (errors) => {
          fieldErrors.value = errors
        },
      )
      showError(error.value || 'Не удалось отправить приглашение')
      return false
    } finally {
      loading.value = false
    }
  }

  const buildAcceptInviteView = (token: string): AcceptInviteView => ({
    token,
    workspaceName: 'Workspace',
    inviterName: '—',
    role: 'Viewer',
    expiresInDays: 7,
  })

  const handleFetchInvite = async (token: string) => {
    resetState()

    if (!token.trim()) {
      return { ok: false as const, message: 'Приглашение недействительно или истекло' }
    }

    return { ok: true as const, data: buildAcceptInviteView(token) }
  }

  const handleAcceptInvite = async (token: string) => {
    resetState()
    loading.value = true

    try {
      const response = await workspaceApi.acceptInvite({ token })
      showSuccess('Успешно', response.message)
      await handleFetchWorkspaces()
      await router.push('/workspace/select')
      return true
    } catch (err) {
      const message = applyApiErrorMessage(err)
      error.value = message
      showError(message)
      return false
    } finally {
      loading.value = false
    }
  }

  const handleDeclineInvite = async (_token: string) => {
    await router.push('/auth/login')
    return true
  }

  const handleUpdateMemberRole = async (_memberId: string, _role: WorkspaceRole) => {
    showError('Изменение роли участника пока не поддерживается API')
    return false
  }

  const handleRemoveMember = async (_memberId: string) => {
    showError('Удаление участника пока не поддерживается API')
    return false
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

function applyApiErrorMessage(error: unknown): string {
  let message = 'Произошла ошибка'

  applyApiError(
    error,
    (value) => {
      message = value
    },
    () => undefined,
  )

  return message
}
