---
description: Step-by-step guide for adding a new feature to the blog system
---

## Adding a Blog Feature

1. **Update Database Schema (if needed)**
   ```sql
   -- Add new columns in supabase/schema.sql
   alter table blogs add column new_feature text;
   ```

2. **Update Type Definitions**
   ```ts
   // src/pages/BlogDetail.tsx or shared types
   interface Blog {
     // existing fields...
     new_feature: string;
   }
   ```

3. **Update Admin Form (if admin feature)**
   - Add field to blog creation/edit form
   - Update validation schema with Zod

4. **Update Blog Display**
   - Add new section in BlogDetail.tsx
   - Style with Tailwind classes

5. **Test Changes**
   - Verify in admin panel
   - Check public blog display

## Example: Adding Tags to Blogs

### 1. Database Schema
```sql
-- Add tags column
alter table blogs add column tags text[] default '{}';

-- Create tags table for autocomplete
CREATE TABLE tags (
  id uuid default gen_random_uuid() primary key,
  name text unique not null,
  slug text unique not null,
  created_at timestamp default now()
);
```

### 2. Update Types
```ts
interface Blog {
  id: string;
  // ... other fields
  tags: string[];
}
```

### 3. Update Admin Form
```tsx
// In blog editor component
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';

function TagInput({ 
  tags, 
  onChange 
}: { 
  tags: string[]; 
  onChange: (tags: string[]) => void;
}) {
  const [input, setInput] = useState('');

  const addTag = () => {
    if (input && !tags.includes(input)) {
      onChange([...tags, input]);
      setInput('');
    }
  };

  return (
    <div>
      <div className="flex gap-2 mb-2">
        {tags.map((tag) => (
          <Badge key={tag} variant="secondary">
            {tag}
            <button onClick={() => onChange(tags.filter((t) => t !== tag))}>
              ×
            </button>
          </Badge>
        ))}
      </div>
      <div className="flex gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Add tag..."
          onKeyDown={(e) => e.key === 'Enter' && addTag()}
        />
        <Button onClick={addTag} type="button">Add</Button>
      </div>
    </div>
  );
}
```

### 4. Update Blog Display
```tsx
// In BlogDetail.tsx
{blog.tags && blog.tags.length > 0 && (
  <div className="flex gap-2 mb-6">
    {blog.tags.map((tag) => (
      <Badge key={tag} variant="outline">
        #{tag}
      </Badge>
    ))}
  </div>
)}
```

## Querying with New Features

```tsx
// Filter by tags
const { data } = await supabase
  .from('blogs')
  .select('*')
  .contains('tags', ['react'])
  .eq('status', 'published');

// Search in new field
const { data } = await supabase
  .from('blogs')
  .select('*')
  .ilike('new_feature', `%${search}%`);
```

## RLS Policies for New Tables

```sql
-- Enable RLS
alter table tags enable row level security;

-- Public can view tags
create policy "Public can view tags"
  on tags for select
  to anon, authenticated
  using (true);

-- Only admins can create/edit
create policy "Admins can manage tags"
  on tags for all
  to authenticated
  using (auth.uid() in (select user_id from admin_users))
  with check (auth.uid() in (select user_id from admin_users));
```
