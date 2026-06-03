<template>
  <div class="app-layout" :class="{ 'app-layout--mobile-nav-open': mobileNavOpen && isMobile }">
    <SkipToContentLink />

    <header v-if="isMobile" class="app-layout__mobile-bar">
      <v-btn
        icon
        variant="text"
        class="app-layout__menu-btn"
        :aria-expanded="mobileNavOpen"
        aria-controls="app-sidebar"
        aria-label="Открыть меню навигации"
        @click="toggleMobileNav"
      >
        <v-icon :icon="mobileNavOpen ? 'mdi-close' : 'mdi-menu'" size="24" />
      </v-btn>
      <span class="app-layout__mobile-title">Sowline</span>
    </header>

    <button
      v-if="isMobile && mobileNavOpen"
      type="button"
      class="app-layout__overlay"
      aria-label="Закрыть меню"
      @click="closeMobileNav"
    />

    <AppSidebarShell
      id="app-sidebar"
      class="app-layout__sidebar"
      :expanded-width="sidebarExpandedWidth"
      :mobile-mode="isMobile"
      :mobile-open="mobileNavOpen"
      @navigate="closeMobileNav"
    >
      <WorkspaceSidebar />
    </AppSidebarShell>

    <main
      id="main-content"
      class="app-layout__content"
      tabindex="-1"
      aria-label="Основное содержимое"
    >
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
import { provide, watch } from 'vue'
import { useRoute } from 'vue-router'

import SkipToContentLink from '@/components/common/SkipToContentLink.vue'
import { useMobileLayout } from '@/composables/useMobileLayout'
import AppSidebarShell from '@/layouts/AppSidebarShell.vue'
import WorkspaceSidebar from '@/layouts/WorkspaceSidebar.vue'

withDefaults(
  defineProps<{
    sidebarExpandedWidth?: number
  }>(),
  {
    sidebarExpandedWidth: 228,
  },
)

const route = useRoute()
const { isMobile, mobileNavOpen, closeMobileNav, toggleMobileNav } = useMobileLayout()

provide('isMobileLayout', isMobile)
provide('closeMobileNav', closeMobileNav)

watch(
  () => route.path,
  () => {
    closeMobileNav()
  },
)
</script>

<style scoped>
.app-layout {
  display: flex;
  height: 100vh;
  overflow: hidden;
  background-color: rgb(var(--v-theme-background));
}

.app-layout__content {
  flex: 1;
  min-width: 0;
  height: 100vh;
  overflow-x: hidden;
  overflow-y: auto;
  padding: 32px 40px;
  background-color: #ffffff;
}

.app-layout__mobile-bar {
  display: none;
}

.app-layout__overlay {
  display: none;
}

@media (max-width: 768px) {
  .app-layout__content {
    padding: 24px 16px;
  }
}

@media (max-width: 480px) {
  .app-layout {
    flex-direction: column;
  }

  .app-layout__mobile-bar {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-shrink: 0;
    height: 52px;
    padding: 0 8px 0 4px;
    border-bottom: 1px solid #e7e5e4;
    background: #ffffff;
    z-index: 1002;
  }

  .app-layout__mobile-title {
    font-size: 1rem;
    font-weight: 700;
    color: #1c1917;
  }

  .app-layout__menu-btn {
    flex-shrink: 0;
  }

  .app-layout__sidebar {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 1001;
    height: 100dvh;
    width: min(280px, 88vw) !important;
    transform: translateX(-100%);
    transition: transform 0.25s ease;
    box-shadow: none;
  }

  .app-layout--mobile-nav-open .app-layout__sidebar {
    transform: translateX(0);
    box-shadow: 8px 0 32px rgba(28, 25, 23, 0.12);
  }

  .app-layout__overlay {
    display: block;
    position: fixed;
    inset: 0;
    z-index: 1000;
    border: none;
    padding: 0;
    background: rgba(28, 25, 23, 0.45);
    cursor: pointer;
  }

  .app-layout:not(.app-layout--mobile-nav-open) .app-layout__overlay {
    display: none;
  }

  .app-layout__content {
    flex: 1;
    width: 100%;
    height: auto;
    min-height: 0;
    padding: 16px 12px 20px;
  }
}
</style>
