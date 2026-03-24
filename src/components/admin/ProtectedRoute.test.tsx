import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';

vi.mock('@/lib/supabase', () => ({
  getSupabaseUnavailableMessage: () =>
    'Admin access is unavailable right now. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to enable this feature.',
  hasSupabaseConfig: false,
  supabase: {
    auth: {
      getSession: vi.fn(),
      onAuthStateChange: vi.fn(),
    },
  },
}));

import { ProtectedRoute } from '@/components/admin/ProtectedRoute';

describe('ProtectedRoute', () => {
  it('shows an unavailable message when Supabase is not configured', () => {
    render(
      <MemoryRouter>
        <ProtectedRoute>
          <div>Hidden content</div>
        </ProtectedRoute>
      </MemoryRouter>,
    );

    expect(screen.getByText('Admin unavailable')).toBeInTheDocument();
    expect(screen.queryByText('Hidden content')).not.toBeInTheDocument();
  });
});
