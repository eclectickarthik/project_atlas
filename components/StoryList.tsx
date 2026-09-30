"use client";
import { useState } from "react";
import type { Story } from "@/lib/story";
import StoryTile from "./StoryTile";
export default function StoryList({ stories }: { stories: Story[] }) {
  const [visibleCount, setVisibleCount] = useState(20);
  return <div>{stories.slice(0, visibleCount).map(story => <StoryTile key={story.id} story={story} />)}<div className="feed-footer"><span>Showing {Math.min(visibleCount, stories.length)} of {stories.length} stories</span>{visibleCount < stories.length && <button className="quiet-button" onClick={() => setVisibleCount(count => count + 20)}>Load more stories</button>}</div></div>;
}
