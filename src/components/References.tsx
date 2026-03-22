import type { Reference } from '@/lib/reference-parser';

interface ReferencesProps {
  references: Reference[];
}

export function References({ references }: ReferencesProps) {
  if (references.length === 0) return null;

  const handleBacklinkClick = (e: React.MouseEvent<HTMLAnchorElement>, citeId: string) => {
    e.preventDefault();
    const element = document.getElementById(citeId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      element.classList.add('reference-highlight');
      setTimeout(() => element.classList.remove('reference-highlight'), 2000);
    }
  };

  return (
    <div className="references-section mt-12 pt-8 border-t border-border">
      <h3 className="references-title text-lg font-semibold mb-4 text-foreground">
        References
      </h3>
      <ol className="references-list space-y-2">
        {references.map((ref) => (
          <li
            key={ref.id}
            id={`ref-${ref.id}`}
            className="reference-item flex items-start gap-2 text-sm text-muted-foreground"
          >
            <span className="reference-number font-medium text-foreground shrink-0">
              [{ref.index}]
            </span>
            <span className="reference-content flex-1">{ref.content}</span>
            <a
              href={`#cite-${ref.id}`}
              onClick={(e) => handleBacklinkClick(e, `cite-${ref.id}`)}
              className="reference-backlink text-primary hover:underline text-xs shrink-0"
              aria-label="Back to citation"
            >
              ↩
            </a>
          </li>
        ))}
      </ol>
    </div>
  );
}

export default References;
