import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { MemoryRouter, Routes, Route } from 'react-router-dom';

const categories = [
  {
    id: 'cat-1',
    name: 'Design',
    slug: 'design',
    description: null,
    is_active: true,
    created_at: '2025-01-01T00:00:00.000Z',
    updated_at: '2025-01-01T00:00:00.000Z',
  },
];

const insertSpy = vi.fn();

function createSupabaseMock() {
  return {
    from(table: string) {
      if (table === 'categories') {
        const builder = {
          data: categories,
          error: null,
          select() {
            return builder;
          },
          order() {
            return builder;
          },
        };

        return builder;
      }

      if (table === 'blogs') {
        return {
          insert: insertSpy.mockResolvedValue({ error: null }),
          update: vi.fn(),
          select: vi.fn(),
        };
      }

      return {};
    },
  };
}

vi.mock('sonner', () => ({
  toast: {
    error: vi.fn(),
    success: vi.fn(),
  },
}));
vi.mock('@/components/admin/RichTextEditor', () => ({
  RichTextEditor: ({
    content,
    onChange,
  }: {
    content: string;
    onChange: (value: string) => void;
  }) => (
    <textarea
      aria-label="Content"
      value={content}
      onChange={(event) => onChange(event.target.value)}
    />
  ),
}));
vi.mock('@/lib/supabase', () => ({
  supabase: createSupabaseMock(),
}));

import { AdminBlogEditor } from '@/components/admin/BlogEditor';

describe('AdminBlogEditor', () => {
  beforeEach(() => {
    insertSpy.mockClear();
  });

  it('saves the selected category with a new blog', async () => {
    render(
      <MemoryRouter initialEntries={['/admin/blog/new']}>
        <Routes>
          <Route path="/admin/blog/new" element={<AdminBlogEditor />} />
          <Route path="/admin" element={<div>Admin home</div>} />
        </Routes>
      </MemoryRouter>,
    );

    await waitFor(() => expect(screen.getByRole('option', { name: 'Design' })).toBeInTheDocument());

    fireEvent.change(screen.getByLabelText(/headline/i), {
      target: { value: 'Design Systems for Startups' },
    });
    fireEvent.change(screen.getByLabelText('Writer *'), {
      target: { value: 'Ava' },
    });
    fireEvent.change(screen.getByLabelText(/primary category/i), {
      target: { value: 'cat-1' },
    });
    fireEvent.change(screen.getByLabelText('Content'), {
      target: {
        value:
          'one two three four five six seven eight nine ten eleven twelve thirteen fourteen fifteen sixteen seventeen eighteen nineteen twenty',
      },
    });

    fireEvent.click(screen.getByRole('button', { name: /save draft/i }));

    await waitFor(() => expect(insertSpy).toHaveBeenCalledTimes(1));

    expect(insertSpy.mock.calls[0][0][0]).toMatchObject({
      headline: 'Design Systems for Startups',
      slug: 'design-systems-for-startups',
      category_id: 'cat-1',
      status: 'draft',
    });
  });
});
