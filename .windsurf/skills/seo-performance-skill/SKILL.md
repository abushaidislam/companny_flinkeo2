---
name: seo-performance-skill
description: SEO optimization, performance tuning, and web vitals optimization
---

## Use this skill for:
- SEO meta tags and structured data
- Performance optimization
- Core Web Vitals improvement
- Image optimization
- Lazy loading strategies

## Guidelines:

### SEO Meta Tags
- Use react-helmet-async for dynamic meta tags
- Include Open Graph and Twitter cards
- Add canonical URLs

```tsx
import { Helmet } from 'react-helmet-async';

function BlogPost({ blog }: { blog: Blog }) {
  return (
    <>
      <Helmet>
        <title>{blog.headline} | Flinke Blog</title>
        <meta name="description" content={blog.excerpt} />
        <meta name="keywords" content={blog.tag} />
        
        {/* Open Graph */}
        <meta property="og:title" content={blog.headline} />
        <meta property="og:description" content={blog.excerpt} />
        <meta property="og:image" content={blog.cover_image} />
        <meta property="og:type" content="article" />
        <meta property="article:published_time" content={blog.published_at} />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={blog.headline} />
        <meta name="twitter:image" content={blog.cover_image} />
        
        <link rel="canonical" href={`https://flinke.com/blog/${blog.slug}`} />
      </Helmet>
      <article>{/* content */}</article>
    </>
  );
}
```

### Structured Data (JSON-LD)
- Add schema.org markup for rich snippets
- Include organization, article, and breadcrumb schemas

```tsx
function OrganizationSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Flinke',
    url: 'https://flinke.com',
    logo: 'https://flinke.com/logo.png',
    sameAs: [
      'https://twitter.com/flinke',
      'https://linkedin.com/company/flinke',
    ],
  };

  return (
    <script type="application/ld+json">
      {JSON.stringify(schema)}
    </script>
  );
}

function ArticleSchema({ blog }: { blog: Blog }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: blog.headline,
    description: blog.excerpt,
    image: blog.cover_image,
    datePublished: blog.published_at,
    author: {
      '@type': 'Person',
      name: blog.writer,
    },
  };

  return (
    <script type="application/ld+json">
      {JSON.stringify(schema)}
    </script>
  );
}
```

### Performance Optimization
- Use code splitting with React.lazy
- Implement route-based chunking
- Lazy load below-fold components

```tsx
import { lazy, Suspense } from 'react';

const HeavyChart = lazy(() => import('./HeavyChart'));

function Dashboard() {
  return (
    <Suspense fallback={<ChartSkeleton />}>
      <HeavyChart data={data} />
    </Suspense>
  );
}
```

### Image Optimization
- Use WebP format with fallbacks
- Implement responsive images with srcset
- Always include width/height to prevent CLS

```tsx
<picture>
  <source srcSet="/image.webp" type="image/webp" />
  <source srcSet="/image.jpg" type="image/jpeg" />
  <img
    src="/image.jpg"
    alt="Description"
    width={800}
    height={600}
    loading="lazy"
    decoding="async"
  />
</picture>
```

### Lazy Loading
- Use Intersection Observer for images
- Lazy load routes and heavy components

```tsx
import { useInView } from 'react-intersection-observer';

function LazyImage({ src, alt }: { src: string; alt: string }) {
  const { ref, inView } = useInView({
    triggerOnce: true,
    rootMargin: '100px',
  });

  return (
    <div ref={ref}>
      {inView ? (
        <img src={src} alt={alt} loading="lazy" />
      ) : (
        <Placeholder />
      )}
    </div>
  );
}
```

### Core Web Vitals Targets
- LCP (Largest Contentful Paint): < 2.5s
- FID (First Input Delay): < 100ms
- CLS (Cumulative Layout Shift): < 0.1
- FCP (First Contentful Paint): < 1.8s
- TTFB (Time to First Byte): < 600ms

### Vite Optimization
```ts
// vite.config.ts
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          ui: ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu'],
          charts: ['chart.js', 'recharts'],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
});
```

### Preconnect and Prefetch
```html
<!-- Preconnect to critical domains -->
<link rel="preconnect" href="https://supabase.co" />
<link rel="dns-prefetch" href="https://supabase.co" />

<!-- Prefetch likely navigation -->
<link rel="prefetch" href="/blog" />
```
