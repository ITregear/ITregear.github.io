import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Header from "@/components/header-nextjs"
import TabsNav from "@/components/ui/tabs-nextjs"
import fm from "front-matter"
import { createCleanDescription } from "@/lib/markdown"
import { getThoughtsImageUrl } from "@/lib/images"
import MarkdownRenderer from "@/components/markdown-renderer"

type Article = {
  title: string
  date: string
  content: string
  slug: string
}

async function getArticle(slug: string): Promise<Article | null> {
  const fs = require('fs')
  const path = require('path')
  
  try {
    const filePath = path.join(process.cwd(), 'src/assets/thoughts', `${slug}.md`)
    
    if (!fs.existsSync(filePath)) {
      return null
    }
    
    const rawContent = fs.readFileSync(filePath, 'utf8')
    const { attributes, body } = fm(rawContent)

    // Process image paths - convert relative paths to Vite-imported URLs
    const processedBody = body.replace(/!\[(.*?)\]\(\.\/images\/(.*?)\)/g, (match: string, altText: string, imageName: string) => {
      const imageUrl = getThoughtsImageUrl(imageName)
      if (imageUrl) {
        return `![${altText}](${imageUrl})`
      }
      console.warn(`Image not found: ${imageName}`)
      return match
    })

    return {
      title: (attributes as any).title || slug.replace(/-/g, ' '),
      date: (attributes as any).date || '',
      content: processedBody,
      slug
    }
  } catch (error) {
    console.error('Error loading article:', error)
    return null
  }
}

async function getAllArticleSlugs(): Promise<string[]> {
  const fs = require('fs')
  const path = require('path')
  
  try {
    const thoughtsDir = path.join(process.cwd(), 'src/assets/thoughts')
    
    if (!fs.existsSync(thoughtsDir)) {
      return []
    }
    
    const files = fs.readdirSync(thoughtsDir).filter((file: string) => file.endsWith('.md'))
    return files.map((file: string) => file.replace(/\.md$/, ''))
  } catch (error) {
    return []
  }
}

// Helper function to extract first image from markdown content
function extractFirstImage(content: string): string | null {
  // Look for images with Vite-imported URLs (after processing)
  const viteImageMatch = content.match(/!\[.*?\]\((\/assets\/[^)]+)\)/)
  if (viteImageMatch) {
    return `https://ivantregear.com${viteImageMatch[1]}`
  }
  
  // Look for original format ![alt](./images/filename) in case not processed yet
  const relativeImageMatch = content.match(/!\[.*?\]\(\.\/images\/(.*?)\)/)
  if (relativeImageMatch) {
    const imageUrl = getThoughtsImageUrl(relativeImageMatch[1])
    if (imageUrl) {
      return `https://ivantregear.com${imageUrl}`
    }
  }
  
  // Look for any other image format
  const anyImageMatch = content.match(/!\[.*?\]\((.*?)\)/)
  if (anyImageMatch) {
    const imagePath = anyImageMatch[1]
    // If it's already a full URL, use it
    if (imagePath.startsWith('http')) {
      return imagePath
    }
    // If it's a Vite asset path, prepend domain
    if (imagePath.startsWith('/')) {
      return `https://ivantregear.com${imagePath}`
    }
  }
  
  return null
}

export async function generateStaticParams() {
  const slugs = await getAllArticleSlugs()
  return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const article = await getArticle(slug)
  
  if (!article) {
    return {
      title: 'Article Not Found',
      description: 'The requested article could not be found.',
    }
  }

  const articleImage = extractFirstImage(article.content)
  const articleDescription = createCleanDescription(article.content, article.title)
  const defaultImage = "https://ivantregear.com/og-image.png"

  return {
    title: article.title,
    description: articleDescription,
    openGraph: {
      title: `${article.title} - Ivan Tregear`,
      description: articleDescription,
      url: `https://ivantregear.com/thoughts/${article.slug}/`,
      type: 'article',
      publishedTime: article.date,
      authors: ['Ivan Tregear'],
      images: [
        {
          url: articleImage || defaultImage,
          width: 1200,
          height: 630,
          alt: article.title,
        }
      ],
    },
    twitter: {
      title: `${article.title} - Ivan Tregear`,
      description: articleDescription,
      images: [articleImage || defaultImage],
    },
  }
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const article = await getArticle(slug)
  
  if (!article) {
    notFound()
  }

  return (
    <div className="bg-vintage-beige text-typewriter-dark font-typewriter min-h-screen">
      <Header />
      <TabsNav />
      <main className="container mx-auto px-4 md:px-6 pt-8 md:pt-12 pb-16 md:pb-24">
        <div className="max-w-4xl mx-auto">
          <nav className="mb-6 md:mb-8">
            <Link 
              href="/thoughts"
              className="text-stamp-red hover:text-stamp-red/80 transition-colors flex items-center text-sm md:text-base"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Thoughts
            </Link>
          </nav>
          
          <article className="bg-white/60 rounded-lg p-5 md:p-8 shadow-sm">
            <header className="mb-6 md:mb-8">
              <h1 className="text-2xl md:text-4xl font-bold mb-3 md:mb-4 text-typewriter-dark">{article.title}</h1>
              {article.date && (
                <time className="text-typewriter-medium text-xs md:text-sm" dateTime={article.date}>
                  {new Date(article.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </time>
              )}
            </header>
            
            <MarkdownRenderer 
              content={article.content} 
              className="font-blog-mono text-typewriter-medium leading-relaxed text-base md:text-lg" 
            />
          </article>
        </div>
      </main>
    </div>
  )
}
