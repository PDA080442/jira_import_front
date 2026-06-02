<template>
  <AppLayout>
    <div class="workspace-create-page">
      <nav class="workspace-create-page__breadcrumbs">
        <RouterLink to="/workspace/select" class="workspace-create-page__breadcrumb-link">
          Workspace
        </RouterLink>
        <span class="workspace-create-page__breadcrumb-sep">&gt;</span>
        <span class="workspace-create-page__breadcrumb-current">Создание</span>
      </nav>

      <h1 class="workspace-create-page__title">Создание workspace</h1>

      <v-card variant="outlined" rounded="xl" class="workspace-create-page__card">
        <v-card-text class="pa-8">
          <WorkspaceCreateForm />
        </v-card-text>
      </v-card>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'

import WorkspaceCreateForm from '@/components/workspace/WorkspaceCreateForm.vue'
import AppLayout from '@/layouts/AppLayout.vue'
</script>

<style scoped>
.workspace-create-page__breadcrumbs {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
  font-size: 0.875rem;
}

.workspace-create-page__breadcrumb-link {
  color: #16a34a;
  text-decoration: none;
  font-weight: 500;
}

.workspace-create-page__breadcrumb-sep {
  color: #a8a29e;
}

.workspace-create-page__breadcrumb-current {
  color: #78716c;
}

.workspace-create-page__title {
  margin-bottom: 24px;
  font-size: 1.75rem;
  font-weight: 700;
  color: #1c1917;
}

.workspace-create-page__card {
  max-width: 720px;
  border-color: #e7e5e4 !important;
}
</style>
