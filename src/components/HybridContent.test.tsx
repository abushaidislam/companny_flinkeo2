import { render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { HybridContent } from '@/components/HybridContent';

const {
  destroyMock,
  chartConstructorMock,
  mermaidInitializeMock,
  mermaidRenderMock,
  renderMathMock,
} = vi.hoisted(() => {
  const destroy = vi.fn();
  return {
    destroyMock: destroy,
    chartConstructorMock: vi.fn().mockImplementation(() => ({
      destroy,
    })),
    mermaidInitializeMock: vi.fn(),
    mermaidRenderMock: vi.fn(async (_id: string, code: string) => ({
      svg: `<svg data-testid="mermaid-svg"><text>${code}</text></svg>`,
    })),
    renderMathMock: vi.fn(),
  };
});

vi.mock('chart.js/auto', () => ({
  default: chartConstructorMock,
}));

vi.mock('mermaid', () => ({
  default: {
    initialize: mermaidInitializeMock,
    render: mermaidRenderMock,
  },
}));

vi.mock('katex/contrib/auto-render', () => ({
  default: renderMathMock,
}));

describe('HybridContent special blocks', () => {
  beforeEach(() => {
    destroyMock.mockClear();
    chartConstructorMock.mockClear();
    mermaidInitializeMock.mockClear();
    mermaidRenderMock.mockClear();
    renderMathMock.mockClear();
  });

  it('renders markdown chart and mermaid fences as visual blocks', async () => {
    const content = [
      '```chart',
      '{',
      '  "title": "AI Impact on Developer Productivity",',
      '  "type": "bar",',
      '  "data": {',
      '    "labels": ["Code Completion"],',
      '    "datasets": [{ "label": "Time Saved (%)", "data": [55] }]',
      '  }',
      '}',
      '```',
      '',
      '```mermaid',
      'flowchart TD',
      '  A[Prompt] --> B[Diagram]',
      '```',
    ].join('\n');

    const { container } = render(<HybridContent content={content} />);

    expect(await screen.findByText('AI Impact on Developer Productivity')).toBeInTheDocument();

    await waitFor(() => {
      expect(chartConstructorMock).toHaveBeenCalledTimes(1);
      expect(mermaidRenderMock).toHaveBeenCalledTimes(1);
    });

    expect(container.querySelector('.blog-chart canvas')).not.toBeNull();
    expect(container.querySelector('.blog-mermaid svg')).not.toBeNull();
    await waitFor(() => {
      expect(container.querySelector('.blog-chart')).toHaveClass('is-visible');
      expect(container.querySelector('.blog-mermaid')).toHaveClass('is-visible');
    });
  });

  it('upgrades html code blocks into visual chart and mermaid output', async () => {
    const content = [
      '<pre><code class="language-chart">',
      '{&quot;title&quot;:&quot;HTML Chart&quot;,&quot;type&quot;:&quot;line&quot;,&quot;data&quot;:{&quot;labels&quot;:[&quot;Jan&quot;],&quot;datasets&quot;:[{&quot;label&quot;:&quot;Revenue&quot;,&quot;data&quot;:[10]}]}}',
      '</code></pre>',
      '<pre><code class="language-mermaid">flowchart TD\nA[HTML] --&gt; B[Diagram]</code></pre>',
    ].join('');

    const { container } = render(<HybridContent content={content} />);

    expect(await screen.findByText('HTML Chart')).toBeInTheDocument();

    await waitFor(() => {
      expect(chartConstructorMock).toHaveBeenCalledTimes(1);
      expect(mermaidRenderMock).toHaveBeenCalledTimes(1);
    });

    expect(container.querySelector('.blog-chart canvas')).not.toBeNull();
    expect(container.querySelector('.blog-mermaid svg')).not.toBeNull();
  });

  it('renders markdown references as citations instead of raw html text', async () => {
    const content = [
      'AI is happening now[^1].',
      '',
      '[^1]: Example reference',
    ].join('\n');

    const { container } = render(<HybridContent content={content} />);

    await screen.findByText('References');

    expect(container.textContent).not.toContain('<sup class=');
    expect(container.querySelector('#cite-1')).not.toBeNull();
    expect(container.querySelector('#ref-1')).not.toBeNull();
  });
});
