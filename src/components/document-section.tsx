import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface DocumentSectionProps {
  title: string;
  children: ReactNode;
  footer?: string;
  className?: string;
  eyebrow?: string;
  actions?: ReactNode;
}

export default function DocumentSection({
  title,
  children,
  footer,
  className = "",
  eyebrow,
  actions,
}: DocumentSectionProps) {
  return (
    <section
      className={cn(
        "relative rounded-2xl border border-sandstone/50 bg-paper/80 px-5 py-6 sm:px-7 sm:py-8 shadow-soft backdrop-blur-sm",
        className,
      )}
    >
      <div className="flex flex-col gap-4">
        <header className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
          <div>
            {eyebrow && (
              <p className="text-[10px] font-medium uppercase tracking-[0.4em] text-stone/70">
                {eyebrow}
              </p>
            )}
            <h2 className="font-display text-[1.4rem] text-ink/90 sm:text-2xl">{title}</h2>
          </div>
          {actions}
        </header>
        <div className="text-base leading-relaxed text-oak [&>*+*]:mt-3">{children}</div>
        {footer && (
          <footer className="pt-3 text-[11px] uppercase tracking-[0.3em] text-stone/60">
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
