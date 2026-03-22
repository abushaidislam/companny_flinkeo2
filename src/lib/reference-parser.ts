/**
 * MDX-style reference/footnote parser
 * Supports [^1], [^note-id] style inline citations
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

/**
 * Parse content for MDX-style references
 * Format: [^id] inline, [^id]: content for definition
 * Returns processed markdown with clickable links and extracted references
 */
export function parseReferences(content: string): ParsedContent {
  const references: Reference[] = [];
  let index = 1;

  // Find reference definitions: [^id]: content
  const refDefRegex = /^\[\^([^\]]+)\]:\s*(.+)$/gm;
  const definitions = new Map<string, string>();
  let defMatch: RegExpExecArray | null;

  while ((defMatch = refDefRegex.exec(content)) !== null) {
    const id = defMatch[1];
    const refContent = defMatch[2].trim();
    definitions.set(id, refContent);
  }

  // Remove definition lines from content
  let processedContent = content.replace(/^\[\^([^\]]+)\]:\s*(.+)$/gm, '');
  processedContent = processedContent.replace(/\n{3,}/g, '\n\n');

  // Find inline references: [^id]
  const inlineRefRegex = /\[\^([^\]]+)\]/g;
  const inlineMatches = [...processedContent.matchAll(inlineRefRegex)];
  const uniqueIds = new Set<string>();

  inlineMatches.forEach((match) => {
    const id = match[1];
    if (!uniqueIds.has(id)) {
      uniqueIds.add(id);
      const refContent = definitions.get(id) || 'Reference not defined';
      references.push({ id, index: index++, content: refContent });
    }
  });

  // Replace inline references with markdown links.
  // The markdown renderer upgrades these anchors into superscript citations.
  processedContent = processedContent.replace(inlineRefRegex, (_match, id) => {
    const ref = references.find((item) => item.id === id);
    const refIndex = ref?.index || 0;
    return `[${refIndex}](#ref-${id})`;
  });

  return { content: processedContent, references };
}

/**
 * Check if content contains MDX-style references
 */
export function hasReferences(content: string): boolean {
  return /\[\^[^\]]+\]/.test(content);
}

/**
 * Generate HTML for references section
 */
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
