// Hybrid content renderer - supports both HTML and Markdown
// Auto-detects content type and renders appropriately

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/github-dark.css';
import type { ReactNode } from 'react';
import * as React from 'react';
import mermaid from 'mermaid';
import Chart from 'chart.js/auto';
import type { ChartData, ChartType } from 'chart.js';
import { References } from '@/components/References';
import { hasReferences, parseReferences } from '@/lib/reference-parser';
import { containsBengaliText } from '@/lib/content-utils';

type MarkdownNode = {
  type?: string;
  value?: string;
  children?: MarkdownNode[];
};

const BLOG_VISUAL_FONT_STACK = "'Anek Bangla', 'Noto Sans Bengali', 'Plus Jakarta Sans', 'Inter', sans-serif";
if (Chart.defaults?.font) {
  Chart.defaults.font.family = BLOG_VISUAL_FONT_STACK;
}

function extractTextContent(node: ReactNode, separator = ''): string {
  if (typeof node === 'string' || typeof node === 'number') {
    return String(node);
  }

  if (Array.isArray(node)) {
    return node.map((child) => extractTextContent(child, separator)).join(separator);
  }

  if (React.isValidElement(node) && 'children' in node.props) {
    return extractTextContent(node.props.children, separator);
  }

  return '';
}

function extractMarkdownNodeText(node?: MarkdownNode): string {
  if (!node) return '';

  if (node.type === 'text' && typeof node.value === 'string') {
    return node.value;
  }

  if (Array.isArray(node.children)) {
    return node.children.map(extractMarkdownNodeText).join('');
  }

  return '';
}

function extractCodeBlockRaw(node: MarkdownNode | undefined, fallbackChildren: ReactNode): string {
  const fromNode = extractMarkdownNodeText(node);
  if (fromNode) {
    return fromNode;
  }

  return extractTextContent(fallbackChildren, '\n');
}

function normalizeMermaidSource(raw: string): string {
  return raw.replace(/^mermaid\s+/i, '').replace(/\r\n/g, '\n').trim();
}

function looksNarrative(text: string): boolean {
  return /\b[A-Z][a-z]{2,}\s+[a-z]{2,}\s+[a-z]{2,}/.test(text) || /\b[a-z]{3,}\s+[a-z]{3,}\s+[a-z]{3,}/.test(text);
}

function buildMermaidRecoveryCandidates(raw: string): string[] {
  const normalized = normalizeMermaidSource(raw);
  if (!normalized) return [];

  const candidates = [normalized];
  const sections = normalized
    .split(/\n\s*\n/)
    .map((section) => section.trim())
    .filter(Boolean);

  if (sections.length > 1 && looksNarrative(sections[sections.length - 1])) {
    let current = '';
    sections.slice(0, -1).forEach((section) => {
      current = current ? `${current}\n\n${section}` : section;
      candidates.push(current);
    });
  }

  const lines = normalized.split('\n');
  const trailingWindow = lines.slice(Math.max(0, lines.length - 2)).join('\n');
  if (lines.length > 1 && looksNarrative(trailingWindow)) {
    for (let end = lines.length - 1; end >= 1; end -= 1) {
      const candidate = lines.slice(0, end).join('\n').trim();
      if (candidate) {
        candidates.push(candidate);
      }
    }
  }

  return Array.from(new Set(candidates));
}

async function renderMermaidWithRecovery(id: string, raw: string) {
  const candidates = buildMermaidRecoveryCandidates(raw);
  let lastError: unknown;

  for (const candidate of candidates) {
    try {
      return await mermaid.render(id, candidate);
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError;
}

function looksLikeMermaid(raw: string) {
  const rawLower = raw.trim().toLowerCase();

  return (
    rawLower.startsWith('flowchart') ||
    rawLower.startsWith('graph ') ||
    rawLower.startsWith('sequencediagram') ||
    rawLower.startsWith('xychart-beta') ||
    rawLower.startsWith('pie') ||
    rawLower.startsWith('gantt') ||
    rawLower.startsWith('classdiagram') ||
    rawLower.startsWith('erdiagram') ||
    rawLower.startsWith('journey') ||
    rawLower.startsWith('gitgraph') ||
    rawLower.startsWith('mindmap') ||
    rawLower.startsWith('timeline') ||
    rawLower.startsWith('quadrantchart') ||
    rawLower.startsWith('mermaid ') ||
    rawLower === 'mermaid' ||
    rawLower.startsWith('mermaid\n')
  );
}

function isMermaidLanguage(className?: string) {
  const cls = (className || '').toLowerCase();
  return cls.includes('language-mermaid') || cls.includes('lang-mermaid') || cls.includes('mermaid');
}

function isChartLanguage(className?: string) {
  const cls = (className || '').toLowerCase();
  return cls.includes('language-chart') || cls.includes('lang-chart') || cls.includes('chart');
}

type ChartSpec = {
  title?: string;
  type?: string;
  data?: unknown;
  options?: { legend?: boolean } & Record<string, unknown>;
};

function ChartBlock({ raw }: { raw: string }) {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const isBangla = React.useMemo(() => containsBengaliText(raw), [raw]);
  const spec = React.useMemo<ChartSpec | null>(() => {
    try {
      return JSON.parse(raw) as ChartSpec;
    } catch {
      return null;
    }
  }, [raw]);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !spec) return;

    const chart = new Chart(canvas, {
      type: (spec.type as ChartType) || 'line',
      data: spec.data as ChartData,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: { duration: 900, easing: 'easeOutQuart' },
        locale: isBangla ? 'bn-BD' : 'en-US',
        plugins: {
          legend: { display: (spec.options?.legend as boolean) !== false },
          title: { display: false },
          tooltip: { enabled: true },
        },
        ...(spec.options || {}),
      },
    });

    return () => {
      chart.destroy();
    };
  }, [spec, isBangla]);

  if (!spec) {
    return (
      <pre className="relative">
        <code className="language-chart">{raw}</code>
      </pre>
    );
  }

  return (
    <div
      className="blog-chart blog-reveal is-visible"
      data-special-block="chart"
      lang={isBangla ? 'bn' : undefined}
    >
      <div className="blog-chart__header">{spec?.title || (isBangla ? 'চার্ট' : 'Chart')}</div>
      <div className="blog-chart__canvas">
        <canvas
          ref={canvasRef}
          aria-label={spec?.title ? `Chart: ${spec.title}` : 'Chart'}
        />
      </div>
    </div>
  );
}

function MermaidBlock({ raw }: { raw: string }) {
  const [svg, setSvg] = React.useState('');
  const [failed, setFailed] = React.useState(false);
  const isBangla = React.useMemo(() => containsBengaliText(raw), [raw]);

  React.useEffect(() => {
    let cancelled = false;
    const id = `mermaid-${Math.random().toString(36).slice(2, 9)}`;

    mermaid.initialize({
      startOnLoad: false,
      theme: document.documentElement.classList.contains('dark') ? 'dark' : 'default',
      securityLevel: 'loose',
      themeVariables: {
        fontFamily: BLOG_VISUAL_FONT_STACK,
      },
      themeCSS: `
        #${id},
        #${id} text,
        #${id} tspan,
        #${id} foreignObject,
        #${id} foreignObject div,
        #${id} span,
        #${id} p {
          font-family: ${BLOG_VISUAL_FONT_STACK};
          letter-spacing: normal;
          word-break: break-word;
        }
      `,
    });

    renderMermaidWithRecovery(id, raw)
      .then(({ svg: renderedSvg }) => {
        if (cancelled) return;
        setSvg(renderedSvg);
        setFailed(false);
      })
      .catch((error) => {
        if (cancelled) return;
        console.error('Mermaid render error:', error);
        setFailed(true);
      });

    return () => {
      cancelled = true;
    };
  }, [raw]);

  return (
    <div
      className="blog-mermaid blog-reveal is-visible"
      data-special-block="mermaid"
      lang={isBangla ? 'bn' : undefined}
    >
      {failed ? (
        <div className="text-red-500">{isBangla ? 'ডায়াগ্রাম রেন্ডার করা যায়নি' : 'Failed to render diagram'}</div>
      ) : !svg ? (
        <div className="blog-mermaid__placeholder">{isBangla ? 'ডায়াগ্রাম রেন্ডার হচ্ছে...' : 'Rendering diagram...'}</div>
      ) : (
        <div className="blog-mermaid__svg-wrap" dangerouslySetInnerHTML={{ __html: svg }} />
      )}
    </div>
  );
}

/**
 * ReactMarkdown wrapper with full plugin support
 */
function MarkdownRendererComponent({
  content,
  children,
  className = '',
}: {
  content?: string;
  children?: ReactNode;
  className?: string;
}) {
  const textContent = content || (typeof children === 'string' ? children : '');
  const contentLang = containsBengaliText(textContent) ? 'bn' : undefined;

  // Parse references from markdown content
  const hasRefs = hasReferences(textContent);
  const parsed = hasRefs ? parseReferences(textContent) : null;
  const markdownToRender = parsed?.content || textContent;
  const references = parsed?.references || [];

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
        pre: ({ children }) => {
          const firstChild = React.Children.count(children) === 1 ? React.Children.only(children) : null;

          if (React.isValidElement(firstChild) && (firstChild.type === ChartBlock || firstChild.type === MermaidBlock)) {
            return firstChild;
          }

          return (
            <div className="relative group markdown-code-block">
              <pre className="relative">{children}</pre>
            </div>
          );
        },
        code: ({ className, children, node, ...props }: React.ComponentPropsWithoutRef<'code'> & { inline?: boolean; node?: MarkdownNode }) => {
          const { inline, ...codeProps } = props;
          const raw = extractCodeBlockRaw(node, children).replace(/\n$/, '');
          const isInline = inline ?? !className;
          const match = /language-(\w+)/.exec(className || '');
          const language = match ? match[1] : '';

          if (isInline) {
            return (
              <code
                className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono"
                {...codeProps}
              >
                {children}
              </code>
            );
          }

          if (language === 'chart' || isChartLanguage(className)) {
            return <ChartBlock raw={raw} />;
          }

          if (language === 'mermaid' || isMermaidLanguage(className) || looksLikeMermaid(raw)) {
            return <MermaidBlock raw={raw} />;
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
              <code className={className} {...codeProps}>
                {children}
              </code>
            </div>
          );
        },
        table: ({ children }) => (
          <div className="overflow-x-auto my-4">
            <table className="min-w-full w-max border-collapse border border-border">
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
          const citationMatch = href?.match(/#ref-([^#?]+)/);
          if (citationMatch) {
            const refId = citationMatch[1];
            const activateCitation = () => {
              const target = document.getElementById(`ref-${refId}`);
              if (!target) return;

              window.history.pushState(null, '', `#ref-${refId}`);
              target.scrollIntoView({ behavior: 'smooth', block: 'center' });
              target.classList.add('reference-highlight');
              window.setTimeout(() => target.classList.remove('reference-highlight'), 2000);
            };
            const handleCitationClick = (event: React.MouseEvent<HTMLSpanElement>) => {
              event.preventDefault();
              activateCitation();
            };

            const handleCitationKeyDown = (event: React.KeyboardEvent<HTMLSpanElement>) => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                activateCitation();
              }
            };

            return (
              <sup className="reference-link" data-ref-id={refId}>
                <span
                  id={`cite-${refId}`}
                  role="link"
                  tabIndex={0}
                  onClick={handleCitationClick}
                  onKeyDown={handleCitationKeyDown}
                  className="text-primary hover:underline"
                >
                  {children}
                </span>
              </sup>
            );
          }

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
        {markdownToRender}
      </ReactMarkdown>
      <References references={references} lang={contentLang} />
    </div>
  );
}

export const MarkdownRenderer = React.memo(MarkdownRendererComponent);
MarkdownRenderer.displayName = 'MarkdownRenderer';
export default MarkdownRenderer;
