<script setup lang="ts">
import { RouterView } from 'vue-router'

import AppToast from '@/components/common/AppToast.vue'
import { useAppNotify } from '@/composables/useAppNotify'

const { snackbarState, hideSnackbar } = useAppNotify()
</script>

<template>
  <v-app>
    <v-main class="pa-0">
      <RouterView />
    </v-main>

    <AppToast />

    <v-snackbar
      v-model="snackbarState.show"
      color="error"
      location="bottom"
      :timeout="6000"
      role="alert"
      aria-live="assertive"
    >
      <div class="d-flex align-center">
        <v-icon icon="mdi-alert-circle" color="white" class="mr-2" />
        {{ snackbarState.message }}
      </div>
      <template #actions>
        <v-btn
          variant="text"
          color="white"
          class="text-none font-weight-bold"
          @click="hideSnackbar"
        >
          ЗАКРЫТЬ
        </v-btn>
      </template>
    </v-snackbar>
  </v-app>
</template>
