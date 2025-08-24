'use client'

import { trackExternalLinkClick } from "@/lib/utils"

interface ExternalLinkProps {
  href: string
  children: React.ReactNode
  className?: string
  'aria-label'?: string
}

export default function ExternalLink({ href, children, className, 'aria-label': ariaLabel }: ExternalLinkProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      onClick={() => trackExternalLinkClick(href)}
      aria-label={ariaLabel}
    >
      {children}
    </a>
  )
}
