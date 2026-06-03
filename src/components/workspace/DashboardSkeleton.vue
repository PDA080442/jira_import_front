<template>
  <div class="dashboard-skeleton">
    <div class="dashboard-skeleton__stats">
      <v-card
        v-for="index in 4"
        :key="index"
        variant="outlined"
        rounded="lg"
        class="dashboard-skeleton__stat-card"
      >
        <v-card-text class="pa-5">
          <v-skeleton-loader type="text" width="40%" class="mb-2" />
          <v-skeleton-loader type="heading" width="30%" />
        </v-card-text>
      </v-card>
    </div>

    <v-card variant="outlined" rounded="lg" class="dashboard-skeleton__card mb-5">
      <v-card-text class="pa-5">
        <v-skeleton-loader type="text" width="25%" class="mb-4" />
        <v-skeleton-loader type="text@5" />
      </v-card-text>
    </v-card>

    <div class="dashboard-skeleton__bottom">
      <v-card variant="outlined" rounded="lg" class="dashboard-skeleton__card">
        <v-card-text class="pa-5">
          <v-skeleton-loader type="text" width="35%" class="mb-4" />
          <v-skeleton-loader type="image" height="160" />
        </v-card-text>
      </v-card>
      <v-card variant="outlined" rounded="lg" class="dashboard-skeleton__card">
        <v-card-text class="pa-5">
          <v-skeleton-loader type="text" width="35%" class="mb-4" />
          <v-skeleton-loader type="text@3" />
        </v-card-text>
      </v-card>
    </div>
  </div>
</template>

<style scoped>
.dashboard-skeleton__stats {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 16px;
  margin-bottom: 20px;
}

.dashboard-skeleton__stat-card {
  border-color: #e7e5e4 !important;
}

.dashboard-skeleton__card {
  border-color: #e7e5e4 !important;
}

.dashboard-skeleton__bottom {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 20px;
}

@media (max-width: 1100px) {
  .dashboard-skeleton__stats {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .dashboard-skeleton__bottom {
    grid-template-columns: 1fr;
  }
}
</style>
