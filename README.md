<div align="center">

  <h1>
    <img src="https://img.shields.io/badge/Fork-Tale-111827?style=for-the-badge&labelColor=111827&color=2563eb" />
  </h1>

  <p><strong>Git version control, applied to storytelling.</strong></p>
  <p>Branch timelines · Commit chapters · Fork stories · AI co-author · Publish multiple endings</p>

  <br />

  [![Live](https://img.shields.io/badge/Live%20App-fork--tale.vercel.app-2563eb?style=flat-square&logo=vercel&logoColor=white)](https://fork-tale.vercel.app)
  &nbsp;
  [![TypeScript](https://img.shields.io/badge/TypeScript-97.6%25-3178c6?style=flat-square&logo=typescript&logoColor=white)](.)
  &nbsp;
  [![License](https://img.shields.io/badge/License-MIT-16a34a?style=flat-square)](LICENSE)

  <br /><br />

  > **ForkTale is a full-stack collaborative writing platform where stories are versioned like code.**  
  > Writers branch their narratives into alternate timelines, save chapters as commits,  
  > fork published stories, collaborate with role-based access, and get real-time AI assistance —  
  > all in one platform.

  <br />

  ---
</div>

<br />

## The Concept

Every story in ForkTale lives on a `main` branch. From any commit, you can branch off into an alternate timeline — a darker ending, a twist, a different character choice — without touching the original. When you're done, publish any branch as a **public ending**. Readers arrive at your story and choose which path they want to follow.

It's the reading experience of a choose-your-own-adventure, but built on the infrastructure of a version control system.

<br />

---

## Features

<br />

### ✍️ Writing & Version Control

| Feature | Description |
|---|---|
| **Commit system** | Save your chapter with a message. Every version is stored and reversible. Commits link to their parent — just like Git. |
| **Branch system** | Fork your own story at any point. Explore a different direction without touching `main`. Switch branches from inside the editor. |
| **Commit history** | Full timeline view of every saved version. Preview content, compare messages, jump back in time, or reopen any commit in the editor. |
| **Word count tracking** | Live word count in the editor status bar. Per-commit word count in history. |
| **Font & size picker** | Writers choose their editing font (Georgia, Merriweather, Charter, Mono) and size. Your writing environment, your preferences. |
| **Export** | Export any branch as clean **TXT** or **Markdown** — full history or final version only. |

<br />

### 🤝 Collaboration

| Feature | Description |
|---|---|
| **Invite by username** | Add collaborators to any story directly by their ForkTale username. |
| **Role-based access** | Two roles: **Editor** (read + write + commit) and **Viewer** (read only). Enforced at the API middleware level. |
| **Author controls** | Only the story author can invite, change roles, remove collaborators, and publish endings. |
| **Forking** | Any reader can fork a published story and continue it their own way. Fork attribution links back to the original. |

<br />

### 🤖 AI Co-Author (Streaming)

All AI responses stream **word-by-word** in real time via Server-Sent Events — no waiting for the full response.

| Action | What it does |
|---|---|
| **Continue story** | Streams 2–3 paragraphs that match your current tone, genre, and narrative voice |
| **Plot twist** | Suggests 3 unexpected but believable directions the story could go |
| **Improve writing** | Enhances prose quality — sentence rhythm, word choice, description — without changing your plot |
| **Fix grammar** | Corrects errors and awkward phrasing while preserving your voice |

AI suggestions appear in a slide-out panel. One click inserts the generated text directly into your editor at the cursor position.

<br />

### 📖 Publishing & Discovery

| Feature | Description |
|---|---|
| **Publish endings** | Publish any branch of your story as a public ending. One story can have many endings simultaneously. |
| **Unpublish** | Remove a published ending at any time from the Collaborate page. |
| **Reader choice** | Readers arrive at a story and see all published endings in a sidebar. They choose which path to read. |
| **Star ratings** | Readers rate each ending 1–5 stars. Average rating and total count shown on each ending. Users can update or remove their rating. |
| **Discover page** | Browse all published stories. Filter by genre (Fantasy, Sci-Fi, Romance, Thriller, Horror, Mystery, Adventure, Drama, Historical, Isekai). Sort by **Latest** or **Top Rated**. Full-text search. |

<br />

### 👤 Profiles & Auth

| Feature | Description |
|---|---|
| **JWT authentication** | Register and login with email + password. Tokens stored and sent with every request. |
| **Public profiles** | Every user has a profile page (`/u/:username`) showing their published stories and bio. |
| **Avatar upload** | Upload a profile picture — stored on Cloudinary. |
| **Cover images** | Each story can have a cover image — uploaded to Cloudinary, shown on story cards and the read page. |
| **Edit profile** | Update name, username, and bio from the profile page. |

<br />

---

## Tech Stack

### Frontend

```
React 18 + TypeScript    →  UI with full type safety
Vite                     →  Build tool and dev server
Tailwind CSS             →  Utility-first styling
Framer Motion            →  Animations and page transitions
TanStack Query v5        →  Server state, caching, background refetch
React Router v6          →  Client-side routing (15 routes)
React Hook Form + Zod    →  Form handling and schema validation
Axios                    →  HTTP client with interceptors
```

### Backend

```
Node.js + Express        →  REST API (30+ endpoints)
TypeScript               →  Type safety across the stack
Prisma ORM               →  Type-safe queries, migrations, relations
PostgreSQL               →  Primary relational database
JWT + bcryptjs           →  Auth and password hashing
Cloudinary               →  Cover image and avatar storage
Anthropic Claude API     →  AI co-authoring with SSE streaming
Zod                      →  Server-side request validation
```

### Infrastructure

```
Vercel      →  Frontend deployment (CD on push to main)
Railway     →  Backend API + managed PostgreSQL
Cloudinary  →  Media CDN (free tier)
```

<br />

---

## Architecture

```
ForkTale/
├── frontend/
│   └── src/
│       ├── pages/          # 15 pages (Home, Discover, Dashboard, Editor, Read, Profile ...)
│       ├── components/     # Navbar, cards, modals
│       ├── services/       # All API calls (authService, storyService, aiService ...)
│       ├── context/        # AuthContext (user, token, login, logout)
│       ├── hooks/          # Custom hooks
│       └── types/          # Shared TypeScript interfaces
│
└── backend/
    ├── src/
    │   ├── controllers/    # 11 controllers (auth, story, branch, commit, ai, publish ...)
    │   ├── routes/         # Express route definitions
    │   ├── middlewares/    # requireAuth, requireEditor, requireAuthor, errorHandler
    │   ├── services/       # AI streaming, Cloudinary upload, export logic
    │   └── config/         # Database, Cloudinary
    └── prisma/
        └── schema.prisma   # Source of truth for all types
```

<br />

---

## Database Schema

```
User
 ├── stories[]           (authored stories)
 ├── collaborations[]    (role: VIEWER | EDITOR)
 └── forks[]             (stories the user has forked)

Story
 ├── branches[]
 │    └── commits[]      (content snapshots, parent-child linked like Git DAG)
 ├── publishings[]       (public endings — a story can have many)
 │    └── ratings[]      (per-user star ratings on each ending)
 ├── collaborators[]
 └── forkedFrom?  ──→    Story  (self-referential — tracks full fork lineage)
```

**Key decisions:**
- `parentId` on `Commit` — commits link to their parent, forming a directed acyclic graph
- `forkedFromId` on `Story` — self-referential FK tracks the entire fork chain
- Prisma transactions on fork and publish — both are atomic operations
- Cascade deletes — removing a story cleans up all branches, commits, endings, and ratings

<br />

---

## Key Technical Decisions

**SSE over WebSockets for AI streaming**
AI responses are unidirectional (server → client only). Server-Sent Events are simpler, require no extra library, reconnect automatically, and work natively with Express. WebSockets would add unnecessary bidirectional overhead.

**TanStack Query over Redux**
Every piece of state in ForkTale is server state — stories, commits, branches, endings. TanStack Query handles caching, background refetching, loading states, and cache invalidation out of the box. No global store needed.

**Prisma over raw SQL**
Type-safe queries generated from the schema, automatic migration tracking, and clean handling of the self-referencing relations (commit DAG, fork lineage) without writing complex raw SQL.

**Role middleware pattern**
`requireAuth → requireEditor → handler`. Authorization logic lives in reusable middleware, not scattered across controllers. Clean, centralized, easy to audit.

<br />

---

## Local Setup

**Prerequisites:** Node.js 18+, PostgreSQL, Cloudinary account (free), Anthropic API key

```bash
git clone https://github.com/sakshamvarshney43/ForkTale.git
cd ForkTale
```

**Backend:**
```bash
cd backend
npm install
```

Create `backend/.env`:
```env
PORT=5000
DATABASE_URL="postgresql://user:password@localhost:5432/forktale"
JWT_SECRET=your_secret_here
JWT_EXPIRES_IN=7d
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
ANTHROPIC_API_KEY=sk-ant-...
CLIENT_URL=http://localhost:5173
```

```bash
npx prisma migrate dev --name init
npx prisma generate
npm run dev
```

**Frontend:**
```bash
cd frontend
npm install
```

Create `frontend/.env`:
```env
VITE_API_URL=http://localhost:5000/api
```

```bash
npm run dev
# → http://localhost:5173
```

<br />

---

## API Overview

```
Auth          POST   /api/auth/register
              POST   /api/auth/login
              GET    /api/auth/me

Stories       GET    /api/stories/discover          (public, filterable)
              POST   /api/stories                   (auth)
              GET    /api/stories/:id
              PATCH  /api/stories/:id               (author)
              DELETE /api/stories/:id               (author)
              POST   /api/stories/:id/cover         (author, multipart)
              POST   /api/stories/:id/fork          (auth)

Branches      GET    /api/stories/:id/branches
              POST   /api/stories/:id/branches      (editor)

Commits       GET    /api/stories/:id/branches/:bid/commits
              GET    /api/stories/:id/branches/:bid/commits/latest
              POST   /api/stories/:id/branches/:bid/commits   (editor)

Publish       GET    /api/stories/:id/endings
              GET    /api/endings/:id               (read full content)
              POST   /api/stories/:id/publish       (author)
              DELETE /api/stories/:id/publish/:pid  (author)

Collaborate   GET    /api/stories/:id/collaborators
              POST   /api/stories/:id/collaborators (author)
              PATCH  /api/stories/:id/collaborators/:cid
              DELETE /api/stories/:id/collaborators/:cid

Ratings       POST   /api/ratings/:publishingId
              DELETE /api/ratings/:publishingId

Users         GET    /api/users/:username
              PATCH  /api/users/profile             (auth)
              POST   /api/users/avatar              (auth, multipart)

AI            POST   /api/ai/suggest-next           (streaming SSE)
              POST   /api/ai/suggest-twist          (streaming SSE)
              POST   /api/ai/improve-writing        (streaming SSE)
              POST   /api/ai/fix-grammar
```

<br />

---

## Roadmap

- [ ] Visual branch tree diagram (like GitHub's network graph)
- [ ] Real-time collaborative editing via WebSockets
- [ ] Export as PDF
- [ ] Email notifications for collaboration invites
- [ ] Reading progress tracker

<br />

---

## License

[MIT](LICENSE) — built by [Saksham Varshney](https://github.com/sakshamvarshney43)

<div align="center">
  <br />

  **[Live App](https://fork-tale.vercel.app)** · **[Report Bug](https://github.com/sakshamvarshney43/ForkTale/issues)** · **[Request Feature](https://github.com/sakshamvarshney43/ForkTale/issues)**

  <br />

</div>
