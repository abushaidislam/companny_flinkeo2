---
description: Code quality guidelines and best practices for the project
---

## Code Quality Standards

### TypeScript
- Enable strict mode in `tsconfig.json`
- No `any` types - use `unknown` if necessary
- Explicit return types for exported functions
- Use interface for object shapes, type for unions

### Naming Conventions
- Components: PascalCase (e.g., `BlogCard.tsx`)
- Hooks: camelCase with `use` prefix (e.g., `useAuth.ts`)
- Utils: camelCase (e.g., `formatDate.ts`)
- Constants: UPPER_SNAKE_CASE for true constants
- CSS classes: kebab-case (Tailwind uses this)

### File Organization
```
src/
├── components/       # Reusable UI components
│   ├── ui/          # shadcn components
│   ├── landing/     # Landing page sections
│   └── admin/       # Admin components
├── pages/           # Route-level components
├── hooks/           # Custom React hooks
├── lib/             # Utilities and configs
├── contexts/        # React contexts
└── types/           # Shared TypeScript types
```

### Import Order
1. React/Next imports
2. Third-party libraries
3. Absolute imports (@/components)
4. Relative imports (./utils)
5. CSS imports

### Component Guidelines
- One component per file (default export)
- Co-locate related hooks and types
- Keep components under 200 lines
- Use composition over inheritance

### Error Handling
```tsx
// Good
try {
  const { data, error } = await supabase.from('blogs').select('*');
  if (error) throw error;
  return data;
} catch (error) {
  console.error('Failed to fetch blogs:', error);
  toast.error('Failed to load blogs');
  return [];
}

// Bad
const data = await supabase.from('blogs').select('*');
return data;
```

### Comments
- Document complex business logic
- Use JSDoc for public APIs
- Avoid obvious comments
- Keep comments current with code

### Performance
- Lazy load routes and heavy components
- Use React.memo for pure components
- Memoize expensive calculations
- Profile before optimizing

### Security
- Never commit secrets
- Use environment variables
- Sanitize user inputs
- Validate with Zod schemas

### Testing
- Write tests for business logic
- Test user interactions
- Mock external dependencies
- Aim for 80%+ coverage
