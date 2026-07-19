-- CreateTable
CREATE TABLE "AppState" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "lastSynced" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AppState_pkey" PRIMARY KEY ("id")
);
