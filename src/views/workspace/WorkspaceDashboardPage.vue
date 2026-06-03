<template>
  <AppLayout>
    <div class="workspace-dashboard">
      <header class="workspace-dashboard__topbar">
        <h1 class="workspace-dashboard__page-title">Дашборд</h1>
        <button type="button" class="workspace-dashboard__user">
          <v-avatar size="32" color="primary" class="workspace-dashboard__user-avatar">
            <span class="text-caption text-white font-weight-bold">AD</span>
          </v-avatar>
          <span class="workspace-dashboard__user-name">Alex Developer</span>
          <v-icon icon="mdi-chevron-down" size="18" color="#a8a29e" />
        </button>
      </header>

      <section class="workspace-dashboard__welcome">
        <div class="workspace-dashboard__welcome-text">
          <h2 class="workspace-dashboard__welcome-title">Добро пожаловать, Alex</h2>
          <p class="workspace-dashboard__welcome-subtitle">{{ welcomeSubtitle }}</p>
        </div>
        <div class="workspace-dashboard__welcome-actions">
          <v-btn
            variant="outlined"
            color="primary"
            class="text-none"
            prepend-icon="mdi-plus"
            @click="createImportDialogOpen = true"
          >
            Создать импорт
          </v-btn>
          <v-btn
            variant="outlined"
            color="primary"
            class="text-none"
            prepend-icon="mdi-account-plus-outline"
            @click="inviteDialogOpen = true"
          >
            Пригласить
          </v-btn>
        </div>
      </section>

      <DashboardSkeleton v-if="loading" />

      <PageErrorState
        v-else-if="error"
        :description="error"
        :loading="loading"
        @retry="handleFetchDashboard"
      />

      <AppEmptyState
        v-else-if="isDashboardEmpty"
        title="Пока нет импортов"
        description="Создайте первый импорт, чтобы начать работу с данными."
        action-label="Создать импорт"
        icon="mdi-database-import-outline"
        @action="createImportDialogOpen = true"
      />

      <template v-else>
        <section class="workspace-dashboard__stats">
          <article
            v-for="stat in stats"
            :key="stat.label"
            class="workspace-dashboard__stat-card"
            :class="`workspace-dashboard__stat-card--${stat.tone}`"
          >
            <div class="workspace-dashboard__stat-content">
              <span class="workspace-dashboard__stat-label">{{ stat.label }}</span>
              <span class="workspace-dashboard__stat-value">{{ stat.value }}</span>
            </div>
            <div
              class="workspace-dashboard__stat-icon"
              :class="`workspace-dashboard__stat-icon--${stat.tone}`"
            >
              <v-icon :icon="stat.icon" size="22" />
            </div>
          </article>
        </section>

        <v-card
          variant="flat"
          rounded="lg"
          class="workspace-dashboard__card workspace-dashboard__imports"
        >
          <div class="workspace-dashboard__card-header">
            <h3 class="workspace-dashboard__card-title">Последние импорты</h3>
            <a href="#" class="workspace-dashboard__card-link" @click.prevent>Смотреть все</a>
          </div>

          <div class="workspace-dashboard__table">
            <div class="workspace-dashboard__table-head">
              <span>Name</span>
              <span>Status</span>
              <span>Date</span>
              <span class="workspace-dashboard__table-head-action" />
            </div>
            <button
              v-for="item in recentImports"
              :key="item.name"
              type="button"
              class="workspace-dashboard__table-row"
            >
              <span class="workspace-dashboard__table-name">{{ item.name }}</span>
              <span class="workspace-dashboard__table-status">
                <span
                  class="workspace-dashboard__status-pill"
                  :class="`workspace-dashboard__status-pill--${item.statusTone}`"
                >
                  {{ item.status }}
                </span>
              </span>
              <span class="workspace-dashboard__table-date">{{ item.date }}</span>
              <span class="workspace-dashboard__table-chevron">
                <v-icon icon="mdi-chevron-right" size="20" color="#a8a29e" />
              </span>
            </button>
          </div>
        </v-card>

        <section class="workspace-dashboard__bottom">
          <v-card
            variant="flat"
            rounded="lg"
            class="workspace-dashboard__card workspace-dashboard__chart-card"
          >
            <div class="workspace-dashboard__card-header">
              <h3 class="workspace-dashboard__card-title">Импорты по неделям</h3>
              <a href="#" class="workspace-dashboard__card-link" @click.prevent>Смотреть все</a>
            </div>

            <div class="workspace-dashboard__chart">
              <div class="workspace-dashboard__chart-y-axis">
                <span v-for="tick in chartYTicks" :key="tick">{{ tick }}</span>
              </div>
              <div class="workspace-dashboard__chart-body">
                <div class="workspace-dashboard__chart-bars">
                  <div
                    v-for="(bar, index) in weeklyChart"
                    :key="bar.label"
                    class="workspace-dashboard__chart-bar-wrap"
                  >
                    <div
                      class="workspace-dashboard__chart-bar"
                      :style="{ height: `${(bar.value / chartMax) * 100}%` }"
                    />
                    <span class="workspace-dashboard__chart-bar-label">{{ bar.label }}</span>
                  </div>
                </div>
              </div>
            </div>
          </v-card>

          <v-card
            variant="flat"
            rounded="lg"
            class="workspace-dashboard__card workspace-dashboard__errors-card"
          >
            <div class="workspace-dashboard__card-header">
              <h3 class="workspace-dashboard__card-title">Последние ошибки</h3>
            </div>

            <div class="workspace-dashboard__errors">
              <button
                v-for="error in recentErrors"
                :key="error.file"
                type="button"
                class="workspace-dashboard__error-item"
              >
                <v-icon
                  icon="mdi-alert-circle"
                  size="22"
                  color="#ef4444"
                  class="workspace-dashboard__error-icon"
                />
                <span class="workspace-dashboard__error-content">
                  <span class="workspace-dashboard__error-file">{{ error.file }}</span>
                  <span class="workspace-dashboard__error-message">{{ error.message }}</span>
                </span>
                <span class="workspace-dashboard__error-meta">
                  <span class="workspace-dashboard__error-date">{{ error.date }}</span>
                  <v-icon icon="mdi-chevron-right" size="20" color="#a8a29e" />
                </span>
              </button>
            </div>
          </v-card>
        </section>
      </template>

      <CreateImportDialog v-model="createImportDialogOpen" />
      <InviteMemberDialog v-model="inviteDialogOpen" />
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'

import AppEmptyState from '@/components/common/AppEmptyState.vue'
import PageErrorState from '@/components/common/PageErrorState.vue'
import CreateImportDialog from '@/components/workspace/CreateImportDialog.vue'
import DashboardSkeleton from '@/components/workspace/DashboardSkeleton.vue'
import InviteMemberDialog from '@/components/workspace/InviteMemberDialog.vue'
import { useWorkspaceMock } from '@/composables/useWorkspaceMock'
import AppLayout from '@/layouts/AppLayout.vue'

const route = useRoute()
const createImportDialogOpen = ref(false)
const inviteDialogOpen = ref(false)

const { loading, error, dashboardData, handleFetchDashboard } = useWorkspaceMock()

const welcomeSubtitle = computed(
  () => dashboardData.value?.welcomeSubtitle ?? 'Acme Dev Team · загрузка…',
)

const stats = computed(() => dashboardData.value?.stats ?? [])
const recentImports = computed(() => dashboardData.value?.recentImports ?? [])
const recentErrors = computed(() => dashboardData.value?.recentErrors ?? [])
const weeklyChart = computed(() => dashboardData.value?.weeklyChart ?? [])
const chartMax = computed(() => dashboardData.value?.chartMax ?? 15)

const chartYTicks = computed(() => {
  const max = chartMax.value
  return [max, Math.round((max * 2) / 3), Math.round(max / 3), 0]
})

const isDashboardEmpty = computed(
  () => dashboardData.value !== null && dashboardData.value.recentImports.length === 0,
)

onMounted(() => {
  handleFetchDashboard()

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
.workspace-dashboard {
  margin: -32px -40px;
  min-height: calc(100vh - 0px);
  padding: 28px 40px 40px;
  background: #fafaf9;
}

.workspace-dashboard__topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 28px;
}

.workspace-dashboard__page-title {
  margin: 0;
  font-size: 1.125rem;
  font-weight: 600;
  color: #1c1917;
}

.workspace-dashboard__user {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 0;
  border: none;
  background: transparent;
  cursor: pointer;
}

.workspace-dashboard__user-name {
  font-size: 0.875rem;
  font-weight: 500;
  color: #1c1917;
}

.workspace-dashboard__welcome {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 24px;
  margin-bottom: 24px;
}

.workspace-dashboard__welcome-title {
  margin: 0 0 6px;
  font-size: 1.75rem;
  font-weight: 700;
  color: #1c1917;
  line-height: 1.2;
}

.workspace-dashboard__welcome-subtitle {
  margin: 0;
  font-size: 0.9375rem;
  color: #78716c;
}

.workspace-dashboard__welcome-actions {
  display: flex;
  flex-shrink: 0;
  gap: 12px;
}

.workspace-dashboard__welcome-actions :deep(.v-btn) {
  height: 40px;
  padding-inline: 16px;
  border-color: #16a34a;
  font-size: 0.875rem;
  font-weight: 600;
  letter-spacing: 0;
}

.workspace-dashboard__stats {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 16px;
  margin-bottom: 20px;
}

.workspace-dashboard__stat-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px;
  border: 1px solid #e7e5e4;
  border-left-width: 4px;
  border-radius: 12px;
  background: #ffffff;
  box-shadow: 0 1px 2px rgba(28, 25, 23, 0.04);
}

.workspace-dashboard__stat-card--total {
  border-left-color: #16a34a;
}

.workspace-dashboard__stat-card--success {
  border-left-color: #f97316;
}

.workspace-dashboard__stat-card--error {
  border-left-color: #3b82f6;
}

.workspace-dashboard__stat-card--progress {
  border-left-color: #78716c;
}

.workspace-dashboard__stat-content {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.workspace-dashboard__stat-label {
  font-size: 0.875rem;
  color: #78716c;
}

.workspace-dashboard__stat-value {
  font-size: 1.875rem;
  font-weight: 700;
  color: #1c1917;
  line-height: 1;
}

.workspace-dashboard__stat-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border-radius: 50%;
}

.workspace-dashboard__stat-icon--total {
  background: #dcfce7;
  color: #16a34a;
}

.workspace-dashboard__stat-icon--success {
  background: #dcfce7;
  color: #16a34a;
}

.workspace-dashboard__stat-icon--error {
  background: #fee2e2;
  color: #ef4444;
}

.workspace-dashboard__stat-icon--progress {
  background: #f5f5f4;
  color: #78716c;
}

.workspace-dashboard__card {
  border: 1px solid #e7e5e4 !important;
  background: #ffffff !important;
  box-shadow: 0 1px 2px rgba(28, 25, 23, 0.04) !important;
}

.workspace-dashboard__imports {
  margin-bottom: 20px;
  padding: 20px 24px 8px;
}

.workspace-dashboard__card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.workspace-dashboard__card-title {
  margin: 0;
  font-size: 1rem;
  font-weight: 700;
  color: #1c1917;
}

.workspace-dashboard__card-link {
  font-size: 0.875rem;
  font-weight: 500;
  color: #16a34a;
  text-decoration: none;
}

.workspace-dashboard__card-link:hover {
  text-decoration: underline;
}

.workspace-dashboard__table-head,
.workspace-dashboard__table-row {
  display: grid;
  grid-template-columns: 1fr 140px 180px 32px;
  align-items: center;
  gap: 16px;
}

.workspace-dashboard__table-head {
  padding: 0 8px 12px;
  border-bottom: 1px solid #f5f5f4;
  font-size: 0.8125rem;
  font-weight: 500;
  color: #a8a29e;
}

.workspace-dashboard__table-row {
  width: 100%;
  padding: 14px 8px;
  border: none;
  border-bottom: 1px solid #f5f5f4;
  background: transparent;
  text-align: left;
  cursor: pointer;
  transition: background-color 0.15s ease;
}

.workspace-dashboard__table-row:last-child {
  border-bottom: none;
}

.workspace-dashboard__table-row:hover {
  background: #fafaf9;
}

.workspace-dashboard__table-name {
  font-size: 0.875rem;
  font-weight: 500;
  color: #1c1917;
}

.workspace-dashboard__table-date {
  font-size: 0.875rem;
  color: #78716c;
}

.workspace-dashboard__table-chevron {
  display: flex;
  justify-content: flex-end;
}

.workspace-dashboard__status-pill {
  display: inline-flex;
  align-items: center;
  padding: 4px 12px;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 600;
  line-height: 1.4;
}

.workspace-dashboard__status-pill--success {
  background: #dcfce7;
  color: #15803d;
}

.workspace-dashboard__status-pill--error {
  background: #fee2e2;
  color: #b91c1c;
}

.workspace-dashboard__status-pill--progress {
  background: #dbeafe;
  color: #1d4ed8;
}

.workspace-dashboard__bottom {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 20px;
}

.workspace-dashboard__chart-card,
.workspace-dashboard__errors-card {
  padding: 20px 24px 24px;
}

.workspace-dashboard__chart {
  display: flex;
  gap: 12px;
  height: 220px;
}

.workspace-dashboard__chart-y-axis {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding-bottom: 28px;
  font-size: 0.75rem;
  color: #a8a29e;
}

.workspace-dashboard__chart-body {
  flex: 1;
  min-width: 0;
}

.workspace-dashboard__chart-bars {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 12px;
  height: 100%;
  padding-bottom: 28px;
  border-bottom: 1px solid #e7e5e4;
}

.workspace-dashboard__chart-bar-wrap {
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  height: 100%;
  min-width: 0;
}

.workspace-dashboard__chart-bar {
  width: 100%;
  max-width: 48px;
  min-height: 4px;
  border-radius: 6px 6px 0 0;
  background: #16a34a;
}

.workspace-dashboard__chart-bar-label {
  margin-top: 10px;
  font-size: 0.75rem;
  color: #78716c;
  white-space: nowrap;
}

.workspace-dashboard__errors {
  display: flex;
  flex-direction: column;
}

.workspace-dashboard__error-item {
  display: grid;
  grid-template-columns: 28px 1fr auto;
  gap: 12px;
  align-items: flex-start;
  width: 100%;
  padding: 14px 0;
  border: none;
  border-bottom: 1px solid #f5f5f4;
  background: transparent;
  text-align: left;
  cursor: pointer;
}

.workspace-dashboard__error-item:last-child {
  border-bottom: none;
}

.workspace-dashboard__error-item:hover {
  opacity: 0.85;
}

.workspace-dashboard__error-icon {
  margin-top: 2px;
}

.workspace-dashboard__error-content {
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
}

.workspace-dashboard__error-file {
  font-size: 0.875rem;
  font-weight: 600;
  color: #1c1917;
}

.workspace-dashboard__error-message {
  font-size: 0.8125rem;
  color: #78716c;
  line-height: 1.4;
}

.workspace-dashboard__error-meta {
  display: flex;
  align-items: center;
  gap: 4px;
  flex-shrink: 0;
}

.workspace-dashboard__error-date {
  font-size: 0.75rem;
  color: #a8a29e;
  white-space: nowrap;
}

@media (max-width: 1100px) {
  .workspace-dashboard__stats {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .workspace-dashboard__bottom {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .workspace-dashboard {
    margin: -32px -24px;
    padding: 24px;
  }

  .workspace-dashboard__welcome {
    flex-direction: column;
  }

  .workspace-dashboard__welcome-actions {
    width: 100%;
    flex-direction: column;
  }

  .workspace-dashboard__welcome-actions :deep(.v-btn) {
    width: 100%;
  }

  .workspace-dashboard__table-head,
  .workspace-dashboard__table-row {
    grid-template-columns: 1fr 120px;
    grid-template-rows: auto auto;
  }

  .workspace-dashboard__table-head span:nth-child(3),
  .workspace-dashboard__table-head span:nth-child(4),
  .workspace-dashboard__table-date,
  .workspace-dashboard__table-chevron {
    display: none;
  }
}
</style>
