import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase credentials not found. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file');
}

export const supabase = createClient(
  supabaseUrl || '',
  supabaseAnonKey || ''
);

// Type definitions for the contact_submissions table
export interface ContactSubmission {
  id?: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  country: string;
  services: string[];
  message?: string;
  created_at?: string;
}

// Function to submit contact form data
export async function submitContactForm(data: ContactSubmission) {
  // Important: do NOT call `.select()` here.
  // With the current RLS policies, `anon` can INSERT but cannot SELECT,
  // and `.insert().select()` requires SELECT permissions as well.
  const { error } = await supabase
    .from('contact_submissions')
    .insert([
      {
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email,
        phone: data.phone,
        country: data.country,
        services: data.services,
        message: data.message || null,
      },
    ]);

  if (error) {
    console.error('Supabase error:', error);
    throw new Error(error.message);
  }

  return { ok: true };
}
