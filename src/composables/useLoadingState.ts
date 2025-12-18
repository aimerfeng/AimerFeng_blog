import type { Ref } from 'vue'
import { ref } from 'vue'

/**
 * Loading state interface for managing page loading animation
 */
export interface LoadingState {
  isLoading: Ref<boolean>
  progress: Ref<number>
  startTime: Ref<number>
  startLoading: () => void
  finishLoading: (minDuration: number) => Promise<void>
}

/**
 * Composable for managing loading animation state
 *
 * @returns LoadingState object with reactive state and control functions
 *
 * @example
 * ```ts
 * const { isLoading, progress, startLoading, finishLoading } = useLoadingState()
 *
 * // Start loading
 * startLoading()
 *
 * // Finish loading with minimum duration
 * await finishLoading(1000)
 * ```
 */
export function useLoadingState(): LoadingState {
  const isLoading = ref(true)
  const progress = ref(0)
  const startTime = ref(Date.now())

  /**
   * Initialize loading state
   * Resets isLoading to true, progress to 0, and records start time
   */
  const startLoading = () => {
    isLoading.value = true
    startTime.value = Date.now()
    progress.value = 0
  }

  /**
   * Complete loading with minimum duration enforcement
   * Ensures the loading animation displays for at least minDuration milliseconds
   *
   * @param minDuration - Minimum duration in milliseconds (default: 1000)
   * @returns Promise that resolves when loading is complete
   */
  const finishLoading = async (minDuration: number) => {
    const elapsed = Date.now() - startTime.value
    const remaining = Math.max(0, minDuration - elapsed)

    // Wait for remaining time if needed to meet minimum duration
    if (remaining > 0) {
      await new Promise(resolve => setTimeout(resolve, remaining))
    }

    progress.value = 100
    isLoading.value = false
  }

  return {
    isLoading,
    progress,
    startTime,
    startLoading,
    finishLoading,
  }
}
