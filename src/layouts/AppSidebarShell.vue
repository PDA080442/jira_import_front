<template>
  <aside
    class="app-sidebar-shell"
    :class="{ 'app-sidebar-shell--expanded': isExpanded }"
    :style="shellStyle"
    @mouseenter="isExpanded = true"
    @mouseleave="isExpanded = false"
  >
    <div class="app-sidebar-shell__inner">
      <slot />
    </div>
  </aside>
</template>

<script setup lang="ts">
import { computed, provide, ref } from 'vue'

const props = withDefaults(
  defineProps<{
    expandedWidth?: number
    collapsedWidth?: number
  }>(),
  {
    expandedWidth: 228,
    collapsedWidth: 72,
  },
)

const isExpanded = ref(false)

provide('sidebarExpanded', isExpanded)

const shellStyle = computed(() => ({
  '--sidebar-collapsed-width': `${props.collapsedWidth}px`,
  '--sidebar-expanded-width': `${props.expandedWidth}px`,
}))
</script>

<style scoped>
.app-sidebar-shell {
  flex-shrink: 0;
  width: var(--sidebar-collapsed-width);
  min-height: 100vh;
  overflow: hidden;
  border-right: 1px solid #e7e5e4;
  background: #f5f5f4;
  transition: width 0.25s ease;
}

.app-sidebar-shell--expanded {
  width: var(--sidebar-expanded-width);
}

.app-sidebar-shell__inner {
  width: var(--sidebar-collapsed-width);
  min-height: 100%;
  transition: width 0.25s ease;
}

.app-sidebar-shell--expanded .app-sidebar-shell__inner {
  width: var(--sidebar-expanded-width);
}

.app-sidebar-shell--expanded :deep(.workspace-sidebar__inner) {
  padding: 16px 6px 16px;
}

.app-sidebar-shell--expanded :deep(.app-sidebar__collapsible) {
  margin-left: 0;
}

.app-sidebar-shell--expanded :deep(.workspace-sidebar__profile) {
  padding: 8px 6px;
}

.app-sidebar-shell--expanded :deep(.workspace-sidebar__section-label) {
  padding: 0 2px 8px;
}

.app-sidebar-shell :deep(.v-list) {
  width: 100%;
  padding: 0;
  background: transparent !important;
  box-shadow: none !important;
}

.app-sidebar-shell :deep(.v-list-item) {
  border-radius: 8px;
}

.app-sidebar-shell :deep(.v-list-item__overlay) {
  opacity: 0;
}

/* Collapsed layout */
.app-sidebar-shell:not(.app-sidebar-shell--expanded) :deep(.workspace-sidebar__inner) {
  align-items: center;
  padding: 16px 8px 12px;
}

.app-sidebar-shell:not(.app-sidebar-shell--expanded) :deep(.app-sidebar__collapsible) {
  width: 100%;
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  overflow-x: visible;
}

.app-sidebar-shell:not(.app-sidebar-shell--expanded) :deep(.workspace-sidebar__section-label),
.app-sidebar-shell:not(.app-sidebar-shell--expanded) :deep(.app-sidebar__expandable),
.app-sidebar-shell:not(.app-sidebar-shell--expanded) :deep(.v-list-item-title),
.app-sidebar-shell:not(.app-sidebar-shell--expanded) :deep(.v-list-item__content) {
  display: none !important;
}

.app-sidebar-shell:not(.app-sidebar-shell--expanded) :deep(.workspace-sidebar__section) {
  margin-bottom: 2px;
  width: 100%;
}

.app-sidebar-shell:not(.app-sidebar-shell--expanded) :deep(.workspace-sidebar__section-divider) {
  margin: 4px 0;
}

.app-sidebar-shell:not(.app-sidebar-shell--expanded) :deep(.v-list-item) {
  display: flex !important;
  justify-content: center;
  align-items: center;
  min-height: 40px;
  width: 100%;
  padding: 8px 0 !important;
  grid-template-columns: unset !important;
}

.app-sidebar-shell:not(.app-sidebar-shell--expanded) :deep(.v-list-item__prepend) {
  display: flex !important;
  justify-content: center;
  align-items: center;
  width: auto !important;
  margin-inline: 0 !important;
}

.app-sidebar-shell:not(.app-sidebar-shell--expanded) :deep(.v-list-item__prepend .v-icon) {
  font-size: 22px;
  opacity: 1;
}

.app-sidebar-shell:not(.app-sidebar-shell--expanded) :deep(.v-list-item__append) {
  display: none;
}

.app-sidebar-shell:not(.app-sidebar-shell--expanded) :deep(.workspace-sidebar__profile) {
  justify-content: center;
  width: 100%;
  margin-top: 8px;
  padding: 0;
  border: none;
  background: transparent;
}

.app-sidebar-shell:not(.app-sidebar-shell--expanded) :deep(.workspace-sidebar__profile-avatar) {
  width: 36px !important;
  height: 36px !important;
}
</style>
