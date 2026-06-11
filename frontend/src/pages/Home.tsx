import { useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useInView, type Variants } from "framer-motion";
import {
  GitBranch,
  GitFork,
  Sparkles,
  BookOpen,
  ArrowRight,
  Users,
  Globe,
  CheckCircle2,
  Database,
  Zap,
  Shield,
} from "lucide-react";

const rise: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
};
const cascade: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

function Reveal({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef(null);
  const visible = useInView(ref, { once: true, margin: "-48px" });
  return (
    <motion.div
      ref={ref}
      variants={cascade}
      initial="hidden"
      animate={visible ? "visible" : "hidden"}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* Branch graph — the signature visual */
function BranchGraph() {
  const commits = [
    {
      id: "c1",
      x: 60,
      y: 48,
      branch: "main",
      label: "Initial draft",
      time: "3d ago",
    },
    {
      id: "c2",
      x: 180,
      y: 48,
      branch: "main",
      label: "Chapter 2 committed",
      time: "2d ago",
    },
    {
      id: "c3",
      x: 300,
      y: 48,
      branch: "main",
      label: "Revised ending",
      time: "1d ago",
    },
    {
      id: "c4",
      x: 420,
      y: 48,
      branch: "main",
      label: "The kingdom falls",
      time: "4h ago",
    },
    {
      id: "b1",
      x: 300,
      y: 120,
      branch: "dark-ending",
      label: "Villain wins",
      time: "20h ago",
    },
    {
      id: "b2",
      x: 420,
      y: 120,
      branch: "dark-ending",
      label: "Published ✓",
      time: "8h ago",
    },
    {
      id: "b3",
      x: 300,
      y: 192,
      branch: "hero-arc",
      label: "Hero rises",
      time: "12h ago",
    },
    {
      id: "b4",
      x: 420,
      y: 192,
      branch: "hero-arc",
      label: "Draft",
      time: "2h ago",
    },
  ];

  const colors: Record<string, string> = {
    main: "#2563eb",
    "dark-ending": "#7c3aed",
    "hero-arc": "#16a34a",
  };

  const branchLabels = [
    { y: 48, name: "main", color: "#2563eb" },
    { y: 120, name: "dark-ending", color: "#7c3aed" },
    { y: 192, name: "hero-arc", color: "#16a34a" },
  ];

  return (
    <div
      style={{
        background: "var(--bg)",
        border: "1.5px solid var(--border)",
        borderRadius: 14,
        boxShadow: "var(--shadow-xl)",
        overflow: "hidden",
      }}
    >
      {/* Window chrome */}
      <div
        style={{
          padding: "12px 18px",
          borderBottom: "1px solid var(--border)",
          background: "var(--bg-subtle)",
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}
      >
        <div style={{ display: "flex", gap: 5 }}>
          {["#ff5f57", "#febc2e", "#28c840"].map((c) => (
            <div
              key={c}
              style={{
                width: 10,
                height: 10,
                borderRadius: "50%",
                background: c,
              }}
            />
          ))}
        </div>
        <span
          style={{
            marginLeft: 10,
            fontSize: 12,
            fontFamily: "var(--font-mono)",
            color: "var(--text-muted)",
          }}
        >
          forktale / the-last-kingdom
        </span>
      </div>

      {/* Graph area */}
      <div style={{ padding: "24px 20px 20px", overflowX: "auto" }}>
        {/* Branch lane labels */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 0,
            marginBottom: 0,
          }}
        >
          {branchLabels.map((b) => (
            <div
              key={b.name}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                height: 72,
                paddingLeft: 4,
              }}
            >
              <div
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: b.color,
                  flexShrink: 0,
                }}
              />
              <span
                style={{
                  fontSize: 11,
                  fontFamily: "var(--font-mono)",
                  color: "var(--text-muted)",
                  letterSpacing: "0.01em",
                }}
              >
                {b.name}
              </span>
            </div>
          ))}
        </div>

        {/* SVG commit graph */}
        <svg
          viewBox="0 0 520 220"
          style={{
            width: "100%",
            maxWidth: 520,
            height: "auto",
            display: "block",
            marginTop: -216,
            marginLeft: 100,
          }}
          aria-label="Branch commit graph showing main, dark-ending, and hero-arc branches"
        >
          {/* Main branch line */}
          <line
            x1="60"
            y1="48"
            x2="420"
            y2="48"
            stroke="#2563eb"
            strokeWidth="2"
            strokeOpacity="0.3"
          />

          {/* Branch lines */}
          <line
            x1="180"
            y1="48"
            x2="300"
            y2="120"
            stroke="#7c3aed"
            strokeWidth="1.5"
            strokeOpacity="0.35"
          />
          <line
            x1="300"
            y1="120"
            x2="420"
            y2="120"
            stroke="#7c3aed"
            strokeWidth="2"
            strokeOpacity="0.3"
          />

          <line
            x1="180"
            y1="48"
            x2="300"
            y2="192"
            stroke="#16a34a"
            strokeWidth="1.5"
            strokeOpacity="0.35"
          />
          <line
            x1="300"
            y1="192"
            x2="420"
            y2="192"
            stroke="#16a34a"
            strokeWidth="2"
            strokeOpacity="0.3"
          />

          {/* Commit nodes */}
          {commits.map((c, i) => (
            <motion.g
              key={c.id}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 + i * 0.08, duration: 0.3 }}
            >
              <circle
                cx={c.x}
                cy={c.y}
                r={7}
                fill="var(--bg)"
                stroke={colors[c.branch]}
                strokeWidth="2"
              />
              <circle cx={c.x} cy={c.y} r={3} fill={colors[c.branch]} />
              {/* Label */}
              <text
                x={c.x}
                y={c.y - 14}
                textAnchor="middle"
                fontSize="9"
                fill="var(--text-muted, #94a3b8)"
                fontFamily="var(--font-body, system-ui)"
              >
                {c.label}
              </text>
            </motion.g>
          ))}

          {/* Published badge on b2 */}
          <motion.g
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1 }}
          >
            <rect
              x="390"
              y="130"
              width="58"
              height="16"
              rx="8"
              fill="rgba(22,163,74,0.12)"
              stroke="rgba(22,163,74,0.3)"
              strokeWidth="1"
            />
            <text
              x="419"
              y="141"
              textAnchor="middle"
              fontSize="8"
              fill="#16a34a"
              fontFamily="var(--font-body, system-ui)"
              fontWeight="600"
            >
              published
            </text>
          </motion.g>
        </svg>
      </div>

      {/* Footer strip */}
      <div
        style={{
          borderTop: "1px solid var(--border)",
          padding: "10px 20px",
          background: "var(--bg-subtle)",
          display: "flex",
          alignItems: "center",
          gap: 16,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
          <Sparkles size={11} style={{ color: "#16a34a" }} />
          <span
            style={{
              fontSize: 11,
              color: "var(--text-muted)",
              fontFamily: "var(--font-body)",
            }}
          >
            AI suggestion ready
          </span>
        </div>
        <div
          style={{
            width: 1,
            height: 12,
            background: "var(--border)",
          }}
        />
        <span
          style={{
            fontSize: 11,
            color: "var(--text-muted)",
            fontFamily: "var(--font-mono)",
          }}
        >
          3 branches · 8 commits
        </span>
      </div>
    </div>
  );
}

const features = [
  {
    icon: <GitBranch size={16} />,
    title: "Branch timelines",
    desc: "Every 'what if' becomes its own path. Explore alternate directions without touching your main story.",
  },
  {
    icon: <GitFork size={16} />,
    title: "Fork any story",
    desc: "Clone a published story and carry it somewhere new. Build on others' work, or take your own in a new direction.",
  },
  {
    icon: <Sparkles size={16} />,
    title: "AI co-author",
    desc: "Real-time suggestions via Gemini — plot continuations and prose refinements streamed as you write.",
  },
  {
    icon: <Users size={16} />,
    title: "Role-based collaboration",
    desc: "Invite co-authors with VIEWER, EDITOR, or OWNER access. Control exactly who can read, write, or publish.",
  },
  {
    icon: <BookOpen size={16} />,
    title: "Multiple endings",
    desc: "Publish each branch as a separate ending. Readers choose their path; authors collect per-ending ratings.",
  },
  {
    icon: <Globe size={16} />,
    title: "Discover & remix",
    desc: "Browse published stories, rate endings, and fork favourites — all behind a search-and-filter explore feed.",
  },
];

/* Tech stack strip — replaces fake stats */
const techHighlights = [
  {
    icon: <Database size={14} />,
    label: "Self-referential schema",
    detail: "Directed acyclic commit graph in PostgreSQL",
  },
  {
    icon: <Zap size={14} />,
    label: "SSE streaming",
    detail: "Real-time AI output via Server-Sent Events",
  },
  {
    icon: <Shield size={14} />,
    label: "RBAC auth",
    detail: "JWT + role-gated collaboration layer",
  },
  {
    icon: <GitBranch size={14} />,
    label: "30+ REST endpoints",
    detail: "Typed with Zod, ~97% TypeScript coverage",
  },
];

export default function Home() {
  return (
    <div style={{ background: "var(--bg)", minHeight: "100vh" }}>
      {/* Nav */}
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 50,
          background: "rgba(255,255,255,0.92)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid var(--border)",
        }}
      >
        <nav
          style={{
            maxWidth: 1120,
            margin: "0 auto",
            padding: "0 32px",
            height: 58,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Link
            to="/"
            style={{ display: "flex", alignItems: "center", gap: 8 }}
          >
            <div
              style={{
                width: 28,
                height: 28,
                background: "var(--text-primary)",
                borderRadius: 7,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <GitBranch size={14} color="white" />
            </div>
            <span
              style={{
                fontSize: 15,
                fontWeight: 700,
                color: "var(--text-primary)",
                fontFamily: "var(--font-body)",
                letterSpacing: "-0.02em",
              }}
            >
              ForkTale
            </span>
          </Link>

          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <Link
              to="/discover"
              style={{
                padding: "6px 12px",
                fontSize: 14,
                color: "var(--text-secondary)",
                fontFamily: "var(--font-body)",
                borderRadius: "var(--r-md)",
                transition: "all 0.15s",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.background =
                  "var(--bg-subtle)";
                (e.currentTarget as HTMLElement).style.color =
                  "var(--text-primary)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.background =
                  "transparent";
                (e.currentTarget as HTMLElement).style.color =
                  "var(--text-secondary)";
              }}
            >
              Discover
            </Link>
            <div
              style={{
                width: 1,
                height: 18,
                background: "var(--border)",
                margin: "0 6px",
              }}
            />
            <Link to="/login">
              <button className="btn btn-ghost btn-sm">Log in</button>
            </Link>
            <Link to="/register">
              <button className="btn btn-primary btn-sm">
                Get started <ArrowRight size={12} />
              </button>
            </Link>
          </div>
        </nav>
      </header>

      {/* ─── Hero ──────────────────────────────────────────── */}
      <section
        style={{ maxWidth: 1120, margin: "0 auto", padding: "80px 32px 72px" }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 64,
            alignItems: "center",
          }}
        >
          {/* Left */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
              style={{ marginBottom: 22 }}
            >
              <span
                className="badge badge-accent"
                style={{ fontSize: 11, padding: "4px 10px" }}
              >
                <GitBranch size={10} />
                Version control for collaborative fiction
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.6,
                delay: 0.05,
                ease: [0.22, 1, 0.36, 1],
              }}
              style={{
                fontSize: "clamp(40px, 5.5vw, 68px)",
                lineHeight: 1.05,
                fontWeight: 400,
                letterSpacing: "-0.03em",
                color: "var(--text-primary)",
                fontFamily: "var(--font-display)",
                marginBottom: 22,
              }}
            >
              Stories that
              <br />
              <em>branch</em> and <em>evolve.</em>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.12 }}
              style={{
                fontSize: 17,
                color: "var(--text-secondary)",
                lineHeight: 1.7,
                maxWidth: 460,
                marginBottom: 36,
                fontFamily: "var(--font-body)",
              }}
            >
              ForkTale brings Git-style version control to collaborative
              fiction. Branch timelines, fork stories, commit chapters — and let
              AI help write what comes next.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              style={{
                display: "flex",
                gap: 10,
                flexWrap: "wrap",
                marginBottom: 32,
              }}
            >
              <Link to="/register">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="btn btn-primary btn-lg"
                >
                  Start writing free <ArrowRight size={14} />
                </motion.button>
              </Link>
              <Link to="/discover">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="btn btn-secondary btn-lg"
                >
                  <BookOpen size={14} /> Browse stories
                </motion.button>
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 16,
                flexWrap: "wrap",
              }}
            >
              {["No credit card", "Free to start", "Fork any story"].map(
                (t) => (
                  <div
                    key={t}
                    style={{ display: "flex", alignItems: "center", gap: 5 }}
                  >
                    <CheckCircle2
                      size={12}
                      style={{ color: "#16a34a", flexShrink: 0 }}
                    />
                    <span
                      style={{
                        fontSize: 12,
                        color: "var(--text-muted)",
                        fontFamily: "var(--font-body)",
                      }}
                    >
                      {t}
                    </span>
                  </div>
                ),
              )}
            </motion.div>
          </div>

          {/* Right — branch graph */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.65,
              delay: 0.18,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <BranchGraph />
          </motion.div>
        </div>
      </section>

      {/* ─── Tech highlights strip ─────────────────────────── */}
      <section
        style={{
          borderTop: "1px solid var(--border)",
          borderBottom: "1px solid var(--border)",
          background: "var(--bg-subtle)",
        }}
      >
        <div style={{ maxWidth: 1120, margin: "0 auto", padding: "32px 32px" }}>
          <Reveal>
            <motion.div
              variants={rise}
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(4, 1fr)",
                gap: 0,
              }}
            >
              {techHighlights.map((t, i) => (
                <div
                  key={t.label}
                  style={{
                    padding: "0 28px",
                    borderRight:
                      i < techHighlights.length - 1
                        ? "1px solid var(--border)"
                        : "none",
                    display: "flex",
                    flexDirection: "column",
                    gap: 6,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 7,
                      color: "var(--accent)",
                    }}
                  >
                    {t.icon}
                    <span
                      style={{
                        fontSize: 12,
                        fontWeight: 600,
                        fontFamily: "var(--font-body)",
                        color: "var(--text-primary)",
                        letterSpacing: "-0.01em",
                      }}
                    >
                      {t.label}
                    </span>
                  </div>
                  <p
                    style={{
                      fontSize: 12,
                      color: "var(--text-muted)",
                      fontFamily: "var(--font-body)",
                      lineHeight: 1.5,
                      margin: 0,
                    }}
                  >
                    {t.detail}
                  </p>
                </div>
              ))}
            </motion.div>
          </Reveal>
        </div>
      </section>

      {/* ─── Features ──────────────────────────────────────── */}
      <section
        style={{ maxWidth: 1120, margin: "0 auto", padding: "80px 32px" }}
      >
        <Reveal>
          <motion.div variants={rise} style={{ marginBottom: 52 }}>
            <p
              style={{
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "var(--accent)",
                marginBottom: 12,
                fontFamily: "var(--font-body)",
              }}
            >
              Platform
            </p>
            <div
              style={{
                display: "flex",
                alignItems: "flex-end",
                justifyContent: "space-between",
                gap: 32,
                flexWrap: "wrap",
              }}
            >
              <h2
                style={{
                  fontSize: "clamp(26px, 3.5vw, 40px)",
                  fontWeight: 400,
                  fontStyle: "italic",
                  letterSpacing: "-0.03em",
                  color: "var(--text-primary)",
                  fontFamily: "var(--font-display)",
                  lineHeight: 1.1,
                  margin: 0,
                }}
              >
                Everything a story needs
              </h2>
              <p
                style={{
                  fontSize: 14,
                  color: "var(--text-secondary)",
                  lineHeight: 1.65,
                  maxWidth: 320,
                  fontFamily: "var(--font-body)",
                  margin: 0,
                }}
              >
                Built on the same principles that make software collaboration
                work — applied to the craft of writing.
              </p>
            </div>
          </motion.div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 1,
              background: "var(--border)",
              border: "1.5px solid var(--border)",
              borderRadius: 12,
              overflow: "hidden",
            }}
          >
            {features.map((f) => (
              <motion.div
                key={f.title}
                variants={rise}
                style={{
                  background: "var(--bg)",
                  padding: "28px 24px",
                  transition: "background 0.15s",
                }}
                onMouseEnter={(e) =>
                  ((e.currentTarget as HTMLElement).style.background =
                    "var(--bg-subtle)")
                }
                onMouseLeave={(e) =>
                  ((e.currentTarget as HTMLElement).style.background =
                    "var(--bg)")
                }
              >
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 8,
                    marginBottom: 16,
                    background: "var(--bg-muted)",
                    border: "1px solid var(--border)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "var(--text-secondary)",
                  }}
                >
                  {f.icon}
                </div>
                <h3
                  style={{
                    fontSize: 14,
                    fontWeight: 600,
                    color: "var(--text-primary)",
                    marginBottom: 8,
                    fontFamily: "var(--font-body)",
                    letterSpacing: "-0.01em",
                  }}
                >
                  {f.title}
                </h3>
                <p
                  style={{
                    fontSize: 13,
                    color: "var(--text-secondary)",
                    lineHeight: 1.6,
                    fontFamily: "var(--font-body)",
                    margin: 0,
                  }}
                >
                  {f.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </Reveal>
      </section>

      {/* ─── CTA ───────────────────────────────────────────── */}
      <section
        style={{ maxWidth: 1120, margin: "0 auto", padding: "0 32px 96px" }}
      >
        <Reveal>
          <motion.div
            variants={rise}
            style={{
              background: "var(--text-primary)",
              borderRadius: 16,
              padding: "56px 56px",
              display: "grid",
              gridTemplateColumns: "1fr auto",
              gap: 48,
              alignItems: "center",
            }}
          >
            <div>
              <h2
                style={{
                  fontSize: "clamp(24px, 3.5vw, 40px)",
                  fontWeight: 400,
                  fontStyle: "italic",
                  letterSpacing: "-0.03em",
                  color: "#fff",
                  fontFamily: "var(--font-display)",
                  lineHeight: 1.1,
                  marginBottom: 12,
                }}
              >
                Ready to write your
                <br />
                first branch?
              </h2>
              <p
                style={{
                  fontSize: 15,
                  color: "rgba(255,255,255,0.5)",
                  lineHeight: 1.65,
                  maxWidth: 380,
                  fontFamily: "var(--font-body)",
                  fontWeight: 300,
                  margin: 0,
                }}
              >
                Join ForkTale and build stories that live, breathe and evolve.
                No credit card required.
              </p>
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 10,
                minWidth: 190,
              }}
            >
              <Link to="/register">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  style={{
                    width: "100%",
                    padding: "12px 22px",
                    fontSize: 14,
                    fontWeight: 600,
                    background: "#fff",
                    color: "var(--text-primary)",
                    border: "none",
                    borderRadius: 8,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 7,
                    fontFamily: "var(--font-body)",
                    transition: "all 0.15s",
                  }}
                >
                  Start writing free <ArrowRight size={13} />
                </motion.button>
              </Link>
              <Link to="/discover">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  style={{
                    width: "100%",
                    padding: "12px 22px",
                    fontSize: 14,
                    background: "transparent",
                    color: "rgba(255,255,255,0.65)",
                    border: "1px solid rgba(255,255,255,0.18)",
                    borderRadius: 8,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 7,
                    fontFamily: "var(--font-body)",
                    transition: "all 0.15s",
                  }}
                >
                  Browse stories
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </Reveal>
      </section>

      {/* ─── Footer ────────────────────────────────────────── */}
      <footer
        style={{ borderTop: "1px solid var(--border)", padding: "28px 32px" }}
      >
        <div
          style={{
            maxWidth: 1120,
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 12,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div
              style={{
                width: 22,
                height: 22,
                background: "var(--text-primary)",
                borderRadius: 5,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <GitBranch size={11} color="white" />
            </div>
            <span
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: "var(--text-primary)",
                fontFamily: "var(--font-body)",
              }}
            >
              ForkTale
            </span>
            <span
              style={{
                fontSize: 12,
                color: "var(--text-muted)",
                marginLeft: 6,
                fontFamily: "var(--font-body)",
              }}
            >
              Version control for storytellers.
            </span>
          </div>
          <div style={{ display: "flex", gap: 20 }}>
            {[
              { l: "Discover", to: "/discover" },
              { l: "Sign up", to: "/register" },
              { l: "Log in", to: "/login" },
            ].map((lk) => (
              <Link
                key={lk.to}
                to={lk.to}
                style={{
                  fontSize: 13,
                  color: "var(--text-muted)",
                  fontFamily: "var(--font-body)",
                  transition: "color 0.15s",
                }}
                onMouseEnter={(e) =>
                  ((e.target as HTMLElement).style.color =
                    "var(--text-primary)")
                }
                onMouseLeave={(e) =>
                  ((e.target as HTMLElement).style.color = "var(--text-muted)")
                }
              >
                {lk.l}
              </Link>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
