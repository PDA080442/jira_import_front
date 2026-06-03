<template>
  <nav class="workspace-sidebar" aria-label="Основная навигация">
    <div class="workspace-sidebar__inner">
      <div
        class="workspace-sidebar__logo"
        :class="
          isExpanded ? 'workspace-sidebar__logo--expanded' : 'workspace-sidebar__logo--collapsed'
        "
      >
        <img
          :src="logoPrimary"
          alt="Sowline"
          class="workspace-sidebar__logo-image"
          :class="
            isExpanded
              ? 'workspace-sidebar__logo-image--expanded'
              : 'workspace-sidebar__logo-image--collapsed'
          "
        />
      </div>

      <div class="app-sidebar__collapsible">
        <div class="workspace-sidebar__section">
          <div id="sidebar-import-label" class="workspace-sidebar__section-label">ИМПОРТ</div>
          <v-list
            density="compact"
            nav
            bg-color="transparent"
            aria-labelledby="sidebar-import-label"
          >
            <v-list-item
              v-for="item in importItems"
              :key="item.title"
              :prepend-icon="item.icon"
              :title="item.title"
              :active="isActive(item.to)"
              :to="item.to"
              :disabled="!item.to"
              class="workspace-sidebar__nav-item"
              color="primary"
              @click="handleNavClick"
            />
          </v-list>
        </div>

        <v-divider class="workspace-sidebar__section-divider" />

        <div class="workspace-sidebar__section">
          <div id="sidebar-workspace-label" class="workspace-sidebar__section-label">WORKSPACE</div>
          <v-list
            density="compact"
            nav
            bg-color="transparent"
            aria-labelledby="sidebar-workspace-label"
          >
            <v-list-item
              v-for="item in workspaceItems"
              :key="item.title"
              :prepend-icon="item.icon"
              :title="item.title"
              :active="isActive(item.to)"
              :to="item.to"
              :disabled="!item.to"
              class="workspace-sidebar__nav-item"
              color="primary"
              @click="handleNavClick"
            />
          </v-list>
        </div>

        <v-divider class="workspace-sidebar__section-divider" />

        <div class="workspace-sidebar__section">
          <div id="sidebar-docs-label" class="workspace-sidebar__section-label">ДОКУМЕНТАЦИЯ</div>
          <v-list density="compact" nav bg-color="transparent" aria-labelledby="sidebar-docs-label">
            <v-list-item
              v-for="item in docItems"
              :key="item.title"
              :prepend-icon="item.icon"
              :title="item.title"
              disabled
              aria-disabled="true"
              class="workspace-sidebar__nav-item"
            />
          </v-list>
        </div>
      </div>

      <button
        type="button"
        class="workspace-sidebar__profile"
        aria-label="Профиль workspace Acme Dev Team"
        aria-haspopup="true"
      >
        <v-avatar size="36" color="primary" class="workspace-sidebar__profile-avatar">
          <span class="text-white text-caption font-weight-bold" aria-hidden="true">AD</span>
        </v-avatar>
        <span class="workspace-sidebar__profile-name app-sidebar__expandable">Acme Dev Team</span>
        <v-icon
          icon="mdi-chevron-down"
          size="18"
          color="grey"
          class="app-sidebar__expandable"
          aria-hidden="true"
        />
      </button>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { inject, ref, type Ref } from 'vue'
import { useRoute } from 'vue-router'

const closeMobileNav = inject<(() => void) | undefined>('closeMobileNav', undefined)

import logoPrimary from '@/assets/logo/logo-primary.png'

const route = useRoute()
const isExpanded = inject<Ref<boolean>>('sidebarExpanded', ref(false))

const importItems = [
  { title: 'Создать импорт', icon: 'mdi-plus-box-outline', to: undefined },
  { title: 'Импорты', icon: 'mdi-format-list-bulleted', to: '/' },
  { title: 'Шаблоны', icon: 'mdi-file-document-outline', to: undefined },
]

const workspaceItems = [
  { title: 'Мои workspace', icon: 'mdi-folder-outline', to: '/workspace/select' },
  { title: 'Участники', icon: 'mdi-account-group-outline', to: '/workspace/members' },
  { title: 'Настройки', icon: 'mdi-cog-outline', to: undefined },
]

const docItems = [
  { title: 'Руководство', icon: 'mdi-book-open-page-variant-outline' },
  { title: 'Поддержка', icon: 'mdi-help-circle-outline' },
]

const handleNavClick = () => {
  closeMobileNav?.()
}

const isActive = (path?: string) => {
  if (!path) {
    return false
  }

  if (path === '/') {
    return route.path === '/'
  }

  return route.path.startsWith(path)
}
</script>

<style scoped>
.workspace-sidebar {
  height: 100%;
}

.workspace-sidebar__inner {
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 100vh;
  padding: 16px 8px 16px;
}

.workspace-sidebar__logo {
  display: flex;
  align-items: center;
  flex-shrink: 0;
  width: 100%;
  overflow: visible;
}

.workspace-sidebar__logo--collapsed {
  justify-content: center;
  margin-bottom: 12px;
  padding: 0;
}

.workspace-sidebar__logo--expanded {
  justify-content: center;
  margin-bottom: 20px;
  padding: 0;
}

.workspace-sidebar__logo-image {
  display: block;
  width: 100%;
  height: auto;
  object-fit: contain;
}

.workspace-sidebar__logo-image--collapsed {
  max-width: 56px;
  max-height: 48px;
  object-position: center center;
}

.workspace-sidebar__logo-image--expanded {
  margin-right: 60px;
  max-height: 96px;
  object-position: center center;
  transform: scale(1.32);
  transform-origin: center center;
}

.app-sidebar__collapsible {
  margin-left: 30px;
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  overflow-x: hidden;
}

.workspace-sidebar__section {
  margin-bottom: 16px;
}

.workspace-sidebar__section-label {
  padding: 0 4px 8px;
  font-size: 0.6875rem;
  font-weight: 600;
  letter-spacing: 0.06em;
  color: #a8a29e;
}

.workspace-sidebar__section-divider {
  margin-bottom: 12px;
}

.workspace-sidebar__nav-item {
  margin-bottom: 2px;
  border-radius: 8px;
}

.workspace-sidebar__profile {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
  width: 100%;
  margin-top: 12px;
  padding: 10px 8px;
  border: 1px solid #e7e5e4;
  border-radius: 12px;
  background: #ffffff;
  cursor: pointer;
  text-align: left;
  font: inherit;
  color: inherit;
}

.workspace-sidebar__profile-avatar {
  flex-shrink: 0;
}

.workspace-sidebar__profile-name {
  flex: 1;
  font-size: 0.875rem;
  font-weight: 500;
  color: #1c1917;
}

@media (max-width: 480px) {
  .workspace-sidebar__logo-image--expanded {
    margin-right: 0;
    max-height: 56px;
    transform: scale(1);
  }

  .workspace-sidebar__inner {
    min-height: 100dvh;
  }
}
</style>
