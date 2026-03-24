import { useCallback, useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Loader2, Search, X } from 'lucide-react';

import Navbar from '@/components/landing/Navbar';
import { Button } from '@/components/ui/button';
import { Footer } from '@/components/ui/footer-section';
import { Input } from '@/components/ui/input';
import { ArticleCard } from '@/components/ui/blog-post-card';
import {
  buildBlogSearchFilter,
  getCategoryDisplayName,
} from '@/lib/blog-categories';
import {
  getSupabaseUnavailableMessage,
  hasSupabaseConfig,
  supabase,
} from '@/lib/supabase';
import type { BlogCategory, BlogRecord } from '@/types/blog';

const BLOG_SELECT =
  'id, slug, headline, excerpt, cover_image, tag, tags, reading_time, writer, writer_avatar, published_at, category_id, category:categories(id, name, slug, description, is_active, created_at, updated_at)';

export default function BlogList() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [blogs, setBlogs] = useState<BlogRecord[]>([]);
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasLoadedCategories, setHasLoadedCategories] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchQuery = searchParams.get('q') || '';
  const activeCategorySlug = searchParams.get('category') || '';
  const activeCategory = categories.find((category) => category.slug === activeCategorySlug) || null;

  const updateSearchParams = (updates: Record<string, string | null>) => {
    const next = new URLSearchParams(searchParams);

    Object.entries(updates).forEach(([key, value]) => {
      if (value && value.trim()) {
        next.set(key, value.trim());
      } else {
        next.delete(key);
      }
    });

    setSearchParams(next, { replace: true });
  };

  const loadCategories = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('is_active', true)
        .order('name', { ascending: true });

      if (error) throw error;
      setCategories(data || []);
    } catch (loadError) {
      console.error('Error loading categories:', loadError);
      setError('We could not load blog categories right now.');
    } finally {
      setHasLoadedCategories(true);
    }
  }, []);

  const loadBlogs = useCallback(async () => {
    setIsLoading(true);

    try {
      if (activeCategorySlug && !activeCategory) {
        setBlogs([]);
        return;
      }

      let query = supabase
        .from('blogs')
        .select(BLOG_SELECT)
        .eq('status', 'published')
        .order('published_at', { ascending: false });

      if (activeCategory) {
        query = query.eq('category_id', activeCategory.id);
      }

      const searchFilter = buildBlogSearchFilter(searchQuery);
      if (searchFilter) {
        query = query.or(searchFilter);
      }

      const { data, error } = await query;

      if (error) throw error;
      setBlogs(data || []);
      setError(null);
    } catch (loadError) {
      console.error('Error loading blogs:', loadError);
      setError('We could not load blog posts right now.');
    } finally {
      setIsLoading(false);
    }
  }, [activeCategory, activeCategorySlug, searchQuery]);

  useEffect(() => {
    if (!hasSupabaseConfig) {
      setError(getSupabaseUnavailableMessage('Blog'));
      setIsLoading(false);
      return;
    }

    void loadCategories();
  }, [loadCategories]);

  useEffect(() => {
    if (!hasSupabaseConfig || !hasLoadedCategories) return;
    void loadBlogs();
  }, [hasLoadedCategories, loadBlogs]);

  const hasFilters = Boolean(searchQuery || activeCategorySlug);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="pb-16 pt-32">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mx-auto max-w-3xl text-center"
          >
            <p className="mb-3 font-medium text-primary">Blog</p>
            <h1 className="mb-4 font-display text-4xl font-bold font-bangla md:text-5xl lg:text-6xl">
              Latest Insights
            </h1>
            <p className="text-lg text-text-secondary font-bangla">
              Stay ahead with the latest trends in web design, development, and digital strategy.
            </p>
          </motion.div>

          <div className="mx-auto mt-10 max-w-3xl">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={(event) => updateSearchParams({ q: event.target.value })}
                placeholder="Search by headline, excerpt, author, or tag..."
                className="h-12 rounded-full border-border/70 pl-11 pr-12"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => updateSearchParams({ q: null })}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                  aria-label="Clear search"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="pb-24">
        <div className="container mx-auto px-4">
          <div className="mb-8 flex flex-wrap gap-3">
            <Button
              variant={!activeCategorySlug ? 'default' : 'outline'}
              size="sm"
              aria-pressed={!activeCategorySlug}
              onClick={() => updateSearchParams({ category: null })}
              className="rounded-full"
            >
              All posts
            </Button>
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={activeCategorySlug === category.slug ? 'default' : 'outline'}
                size="sm"
                aria-pressed={activeCategorySlug === category.slug}
                onClick={() =>
                  updateSearchParams({
                    category: activeCategorySlug === category.slug ? null : category.slug,
                  })
                }
                className="rounded-full"
              >
                {category.name}
              </Button>
            ))}
          </div>

          {isLoading ? (
            <div className="flex justify-center py-16">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : error ? (
            <div className="py-16 text-center">
              <h2 className="mb-2 text-2xl font-bold leading-tight text-card-foreground font-bangla">
                Blog unavailable
              </h2>
              <p className="font-bangla text-muted-foreground">{error}</p>
            </div>
          ) : blogs.length === 0 ? (
            <div className="py-16 text-center">
              <h2 className="mb-2 text-2xl font-bold leading-tight text-card-foreground font-bangla">
                {hasFilters ? 'No articles matched your filters.' : 'No blog posts yet.'}
              </h2>
              <p className="font-bangla text-muted-foreground">
                {hasFilters
                  ? 'Try a different keyword or switch to another category.'
                  : 'Please check back later.'}
              </p>
              {hasFilters && (
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => setSearchParams(new URLSearchParams(), { replace: true })}
                >
                  Reset filters
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-8">
              <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-muted-foreground">
                <p>
                  Showing {blogs.length} article{blogs.length === 1 ? '' : 's'}
                  {activeCategory ? ` in ${activeCategory.name}` : ''}
                </p>
                {searchQuery && <p>Search: &quot;{searchQuery}&quot;</p>}
              </div>

              <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                {blogs.map((blog, index) => (
                  <motion.div
                    key={blog.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.08 }}
                  >
                    <Link to={`/blog/${blog.slug}`}>
                      <ArticleCard
                        headline={blog.headline}
                        excerpt={blog.excerpt}
                        cover={blog.cover_image}
                        category={getCategoryDisplayName(blog.category, blog.tag)}
                        tag={blog.tag}
                        tags={blog.tags}
                        readingTime={blog.reading_time}
                        writer={blog.writer}
                        publishedAt={new Date(blog.published_at)}
                        clampLines={3}
                      />
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
