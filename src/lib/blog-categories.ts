import type { BlogRecord } from '@/types/blog';

export function slugifyCategoryName(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}

export function getCategoryDisplayName(
  category?: Pick<BlogRecord, 'category' | 'tag'>['category'],
  fallbackTag?: string | null,
) {
  return category?.name || fallbackTag || undefined;
}

export function buildBlogSearchFilter(value: string) {
  const normalized = value.trim().replace(/[%(),]/g, ' ').replace(/\s+/g, ' ');
  if (!normalized) return null;

  const pattern = `%${normalized}%`;
  return [
    `headline.ilike.${pattern}`,
    `excerpt.ilike.${pattern}`,
    `writer.ilike.${pattern}`,
    `tag.ilike.${pattern}`,
  ].join(',');
}

export function matchesAdminBlogSearch(blog: BlogRecord, rawQuery: string) {
  const query = rawQuery.trim().toLowerCase();
  if (!query) return true;

  return [
    blog.headline,
    blog.writer,
    blog.tag,
    blog.category?.name,
    ...(blog.tags || []),
  ]
    .filter(Boolean)
    .some((value) => value!.toLowerCase().includes(query));
}
