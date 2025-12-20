<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { useLoadingState } from '../composables/useLoadingState'

/**
 * Props interface for LoadingAnimation component
 */
interface LoadingAnimationProps {
  /** Minimum display duration in milliseconds (default: 1000) */
  minDuration?: number
  /** Fade-out transition duration in milliseconds (default: 600) */
  fadeDuration?: number
}

/**
 * Emits interface for LoadingAnimation component
 */
interface LoadingAnimationEmits {
  /** Emitted when the loading animation completes */
  (e: 'complete'): void
}

const props = withDefaults(defineProps<LoadingAnimationProps>(), {
  minDuration: 1000,
  fadeDuration: 600,
})

const emit = defineEmits<LoadingAnimationEmits>()

const { isLoading, progress, finishLoading } = useLoadingState()
const isFadingOut = ref(false)
const canSkip = ref(false)
let skipTimeout: ReturnType<typeof setTimeout> | null = null
let loadHandler: (() => void) | null = null
let skipHandler: ((e: KeyboardEvent | MouseEvent) => void) | null = null

/**
 * Handle the completion of loading
 * Triggers fade-out animation and cleanup
 */
async function handleLoadComplete() {
  if (!isLoading.value)
    return

  await finishLoading(props.minDuration)
  isFadingOut.value = true

  // Wait for fade-out animation to complete before emitting
  setTimeout(() => {
    emit('complete')
  }, props.fadeDuration)
}

/**
 * Handle skip functionality (after 5 second timeout)
 * Allows user to skip animation with click or keypress
 */
function handleSkip(_e: KeyboardEvent | MouseEvent) {
  if (!canSkip.value)
    return

  // For keyboard events, accept any key
  // For mouse events, accept any click
  handleLoadComplete()
}

onMounted(() => {
  // Set up window.onload listener
  loadHandler = () => {
    handleLoadComplete()
  }
  window.addEventListener('load', loadHandler)

  // Enable skip functionality after 5 seconds
  skipTimeout = setTimeout(() => {
    canSkip.value = true
  }, 5000)

  // Set up skip event listeners
  skipHandler = handleSkip
  window.addEventListener('click', skipHandler)
  window.addEventListener('keydown', skipHandler)
})

onBeforeUnmount(() => {
  // Clean up event listeners
  if (loadHandler) {
    window.removeEventListener('load', loadHandler)
  }
  if (skipHandler) {
    window.removeEventListener('click', skipHandler)
    window.removeEventListener('keydown', skipHandler)
  }
  if (skipTimeout) {
    clearTimeout(skipTimeout)
  }
})
</script>

<template>
  <Transition
    name="loading-fade"
    :duration="fadeDuration"
  >
    <div
      v-if="isLoading"
      class="loading-animation-container"
      :style="{ '--fade-duration': `${fadeDuration}ms` }"
      role="dialog"
      aria-modal="true"
      aria-label="Loading animation"
      aria-live="polite"
      aria-busy="true"
    >
      <!-- Background overlay -->
      <div class="loading-background" />

      <!-- Loading content -->
      <div class="loading-content">
        <!-- Animated Hexagon Logo with A -->
        <div class="loading-logo">
          <svg class="hex-logo" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <!-- Hexagon path - animated one stroke drawing -->
            <path
              class="hex-path"
              d="M50 5 L87 27.5 L87 72.5 L50 95 L13 72.5 L13 27.5 Z"
              fill="none"
              stroke-width="2.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <!-- Letter A in center - fades in after hexagon -->
            <text class="hex-letter" x="50" y="65" text-anchor="middle">A</text>
          </svg>
        </div>

        <!-- Spinner -->
        <div class="loading-spinner" role="status" aria-label="Loading in progress">
          <div class="spinner-ring" aria-hidden="true" />
          <div class="spinner-ring" aria-hidden="true" />
          <div class="spinner-ring" aria-hidden="true" />
        </div>

        <!-- Loading text -->
        <div class="loading-text">
          <p class="text-primary" aria-live="polite">
            Loading...
          </p>
          <p v-if="canSkip" class="text-skip" role="status" aria-live="polite">
            Click or press any key to skip
          </p>
        </div>

        <!-- Progress indicator -->
        <div
          class="loading-progress"
          role="progressbar"
          :aria-valuenow="progress"
          aria-valuemin="0"
          aria-valuemax="100"
          :aria-label="`Loading progress: ${progress}%`"
        >
          <div class="progress-bar" :style="{ width: `${progress}%` }" />
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
/* ============================================
   CSS Variables for Theme Adaptation
   ============================================ */

/* Light Mode Color Variables */
:root {
  /* Background colors */
  --loading-bg-light: #ffffff;
  --loading-overlay-light: rgba(255, 255, 255, 0.95);

  /* Text colors */
  --loading-text-primary-light: #333333;
  --loading-text-secondary-light: #666666;

  /* Spinner colors */
  --loading-spinner-light: #888888;
  --loading-spinner-shadow-light: rgba(0, 0, 0, 0.1);

  /* Progress bar colors */
  --loading-progress-bg-light: #e0e0e0;
  --loading-progress-fill-light: #888888;

  /* Logo filter */
  --loading-logo-filter-light: drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1));
}

/* Dark Mode Color Variables */
:global(html.dark) {
  /* Background colors */
  --loading-bg-dark: #050505;
  --loading-overlay-dark: rgba(5, 5, 5, 0.95);

  /* Text colors */
  --loading-text-primary-dark: #cccccc;
  --loading-text-secondary-dark: #999999;

  /* Spinner colors */
  --loading-spinner-dark: #aaaaaa;
  --loading-spinner-shadow-dark: rgba(255, 255, 255, 0.1);

  /* Progress bar colors */
  --loading-progress-bg-dark: #333333;
  --loading-progress-fill-dark: #aaaaaa;

  /* Logo filter */
  --loading-logo-filter-dark: drop-shadow(0 4px 6px rgba(255, 255, 255, 0.1)) invert(1);
}

/* ============================================
   Container Styles
   ============================================ */

/* Container - Full viewport overlay with fixed positioning */
.loading-animation-container {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100vw;
  height: 100vh;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

/* Background with theme support and smooth transitions */
.loading-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: var(--loading-bg-light);
  z-index: -1;
  /* Smooth color transition for theme changes */
  transition: background-color 0.3s ease-in-out;
}

:global(html.dark) .loading-background {
  background: var(--loading-bg-dark);
}

/* Content container */
.loading-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2rem;
  padding: 2rem;
}

/* ============================================
   Logo Styles with Theme Adaptation
   ============================================ */

.loading-logo {
  width: 120px;
  height: 120px;
}

.hex-logo {
  width: 100%;
  height: 100%;
}

/* Hexagon path - one stroke animation */
.hex-path {
  stroke: var(--loading-spinner-light);
  stroke-dasharray: 350;
  stroke-dashoffset: 350;
  animation:
    draw-hex 2s ease-in-out forwards,
    hex-pulse 2s ease-in-out 2s infinite;
  transition: stroke 0.3s ease-in-out;
}

:global(html.dark) .hex-path {
  stroke: var(--loading-spinner-dark);
}

/* Letter A - fades in after hexagon is drawn */
.hex-letter {
  fill: var(--loading-text-primary-light);
  font-family: 'Arial Black', Arial, sans-serif;
  font-weight: 900;
  font-size: 42px;
  opacity: 0;
  animation:
    fade-in-letter 0.5s ease-out 1.5s forwards,
    letter-pulse 2s ease-in-out 2s infinite;
  transition: fill 0.3s ease-in-out;
}

:global(html.dark) .hex-letter {
  fill: var(--loading-text-primary-dark);
}

/* Draw hexagon animation */
@keyframes draw-hex {
  0% {
    stroke-dashoffset: 350;
  }
  100% {
    stroke-dashoffset: 0;
  }
}

/* Hexagon pulse after drawn */
@keyframes hex-pulse {
  0%,
  100% {
    stroke-opacity: 1;
    transform: scale(1);
  }
  50% {
    stroke-opacity: 0.7;
    transform: scale(1.02);
  }
}

/* Letter fade in */
@keyframes fade-in-letter {
  0% {
    opacity: 0;
    transform: scale(0.8);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}

/* Letter pulse */
@keyframes letter-pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
}

/* ============================================
   Spinner Styles with Theme Adaptation
   ============================================ */

.loading-spinner {
  position: relative;
  width: 60px;
  height: 60px;
}

.spinner-ring {
  position: absolute;
  width: 100%;
  height: 100%;
  border: 3px solid transparent;
  border-top-color: var(--loading-spinner-light);
  border-radius: 50%;
  animation: spinner-rotate 1.5s cubic-bezier(0.5, 0, 0.5, 1) infinite;
  /* Smooth color transition for theme changes */
  transition: border-top-color 0.3s ease-in-out;
}

:global(html.dark) .spinner-ring {
  border-top-color: var(--loading-spinner-dark);
}

.spinner-ring:nth-child(1) {
  animation-delay: -0.45s;
}

.spinner-ring:nth-child(2) {
  animation-delay: -0.3s;
}

.spinner-ring:nth-child(3) {
  animation-delay: -0.15s;
}

/* ============================================
   Text Styles with Theme Adaptation
   ============================================ */

.loading-text {
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.text-primary {
  font-size: 1.25rem;
  font-weight: 500;
  color: var(--loading-text-primary-light);
  margin: 0;
  animation: text-fade 1.5s ease-in-out infinite;
  /* Smooth color transition for theme changes */
  transition: color 0.3s ease-in-out;
}

:global(html.dark) .text-primary {
  color: var(--loading-text-primary-dark);
}

.text-skip {
  font-size: 0.875rem;
  color: var(--loading-text-secondary-light);
  margin: 0;
  animation: skip-blink 1s ease-in-out infinite;
  /* Smooth color transition for theme changes */
  transition: color 0.3s ease-in-out;
}

:global(html.dark) .text-skip {
  color: var(--loading-text-secondary-dark);
}

/* ============================================
   Progress Bar Styles with Theme Adaptation
   ============================================ */

.loading-progress {
  width: 200px;
  height: 4px;
  background: var(--loading-progress-bg-light);
  border-radius: 2px;
  overflow: hidden;
  /* Smooth color transition for theme changes */
  transition: background-color 0.3s ease-in-out;
}

:global(html.dark) .loading-progress {
  background: var(--loading-progress-bg-dark);
}

.progress-bar {
  height: 100%;
  background: var(--loading-progress-fill-light);
  border-radius: 2px;
  /* Smooth transitions for both width and color */
  transition:
    width 0.3s ease-out,
    background-color 0.3s ease-in-out;
}

:global(html.dark) .progress-bar {
  background: var(--loading-progress-fill-dark);
}

/* ============================================
   Animations - GPU Accelerated
   ============================================ */

@keyframes spinner-rotate {
  0% {
    transform: translate3d(0, 0, 0) rotate(0deg);
  }
  100% {
    transform: translate3d(0, 0, 0) rotate(360deg);
  }
}

@keyframes text-fade {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.6;
  }
}

@keyframes skip-blink {
  0%,
  100% {
    opacity: 0.7;
  }
  50% {
    opacity: 0.3;
  }
}

/* Fade transition */
.loading-fade-enter-active,
.loading-fade-leave-active {
  transition: opacity var(--fade-duration, 600ms) ease-out;
}

.loading-fade-enter-from {
  opacity: 0;
}

.loading-fade-leave-to {
  opacity: 0;
}

/* Responsive design */
@media (max-width: 768px) {
  .loading-logo {
    width: 80px;
    height: 80px;
  }

  .hex-letter {
    font-size: 36px;
  }

  .loading-spinner {
    width: 50px;
    height: 50px;
  }

  .text-primary {
    font-size: 1rem;
  }

  .loading-progress {
    width: 150px;
  }
}

@media (min-width: 769px) and (max-width: 1024px) {
  .loading-logo {
    width: 100px;
    height: 100px;
  }

  .hex-letter {
    font-size: 40px;
  }

  .loading-spinner {
    width: 55px;
    height: 55px;
  }
}

/* Accessibility - Reduced motion */
@media (prefers-reduced-motion: reduce) {
  .hex-path,
  .hex-letter,
  .spinner-ring,
  .text-primary,
  .text-skip {
    animation: none;
  }

  .hex-path {
    stroke-dashoffset: 0;
  }

  .hex-letter {
    opacity: 1;
  }

  .loading-fade-enter-active,
  .loading-fade-leave-active {
    transition: none;
  }
}

/* ============================================
   Performance Optimizations
   ============================================ */

/* GPU Acceleration and will-change hints for animated properties */
.loading-animation-container {
  /* Force GPU acceleration with translate3d */
  transform: translate3d(0, 0, 0);
  /* Enable hardware acceleration */
  backface-visibility: hidden;
  -webkit-font-smoothing: antialiased;
  /* Contain layout and paint to prevent layout thrashing */
  contain: layout style paint;
}

/* will-change hints for animated elements */
.hex-path {
  will-change: stroke-dashoffset, stroke-opacity, transform;
  transform-origin: center;
}

.hex-letter {
  will-change: opacity, transform;
  transform-origin: center;
}

.spinner-ring {
  will-change: transform;
  /* GPU acceleration */
  transform: translate3d(0, 0, 0);
  backface-visibility: hidden;
}

.progress-bar {
  will-change: width;
  /* GPU acceleration */
  transform: translate3d(0, 0, 0);
  backface-visibility: hidden;
}

.loading-background {
  /* Contain paint to prevent repaints affecting other elements */
  contain: paint;
  /* GPU acceleration */
  transform: translate3d(0, 0, 0);
}

.loading-content {
  /* GPU acceleration */
  transform: translate3d(0, 0, 0);
  backface-visibility: hidden;
}

/* Optimize text rendering */
.text-primary,
.text-skip {
  will-change: opacity;
  /* GPU acceleration */
  transform: translate3d(0, 0, 0);
  backface-visibility: hidden;
}
</style>
