<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'

const props = withDefaults(defineProps<{
  threshold?: number
  smooth?: boolean
}>(), {
  threshold: 300,
  smooth: true,
})

const scrollY = ref(0)
const isVisible = computed(() => scrollY.value > props.threshold)

function handleScroll() {
  scrollY.value = window.scrollY
}

function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: props.smooth ? 'smooth' : 'auto',
  })
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true })
  handleScroll()
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<template>
  <Transition name="back-to-top">
    <button
      v-if="isVisible"
      class="back-to-top-btn"
      aria-label="返回顶部"
      title="返回顶部"
      @click="scrollToTop"
    >
      <div class="i-carbon-arrow-up" />
    </button>
  </Transition>
</template>

<style scoped>
.back-to-top-btn {
  position: fixed;
  right: 24px;
  bottom: 24px;
  z-index: 100;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: 1px solid var(--glass-border);
  background: var(--glass-bg);
  backdrop-filter: blur(var(--glass-blur));
  -webkit-backdrop-filter: blur(var(--glass-blur));
  box-shadow: var(--glass-shadow);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: inherit;
  opacity: 0.7;
  transition:
    opacity 0.3s ease,
    transform 0.3s ease,
    background 0.3s ease,
    border-color 0.3s ease;
}

.back-to-top-btn:hover {
  opacity: 1;
  transform: translateY(-2px);
  background: var(--glass-bg-hover);
  border-color: var(--glass-border-hover);
}

.back-to-top-btn:active {
  transform: translateY(0);
}

.back-to-top-btn .i-carbon-arrow-up {
  font-size: 20px;
}

/* Transition animations */
.back-to-top-enter-active,
.back-to-top-leave-active {
  transition:
    opacity 0.3s ease,
    transform 0.3s ease;
}

.back-to-top-enter-from,
.back-to-top-leave-to {
  opacity: 0;
  transform: translateY(20px) scale(0.8);
}

/* Mobile adjustments */
@media (max-width: 768px) {
  .back-to-top-btn {
    right: 16px;
    bottom: 16px;
    width: 40px;
    height: 40px;
  }
}

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
  .back-to-top-btn {
    transition: opacity 0.2s ease;
  }

  .back-to-top-btn:hover {
    transform: none;
  }

  .back-to-top-enter-active,
  .back-to-top-leave-active {
    transition: opacity 0.2s ease;
  }

  .back-to-top-enter-from,
  .back-to-top-leave-to {
    transform: none;
  }
}
</style>
