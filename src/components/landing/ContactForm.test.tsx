import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';

vi.mock('@/lib/supabase', () => ({
  getSupabaseUnavailableMessage: () =>
    'Contact form is unavailable right now. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to enable this feature.',
  hasSupabaseConfig: false,
  submitContactForm: vi.fn(),
}));

import ContactForm from '@/components/landing/ContactForm';

describe('Landing ContactForm', () => {
  it('disables submission when Supabase is not configured', () => {
    render(
      <MemoryRouter>
        <ContactForm />
      </MemoryRouter>,
    );

    expect(screen.getByRole('button', { name: /form unavailable/i })).toBeDisabled();
    expect(
      screen.getByText(/form submissions are unavailable in this environment/i),
    ).toBeInTheDocument();
  });
});
