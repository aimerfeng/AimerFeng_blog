import { beforeAll, afterEach, afterAll, vi } from 'vitest'
import { config } from '@vue/test-utils'
import { ref } from 'vue'

// Mock VueUse composables
vi.mock('@vueuse/core', () => ({
  useDark: () => ref(false),
  useLocalStorage: (key: string, defaultValue: any) => ref(defaultValue),
}))

// Mock logics module
vi.mock('~/logics', () => ({
  isDark: ref(false),
  englishOnly: ref(false),
  galleryView: ref('cover'),
  toggleDark: vi.fn(),
  formatDate: vi.fn((d: string) => d),
}))

// Configure Vue Test Utils
beforeAll(() => {
  // Set global config for Vue Test Utils
  config.global.stubs = {
    // Stub out router-link and other common components if needed
    RouterLink: true,
    RouterView: true,
  }
})

// Cleanup after each test
afterEach(() => {
  // Clear any mocks or timers
  vi.clearAllMocks()
  vi.clearAllTimers()
})

// Cleanup after all tests
afterAll(() => {
  // Final cleanup
  vi.restoreAllMocks()
})

// Mock window.matchMedia for theme detection tests
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  takeRecords() {
    return []
  }
  unobserve() {}
} as any

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
} as any
