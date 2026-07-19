"use client";

import { formatDistanceToNow } from "date-fns";
import { ArrowUpRight, MessageCircle, Triangle } from "lucide-react";

import { Card } from "@/components/ui/card";

type Story = {
  id: number;
  rank: number;
  title: string;
  by: string;
  url: string | null;
  score: number;
  descendants: number;
  time: Date;
};

type StoryTileProps = {
  story: Story;
};

export default function StoryTile({ story }: StoryTileProps) {
  const domain = story.url
    ? new URL(story.url).hostname.replace("www.", "")
    : "news.ycombinator.com";

  const discussionUrl = `https://news.ycombinator.com/item?id=${story.id}`;

  return (
    <Card
      className="
        border-zinc-800
        bg-zinc-900/70
        transition-all
        duration-200
        hover:-translate-y-0.5
        hover:border-[#ff6600]
        hover:bg-zinc-900
      "
    >
      <div className="p-4">
        <div className="flex items-start gap-3">
          <span className="mt-0.5 w-8 shrink-0 text-right text-sm font-medium text-zinc-500">
            {story.rank}
          </span>

          <div className="flex-1 min-w-0">
            <h2 className="text-base font-semibold leading-6 text-zinc-100">
              {story.title}
            </h2>

            <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-zinc-400">
              <div className="flex items-center gap-1">
                <Triangle className="h-3 w-3 fill-[#ff6600] text-[#ff6600]" />
                {story.score}
              </div>

              <div className="flex items-center gap-1">
                <MessageCircle className="h-3 w-3" />
                {story.descendants}
              </div>

              <span>by {story.by}</span>

              <span>•</span>

              <span>
                {formatDistanceToNow(new Date(story.time), {
                  addSuffix: true,
                })}
              </span>

              <span>•</span>

              <span className="text-zinc-500">{domain}</span>
            </div>

            <div className="mt-2 flex items-center gap-3 text-sm font-medium">
              {story.url && (
                <a
                  href={story.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="
                    inline-flex
                    items-center
                    gap-1
                    text-zinc-300
                    transition-colors
                    hover:text-[#ff6600]
                  "
                >
                  Open Link
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </a>
              )}

              <span className="text-zinc-700">|</span>

              <a
                href={discussionUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="
                  text-zinc-500
                  transition-colors
                  hover:text-[#ff6600]
                "
              >
                Discussion
              </a>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
