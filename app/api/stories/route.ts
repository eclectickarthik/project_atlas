import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
 try {
  const stories = await prisma.story.findMany({
    orderBy: {
      rank: "asc",
    },
    take: 100,
  });

  return NextResponse.json(stories);

 } catch (error) {
 console.error("Database request failed", error);
 return NextResponse.json({ message: "The feed is temporarily unavailable." }, { status: 503 });
 }
}
