"use client";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { formatPostDate, formatReadTime } from "@/lib/blog-utils";
import { cn } from "@/lib/utils";

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
}) => {
  const hasMeta = category || tag || tags?.length || readingTime;
  const hasFooter = writer || publishedAt;

  return (
    <Card className="flex w-full flex-col gap-3 overflow-hidden rounded-3xl border p-3 shadow-lg transition-shadow duration-300 hover:shadow-xl">
      {cover && (
        <CardHeader className="p-0">
          <div className="relative h-56 w-full">
            <img
              src={cover}
              alt={headline}
              className="h-full w-full rounded-2xl object-cover"
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
