<template>
  <div class="app-layout">
    <AppSidebarShell :expanded-width="sidebarExpandedWidth">
      <WorkspaceSidebar />
    </AppSidebarShell>

    <div class="app-layout__content">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
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
  overflow-y: auto;
  padding: 32px 40px;
  background-color: #ffffff;
  transition: width 0.25s ease;
}
</style>
