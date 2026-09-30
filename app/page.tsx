import { prisma } from "@/lib/prisma";
import type { Story } from "@/lib/story";
import StoryExplorer from "@/components/StoryExplorer";
export const dynamic = "force-dynamic";
export default async function Home() {
  let stories: Story[] = [];
  let error: string | null = null;
  try { stories = await prisma.story.findMany({ orderBy: { rank: "asc" }, take: 100 }); }
  catch (cause) { console.error("Unable to load stories", cause); error = "We couldn’t load your feed. Check the database connection, then try refreshing."; }
  return <StoryExplorer stories={stories} initialError={error} />;
}
