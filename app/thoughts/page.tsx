import { Metadata } from 'next'
import Header from "@/components/header-nextjs"
import TabsNav from "@/components/ui/tabs-nextjs"
import fm from "front-matter"
import { createMarkdownExcerpt } from "@/lib/markdown"
import ArticleCard from "@/components/article-card"

export const metadata: Metadata = {
  title: 'Thoughts',
  description: 'Articles and thoughts on robotics, engineering, and entrepreneurship by Ivan Tregear, CTO at KAIKAKU.',
  openGraph: {
    title: 'Thoughts - Ivan Tregear',
    description: 'Articles and thoughts on robotics, engineering, and entrepreneurship by Ivan Tregear, CTO at KAIKAKU.',
    url: 'https://ivantregear.com/thoughts/',
    type: 'website',
  },
  twitter: {
    title: 'Thoughts - Ivan Tregear',
    description: 'Articles and thoughts on robotics, engineering, and entrepreneurship by Ivan Tregear, CTO at KAIKAKU.',
  },
}

type Post = {
  title: string
  date: string
  content: string
  slug: string
  excerpt: string
}

async function getPosts(): Promise<Post[]> {
  const fs = require('fs')
  const path = require('path')
  
  const thoughtsDir = path.join(process.cwd(), 'src/assets/thoughts')
  
  if (!fs.existsSync(thoughtsDir)) {
    return []
  }
  
  const files = fs.readdirSync(thoughtsDir).filter((file: string) => file.endsWith('.md'))
  
  const posts = await Promise.all(
    files.map(async (file: string) => {
      const filePath = path.join(thoughtsDir, file)
      const rawContent = fs.readFileSync(filePath, 'utf8')
      const { attributes, body } = fm(rawContent)

      const slug = file.replace(/\.md$/, '')
      const excerpt = createMarkdownExcerpt(body, 200)

      return {
        title: (attributes as any).title || slug.replace(/-/g, ' '),
        date: (attributes as any).date || '',
        content: body,
        slug,
        excerpt
      }
    })
  )

  return posts.sort((a, b) => (b.date || '').localeCompare(a.date || ''))
}

export default async function Thoughts() {
  const posts = await getPosts()

  return (
    <div className="bg-vintage-beige text-typewriter-dark font-typewriter min-h-screen">
      <Header />
      <TabsNav />
      <main className="container mx-auto px-4 md:px-6 pt-8 md:pt-12 pb-16 md:pb-24">
        <div className="max-w-4xl w-full mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8 typewriter-text text-center">Thoughts</h2>
          {posts.length === 0 ? (
            <div className="text-typewriter-medium typewriter-text text-center">No blog posts yet.</div>
          ) : (
            <div className="space-y-6 md:space-y-8">
              {posts.map((post) => (
                <ArticleCard 
                  key={post.slug}
                  slug={post.slug}
                  title={post.title}
                  date={post.date}
                  excerpt={post.excerpt}
                />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
