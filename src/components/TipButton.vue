<script setup lang="ts">
import { ref } from 'vue'

interface Props {
  compact?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  compact: false,
})

const showTipModal = ref(false)

function openTipModal() {
  showTipModal.value = true
}

function closeTipModal() {
  showTipModal.value = false
}
</script>

<template>
  <div class="tip-button-container">
    <button 
      class="tip-button glass-container"
      :class="{ compact }"
      @click="openTipModal"
    >
      <span class="tip-icon" i-ri-coin-line />
      <span v-if="!compact" class="tip-text">打赏支持</span>
    </button>

    <!-- Modal -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="showTipModal" class="modal-overlay" @click="closeTipModal">
          <div class="modal-content" @click.stop>
            <button class="modal-close" @click="closeTipModal">
              <span i-ri-close-line />
            </button>
            <Web3Tip />
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<style scoped>
.tip-button {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  border: none;
  border-radius: 0.75rem;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  color: #f59e0b;
}

.tip-button:hover {
  transform: translateY(-2px);
}

.tip-button.compact {
  padding: 0.5rem;
  border-radius: 50%;
  width: 2.5rem;
  height: 2.5rem;
  justify-content: center;
}

.tip-icon {
  font-size: 1.25rem;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 1rem;
}

.modal-content {
  position: relative;
  max-width: 500px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  background: var(--c-bg);
  border-radius: 1rem;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.modal-close {
  position: absolute;
  top: 1rem;
  right: 1rem;
  width: 2rem;
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--glass-bg);
  border: 1px solid var(--glass-border);
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.2s;
  z-index: 1;
}

.modal-close:hover {
  background: var(--glass-bg-hover);
  transform: rotate(90deg);
}

.modal-close span {
  font-size: 1.25rem;
}

/* Modal transitions */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-active .modal-content,
.modal-leave-active .modal-content {
  transition: transform 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .modal-content {
  transform: scale(0.9) translateY(20px);
}

.modal-leave-to .modal-content {
  transform: scale(0.9) translateY(20px);
}
</style>
