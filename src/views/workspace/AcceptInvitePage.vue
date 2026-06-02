<template>
  <AuthLayout>
    <AuthCard :max-width="480">
      <div v-if="pageLoading" class="accept-invite-page accept-invite-page--loading">
        <v-progress-circular indeterminate color="primary" />
      </div>

      <div v-else-if="invalidToken" class="accept-invite-page accept-invite-page--error">
        <v-icon icon="mdi-alert-circle-outline" size="48" color="error" class="mb-4" />
        <h1 class="accept-invite-page__title">Приглашение недействительно</h1>
        <p class="accept-invite-page__subtitle">
          {{ error || 'Приглашение недействительно или истекло' }}
        </p>
        <v-btn color="primary" class="text-none mt-4" to="/auth/login">Войти в аккаунт</v-btn>
      </div>

      <div v-else-if="invite" class="accept-invite-page">
        <div class="accept-invite-page__icon">
          <v-icon icon="mdi-email-open-outline" size="40" color="primary" />
        </div>

        <h1 class="accept-invite-page__title">Приглашение в workspace</h1>
        <p class="accept-invite-page__subtitle">Вас пригласили присоединиться к workspace</p>
        <div class="accept-invite-page__workspace-name">{{ invite.workspaceName }}</div>

        <v-divider class="my-6" />

        <div class="accept-invite-page__details">
          <div class="accept-invite-page__detail-row">
            <v-icon icon="mdi-office-building-outline" size="20" color="grey" />
            <span class="accept-invite-page__detail-label">Workspace</span>
            <span class="accept-invite-page__detail-value">{{ invite.workspaceName }}</span>
          </div>
          <div class="accept-invite-page__detail-row">
            <v-icon icon="mdi-account-outline" size="20" color="grey" />
            <span class="accept-invite-page__detail-label">Пригласил(а)</span>
            <span class="accept-invite-page__detail-value">{{ invite.inviterName }}</span>
          </div>
          <div class="accept-invite-page__detail-row">
            <v-icon icon="mdi-shield-outline" size="20" color="grey" />
            <span class="accept-invite-page__detail-label">Назначенная роль</span>
            <WorkspaceRoleBadge :role="invite.role" />
          </div>
        </div>

        <v-divider class="my-6" />

        <v-btn
          color="primary"
          size="large"
          block
          class="text-none mb-3"
          :loading="actionLoading"
          @click="handleAccept"
        >
          Принять приглашение
        </v-btn>
        <v-btn
          variant="outlined"
          size="large"
          block
          class="text-none"
          :disabled="actionLoading"
          @click="handleDecline"
        >
          Отклонить
        </v-btn>

        <p class="accept-invite-page__expires">
          Приглашение истекает через {{ invite.expiresInDays }} дней.
        </p>

        <v-divider class="my-6" />

        <p class="accept-invite-page__footer">
          У вас нет аккаунта или вы не вошли в систему?
          <RouterLink to="/auth/login" class="accept-invite-page__footer-link">
            Войдите в аккаунт
          </RouterLink>
          , чтобы принять приглашение.
        </p>
      </div>
    </AuthCard>
  </AuthLayout>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { RouterLink, useRoute } from 'vue-router'

import AuthCard from '@/components/auth/AuthCard.vue'
import WorkspaceRoleBadge from '@/components/workspace/WorkspaceRoleBadge.vue'
import { useWorkspaceMock } from '@/composables/useWorkspaceMock'
import AuthLayout from '@/layouts/AuthLayout.vue'
import type { WorkspaceInvite } from '@/mocks/workspace'

const route = useRoute()
const { error, handleFetchInvite, handleAcceptInvite, handleDeclineInvite } = useWorkspaceMock()

const pageLoading = ref(true)
const actionLoading = ref(false)
const invalidToken = ref(false)
const invite = ref<WorkspaceInvite | null>(null)

const loadInvite = async () => {
  pageLoading.value = true
  const token = String(route.query.token ?? '')

  const result = await handleFetchInvite(token)

  if (!result?.ok) {
    invalidToken.value = true
    invite.value = null
  } else {
    invalidToken.value = false
    invite.value = result.data
  }

  pageLoading.value = false
}

const handleAccept = async () => {
  actionLoading.value = true

  try {
    const token = String(route.query.token ?? '')
    await handleAcceptInvite(token)
  } finally {
    actionLoading.value = false
  }
}

const handleDecline = async () => {
  actionLoading.value = true

  try {
    const token = String(route.query.token ?? '')
    await handleDeclineInvite(token)
  } finally {
    actionLoading.value = false
  }
}

onMounted(() => {
  loadInvite()
})
</script>

<style scoped>
.accept-invite-page {
  text-align: center;
}

.accept-invite-page--loading,
.accept-invite-page--error {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 24px 0;
}

.accept-invite-page__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 72px;
  height: 72px;
  margin-bottom: 20px;
  border-radius: 50%;
  background: #dcfce7;
}

.accept-invite-page__title {
  font-size: 1.375rem;
  font-weight: 700;
  color: #1c1917;
}

.accept-invite-page__subtitle {
  margin-top: 8px;
  font-size: 0.9375rem;
  color: #78716c;
}

.accept-invite-page__workspace-name {
  margin-top: 12px;
  font-size: 1.5rem;
  font-weight: 700;
  color: #1c1917;
}

.accept-invite-page__details {
  display: flex;
  flex-direction: column;
  gap: 16px;
  text-align: left;
}

.accept-invite-page__detail-row {
  display: grid;
  grid-template-columns: 20px 1fr auto;
  align-items: center;
  gap: 12px;
}

.accept-invite-page__detail-label {
  font-size: 0.875rem;
  color: #78716c;
}

.accept-invite-page__detail-value {
  font-size: 0.875rem;
  font-weight: 500;
  color: #1c1917;
}

.accept-invite-page__expires {
  margin-top: 16px;
  font-size: 0.8125rem;
  color: #78716c;
}

.accept-invite-page__footer {
  font-size: 0.8125rem;
  color: #78716c;
  line-height: 1.5;
}

.accept-invite-page__footer-link {
  color: #16a34a;
  font-weight: 500;
  text-decoration: none;
}
</style>
