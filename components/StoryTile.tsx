"use client";
import { formatDistanceToNow } from "date-fns";
import { ArrowUpRight, MessageSquare, Triangle } from "lucide-react";
import { articleUrl, storyDomain, type Story } from "@/lib/story";
export default function StoryTile({ story }: { story: Story }) {
  const discussion = "https://news.ycombinator.com/item?id=" + story.id;
  const time = new Date(story.time);
  return <article className="story-row"><span className="story-rank" title={"Hacker News rank " + story.rank} aria-label={"Hacker News rank " + story.rank}>#{String(story.rank).padStart(2, "0")}</span><div className="story-content">
    <h2><a href={articleUrl(story.url) ?? discussion} target="_blank" rel="noopener noreferrer">{story.title}<ArrowUpRight size={14} /></a></h2>
    <div className="story-meta"><span className="story-domain">{storyDomain(story.url)}</span><span><Triangle size={10} /> {story.score} points</span><a href={discussion} target="_blank" rel="noopener noreferrer"><MessageSquare size={12} /> {story.descendants} comments</a><span>by {story.by}</span>{!Number.isNaN(time.getTime()) && <time dateTime={time.toISOString()} suppressHydrationWarning>{formatDistanceToNow(time, { addSuffix: true })}</time>}</div>
  </div></article>;
}
