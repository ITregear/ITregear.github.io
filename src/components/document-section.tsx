import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface DocumentSectionProps {
  title: string;
  children: ReactNode;
  footer?: string;
  className?: string;
  eyebrow?: string;
  accent?: "forest" | "terracotta";
  actions?: ReactNode;
}

const accentGradients: Record<NonNullable<DocumentSectionProps["accent"]>, string> = {
  forest: "from-forest/60 via-forest/20 to-transparent",
  terracotta: "from-terracotta/60 via-terracotta/20 to-transparent",
};

export default function DocumentSection({
  title,
  children,
  footer,
  className = "",
  eyebrow,
  accent = "forest",
  actions,
}: DocumentSectionProps) {
  const gradient = accentGradients[accent];

  return (
    <section
      className={cn(
        "relative overflow-hidden rounded-[28px] border border-sandstone/60 bg-paper/80 px-5 py-6 sm:px-7 sm:py-8 shadow-soft backdrop-blur-[24px]",
        className,
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute inset-x-6 top-3 h-1 rounded-full blur-[1px]",
          "bg-gradient-to-r",
          gradient,
        )}
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-grid-soft opacity-[0.15]"
      />
      <div className="relative flex flex-col gap-4">
        <header className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
          <div>
            {eyebrow && (
              <p className="text-[10px] font-semibold uppercase tracking-[0.55em] text-clay/70">
                {eyebrow}
              </p>
            )}
            <h2 className="font-display text-[1.4rem] text-ink/90 sm:text-2xl">{title}</h2>
          </div>
          {actions}
        </header>
        <div className="text-base leading-relaxed text-oak [&>*+*]:mt-3">{children}</div>
        {footer && (
          <footer className="pt-4 text-[11px] uppercase tracking-[0.35em] text-stone/70">
            {footer.split("\n").map((line, idx) => (
              <span key={`${line}-${idx}`} className="block">
                {line}
              </span>
            ))}
          </footer>
        )}
      </div>
    </section>
  );
}
