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
});
