<script setup lang="ts">
import { onBeforeUnmount, onMounted } from 'vue'
import { useClickEffect } from '../composables/useClickEffect'

/**
 * Props interface for ClickEffect component
 */
interface ClickEffectProps {
  /** Maximum number of concurrent effects (default: 10) */
  maxEffects?: number
  /** Duration of each effect animation in milliseconds (default: 800) */
  duration?: number
  /** Size of each effect in pixels (default: 30) */
  size?: number
}

const props = withDefaults(defineProps<ClickEffectProps>(), {
  maxEffects: 10,
  duration: 800,
  size: 30,
})

// Use the click effect composable
const { effects, addEffect, removeEffect, cleanup } = useClickEffect(props.maxEffects)

/**
 * Handle click events and create visual effects
 */
function handleClick(event: MouseEvent) {
  addEffect(event.clientX, event.clientY)

  // Schedule effect removal after animation duration
  const effectId = effects.value[effects.value.length - 1]?.id
  if (effectId !== undefined) {
    setTimeout(() => {
      removeEffect(effectId)
    }, props.duration)
  }
}

/**
 * Handle touch events for mobile support
 */
function handleTouch(event: TouchEvent) {
  // Get the first touch point
  const touch = event.touches[0] || event.changedTouches[0]
  if (touch) {
    addEffect(touch.clientX, touch.clientY)

    // Schedule effect removal after animation duration
    const effectId = effects.value[effects.value.length - 1]?.id
    if (effectId !== undefined) {
      setTimeout(() => {
        removeEffect(effectId)
      }, props.duration)
    }
  }
}

// Add global event listeners on mount
onMounted(() => {
  window.addEventListener('click', handleClick)
  window.addEventListener('touchstart', handleTouch)
})

// Clean up event listeners on unmount
onBeforeUnmount(() => {
  window.removeEventListener('click', handleClick)
  window.removeEventListener('touchstart', handleTouch)
  cleanup()
})
</script>

<template>
  <div class="click-effect-container" aria-hidden="true">
    <div
      v-for="effect in effects"
      :key="effect.id"
      class="click-effect"
      :style="{
        left: `${effect.x}px`,
        top: `${effect.y}px`,
        width: `${size}px`,
        height: `${size}px`,
        animationDuration: `${duration}ms`,
      }"
    />
  </div>
</template>

<style src="../styles/click-effect.css"></style>
