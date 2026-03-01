import React from 'react';
import { trackExternalLinkClick } from '@/lib/utils';
import { fetchAllLinkMeta, type LinkMeta } from '@/lib/link-metadata';

export type BibliographyEntry = {
  number: number;
  url: string;
  text: string;
  hostname: string;
};

/**
 * Extracts external links from markdown content and assigns stable
 * bibliography numbers. Duplicate URLs share the same number.
 */
export function extractBibliography(markdown: string): BibliographyEntry[] {
  const linkRegex = /\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g;
  const seen = new Map<string, BibliographyEntry>();
  const entries: BibliographyEntry[] = [];
  let match: RegExpExecArray | null;

  while ((match = linkRegex.exec(markdown)) !== null) {
    const [, text, url] = match;
    if (seen.has(url)) continue;

    let hostname: string;
    try {
      hostname = new URL(url).hostname.replace(/^www\./, '');
    } catch {
      hostname = url;
    }

    const entry: BibliographyEntry = {
      number: entries.length + 1,
      url,
      text,
      hostname,
    };
    seen.set(url, entry);
    entries.push(entry);
  }

  return entries;
}

function buildBibLookup(entries: BibliographyEntry[]): Map<string, number> {
  const map = new Map<string, number>();
  for (const e of entries) map.set(e.url, e.number);
  return map;
}

function useLinkMetadata(entries: BibliographyEntry[]) {
  const [meta, setMeta] = React.useState<Record<string, LinkMeta>>({});

  React.useEffect(() => {
    if (entries.length === 0) return;
    let cancelled = false;
    fetchAllLinkMeta(entries.map((e) => e.url)).then((result) => {
      if (!cancelled) setMeta(result);
    });
    return () => { cancelled = true; };
  }, [entries]);

  return meta;
}

function truncate(str: string, max: number): string {
  if (str.length <= max) return str;
  return str.substring(0, max - 1).trimEnd() + '\u2026';
}

function formatDate(iso: string): string | null {
  try {
    const d = new Date(iso);
    if (isNaN(d.getTime())) return null;
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
  } catch {
    return null;
  }
}

export function Bibliography({ entries }: { entries: BibliographyEntry[] }) {
  const metadata = useLinkMetadata(entries);

  if (entries.length === 0) return null;

  return (
    <section className="mt-12 border-t border-sandstone/40 pt-8" aria-label="Bibliography">
      <h4 className="font-display text-sm uppercase tracking-[0.2em] text-stone mb-5">References</h4>
      <ol className="space-y-3">
        {entries.map((entry) => {
          const meta = metadata[entry.url];
          const title = truncate(meta?.title || entry.text, 90);
          const publisher = meta?.publisher || entry.hostname;
          const date = meta?.date ? formatDate(meta.date) : null;

          return (
            <li key={entry.number} id={`ref-${entry.number}`} className="flex gap-3 text-sm leading-relaxed">
              <span className="shrink-0 font-medium text-forest">[{entry.number}]</span>
              <span className="text-oak">
                <a
                  href={entry.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline decoration-forest/30 underline-offset-2 transition-colors hover:text-forest hover:decoration-forest"
                  onClick={() => trackExternalLinkClick(entry.url)}
                >
                  {title}
                </a>
                <span className="ml-1.5 text-stone">
                  — {publisher}
                  {date && <span>, {date}</span>}
                </span>
              </span>
            </li>
          );
        })}
      </ol>
    </section>
  );
}

// Shared markdown component configurations for consistent rendering
export const getMarkdownComponents = (
  isPreview: boolean = false,
  bibliography?: BibliographyEntry[],
) => {
  const bibLookup = bibliography ? buildBibLookup(bibliography) : null;

  return {
    img: (props: any) => {
      if (isPreview) return null;
      return <img {...props} alt={props.alt} className="max-w-full h-auto my-4 rounded-lg" />;
    },
    h1: (props: any) => {
      if (isPreview) return <span className="font-bold">{props.children}</span>;
      return <h1 className="font-display text-2xl sm:text-3xl text-forest mt-8 mb-4">{props.children}</h1>;
    },
    h2: (props: any) => {
      if (isPreview) return <span className="font-bold">{props.children}</span>;
      return <h2 className="font-display text-xl sm:text-2xl text-forest mt-7 mb-3">{props.children}</h2>;
    },
    h3: (props: any) => {
      if (isPreview) return <span className="font-bold">{props.children}</span>;
      return <h3 className="font-display text-lg sm:text-xl text-forest mt-6 mb-2">{props.children}</h3>;
    },
    ul: (props: any) => {
      if (isPreview) return <span>{props.children}</span>;
      return <ul className="list-disc pl-5 my-4">{props.children}</ul>;
    },
    ol: (props: any) => {
      if (isPreview) return <span>{props.children}</span>;
      return <ol className="list-decimal pl-5 my-4">{props.children}</ol>;
    },
    li: (props: any) => {
      if (isPreview) return <span className="mr-2">{props.children}</span>;
      return <li className="mb-1.5">{props.children}</li>;
    },
    p: (props: any) => {
      if (isPreview) return <span className="inline">{props.children}</span>;
      return <p className="mb-5 leading-relaxed">{props.children}</p>;
    },
    a: (props: any) => {
      const href: string = props.href || '';
      const isExternal = href.startsWith('http');
      const refNumber = bibLookup?.get(href);

      return (
        <>
          <a
            href={href}
            target={isExternal ? '_blank' : undefined}
            rel={isExternal ? 'noopener noreferrer' : undefined}
            className="underline decoration-forest/40 underline-offset-2 transition-colors hover:text-forest hover:decoration-forest"
            onClick={() => isExternal && trackExternalLinkClick(href)}
          >
            {props.children}
          </a>
          {refNumber != null && (
            <a
              href={`#ref-${refNumber}`}
              className="ml-0.5 align-super text-[0.65em] font-medium text-forest/70 no-underline transition-colors hover:text-forest"
            >
              [{refNumber}]
            </a>
          )}
        </>
      );
    },
    blockquote: (props: any) => {
      if (isPreview) return <span className="italic">{props.children}</span>;
      return (
        <blockquote className="border-l-2 border-forest/40 pl-5 italic my-6 text-oak">
          {props.children}
        </blockquote>
      );
    },
    code: (props: any) => (
      <code className="rounded bg-shell/60 px-1.5 py-0.5 text-sm font-mono">
        {props.children}
      </code>
    ),
    em: (props: any) => <em>{props.children}</em>,
    strong: (props: any) => <strong>{props.children}</strong>,
  };
};

// Helper function to create clean text for descriptions (used in SEO)
export function createCleanDescription(content: string, title: string): string {
  // Remove markdown syntax
  const cleanContent = content
    .replace(/^---[\s\S]*?---/m, '') // Remove frontmatter
    .replace(/!\[.*?\]\(.*?\)/g, '') // Remove images
    .replace(/#{1,6}\s+/g, '') // Remove headers
    .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold
    .replace(/\*(.*?)\*/g, '$1') // Remove italic
    .replace(/`(.*?)`/g, '$1') // Remove inline code
    .replace(/\[(.*?)\]\(.*?\)/g, '$1') // Remove links, keep text
    .replace(/^\s*[-*+]\s+/gm, '') // Remove list markers
    .replace(/^\s*\d+\.\s+/gm, '') // Remove numbered list markers
    .replace(/\n\s*\n/g, ' ') // Replace multiple newlines with space
    .replace(/\s+/g, ' ') // Replace multiple spaces with single space
    .trim();
  
  // Get first paragraph or first 160 characters
  const firstParagraph = cleanContent.split('\n')[0];
  const description = firstParagraph.length > 160 
    ? firstParagraph.substring(0, 157) + '...'
    : firstParagraph;
    
  return description || `${title} by Ivan Tregear. Read more about robotics, engineering, and entrepreneurship.`;
}

// Helper function to create a preview-friendly excerpt that renders markdown
export function createMarkdownExcerpt(content: string, maxLength: number = 200): string {
  // Remove frontmatter
  const withoutFrontmatter = content.replace(/^---[\s\S]*?---/m, '').trim();
  
  // Get first paragraph
  const firstParagraph = withoutFrontmatter.split('\n\n')[0];
  
  // Truncate if too long, but try to preserve complete markdown links
  if (firstParagraph.length <= maxLength) {
    return firstParagraph;
  }
  
  // Find a good breaking point that doesn't break markdown links
  let truncated = firstParagraph.substring(0, maxLength);
  
  // If we're in the middle of a markdown link, extend to include the full link
  const openBracket = truncated.lastIndexOf('[');
  const closeBracket = truncated.lastIndexOf(']');
  const openParen = truncated.lastIndexOf('(');
  
  if (openBracket > closeBracket || (openBracket < closeBracket && closeBracket < openParen)) {
    // We're potentially in the middle of a link, try to find the end
    const remainingContent = firstParagraph.substring(maxLength);
    const endParen = remainingContent.indexOf(')');
    if (endParen !== -1 && endParen < 100) { // Don't extend too far
      truncated = firstParagraph.substring(0, maxLength + endParen + 1);
    }
  }
  
  return truncated + (truncated.length < firstParagraph.length ? '...' : '');
}
