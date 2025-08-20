import * as React from "react";
import { useLocation } from "wouter";
import Header from "@/components/header";
import TabsNav from "@/components/ui/tabs";
import SEO from "@/components/seo";
import ReactMarkdown from "react-markdown";
import fm from "front-matter";
import path from "path";
import { trackExternalLinkClick } from "@/lib/utils";
import { getMarkdownComponents, createMarkdownExcerpt } from "@/lib/markdown";

// Vite dynamic import for all markdown files in thoughts (new syntax)
const markdownFiles = import.meta.glob("/src/assets/thoughts/*.md", { query: "?raw", import: "default" });

type Post = {
  title: string;
  date: string;
  content: string;
  slug: string;
  excerpt: string;
};

function usePosts(): Post[] {
  const [posts, setPosts] = React.useState<Post[]>([]);

  React.useEffect(() => {
    const fetchPosts = async () => {
      const postsPromises = Object.entries(markdownFiles).map(async ([filePath, resolver]) => {
        const rawContent = await (resolver as () => Promise<string>)();
        const { attributes, body } = fm(rawContent);

        // Extract slug from file path
        const slug = filePath.split('/').pop()?.replace(/\.md$/, '') || '';

        // Create excerpt using the shared markdown utility
        const excerpt = createMarkdownExcerpt(body, 200);

        return {
          title: (attributes as any).title || slug.replace(/-/g, ' '),
          date: (attributes as any).date || '',
          content: body,
          slug,
          excerpt
        };
      });

      const allPosts = await Promise.all(postsPromises);
      allPosts.sort((a, b) => (b.date || '').localeCompare(a.date || ''));
      setPosts(allPosts);
    };

    fetchPosts();
  }, []);

  return posts;
}

export default function Thoughts() {
  const posts = usePosts();
  const [, setLocation] = useLocation();
  const previewMarkdownComponents = getMarkdownComponents(true);

  return (
    <div className="bg-vintage-beige text-typewriter-dark font-typewriter min-h-screen">
      <SEO 
        title="Thoughts - Ivan Tregear"
        description="Articles and thoughts on robotics, engineering, and entrepreneurship by Ivan Tregear, CTO at KAIKAKU."
        url="https://ivantregear.com/thoughts"
        type="website"
      />
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
                <article 
                  key={post.slug} 
                  className="bg-white/60 rounded-lg p-4 md:p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => setLocation(`/thoughts/${post.slug}`)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setLocation(`/thoughts/${post.slug}`);
                    }
                  }}
                  tabIndex={0}
                  role="button"
                  aria-label={`Read article: ${post.title}`}
                >
                  <header className="mb-3 md:mb-4">
                    <h3 className="text-lg md:text-xl font-bold text-typewriter-dark mb-2 hover:text-stamp-red transition-colors">
                      {post.title}
                    </h3>
                    {post.date && (
                      <time className="text-typewriter-medium text-xs md:text-sm" dateTime={post.date}>
                        {new Date(post.date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </time>
                    )}
                  </header>
                  
                  <div className="text-typewriter-medium leading-relaxed text-sm md:text-base">
                    <ReactMarkdown components={previewMarkdownComponents}>
                      {post.excerpt}
                    </ReactMarkdown>
                  </div>
                  
                  <div className="mt-3 md:mt-4 text-stamp-red text-xs md:text-sm font-medium">
                    Read more →
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
} 