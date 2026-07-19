import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const appState = await prisma.appState.findUnique({
    where: {
      id: 1,
    },
  });

  const storyCount = await prisma.story.count();

  return NextResponse.json({
    lastSynced: appState?.lastSynced ?? null,
    storyCount,
  });
}
