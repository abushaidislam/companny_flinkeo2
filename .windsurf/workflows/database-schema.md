---
description: Database management workflow for Supabase schema changes and migrations
---

## Managing Database Schema

### 1. Schema File Location
All schema definitions are in `supabase/schema.sql`

### 2. Adding New Tables

```sql
-- Create table with proper defaults
CREATE TABLE table_name (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  -- your columns here
);

-- Enable RLS
alter table table_name enable row level security;
```

### 3. Updating Existing Tables

```sql
-- Add column
alter table blogs add column new_field text;

-- Add with default
alter table blogs add column is_featured boolean default false;

-- Create index for performance
create index idx_blogs_status on blogs(status);
```

### 4. RLS Policies

```sql
-- Public read access
create policy "Public can view"
  on table_name for select
  to anon, authenticated
  using (true);

-- Authenticated only
create policy "Authenticated users can create"
  on table_name for insert
  to authenticated
  with check (auth.uid() = user_id);

-- Admin only
create policy "Admins can manage"
  on table_name for all
  to authenticated
  using (auth.uid() in (select user_id from admin_users));
```

### 5. Triggers for updated_at

```sql
-- Function to update timestamp
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$ language plpgsql;

-- Apply trigger
create trigger update_table_updated_at
  before update on table_name
  for each row
  execute function update_updated_at();
```

### 6. Common Patterns

**Soft Delete:**
```sql
alter table blogs add column deleted_at timestamp;

-- Update policy to exclude deleted
create policy "Public can view non-deleted"
  on blogs for select
  using (deleted_at is null);
```

**Slug Generation:**
```sql
-- Add unique slug
alter table blogs add column slug text unique;

-- Or generate from title
create or replace function generate_slug(title text)
returns text as $$
begin
  return lower(regexp_replace(title, '[^a-zA-Z0-9]+', '-', 'g'));
end;
$$ language plpgsql;
```

### 7. Apply Schema Changes

```bash
// Apply to local Supabase
supabase db reset

// Apply to production (use migrations)
supabase db push
```

### 8. Generate Types

```bash
// Generate TypeScript types from schema
supabase gen types typescript --local > src/lib/database.types.ts
```

## Best Practices

1. Always enable RLS on new tables
2. Write policies immediately after creating table
3. Add indexes for frequently queried columns
4. Use `timestamptz` not `timestamp`
5. Keep schema.sql in version control
6. Test policies with different user roles
