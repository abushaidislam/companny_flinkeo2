import { useEffect, useMemo, useRef, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import Navbar from '@/components/landing/Navbar';
import { Footer } from '@/components/ui/footer-section';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, Clock, User, Loader2, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import DOMPurify from 'dompurify';
import { ArticleCard } from '@/components/ui/blog-post-card';
import { detectContentType, markdownToHtml } from '@/lib/hybrid-renderer';
import { HybridContent } from '@/components/HybridContent';

interface Blog {
  id: string;
  slug: string;
  headline: string;
  excerpt: string;
  content: string;
  cover_image: string;
  tag: string;
  tags: string[];
  reading_time: number;
  writer: string;
  writer_avatar: string;
  published_at: string;
}

interface TocHeading {
  id: string;
  text: string;
  level: 1 | 2 | 3 | 4;
}

export default function BlogDetail() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [relatedBlogs, setRelatedBlogs] = useState<Blog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [readingProgress, setReadingProgress] = useState(0);
  const isMountedRef = useRef(true);

  const [activeHeadingId, setActiveHeadingId] = useState<string | null>(null);
  const tocObserverRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    if (slug) {
      loadBlog();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  const loadBlog = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('blogs')
        .select('*')
        .eq('slug', slug)
        .eq('status', 'published')
        .single();

      if (error) throw error;
      if (!data) {
        if (isMountedRef.current) {
          setError('Blog not found');
        }
        return;
      }
      if (isMountedRef.current) {
        setBlog(data);
      }
    } catch (error) {
      if (isMountedRef.current) {
        console.error('Error loading blog:', error);
        setError('Failed to load blog');
      }
    } finally {
      if (isMountedRef.current) {
        setIsLoading(false);
      }
    }
  };

  // Process content to add anchor IDs to headings (for TOC + heading links)
  const processedContent = useMemo(() => {
    const result: { html: string; headings: TocHeading[] } = { html: '', headings: [] };
    if (!blog?.content) return result;

    // Detect content type
    const contentType = detectContentType(blog.content);

    // Convert markdown to HTML for processing if needed
    let htmlContent: string;
    if (contentType === 'markdown') {
      // Simple markdown to HTML conversion for TOC extraction
      htmlContent = markdownToHtml(blog.content);
    } else {
      htmlContent = blog.content;
    }

    const sanitized = DOMPurify.sanitize(htmlContent);
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = sanitized;

    const usedIds = new Set<string>();
    const headingEls = tempDiv.querySelectorAll('h1, h2, h3, h4');

    headingEls.forEach((heading) => {
      const text = heading.textContent || '';
      let id = text
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .substring(0, 50);

      if (!id) id = 'section';
      let dedup = id;
      let i = 2;
      while (usedIds.has(dedup)) dedup = `${id}-${i++}`;
      id = dedup;
      usedIds.add(id);

      heading.id = id;

      // Build TOC entry only for h2-h4 (h1 is the page title already)
      const tag = heading.tagName.toLowerCase();
      const level = tag === 'h1' ? 1 : tag === 'h2' ? 2 : tag === 'h3' ? 3 : 4;
      if (level >= 2) {
        result.headings.push({ id, text, level });
      }

      // Add anchor link wrapper (public view styling in `src/index.css`)
      const wrapper = document.createElement('span');
      wrapper.className = 'heading-anchor';
      while (heading.firstChild) wrapper.appendChild(heading.firstChild);

      const anchor = document.createElement('a');
      anchor.href = `#${id}`;
      anchor.className = 'anchor-icon';
      anchor.setAttribute('aria-label', `Link to ${text}`);
      anchor.innerHTML =
        `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>`;

      wrapper.appendChild(anchor);
      heading.appendChild(wrapper);
    });

    // Improve UX: external links open in new tab, images lazy-load
    tempDiv.querySelectorAll('a').forEach((a) => {
      const href = (a as HTMLAnchorElement).getAttribute('href') || '';
      const isHttp = href.startsWith('http://') || href.startsWith('https://');
      if (isHttp) {
        (a as HTMLAnchorElement).setAttribute('target', '_blank');
        (a as HTMLAnchorElement).setAttribute('rel', 'noopener noreferrer');
      }
    });

    tempDiv.querySelectorAll('img').forEach((img) => {
      const el = img as HTMLImageElement;
      el.loading = 'lazy';
      el.decoding = 'async';
    });

    // Premium UX wrappers / hooks:
    // - Make tables horizontally scrollable on mobile
    tempDiv.querySelectorAll('table').forEach((table) => {
      const wrapper = document.createElement('div');
      wrapper.className = 'blog-table';
      table.parentNode?.insertBefore(wrapper, table);
      wrapper.appendChild(table);
    });

    // - Mark elements for "scroll reveal" animations
    tempDiv
      .querySelectorAll('p, ul, ol, blockquote, pre, .blog-table, img, hr')
      .forEach((el) => el.classList.add('blog-reveal'));

    result.html = tempDiv.innerHTML;
    return result;
  }, [blog?.content]);

  const tocHeadings = processedContent.headings;

  // Scroll spy: track which heading is currently in view
  useEffect(() => {
    if (tocHeadings.length === 0) return;

    const contentEl = contentRef.current;
    if (!contentEl) return;

    // Cleanup previous observer
    if (tocObserverRef.current) {
      tocObserverRef.current.disconnect();
    }

    // Create new observer
    tocObserverRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveHeadingId(entry.target.id);
          }
        });
      },
      {
        root: null,
        rootMargin: '-20% 0px -60% 0px',
        threshold: 0,
      }
    );

    // Observe all heading elements
    tocHeadings.forEach((heading) => {
      const el = document.getElementById(heading.id);
      if (el && tocObserverRef.current) {
        tocObserverRef.current.observe(el);
      }
    });

    return () => {
      tocObserverRef.current?.disconnect();
    };
  }, [tocHeadings, processedContent.html]);

  // Handle hash navigation after content loads
  const handleContentProcessed = () => {
    if (!isLoading && window.location.hash) {
      const hash = window.location.hash.slice(1);
      const element = document.getElementById(hash);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
      }
    }
  };

  // Load related blogs with cleanup protection
  useEffect(() => {
    if (!blog) return;
    const loadRelated = async () => {
      try {
        let query = supabase
          .from('blogs')
          .select('*')
          .eq('status', 'published')
          .neq('slug', blog.slug)
          .order('published_at', { ascending: false })
          .limit(3);

        if (blog.tag) {
          query = query.eq('tag', blog.tag);
        }

        const { data, error } = await query;
        if (error) throw error;
        if (isMountedRef.current) {
          setRelatedBlogs(data || []);
        }
      } catch (err) {
        if (isMountedRef.current) {
          console.error('Error loading related blogs:', err);
        }
      }
    };

    loadRelated();
  }, [blog]);

  // Scroll progress tracking - no dependencies needed
  useEffect(() => {
    const handleScroll = () => {
      const contentEl = contentRef.current;
      if (!contentEl) return;

      const start = contentEl.getBoundingClientRect().top + window.scrollY;
      const end = start + contentEl.scrollHeight - window.innerHeight;
      const denom = end - start;
      const progress = denom <= 0 ? 0 : (window.scrollY - start) / denom;
      setReadingProgress(Math.max(0, Math.min(1, progress)));
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex justify-center items-center pt-32 pb-16">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 pt-32 pb-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Blog Not Found</h1>
          <p className="text-muted-foreground mb-6">
            {error || 'The blog post you\'re looking for doesn\'t exist.'}
          </p>
          <Button onClick={() => navigate('/blog')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Blog
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Reading progress */}
      <div className="fixed left-0 top-0 z-50 h-1 w-full bg-transparent">
        <div
          className="h-full bg-primary transition-[width] duration-150"
          style={{ width: `${readingProgress * 100}%` }}
        />
      </div>
      
      {/* Back Button */}
      <div className="container mx-auto px-4 pt-28">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/blog')}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Blog
        </Button>
      </div>

      {/* Hero Image */}
      {blog.cover_image && (
        <div className="container mx-auto px-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative aspect-[21/9] rounded-2xl overflow-hidden"
          >
            <img
              src={blog.cover_image}
              alt={blog.headline}
              className="w-full h-full object-cover"
            />
          </motion.div>
        </div>
      )}

      {/* Content */}
      <article className="container mx-auto px-4 pb-16">
        <div className="max-w-6xl mx-auto flex gap-10">
          <div className="flex-1 max-w-3xl">
            {/* Meta */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              {/* Tags */}
              {(blog.tags?.length > 0 || blog.tag) && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {blog.tags?.map((tag) => (
                    <Badge key={tag} variant="outline">
                      #{tag}
                    </Badge>
                  ))}
                  {blog.tag && !blog.tags?.includes(blog.tag) && (
                    <Badge variant="secondary">
                      {blog.tag}
                    </Badge>
                  )}
                </div>
              )}
              <h1 className="font-display font-bold text-3xl md:text-4xl lg:text-5xl mb-6">
                {blog.headline}
              </h1>
              
              {/* Author & Date */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  {blog.writer_avatar ? (
                    <img
                      src={blog.writer_avatar}
                      alt={blog.writer}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="h-4 w-4 text-primary" />
                    </div>
                  )}
                  <span className="font-medium text-foreground">{blog.writer}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>
                    {new Date(blog.published_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </span>
                </div>
                
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>{blog.reading_time} min read</span>
                </div>
              </div>
            </motion.div>

            {/* Excerpt */}
            {blog.excerpt && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="mb-8"
              >
                <p className="text-lg text-muted-foreground italic border-l-4 border-primary pl-4">
                  {blog.excerpt}
                </p>
              </motion.div>
            )}

            {/* Main Content - Hybrid: supports both HTML and Markdown */}
            <motion.div
              ref={contentRef}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              {blog.content && (
                <HybridContent content={blog.content} />
              )}
            </motion.div>

            {/* Related articles */}
            {relatedBlogs.length > 0 && (
              <section className="mt-12">
                <h2 className="text-xl font-semibold mb-4">Related articles</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {relatedBlogs.map((r) => (
                    <Link key={r.id} to={`/blog/${r.slug}`}>
                      <ArticleCard
                        headline={r.headline}
                        excerpt={r.excerpt}
                        cover={r.cover_image}
                        tag={r.tag}
                        tags={r.tags}
                        readingTime={r.reading_time}
                        writer={r.writer}
                        publishedAt={new Date(r.published_at)}
                        clampLines={2}
                      />
                    </Link>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Table of contents - Upgraded with scroll spy */}
          {tocHeadings.length > 0 && (
            <aside className="hidden lg:block w-72 shrink-0 sticky top-24 self-start pl-6 border-l border-border max-h-[calc(100vh-8rem)] overflow-y-auto scrollbar-hide">
              <div className="p-2">
                <div className="flex items-center gap-2 mb-3">
                  <List className="h-4 w-4 text-primary" />
                  <h3 className="text-sm font-semibold text-foreground">On this page</h3>
                </div>
                <nav className="space-y-0.5">
                  {tocHeadings.map((h) => {
                    const isActive = activeHeadingId === h.id;
                    const baseClasses = "block text-sm py-1.5 px-2 rounded-md transition-all duration-200 hover:bg-muted";
                    const levelClasses = {
                      2: "font-medium text-foreground",
                      3: "pl-3 text-muted-foreground",
                      4: "pl-6 text-muted-foreground/80 text-xs",
                    }[h.level] || "";
                    const activeClasses = isActive
                      ? "bg-primary/10 text-primary font-medium border-l-2 border-primary"
                      : "";

                    return (
                      <a
                        key={h.id}
                        href={`#${h.id}`}
                        onClick={(e) => {
                          e.preventDefault();
                          const el = document.getElementById(h.id);
                          if (el) {
                            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                            window.history.pushState(null, '', `#${h.id}`);
                          }
                        }}
                        className={`${baseClasses} ${levelClasses} ${activeClasses}`}
                      >
                        {h.text}
                      </a>
                    );
                  })}
                </nav>
              </div>
            </aside>
          )}
        </div>
      </article>

      <Footer />
    </div>
  );
}
