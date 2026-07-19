"use client";

import { Search } from "lucide-react";

import { Input } from "@/components/ui/input";

type SearchBarProps = {
  search: string;
  onSearchChange: (value: string) => void;
  resultCount: number;
};

export default function SearchBar({
  search,
  onSearchChange,
  resultCount,
}: SearchBarProps) {
  return (
    <div className="mb-6 flex items-center justify-between gap-6">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />

        <Input
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search stories, authors or domains..."
          className="
            h-11
            border-zinc-700
            bg-zinc-900
            pl-10
            text-zinc-100
            placeholder:text-zinc-500
            focus-visible:border-[#ff6600]
            focus-visible:ring-1
            focus-visible:ring-[#ff6600]
          "
        />
      </div>

      <div className="whitespace-nowrap text-sm text-zinc-500">
        {resultCount} {resultCount === 1 ? "story" : "stories"}
      </div>
    </div>
  );
}
