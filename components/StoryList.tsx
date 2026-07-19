"use client";

import { useEffect, useState } from "react";

import StoryTile from "./StoryTile";

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

type StoryListProps = {
  stories: Story[];
};

const STORIES_PER_PAGE = 20;

export default function StoryList({ stories }: StoryListProps) {
  const [visibleCount, setVisibleCount] = useState(STORIES_PER_PAGE);

  useEffect(() => {
    setVisibleCount(STORIES_PER_PAGE);
  }, [stories]);

  const visibleStories = stories.slice(0, visibleCount);

  return (
    <div className="space-y-4">
      {visibleStories.map((story) => (
        <StoryTile key={story.id} story={story} />
      ))}

      {visibleCount < stories.length && (
        <div className="flex justify-center py-4">
          <button
            onClick={() => setVisibleCount((prev) => prev + STORIES_PER_PAGE)}
            className="
              rounded-md
              border
              border-zinc-700
              bg-zinc-900
              px-5
              py-2
              text-sm
              font-medium
              text-zinc-300
              transition-all
              hover:border-[#ff6600]
              hover:text-[#ff6600]
            "
          >
            Load 20 More Stories
          </button>
        </div>
      )}
    </div>
  );
}
