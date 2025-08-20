import React from 'react';
import { trackExternalLinkClick } from '@/lib/utils';

// Shared markdown component configurations for consistent rendering
export const getMarkdownComponents = (isPreview: boolean = false) => ({
  img: (props: any) => {
    if (isPreview) return null; // Don't render images in previews
    return <img {...props} alt={props.alt} className="max-w-full h-auto my-3 md:my-4" />;
  },
  h1: (props: any) => {
    if (isPreview) return <span className="font-bold">{props.children}</span>;
    return <h1 className="text-2xl md:text-3xl font-bold mt-6 md:mt-8 mb-4 md:mb-6 text-typewriter-dark">{props.children}</h1>;
  },
  h2: (props: any) => {
    if (isPreview) return <span className="font-bold">{props.children}</span>;
    return <h2 className="text-xl md:text-2xl font-bold mt-5 md:mt-7 mb-3 md:mb-4 text-typewriter-dark">{props.children}</h2>;
  },
  h3: (props: any) => {
    if (isPreview) return <span className="font-bold">{props.children}</span>;
    return <h3 className="text-lg md:text-xl font-bold mt-4 md:mt-6 mb-2 md:mb-3 text-typewriter-dark">{props.children}</h3>;
  },
  ul: (props: any) => {
    if (isPreview) return <span>{props.children}</span>;
    return <ul className="list-disc pl-4 md:pl-6 my-3 md:my-4 text-base md:text-lg">{props.children}</ul>;
  },
  ol: (props: any) => {
    if (isPreview) return <span>{props.children}</span>;
    return <ol className="list-decimal pl-4 md:pl-6 my-3 md:my-4 text-base md:text-lg">{props.children}</ol>;
  },
  li: (props: any) => {
    if (isPreview) return <span className="mr-2">{props.children}</span>;
    return <li className="mb-1 md:mb-2 text-base md:text-lg">{props.children}</li>;
  },
  p: (props: any) => {
    const className = isPreview 
      ? "inline" 
      : "mb-4 md:mb-6 text-typewriter-medium leading-relaxed text-base md:text-lg";
    return <span className={className}>{props.children}</span>;
  },
  a: (props: any) => (
    <a
      href={props.href}
      target="_blank"
      rel="noopener noreferrer"
      className="underline hover:text-stamp-red transition-colors"
      onClick={() => trackExternalLinkClick(props.href)}
    >
      {props.children}
    </a>
  ),
  blockquote: (props: any) => {
    if (isPreview) return <span className="italic">{props.children}</span>;
    return (
      <blockquote className="border-l-4 border-stamp-red pl-4 md:pl-6 italic my-4 md:my-6 py-2 bg-white/40 rounded text-base md:text-lg">
        {props.children}
      </blockquote>
    );
  },
  code: (props: any) => (
    <code className="bg-gray-100 px-1 py-0.5 rounded text-sm font-mono">
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
