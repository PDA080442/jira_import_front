<template>
  <div class="workspace-skeleton-grid">
    <v-card
      v-for="index in count"
      :key="index"
      variant="outlined"
      rounded="xl"
      class="workspace-skeleton-grid__card"
    >
      <v-card-text class="pa-5">
        <div class="d-flex ga-3">
          <v-skeleton-loader type="avatar" width="44" height="44" />
          <div class="flex-grow-1">
            <v-skeleton-loader type="text" width="60%" class="mb-2" />
            <v-skeleton-loader type="chip" width="56" />
          </div>
        </div>
        <v-divider class="my-4" />
        <v-skeleton-loader type="text@2" />
      </v-card-text>
    </v-card>
  </div>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    count?: number
  }>(),
  {
    count: 6,
  },
)
</script>

<style scoped>
.workspace-skeleton-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 20px;
}

.workspace-skeleton-grid__card {
  border-color: #e7e5e4 !important;
}

@media (max-width: 1200px) {
  .workspace-skeleton-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 768px) {
  .workspace-skeleton-grid {
    grid-template-columns: 1fr;
  }
}
</style>
