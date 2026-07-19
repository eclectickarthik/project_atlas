"use client";

import { formatDistanceToNow } from "date-fns";
import { RefreshCw } from "lucide-react";

import { Button } from "@/components/ui/button";

type HeaderProps = {
  hasUpdates: boolean;
  lastSynced: string | null;
  isRefreshing: boolean;
  onRefresh: () => void;
};

export default function Header({
  hasUpdates,
  lastSynced,
  isRefreshing,
  onRefresh,
}: HeaderProps) {
  const syncedText = lastSynced
    ? `Synced ${formatDistanceToNow(new Date(lastSynced), {
        addSuffix: true,
      })}`
    : "Not synced yet";

  return (
    <header className="mb-6 border-b border-zinc-800 pb-5">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3">
            <div className="h-3 w-3 rounded-sm bg-[#ff6600]" />

            <h1 className="text-3xl font-bold tracking-tight text-zinc-100">
              Project Atlas
            </h1>
          </div>

          <p className="mt-2 text-sm text-zinc-400">
            Browse today's top Hacker News stories.
          </p>

          <div className="mt-3 flex items-center gap-4 text-sm">
            <a
              href="https://github.com/eclectickarthik/project_atlas/blob/main/Roadmap.md"
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-500 transition-colors hover:text-[#ff6600]"
            >
              Roadmap
            </a>

            <span className="text-zinc-700">•</span>

            <a
              href="https://github.com/eclectickarthik/project_atlas"
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-500 transition-colors hover:text-[#ff6600]"
            >
              GitHub
            </a>

            <span className="text-zinc-700">•</span>

            <a
              href="https://github.com/eclectickarthik/project_atlas/releases"
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-500 transition-colors hover:text-[#ff6600]"
            >
              Releases
            </a>
          </div>
        </div>

        <Button
          variant="outline"
          onClick={onRefresh}
          disabled={isRefreshing}
          className="border-zinc-700 bg-zinc-900 text-zinc-200 hover:border-[#ff6600] hover:bg-zinc-800 hover:text-white"
        >
          <RefreshCw
            className={`mr-2 h-4 w-4 text-[#ff6600] ${
              isRefreshing ? "animate-spin" : ""
            }`}
          />

          {isRefreshing ? "Refreshing..." : "Refresh"}
        </Button>
      </div>

      <div className="mt-4 flex items-center gap-6 text-sm">
        <span className="text-zinc-500">{syncedText}</span>

        {hasUpdates && (
          <span className="flex items-center gap-2 font-medium text-[#ff6600]">
            <span className="h-2 w-2 rounded-full bg-[#ff6600]" />
            New stories available
          </span>
        )}
      </div>
    </header>
  );
}
