import { ref } from 'vue'
import { defineStore } from 'pinia'

import { clearTokens, getAccessToken } from '@/api/tokens'
import type { UserProfile } from '@/types'

export const useAuthStore = defineStore('auth', () => {
  const profile = ref<UserProfile | null>(null)

  const isAuthenticated = () => Boolean(getAccessToken())

  const setProfile = (value: UserProfile | null) => {
    profile.value = value
  }

  const logout = () => {
    profile.value = null
    clearTokens()
  }

  return {
    profile,
    isAuthenticated,
    setProfile,
    logout,
  }
})
