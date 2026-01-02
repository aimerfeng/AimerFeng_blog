<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const isTransitioning = ref(false)
const transitionDirection = ref<'forward' | 'backward'>('forward')

// Track navigation history for direction detection
const historyStack = ref<string[]>([])

onMounted(() => {
  // Initialize with current path
  historyStack.value.push(router.currentRoute.value.path)

  router.beforeEach((to, _from) => {
    // Determine direction based on history
    const toIndex = historyStack.value.indexOf(to.path)
    if (toIndex !== -1) {
      // Going back in history
      transitionDirection.value = 'backward'
      historyStack.value = historyStack.value.slice(0, toIndex + 1)
    }
    else {
      // Going forward
      transitionDirection.value = 'forward'
      historyStack.value.push(to.path)
    }

    isTransitioning.value = true
  })

  router.afterEach(() => {
    // Small delay to ensure smooth transition
    setTimeout(() => {
      isTransitioning.value = false
    }, 50)
  })
})
</script>

<template>
  <div class="page-transition-wrapper">
    <slot />
  </div>
</template>

<style scoped>
.page-transition-wrapper {
  position: relative;
  width: 100%;
  min-height: 100vh;
}
</style>
