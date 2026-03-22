import { describe, expect, it } from 'vitest';
import { parseReferences } from '@/lib/reference-parser';

describe('parseReferences', () => {
  it('parses OpenAI export citations and removes raw markers from Bangla content', () => {
    const content = [
      'বাংলাদেশে জলবায়ু ঝুঁকি বাড়ছে। citeturn40view0turn34view0',
      '',
      'মূল রেফারেন্স (নির্বাচিত)',
      '',
      'entity["organization","World Bank"] World Bank report. citeturn40view0',
      'সরকারি নীতি প্রতিবেদন। citeturn34view0',
    ].join('\n');

    const parsed = parseReferences(content);

    expect(parsed.content).not.toContain('cite');
    expect(parsed.content).not.toContain('entity');
    expect(parsed.content).toContain('[1](#ref-turn40view0)[2](#ref-turn34view0)');
    expect(parsed.content).not.toContain('মূল রেফারেন্স');
    expect(parsed.references).toEqual([
      { id: 'turn40view0', index: 1, content: 'World Bank report.' },
      { id: 'turn34view0', index: 2, content: 'সরকারি নীতি প্রতিবেদন।' },
    ]);
  });

  it('extracts reference definitions from html-wrapped export content', () => {
    const content = [
      '<p>বাংলাদেশে জলবায়ু ঝুঁকি বাড়ছে। citeturn40view0</p>',
      '<h2>মূল রেফারেন্স (নির্বাচিত)</h2>',
      '<p>entity["organization","World Bank"] World Bank report. citeturn40view0</p>',
    ].join('');

    const parsed = parseReferences(content);

    expect(parsed.content).toContain('[1](#ref-turn40view0)');
    expect(parsed.references).toEqual([
      { id: 'turn40view0', index: 1, content: 'World Bank report.' },
    ]);
  });

  it('falls back to citation context when the export omits a source definition', () => {
    const content = [
      'বাংলাদেশে দীর্ঘমেয়াদি পর্যবেক্ষণে উষ্ণতা বৃদ্ধির সংকেত স্পষ্ট। citeturn40view0',
      '',
      'মূল রেফারেন্স (নির্বাচিত)',
      '',
      '- World Bank. *Country Climate and Development Report—Executive Summary: Bangladesh (2022).* citeturn34view0',
    ].join('\n');

    const parsed = parseReferences(content);

    expect(parsed.references).toEqual([
      {
        id: 'turn40view0',
        index: 1,
        content: 'বাংলাদেশে দীর্ঘমেয়াদি পর্যবেক্ষণে উষ্ণতা বৃদ্ধির সংকেত স্পষ্ট।',
      },
    ]);
  });

  it('preserves entity names from export reference bullets', () => {
    const content = [
      'নীতিগতভাবে বাংলাদেশ একটি জাতীয় কৌশল প্রণয়ন করেছে। citeturn51view0',
      '',
      'মূল রেফারেন্স (নির্বাচিত)',
      '',
      '- entity["organization","Ministry of Disaster Management and Relief","bangladesh"] (GoB). *National Strategy on Internal Displacement Management (2021).* citeturn51view0',
    ].join('\n');

    const parsed = parseReferences(content);

    expect(parsed.references).toEqual([
      {
        id: 'turn51view0',
        index: 1,
        content: 'Ministry of Disaster Management and Relief (GoB). National Strategy on Internal Displacement Management (2021).',
      },
    ]);
  });
});
