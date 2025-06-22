import * as React from "react";
import Header from "@/components/header";
import TabsNav from "@/components/ui/tabs";
import * as Accordion from "@radix-ui/react-accordion";
import ReactMarkdown from "react-markdown";
import fm from "front-matter";
import path from "path";

// Vite dynamic import for all markdown files in thoughts (new syntax)
const markdownFiles = import.meta.glob("/src/assets/thoughts/*.md", { query: "?raw", import: "default" });
console.log("Loaded markdown files:", markdownFiles);

type Post = {
  title: string;
  date: string;
  content: string;
};

function usePosts(): Post[] {
  const [posts, setPosts] = React.useState<Post[]>([]);

  React.useEffect(() => {
    Promise.all(
      Object.entries(markdownFiles).map(async ([path, resolver]) => {
        const raw = await (resolver as () => Promise<string>)();
        const { attributes, body } = fm(raw) as { attributes: any; body: string };
        return {
          title: attributes.title || path.split("/").pop()?.replace(/\.md$/, "") || "Untitled",
          date: attributes.date || "",
          content: body,
        };
      })
    ).then((allPosts) => {
      allPosts.sort((a, b) => (b.date || "").localeCompare(a.date || ""));
      setPosts(allPosts);
    });
  }, []);

  return posts;
}

export default function Thoughts() {
  const posts = usePosts();

  // Custom image and markdown renderers for markdown
  const markdownComponents = {
    img: (props: any) => {
      let src = props.src || "";
      if (!/^https?:\/\//.test(src) && !src.startsWith("/")) {
        src = `/src/assets/thoughts/images/${src.replace(/^\.\/?images\//, "")}`;
      }
      return <img {...props} src={src} alt={props.alt} />;
    },
    h1: (props: any) => <h1 className="text-2xl font-bold mt-8 mb-4 text-typewriter-dark">{props.children}</h1>,
    h2: (props: any) => <h2 className="text-xl font-bold mt-7 mb-3 text-typewriter-dark">{props.children}</h2>,
    h3: (props: any) => <h3 className="text-lg font-bold mt-6 mb-2 text-typewriter-dark">{props.children}</h3>,
    ul: (props: any) => <ul className="list-disc pl-6 my-3">{props.children}</ul>,
    ol: (props: any) => <ol className="list-decimal pl-6 my-3">{props.children}</ol>,
    li: (props: any) => <li className="mb-2">{props.children}</li>,
    p: (props: any) => <p className="mb-4 text-typewriter-medium">{props.children}</p>,
    a: (props: any) => (
      <a
        href={props.href}
        target="_blank"
        rel="noopener noreferrer"
        className="underline hover:text-stamp-red transition-colors"
      >
        {props.children}
      </a>
    ),
    blockquote: (props: any) => (
      <blockquote className="border-l-4 border-stamp-red pl-4 italic my-4 py-1 bg-white/40 rounded">
        {props.children}
      </blockquote>
    ),
  };

  return (
    <div className="bg-vintage-beige text-typewriter-dark font-typewriter min-h-screen">
      <Header />
      <TabsNav />
      <main className="container mx-auto px-6 pt-12 pb-24">
        <div className="max-w-5xl w-full mx-auto">
          <h2 className="text-2xl font-bold mb-8 typewriter-text text-center">Thoughts</h2>
          {posts.length === 0 ? (
            <div className="text-typewriter-medium typewriter-text text-center">No blog posts yet.</div>
          ) : (
            <Accordion.Root type="single" collapsible className="w-full space-y-4">
              {posts.map((post, idx) => (
                <Accordion.Item key={post.title} value={post.title} className="w-full bg-transparent border-none shadow-none">
                  <Accordion.Header>
                    <Accordion.Trigger className="w-full px-6 py-4 font-semibold text-lg typewriter-text transition-all bg-transparent border-none flex items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-stamp-red">
                      <span className="flex-1 min-w-0 text-left break-words whitespace-normal">{post.title}</span>
                      <span className="ml-4 text-base font-normal text-typewriter-medium flex-shrink-0 text-right w-32">{post.date}</span>
                      <svg className="ml-2 h-6 w-6 transition-transform duration-200 flex-shrink-0" style={{ color: 'hsl(var(--stamp-red))' }} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M6 8L10 12L14 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </Accordion.Trigger>
                  </Accordion.Header>
                  <Accordion.Content className="px-6 pb-6 pt-2 animate-fadeIn bg-transparent border-none">
                    <div className="font-blog-mono text-typewriter-medium max-w-2xl mx-auto leading-relaxed text-[1.08rem]">
                      <ReactMarkdown components={markdownComponents}>{post.content}</ReactMarkdown>
                    </div>
                  </Accordion.Content>
                </Accordion.Item>
              ))}
            </Accordion.Root>
          )}
        </div>
      </main>
    </div>
  );
} 