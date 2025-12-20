<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useQuotes } from '../composables/useQuotes'

interface Props {
  /** Animation duration in ms */
  animationDuration?: number
}

withDefaults(defineProps<Props>(), {
  animationDuration: 800,
})

const emit = defineEmits<{
  enter: []
}>()

const { currentQuote } = useQuotes()
const isVisible = ref(false)

onMounted(() => {
  // Trigger fade-in animation
  setTimeout(() => {
    isVisible.value = true
  }, 100)
})

function handleEnter() {
  emit('enter')
}
</script>

<template>
  <div class="quote-container" :class="{ visible: isVisible }">
    <blockquote class="tech-quote">
      <p class="quote-text">
        "{{ currentQuote.text }}"
      </p>
      <footer class="quote-author">
        — {{ currentQuote.author }}
      </footer>
    </blockquote>
    <button
      class="entry-button"
      aria-label="Enter site"
      @click="handleEnter"
    >
      <span class="button-text">Enter</span>
      <span class="button-icon">→</span>
    </button>
  </div>
</template>

<style scoped>
.quote-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2rem;
  padding: 2rem;
  opacity: 0;
  transform: translateY(20px);
  transition: all v-bind('`${animationDuration}ms`') ease-out;
}

.quote-container.visible {
  opacity: 1;
  transform: translateY(0);
}

.tech-quote {
  max-width: 600px;
  text-align: center;
  margin: 0;
  padding: 0;
}

.quote-text {
  font-size: 1.25rem;
  line-height: 1.6;
  color: var(--fg);
  margin: 0 0 1rem 0;
  font-style: italic;
  font-weight: 300;
}

.quote-author {
  font-size: 1rem;
  color: var(--fg-deep);
  font-style: normal;
  font-weight: 500;
}

.entry-button {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.875rem 2rem;
  font-size: 1.125rem;
  font-weight: 500;
  color: var(--fg-deep);
  background: transparent;
  border: 2px solid var(--fg-light);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  outline: none;
}

.entry-button:hover {
  background: rgba(136, 136, 136, 0.1);
  border-color: var(--fg-deep);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.entry-button:active {
  transform: translateY(0);
}

.entry-button:focus-visible {
  outline: 2px solid var(--fg-deep);
  outline-offset: 2px;
}

.button-icon {
  font-size: 1.25rem;
  transition: transform 0.3s ease;
}

.entry-button:hover .button-icon {
  transform: translateX(4px);
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .quote-container {
    padding: 1.5rem;
    gap: 1.5rem;
  }

  .quote-text {
    font-size: 1.125rem;
  }

  .quote-author {
    font-size: 0.9375rem;
  }

  .entry-button {
    padding: 0.75rem 1.5rem;
    font-size: 1rem;
  }
}

@media (max-width: 480px) {
  .quote-text {
    font-size: 1rem;
  }

  .entry-button {
    padding: 0.625rem 1.25rem;
  }
}
</style>
