import { memo, useEffect, useMemo, useRef } from 'react';
import DOMPurify from 'dompurify';
import type { Chart, ChartData, ChartType } from 'chart.js';
import { loadChartJs, loadKatexAutoRender, loadMermaid } from '@/lib/blog-visuals';
import { MarkdownRenderer } from '@/lib/hybrid-renderer';
import { containsBengaliText, detectContentType, stripMarkdownFrontmatter } from '@/lib/content-utils';
import { generateReferencesHtml, hasReferences, parseReferences } from '@/lib/reference-parser';
import 'katex/dist/katex.min.css';

interface HybridContentProps {
  content: string;
  className?: string;
  onContentProcessed?: () => void;
}

type MermaidApi = Awaited<ReturnType<typeof loadMermaid>>;

function normalizeMermaidSource(raw: string): string {
  return raw.replace(/^mermaid\s+/i, '').replace(/\r\n/g, '\n').trim();
}

function looksNarrative(text: string): boolean {
  return (
    /\b[A-Z][a-z]{2,}\s+[a-z]{2,}\s+[a-z]{2,}/.test(text) ||
    /\b[a-z]{3,}\s+[a-z]{3,}\s+[a-z]{3,}/.test(text)
  );
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

async function renderMermaidWithRecovery(mermaid: MermaidApi, id: string, raw: string) {
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

function isChartCodeBlock(code: Element) {
  const className = (code as HTMLElement).className || '';
  const cls = className.toLowerCase();
  return cls.includes('language-chart') || cls.includes('lang-chart') || cls.includes('chart');
}

function isMermaidCodeBlock(code: Element) {
  const className = (code as HTMLElement).className || '';
  const cls = className.toLowerCase();
  const raw = ((code as HTMLElement).textContent || '').trim();
  const rawLower = raw.toLowerCase();

  const looksLikeMermaid =
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
    rawLower.startsWith('quadrantchart');

  const classLooksMermaid =
    cls.includes('language-mermaid') || cls.includes('lang-mermaid') || cls.includes('mermaid');

  const startsWithMermaidButMissingFenceLanguage =
    rawLower.startsWith('mermaid ') || rawLower === 'mermaid' || rawLower.startsWith('mermaid\n');

  return classLooksMermaid || looksLikeMermaid || startsWithMermaidButMissingFenceLanguage;
}

function isSvgCodeBlock(code: Element) {
  const className = (code as HTMLElement).className || '';
  const cls = className.toLowerCase();
  const raw = ((code as HTMLElement).textContent || '').trim();

  const classLooksSvg =
    cls.includes('language-html') ||
    cls.includes('lang-html') ||
    cls.includes('language-svg') ||
    cls.includes('lang-svg');

  return classLooksSvg && raw.startsWith('<svg') && raw.endsWith('</svg>');
}

function findVisualContainer(codeEl: HTMLElement) {
  const pre = codeEl.closest('pre') as HTMLElement | null;
  if (pre) {
    const wrapper = pre.closest('.markdown-code-block') as HTMLElement | null;
    return wrapper || pre;
  }

  return codeEl.closest('.my-4') as HTMLElement | null;
}

/**
 * HybridContent - Renders both HTML and Markdown content
 * Auto-detects content type and applies appropriate rendering
 * Includes support for: Math (KaTeX), Charts (Chart.js), Mermaid diagrams, Code highlighting
 */
function HybridContentComponent({
  content,
  className = '',
  onContentProcessed,
}: HybridContentProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const chartInstancesRef = useRef<Chart[]>([]);
  const isMountedRef = useRef(true);
  const normalizedContent = useMemo(() => stripMarkdownFrontmatter(content), [content]);
  const contentType = useMemo(() => detectContentType(normalizedContent), [normalizedContent]);
  const contentLang = useMemo(
    () => (containsBengaliText(normalizedContent) ? 'bn' : undefined),
    [normalizedContent],
  );

  useEffect(() => {
    isMountedRef.current = true;

    return () => {
      isMountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    if (!contentRef.current) return;

    const root = contentRef.current;
    const isMarkdownContent = contentType === 'markdown';
    let cancelled = false;
    let io: IntersectionObserver | null = null;
    let revealFallbackTimer: number | null = null;

    chartInstancesRef.current.forEach((chart) => chart.destroy());
    chartInstancesRef.current = [];

    const processContent = async () => {
      if (!isMarkdownContent) {
        try {
          const renderMathInElement = await loadKatexAutoRender();
          if (!cancelled) {
            renderMathInElement(root, {
              delimiters: [
                { left: '$$', right: '$$', display: true },
                { left: '\\[', right: '\\]', display: true },
                { left: '$', right: '$', display: false },
                { left: '\\(', right: '\\)', display: false },
              ],
              throwOnError: false,
            });
          }
        } catch (error) {
          console.error('KaTeX render error:', error);
        }

        const chartCodeBlocks = Array.from(root.querySelectorAll('code')).filter(isChartCodeBlock);
        const chartPreBlocks = Array.from(root.querySelectorAll('pre code')).filter(isChartCodeBlock);
        const chartBlocks = [...chartCodeBlocks, ...chartPreBlocks].filter(
          (code, index, self) => index === self.findIndex((candidate) => candidate === code),
        ) as HTMLElement[];

        if (chartBlocks.length > 0) {
          const ChartJs = await loadChartJs();
          if (!cancelled) {
            chartBlocks.forEach((codeEl, idx) => {
              const raw = (codeEl.textContent || '').trim();
              if (!raw) return;

              let spec: {
                title?: string;
                type?: string;
                data?: unknown;
                options?: { legend?: boolean } & Record<string, unknown>;
              };
              try {
                spec = JSON.parse(raw);
              } catch {
                return;
              }

              const containerToReplace = findVisualContainer(codeEl);
              if (!containerToReplace) return;

              const container = document.createElement('div');
              container.className = 'blog-chart blog-reveal is-visible';

              const header = document.createElement('div');
              header.className = 'blog-chart__header';
              header.textContent = spec.title || 'Chart';

              const canvasWrap = document.createElement('div');
              canvasWrap.className = 'blog-chart__canvas';

              const canvas = document.createElement('canvas');
              canvas.setAttribute(
                'aria-label',
                spec.title ? `Chart: ${spec.title}` : `Chart ${idx + 1}`,
              );
              canvasWrap.appendChild(canvas);

              container.appendChild(header);
              container.appendChild(canvasWrap);
              containerToReplace.parentNode?.replaceChild(container, containerToReplace);

              try {
                const chart = new ChartJs(canvas, {
                  type: (spec.type as ChartType) || 'line',
                  data: spec.data as ChartData,
                  options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    animation: { duration: 900, easing: 'easeOutQuart' },
                    plugins: {
                      legend: { display: (spec.options?.legend as boolean) !== false },
                      title: { display: false },
                      tooltip: { enabled: true },
                    },
                    ...((spec.options as Record<string, unknown>) || {}),
                  },
                });
                chartInstancesRef.current.push(chart);
              } catch (error) {
                console.error('Chart render error:', error);
              }
            });
          }
        }

        const mermaidBlocks = Array.from(root.querySelectorAll('code')).filter(isMermaidCodeBlock) as HTMLElement[];

        if (mermaidBlocks.length > 0) {
          const mermaid = await loadMermaid();
          if (!cancelled) {
            mermaid.initialize({
              startOnLoad: false,
              theme: document.documentElement.classList.contains('dark') ? 'dark' : 'default',
              securityLevel: 'loose',
            });

            mermaidBlocks.forEach((codeEl) => {
              const raw = (codeEl.textContent || '').trim();
              if (!raw) return;

              const containerToReplace = findVisualContainer(codeEl);
              if (!containerToReplace) return;

              const container = document.createElement('div');
              container.className = 'blog-mermaid blog-reveal is-visible';

              void renderMermaidWithRecovery(
                mermaid,
                `mermaid-${Math.random().toString(36).substring(2, 9)}`,
                raw,
              )
                .then(({ svg }) => {
                  if (!isMountedRef.current || cancelled) return;
                  container.innerHTML = `<div class="blog-mermaid__svg-wrap">${svg}</div>`;
                  containerToReplace.parentNode?.replaceChild(container, containerToReplace);
                })
                .catch((error) => {
                  if (!isMountedRef.current || cancelled) return;
                  console.error('Mermaid render error:', error);
                  container.innerHTML = '<div class="text-red-500">Failed to render diagram</div>';
                  containerToReplace.parentNode?.replaceChild(container, containerToReplace);
                });
            });
          }
        }

        const svgBlocks = Array.from(root.querySelectorAll('code')).filter(isSvgCodeBlock) as HTMLElement[];

        if (svgBlocks.length > 0 && !cancelled) {
          svgBlocks.forEach((codeEl) => {
            const raw = (codeEl.textContent || '').trim();
            if (!raw) return;

            const containerToReplace = findVisualContainer(codeEl);
            if (!containerToReplace) return;

            const container = document.createElement('div');
            container.className = 'blog-svg blog-reveal is-visible';

            const frame = document.createElement('div');
            frame.className = 'blog-svg__frame';
            frame.innerHTML = DOMPurify.sanitize(raw, {
              USE_PROFILES: { svg: true, svgFilters: true, html: false },
            });

            container.appendChild(frame);
            containerToReplace.parentNode?.replaceChild(container, containerToReplace);
          });
        }

        root.querySelectorAll('pre').forEach((pre) => {
          const preEl = pre as HTMLElement;
          if (preEl.closest('.blog-mermaid') || preEl.closest('.blog-chart') || preEl.closest('.blog-svg')) return;

          const code = preEl.querySelector('code');
          if (!code) return;

          const existingWrapper = preEl.closest('.markdown-code-block') as HTMLElement | null;
          if (
            preEl.querySelector('.copy-code-btn') ||
            existingWrapper?.querySelector('.copy-code-btn')
          ) {
            return;
          }

          const wrapper = existingWrapper || document.createElement('div');
          if (!existingWrapper) {
            wrapper.className = 'relative group';
            preEl.parentNode?.insertBefore(wrapper, preEl);
            wrapper.appendChild(preEl);
          }

          const btn = document.createElement('button');
          btn.className = 'copy-code-btn';
          btn.innerHTML =
            '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>';
          btn.setAttribute('aria-label', 'Copy code');
          btn.onclick = async () => {
            const text = code.textContent || '';
            try {
              await navigator.clipboard.writeText(text);
              btn.innerHTML =
                '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>';
              btn.classList.add('copied');
              setTimeout(() => {
                btn.innerHTML =
                  '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>';
                btn.classList.remove('copied');
              }, 2000);
            } catch (error) {
              console.error('Failed to copy:', error);
            }
          };

          wrapper.appendChild(btn);
        });

        root.querySelectorAll('a[href*="youtube.com"], a[href*="youtu.be"]').forEach((link) => {
          const href = (link as HTMLAnchorElement).getAttribute('href') || '';
          const match = href.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
          if (!match) return;

          const videoId = match[1];
          const iframe = document.createElement('iframe');
          iframe.src = `https://www.youtube.com/embed/${videoId}`;
          iframe.className = 'blog-youtube';
          iframe.setAttribute('frameborder', '0');
          iframe.setAttribute(
            'allow',
            'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture',
          );
          iframe.setAttribute('allowfullscreen', '');
          iframe.setAttribute('title', 'YouTube video');

          const wrapper = document.createElement('div');
          wrapper.className = 'blog-video-wrapper blog-reveal';
          wrapper.appendChild(iframe);

          link.parentNode?.replaceChild(wrapper, link);
        });
      }

      const prefersReducedMotion = window.matchMedia?.(
        '(prefers-reduced-motion: reduce)',
      ).matches;
      if (!prefersReducedMotion) {
        const targets = Array.from(root.querySelectorAll('.blog-reveal')) as HTMLElement[];
        const observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                (entry.target as HTMLElement).classList.add('is-visible');
                observer.unobserve(entry.target);
              }
            });
          },
          { root: null, threshold: 0.12, rootMargin: '0px 0px -10% 0px' },
        );
        io = observer;

        targets.forEach((target) => observer.observe(target));
        revealFallbackTimer = window.setTimeout(() => {
          targets.forEach((target) => target.classList.add('is-visible'));
        }, 250);
      }

      onContentProcessed?.();
    };

    void processContent();

    return () => {
      cancelled = true;
      io?.disconnect();
      if (revealFallbackTimer !== null) {
        window.clearTimeout(revealFallbackTimer);
      }
      chartInstancesRef.current.forEach((chart) => chart.destroy());
    };
  }, [normalizedContent, contentType, onContentProcessed]);

  if (contentType === 'markdown') {
    return (
      <div
        ref={contentRef}
        className={`blog-content markdown-content ${className}`}
        lang={contentLang}
      >
        <MarkdownRenderer content={normalizedContent} />
      </div>
    );
  }

  let htmlContent = normalizedContent;
  if (hasReferences(normalizedContent)) {
    const parsed = parseReferences(normalizedContent);
    htmlContent = parsed.content + generateReferencesHtml(parsed.references);
  }
  const sanitized = DOMPurify.sanitize(htmlContent);

  return (
    <div
      ref={contentRef}
      className={`blog-content ${className}`}
      lang={contentLang}
      dangerouslySetInnerHTML={{ __html: sanitized }}
    />
  );
}

export const HybridContent = memo(HybridContentComponent);
HybridContent.displayName = 'HybridContent';
export default HybridContent;
