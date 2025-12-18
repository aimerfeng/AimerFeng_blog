import type { Ref } from 'vue'
import { ref } from 'vue'

/**
 * Click effect item interface
 */
export interface ClickEffectItem {
  id: number
  x: number
  y: number
  timestamp: number
}

/**
 * Click effect state interface for managing click visual effects
 */
export interface ClickEffectState {
  effects: Ref<ClickEffectItem[]>
  addEffect: (x: number, y: number) => void
  removeEffect: (id: number) => void
  cleanup: () => void
}

/**
 * Composable for managing click effect state and lifecycle
 *
 * @param maxEffects - Maximum number of concurrent effects (default: 10)
 * @returns ClickEffectState object with reactive effects array and control functions
 *
 * @example
 * ```ts
 * const { effects, addEffect, removeEffect, cleanup } = useClickEffect(10)
 *
 * // Add effect at click position
 * addEffect(100, 200)
 *
 * // Remove effect by ID
 * removeEffect(effectId)
 *
 * // Clean up all effects
 * cleanup()
 * ```
 */
export function useClickEffect(maxEffects = 10): ClickEffectState {
  const effects = ref<ClickEffectItem[]>([])
  let effectId = 0

  /**
   * Add a new click effect at the specified coordinates
   * Automatically limits the number of concurrent effects to maxEffects
   *
   * @param x - X coordinate in pixels
   * @param y - Y coordinate in pixels
   */
  const addEffect = (x: number, y: number) => {
    const id = effectId++
    effects.value.push({ id, x, y, timestamp: Date.now() })

    // Limit maximum number of concurrent effects
    if (effects.value.length > maxEffects) {
      effects.value.shift()
    }
  }

  /**
   * Remove a specific effect by its ID
   *
   * @param id - The unique identifier of the effect to remove
   */
  const removeEffect = (id: number) => {
    const index = effects.value.findIndex(e => e.id === id)
    if (index !== -1) {
      effects.value.splice(index, 1)
    }
  }

  /**
   * Remove all effects and reset state
   * Should be called on component unmount
   */
  const cleanup = () => {
    effects.value = []
  }

  return {
    effects,
    addEffect,
    removeEffect,
    cleanup,
  }
}
