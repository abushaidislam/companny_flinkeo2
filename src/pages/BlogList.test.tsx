import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';

const categories = [
  {
    id: 'cat-1',
    name: 'Design',
    slug: 'design',
    description: 'Design posts',
    is_active: true,
    created_at: '2025-01-01T00:00:00.000Z',
    updated_at: '2025-01-01T00:00:00.000Z',
  },
  {
    id: 'cat-2',
    name: 'SEO',
    slug: 'seo',
    description: 'SEO posts',
    is_active: true,
    created_at: '2025-01-01T00:00:00.000Z',
    updated_at: '2025-01-01T00:00:00.000Z',
  },
];

const blogs = [
  {
    id: 'blog-1',
    slug: 'design-system-guide',
    headline: 'Design System Guide',
    excerpt: 'Structure your UI library.',
    cover_image: '',
    tag: 'UI',
    tags: ['systems'],
    reading_time: 6,
    writer: 'Ava',
    writer_avatar: '',
    published_at: '2025-01-01T00:00:00.000Z',
    category_id: 'cat-1',
    category: categories[0],
  },
  {
    id: 'blog-2',
    slug: 'seo-basics',
    headline: 'SEO Basics',
    excerpt: 'Search fundamentals for startups.',
    cover_image: '',
    tag: 'Growth',
    tags: ['traffic'],
    reading_time: 5,
    writer: 'Liam',
    writer_avatar: '',
    published_at: '2025-02-01T00:00:00.000Z',
    category_id: 'cat-2',
    category: categories[1],
  },
];

function createSupabaseMock() {
  return {
    from(table: string) {
      const source = table === 'categories' ? categories : blogs;
      const state = {
        data: source,
        status: '',
        categoryId: '',
        search: '',
      };

      const applyFilters = () => {
        let filtered = [...source];

        if (table === 'categories') {
          filtered = filtered.filter((item) => (state.status ? item.is_active === true : true));
        }

        if (table === 'blogs') {
          if (state.status) {
            filtered = filtered.filter(() => state.status === 'published');
          }

          if (state.categoryId) {
            filtered = filtered.filter((item) => item.category_id === state.categoryId);
          }

          if (state.search) {
            const term = state.search.toLowerCase();
            filtered = filtered.filter((item) =>
              [item.headline, item.excerpt, item.writer, item.tag]
                .join(' ')
                .toLowerCase()
                .includes(term),
            );
          }
        }

        builder.data = filtered;
      };

      const builder = {
        data: source,
        error: null,
        select() {
          applyFilters();
          return builder;
        },
        eq(field: string, value: string | boolean) {
          if (table === 'categories' && field === 'is_active' && value === true) {
            state.status = 'active';
          }

          if (table === 'blogs' && field === 'status') {
            state.status = String(value);
          }

          if (table === 'blogs' && field === 'category_id') {
            state.categoryId = String(value);
          }

          applyFilters();
          return builder;
        },
        or(expression: string) {
          const match = expression.split(',')[0].match(/%(.+)%/);
          state.search = match ? match[1] : '';
          applyFilters();
          return builder;
        },
        order() {
          applyFilters();
          return builder;
        },
      };

      applyFilters();
      return builder;
    },
  };
}

vi.mock('@/components/landing/Navbar', () => ({ default: () => <div>Navbar</div> }));
vi.mock('@/components/ui/footer-section', () => ({ Footer: () => <div>Footer</div> }));
vi.mock('@/lib/supabase', () => ({
  getSupabaseUnavailableMessage: () => 'Blog unavailable',
  hasSupabaseConfig: true,
  supabase: createSupabaseMock(),
}));

import BlogList from '@/pages/BlogList';

describe('BlogList', () => {
  beforeEach(() => {
    window.history.replaceState({}, '', '/');
  });

  it('loads search and category filters from the URL', async () => {
    render(
      <MemoryRouter initialEntries={['/blog?q=seo&category=seo']}>
        <BlogList />
      </MemoryRouter>,
    );

    await waitFor(() => expect(screen.getByText('SEO Basics')).toBeInTheDocument());

    expect(screen.queryByText('Design System Guide')).not.toBeInTheDocument();
    expect(screen.getByPlaceholderText(/search by headline/i)).toHaveValue('seo');
    expect(screen.getByRole('button', { name: 'SEO' })).toHaveAttribute('aria-pressed', 'true');
  });

  it('shows an empty state and reset path when no posts match', async () => {
    render(
      <MemoryRouter initialEntries={['/blog?q=missing']}>
        <BlogList />
      </MemoryRouter>,
    );

    await waitFor(() =>
      expect(screen.getByText('No articles matched your filters.')).toBeInTheDocument(),
    );

    fireEvent.click(screen.getByRole('button', { name: /reset filters/i }));

    await waitFor(() => expect(screen.getByText('SEO Basics')).toBeInTheDocument());
  });
});
