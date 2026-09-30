import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

const STORIES_TO_SYNC = 100;

type HNStory = { id: number; rank: number; title: string; by: string; type: string; url?: string; text?: string; score?: number; descendants?: number; time: number; deleted?: boolean; dead?: boolean };

export async function POST() {
  try {
    // Step 1: Fetch latest Hacker News story IDs
    const response = await fetch(
      "https://hacker-news.firebaseio.com/v0/topstories.json",
      {
        cache: "no-store",
        signal: AbortSignal.timeout(15000),
      },
    );

    if (!response.ok) {
      throw new Error("Failed to fetch Hacker News story IDs.");
    }

    const storyIds: number[] = await response.json();

    // Step 2: Pick the first 100 stories
    const latestStoryIds = storyIds.slice(0, STORIES_TO_SYNC);

    // Step 3: Fetch all stories in parallel (preserve rank)
    const storyResults = await Promise.allSettled(
      latestStoryIds.map(async (storyId, index) => {
        const response = await fetch(
          `https://hacker-news.firebaseio.com/v0/item/${storyId}.json`,
          {
            cache: "no-store",
        signal: AbortSignal.timeout(15000),
          },
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch story ${storyId}`);
        }

        const story = await response.json();
        if (!story || story.deleted || story.dead || typeof story.id !== "number" || typeof story.title !== "string" || typeof story.by !== "string" || typeof story.time !== "number") throw new Error("Invalid story");

        return {
          ...story,
          rank: index + 1,
        };
      }),
    );

    // Step 4: Keep only successful fetches
    const stories = storyResults
      .filter(
        (result): result is PromiseFulfilledResult<HNStory> =>
          result.status === "fulfilled",
      )
      .map((result) => result.value);

    if (stories.length !== latestStoryIds.length || stories.length === 0) {
      throw new Error("Incomplete feed; preserving existing stories for retry");
    }

    // Replace the ranked snapshot atomically so old ranks never leak into the feed.
    await prisma.$transaction(async (prisma) => {
    // Step 5: Save stories to PostgreSQL
    await Promise.all(
      stories.map((story) =>
        prisma.story.upsert({
          where: {
            id: story.id,
          },
          update: {
            rank: story.rank,
            title: story.title,
            by: story.by,
            type: story.type,
            url: story.url,
            text: story.text,
            score: story.score ?? 0,
            descendants: story.descendants ?? 0,
            time: new Date(story.time * 1000),
          },
          create: {
            id: story.id,
            rank: story.rank,
            title: story.title,
            by: story.by,
            type: story.type,
            url: story.url,
            text: story.text,
            score: story.score ?? 0,
            descendants: story.descendants ?? 0,
            time: new Date(story.time * 1000),
          },
        }),
      ),
    );

    // Step 6: Update last synced time
    await prisma.appState.upsert({
      where: {
        id: 1,
      },
      update: {
        lastSynced: new Date(),
      },
      create: {
        id: 1,
        lastSynced: new Date(),
      },
    });

    await prisma.story.deleteMany({ where: { id: { notIn: stories.map(story => story.id) } } });
    }, { timeout: 30000 });

    return NextResponse.json({
      success: true,
      synced: stories.length,
      message: `Successfully synced ${stories.length} stories.`,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to sync Hacker News stories.",
      },
      {
        status: 500,
      },
    );
  }
}
