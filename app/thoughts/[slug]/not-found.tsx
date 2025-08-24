import Link from 'next/link'
import Header from "@/components/header-nextjs"
import TabsNav from "@/components/ui/tabs-nextjs"

export default function NotFound() {
  return (
    <div className="bg-vintage-beige text-typewriter-dark font-typewriter min-h-screen">
      <Header />
      <TabsNav />
      <main className="container mx-auto px-4 md:px-6 pt-8 md:pt-12 pb-16 md:pb-24">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-2xl md:text-3xl font-bold mb-3 md:mb-4">Article Not Found</h1>
          <p className="text-typewriter-medium mb-6 md:mb-8 text-sm md:text-base">The article you're looking for doesn't exist.</p>
          <Link 
            href="/thoughts"
            className="inline-block px-4 md:px-6 py-2 md:py-3 bg-stamp-red text-white rounded hover:bg-stamp-red/90 transition-colors text-sm md:text-base"
          >
            Back to Thoughts
          </Link>
        </div>
      </main>
    </div>
  )
}
