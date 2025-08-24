'use client'

import ReactMarkdown from "react-markdown"
import { getMarkdownComponents } from "@/lib/markdown-client"

interface MarkdownRendererProps {
  content: string
  isPreview?: boolean
  className?: string
}

export default function MarkdownRenderer({ content, isPreview = false, className }: MarkdownRendererProps) {
  const markdownComponents = getMarkdownComponents(isPreview)
  
  return (
    <div className={className}>
      <ReactMarkdown components={markdownComponents}>
        {content}
      </ReactMarkdown>
    </div>
  )
}
