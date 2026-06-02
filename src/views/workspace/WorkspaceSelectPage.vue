<template>
  <AppLayout>
    <div class="workspace-select-page">
      <div class="workspace-select-page__header">
        <div>
          <h1 class="workspace-select-page__title">Выберите workspace</h1>
          <p class="workspace-select-page__subtitle">
            Выберите workspace для работы с импортом данных или создайте новый.
          </p>
        </div>
        <v-btn color="primary" class="text-none" prepend-icon="mdi-plus" to="/workspace/create">
          Создать workspace
        </v-btn>
      </div>

      <WorkspaceSearchField v-model="searchQuery" class="workspace-select-page__search mb-6" />

      <WorkspaceSkeletonGrid v-if="loading" />

      <div v-else class="workspace-select-page__grid">
        <WorkspaceCard
          v-for="workspace in filteredWorkspaces"
          :key="workspace.id"
          :workspace="workspace"
          :selected="selectedId === workspace.id"
          @select="handleCardSelect(workspace.id)"
        />
      </div>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'

import WorkspaceCard from '@/components/workspace/WorkspaceCard.vue'
import WorkspaceSearchField from '@/components/workspace/WorkspaceSearchField.vue'
import WorkspaceSkeletonGrid from '@/components/workspace/WorkspaceSkeletonGrid.vue'
import { useWorkspaceMock } from '@/composables/useWorkspaceMock'
import AppLayout from '@/layouts/AppLayout.vue'
import { useWorkspaceStore } from '@/stores/workspace'

const workspaceStore = useWorkspaceStore()
const { loading, handleFetchWorkspaces, handleSelectWorkspace } = useWorkspaceMock()

const searchQuery = ref('')
const selectedId = ref<string | null>(workspaceStore.currentWorkspaceId)

const filteredWorkspaces = computed(() => {
  const query = searchQuery.value.trim().toLowerCase()

  if (!query) {
    return workspaceStore.workspaces
  }

  return workspaceStore.workspaces.filter((ws) => ws.name.toLowerCase().includes(query))
})

const handleCardSelect = async (workspaceId: string) => {
  selectedId.value = workspaceId
  await handleSelectWorkspace(workspaceId)
}

onMounted(() => {
  handleFetchWorkspaces()
})
</script>

<style scoped>
.workspace-select-page__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 24px;
  margin-bottom: 28px;
}

.workspace-select-page__title {
  margin-bottom: 8px;
  font-size: 1.75rem;
  font-weight: 700;
  color: #1c1917;
  line-height: 1.2;
}

.workspace-select-page__subtitle {
  max-width: 560px;
  font-size: 0.9375rem;
  color: #78716c;
  line-height: 1.5;
}

.workspace-select-page__search {
  max-width: 100%;
}

.workspace-select-page__grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 20px;
}

@media (max-width: 1200px) {
  .workspace-select-page__grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 768px) {
  .workspace-select-page__header {
    flex-direction: column;
  }

  .workspace-select-page__grid {
    grid-template-columns: 1fr;
  }
}
</style>
