---
name: testing-quality-skill
description: Comprehensive testing with Vitest, React Testing Library, and Playwright
---

## Use this skill for:
- Unit testing React components
- Integration testing
- E2E testing with Playwright
- Test coverage and quality
- Mocking strategies

## Guidelines:

### Testing Philosophy
- Test behavior, not implementation
- Write tests that act like users
- Prioritize integration tests over unit tests
- Keep tests deterministic and fast

### Component Testing
- Use React Testing Library with Vitest
- Query by role, label, or text (avoid test IDs)

```tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Button } from './Button';

describe('Button', () => {
  it('renders with correct text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click</Button>);
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('is disabled when loading', () => {
    render(<Button isLoading>Loading</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });
});
```

### Hook Testing
- Use renderHook from testing-library/react
- Test all hook states and effects

```tsx
import { renderHook, act, waitFor } from '@testing-library/react';
import { useCounter } from './useCounter';

describe('useCounter', () => {
  it('increments counter', () => {
    const { result } = renderHook(() => useCounter());
    
    act(() => {
      result.current.increment();
    });
    
    expect(result.current.count).toBe(1);
  });
});
```

### Mocking
- Mock external dependencies
- Restore mocks between tests

```tsx
import { vi } from 'vitest';

// Mock module
vi.mock('@/lib/supabase', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: mockBlog, error: null }),
    })),
  },
}));

// Mock function
const mockSubmit = vi.fn();

// Restore mocks
afterEach(() => {
  vi.restoreAllMocks();
});
```

### E2E Testing with Playwright
- Test critical user flows
- Use page objects for maintainability

```ts
// tests/blog.spec.ts
import { test, expect } from '@playwright/test';

test('user can view blog post', async ({ page }) => {
  await page.goto('/blog');
  await page.click('text=Read Article');
  await expect(page.locator('h1')).toBeVisible();
  await expect(page.locator('article')).toContainText('Published');
});

test('admin can create blog post', async ({ page }) => {
  await page.goto('/admin/login');
  await page.fill('input[name="email"]', 'admin@test.com');
  await page.fill('input[name="password"]', 'password');
  await page.click('button[type="submit"]');
  await expect(page).toHaveURL('/admin/dashboard');
});
```

### Async Testing
- Use waitFor for async assertions
- Properly handle loading states

```tsx
import { waitFor } from '@testing-library/react';

it('displays data after loading', async () => {
  render(<BlogList />);
  
  expect(screen.getByText(/loading/i)).toBeInTheDocument();
  
  await waitFor(() => {
    expect(screen.getByText('Blog Title')).toBeInTheDocument();
  });
});
```

### Coverage Goals
- Aim for 80%+ code coverage
- Focus on business logic
- Don't chase 100% coverage blindly

### Test Organization
```
tests/
├── unit/
│   ├── components/
│   ├── hooks/
│   └── utils/
├── integration/
│   └── api/
└── e2e/
    ├── auth.spec.ts
    ├── blog.spec.ts
    └── contact.spec.ts
```

### Common Patterns

```tsx
// Setup wrapper for providers
function createWrapper() {
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          {children}
        </BrowserRouter>
      </QueryClientProvider>
    );
  };
}

// Use in tests
const { result } = renderHook(() => useAuth(), {
  wrapper: createWrapper(),
});
```
