import * as React from "react";
import { useLocation, useParams } from "wouter";
import Header from "@/components/header";
import TabsNav from "@/components/ui/tabs";
import SEO from "@/components/seo";
import ReactMarkdown from "react-markdown";
import fm from "front-matter";
import { trackExternalLinkClick } from "@/lib/utils";
import { getMarkdownComponents, createCleanDescription } from "@/lib/markdown";

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

        // Process image paths - convert relative paths to absolute URLs
        const processedBody = body.replace(/!\[(.*?)\]\(\.\/images\/(.*?)\)/g, (match, altText, imageName) => {
          // Use Vite's asset handling for proper path resolution
          return `![${altText}](/src/assets/thoughts/images/${imageName})`;
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
  // Look for images in the format ![alt](/src/assets/thoughts/images/filename)
  const imageMatch = content.match(/!\[.*?\]\(\/src\/assets\/thoughts\/images\/(.*?)\)/);
  if (imageMatch) {
    return `https://ivantregear.com/src/assets/thoughts/images/${imageMatch[1]}`;
  }
  
  // Look for original format ![alt](./images/filename) in case not processed yet
  const relativeImageMatch = content.match(/!\[.*?\]\(\.\/images\/(.*?)\)/);
  if (relativeImageMatch) {
    return `https://ivantregear.com/src/assets/thoughts/images/${relativeImageMatch[1]}`;
  }
  
  // Look for any other image format
  const anyImageMatch = content.match(/!\[.*?\]\((.*?)\)/);
  if (anyImageMatch) {
    const imagePath = anyImageMatch[1];
    // If it's already a full URL, use it
    if (imagePath.startsWith('http')) {
      return imagePath;
    }
    // Otherwise, construct the full URL
    return `https://ivantregear.com${imagePath}`;
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
      <div className="bg-vintage-beige text-typewriter-dark font-typewriter min-h-screen">
        <SEO 
          title="Article Not Found - Ivan Tregear"
          description="The requested article could not be found."
          url={`https://ivantregear.com/thoughts/${slug}`}
          type="website"
        />
        <Header />
        <TabsNav />
        <main className="container mx-auto px-4 md:px-6 pt-8 md:pt-12 pb-16 md:pb-24">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-2xl md:text-3xl font-bold mb-3 md:mb-4">Article Not Found</h1>
            <p className="text-typewriter-medium mb-6 md:mb-8 text-sm md:text-base">The article you're looking for doesn't exist.</p>
            <button 
              onClick={() => setLocation('/thoughts')}
              className="px-4 md:px-6 py-2 md:py-3 bg-stamp-red text-white rounded hover:bg-stamp-red/90 transition-colors text-sm md:text-base"
            >
              Back to Thoughts
            </button>
          </div>
        </main>
      </div>
    );
  }

  // Generate dynamic meta content
  const articleImage = article ? extractFirstImage(article.content) : null;
  const articleDescription = article ? createCleanDescription(article.content, article.title) : '';
  const defaultImage = "https://ivantregear.com/og-image.png";

  return (
    <div className="bg-vintage-beige text-typewriter-dark font-typewriter min-h-screen">
      <SEO 
        title={`${article.title} - Ivan Tregear`}
        description={articleDescription}
        image={articleImage || defaultImage}
        url={`https://ivantregear.com/thoughts/${article.slug}`}
        type="article"
        publishedTime={article.date}
        author="Ivan Tregear"
      />
      <Header />
      <TabsNav />
      <main className="container mx-auto px-4 md:px-6 pt-8 md:pt-12 pb-16 md:pb-24">
        <div className="max-w-4xl mx-auto">
          <nav className="mb-6 md:mb-8">
            <button 
              onClick={() => setLocation('/thoughts')}
              className="text-stamp-red hover:text-stamp-red/80 transition-colors flex items-center text-sm md:text-base"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Thoughts
            </button>
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
            
            <div className="font-blog-mono text-typewriter-medium leading-relaxed text-base md:text-lg">
              <ReactMarkdown components={markdownComponents}>{article.content}</ReactMarkdown>
            </div>
          </article>
        </div>
      </main>
    </div>
  );
} 