<template>
  <AppLayout>
    <div class="workspace-select-page">
      <div class="workspace-select-page__header">
        <div class="workspace-select-page__intro">
          <h1 class="workspace-select-page__title">Выберите workspace</h1>
          <p class="workspace-select-page__subtitle">
            Выберите workspace для работы с импортом данных или создайте новый.
          </p>
        </div>
        <v-btn
          color="primary"
          variant="flat"
          class="text-none workspace-select-page__create-btn"
          prepend-icon="mdi-plus"
          height="40"
          @click="isCreateDialogOpen = true"
        >
          Создать workspace
        </v-btn>
      </div>

      <WorkspaceSearchField v-model="searchQuery" class="workspace-select-page__search" />

      <WorkspaceSkeletonGrid v-if="loading" :count="3" />

      <div v-else class="workspace-select-page__grid">
        <WorkspaceCard
          v-for="workspace in filteredWorkspaces"
          :key="workspace.id"
          :workspace="workspace"
          :selected="selectedId === workspace.id"
          @select="handleCardSelect(workspace.id)"
          @contextmenu="handleCardContextMenu(workspace, $event)"
        />
      </div>
    </div>

    <WorkspaceContextMenu
      v-model="isContextMenuOpen"
      :target="contextMenuTarget"
      @edit="handleContextEdit"
      @duplicate="handleContextDuplicate"
      @delete="handleContextDelete"
    />

    <WorkspaceCreateDialog v-model="isCreateDialogOpen" @success="handleCreateSuccess" />

    <WorkspaceEditDialog
      v-model="isEditDialogOpen"
      :workspace="contextWorkspace"
      @success="handleEditSuccess"
    />

    <DeleteWorkspaceDialog
      v-model="isDeleteDialogOpen"
      :workspace-name="contextWorkspace?.name"
      :loading="actionLoading"
      @confirm="handleDeleteConfirm"
    />
  </AppLayout>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import DeleteWorkspaceDialog from '@/components/workspace/DeleteWorkspaceDialog.vue'
import WorkspaceCard from '@/components/workspace/WorkspaceCard.vue'
import WorkspaceContextMenu from '@/components/workspace/WorkspaceContextMenu.vue'
import WorkspaceCreateDialog from '@/components/workspace/WorkspaceCreateDialog.vue'
import WorkspaceEditDialog from '@/components/workspace/WorkspaceEditDialog.vue'
import WorkspaceSearchField from '@/components/workspace/WorkspaceSearchField.vue'
import WorkspaceSkeletonGrid from '@/components/workspace/WorkspaceSkeletonGrid.vue'
import { useWorkspaceMock } from '@/composables/useWorkspaceMock'
import AppLayout from '@/layouts/AppLayout.vue'
import type { Workspace } from '@/mocks/workspace'
import { useWorkspaceStore } from '@/stores/workspace'

const route = useRoute()
const router = useRouter()
const workspaceStore = useWorkspaceStore()
const { loading, handleFetchWorkspaces, handleDeleteWorkspace, handleDuplicateWorkspace } =
  useWorkspaceMock()

const searchQuery = ref('')
const selectedId = ref<string | null>(workspaceStore.currentWorkspaceId)
const isCreateDialogOpen = ref(false)
const isEditDialogOpen = ref(false)
const isDeleteDialogOpen = ref(false)
const isContextMenuOpen = ref(false)
const actionLoading = ref(false)
const contextWorkspace = ref<Workspace | null>(null)
const contextMenuTarget = ref<[number, number]>([0, 0])

const filteredWorkspaces = computed(() => {
  const query = searchQuery.value.trim().toLowerCase()

  if (!query) {
    return workspaceStore.workspaces
  }

  return workspaceStore.workspaces.filter((ws) => ws.name.toLowerCase().includes(query))
})

const handleCardSelect = (workspaceId: string) => {
  selectedId.value = workspaceId
  workspaceStore.setCurrentWorkspace(workspaceId)
}

const handleCardContextMenu = (workspace: Workspace, event: MouseEvent) => {
  contextWorkspace.value = workspace
  contextMenuTarget.value = [event.clientX, event.clientY]
  isContextMenuOpen.value = true
}

const handleContextEdit = () => {
  isContextMenuOpen.value = false
  isEditDialogOpen.value = true
}

const handleContextDuplicate = async () => {
  if (!contextWorkspace.value) {
    return
  }

  isContextMenuOpen.value = false

  const duplicate = await handleDuplicateWorkspace(contextWorkspace.value.id)

  if (duplicate) {
    selectedId.value = duplicate.id
    workspaceStore.setCurrentWorkspace(duplicate.id)
  }
}

const handleContextDelete = () => {
  isContextMenuOpen.value = false
  isDeleteDialogOpen.value = true
}

const handleDeleteConfirm = async () => {
  if (!contextWorkspace.value) {
    return
  }

  actionLoading.value = true

  try {
    const deletedId = contextWorkspace.value.id
    const success = await handleDeleteWorkspace(deletedId)

    if (!success) {
      return
    }

    isDeleteDialogOpen.value = false
    contextWorkspace.value = null
    selectedId.value = workspaceStore.currentWorkspaceId
  } finally {
    actionLoading.value = false
  }
}

const handleCreateSuccess = (workspace: Workspace) => {
  selectedId.value = workspace.id
}

const handleEditSuccess = (workspace: Workspace) => {
  selectedId.value = workspace.id

  if (contextWorkspace.value?.id === workspace.id) {
    contextWorkspace.value = workspace
  }
}

const openCreateDialogFromQuery = () => {
  if (route.query.create === '1') {
    isCreateDialogOpen.value = true
    router.replace({ path: route.path, query: {} })
  }
}

watch(
  () => route.query.create,
  () => {
    openCreateDialogFromQuery()
  },
)

onMounted(() => {
  handleFetchWorkspaces()
  openCreateDialogFromQuery()
})
</script>

<style scoped>
.workspace-select-page {
  width: 100%;
}

.workspace-select-page__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  margin-bottom: 24px;
}

.workspace-select-page__intro {
  min-width: 0;
}

.workspace-select-page__title {
  margin: 0 0 8px;
  font-size: 1.75rem;
  font-weight: 700;
  color: #1c1917;
  line-height: 1.2;
}

.workspace-select-page__subtitle {
  margin: 0;
  font-size: 0.9375rem;
  color: #78716c;
  line-height: 1.5;
}

.workspace-select-page__create-btn {
  flex-shrink: 0;
  padding-inline: 16px !important;
  font-size: 0.875rem;
  font-weight: 600;
  letter-spacing: 0;
}

.workspace-select-page__search {
  max-width: 420px;
  margin-bottom: 24px;
}

.workspace-select-page__grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 20px;
}

@media (max-width: 600px) {
  .workspace-select-page__grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 480px) {
  .workspace-select-page__header {
    flex-direction: column;
    align-items: stretch;
  }

  .workspace-select-page__create-btn {
    width: 100%;
  }

  .workspace-select-page__search {
    max-width: none;
  }

  .workspace-select-page__grid {
    grid-template-columns: 1fr;
  }
}
</style>
