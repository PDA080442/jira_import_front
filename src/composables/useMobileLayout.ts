import { onMounted, onUnmounted, ref } from 'vue'

const MOBILE_QUERY = '(max-width: 480px)'

export const useMobileLayout = () => {
  const isMobile = ref(false)
  const mobileNavOpen = ref(false)

  let mediaQuery: MediaQueryList | null = null

  const syncMobile = (matches: boolean) => {
    isMobile.value = matches

    if (!matches) {
      mobileNavOpen.value = false
    }
  }

  const handleMediaChange = (event: MediaQueryListEvent) => {
    syncMobile(event.matches)
  }

  const openMobileNav = () => {
    mobileNavOpen.value = true
  }

  const closeMobileNav = () => {
    mobileNavOpen.value = false
  }

  const toggleMobileNav = () => {
    mobileNavOpen.value = !mobileNavOpen.value
  }

  onMounted(() => {
    mediaQuery = window.matchMedia(MOBILE_QUERY)
    syncMobile(mediaQuery.matches)
    mediaQuery.addEventListener('change', handleMediaChange)
  })

  onUnmounted(() => {
    mediaQuery?.removeEventListener('change', handleMediaChange)
  })

  return {
    isMobile,
    mobileNavOpen,
    openMobileNav,
    closeMobileNav,
    toggleMobileNav,
  }
}
