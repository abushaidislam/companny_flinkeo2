import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArticleCard } from '@/components/ui/blog-post-card';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Loader2 } from 'lucide-react';

interface Blog {
  id: string;
  slug: string;
  headline: string;
  excerpt: string;
  cover_image: string;
  tag: string;
  reading_time: number;
  writer: string;
  published_at: string;
}

const BlogSection = () => {
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
        .order('published_at', { ascending: false })
        .limit(3);

      if (error) throw error;
      setBlogs(data || []);
    } catch (error) {
      console.error('Error loading blogs:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Fallback data if no blogs in database
  const fallbackPosts = [
    {
      headline: 'Shaping Tomorrow: AI & The Web',
      excerpt: 'From automated coding assistants to intelligent design workflows, AI is redefining how developers build and ship modern applications.',
      cover_image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80',
      tag: 'Innovation',
      reading_time: 7,
      writer: 'John Doe',
      slug: 'shaping-tomorrow-ai-web',
      published_at: '2025-09-01',
    },
    {
      headline: 'The Future of E-commerce UX',
      excerpt: 'How personalized shopping experiences and seamless checkout flows are driving conversion rates through the roof.',
      cover_image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80',
      tag: 'E-commerce',
      reading_time: 6,
      writer: 'Sarah Chen',
      slug: 'future-ecommerce-ux',
      published_at: '2025-08-28',
    },
    {
      headline: 'Mastering SEO in 2025',
      excerpt: 'Essential strategies for ranking higher in search results and driving organic traffic to your website.',
      cover_image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80',
      tag: 'SEO',
      reading_time: 8,
      writer: 'Mike Johnson',
      slug: 'mastering-seo-2025',
      published_at: '2025-08-25',
    },
  ];

  const displayBlogs = blogs.length > 0 ? blogs : fallbackPosts;

  return (
    <section className="py-24 bg-background" id="blog">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-primary font-medium mb-3">Blog</p>
          <h2 className="font-display font-bold text-3xl md:text-4xl lg:text-5xl mb-4">
            Latest Insights
          </h2>
          <p className="text-text-secondary text-lg max-w-2xl mx-auto">
            Stay ahead with the latest trends in web design, development, and digital strategy.
          </p>
        </motion.div>

        {/* Blog Grid */}
        {isLoading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {displayBlogs.map((post, index) => (
              <motion.div
                key={post.id || post.slug}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Link to={`/blog/${post.slug}`}>
                  <ArticleCard
                    headline={post.headline}
                    excerpt={post.excerpt}
                    cover={post.cover_image}
                    tag={post.tag}
                    readingTime={post.reading_time}
                    writer={post.writer}
                    publishedAt={new Date(post.published_at)}
                    clampLines={3}
                  />
                </Link>
              </motion.div>
            ))}
          </div>
        )}

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-primary font-medium hover:gap-3 transition-all"
          >
            View all articles
            <ArrowRight className="h-4 w-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default BlogSection;
