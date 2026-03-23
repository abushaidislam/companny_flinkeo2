import { cn } from "@/lib/utils";

type SectionIntroProps = {
  eyebrow?: string;
  title: string;
  description: string;
  align?: "left" | "center";
  className?: string;
};

const alignmentClasses = {
  left: "text-left",
  center: "text-center mx-auto",
};

export default function SectionIntro({
  eyebrow,
  title,
  description,
  align = "center",
  className,
}: SectionIntroProps) {
  return (
    <div
      className={cn(
        "mb-12 max-w-3xl space-y-4 md:mb-16",
        alignmentClasses[align],
        className,
      )}
    >
      {eyebrow ? (
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-text-secondary">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="text-3xl font-display font-bold tracking-tight text-foreground md:text-5xl">
        {title}
      </h2>
      <p className="text-base leading-relaxed text-text-secondary md:text-lg">
        {description}
      </p>
    </div>
  );
}
