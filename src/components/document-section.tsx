// DocumentSection.tsx
// A reusable section component with a title, content, and optional footer. Used for layout consistency.

interface DocumentSectionProps {
  title: string; // Section title
  children: React.ReactNode; // Main content of the section
  footer?: string; // Optional footer text
  className?: string; // Optional additional CSS classes
}

// DocumentSection: Provides a styled section with a header, content, and optional footer
export default function DocumentSection({ title, children, footer, className = "" }: DocumentSectionProps) {
  return (
    // Main container with styling and optional custom classes
    <div className={`grid-section document-shadow p-6 bg-white/30 flex flex-col h-full ${className}`}>
      {/* Section header with title and divider */}
      <div className="classified-header mb-4">
        <h2 className="text-lg font-bold text-stamp-red mb-2">{title}</h2>
        <div className="h-px bg-document-border"></div>
      </div>
      
      {/* Section content */}
      <div className="flex-1">
        {children}
      </div>
      
      {/* Optional footer */}
      {footer && (
        <div className="mt-auto pt-4 text-xs text-typewriter-medium">
          {footer.split('\n').map((line, idx) => (
            <span key={idx}>
              {line}
              {idx < footer.split('\n').length - 1 && <br />}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}