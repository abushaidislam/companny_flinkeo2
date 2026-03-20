---
name: supabase-backend-skill
description: Supabase integration patterns for authentication, database, and real-time features
---

## Use this skill for:
- Supabase client setup and configuration
- Database queries and mutations
- Authentication implementation
- Real-time subscriptions
- Row Level Security (RLS) policies
- Storage operations

## Guidelines:

### Client Setup
- Create a singleton client instance
- Use environment variables for credentials
- Type database tables for type safety

```ts
// lib/supabase.ts
import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient<Database>(supabaseUrl, supabaseKey);
```

### Database Queries
- Use React Query for caching and synchronization
- Handle errors gracefully with typed errors
- Implement pagination for large datasets

```tsx
// Good
function useBlogs() {
  return useQuery({
    queryKey: ['blogs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('blogs')
        .select('*')
        .eq('status', 'published')
        .order('published_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });
}
```

### Authentication
- Use auth state change listeners
- Implement protected routes
- Handle OAuth providers properly

```tsx
// Auth guard pattern
function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null);
      setLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => listener.subscription.unsubscribe();
  }, []);

  return { user, loading };
}
```

### RLS Policies
- Always enable RLS on tables
- Write policies for CRUD operations
- Test policies with different user roles

```sql
-- Example RLS policies
alter table blogs enable row level security;

create policy "Public can view published blogs"
  on blogs for select
  using (status = 'published');

create policy "Admins can manage all blogs"
  on blogs for all
  using (auth.uid() in (select user_id from admin_users));
```

### Mutations
- Use optimistic updates for better UX
- Invalidate related queries after mutations
- Handle loading and error states

```tsx
const mutation = useMutation({
  mutationFn: async (blog: BlogInput) => {
    const { data, error } = await supabase
      .from('blogs')
      .insert(blog)
      .single();
    if (error) throw error;
    return data;
  },
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['blogs'] });
  },
});
```

### Error Handling
- Type errors based on Supabase error codes
- Show user-friendly error messages
- Log errors for debugging

```ts
interface SupabaseError {
  code: string;
  message: string;
  details?: string;
}

function handleSupabaseError(error: SupabaseError): string {
  const errorMap: Record<string, string> = {
    '23505': 'This record already exists.',
    '42501': 'You do not have permission to perform this action.',
    'PGRST116': 'Record not found.',
  };
  return errorMap[error.code] || 'An unexpected error occurred.';
}
```
