<template>
  <span class="workspace-role-badge" :class="`workspace-role-badge--${role.toLowerCase()}`">
    {{ role }}
  </span>
</template>

<script setup lang="ts">
import type { WorkspaceRole } from '@/models/workspace'

defineProps<{
  role: WorkspaceRole
}>()
</script>

<style scoped>
.workspace-role-badge {
  display: inline-flex;
  align-items: center;
  padding: 2px 10px;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 600;
  line-height: 1.4;
}

.workspace-role-badge--owner {
  background: #dcfce7;
  color: #15803d;
}

.workspace-role-badge--admin {
  background: #dbeafe;
  color: #1d4ed8;
}

.workspace-role-badge--editor {
  background: #fef9c3;
  color: #a16207;
}

.workspace-role-badge--viewer {
  background: #ede9fe;
  color: #6d28d9;
}
</style>
