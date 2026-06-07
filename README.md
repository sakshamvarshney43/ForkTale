<div align="center">

<!-- HERO: Place your project wordmark or logo here (see screenshot guide below) -->
<!-- Recommended: A simple SVG/PNG wordmark, ~600×120px, transparent background -->
<!-- ![ForkTale](./assets/logo.png) -->






# ForkTale

**Collaborative fiction, powered by a Git-inspired story graph.**

Writers fork each other's stories, commit new chapters, and build branching narratives — with AI continuation available at every node.

<br/>

[![Live Demo](https://img.shields.io/badge/Live%20Demo-fork--tale.vercel.app-2563eb?style=flat-square&logo=vercel&logoColor=white)](https://fork-tale.vercel.app)
[![License: MIT](https://img.shields.io/badge/License-MIT-22c55e?style=flat-square)](./LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-97.6%25-3178c6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18-61dafb?style=flat-square&logo=react&logoColor=black)](https://react.dev/)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen?style=flat-square)](./CONTRIBUTING.md)

</div>

---

<!-- ============================================================
  PREVIEW
  Recommended placement: Immediately after the hero.
  What to put here: A single high-quality GIF (20–30 sec) or a
  hero screenshot showing the most impressive view of the app.
  See "Demo GIF Storyboard" section at the bottom of this file.
============================================================ -->

## Preview

<p align="center">
  <video src="https://github.com/user-attachments/assets/b739ac7e-7995-4876-9db8-3b6a0459d256" controls width="100%"></video>
</p>


---

## Overview

Most collaborative writing tools treat a story as a single linear document that everyone edits in place. ForkTale treats a story the way Git treats code — as a **directed acyclic graph of commits**, where any node can be forked into a new branch by any reader.

The result is a living, branching narrative tree: writers contribute diverging plot paths, readers choose which branches to follow, and an integrated AI layer (Gemini API with SSE streaming) can generate continuation prose at any point in the graph.

---

## Key Features

**Story Graph Engine**
- Recursive, self-referential fork chain modeled in PostgreSQL via Prisma
- Commit DAG with parent-child relationships, diff-aware rendering, and branch metadata
- Full fork lineage tracing back to the original root story

**Role-Based Collaboration**
- Granular permission model: `owner`, `editor`, and `viewer` roles per story
- Invite-only editing workflow with JWT-authenticated sessions
- Each collaborator's commits are attributed and auditable

**AI-Assisted Writing**
- Gemini API integration with Server-Sent Events (SSE) for token-by-token streaming
- AI continuation triggers at any commit node — generates contextually coherent prose
- Streamed directly into the editor without blocking the UI

**Editorial Design System**
- Custom CSS property system (`--bg`, `--text-primary`, `--accent`, `--border`)
- Instrument Serif for display headings, DM Sans for body — inspired by Linear, Notion, and Stripe
- Fully responsive across desktop and mobile viewports

**Media & Covers**
- Story cover image uploads via Cloudinary with on-the-fly transformation
- Custom font selection per branch via isolated `FontMenu` component

---

## Screenshots

<!-- ============================================================
  SCREENSHOTS
  Capture and drop images into ./assets/ then update these paths.
  See "Screenshot Capture Guide" at the bottom for exact specs.
============================================================ -->

### HomePage
<img width="1900" height="1002" alt="Screenshot 2026-06-06 100528" src="https://github.com/user-attachments/assets/599e9bed-f829-4c70-89b5-687a861cdd19" />

### Editor with AI Continuation
<img width="1900" height="1002" alt="Screenshot 2026-06-06 100558" src="https://github.com/user-attachments/assets/3b49b337-c367-4e61-990c-07ff55d843ad" />

### Discover
<img width="1903" height="999" alt="Screenshot 2026-06-06 100638" src="https://github.com/user-attachments/assets/fd61317a-30b6-429b-855c-718567b207e4" />

### Story Reading
<img width="1906" height="997" alt="Screenshot 2026-06-06 100703" src="https://github.com/user-attachments/assets/0dfce018-e601-48fc-a099-5783cc576cea" />


---

## How It Works

### User Flow

```
Register / Log in
       │
       ▼
  Browse Stories ──► Fork any published story
       │                      │
       ▼                      ▼
  Create New Story      Forked Branch (new commit chain)
       │                      │
       └──────────┬───────────┘
                  ▼
          Write / Commit
                  │
          ┌───────┴────────┐
          │                │
     Publish it       Invoke AI →  streaming continuation
          │
          ▼
   Others can fork, read, or collaborate
```

### Architecture

```
┌─────────────────────────────────────────────────┐
│                   Frontend                       │
│   React 18 + TypeScript + Tailwind CSS           │
│   Design system via CSS custom properties        │
│   SSE client for streaming AI responses          │
└──────────────────┬──────────────────────────────┘
                   │  REST API + SSE
┌──────────────────▼──────────────────────────────┐
│                   Backend                        │
│   Express.js + TypeScript                        │
│   JWT Auth  │  Cloudinary  │  Gemini SDK        │
└──────────────────┬──────────────────────────────┘
                   │  Prisma ORM
┌──────────────────▼──────────────────────────────┐
│               PostgreSQL                         │
│   Story → Commit DAG (recursive self-ref FK)     │
│   User  → Role → Story (many-to-many)            │
└─────────────────────────────────────────────────┘
```

The most technically interesting part of the data model is the **recursive commit graph**: every `Commit` record has an optional `parentId` that references another `Commit` in the same table. A `Fork` record links a `Story` to the specific `Commit` it was forked from, preserving lineage across the entire tree.

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 18, TypeScript, Tailwind CSS |
| **Backend** | Node.js, Express, TypeScript |
| **Database** | PostgreSQL (via Prisma ORM) |
| **AI** | Google Gemini API (SSE streaming) |
| **Auth** | JWT (access + refresh tokens) |
| **Media** | Cloudinary |
| **Deployment** | Vercel (frontend), Railway (backend) |
| **Design** | Custom CSS property design system |

---

## Installation & Setup

### Prerequisites

- Node.js ≥ 18
- PostgreSQL ≥ 14
- A [Cloudinary](https://cloudinary.com/) account
- A [Google AI Studio](https://aistudio.google.com/) API key (Gemini)

### 1. Clone the repository

```bash
git clone https://github.com/sakshamvarshney43/ForkTale.git
cd ForkTale
```

### 2. Configure the backend

```bash
cd backend
cp .env.example .env
```

Edit `.env`:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/forktale"
JWT_SECRET="your-secret-key"
GEMINI_API_KEY="AIza..."
CLOUDINARY_CLOUD_NAME="..."
CLOUDINARY_API_KEY="..."
CLOUDINARY_API_SECRET="..."
```

```bash
npm install
npx prisma migrate dev
npm run dev
```

### 3. Configure the frontend

```bash
cd ../frontend
cp .env.example .env
```

Edit `.env`:

```env
VITE_API_URL="http://localhost:4000"
```

```bash
npm install
npm run dev
```

The app will be available at `http://localhost:5173`.

---

## Project Structure

```
ForkTale/
├── frontend/
│   ├── src/
│   │   ├── components/       # Shared UI components (Navbar, FontMenu, etc.)
│   │   ├── pages/            # Route-level components (Home, StoryEdit, BranchView)
│   │   ├── hooks/            # Custom React hooks (useStream, useAuth)
│   │   ├── lib/              # API client, utils
│   │   └── index.css         # Design token definitions (CSS custom properties)
│   └── ...
└── backend/
    ├── src/
    │   ├── routes/           # Express route handlers
    │   ├── middleware/        # Auth, error handling
    │   ├── services/         # Business logic (story, commit, AI stream)
    │   └── prisma/           # Schema and migrations
    └── ...
```

---

## Challenges & Learnings

**Recursive data modeling** — Representing a fork-and-commit graph in a relational database required careful use of self-referential foreign keys and recursive CTEs. Getting Prisma's type system to handle circular relations cleanly took significant iteration.

**SSE streaming in a React context** — Managing the lifecycle of a long-lived SSE connection (open, token append, close, error) without memory leaks or stale closures required building a dedicated `useStream` hook with careful cleanup logic.

**Component isolation for third-party conflicts** — Tailwind's utility classes conflicted with some parent layout styles on elements like the Navbar and the FontMenu dropdown. The solution was to extract conflicting components into fully isolated wrappers with explicit inline styles as override boundaries.

**Design system from scratch** — Building a cohesive editorial aesthetic without a component library meant defining every visual token upfront in CSS custom properties and enforcing their use across ~30 components. The constraint paid off in visual consistency but required discipline throughout.

---

## Roadmap

The following improvements are planned or in-progress:

- [ ] **Test coverage** — Unit tests for the commit graph logic; integration tests for the SSE stream handler
- [ ] **Read analytics** — View counts and reader engagement metrics per story node
- [ ] **Export** — Download a story branch as a formatted PDF or EPUB
- [ ] **Real-time collaboration** — WebSocket-based co-editing on the same commit draft
- [ ] **Public API** — REST endpoints for third-party integrations

---

## Contributing

Contributions are welcome. To get started:

1. Fork this repository
2. Create a feature branch: `git checkout -b feat/your-feature`
3. Commit your changes: `git commit -m "feat: describe the change"`
4. Push the branch: `git push origin feat/your-feature`
5. Open a Pull Request

Please follow [Conventional Commits](https://www.conventionalcommits.org/) for commit messages. For larger changes, open an issue first to discuss the approach.

---

## License

Distributed under the [MIT License](./LICENSE).

---

<div align="center">

Built by [Saksham Varshney](https://github.com/sakshamvarshney43) · [Live Demo](https://fork-tale.vercel.app) · [Report a Bug](https://github.com/sakshamvarshney43/ForkTale/issues)

</div>

---

<!--
================================================================================
  ASSET PRODUCTION GUIDE  (remove this section before publishing)
================================================================================

SCREENSHOTS TO CAPTURE (save to ./assets/)
───────────────────────────────────────────
1. screenshot-dashboard.png
   - Page: Home / feed
   - Show: 4–6 story cards in the editorial grid, clean white background,
     the ForkTale wordmark in the navbar. No test/lorem data.
   - Dimensions: 1440×900 or 1280×800 browser viewport.

2. screenshot-graph.png
   - Page: Story detail / graph view
   - Show: A story with at least 3–4 visible forks branching out as a tree.
     Highlight one branch as "selected."
   - Dimensions: same as above.

3. screenshot-editor-ai.png
   - Page: StoryEdit during an active Gemini stream
   - Show: The editor with partial AI-generated text appearing, the
     "Generating…" state indicator visible. Captures the core value prop.
   - Dimensions: same as above.

4. screenshot-branch.png
   - Page: BranchView
   - Show: The commit timeline on the left, the FontMenu dropdown open,
     collaborator avatars/roles visible in the sidebar.
   - Dimensions: same as above.


DEMO GIF STORYBOARD (20–30 seconds, save as ./assets/demo.gif)
───────────────────────────────────────────────────────────────
Use a tool like Kap (macOS), ScreenToGif (Windows), or LICEcap.
Record at 1280×800, export at 10–15fps, target < 5MB.

  [0:00 – 0:04]  Home feed — pan over 4–5 story cards.
  [0:04 – 0:09]  Click into a story. Story graph expands showing 3 forks.
  [0:09 – 0:14]  Click one branch. BranchView opens; scroll through commits.
  [0:14 – 0:20]  Click "Fork this branch." Editor opens. Type a short sentence.
  [0:20 – 0:28]  Click "AI Continue." Watch tokens stream in live.
  [0:28 – 0:30]  Click "Commit." New node appears in the graph.

Keep the cursor movements deliberate. No fast clicking. Use a dark/clean
browser theme so UI contrast is high. Add a subtle zoom-in on key UI moments.
================================================================================
-->
