import React from 'react';
import { trackExternalLinkClick } from '@/lib/utils';

// Shared markdown component configurations for consistent rendering
export const getMarkdownComponents = (isPreview: boolean = false) => ({
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
    const className = isPreview
      ? "inline"
      : "mb-5 leading-relaxed";
    return <span className={className}>{props.children}</span>;
  },
  a: (props: any) => (
    <a
      href={props.href}
      target="_blank"
      rel="noopener noreferrer"
      className="underline decoration-forest/40 underline-offset-2 transition-colors hover:text-forest hover:decoration-forest"
      onClick={() => trackExternalLinkClick(props.href)}
    >
      {props.children}
    </a>
  ),
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
});

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
