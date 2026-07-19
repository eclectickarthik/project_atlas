# 🗺️ Project Atlas Roadmap

## ✅ Phase 1 — MVP (Completed)

### Core Infrastructure

- [x] Next.js 15 + App Router
- [x] TypeScript
- [x] Tailwind CSS + shadcn/ui
- [x] Prisma ORM
- [x] PostgreSQL (Neon)

### Hacker News Integration

- [x] Fetch Top 100 Hacker News stories
- [x] Sync stories into PostgreSQL
- [x] Store latest sync timestamp
- [x] Manual refresh endpoint
- [x] Cached story architecture
- [x] Preserve Hacker News ranking (`rank`)

### API

- [x] `/api/stories`
- [x] `/api/sync`
- [x] `/api/status`

### User Interface

- [x] Hacker News inspired dark theme
- [x] Story cards
- [x] Story metadata
  - [x] Score
  - [x] Comments
  - [x] Author
  - [x] Domain
  - [x] Relative time
- [x] Search stories
- [x] Refresh button
- [x] Sync status
- [x] Load More pagination
- [x] Story ranking display
- [x] Responsive layout

### UX

- [x] Fast loading from local database
- [x] Manual sync with Hacker News
- [x] Cached browsing experience

---

# 🚀 Phase 2 — Planned

## Feed Improvements

- [ ] Auto-sync when cache becomes stale (e.g. every 5–10 minutes)
- [ ] Background sync without blocking UI
- [ ] Show "Checking for updates..." while syncing
- [ ] Better sync status indicator

## Hacker News Categories

- [ ] Top Stories
- [ ] New Stories
- [ ] Best Stories
- [ ] Ask HN
- [ ] Show HN
- [ ] Jobs

## Reading Experience

- [ ] Bookmarks
- [ ] Reading history
- [ ] Recently viewed stories
- [ ] Open article in reader mode

## AI Features

- [ ] AI article summaries
- [ ] AI discussion summaries
- [ ] Explain article in simple language
- [ ] Key takeaways

## Search & Discovery

- [ ] Advanced search
- [ ] Filter by domain
- [ ] Filter by author
- [ ] Filter by score
- [ ] Sort options

## Analytics

- [ ] Trending domains
- [ ] Trending authors
- [ ] Reading statistics
- [ ] Most viewed stories

## UI Polish

- [ ] Keyboard shortcuts
- [ ] Theme customization
- [ ] Improved loading skeletons
- [ ] Better empty states
- [ ] Toast notifications
- [ ] Shared Story type across project

---

# 🌟 Phase 3 — Vision

- [ ] User accounts
- [ ] Personal reading lists
- [ ] Notes & highlights
- [ ] Multi-device sync
- [ ] PWA support
- [ ] Offline reading
- [ ] Mobile app
- [ ] Recommendation engine
- [ ] Daily digest
- [ ] Developer API
