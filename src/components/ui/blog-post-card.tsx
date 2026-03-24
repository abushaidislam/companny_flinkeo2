"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { formatPostDate, formatReadTime } from "@/lib/blog-utils";
import { cn } from "@/lib/utils";
import { Clock3 } from "lucide-react";

export interface ArticleCardProps {
  headline: string;
  excerpt: string;
  cover?: string;
  category?: string;
  tag?: string;
  tags?: string[];
  readingTime?: number;
  writer?: string;
  publishedAt?: Date;
  clampLines?: number;
  variant?: "default" | "editorial";
}

export const ArticleCard: React.FC<ArticleCardProps> = ({
  cover,
  category,
  tag,
  tags,
  readingTime,
  headline,
  excerpt,
  writer,
  publishedAt,
  clampLines,
  variant = "default",
}) => {
  const [hasImageError, setHasImageError] = useState(false);
  const hasMeta = category || tag || tags?.length || readingTime;
  const hasFooter = writer || publishedAt;
  const displayLabel = category || tag || tags?.[0] || "Article";
  const showCover = Boolean(cover) && !hasImageError;
  const editorialTitleClampClass =
    "overflow-hidden text-ellipsis [display:-webkit-box] [-webkit-box-orient:vertical]";

  useEffect(() => {
    setHasImageError(false);
  }, [cover]);

  if (variant === "editorial") {
    return (
      <article className="group flex h-full flex-col gap-5">
        <div className="relative overflow-hidden rounded-[28px] bg-[#ece6da]">
          <div className="aspect-[1.48] w-full">
            {showCover ? (
              <img
                src={cover}
                alt={headline}
                className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                onError={() => setHasImageError(true)}
              />
            ) : (
              <div className="flex h-full w-full items-end bg-[linear-gradient(145deg,#f1ebdf_0%,#e5ddd0_45%,#d2c6b7_100%)] p-6">
                <div className="max-w-[16rem]">
                  <p className="mb-2 text-xs font-medium uppercase tracking-[0.28em] text-stone-500">
                    {displayLabel}
                  </p>
                  <p className="text-xl font-semibold leading-tight text-stone-800">
                    Editorial preview
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-3 px-1">
          {hasMeta && (
            <div className="flex flex-wrap items-center gap-2 text-[0.95rem] text-stone-500">
              <span className="font-medium text-stone-600">{displayLabel}</span>
              {readingTime ? (
                <>
                  <span>/</span>
                  <span className="inline-flex items-center gap-1.5">
                    <Clock3 className="h-3.5 w-3.5" />
                    {Math.max(1, Math.round(readingTime))} min
                  </span>
                </>
              ) : null}
            </div>
          )}

          <h2
            className={cn(
              "font-display text-[1.18rem] font-semibold leading-[1.2] tracking-[-0.02em] text-foreground transition-colors duration-300 group-hover:text-primary sm:text-[1.28rem] md:text-[1.38rem]",
              editorialTitleClampClass,
            )}
            style={{ WebkitLineClamp: 4 }}
          >
            {headline}
          </h2>

          <p
            className={cn("text-[0.98rem] leading-7 text-muted-foreground", {
              "overflow-hidden text-ellipsis [-webkit-box-orient:vertical] [display:-webkit-box]":
                clampLines && clampLines > 0,
            })}
            style={{
              WebkitLineClamp: clampLines,
            }}
          >
            {excerpt}
          </p>
        </div>
      </article>
    );
  }

  return (
    <Card className="flex w-full flex-col gap-3 overflow-hidden rounded-3xl border p-3 shadow-lg transition-shadow duration-300 hover:shadow-xl">
      {showCover && (
        <CardHeader className="p-0">
          <div className="relative h-56 w-full">
            <img
              src={cover}
              alt={headline}
              className="h-full w-full rounded-2xl object-cover"
              onError={() => setHasImageError(true)}
            />
          </div>
        </CardHeader>
      )}

      <CardContent className="flex-grow p-3">
        {hasMeta && (
          <div className="mb-4 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            {category && <Badge className="rounded-full px-3 py-1 text-sm">{category}</Badge>}
            {tags?.map((item) => (
              <Badge key={item} variant="outline" className="text-xs">
                #{item}
              </Badge>
            ))}
            {tag && !tags?.includes(tag) && (
              <Badge className="rounded-full bg-muted px-3 py-1 text-sm text-muted-foreground hover:bg-muted/80 hover:text-black">
                {tag}
              </Badge>
            )}
            {(category || tag || tags?.length) && readingTime && <span className="mx-1">|</span>}
            {readingTime && <span>{formatReadTime(readingTime)}</span>}
          </div>
        )}

        <h2 className="mb-2 text-2xl font-bold leading-tight text-card-foreground font-bangla">
          {headline}
        </h2>

        <p
          className={cn("text-muted-foreground font-bangla", {
            "overflow-hidden text-ellipsis [-webkit-box-orient:vertical] [display:-webkit-box]":
              clampLines && clampLines > 0,
          })}
          style={{
            WebkitLineClamp: clampLines,
          }}
        >
          {excerpt}
        </p>
      </CardContent>

      {hasFooter && (
        <CardFooter className="flex items-center justify-between p-3">
          {writer && (
            <div>
              <p className="text-sm text-muted-foreground">By</p>
              <p className="font-semibold text-muted-foreground font-bangla">{writer}</p>
            </div>
          )}
          {publishedAt && (
            <div className={writer ? "text-right" : ""}>
              <p className="text-sm text-muted-foreground">Published</p>
              <p className="font-semibold text-muted-foreground font-bangla">
                {formatPostDate(publishedAt)}
              </p>
            </div>
          )}
        </CardFooter>
      )}
    </Card>
  );
};
