import { render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { MemoryRouter, Route, Routes } from 'react-router-dom';

const categories = [
  {
    id: 'cat-design',
    name: 'Design',
    slug: 'design',
    description: null,
    is_active: true,
    created_at: '2025-01-01T00:00:00.000Z',
    updated_at: '2025-01-01T00:00:00.000Z',
  },
];

const blogData = [
  {
    id: 'blog-1',
    slug: 'design-system-guide',
    headline: 'Design System Guide',
    excerpt: 'Build a consistent interface.',
    content: '<h2>Section</h2><p>Content body</p>',
    cover_image: '',
    tag: 'UI',
    tags: ['systems'],
    reading_time: 6,
    writer: 'Ava',
    writer_avatar: '',
    published_at: '2025-02-01T00:00:00.000Z',
    category_id: 'cat-design',
    category: categories[0],
  },
  {
    id: 'blog-2',
    slug: 'pattern-libraries',
    headline: 'Pattern Libraries',
    excerpt: 'Component patterns that scale.',
    content: '<p>Pattern content</p>',
    cover_image: '',
    tag: 'UX',
    tags: ['patterns'],
    reading_time: 5,
    writer: 'Mina',
    writer_avatar: '',
    published_at: '2025-02-10T00:00:00.000Z',
    category_id: 'cat-design',
    category: categories[0],
  },
  {
    id: 'blog-3',
    slug: 'launch-checklist',
    headline: 'Launch Checklist',
    excerpt: 'Fallback newest post.',
    content: '<p>Launch content</p>',
    cover_image: '',
    tag: 'Growth',
    tags: ['launch'],
    reading_time: 4,
    writer: 'Noah',
    writer_avatar: '',
    published_at: '2025-03-01T00:00:00.000Z',
    category_id: null,
    category: null,
  },
  {
    id: 'blog-4',
    slug: 'solo-playbook',
    headline: 'Solo Playbook',
    excerpt: 'No category article.',
    content: '<p>Solo content</p>',
    cover_image: '',
    tag: 'Ops',
    tags: ['operations'],
    reading_time: 4,
    writer: 'Sara',
    writer_avatar: '',
    published_at: '2025-03-05T00:00:00.000Z',
    category_id: null,
    category: null,
  },
];

function createSupabaseMock() {
  return {
    from() {
      const state = {
        slug: '',
        status: '',
        categoryId: '',
        excludedSlug: '',
        limit: Infinity,
      };

      const compute = () =>
        blogData
          .filter((item) => (state.slug ? item.slug === state.slug : true))
          .filter((item) => (state.status ? state.status === 'published' : true))
          .filter((item) => (state.categoryId ? item.category_id === state.categoryId : true))
          .filter((item) => (state.excludedSlug ? item.slug !== state.excludedSlug : true))
          .sort((left, right) => right.published_at.localeCompare(left.published_at))
          .slice(0, state.limit);

      const builder = {
        data: compute(),
        error: null,
        select() {
          builder.data = compute();
          return builder;
        },
        eq(field: string, value: string) {
          if (field === 'slug') state.slug = value;
          if (field === 'status') state.status = value;
          if (field === 'category_id') state.categoryId = value;
          builder.data = compute();
          return builder;
        },
        neq(field: string, value: string) {
          if (field === 'slug') state.excludedSlug = value;
          builder.data = compute();
          return builder;
        },
        order() {
          builder.data = compute();
          return builder;
        },
        limit(value: number) {
          state.limit = value;
          builder.data = compute();
          return builder;
        },
        single() {
          return { data: compute()[0] || null, error: null };
        },
      };

      return builder;
    },
  };
}

vi.mock('@/components/landing/Navbar', () => ({ default: () => <div>Navbar</div> }));
vi.mock('@/components/ui/footer-section', () => ({ Footer: () => <div>Footer</div> }));
vi.mock('@/components/HybridContent', () => ({
  HybridContent: ({ content }: { content: string }) => <div>{content}</div>,
}));
vi.mock('@/lib/supabase', () => ({
  getSupabaseUnavailableMessage: () => 'Blog unavailable',
  hasSupabaseConfig: true,
  supabase: createSupabaseMock(),
}));

import BlogDetail from '@/pages/BlogDetail';

describe('BlogDetail', () => {
  it('prefers same-category related articles', async () => {
    render(
      <MemoryRouter initialEntries={['/blog/design-system-guide']}>
        <Routes>
          <Route path="/blog/:slug" element={<BlogDetail />} />
        </Routes>
      </MemoryRouter>,
    );

    await waitFor(() => expect(screen.getByText('Design System Guide')).toBeInTheDocument());
    await waitFor(() => expect(screen.getByText('More in Design')).toBeInTheDocument());

    expect(screen.getByText('Pattern Libraries')).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'Design System Guide' })).not.toBeInTheDocument();
  });

  it('falls back to latest posts when the article has no category', async () => {
    render(
      <MemoryRouter initialEntries={['/blog/solo-playbook']}>
        <Routes>
          <Route path="/blog/:slug" element={<BlogDetail />} />
        </Routes>
      </MemoryRouter>,
    );

    await waitFor(() => expect(screen.getByText('Solo Playbook')).toBeInTheDocument());
    await waitFor(() => expect(screen.getByText('Related articles')).toBeInTheDocument());

    expect(screen.getByText('Launch Checklist')).toBeInTheDocument();
  });
});
