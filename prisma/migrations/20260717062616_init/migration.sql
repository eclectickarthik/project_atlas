-- CreateTable
CREATE TABLE "Story" (
    "id" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "by" TEXT NOT NULL,
    "url" TEXT,
    "text" TEXT,
    "score" INTEGER NOT NULL,
    "descendants" INTEGER NOT NULL,
    "time" TIMESTAMP(3) NOT NULL,
    "fetchedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Story_pkey" PRIMARY KEY ("id")
);
