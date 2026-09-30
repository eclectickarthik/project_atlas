export type Story = { id: number; rank: number; title: string; by: string; url: string | null; score: number; descendants: number; time: Date | string };
export const STORY_ORDERS = [
  { value: "rank", label: "HN rank", description: "Hacker News ranking" },
  { value: "newest", label: "Newest first", description: "newest to oldest" },
  { value: "oldest", label: "Oldest first", description: "oldest to newest" },
  { value: "points", label: "Most points", description: "highest points first" },
  { value: "comments", label: "Most comments", description: "most comments first" },
] as const;

export type StoryOrder = (typeof STORY_ORDERS)[number]["value"];

export function sortStories(stories: Story[], order: StoryOrder): Story[] {
  return [...stories].sort((a, b) => {
    let difference = 0;
    switch (order) {
      case "newest":
      case "oldest": {
        const aTime = new Date(a.time).getTime();
        const bTime = new Date(b.time).getTime();
        // Unknown timestamps belong at the end in either direction.
        if (Number.isNaN(aTime) !== Number.isNaN(bTime)) {
          return Number.isNaN(aTime) ? 1 : -1;
        }
        difference = order === "newest" ? bTime - aTime : aTime - bTime;
        break;
      }
      case "points":
        difference = b.score - a.score;
        break;
      case "comments":
        difference = b.descendants - a.descendants;
        break;
    }
    return difference || a.rank - b.rank || a.id - b.id;
  });
}

export function articleUrl(url: string | null): string | null {
  try { const parsed = new URL(url ?? ""); return ["https:", "http:"].includes(parsed.protocol) ? parsed.href : null; } catch { return null; }
}
export function storyDomain(url: string | null): string {
  const safe = articleUrl(url); return safe ? new URL(safe).hostname.replace(/^www\./, "") : "news.ycombinator.com";
}
