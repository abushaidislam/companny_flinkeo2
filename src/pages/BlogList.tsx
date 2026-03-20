import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import Navbar from '@/components/landing/Navbar';
import { Footer } from '@/components/ui/footer-section';
import { ArticleCard } from '@/components/ui/blog-post-card';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

interface Blog {
  id: string;
  slug: string;
  headline: string;
  excerpt: string;
  cover_image: string;
  tag: string;
  tags: string[];
  reading_time: number;
  writer: string;
  writer_avatar: string;
  published_at: string;
}

export default function BlogList() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadBlogs();
  }, []);

  const loadBlogs = async () => {
    try {
      const { data, error } = await supabase
        .from('blogs')
        .select('*')
        .eq('status', 'published')
        .order('published_at', { ascending: false });

      if (error) throw error;
      setBlogs(data || []);
    } catch (error) {
      console.error('Error loading blogs:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero */}
      <section className="pt-32 pb-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <p className="text-primary font-medium mb-3">Blog</p>
            <h1 className="font-display font-bold text-4xl md:text-5xl lg:text-6xl mb-4 font-bangla">
              Latest Insights
            </h1>
            <p className="text-text-secondary text-lg font-bangla">
              Stay ahead with the latest trends in web design, development, and digital strategy.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Blog Grid */}
      <section className="pb-24">
        <div className="container mx-auto px-4">
          {isLoading ? (
            <div className="flex justify-center py-16">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : blogs.length === 0 ? (
            <div className="text-center py-16">
              <h2 className="mb-2 text-2xl font-bold leading-tight text-card-foreground font-bangla">
                No blog posts yet.
              </h2>
              <p className="text-muted-foreground font-bangla">Please check back later.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogs.map((blog, index) => (
                <motion.div
                  key={blog.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link to={`/blog/${blog.slug}`}>
                    <ArticleCard
                      headline={blog.headline}
                      excerpt={blog.excerpt}
                      cover={blog.cover_image}
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
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
