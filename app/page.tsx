import { prisma } from "@/lib/prisma";

import StoryExplorer from "@/components/StoryExplorer";

export default async function Home() {
  const stories = await prisma.story.findMany({
    orderBy: {
      rank: "asc",
    },
    take: 100,
  });

  return (
    <main className="h-screen overflow-hidden bg-zinc-950">
      <div className="mx-auto flex h-full max-w-6xl flex-col px-8 py-6">
        <StoryExplorer stories={stories} />
      </div>
    </main>
  );
}
