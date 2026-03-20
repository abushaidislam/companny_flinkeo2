  import * as React from "react";

  import { cn } from "@/lib/utils";

  export type GridFeature = {
    title: string;
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
    description: string;
  };

  type FeatureCardProps = React.ComponentProps<"div"> & {
    feature: GridFeature;
  };

  export function FeatureCard({ feature, className, ...props }: FeatureCardProps) {
    const p = genRandomPattern();

    return (
      <div className={cn("relative overflow-hidden p-7 md:p-8", className)} {...props}>
        <div className="pointer-events-none absolute left-1/2 top-0 -ml-20 -mt-2 h-full w-full [mask-image:linear-gradient(white,transparent)]">
          <div className="absolute inset-0 bg-gradient-to-r from-foreground/5 to-foreground/[0.03] [mask-image:radial-gradient(farthest-side_at_top,white,transparent)] opacity-100">
            <GridPattern
              width={20}
              height={20}
              x="-12"
              y="4"
              squares={p}
              className="absolute inset-0 h-full w-full fill-foreground/5 stroke-foreground/25 mix-blend-overlay"
            />
          </div>
        </div>

        <feature.icon className="size-7 text-foreground/75" strokeWidth={1} aria-hidden />
        <h3 className="mt-11 text-sm md:text-base font-display font-semibold text-foreground">{feature.title}</h3>
        <p className="relative z-20 mt-2 text-xs md:text-sm font-light text-muted-foreground">{feature.description}</p>
      </div>
    );
  }

  function GridPattern({
    width,
    height,
    x,
    y,
    squares,
    ...props
  }: React.ComponentProps<"svg"> & { width: number; height: number; x: string; y: string; squares?: number[][] }) {
    const patternId = React.useId();

    return (
      <svg aria-hidden="true" {...props}>
        <defs>
          <pattern id={patternId} width={width} height={height} patternUnits="userSpaceOnUse" x={x} y={y}>
            <path d={`M.5 ${height}V.5H${width}`} fill="none" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" strokeWidth={0} fill={`url(#${patternId})`} />
        {squares && (
          <svg x={x} y={y} className="overflow-visible">
            {squares.map(([sx, sy], index) => (
              <rect
                strokeWidth="0"
                key={index}
                width={width + 1}
                height={height + 1}
                x={sx * width}
                y={sy * height}
              />
            ))}
          </svg>
        )}
      </svg>
    );
  }

  function genRandomPattern(length?: number): number[][] {
    const count = length ?? 5;
    return Array.from({ length: count }, () => [
      Math.floor(Math.random() * 4) + 7,
      Math.floor(Math.random() * 6) + 1,
    ]);
  }

