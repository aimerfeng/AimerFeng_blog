# Testing Infrastructure

This directory contains the testing setup and configuration for the AimerFeng blog project.

## Setup

The testing infrastructure includes:

- **Vitest**: Fast unit test framework powered by Vite
- **@fast-check/vitest**: Property-based testing library for comprehensive test coverage
- **@vue/test-utils**: Official testing utilities for Vue 3 components
- **jsdom**: JavaScript implementation of web standards for DOM testing

## Configuration

### vitest.config.ts

The main Vitest configuration file located at the project root. It includes:

- Vue plugin support for testing `.vue` files
- jsdom environment for DOM testing
- Test setup file configuration
- Path aliases matching the main Vite config
- Coverage configuration

### setup.ts

The test setup file that runs before all tests. It includes:

- Vue Test Utils global configuration
- Mock implementations for browser APIs:
  - `window.matchMedia` for theme detection
  - `IntersectionObserver` for visibility tracking
  - `ResizeObserver` for responsive behavior
- Automatic cleanup after each test

## Running Tests

```bash
# Run all tests once
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with UI
npm run test:ui
```

## Writing Tests

### Unit Tests

```typescript
import { describe, it, expect } from 'vitest'

describe('MyComponent', () => {
  it('should do something', () => {
    expect(true).toBe(true)
  })
})
```

### Vue Component Tests

```typescript
import { mount } from '@vue/test-utils'
import MyComponent from '~/components/MyComponent.vue'

describe('MyComponent', () => {
  it('should render correctly', () => {
    const wrapper = mount(MyComponent, {
      props: { message: 'Hello' }
    })
    expect(wrapper.text()).toContain('Hello')
  })
})
```

### Property-Based Tests

```typescript
import { test } from '@fast-check/vitest'
import * as fc from 'fast-check'

test.prop([fc.integer({ min: 0, max: 100 })])(
  'should handle any valid input',
  (value) => {
    expect(value).toBeGreaterThanOrEqual(0)
    expect(value).toBeLessThanOrEqual(100)
  }
)
```

## Test Organization

Tests should be co-located with the code they test:

```
src/
├── components/
│   ├── MyComponent.vue
│   └── MyComponent.test.ts
└── composables/
    ├── useMyComposable.ts
    └── useMyComposable.test.ts
```

## Best Practices

1. **Test Naming**: Use descriptive test names that explain what is being tested
2. **Isolation**: Each test should be independent and not rely on other tests
3. **Cleanup**: Use `afterEach` hooks to clean up after tests
4. **Property Tests**: Run at least 100 iterations for property-based tests
5. **Coverage**: Aim for high coverage of critical paths, not 100% coverage

## Mocked APIs

The following browser APIs are mocked in the test environment:

- `window.matchMedia`: For testing theme detection and media queries
- `IntersectionObserver`: For testing visibility and lazy loading
- `ResizeObserver`: For testing responsive behavior

These mocks can be customized in `test/setup.ts` as needed.
