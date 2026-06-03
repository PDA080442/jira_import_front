<template>
  <div class="workspace-members-header">
    <div class="workspace-members-header__selector">
      <v-menu>
        <template #activator="{ props: menuProps }">
          <v-btn
            v-bind="menuProps"
            variant="outlined"
            class="text-none workspace-members-header__workspace-btn"
          >
            <v-avatar size="24" color="primary" class="mr-2">
              <v-icon icon="mdi-pine-tree" size="14" color="white" />
            </v-avatar>
            {{ currentName }}
            <v-icon icon="mdi-chevron-down" size="18" class="ml-2" />
          </v-btn>
        </template>
        <v-list density="compact" min-width="220">
          <v-list-item
            v-for="workspace in workspaces"
            :key="workspace.id"
            :title="workspace.name"
            @click="handleWorkspaceChange(workspace.id)"
          />
        </v-list>
      </v-menu>
    </div>

    <div class="workspace-members-header__profile">
      <v-avatar size="36">
        <v-img src="https://i.pravatar.cc/72?img=12" alt="Иван Петров" />
      </v-avatar>
      <div class="workspace-members-header__profile-info">
        <div class="workspace-members-header__profile-name">Иван Петров</div>
        <div class="workspace-members-header__profile-role">Owner</div>
      </div>
      <v-icon icon="mdi-chevron-down" size="18" color="grey" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

import { useWorkspaceStore } from '@/stores/workspace'

const workspaceStore = useWorkspaceStore()

const workspaces = computed(() => workspaceStore.workspaces)

const currentName = computed(() => workspaceStore.selectedWorkspace?.name ?? 'Green Future')

const handleWorkspaceChange = (id: string) => {
  workspaceStore.setCurrentWorkspace(id)
}
</script>

<style scoped>
.workspace-members-header {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 24px;
  margin-bottom: 28px;
}

.workspace-members-header__workspace-btn {
  border-color: #e7e5e4 !important;
  font-weight: 500;
}

.workspace-members-header__profile {
  display: flex;
  align-items: center;
  gap: 10px;
}

.workspace-members-header__profile-info {
  text-align: left;
}

.workspace-members-header__profile-name {
  font-size: 0.875rem;
  font-weight: 600;
  color: #1c1917;
}

.workspace-members-header__profile-role {
  font-size: 0.75rem;
  color: #78716c;
}

@media (max-width: 480px) {
  .workspace-members-header {
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
    margin-bottom: 16px;
  }

  .workspace-members-header__selector,
  .workspace-members-header__workspace-btn {
    width: 100%;
  }

  .workspace-members-header__profile {
    justify-content: space-between;
    padding: 10px 12px;
    border: 1px solid #e7e5e4;
    border-radius: 12px;
    background: #fafaf9;
  }

  .workspace-members-header__profile-info {
    flex: 1;
    min-width: 0;
  }

  .workspace-members-header__profile-name,
  .workspace-members-header__profile-role {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
</style>
