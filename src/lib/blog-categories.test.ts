import { describe, expect, it } from 'vitest';

import { buildBlogSearchFilter, matchesAdminBlogSearch, slugifyCategoryName } from '@/lib/blog-categories';

describe('blog category helpers', () => {
  it('slugifies category names for admin saves', () => {
    expect(slugifyCategoryName(' Design Systems & SEO ')).toBe('design-systems-seo');
  });

  it('builds a safe Supabase search filter', () => {
    expect(buildBlogSearchFilter('growth, seo')).toBe(
      'headline.ilike.%growth seo%,excerpt.ilike.%growth seo%,writer.ilike.%growth seo%,tag.ilike.%growth seo%',
    );
  });

  it('matches admin blog search against category names and tags', () => {
    expect(
      matchesAdminBlogSearch(
        {
          id: '1',
          slug: 'design-systems',
          headline: 'Design Systems for SaaS',
          excerpt: 'Guide',
          cover_image: '',
          tag: 'UX',
          tags: ['components'],
          reading_time: 6,
          writer: 'Ava',
          writer_avatar: '',
          published_at: '2025-01-01T00:00:00.000Z',
          category_id: 'cat-1',
          category: {
            id: 'cat-1',
            name: 'Design',
            slug: 'design',
            description: null,
            is_active: true,
            created_at: '2025-01-01T00:00:00.000Z',
            updated_at: '2025-01-01T00:00:00.000Z',
          },
        },
        'design',
      ),
    ).toBe(true);
  });
});
