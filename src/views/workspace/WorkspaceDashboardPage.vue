<template>
  <AppLayout>
    <div class="workspace-dashboard">
      <div class="workspace-dashboard__topbar">
        <h1 class="workspace-dashboard__page-title">Дашборд</h1>
        <div class="workspace-dashboard__topbar-actions">
          <v-btn icon="mdi-bell-outline" variant="text" />
          <div class="workspace-dashboard__user">
            <v-avatar size="32" color="primary">
              <span class="text-caption text-white">AD</span>
            </v-avatar>
            <span class="workspace-dashboard__user-name">Alex Developer</span>
            <v-icon icon="mdi-chevron-down" size="18" color="grey" />
          </div>
        </div>
      </div>

      <div class="workspace-dashboard__stats">
        <v-card
          v-for="stat in stats"
          :key="stat.label"
          variant="outlined"
          rounded="xl"
          class="workspace-dashboard__stat-card"
        >
          <v-card-text class="pa-5">
            <div class="workspace-dashboard__stat-label">{{ stat.label }}</div>
            <div class="workspace-dashboard__stat-value" :class="stat.colorClass">
              {{ stat.value }}
            </div>
          </v-card-text>
        </v-card>
      </div>

      <v-row class="mt-2">
        <v-col cols="12" md="7">
          <v-card variant="outlined" rounded="xl" class="mb-4">
            <v-card-title class="text-subtitle-1 font-weight-bold pa-5 pb-0">
              Последние импорты
            </v-card-title>
            <v-card-text class="pa-5">
              <div
                v-for="item in recentImports"
                :key="item.name"
                class="workspace-dashboard__import-row"
              >
                <span>{{ item.name }}</span>
                <v-chip
                  :color="item.statusColor"
                  size="small"
                  variant="tonal"
                  class="font-weight-medium"
                >
                  {{ item.status }}
                </v-chip>
              </div>
            </v-card-text>
          </v-card>

          <v-card variant="outlined" rounded="xl">
            <v-card-title class="text-subtitle-1 font-weight-bold pa-5 pb-0">
              Импорты по дням
            </v-card-title>
            <v-card-text class="pa-5">
              <div class="workspace-dashboard__chart">
                <div
                  v-for="(bar, index) in chartBars"
                  :key="index"
                  class="workspace-dashboard__chart-bar"
                  :style="{ height: `${bar}%` }"
                />
              </div>
            </v-card-text>
          </v-card>
        </v-col>

        <v-col cols="12" md="5">
          <v-card variant="outlined" rounded="xl" class="mb-4">
            <v-card-title class="text-subtitle-1 font-weight-bold pa-5 pb-0">
              Последние ошибки
            </v-card-title>
            <v-card-text class="pa-5">
              <div
                v-for="error in recentErrors"
                :key="error"
                class="workspace-dashboard__error-row"
              >
                <v-icon icon="mdi-alert-circle-outline" size="18" color="error" />
                <span>{{ error }}</span>
              </div>
            </v-card-text>
          </v-card>

          <v-btn
            color="primary"
            class="text-none"
            prepend-icon="mdi-plus"
            block
            @click="inviteDialogOpen = true"
          >
            Пригласить
          </v-btn>
        </v-col>
      </v-row>

      <InviteMemberDialog v-model="inviteDialogOpen" />
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'

import InviteMemberDialog from '@/components/workspace/InviteMemberDialog.vue'
import AppLayout from '@/layouts/AppLayout.vue'

const route = useRoute()
const inviteDialogOpen = ref(false)

const stats = [
  { label: 'Всего импортов', value: '24', colorClass: '' },
  { label: 'Успешных', value: '18', colorClass: 'text-success' },
  { label: 'Ошибок', value: '4', colorClass: 'text-error' },
  { label: 'В процессе', value: '2', colorClass: 'text-info' },
]

const recentImports = [
  { name: 'Jira Sprint 24', status: 'Успешно', statusColor: 'success' },
  { name: 'Backlog Q2', status: 'Ошибка', statusColor: 'error' },
  { name: 'Tasks Export', status: 'В процессе', statusColor: 'info' },
  { name: 'Epics Import', status: 'Успешно', statusColor: 'success' },
]

const recentErrors = [
  'Неверный формат поля Priority',
  'Отсутствует обязательное поле Summary',
  'Превышен лимит запросов API',
]

const chartBars = [40, 65, 50, 80, 55, 70, 45, 90, 60, 75, 50, 85]

onMounted(() => {
  if (route.query.invite === '1') {
    inviteDialogOpen.value = true
  }
})

watch(
  () => route.query.invite,
  (value) => {
    inviteDialogOpen.value = value === '1'
  },
)
</script>

<style scoped>
.workspace-dashboard__topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
}

.workspace-dashboard__page-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1c1917;
}

.workspace-dashboard__topbar-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.workspace-dashboard__user {
  display: flex;
  align-items: center;
  gap: 8px;
}

.workspace-dashboard__user-name {
  font-size: 0.875rem;
  font-weight: 500;
  color: #1c1917;
}

.workspace-dashboard__stats {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 16px;
  margin-bottom: 8px;
}

.workspace-dashboard__stat-card {
  border-color: #e7e5e4 !important;
}

.workspace-dashboard__stat-label {
  font-size: 0.8125rem;
  color: #78716c;
  margin-bottom: 8px;
}

.workspace-dashboard__stat-value {
  font-size: 1.75rem;
  font-weight: 700;
  color: #1c1917;
}

.workspace-dashboard__import-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 0;
  border-bottom: 1px solid #f5f5f4;
  font-size: 0.875rem;
}

.workspace-dashboard__import-row:last-child {
  border-bottom: none;
}

.workspace-dashboard__error-row {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  padding: 8px 0;
  font-size: 0.8125rem;
  color: #57534e;
}

.workspace-dashboard__chart {
  display: flex;
  align-items: flex-end;
  gap: 8px;
  height: 160px;
  padding-top: 16px;
}

.workspace-dashboard__chart-bar {
  flex: 1;
  min-height: 20px;
  border-radius: 4px 4px 0 0;
  background: #16a34a;
  opacity: 0.85;
}

@media (max-width: 960px) {
  .workspace-dashboard__stats {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
</style>
