"use client";
import { formatDistanceToNow } from "date-fns";
import { RefreshCw, Newspaper } from "lucide-react";
type Props = { hasUpdates: boolean; lastSynced: string | null; isRefreshing: boolean; onRefresh: () => void };
export default function Header({ hasUpdates, lastSynced, isRefreshing, onRefresh }: Props) {
  const validDate = lastSynced && !Number.isNaN(new Date(lastSynced).getTime());
  return <header className="feed-header">
    <div className="page-icon"><Newspaper size={30} strokeWidth={1.4} /></div>
    <div className="heading-row"><h1>Top stories</h1><button className="quiet-button" onClick={onRefresh} disabled={isRefreshing}><RefreshCw size={14} className={isRefreshing ? "animate-spin" : ""} />{isRefreshing ? "Refreshing…" : "Refresh"}</button></div>
    <p>The Hacker News Top 100. Read in your own order.</p>
    <div className="sync-status" role="status">{hasUpdates ? "New stories available — refresh to see them" : validDate ? "Updated " + formatDistanceToNow(new Date(lastSynced), { addSuffix: true }) : "Your daily reading space"}</div>
  </header>;
}
