import { useEffect, useMemo, useRef } from 'react';
import DOMPurify from 'dompurify';
import { MarkdownRenderer } from '@/lib/hybrid-renderer';
import { detectContentType } from '@/lib/content-utils';
import { parseReferences, hasReferences, generateReferencesHtml } from '@/lib/reference-parser';
import renderMathInElement from 'katex/contrib/auto-render';
import 'katex/dist/katex.min.css';
import Chart from 'chart.js/auto';
import type { ChartData, ChartType } from 'chart.js';
import mermaid from 'mermaid';

interface HybridContentProps {
  content: string;
  className?: string;
  onContentProcessed?: () => void;
}

/**
 * HybridContent - Renders both HTML and Markdown content
 * Auto-detects content type and applies appropriate rendering
 * Includes support for: Math (KaTeX), Charts (Chart.js), Mermaid diagrams, Code highlighting
 */
export function HybridContent({ content, className = '', onContentProcessed }: HybridContentProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const chartInstancesRef = useRef<Chart[]>([]);
  const isMountedRef = useRef(true);
  const contentType = useMemo(() => detectContentType(content), [content]);

  useEffect(() => {
    isMountedRef.current = true;

    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // Process HTML content (charts, mermaid, math, etc.)
  useEffect(() => {
    if (!contentRef.current) return;

    const root = contentRef.current;
    const isMarkdownContent = contentType === 'markdown';

    // Cleanup previous charts
    chartInstancesRef.current.forEach((c) => c.destroy());
    chartInstancesRef.current = [];

    if (!isMarkdownContent) {
      // 1) Math rendering
      try {
        renderMathInElement(root, {
          delimiters: [
            { left: '$$', right: '$$', display: true },
            { left: '\\[', right: '\\]', display: true },
            { left: '$', right: '$', display: false },
            { left: '\\(', right: '\\)', display: false },
          ],
          throwOnError: false,
        });
      } catch (e) {
        console.error('KaTeX render error:', e);
      }

      // 2) Charts
      const chartCodeBlocks = Array.from(root.querySelectorAll('code')).filter((code) => {
        const className = (code as HTMLElement).className || '';
        const cls = className.toLowerCase();
        return cls.includes('language-chart') || cls.includes('lang-chart') || cls.includes('chart');
      }) as HTMLElement[];

      const chartPreBlocks = Array.from(root.querySelectorAll('pre code')).filter((code) => {
        const className = (code as HTMLElement).className || '';
        const cls = className.toLowerCase();
        return cls.includes('language-chart') || cls.includes('lang-chart') || cls.includes('chart');
      }) as HTMLElement[];

      const allChartBlocks = [...chartCodeBlocks, ...chartPreBlocks];
      const chartBlocks = allChartBlocks.filter((code, index, self) =>
        index === self.findIndex((candidate) => candidate === code)
      );

      chartBlocks.forEach((codeEl, idx) => {
        const raw = (codeEl.textContent || '').trim();
        if (!raw) return;

        let spec: { title?: string; type?: string; data?: unknown; options?: { legend?: boolean } & Record<string, unknown> };
        try {
          spec = JSON.parse(raw);
        } catch {
          return;
        }

        let containerToReplace: HTMLElement | null = null;
        const pre = codeEl.closest('pre') as HTMLElement | null;
        if (pre) {
          const wrapper = pre.closest('.markdown-code-block') as HTMLElement | null;
          containerToReplace = wrapper || pre;
        } else {
          const my4Div = codeEl.closest('.my-4') as HTMLElement | null;
          if (my4Div) {
            containerToReplace = my4Div;
          }
        }

        if (!containerToReplace) return;

        const container = document.createElement('div');
        container.className = 'blog-chart blog-reveal';

        const header = document.createElement('div');
        header.className = 'blog-chart__header';
        header.textContent = spec?.title || 'Chart';

        const canvasWrap = document.createElement('div');
        canvasWrap.className = 'blog-chart__canvas';

        const canvas = document.createElement('canvas');
        canvas.setAttribute('aria-label', spec?.title ? `Chart: ${spec.title}` : `Chart ${idx + 1}`);
        canvasWrap.appendChild(canvas);

        container.appendChild(header);
        container.appendChild(canvasWrap);

        containerToReplace.parentNode?.replaceChild(container, containerToReplace);

        try {
          const chart = new Chart(canvas, {
            type: (spec.type as ChartType) || 'line',
            data: spec.data as ChartData,
            options: {
              responsive: true,
              maintainAspectRatio: false,
              animation: { duration: 900, easing: 'easeOutQuart' },
              plugins: {
                legend: { display: (spec?.options?.legend as boolean) !== false },
                title: { display: false },
                tooltip: { enabled: true },
              },
              ...(spec.options as Record<string, unknown> || {}),
            },
          });
          chartInstancesRef.current.push(chart);
        } catch (e) {
          console.error('Chart render error:', e);
        }
      });

      // 3) Mermaid diagrams
      const mermaidBlocks = Array.from(root.querySelectorAll('code')).filter((code) => {
        const className = (code as HTMLElement).className || '';
        const cls = className.toLowerCase();

        const raw = (code.textContent || '').trim();
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
      }) as HTMLElement[];

      if (mermaidBlocks.length > 0) {
        mermaid.initialize({
          startOnLoad: false,
          theme: document.documentElement.classList.contains('dark') ? 'dark' : 'default',
          securityLevel: 'loose',
        });

        mermaidBlocks.forEach((codeEl) => {
          const raw = (codeEl.textContent || '').trim();
          if (!raw) return;

          const cleanedRaw = raw.replace(/^mermaid\s+/i, '').trim();

          let containerToReplace: HTMLElement | null = null;
          const pre = codeEl.closest('pre') as HTMLElement | null;
          if (pre) {
            const wrapper = pre.closest('.markdown-code-block') as HTMLElement | null;
            containerToReplace = wrapper || pre;
          } else {
            const my4Div = codeEl.closest('.my-4') as HTMLElement | null;
            if (my4Div) {
              containerToReplace = my4Div;
            }
          }

          if (!containerToReplace) return;

          const container = document.createElement('div');
          container.className = 'blog-mermaid blog-reveal';

          const id = `mermaid-${Math.random().toString(36).substring(2, 9)}`;

          try {
            mermaid.render(id, cleanedRaw).then(({ svg }) => {
              if (!isMountedRef.current) return;
              container.innerHTML = svg;
              containerToReplace?.parentNode?.replaceChild(container, containerToReplace);
            }).catch((err) => {
              if (!isMountedRef.current) return;
              console.error('Mermaid render error:', err);
              container.innerHTML = `<div class="text-red-500">Failed to render diagram</div>`;
              containerToReplace?.parentNode?.replaceChild(container, containerToReplace);
            });
          } catch (e) {
            console.error('Mermaid error:', e);
          }
        });
      }

      // 4) Copy code buttons
      root.querySelectorAll('pre').forEach((pre) => {
        const preEl = pre as HTMLElement;
        if (preEl.closest('.blog-mermaid') || preEl.closest('.blog-chart')) return;

        const code = preEl.querySelector('code');
        if (!code) return;
        const existingWrapper = preEl.closest('.markdown-code-block') as HTMLElement | null;
        if (preEl.querySelector('.copy-code-btn') || existingWrapper?.querySelector('.copy-code-btn')) return;

        const wrapper = existingWrapper || document.createElement('div');

        if (!existingWrapper) {
          wrapper.className = 'relative group';
          preEl.parentNode?.insertBefore(wrapper, preEl);
          wrapper.appendChild(preEl);
        }

        const btn = document.createElement('button');
        btn.className = 'copy-code-btn';
        btn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>`;
        btn.setAttribute('aria-label', 'Copy code');
        btn.onclick = async () => {
          const text = code.textContent || '';
          try {
            await navigator.clipboard.writeText(text);
            btn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>`;
            btn.classList.add('copied');
            setTimeout(() => {
              btn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>`;
              btn.classList.remove('copied');
            }, 2000);
          } catch (err) {
            console.error('Failed to copy:', err);
          }
        };

        wrapper.appendChild(btn);
      });

      // 5) YouTube embeds
      root.querySelectorAll('a[href*="youtube.com"], a[href*="youtu.be"]').forEach((link) => {
        const href = (link as HTMLAnchorElement).getAttribute('href') || '';
        const match = href.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
        if (!match) return;

        const videoId = match[1];
        const iframe = document.createElement('iframe');
        iframe.src = `https://www.youtube.com/embed/${videoId}`;
        iframe.className = 'blog-youtube';
        iframe.setAttribute('frameborder', '0');
        iframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture');
        iframe.setAttribute('allowfullscreen', '');
        iframe.setAttribute('title', 'YouTube video');

        const wrapper = document.createElement('div');
        wrapper.className = 'blog-video-wrapper blog-reveal';
        wrapper.appendChild(iframe);

        link.parentNode?.replaceChild(wrapper, link);
      });
    }

    // 6) Scroll reveal animations
    const prefersReducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    let io: IntersectionObserver | null = null;
    let revealFallbackTimer: number | null = null;
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
        { root: null, threshold: 0.12, rootMargin: '0px 0px -10% 0px' }
      );
      io = observer;

      targets.forEach((t) => observer.observe(t));

      // Fallback so diagrams/charts never stay invisible if the observer misses.
      revealFallbackTimer = window.setTimeout(() => {
        targets.forEach((t) => t.classList.add('is-visible'));
      }, 250);
    }

    // Notify parent that content is processed
    onContentProcessed?.();

    return () => {
      io?.disconnect();
      if (revealFallbackTimer !== null) {
        window.clearTimeout(revealFallbackTimer);
      }
      chartInstancesRef.current.forEach((c) => c.destroy());
    };
  }, [content, contentType, onContentProcessed]);

  // For Markdown content
  if (contentType === 'markdown') {
    return (
      <div ref={contentRef} className={`blog-content markdown-content ${className}`}>
        <MarkdownRenderer content={content} />
      </div>
    );
  }

  // For HTML content - process references and use DOMPurify
  let htmlContent = content;
  if (hasReferences(content)) {
    const parsed = parseReferences(content);
    htmlContent = parsed.content + generateReferencesHtml(parsed.references);
  }
  const sanitized = DOMPurify.sanitize(htmlContent);

  return (
    <div
      ref={contentRef}
      className={`blog-content ${className}`}
      dangerouslySetInnerHTML={{ __html: sanitized }}
    />
  );
}

export default HybridContent;
