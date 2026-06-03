import { computed, ref } from 'vue'
import { defineStore } from 'pinia'

import type { WorkspaceListItem } from '@/models/workspace'

const STORAGE_KEY = 'forest-trust-current-workspace-id'

export const useWorkspaceStore = defineStore('workspace', () => {
  const workspaces = ref<WorkspaceListItem[]>([])
  const currentWorkspaceId = ref<string | null>(sessionStorage.getItem(STORAGE_KEY))

  const selectedWorkspace = computed(
    () => workspaces.value.find((ws) => ws.id === currentWorkspaceId.value) ?? null,
  )

  const setWorkspaces = (items: WorkspaceListItem[]) => {
    workspaces.value = items
  }

  const setCurrentWorkspace = (id: string) => {
    currentWorkspaceId.value = id
    sessionStorage.setItem(STORAGE_KEY, id)
  }

  const clearCurrentWorkspace = () => {
    currentWorkspaceId.value = null
    sessionStorage.removeItem(STORAGE_KEY)
  }

  return {
    workspaces,
    currentWorkspaceId,
    selectedWorkspace,
    setWorkspaces,
    setCurrentWorkspace,
    clearCurrentWorkspace,
  }
})
