-- Create contact_submissions table
CREATE TABLE IF NOT EXISTS contact_submissions (
  id SERIAL PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  country TEXT NOT NULL DEFAULT 'US',
  services TEXT[] NOT NULL DEFAULT '{}',
  message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status TEXT DEFAULT 'new' -- 'new', 'contacted', 'in_progress', 'completed'
);

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_contact_submissions_email ON contact_submissions(email);

-- Create index on created_at for sorting
CREATE INDEX IF NOT EXISTS idx_contact_submissions_created_at ON contact_submissions(created_at DESC);

-- Create index on status for filtering
CREATE INDEX IF NOT EXISTS idx_contact_submissions_status ON contact_submissions(status);

-- Enable Row Level Security
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

-- Create policy to allow inserts from anyone (for contact form)
DROP POLICY IF EXISTS "Allow anyone to insert contact submissions" ON contact_submissions;
CREATE POLICY "Allow anyone to insert contact submissions" 
  ON contact_submissions FOR INSERT 
  TO anon, authenticated 
  WITH CHECK (true);

-- Create policy to allow select only for authenticated users (for admin panel)
DROP POLICY IF EXISTS "Allow authenticated users to view contact submissions" ON contact_submissions;
CREATE POLICY "Allow authenticated users to view contact submissions" 
  ON contact_submissions FOR SELECT 
  TO authenticated 
  USING (true);

-- Create policy to allow updates only for authenticated users
DROP POLICY IF EXISTS "Allow authenticated users to update contact submissions" ON contact_submissions;
CREATE POLICY "Allow authenticated users to update contact submissions" 
  ON contact_submissions FOR UPDATE 
  TO authenticated 
  USING (true);

-- Create blogs table
CREATE TABLE IF NOT EXISTS blogs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  headline TEXT NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL,
  cover_image TEXT,
  tag TEXT,
  reading_time INTEGER DEFAULT 5,
  writer TEXT NOT NULL,
  writer_avatar TEXT,
  published_at TIMESTAMP WITH TIME ZONE,
  status TEXT DEFAULT 'draft',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for blogs
CREATE INDEX IF NOT EXISTS idx_blogs_slug ON blogs(slug);
CREATE INDEX IF NOT EXISTS idx_blogs_status ON blogs(status);
CREATE INDEX IF NOT EXISTS idx_blogs_published_at ON blogs(published_at DESC);

-- Enable RLS on blogs
ALTER TABLE blogs ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can view published blogs
DROP POLICY IF EXISTS "Public can view published blogs" ON blogs;
CREATE POLICY "Public can view published blogs" 
  ON blogs FOR SELECT 
  USING (status = 'published');

-- Policy: Authenticated users can manage all blogs
DROP POLICY IF EXISTS "Authenticated users can manage blogs" ON blogs;
CREATE POLICY "Authenticated users can manage blogs" 
  ON blogs FOR ALL 
  TO authenticated 
  USING (true) 
  WITH CHECK (true);

-- Create storage bucket for blog images (run in Supabase dashboard SQL editor)
-- INSERT INTO storage.buckets (id, name, public) VALUES ('blog-images', 'blog-images', true);

-- Storage policies for blog-images bucket
-- Policy: Allow public read access
-- CREATE POLICY "Public can view blog images" 
--   ON storage.objects FOR SELECT 
--   USING (bucket_id = 'blog-images');

-- Policy: Allow authenticated users to upload
-- CREATE POLICY "Authenticated users can upload blog images" 
--   ON storage.objects FOR INSERT 
--   TO authenticated 
--   WITH CHECK (bucket_id = 'blog-images');

-- Policy: Allow authenticated users to delete their uploads
-- CREATE POLICY "Authenticated users can delete blog images" 
--   ON storage.objects FOR DELETE 
--   TO authenticated 
--   USING (bucket_id = 'blog-images');

-- Create contracts table (Inbox system for study/tutoring contracts)
CREATE TABLE IF NOT EXISTS contracts (
  id SERIAL PRIMARY KEY,
  sender_name TEXT NOT NULL,
  sender_email TEXT NOT NULL,
  sender_phone TEXT,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  service_type TEXT, -- 'tutoring', 'study_plan', 'consultation', etc.
  status TEXT DEFAULT 'unread', -- 'unread', 'read', 'pending', 'approved', 'rejected', 'completed'
  priority TEXT DEFAULT 'normal', -- 'low', 'normal', 'high', 'urgent'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  read_at TIMESTAMP WITH TIME ZONE,
  replied_at TIMESTAMP WITH TIME ZONE,
  notes TEXT -- Admin notes
);

-- Create indexes for contracts
CREATE INDEX IF NOT EXISTS idx_contracts_status ON contracts(status);
CREATE INDEX IF NOT EXISTS idx_contracts_created_at ON contracts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_contracts_priority ON contracts(priority);

-- Enable RLS on contracts
ALTER TABLE contracts ENABLE ROW LEVEL SECURITY;

-- Policy: Allow anyone to submit contracts (for public contact form)
DROP POLICY IF EXISTS "Allow anyone to insert contracts" ON contracts;
CREATE POLICY "Allow anyone to insert contracts" 
  ON contracts FOR INSERT 
  TO anon, authenticated 
  WITH CHECK (true);

-- Policy: Allow authenticated users to view all contracts
DROP POLICY IF EXISTS "Allow authenticated users to view contracts" ON contracts;
CREATE POLICY "Allow authenticated users to view contracts" 
  ON contracts FOR SELECT 
  TO authenticated 
  USING (true);

-- Policy: Allow authenticated users to update contracts
DROP POLICY IF EXISTS "Allow authenticated users to update contracts" ON contracts;
CREATE POLICY "Allow authenticated users to update contracts" 
  ON contracts FOR UPDATE 
  TO authenticated 
  USING (true);

-- Policy: Allow authenticated users to delete contracts
DROP POLICY IF EXISTS "Allow authenticated users to delete contracts" ON contracts;
CREATE POLICY "Allow authenticated users to delete contracts" 
  ON contracts FOR DELETE 
  TO authenticated 
  USING (true);
