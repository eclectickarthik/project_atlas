"use client";

import { useEffect, useMemo, useState } from "react";

import { ScrollArea } from "@/components/ui/scroll-area";

import Header from "./Header";
import SearchBar from "./SearchBar";
import StoryList from "./StoryList";

type Story = {
  id: number;
  rank: number;
  title: string;
  by: string;
  url: string | null;
  score: number;
  descendants: number;
  time: Date;
};

type StoryExplorerProps = {
  stories: Story[];
};

export default function StoryExplorer({ stories }: StoryExplorerProps) {
  const [displayedStories, setDisplayedStories] = useState(stories);

  const [search, setSearch] = useState("");

  const [lastSynced, setLastSynced] = useState<string | null>(null);

  const [hasUpdates, setHasUpdates] = useState(false);

  const [isRefreshing, setIsRefreshing] = useState(false);

  const filteredStories = useMemo(() => {
    return displayedStories.filter((story) =>
      story.title.toLowerCase().includes(search.toLowerCase()),
    );
  }, [displayedStories, search]);

  useEffect(() => {
    let mounted = true;

    async function checkStatus() {
      try {
        const response = await fetch("/api/status", {
          cache: "no-store",
        });

        const status = await response.json();

        if (!mounted) return;

        if (lastSynced === null) {
          setLastSynced(status.lastSynced);
          return;
        }

        if (status.lastSynced !== lastSynced) {
          setHasUpdates(true);
        }
      } catch (err) {
        console.error(err);
      }
    }

    checkStatus();

    const interval = setInterval(checkStatus, 30000);

    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, [lastSynced]);

  async function refreshStories() {
    try {
      setIsRefreshing(true);

      // Sync latest stories
      const sync = await fetch("/api/sync");

      if (!sync.ok) {
        throw new Error("Sync failed");
      }

      // Reload stories
      const storiesResponse = await fetch("/api/stories", {
        cache: "no-store",
      });

      const latestStories = await storiesResponse.json();

      // Reload status
      const statusResponse = await fetch("/api/status", {
        cache: "no-store",
      });

      const latestStatus = await statusResponse.json();

      setDisplayedStories(latestStories);
      setLastSynced(latestStatus.lastSynced);
      setHasUpdates(false);
    } catch (err) {
      console.error(err);
    } finally {
      setIsRefreshing(false);
    }
  }

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <Header
        hasUpdates={hasUpdates}
        lastSynced={lastSynced}
        isRefreshing={isRefreshing}
        onRefresh={refreshStories}
      />

      <SearchBar
        search={search}
        onSearchChange={setSearch}
        resultCount={filteredStories.length}
      />

      <div className="mt-6 flex-1 overflow-hidden">
        <ScrollArea className="h-full pr-2">
          {filteredStories.length > 0 ? (
            <StoryList stories={filteredStories} />
          ) : (
            <div className="flex h-[60vh] items-center justify-center rounded-xl border border-zinc-800">
              <div className="text-center">
                <h2 className="text-lg font-semibold text-zinc-200">
                  No stories found
                </h2>

                <p className="mt-2 text-sm text-zinc-500">
                  Try another search term.
                </p>
              </div>
            </div>
          )}
        </ScrollArea>
      </div>
    </div>
  );
}
