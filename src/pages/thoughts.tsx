import * as React from "react";
import { useLocation } from "wouter";
import TabsNav from "@/components/ui/tabs";
import SEO from "@/components/seo";
import ReactMarkdown from "react-markdown";
import fm from "front-matter";
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
    <div className="relative min-h-screen bg-canvas text-ink">
      <SEO 
        title="Thoughts - Ivan Tregear"
        description="Articles and thoughts on robotics, engineering, and entrepreneurship by Ivan Tregear, CTO at KAIKAKU."
        url="https://ivantregear.com/thoughts"
        type="website"
      />
      <header className="relative">
        <div className="mx-auto max-w-6xl px-4 pb-4 pt-8 sm:px-6 lg:px-8">
          <TabsNav />
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 pb-16 sm:px-6 lg:px-8 lg:pb-24">
        <div className="max-w-3xl">
          <h1 className="font-display text-3xl text-ink sm:text-4xl mb-8">Thoughts</h1>
          {posts.length === 0 ? (
            <p className="text-stone">No posts yet.</p>
          ) : (
            <div className="space-y-8">
              {posts.map((post) => (
                <article 
                  key={post.slug} 
                  className="group cursor-pointer rounded-2xl border border-sandstone/40 bg-paper/80 p-5 sm:p-6 shadow-soft transition hover:border-forest/40"
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
                  <h2 className="font-display text-xl text-ink group-hover:text-forest transition-colors sm:text-2xl">
                    {post.title}
                  </h2>
                  {post.date && (
                    <time className="mt-1 block text-[11px] uppercase tracking-[0.3em] text-stone" dateTime={post.date}>
                      {new Date(post.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </time>
                  )}
                  <div className="mt-3 text-sm leading-relaxed text-oak">
                    <ReactMarkdown components={previewMarkdownComponents}>
                      {post.excerpt}
                    </ReactMarkdown>
                  </div>
                  <span className="mt-3 inline-block text-sm text-forest">
                    Read more &rarr;
                  </span>
                </article>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
} 