"use client";

import { useRef } from "react";
import { ArrowDownUp, Check, ChevronDown, Search, X } from "lucide-react";
import { DropdownMenu } from "radix-ui";
import { STORY_ORDERS, type StoryOrder } from "@/lib/story";

type Props = {
  search: string;
  onSearchChange: (value: string) => void;
  resultCount: number;
  order: StoryOrder;
  onOrderChange: (value: StoryOrder) => void;
};

export default function SearchBar({ search, onSearchChange, resultCount, order, onOrderChange }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const selectedOrder = STORY_ORDERS.find(option => option.value === order)!;

  return <>
    <div className="feed-toolbar">
      <div className="feed-tab">{search ? "Search results" : "All stories"}<span>{resultCount}</span></div>
      <div className="feed-controls">
        <div className="search-field" data-filled={Boolean(search)}>
          <Search size={15} aria-hidden="true" />
          <input ref={inputRef} type="text" autoComplete="off" spellCheck={false} aria-label="Search stories, authors or domains" value={search} onChange={event => onSearchChange(event.target.value)} onKeyDown={event => {
            if (event.key === "Escape") onSearchChange("");
          }} placeholder="Search stories…" />
          {search && <button type="button" aria-label="Clear search" onClick={() => {
            onSearchChange("");
            inputRef.current?.focus();
          }}><X size={14} /></button>}
        </div>
        <DropdownMenu.Root modal={false}>
          <DropdownMenu.Trigger className="sort-trigger" aria-label={`Sort stories: ${selectedOrder.label}`} aria-describedby="sort-description">
            <ArrowDownUp size={14} aria-hidden="true" />
            <span>{selectedOrder.label}</span>
            <ChevronDown className="sort-chevron" size={13} aria-hidden="true" />
          </DropdownMenu.Trigger>
          <DropdownMenu.Portal>
            <DropdownMenu.Content className="sort-menu" align="end" sideOffset={8} collisionPadding={12}>
              <DropdownMenu.Label className="sort-menu-label">Sort stories</DropdownMenu.Label>
              <DropdownMenu.RadioGroup value={order} onValueChange={value => {
                const option = STORY_ORDERS.find(item => item.value === value);
                if (option) onOrderChange(option.value);
              }}>
                {STORY_ORDERS.map(option => <DropdownMenu.RadioItem className="sort-menu-item" key={option.value} value={option.value}>
                  <span>{option.label}</span>
                  <DropdownMenu.ItemIndicator><Check size={14} aria-hidden="true" /></DropdownMenu.ItemIndicator>
                </DropdownMenu.RadioItem>)}
              </DropdownMenu.RadioGroup>
              <DropdownMenu.Separator className="sort-menu-separator" />
              <p className="sort-menu-note">Applies to the current Top 100</p>
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>
      </div>
    </div>
    <p id="sort-description" className="sort-description sr-only" role="status">
      {resultCount} stories. Sorted by {selectedOrder.description}, within the Top 100 feed.
    </p>
  </>;
}
