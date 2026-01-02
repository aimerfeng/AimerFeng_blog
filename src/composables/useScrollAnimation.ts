import { onMounted, onUnmounted, ref } from 'vue'

export interface ScrollAnimationOptions {
  threshold?: number
  rootMargin?: string
  once?: boolean
}

export function useScrollAnimation(options: ScrollAnimationOptions = {}) {
  const {
    threshold = 0.1,
    rootMargin = '0px 0px -50px 0px',
    once = true,
  } = options

  const isVisible = ref(false)
  const elementRef = ref<HTMLElement | null>(null)
  let observer: IntersectionObserver | null = null

  function setupObserver() {
    if (!elementRef.value || typeof IntersectionObserver === 'undefined')
      return

    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            isVisible.value = true
            if (once && observer) {
              observer.unobserve(entry.target)
            }
          }
          else if (!once) {
            isVisible.value = false
          }
        })
      },
      {
        threshold,
        rootMargin,
      },
    )

    observer.observe(elementRef.value)
  }

  onMounted(() => {
    setupObserver()
  })

  onUnmounted(() => {
    if (observer) {
      observer.disconnect()
      observer = null
    }
  })

  return {
    elementRef,
    isVisible,
  }
}

// Directive for scroll animations
export const vScrollAnimate = {
  mounted(el: HTMLElement, binding: { value?: ScrollAnimationOptions }) {
    const options = binding.value || {}
    const {
      threshold = 0.1,
      rootMargin = '0px 0px -50px 0px',
    } = options

    // Add initial hidden state
    el.style.opacity = '0'
    el.style.transform = 'translateY(20px)'
    el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out'

    if (typeof IntersectionObserver === 'undefined') {
      // Fallback for browsers without IntersectionObserver
      el.style.opacity = '1'
      el.style.transform = 'translateY(0)'
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            el.style.opacity = '1'
            el.style.transform = 'translateY(0)'
            observer.unobserve(el)
          }
        })
      },
      {
        threshold,
        rootMargin,
      },
    )

    observer.observe(el)

    // Store observer for cleanup
    ;(el as any)._scrollObserver = observer
  },
  unmounted(el: HTMLElement) {
    const observer = (el as any)._scrollObserver
    if (observer) {
      observer.disconnect()
    }
  },
}
