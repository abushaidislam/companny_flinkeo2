/**
 * Content type detection utilities
 * Separated from components to avoid fast refresh warnings
 */

/**
 * Detect if content is HTML or Markdown
 * HTML typically has tags like <p>, <div>, etc.
 * Markdown has patterns like # headings, **bold**, [links], etc.
 */
export function detectContentType(content: string): 'html' | 'markdown' {
  if (!content || typeof content !== 'string') return 'html';

  const trimmed = content.trim();

  // Check for obvious HTML tags (common ones used by TipTap)
  const htmlPattern = /<(p|div|h[1-6]|ul|ol|li|blockquote|pre|code|strong|em|a|img|br|hr)[^>]*>|<\/(p|div|h[1-6]|ul|ol|li|blockquote|pre|code|strong|em|a)[^>]*>/i;

  // Check for markdown patterns
  const markdownPattern = /(^|\n)#{1,6}\s|^\s*[-*+]\s|^\s*\d+\.\s|^\[.*?\]\(.*?\)|\[\^[^\]]+\]|^\[\^[^\]]+\]:\s|(?:\*\*.*?\*\*)|(?:__.*?__)|`[^`]+`|```|\|.*\|.*\|/m;

  // If it has markdown patterns, it's likely markdown (MDX often mixes markdown with tags)
  if (markdownPattern.test(trimmed)) {
    return 'markdown';
  }

  // Otherwise, if it looks like HTML, it's likely HTML
  if (htmlPattern.test(trimmed)) {
    return 'html';
  }

  // Default to HTML (safer for existing content)
  return 'html';
}

/**
 * Check if content looks like markdown (for UI toggles)
 */
export function isMarkdownContent(content: string): boolean {
  return detectContentType(content) === 'markdown';
}

/**
 * Simple markdown-to-html converter for basic needs
 * Uses regex-based conversion (not as robust as a full parser)
 */
export function markdownToHtml(markdown: string): string {
  if (!markdown) return '';

  const html = markdown
    // Escape HTML entities
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    // Headers
    .replace(/^### (.*$)/gim, '<h3>$1</h3>')
    .replace(/^## (.*$)/gim, '<h2>$1</h2>')
    .replace(/^# (.*$)/gim, '<h1>$1</h1>')
    // Bold and Italic
    .replace(/\*\*\*(.*?)\*\*\*/g, '<strong><em>$1</em></strong>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/___(.*?)___/g, '<strong><em>$1</em></strong>')
    .replace(/__(.*?)__/g, '<strong>$1</strong>')
    .replace(/_(.*?)_/g, '<em>$1</em>')
    // Code
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    // Strikethrough
    .replace(/~~(.*?)~~/g, '<del>$1</del>')
    // Links
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
    // Images
    .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" />')
    // Blockquotes
    .replace(/^> (.*$)/gim, '<blockquote>$1</blockquote>')
    // Horizontal rule
    .replace(/^---$/gm, '<hr />')
    // Line breaks
    .replace(/\n/g, '<br />');

  return html;
}
