// Hybrid content renderer - supports both HTML and Markdown
// Auto-detects content type and renders appropriately

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/github-dark.css';
import type { ReactNode } from 'react';

/**
 * ReactMarkdown wrapper with full plugin support
 */
export function MarkdownRenderer({
  content,
  children,
  className = '',
}: {
  content?: string;
  children?: ReactNode;
  className?: string;
}) {
  const textContent = content || (typeof children === 'string' ? children : '');

  return (
    <div className={`prose prose-lg dark:prose-invert max-w-none ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[
          rehypeSlug,
          [rehypeAutolinkHeadings, { behavior: 'wrap' }],
          rehypeHighlight,
        ]}
        components={{
        // Custom components for enhanced rendering
        pre: ({ children }) => (
          <div className="relative group">
            <pre className="relative">{children}</pre>
          </div>
        ),
        code: ({ className, children, ...props }) => {
          const isInline = !className;
          const match = /language-(\w+)/.exec(className || '');
          const language = match ? match[1] : '';

          if (isInline) {
            return (
              <code
                className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono"
                {...props}
              >
                {children}
              </code>
            );
          }

          return (
            <div className="my-4">
              {language && (
                <div className="flex items-center justify-between px-4 py-2 bg-muted border-b rounded-t-lg">
                  <span className="text-xs font-medium text-muted-foreground uppercase">
                    {language}
                  </span>
                </div>
              )}
              <code className={className} {...props}>
                {children}
              </code>
            </div>
          );
        },
        table: ({ children }) => (
          <div className="overflow-x-auto my-4">
            <table className="w-full border-collapse border border-border">
              {children}
            </table>
          </div>
        ),
        th: ({ children }) => (
          <th className="border border-border px-4 py-2 bg-muted font-semibold text-left">
            {children}
          </th>
        ),
        td: ({ children }) => (
          <td className="border border-border px-4 py-2">{children}</td>
        ),
        blockquote: ({ children }) => (
          <blockquote className="border-l-4 border-primary pl-4 italic my-4 text-muted-foreground">
            {children}
          </blockquote>
        ),
        a: ({ href, children }) => {
          const isExternal = href?.startsWith('http');
          return (
            <a
              href={href}
              target={isExternal ? '_blank' : undefined}
              rel={isExternal ? 'noopener noreferrer' : undefined}
              className="text-primary hover:underline"
            >
              {children}
            </a>
          );
        },
        img: ({ src, alt }) => (
          <img
            src={src}
            alt={alt || ''}
            loading="lazy"
            decoding="async"
            className="rounded-lg my-4 max-w-full h-auto"
          />
        ),
      }}
      >
        {textContent}
      </ReactMarkdown>
    </div>
  );
}

export default MarkdownRenderer;
