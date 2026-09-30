"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { BookOpen, ChevronRight, Code, Map, Newspaper, Search, ArrowUpRight } from "lucide-react";
import { sortStories, storyDomain, type Story, type StoryOrder } from "@/lib/story";
import Header from "./Header";
import SearchBar from "./SearchBar";
import StoryList from "./StoryList";

async function readResponse(response: Response) {
  if (!response.ok) throw new Error("Request failed");
  return response.json();
}

export default function StoryExplorer({ stories, initialError }: { stories: Story[]; initialError: string | null }) {
  const [displayedStories, setDisplayedStories] = useState(stories);
  const [search, setSearch] = useState("");
  const [order, setOrder] = useState<StoryOrder>("rank");
  const [lastSynced, setLastSynced] = useState<string | null>(null);
  const [hasUpdates, setHasUpdates] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState(initialError);
  const [revision, setRevision] = useState(0);
  const baseline = useRef<string | null | undefined>(undefined);
  const refreshLock = useRef(false);

  const filteredStories = useMemo(() => {
    const query = search.trim().toLowerCase();
    const matches = displayedStories.filter(story => [story.title, story.by, storyDomain(story.url)].some(value => value.toLowerCase().includes(query)));
    return sortStories(matches, order);
  }, [displayedStories, search, order]);

  useEffect(() => {
    const controller = new AbortController();
    async function checkStatus() {
      try {
        const status = await readResponse(await fetch("/api/status", { cache: "no-store", signal: controller.signal }));
        if (controller.signal.aborted || refreshLock.current) return;
        if (baseline.current === undefined) {
          baseline.current = status.lastSynced;
          setLastSynced(status.lastSynced);
        } else setHasUpdates(status.lastSynced !== baseline.current);
      } catch { /* A background status check must not interrupt reading. */ }
    }
    void checkStatus();
    const interval = setInterval(checkStatus, 30000);
    return () => { controller.abort(); clearInterval(interval); };
  }, []);

  async function refreshStories() {
    if (refreshLock.current) return;
    refreshLock.current = true;
    setIsRefreshing(true);
    setError(null);
    try {
      await readResponse(await fetch("/api/sync", { method: "POST", signal: AbortSignal.timeout(60000) }));
      const [latestStories, latestStatus] = await Promise.all([
        fetch("/api/stories", { cache: "no-store", signal: AbortSignal.timeout(15000) }).then(readResponse),
        fetch("/api/status", { cache: "no-store", signal: AbortSignal.timeout(15000) }).then(readResponse),
      ]);
      if (!Array.isArray(latestStories)) throw new Error("Invalid feed response");
      setDisplayedStories(latestStories);
      setLastSynced(latestStatus.lastSynced);
      baseline.current = latestStatus.lastSynced;
      setHasUpdates(false);
      setRevision(value => value + 1);
    } catch {
      setError("Couldn’t refresh the feed. Please check your connection and try again. Your existing stories are still here.");
    } finally { setIsRefreshing(false); refreshLock.current = false; }
  }

  return <div className="atlas-shell">
    <aside className="sidebar" aria-label="Workspace navigation">
      <Link className="workspace-brand" href="/"><span className="brand-mark">A</span><span>Project Atlas</span></Link>
      <div className="workspace-label">WORKSPACE</div>
      <nav><Link className="nav-item active" href="/" aria-current="page"><Newspaper size={16} />Top stories<span className="nav-count">{displayedStories.length}</span></Link>
        <button className="nav-item" onClick={() => document.querySelector<HTMLInputElement>(".search-field input")?.focus()}><Search size={16} />Search</button>
      </nav>
      <div className="sidebar-bottom"><p>A space for curious minds.</p><a className="nav-item" href="https://github.com/eclectickarthik/project_atlas/blob/main/Roadmap.md" target="_blank" rel="noopener noreferrer"><Map size={15} />Roadmap<ArrowUpRight size={12} /></a><a className="nav-item" href="https://github.com/eclectickarthik/project_atlas" target="_blank" rel="noopener noreferrer"><Code size={15} />GitHub<ArrowUpRight size={12} /></a><a className="nav-item" href="https://github.com/eclectickarthik/project_atlas/releases" target="_blank" rel="noopener noreferrer"><BookOpen size={15} />Releases<ArrowUpRight size={12} /></a><div className="sidebar-footnote">Powered by Hacker News</div></div>
    </aside>
    <main className="main-panel"><div className="breadcrumb"><span>Atlas</span><ChevronRight size={12} /><Newspaper size={14} /><span>Top stories</span></div>
      <div className="feed-page"><Header hasUpdates={hasUpdates} lastSynced={lastSynced} isRefreshing={isRefreshing} onRefresh={refreshStories} />
        {error && <div className="error-notice" role="alert"><span>{error}</span><button className="quiet-button" disabled={isRefreshing} onClick={refreshStories}>Try again</button></div>}
        <SearchBar search={search} onSearchChange={setSearch} resultCount={filteredStories.length} order={order} onOrderChange={setOrder} />
        {filteredStories.length > 0 ? <StoryList key={JSON.stringify([search, order, revision])} stories={filteredStories} /> : <div className="empty-state"><BookOpen size={28} strokeWidth={1.3} /><h2>{search ? "No matching stories" : error ? "Your feed is unavailable" : "Your reading space is ready"}</h2><p>{search ? "Try another title, author, or domain." : "Refresh to load the latest stories from Hacker News."}</p>{search ? <button className="quiet-button" onClick={() => setSearch("")}>Clear search</button> : <button className="quiet-button" onClick={refreshStories} disabled={isRefreshing}>{isRefreshing ? "Loading stories…" : "Load stories"}</button>}</div>}
      </div>
    </main>
  </div>;
}
