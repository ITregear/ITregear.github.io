import React from "react";
import { SiGithub, SiLinkedin, SiX } from "react-icons/si";
import DocumentSection from "@/components/document-section";
import TabsNav from "@/components/ui/tabs";
import SEO from "@/components/seo";
import ReactMarkdown from "react-markdown";
import fm from "front-matter";
import { createMarkdownExcerpt, getMarkdownComponents } from "@/lib/markdown";
import { trackExternalLinkClick } from "@/lib/utils";

const heroImageModules = import.meta.glob("@/assets/hero-images/*.png", { eager: true });

type HeroImage = {
  src: string;
  label: string;
};

const heroImages: HeroImage[] = Object.entries(heroImageModules).map(([path, module]) => {
  const asset = module as { default?: string };
  const src = asset.default ?? (module as unknown as string);
  const label = path.split("/").pop()?.replace(/\.png$/, "").replace(/[-_]/g, " ") ?? "Field Notes";
  return { src, label };
});

const markdownFiles = import.meta.glob("/src/assets/thoughts/*.md", { query: "?raw", import: "default" });

type ThoughtPreview = {
  title: string;
  date: string;
  slug: string;
  excerpt: string;
};

function useThoughtPreviews(limit = 2) {
  const [posts, setPosts] = React.useState<ThoughtPreview[]>([]);

  React.useEffect(() => {
    let isMounted = true;

    const load = async () => {
      const entries = await Promise.all(
        Object.entries(markdownFiles).map(async ([filePath, resolver]) => {
          const raw = await (resolver as () => Promise<string>)();
          const { attributes, body } = fm(raw);
          const slug = filePath.split("/").pop()?.replace(/\.md$/, "") ?? "";
          const frontmatter = attributes as { title?: string; date?: string };

          return {
            title: frontmatter.title || slug.replace(/-/g, " "),
            date: frontmatter.date || "",
            slug,
            excerpt: createMarkdownExcerpt(body, 220),
          };
        }),
      );

      entries.sort((a, b) => (b.date || "").localeCompare(a.date || ""));
      if (isMounted) {
        setPosts(entries);
      }
    };

    load();
    return () => {
      isMounted = false;
    };
  }, []);

  return posts.slice(0, limit);
}

const quickFacts = [
  "Mechanical Engineering MEng",
  "Imperial College London",
  "Co-Founder and CTO at KAIKAKU",
  "Co-Founder of Apollo Tech",
  "Forbes 30 Under 30",
  "Youngest chartered engineer in the UK",
  "Professional Voice Over Artist",
];

const referenceLinks = [
  {
    label: "KAIKAKU",
    description: "Robotics for quick service restaurants",
    href: "https://www.kaikaku.ai/",
  },
  {
    label: "VOICE OVER (NICKELODEON, CARTOON NETWORK)",
    description: "Studio reel via SaySo Voices",
    href: "https://saysovoices.com/talent/ivan-tregear/",
  },
  {
    label: "FORBES 30 UNDER 30",
    description: "Manufacturing & Industry list",
    href: "https://www.forbes.com/profile/kaikaku/",
  },
  {
    label: "KAIKAKU IN THE NEWS",
    description: "Telegraph feature on fast food robotics",
    href: "https://www.telegraph.co.uk/business/2024/08/25/would-you-eat-meal-cooked-robot-meet-machines-taking-over/",
  },
  {
    label: "READING RUMBLE 2022 VICTORS",
    description: "Sailing victory recap",
    href: "https://powerboat.world/news/255273/Reading-Rumble-2022-at-Burghfield",
  },
];

const highlightChips = [
  "Restaurant Robotics",
  "Imperial College London",
  "Forbes 30 Under 30",
  "Chartered Engineer",
];

const socialLinks = [
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/ivantregear",
    icon: SiLinkedin,
  },
  {
    label: "GitHub",
    href: "https://github.com/ITregear",
    icon: SiGithub,
  },
  {
    label: "X (Twitter)",
    href: "https://x.com/IvanTregear",
    icon: SiX,
  },
];

const summaryParagraphs = [
  "I am a Chief Technology Officer working in the glamorous field of Fast Food Robotics. Along with Josef Chen, we founded KAIKAKU, where we are revolutionising the world of Quick Service Restaurants through hardware, software and AI. In 18 months we have deployed 4 food assembly robots (the Fusion family) that have all served food to real paying customers (click the image to see them all).",
  "Our goal is to automate the laborious and menial tasks that no human craves, with low cost and targeted robotics, allowing humans to focus on what they will always be superior to machines at; being hospitable.",
  "I studied Mechanical Engineering at Imperial College London, with a specialisation in mechatronics and control. At university I sailed (see the Reading Rumble link for my Magnum Opus), went to 568 too many times, and was awarded the Imperial Centenary Prize. In my free time I like to build robots or RC planes, cook meals I watched from a YouTube video without a recipe, and do jujitsu.",
];

export default function Home() {
  const previewComponents = React.useMemo(() => getMarkdownComponents(true), []);
  const thoughtPreviews = useThoughtPreviews(2);
  const [heroIndex, setHeroIndex] = React.useState(() =>
    heroImages.length ? Math.floor(Math.random() * heroImages.length) : 0,
  );
  const heroImage = heroImages[heroIndex];

  const shuffleHero = () => {
    if (!heroImages.length) return;
    setHeroIndex((current) => (current + 1) % heroImages.length);
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-canvas text-ink">
      <SEO
        title="Ivan Tregear - Engineer & Entrepreneur"
        description="Chief Technology Officer at KAIKAKU, working on fast food robotics and automation. Co-founder of KAIKAKU and Apollo Tech, Forbes 30 Under 30."
        url="https://ivantregear.com/"
        type="website"
      />
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-32 left-[10%] h-80 w-80 rounded-full bg-gradient-to-br from-terracotta/20 to-transparent blur-3xl" />
        <div className="absolute top-40 right-[-5%] h-[420px] w-[420px] rounded-full bg-gradient-to-tr from-forest/15 to-transparent blur-[120px]" />
      </div>

      <header className="relative">
        <div className="mx-auto max-w-6xl px-4 pb-4 pt-8 sm:px-6 lg:px-8">
          <TabsNav />
        </div>
      </header>

      <main className="relative mx-auto flex max-w-6xl flex-col gap-8 px-4 pb-16 sm:px-6 lg:px-8 lg:pb-24">
        <section className="grid gap-6 lg:grid-cols-[1fr_1fr] lg:items-center">
          <h1 className="font-display text-4xl leading-tight text-ink sm:text-5xl">
            Ivan Tregear
          </h1>

          <div className="flex items-center justify-center">
            {heroImage && (
              <img
                src={heroImage.src}
                alt={heroImage.label}
                onClick={shuffleHero}
                className="hero-image h-auto max-h-[360px] w-full max-w-sm cursor-pointer object-contain transition-opacity hover:opacity-80"
                draggable={false}
              />
            )}
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-12">
          <DocumentSection
            title="At a Glance"
            className="lg:col-span-5"
          >
            <ul className="space-y-3 text-base text-oak">
              {quickFacts.map((fact) => (
                <li key={fact} className="flex items-start gap-3">
                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-forest/60" aria-hidden="true" />
                  <span>{fact}</span>
                </li>
              ))}
            </ul>
          </DocumentSection>
          <DocumentSection
            title="About"
            className="lg:col-span-7"
          >
            {summaryParagraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </DocumentSection>
        </section>

        <section className="grid gap-6 lg:grid-cols-12">
          <DocumentSection
            title="Links"
            className="lg:col-span-5"
          >
            <div className="space-y-3">
              {referenceLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackExternalLinkClick(link.href)}
                  className="group flex flex-col rounded-xl border border-sandstone/40 bg-white/60 px-4 py-3 transition hover:border-forest/40"
                >
                  <span className="font-medium text-ink group-hover:text-forest">{link.label}</span>
                  <span className="text-sm text-stone">{link.description}</span>
                </a>
              ))}
            </div>
          </DocumentSection>

          <div className="flex flex-col gap-6 lg:col-span-7">
            <DocumentSection title="Latest Thoughts">
              {thoughtPreviews.length === 0 ? (
                <p className="text-sm text-stone">New essays coming soon.</p>
              ) : (
                <div className="space-y-4">
                  {thoughtPreviews.map((post) => (
                    <a
                      key={post.slug}
                      href={`/thoughts/${post.slug}`}
                      className="block rounded-xl border border-transparent bg-white/50 px-4 py-3 transition hover:border-forest/40"
                    >
                      <p className="font-medium text-ink">{post.title}</p>
                      {post.date && (
                        <time
                          className="text-[11px] uppercase tracking-[0.3em] text-stone"
                          dateTime={post.date}
                        >
                          {new Date(post.date).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                          })}
                        </time>
                      )}
                      <div className="pt-2 text-sm leading-relaxed text-stone">
                        <ReactMarkdown components={previewComponents}>{post.excerpt}</ReactMarkdown>
                      </div>
                    </a>
                  ))}
                </div>
              )}
            </DocumentSection>

            <DocumentSection title="Connect">
              <div className="flex items-center gap-4">
                {socialLinks.map((link) => {
                  const Icon = link.icon;
                  return (
                    <a
                      key={link.href}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => trackExternalLinkClick(link.href)}
                      aria-label={link.label}
                      className="flex h-9 w-9 items-center justify-center rounded-full border border-sandstone/50 bg-white/60 text-lg text-oak transition hover:text-forest hover:border-forest/40"
                    >
                      <Icon />
                    </a>
                  );
                })}
              </div>
            </DocumentSection>
          </div>
        </section>

        <footer className="flex flex-col items-center gap-1 border-t border-sandstone/40 pt-8 text-center text-xs tracking-wide text-stone/60">
          <p>&copy; {new Date().getFullYear()} Ivan Tregear</p>
        </footer>
      </main>
    </div>
  );
}
