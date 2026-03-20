---
name: react-typescript-skill
description: Best practices for React 18 + TypeScript development with modern patterns
---

## Use this skill for:
- React component architecture
- TypeScript type definitions
- Hook creation and usage
- State management patterns
- Performance optimization

## Guidelines:

### Component Structure
- Use functional components with explicit return types
- Prefer interface over type for component props
- Keep components under 200 lines; split if larger
- Co-locate related hooks and utilities

```tsx
// Good
interface UserCardProps {
  user: User;
  onEdit?: (id: string) => void;
}

export function UserCard({ user, onEdit }: UserCardProps): JSX.Element {
  return <div>...</div>;
}
```

### TypeScript Best Practices
- Enable strict mode
- Avoid `any`; use `unknown` when type is uncertain
- Use discriminated unions for complex state
- Leverage type inference where obvious

### Hooks Patterns
- Prefix custom hooks with `use`
- Return tuples for state hooks, objects for complex hooks
- Clean up side effects properly
- Memoize expensive computations

```tsx
// Good
function useLocalStorage<T>(key: string, initial: T): [T, (v: T) => void] {
  const [value, setValue] = useState<T>(() => {
    const stored = localStorage.getItem(key);
    return stored ? (JSON.parse(stored) as T) : initial;
  });
  
  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);
  
  return [value, setValue];
}
```

### State Management
- Start with useState/useReducer, escalate to context only when needed
- Use React Query for server state
- Keep state as close to usage as possible (co-location)

### Performance
- Use React.memo for pure components receiving stable props
- Use useMemo for expensive calculations
- Use useCallback for functions passed to child components
- Profile before optimizing
