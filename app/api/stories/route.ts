import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const stories = await prisma.story.findMany({
    orderBy: {
      rank: "asc",
    },
    take: 100,
  });

  return NextResponse.json(stories);
}
