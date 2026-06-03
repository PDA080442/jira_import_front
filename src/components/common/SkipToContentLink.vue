<template>
  <a class="skip-to-content" :href="href" @click="handleClick">
    {{ label }}
  </a>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    href?: string
    label?: string
  }>(),
  {
    href: '#main-content',
    label: 'Перейти к основному содержимому',
  },
)

const handleClick = (event: MouseEvent) => {
  const targetId = (event.currentTarget as HTMLAnchorElement).hash.slice(1)
  if (!targetId) {
    return
  }

  event.preventDefault()
  const main = document.getElementById(targetId)
  main?.focus({ preventScroll: false })
}
</script>
