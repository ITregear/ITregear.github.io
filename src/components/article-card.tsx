'use client'

import { useRouter } from 'next/navigation'
import MarkdownRenderer from './markdown-renderer'

interface ArticleCardProps {
  slug: string
  title: string
  date?: string
  excerpt: string
}

export default function ArticleCard({ slug, title, date, excerpt }: ArticleCardProps) {
  const router = useRouter()

  const handleCardClick = (e: React.MouseEvent) => {
    // Don't navigate if user clicked on a link inside the card
    if ((e.target as HTMLElement).tagName === 'A' || (e.target as HTMLElement).closest('a')) {
      return
    }
    router.push(`/thoughts/${slug}`)
  }

  return (
    <article 
      className="bg-white/60 rounded-lg p-4 md:p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
      onClick={handleCardClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          router.push(`/thoughts/${slug}`)
        }
      }}
      tabIndex={0}
      role="button"
      aria-label={`Read article: ${title}`}
    >
      <header className="mb-3 md:mb-4">
        <h3 className="text-lg md:text-xl font-bold text-typewriter-dark mb-2 hover:text-stamp-red transition-colors">
          {title}
        </h3>
        {date && (
          <time className="text-typewriter-medium text-xs md:text-sm" dateTime={date}>
            {new Date(date).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </time>
        )}
      </header>
      
      <div className="text-typewriter-medium leading-relaxed text-sm md:text-base">
        <MarkdownRenderer content={excerpt} isPreview={true} />
      </div>
      
      <div className="mt-3 md:mt-4 text-stamp-red text-xs md:text-sm font-medium">
        Read more →
      </div>
    </article>
  )
}
