/**
 * Reference parser
 * Supports:
 * - MDX footnotes: [^1], [^note-id]
 * - OpenAI export citations: citeturn40view0turn34view0
 */

export interface Reference {
  id: string;
  index: number;
  content: string;
}

export interface ParsedContent {
  content: string;
  references: Reference[];
}

const FOOTNOTE_DEF_REGEX = /^\[\^([^\]]+)\]:\s*(.+)$/gm;
const FOOTNOTE_INLINE_REGEX = /\[\^([^\]]+)\]/g;
const OPENAI_CITE_REGEX = /cite([^]+)/g;
const OPENAI_ENTITY_REGEX = /entity(.*?)/g;
const REFERENCES_HEADING_REGEX = /^\s{0,3}(?:#{1,6}\s*)?(?:মূল রেফারেন্স(?:\s*\(.*?\))?|রেফারেন্স|references)\s*$/i;

function stripHtmlTags(value: string): string {
  return value
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/(p|div|li|h[1-6])>/gi, '\n')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .trim();
}

function stripMarkdownFormatting(value: string): string {
  return value
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/[*_`~]+/g, '')
    .replace(/^\s{0,3}>\s?/gm, '')
    .replace(/^\s{0,3}#{1,6}\s+/gm, '')
    .replace(/\\([\\`*_{}[\]()#+\-.!])/g, '$1');
}

function normalizeWhitespace(value: string): string {
  return value
    .replace(/\s+/g, ' ')
    .replace(/\s+([,.;:!?])/g, '$1')
    .replace(/([(/])\s+/g, '$1')
    .replace(/\s+([/)])/g, '$1')
    .trim();
}

function parseEntityLabel(payload: string): string {
  try {
    const parsed = JSON.parse(payload) as unknown;

    if (Array.isArray(parsed)) {
      const preferred = parsed.find(
        (value, index) => index > 0 && typeof value === 'string' && value.trim()
      );

      if (typeof preferred === 'string') {
        return preferred.trim();
      }
    }
  } catch {
    // Fall through to lightweight string extraction.
  }

  const quotedStrings = [...payload.matchAll(/"([^"]+)"/g)]
    .map((match) => match[1].trim())
    .filter(Boolean);

  return quotedStrings[1] || quotedStrings[0] || '';
}

function extractEntityLabels(line: string): string[] {
  const labels = [...line.matchAll(OPENAI_ENTITY_REGEX)]
    .map((match) => parseEntityLabel(match[1]))
    .filter(Boolean);

  return [...new Set(labels)];
}

function cleanReferenceLine(line: string): string {
  const entityLabels = extractEntityLabels(line);
  const cleanedBody = normalizeWhitespace(
    stripMarkdownFormatting(
      stripHtmlTags(
        line
          .replace(OPENAI_ENTITY_REGEX, '')
          .replace(OPENAI_CITE_REGEX, '')
          .replace(/^[-*+]\s+/, '')
          .replace(/^\d+\.\s+/, '')
      )
    ).replace(/^[./,:;\-–]+\s*/, '')
  );

  if (entityLabels.length === 0) {
    return cleanedBody;
  }

  const entityPrefix = entityLabels.join(' / ');
  const lowerBody = cleanedBody.toLowerCase();
  const lowerPrefix = entityPrefix.toLowerCase();

  if (lowerBody.startsWith(lowerPrefix)) {
    return cleanedBody;
  }

  return normalizeWhitespace(`${entityPrefix} ${cleanedBody}`);
}

function cleanContextLine(line: string): string {
  return normalizeWhitespace(
    stripMarkdownFormatting(
      stripHtmlTags(
        line
          .replace(OPENAI_ENTITY_REGEX, '')
          .replace(OPENAI_CITE_REGEX, '')
          .replace(/^\s*\|/, '')
          .replace(/\|\s*$/g, '')
          .replace(/\|/g, ' | ')
      )
    )
      .replace(/^[-*+]\s+/, '')
      .replace(/^\d+\.\s+/, '')
  );
}

function truncateLabel(value: string, maxLength = 180): string {
  if (value.length <= maxLength) {
    return value;
  }

  const truncated = value.slice(0, maxLength);
  const lastSpace = truncated.lastIndexOf(' ');
  const safeCutoff = lastSpace > maxLength * 0.6 ? lastSpace : maxLength;
  return `${truncated.slice(0, safeCutoff).trim()}...`;
}

function fallbackReferenceContent(id: string, contextDefinitions: Map<string, string>): string {
  return contextDefinitions.get(id) || `Cited source (${id})`;
}

function splitCitationIds(rawIds: string): string[] {
  return rawIds
    .split('')
    .map((id) => id.trim())
    .filter(Boolean);
}

/**
 * Parse content references and return cleaned markdown plus extracted references.
 */
export function parseReferences(content: string): ParsedContent {
  FOOTNOTE_DEF_REGEX.lastIndex = 0;
  FOOTNOTE_INLINE_REGEX.lastIndex = 0;
  OPENAI_CITE_REGEX.lastIndex = 0;
  OPENAI_ENTITY_REGEX.lastIndex = 0;

  const references: Reference[] = [];
  const definitions = new Map<string, string>();
  const contextDefinitions = new Map<string, string>();
  const uniqueIds = new Set<string>();
  let index = 1;
  let defMatch: RegExpExecArray | null;

  while ((defMatch = FOOTNOTE_DEF_REGEX.exec(content)) !== null) {
    const id = defMatch[1];
    const refContent = defMatch[2].trim();
    definitions.set(id, refContent);
  }

  let processedContent = content.replace(FOOTNOTE_DEF_REGEX, '');
  processedContent = processedContent
    .replace(/<(p|div|li|h[1-6])\b[^>]*>/gi, '\n$&')
    .replace(/<\/(p|div|li|h[1-6])>/gi, '$&\n');

  const lines = processedContent.split(/\r?\n/);
  const keptLines: string[] = [];
  let inExportReferencesSection = false;
  let extractedExportReferences = 0;

  for (const line of lines) {
    const plainLine = stripHtmlTags(line).replace(/\s+/g, ' ').trim();

    if (REFERENCES_HEADING_REGEX.test(plainLine)) {
      inExportReferencesSection = true;
      continue;
    }

    if (inExportReferencesSection) {
      const citeMatches = [...line.matchAll(OPENAI_CITE_REGEX)];

      if (citeMatches.length > 0) {
        const cleanedLine = cleanReferenceLine(line);
        citeMatches.forEach((match) => {
          splitCitationIds(match[1]).forEach((id) => {
            if (!definitions.has(id) && cleanedLine) {
              definitions.set(id, cleanedLine);
            }
          });
        });
        extractedExportReferences += 1;
        continue;
      }

      if (!plainLine) {
        continue;
      }

      if ((/^\s{0,3}#{1,6}\s+/.test(line) || /^<h[1-6][^>]*>/i.test(line)) && extractedExportReferences > 0) {
        inExportReferencesSection = false;
      } else if (extractedExportReferences > 0) {
        continue;
      }
    }

    const inlineCiteMatches = [...line.matchAll(OPENAI_CITE_REGEX)];
    if (inlineCiteMatches.length > 0) {
      const contextLabel = truncateLabel(cleanContextLine(line));
      inlineCiteMatches.forEach((match) => {
        splitCitationIds(match[1]).forEach((id) => {
          if (!definitions.has(id) && contextLabel) {
            const existing = contextDefinitions.get(id);
            if (!existing || contextLabel.length < existing.length) {
              contextDefinitions.set(id, contextLabel);
            }
          }
        });
      });
    }

    keptLines.push(line);
  }

  processedContent = keptLines.join('\n');
  processedContent = processedContent.replace(OPENAI_ENTITY_REGEX, '');
  processedContent = processedContent.replace(/\n{3,}/g, '\n\n');

  const inlineFootnotes = [...processedContent.matchAll(FOOTNOTE_INLINE_REGEX)];

  inlineFootnotes.forEach((match) => {
    const id = match[1];
    if (!uniqueIds.has(id)) {
      uniqueIds.add(id);
      references.push({
        id,
        index: index++,
        content: definitions.get(id) || fallbackReferenceContent(id, contextDefinitions),
      });
    }
  });

  processedContent = processedContent.replace(FOOTNOTE_INLINE_REGEX, (_match, id) => {
    const ref = references.find((item) => item.id === id);
    return `[${ref?.index || 0}](#ref-${id})`;
  });

  processedContent = processedContent.replace(OPENAI_CITE_REGEX, (_match, rawIds) => {
    const ids = splitCitationIds(rawIds);
    const links = ids.map((id) => {
      if (!uniqueIds.has(id)) {
        uniqueIds.add(id);
        references.push({
          id,
          index: index++,
          content: definitions.get(id) || fallbackReferenceContent(id, contextDefinitions),
        });
      }

      const ref = references.find((item) => item.id === id);
      return `[${ref?.index || 0}](#ref-${id})`;
    });

    return links.join('');
  });

  processedContent = processedContent.replace(/\n{3,}/g, '\n\n').trim();

  return { content: processedContent, references };
}

export function hasReferences(content: string): boolean {
  FOOTNOTE_INLINE_REGEX.lastIndex = 0;
  OPENAI_CITE_REGEX.lastIndex = 0;

  return FOOTNOTE_INLINE_REGEX.test(content) || OPENAI_CITE_REGEX.test(content);
}

export function generateReferencesHtml(references: Reference[]): string {
  if (references.length === 0) return '';

  const items = references
    .map(
      (ref) => `
    <li id="ref-${ref.id}" class="reference-item">
      <span class="reference-number">[${ref.index}]</span>
      <span class="reference-content">${ref.content}</span>
      <a href="#cite-${ref.id}" class="reference-backlink">↩</a>
    </li>
  `
    )
    .join('');

  return `
    <div class="references-section">
      <h3 class="references-title">References</h3>
      <ol class="references-list">
        ${items}
      </ol>
    </div>
  `;
}
