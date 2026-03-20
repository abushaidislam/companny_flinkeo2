---
description: Testing workflow for running unit, integration, and e2e tests
---

## Running Tests

### Unit & Integration Tests (Vitest)

```bash
// turbo
# Run all tests once
npm run test

# Run tests in watch mode
npm run test:watch

# Run with coverage
npm run test -- --coverage

# Run specific test file
npm run test -- src/components/Button.test.tsx
```

### E2E Tests (Playwright)

```bash
// turbo
# Run all e2e tests
npx playwright test

# Run specific test
npx playwright test blog.spec.ts

# Run in headed mode (see browser)
npx playwright test --headed

# Run in specific browser
npx playwright test --project=chromium

# Debug mode
npx playwright test --debug
```

### Test Structure

```
tests/
├── unit/              # Unit tests
│   ├── components/
│   ├── hooks/
│   └── utils/
├── integration/       # Integration tests
│   └── api/
└── e2e/              # E2E tests
    ├── auth.spec.ts
    ├── blog.spec.ts
    └── contact.spec.ts
```

## Writing New Tests

### Component Test Template

```tsx
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import userEvent from '@testing-library/user-event';

import { Button } from './Button';

describe('Button', () => {
  it('renders correctly', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('handles click events', async () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click</Button>);
    
    await userEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalled();
  });
});
```

### E2E Test Template

```ts
import { test, expect } from '@playwright/test';

test.describe('Blog Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/blog');
  });

  test('displays blog list', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Blog');
    await expect(page.locator('[data-testid="blog-card"]').first()).toBeVisible();
  });

  test('navigates to blog detail', async ({ page }) => {
    await page.click('[data-testid="blog-card"] a');
    await expect(page.locator('article')).toBeVisible();
  });
});
```

## Coverage Requirements

- **Minimum**: 80% coverage
- **Priority areas**:
  - Business logic in hooks
  - Form validations
  - API integrations
  - Critical user flows

## Pre-commit Checklist

- [ ] All tests pass
- [ ] New features have tests
- [ ] No console errors in tests
- [ ] Coverage maintained
