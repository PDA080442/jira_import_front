<template>
  <v-table class="workspace-members-skeleton">
    <thead>
      <tr>
        <th>Участник</th>
        <th>Роль</th>
        <th>Дата добавления</th>
        <th>Действия</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="index in 6" :key="index">
        <td>
          <div class="d-flex align-center ga-3">
            <v-skeleton-loader type="avatar" width="40" height="40" />
            <div class="flex-grow-1">
              <v-skeleton-loader type="text" width="40%" class="mb-1" />
              <v-skeleton-loader type="text" width="55%" />
            </div>
          </div>
        </td>
        <td><v-skeleton-loader type="chip" width="72" /></td>
        <td><v-skeleton-loader type="text" width="120" /></td>
        <td><v-skeleton-loader type="button" width="32" /></td>
      </tr>
    </tbody>
  </v-table>
</template>

<style scoped>
.workspace-members-skeleton {
  border: 1px solid #e7e5e4;
  border-radius: 12px;
  overflow: hidden;
}

.workspace-members-skeleton :deep(th) {
  background: #fafaf9;
  font-size: 0.8125rem !important;
  font-weight: 600 !important;
  color: #78716c !important;
}
</style>
