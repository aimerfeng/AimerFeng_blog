<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'

const props = withDefaults(defineProps<{
  color?: string
  height?: number
  showOnlyInPosts?: boolean
}>(), {
  color: 'var(--c-brand, #3b82f6)',
  height: 3,
  showOnlyInPosts: true,
})

const progress = ref(0)
const isPostPage = ref(false)

function calculateProgress() {
  const scrollTop = window.scrollY
  const docHeight = document.documentElement.scrollHeight - window.innerHeight
  progress.value = docHeight > 0 ? Math.min((scrollTop / docHeight) * 100, 100) : 0
}

function checkIfPostPage() {
  // Check if current page is a blog post
  isPostPage.value = window.location.pathname.includes('/posts/')
}

const shouldShow = computed(() => {
  if (!props.showOnlyInPosts)
    return true
  return isPostPage.value
})

onMounted(() => {
  checkIfPostPage()
  window.addEventListener('scroll', calculateProgress, { passive: true })
  window.addEventListener('resize', calculateProgress, { passive: true })
  calculateProgress()
})

onUnmounted(() => {
  window.removeEventListener('scroll', calculateProgress)
  window.removeEventListener('resize', calculateProgress)
})
</script>

<template>
  <Transition name="progress-fade">
    <div
      v-if="shouldShow"
      class="reading-progress"
      :style="{
        '--progress-color': color,
        '--progress-height': `${height}px`,
      }"
    >
      <div
        class="reading-progress-bar"
        :style="{ width: `${progress}%` }"
      />
    </div>
  </Transition>
</template>

<style scoped>
.reading-progress {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: var(--progress-height);
  z-index: 1000;
  background: transparent;
  pointer-events: none;
}

.reading-progress-bar {
  height: 100%;
  background: linear-gradient(
    90deg,
    var(--progress-color) 0%,
    color-mix(in srgb, var(--progress-color) 80%, white) 50%,
    var(--progress-color) 100%
  );
  background-size: 200% 100%;
  animation: shimmer 2s ease-in-out infinite;
  transition: width 0.1s ease-out;
  border-radius: 0 2px 2px 0;
}

@keyframes shimmer {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

/* Transition */
.progress-fade-enter-active,
.progress-fade-leave-active {
  transition: opacity 0.3s ease;
}

.progress-fade-enter-from,
.progress-fade-leave-to {
  opacity: 0;
}

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
  .reading-progress-bar {
    animation: none;
    background: var(--progress-color);
  }
}
</style>
