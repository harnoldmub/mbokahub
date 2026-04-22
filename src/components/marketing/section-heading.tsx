import { cn } from "@/lib/utils";

type SectionHeadingProps = {
  number?: string;
  eyebrow: string;
  title: string;
  description?: string;
  className?: string;
};

export function SectionHeading({
  number,
  eyebrow,
  title,
  description,
  className,
}: SectionHeadingProps) {
  return (
    <div className={cn("max-w-4xl", className)}>
      <div className="flex items-center gap-4 mb-6">
        {number ? (
          <span className="font-display text-6xl text-blood opacity-20 leading-none">
            {number}
          </span>
        ) : null}
        <div className="h-px flex-1 bg-blood opacity-20" />
        <span className="font-mono text-xs uppercase tracking-[0.3em] text-blood">
          {eyebrow}
        </span>
      </div>

      <h2 className="font-serif italic font-black text-4xl sm:text-6xl text-paper leading-[1.1]">
        {title}
      </h2>

      {description && (
        <p className="mt-8 font-body text-lg text-paper-dim leading-relaxed max-w-2xl">
          {description}
        </p>
      )}
    </div>
  );
}
