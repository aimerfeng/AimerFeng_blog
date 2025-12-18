<script setup lang="ts">
interface Props {
  blur?: number
  opacity?: number
  borderRadius?: string
  padding?: string
  hover?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  blur: 10,
  opacity: 0.1,
  borderRadius: '1rem',
  padding: '1.5rem',
  hover: true,
})

const cardStyle = {
  '--card-blur': `${props.blur}px`,
  '--card-opacity': props.opacity,
  '--card-radius': props.borderRadius,
  '--card-padding': props.padding,
}
</script>

<template>
  <div 
    class="glass-card" 
    :class="{ 'glass-card-hover': hover }"
    :style="cardStyle"
  >
    <slot />
  </div>
</template>

<style scoped>
.glass-card {
  background: rgba(255, 255, 255, var(--card-opacity));
  backdrop-filter: blur(var(--card-blur));
  -webkit-backdrop-filter: blur(var(--card-blur));
  border: 1px solid var(--glass-border);
  border-radius: var(--card-radius);
  box-shadow: var(--glass-shadow);
  padding: var(--card-padding);
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
}

html.dark .glass-card {
  background: rgba(0, 0, 0, calc(var(--card-opacity) * 2));
}

/* Subtle border highlight effect */
.glass-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.4),
    transparent
  );
  opacity: 0.5;
  pointer-events: none;
}

html.dark .glass-card::before {
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.2),
    transparent
  );
}

/* Hover effect */
.glass-card-hover:hover {
  background: rgba(255, 255, 255, calc(var(--card-opacity) * 1.5));
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
  transform: translateY(-2px);
}

html.dark .glass-card-hover:hover {
  background: rgba(0, 0, 0, calc(var(--card-opacity) * 3));
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.4);
}

/* Respect user's motion preferences */
@media (prefers-reduced-motion: reduce) {
  .glass-card {
    transition: none;
  }
  
  .glass-card-hover:hover {
    transform: none;
  }
}

/* Ensure text readability */
.glass-card {
  color: inherit;
}

.glass-card :deep(*) {
  position: relative;
  z-index: 1;
}
</style>
