<div align="center">

<!-- HERO: Place your project wordmark or logo here (see screenshot guide below) -->
<!-- Recommended: A simple SVG/PNG wordmark, ~600×120px, transparent background -->
<!-- ![ForkTale](./assets/logo.png) -->

# ForkTale

**Collaborative fiction, powered by a Git-inspired story graph.**

Writers fork each other's stories, commit new chapters, and build branching narratives with AI continuation available at every node.

<br/>

[![Live Demo](https://img.shields.io/badge/Live%20Demo-fork--tale.vercel.app-2563eb?style=flat-square&logo=vercel&logoColor=white)](https://fork-tale.vercel.app)
[![License: MIT](https://img.shields.io/badge/License-MIT-22c55e?style=flat-square)](./LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-97.6%25-3178c6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19-61dafb?style=flat-square&logo=react&logoColor=black)](https://react.dev/)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen?style=flat-square)](./CONTRIBUTING.md)

</div>

---

## Preview

<p align="center">
  <video src="https://github.com/user-attachments/assets/b739ac7e-7995-4876-9db8-3b6a0459d256" controls width="100%"></video>
</p>

---

## Overview

Most collaborative writing tools treat a story as a single linear document that everyone edits in place. ForkTale treats a story the way Git treats code as a **directed acyclic graph of commits**, where any node can be forked into a new branch by any reader.

The result is a living, branching narrative tree: writers contribute diverging plot paths, readers choose which branches to follow, and an integrated AI layer (Gemini API with SSE streaming) can generate continuation prose at any point in the graph.

---

## Key Features

**Story Graph Engine**
- Self-referential fork chain modeled across 8 normalized PostgreSQL tables via Prisma
- Commit DAG with parent-child relationships and full branch history
- Dual-mechanism fork lineage: `Story.forkedFromId` tracks ancestry, a separate `Fork` table provides an auditable fork log

**Role-Based Collaboration**
- Story authors are owners by default; invited collaborators hold an `EDITOR` or `VIEWER` role, enforced at the middleware level on every mutating route
- Invite-only editing workflow with JWT-authenticated sessions
- Each commit is attributed to its author and fully auditable

**AI-Assisted Writing**
- Gemini API integration with Server-Sent Events (SSE) for token-by-token streaming
- Four live in-editor actions: continue the story, suggest a plot twist, improve the prose, or fix grammar all streamed directly into the editor without blocking the UI
- Backend also exposes a branch-level summary endpoint (`GET /ai/summary/:branchId`); frontend wiring for this is in progress

**Editorial Design System**
- Core UI (editor, story graph, navigation) is themed entirely through a hand-rolled CSS custom property token system colors, type scale, spacing, and radii all defined once in `index.css` and consumed via inline styles
- Instrument Serif for display headings, DM Sans for body inspired by Linear, Notion, and Stripe
- Tailwind CSS handles utility-class layout on the auth screens (Login/Register) only
- Fully responsive across desktop and mobile viewports

**Publishing & Reader Engagement**
- Branches can be published as a finalized snapshot; published endings collect 1–5 star reader ratings
- Branch export to plain text and Markdown, with both full commit history and compiled-latest-version output

**Media & Covers**
- Story cover image uploads via Cloudinary with on-the-fly transformation
- Custom font selection per branch via an isolated `FontMenu` component

---

## Screenshots

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
│   React 19 + TypeScript                          │
│   Editorial UI: CSS custom-property token system │
│   Tailwind CSS: auth screens only                │
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
│   Story → Branch → Commit DAG (self-ref FK)      │
│   User → Collaborator (role) → Story             │
└─────────────────────────────────────────────────┘
```

The most technically interesting part of the data model is the **recursive commit graph**: every `Commit` record has an optional `parentId` that references another `Commit` in the same table, and belongs to a `Branch`. A `Fork` record separately links a `Story` to the user who forked it, preserving an auditable trail across the entire tree independent of the lineage pointer on `Story` itself.

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 19, TypeScript, Vite |
| **Styling** | CSS custom-property design tokens (primary), Tailwind CSS (auth screens) |
| **Backend** | Node.js, Express, TypeScript |
| **Database** | PostgreSQL (via Prisma ORM) |
| **AI** | Google Gemini API (SSE streaming) |
| **Auth** | JWT, 7-day expiry, bcrypt password hashing |
| **Media** | Cloudinary |
| **Deployment** | Vercel (frontend), Railway (backend), Neon (PostgreSQL) |

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
│   │   ├── pages/            # Route-level components (Home, BranchView, StoryRead)
│   │   ├── hooks/            # Custom React hooks
│   │   ├── services/         # API client (axios instance + per-domain service objects)
│   │   └── index.css         # Design token definitions (CSS custom properties)
│   └── ...
└── backend/
    ├── src/
    │   ├── routes/           # Express route handlers
    │   ├── controllers/      # Auth, story, branch, commit, fork, AI, export, rating logic
    │   ├── middlewares/      # Auth, role enforcement, error handling
    │   └── config/           # Prisma client, Cloudinary config
    └── prisma/                # Schema and migrations
```

---

## Challenges & Learnings

**Recursive data modeling** — Representing a fork-and-commit graph in a relational database required careful use of self-referential foreign keys. Getting Prisma's type system to handle circular relations cleanly took significant iteration.

**SSE streaming in a React context** — Managing the lifecycle of a long-lived SSE connection (open, token append, close, error) without memory leaks or stale closures required a dedicated streaming hook with careful cleanup logic.

**Component isolation for third-party conflicts** — Conflicting cascade behavior between global token styles and parent layout context on elements like the font-picker dropdown was solved by extracting the component into a fully isolated wrapper with its own deferred effect lifecycle.

**Design system from scratch** — Building a cohesive editorial aesthetic without a component library meant defining every visual token upfront in CSS custom properties and enforcing their use across the core UI. The constraint paid off in visual consistency but required discipline throughout.

---

## Roadmap

- [ ] **Wire up existing AI summary endpoint** — Backend (`GET /ai/summary/:branchId`) and API client method are implemented; no UI entry point yet
- [ ] **Wire up existing export endpoints** — Backend supports TXT/Markdown export (full history + compiled); no UI entry point yet. PDF/EPUB output is a further extension
- [ ] **Test coverage** — Unit tests for the commit graph logic; integration tests for the SSE stream handler
- [ ] **Read analytics** — View counts and reader engagement metrics per story node
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
