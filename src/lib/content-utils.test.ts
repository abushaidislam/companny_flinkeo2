import { describe, expect, it } from 'vitest';
import { containsBengaliText, normalizeBlogDetailContent } from '@/lib/content-utils';

describe('normalizeBlogDetailContent', () => {
  it('removes a duplicated leading markdown h1 that matches the blog headline', () => {
    const content = [
      '# The AI Revolution',
      '',
      'Intro paragraph.',
      '',
      '## Section',
      'More text.',
    ].join('\n');

    expect(normalizeBlogDetailContent(content, 'The AI Revolution')).toBe([
      'Intro paragraph.',
      '',
      '## Section',
      'More text.',
    ].join('\n'));
  });

  it('keeps the content intact when the leading markdown h1 differs from the headline', () => {
    const content = [
      '# Another Title',
      '',
      'Intro paragraph.',
    ].join('\n');

    expect(normalizeBlogDetailContent(content, 'The AI Revolution')).toBe(content);
  });

  it('removes a duplicated leading html h1 that matches the blog headline', () => {
    const content = '<h1>The AI Revolution</h1><p>Intro paragraph.</p>';

    expect(normalizeBlogDetailContent(content, 'The AI Revolution')).toBe('<p>Intro paragraph.</p>');
  });
});

describe('containsBengaliText', () => {
  it('detects Bengali script in mixed content', () => {
    expect(containsBengaliText('Diagram: বাংলা')).toBe(true);
    expect(containsBengaliText('Diagram: English')).toBe(false);
  });
});
