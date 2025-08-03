import * as React from "react";
import { useLocation, useParams } from "wouter";
import Header from "@/components/header";
import TabsNav from "@/components/ui/tabs";
import SEO from "@/components/seo";
import ReactMarkdown from "react-markdown";
import fm from "front-matter";
import { trackExternalLinkClick } from "@/lib/utils";

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

        // Process image paths
        const processedBody = body.replace(/!\[(.*?)\]\(\.\/images\/(.*?)\)/g, (match, altText, imageName) => {
          const imageUrl = new URL(`/src/assets/thoughts/images/${imageName}`, import.meta.url).href;
          return `![${altText}](${imageUrl})`;
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

export default function Article() {
  const [, setLocation] = useLocation();
  const { slug } = useParams();
  
  const article = useArticle(slug);

  const markdownComponents = {
    img: (props: any) => {
      return <img {...props} alt={props.alt} className="max-w-full h-auto my-4" />;
    },
    h1: (props: any) => <h1 className="text-3xl font-bold mt-8 mb-6 text-typewriter-dark">{props.children}</h1>,
    h2: (props: any) => <h2 className="text-2xl font-bold mt-7 mb-4 text-typewriter-dark">{props.children}</h2>,
    h3: (props: any) => <h3 className="text-xl font-bold mt-6 mb-3 text-typewriter-dark">{props.children}</h3>,
    ul: (props: any) => <ul className="list-disc pl-6 my-4">{props.children}</ul>,
    ol: (props: any) => <ol className="list-decimal pl-6 my-4">{props.children}</ol>,
    li: (props: any) => <li className="mb-2">{props.children}</li>,
    p: (props: any) => <p className="mb-6 text-typewriter-medium leading-relaxed">{props.children}</p>,
    a: (props: any) => (
      <a
        href={props.href}
        target="_blank"
        rel="noopener noreferrer"
        className="underline hover:text-stamp-red transition-colors"
        onClick={() => trackExternalLinkClick(props.href)}
      >
        {props.children}
      </a>
    ),
    blockquote: (props: any) => (
      <blockquote className="border-l-4 border-stamp-red pl-6 italic my-6 py-2 bg-white/40 rounded">
        {props.children}
      </blockquote>
    ),
  };

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
        <main className="container mx-auto px-6 pt-12 pb-24">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl font-bold mb-4">Article Not Found</h1>
            <p className="text-typewriter-medium mb-8">The article you're looking for doesn't exist.</p>
            <button 
              onClick={() => setLocation('/thoughts')}
              className="px-6 py-3 bg-stamp-red text-white rounded hover:bg-stamp-red/90 transition-colors"
            >
              Back to Thoughts
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="bg-vintage-beige text-typewriter-dark font-typewriter min-h-screen">
      <SEO 
        title={`${article.title} - Ivan Tregear`}
        description={`${article.title} by Ivan Tregear. ${article.content.substring(0, 160)}...`}
        url={`https://ivantregear.com/thoughts/${article.slug}`}
        type="article"
        publishedTime={article.date}
        author="Ivan Tregear"
      />
      <Header />
      <TabsNav />
      <main className="container mx-auto px-6 pt-12 pb-24">
        <div className="max-w-4xl mx-auto">
          <nav className="mb-8">
            <button 
              onClick={() => setLocation('/thoughts')}
              className="text-stamp-red hover:text-stamp-red/80 transition-colors flex items-center"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Thoughts
            </button>
          </nav>
          
          <article className="bg-white/60 rounded-lg p-8 shadow-sm">
            <header className="mb-8">
              <h1 className="text-4xl font-bold mb-4 text-typewriter-dark">{article.title}</h1>
              {article.date && (
                <time className="text-typewriter-medium text-sm" dateTime={article.date}>
                  {new Date(article.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </time>
              )}
            </header>
            
            <div className="font-blog-mono text-typewriter-medium leading-relaxed text-lg">
              <ReactMarkdown components={markdownComponents}>{article.content}</ReactMarkdown>
            </div>
          </article>
        </div>
      </main>
    </div>
  );
} 