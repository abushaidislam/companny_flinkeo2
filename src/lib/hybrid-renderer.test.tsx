import { render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { MarkdownRenderer } from '@/lib/hybrid-renderer';

const { mermaidInitializeMock, mermaidRenderMock } = vi.hoisted(() => ({
  mermaidInitializeMock: vi.fn(),
  mermaidRenderMock: vi.fn(),
}));

vi.mock('mermaid', () => ({
  default: {
    initialize: mermaidInitializeMock,
    render: mermaidRenderMock,
  },
}));

describe('MarkdownRenderer mermaid recovery', () => {
  beforeEach(() => {
    mermaidInitializeMock.mockClear();
    mermaidRenderMock.mockReset();
    mermaidRenderMock.mockImplementation(async (_id: string, code: string) => {
      if (code.includes('The diagram above shows')) {
        throw new Error('Parse error');
      }

      return {
        svg: `<svg data-testid="mermaid-svg"><text>${code}</text></svg>`,
      };
    });
  });

  it('recovers when trailing prose is captured inside a mermaid fence', async () => {
    const content = [
      '```mermaid',
      'flowchart TD',
      '  A[Traditional Jobs] --> B{AI Impact Level}',
      '  B -->|High| C[Task Automation]',
      '  C --> D[Role Redefinition]',
      '  D --> E[New Job Categories]',
      'The diagram above shows how AI changes roles instead of simply deleting them.',
    ].join('\n');

    const { container } = render(<MarkdownRenderer content={content} />);

    await waitFor(() => {
      expect(mermaidRenderMock).toHaveBeenCalledTimes(2);
    });

    expect(await screen.findByTestId('mermaid-svg')).toBeInTheDocument();
    expect(container.querySelector('.text-red-500')).toBeNull();
    expect(mermaidRenderMock.mock.calls[0]?.[1]).toContain('The diagram above shows');
    expect(mermaidRenderMock.mock.calls[1]?.[1]).not.toContain('The diagram above shows');
    expect(mermaidRenderMock.mock.calls[1]?.[1]).toContain('D --> E[New Job Categories]');
  });

  it('renders inline svg markup as actual content instead of escaped text', () => {
    const content = [
      'Before diagram.',
      '',
      '<svg viewBox="0 0 100 40" xmlns="http://www.w3.org/2000/svg">',
      '  <rect x="10" y="10" width="80" height="20" rx="6"></rect>',
      '</svg>',
    ].join('\n');

    const { container } = render(<MarkdownRenderer content={content} />);

    expect(container.querySelector('svg')).not.toBeNull();
    expect(container.querySelector('rect')).not.toBeNull();
  });

  it('renders fenced html svg blocks as visual svg output', () => {
    const content = [
      '```html',
      '<svg viewBox="0 0 120 40" xmlns="http://www.w3.org/2000/svg">',
      '  <rect x="10" y="10" width="100" height="20" rx="8"></rect>',
      '</svg>',
      '```',
    ].join('\n');

    const { container } = render(<MarkdownRenderer content={content} />);

    expect(container.querySelector('.blog-svg')).not.toBeNull();
    expect(container.querySelector('.blog-svg svg')).not.toBeNull();
  });

  it('renders markdown math expressions with katex markup', () => {
    const content = [
      'Inline math $E = mc^2$ appears in a sentence.',
      '',
      '$$',
      'y = mx + c',
      '$$',
    ].join('\n');

    const { container } = render(<MarkdownRenderer content={content} />);

    expect(container.querySelector('.katex')).not.toBeNull();
    expect(container.textContent).toContain('Inline math');
    expect(container.textContent).toContain('y = mx + c');
  });
});
