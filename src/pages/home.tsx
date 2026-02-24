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
  "Current youngest chartered engineer in the UK",
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
  "Fast food robotics",
  "Imperial College London",
  "Forbes 30 Under 30",
  "Hospitality automation",
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
        <div className="mx-auto max-w-6xl px-4 pb-6 pt-8 sm:px-6 lg:px-8">
          <TabsNav />
        </div>
      </header>

      <main className="relative mx-auto flex max-w-6xl flex-col gap-12 px-4 pb-16 sm:px-6 lg:px-8 lg:pb-24">
        <section className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div className="space-y-6">
            <p className="text-[11px] font-semibold uppercase tracking-[0.6em] text-stone">Ivan Tregear</p>
            <div className="space-y-4">
              <h1 className="font-display text-4xl leading-tight text-ink sm:text-5xl">
                Serene robotics for the most human industry on earth.
              </h1>
              <p className="text-lg text-oak/90">
                CTO & Co-founder at KAIKAKU, building fast food robotics that let teams focus on
                hospitality. Engineering instincts shaped by Imperial College London and a love of
                mechatronics, sailing, voice work, and carefully made food.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              {highlightChips.map((chip) => (
                <span
                  key={chip}
                  className="rounded-full border border-sandstone/60 bg-paper/70 px-4 py-1.5 text-sm font-medium text-stone shadow-sm"
                >
                  {chip}
                </span>
              ))}
            </div>
            <div className="flex flex-wrap gap-4 pt-2">
              <a
                href="https://www.kaikaku.ai/"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackExternalLinkClick("https://www.kaikaku.ai/")}
                className="inline-flex items-center gap-2 rounded-full border border-forest/20 bg-forest px-6 py-3 text-sm font-semibold text-white shadow-soft transition hover:-translate-y-0.5"
              >
                Visit KAIKAKU
              </a>
              <a
                href="/thoughts"
                className="inline-flex items-center gap-2 rounded-full border border-sandstone/80 bg-white/70 px-6 py-3 text-sm font-semibold text-forest transition hover:border-forest/50"
              >
                Explore Thoughts
              </a>
            </div>
          </div>

          <div className="relative">
            <div className="relative overflow-hidden rounded-[42px] border border-sandstone/60 bg-paper/80 shadow-soft backdrop-blur-3xl">
              {heroImage && (
                <img
                  src={heroImage.src}
                  alt={heroImage.label}
                  className="hero-image h-[420px] w-full object-cover"
                  draggable={false}
                />
              )}
              <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-4 bg-gradient-to-t from-canvas/90 via-canvas/20 to-transparent px-6 py-4 backdrop-blur">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.45em] text-stone">Studio Archive</p>
                  <p className="font-display text-xl text-ink">{heroImage?.label}</p>
                </div>
                {heroImages.length > 1 && (
                  <button
                    type="button"
                    onClick={shuffleHero}
                    className="rounded-full border border-sandstone/60 bg-white/70 px-4 py-2 text-sm font-semibold text-forest transition hover:border-forest/60"
                  >
                    Shuffle
                  </button>
                )}
              </div>
            </div>
            <div className="mt-4 flex justify-end text-xs uppercase tracking-[0.35em] text-stone/70">
              refreshed on each visit
            </div>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-12">
          <DocumentSection
            eyebrow="Credentials"
            title="Personnel File"
            footer="UPDATED: JUN 2025"
            className="lg:col-span-5"
          >
            <ul className="space-y-3 text-base text-oak">
              {quickFacts.map((fact) => (
                <li key={fact} className="flex items-start gap-3">
                  <span className="mt-1 h-2.5 w-2.5 rounded-full bg-forest/70" aria-hidden="true" />
                  <span>{fact}</span>
                </li>
              ))}
            </ul>
          </DocumentSection>
          <DocumentSection
            eyebrow="Operational Brief"
            title="Summary"
            footer={`DOCUMENT TYPE: BRIEFING\nORIGIN: TECHNICAL DIVISION`}
            className="lg:col-span-7"
          >
            {summaryParagraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </DocumentSection>
        </section>

        <section className="grid gap-6 lg:grid-cols-12">
          <DocumentSection
            eyebrow="Access Level: Public"
            title="Reference Materials"
            accent="terracotta"
            className="lg:col-span-6"
          >
            <div className="space-y-3">
              {referenceLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackExternalLinkClick(link.href)}
                  className="group flex flex-col rounded-2xl border border-sandstone/60 bg-white/70 px-4 py-3 transition hover:border-forest/50"
                >
                  <span className="font-semibold text-ink group-hover:text-forest">{link.label}</span>
                  <span className="text-sm text-stone">{link.description}</span>
                </a>
              ))}
            </div>
          </DocumentSection>

          <DocumentSection
            eyebrow="Status: Active"
            title="Communications"
            className="lg:col-span-3"
          >
            <div className="flex items-center justify-between gap-3">
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
                    className="social-icon flex h-12 w-12 items-center justify-center rounded-full border border-sandstone/70 bg-white/70 text-2xl text-ink"
                  >
                    <Icon />
                  </a>
                );
              })}
            </div>
          </DocumentSection>

          <DocumentSection
            eyebrow="Notebook"
            title="Latest Thoughts"
            className="lg:col-span-3"
          >
            {thoughtPreviews.length === 0 ? (
              <p className="text-sm text-stone">Collecting new essays. Check back soon.</p>
            ) : (
              <div className="space-y-4">
                {thoughtPreviews.map((post) => (
                  <a
                    key={post.slug}
                    href={`/thoughts/${post.slug}`}
                    className="block rounded-2xl border border-transparent bg-white/60 px-3 py-2 transition hover:border-forest/40"
                  >
                    <p className="text-sm font-semibold text-ink">{post.title}</p>
                    {post.date && (
                      <time
                        className="text-[11px] uppercase tracking-[0.4em] text-stone"
                        dateTime={post.date}
                      >
                        {new Date(post.date).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                        })}
                      </time>
                    )}
                    <div className="pt-1 text-sm text-stone">
                      <ReactMarkdown components={previewComponents}>{post.excerpt}</ReactMarkdown>
                    </div>
                  </a>
                ))}
              </div>
            )}
          </DocumentSection>
        </section>

        <footer className="flex flex-col items-center gap-2 border-t border-sandstone/60 pt-10 text-center text-xs uppercase tracking-[0.35em] text-stone/80">
          <p>Confidential personnel file • Authorised access only</p>
          <p>Document ID: IT-001 • Living archive</p>
        </footer>
      </main>
    </div>
  );
}
