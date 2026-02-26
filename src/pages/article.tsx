import * as React from "react";
import { useLocation, useParams } from "wouter";
import TabsNav from "@/components/ui/tabs";
import SEO from "@/components/seo";
import ReactMarkdown from "react-markdown";
import fm from "front-matter";
import { getMarkdownComponents, createCleanDescription } from "@/lib/markdown";
import { getThoughtsImageUrl } from "@/lib/images";

// Vite dynamic import for all markdown files in thoughts
const markdownFiles = import.meta.glob("/src/assets/thoughts/*.md", { query: "?raw", import: "default" });

type Article = {
  title: string;
  date: string;
  content: string;
  slug: string;
};

function useArticle(slug: string): Article | null {
  const [article, setArticle] = React.useState<Article | null>(null);

  React.useEffect(() => {
    const fetchArticle = async () => {
      const filePath = `/src/assets/thoughts/${slug}.md`;
      const resolver = markdownFiles[filePath];
      
      if (!resolver) {
        setArticle(null);
        return;
      }

      try {
        const rawContent = await (resolver as () => Promise<string>)();
        const { attributes, body } = fm(rawContent);

        // Process image paths - convert relative paths to Vite-imported URLs
        const processedBody = body.replace(/!\[(.*?)\]\(\.\/images\/(.*?)\)/g, (match, altText, imageName) => {
          const imageUrl = getThoughtsImageUrl(imageName);
          if (imageUrl) {
            return `![${altText}](${imageUrl})`;
          }
          // Fallback to original if image not found
          console.warn(`Image not found: ${imageName}`);
          return match;
        });

        setArticle({
          title: (attributes as any).title || slug.replace(/-/g, ' '),
          date: (attributes as any).date || '',
          content: processedBody,
          slug
        });
      } catch (error) {
        console.error('Error loading article:', error);
        setArticle(null);
      }
    };

    fetchArticle();
  }, [slug]);

  return article;
}

// Helper function to extract first image from markdown content
function extractFirstImage(content: string): string | null {
  // Look for images with Vite-imported URLs (after processing)
  const viteImageMatch = content.match(/!\[.*?\]\((\/assets\/[^)]+)\)/);
  if (viteImageMatch) {
    return `https://ivantregear.com${viteImageMatch[1]}`;
  }
  
  // Look for original format ![alt](./images/filename) in case not processed yet
  const relativeImageMatch = content.match(/!\[.*?\]\(\.\/images\/(.*?)\)/);
  if (relativeImageMatch) {
    const imageUrl = getThoughtsImageUrl(relativeImageMatch[1]);
    if (imageUrl) {
      return `https://ivantregear.com${imageUrl}`;
    }
  }
  
  // Look for any other image format
  const anyImageMatch = content.match(/!\[.*?\]\((.*?)\)/);
  if (anyImageMatch) {
    const imagePath = anyImageMatch[1];
    // If it's already a full URL, use it
    if (imagePath.startsWith('http')) {
      return imagePath;
    }
    // If it's a Vite asset path, prepend domain
    if (imagePath.startsWith('/')) {
      return `https://ivantregear.com${imagePath}`;
    }
  }
  
  return null;
}



export default function Article() {
  const [, setLocation] = useLocation();
  const { slug } = useParams();
  
  const article = useArticle(slug);
  const markdownComponents = getMarkdownComponents(false);

  if (!article) {
    return (
      <div className="relative min-h-screen bg-canvas text-ink">
        <SEO 
          title="Article Not Found - Ivan Tregear"
          description="The requested article could not be found."
          url={`https://ivantregear.com/thoughts/${slug}`}
          type="website"
        />
        <header className="relative">
          <div className="mx-auto max-w-6xl px-4 pb-4 pt-8 sm:px-6 lg:px-8">
            <TabsNav />
          </div>
        </header>
        <main className="mx-auto max-w-6xl px-4 pb-16 sm:px-6 lg:px-8">
          <div className="max-w-3xl text-center">
            <h1 className="font-display text-2xl text-ink sm:text-3xl mb-4">Article Not Found</h1>
            <p className="text-stone mb-8">The article you're looking for doesn't exist.</p>
            <button 
              onClick={() => setLocation('/thoughts')}
              className="rounded-full border border-forest/20 bg-forest px-6 py-3 text-sm font-medium text-white transition hover:-translate-y-0.5"
            >
              Back to Thoughts
            </button>
          </div>
        </main>
      </div>
    );
  }

  const articleImage = article ? extractFirstImage(article.content) : null;
  const articleDescription = article ? createCleanDescription(article.content, article.title) : '';
  const defaultImage = "https://ivantregear.com/og-image.png";

  return (
    <div className="relative min-h-screen bg-canvas text-ink">
      <SEO 
        title={`${article.title} - Ivan Tregear`}
        description={articleDescription}
        image={articleImage || defaultImage}
        url={`https://ivantregear.com/thoughts/${article.slug}`}
        type="article"
        publishedTime={article.date}
        author="Ivan Tregear"
      />
      <header className="relative">
        <div className="mx-auto max-w-6xl px-4 pb-4 pt-8 sm:px-6 lg:px-8">
          <TabsNav />
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 pb-16 sm:px-6 lg:px-8 lg:pb-24">
        <div className="max-w-3xl">
          <nav className="mb-8">
            <button 
              onClick={() => setLocation('/thoughts')}
              className="flex items-center text-sm text-stone transition hover:text-forest"
            >
              <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Thoughts
            </button>
          </nav>
          
          <article>
            <header className="mb-8">
              <h1 className="font-display text-3xl text-ink sm:text-4xl">{article.title}</h1>
              {article.date && (
                <time className="mt-2 block text-[11px] uppercase tracking-[0.3em] text-stone" dateTime={article.date}>
                  {new Date(article.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </time>
              )}
            </header>
            
            <div className="text-oak leading-relaxed text-base sm:text-lg [&>*+*]:mt-4">
              <ReactMarkdown components={markdownComponents}>{article.content}</ReactMarkdown>
            </div>
          </article>
        </div>
      </main>
    </div>
  );
} 