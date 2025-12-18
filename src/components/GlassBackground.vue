<script setup lang="ts">
import { onMounted, ref } from 'vue'

const prefersReducedMotion = ref(false)

onMounted(() => {
  // Check if user prefers reduced motion
  const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
  prefersReducedMotion.value = mediaQuery.matches

  // Listen for changes
  const handleChange = (e: MediaQueryListEvent) => {
    prefersReducedMotion.value = e.matches
  }
  mediaQuery.addEventListener('change', handleChange)
})
</script>

<template>
  <div 
    class="glass-background" 
    :class="{ 'reduced-motion': prefersReducedMotion }"
    aria-hidden="true"
  />
</template>

<style scoped>
.glass-background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  overflow: hidden;
  pointer-events: none;
}

.glass-background::before,
.glass-background::after {
  content: '';
  position: absolute;
  width: 200%;
  height: 200%;
  top: -50%;
  left: -50%;
}

.glass-background::before {
  background: radial-gradient(
    circle at 20% 50%,
    var(--gradient-1) 0%,
    transparent 50%
  ),
  radial-gradient(
    circle at 80% 80%,
    var(--gradient-2) 0%,
    transparent 50%
  ),
  radial-gradient(
    circle at 40% 20%,
    var(--gradient-3) 0%,
    transparent 50%
  );
  animation: gradient-rotate 60s ease infinite;
}

.glass-background::after {
  background: radial-gradient(
    circle at 60% 70%,
    var(--gradient-4) 0%,
    transparent 50%
  ),
  radial-gradient(
    circle at 30% 90%,
    var(--gradient-1) 0%,
    transparent 50%
  );
  animation: gradient-rotate 80s ease-in-out infinite reverse;
}

@keyframes gradient-rotate {
  0% {
    transform: rotate(0deg) scale(1);
  }
  50% {
    transform: rotate(180deg) scale(1.1);
  }
  100% {
    transform: rotate(360deg) scale(1);
  }
}

/* Respect user's motion preferences */
.glass-background.reduced-motion::before,
.glass-background.reduced-motion::after {
  animation: none !important;
}

@media (prefers-reduced-motion: reduce) {
  .glass-background::before,
  .glass-background::after {
    animation: none;
  }
}
</style>
