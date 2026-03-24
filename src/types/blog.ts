export interface BlogCategory {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface BlogRecord {
  id: string;
  slug: string;
  headline: string;
  excerpt: string;
  content?: string;
  cover_image: string;
  tag: string;
  tags: string[];
  reading_time: number;
  writer: string;
  writer_avatar: string;
  published_at: string;
  status?: 'draft' | 'published' | 'archived';
  created_at?: string;
  updated_at?: string;
  category_id: string | null;
  category?: BlogCategory | null;
}
