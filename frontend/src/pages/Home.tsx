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

/*animation*/
const rise: Variants = {
  hidden: { opacity: 0, y: 22 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  },
};
const cascade: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09 } },
};
function Reveal({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef(null);
  const visible = useInView(ref, { once: true, margin: "-56px" });
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

/*data */
const features = [
  {
    icon: <GitBranch size={18} />,
    title: "Branch timelines",
    desc: "Every 'what if' becomes its own narrative path. Explore alternate directions without touching your main story.",
  },
  {
    icon: <GitFork size={18} />,
    title: "Fork any story",
    desc: "Clone a published story and carry it somewhere new. Build on others' work, or take your own in a new direction.",
  },
  {
    icon: <Sparkles size={18} />,
    title: "AI co-author",
    desc: "Real-time suggestions, plot continuations and prose refinements — as natural as a writing partner, not a chatbot.",
  },
  {
    icon: <Users size={18} />,
    title: "Collaborate",
    desc: "Invite co-authors with role-based access. Control who can read, write, or merge — just like a dev team.",
  },
  {
    icon: <BookOpen size={18} />,
    title: "Multiple endings",
    desc: "Publish every branch as a separate ending. Let readers choose their own path through your world.",
  },
  {
    icon: <Globe size={18} />,
    title: "Discover & remix",
    desc: "Browse the best collaborative fiction, rate endings, and fork favourites to build something new.",
  },
];

/* Tech highlights — replaces fake stats bar */
const techHighlights = [
  {
    icon: <Database size={14} />,
    label: "Self-referential schema",
    detail: "Directed acyclic commit graph in PostgreSQL via Prisma",
  },
  {
    icon: <Zap size={14} />,
    label: "SSE streaming",
    detail: "Real-time Gemini AI output via Server-Sent Events",
  },
  {
    icon: <Shield size={14} />,
    label: "RBAC auth",
    detail: "JWT + role-gated collaboration (VIEWER / EDITOR / OWNER)",
  },
  {
    icon: <GitBranch size={14} />,
    label: "30+ REST endpoints",
    detail: "Validated with Zod, ~97% TypeScript coverage",
  },
];

/*Branch graph — replaces generic terminal mockup*/
function BranchGraph() {
  const commits = [
    {
      id: "c1",
      x: 56,
      y: 44,
      branch: "main",
      label: "Initial draft",
      time: "3d ago",
    },
    {
      id: "c2",
      x: 176,
      y: 44,
      branch: "main",
      label: "Chapter 2",
      time: "2d ago",
    },
    {
      id: "c3",
      x: 296,
      y: 44,
      branch: "main",
      label: "Revised ending",
      time: "1d ago",
    },
    {
      id: "c4",
      x: 416,
      y: 44,
      branch: "main",
      label: "The kingdom falls",
      time: "4h ago",
    },
    {
      id: "b1",
      x: 296,
      y: 120,
      branch: "dark-ending",
      label: "Villain wins",
      time: "20h ago",
    },
    {
      id: "b2",
      x: 416,
      y: 120,
      branch: "dark-ending",
      label: "Published",
      time: "8h ago",
    },
    {
      id: "b3",
      x: 296,
      y: 196,
      branch: "hero-arc",
      label: "Hero rises",
      time: "12h ago",
    },
    {
      id: "b4",
      x: 416,
      y: 196,
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

  const branchMeta = [
    { y: 44, name: "main", color: "#2563eb" },
    { y: 120, name: "dark-ending", color: "#7c3aed" },
    { y: 196, name: "hero-arc", color: "#16a34a" },
  ];

  return (
    <div
      style={{
        background: "var(--bg)",
        border: "1.5px solid var(--border)",
        borderRadius: 16,
        boxShadow: "var(--shadow-xl)",
        overflow: "hidden",
      }}
    >
      {/* Window chrome */}
      <div
        style={{
          padding: "13px 20px",
          borderBottom: "1px solid var(--border)",
          background: "var(--bg-subtle)",
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}
      >
        <div style={{ display: "flex", gap: 6 }}>
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

      {/* Graph */}
      <div style={{ padding: "20px 20px 16px", display: "flex", gap: 0 }}>
        {/* Branch lane labels */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            paddingTop: 2,
            flexShrink: 0,
          }}
        >
          {branchMeta.map((b) => (
            <div
              key={b.name}
              style={{
                height: 76,
                display: "flex",
                alignItems: "center",
                gap: 6,
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
                  fontSize: 10,
                  fontFamily: "var(--font-mono)",
                  color: "var(--text-muted)",
                  whiteSpace: "nowrap",
                }}
              >
                {b.name}
              </span>
            </div>
          ))}
        </div>

        {/* SVG commit graph */}
        <svg
          viewBox="0 0 500 228"
          style={{ width: "100%", height: "auto", display: "block" }}
          aria-label="Commit graph showing main, dark-ending, and hero-arc branches"
        >
          {/* Main branch line */}
          <line
            x1="56"
            y1="44"
            x2="416"
            y2="44"
            stroke="#2563eb"
            strokeWidth="1.5"
            strokeOpacity="0.25"
          />

          {/* Branch fork lines */}
          <line
            x1="176"
            y1="44"
            x2="296"
            y2="120"
            stroke="#7c3aed"
            strokeWidth="1.5"
            strokeOpacity="0.3"
          />
          <line
            x1="296"
            y1="120"
            x2="416"
            y2="120"
            stroke="#7c3aed"
            strokeWidth="1.5"
            strokeOpacity="0.25"
          />

          <line
            x1="176"
            y1="44"
            x2="296"
            y2="196"
            stroke="#16a34a"
            strokeWidth="1.5"
            strokeOpacity="0.3"
          />
          <line
            x1="296"
            y1="196"
            x2="416"
            y2="196"
            stroke="#16a34a"
            strokeWidth="1.5"
            strokeOpacity="0.25"
          />

          {/* Commit nodes */}
          {commits.map((c, i) => (
            <motion.g
              key={c.id}
              initial={{ opacity: 0, scale: 0.4 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 + i * 0.07, duration: 0.28 }}
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
              <text
                x={c.x}
                y={c.y - 13}
                textAnchor="middle"
                fontSize="8.5"
                fill="var(--text-muted, #94a3b8)"
                fontFamily="var(--font-body, system-ui)"
              >
                {c.label}
              </text>
            </motion.g>
          ))}

          {/* Published badge on dark-ending tip */}
          <motion.g
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.0 }}
          >
            <rect
              x="388"
              y="130"
              width="58"
              height="15"
              rx="7"
              fill="rgba(22,163,74,0.1)"
              stroke="rgba(22,163,74,0.28)"
              strokeWidth="1"
            />
            <text
              x="417"
              y="141"
              textAnchor="middle"
              fontSize="7.5"
              fill="#16a34a"
              fontFamily="var(--font-body, system-ui)"
              fontWeight="600"
            >
              published
            </text>
          </motion.g>

          {/* AI suggestion bubble */}
          <motion.g
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
          >
            <rect
              x="10"
              y="208"
              width="480"
              height="16"
              rx="4"
              fill="rgba(37,99,235,0.05)"
              stroke="rgba(37,99,235,0.12)"
              strokeWidth="1"
            />
            <text
              x="20"
              y="219"
              fontSize="8"
              fill="var(--accent, #2563eb)"
              fontFamily="var(--font-body, system-ui)"
              fontWeight="600"
            >
              ✦ AI
            </text>
            <text
              x="42"
              y="219"
              fontSize="8"
              fill="var(--text-muted, #94a3b8)"
              fontFamily="var(--font-body, system-ui)"
            >
              "A hooded figure appears at the gate just as dawn breaks over the
              castle…"
            </text>
          </motion.g>
        </svg>
      </div>

      {/* Footer strip */}
      <div
        style={{
          borderTop: "1px solid var(--border)",
          padding: "9px 20px",
          background: "var(--bg-subtle)",
          display: "flex",
          alignItems: "center",
          gap: 14,
        }}
      >
        <span
          style={{
            fontSize: 11,
            color: "var(--text-muted)",
            fontFamily: "var(--font-mono)",
          }}
        >
          3 branches · 8 commits
        </span>
        <div style={{ width: 1, height: 11, background: "var(--border)" }} />
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <Sparkles size={10} style={{ color: "#16a34a" }} />
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
      </div>
    </div>
  );
}

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
            height: 60,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {/* Logo */}
          <Link
            to="/"
            style={{ display: "flex", alignItems: "center", gap: 8 }}
          >
            <div
              style={{
                width: 30,
                height: 30,
                background: "var(--text-primary)",
                borderRadius: 7,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <GitBranch size={15} color="white" />
            </div>
            <span
              style={{
                fontSize: 16,
                fontWeight: 700,
                color: "var(--text-primary)",
                fontFamily: "var(--font-body)",
                letterSpacing: "-0.02em",
              }}
            >
              ForkTale
            </span>
          </Link>

          {/* Links */}
          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            {[{ label: "Discover", to: "/discover" }].map((l) => (
              <Link
                key={l.to}
                to={l.to}
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
                {l.label}
              </Link>
            ))}

            <div
              style={{
                width: 1,
                height: 20,
                background: "var(--border)",
                margin: "0 8px",
              }}
            />

            <Link to="/login">
              <button className="btn btn-ghost btn-sm">Log in</button>
            </Link>
            <Link to="/register">
              <button className="btn btn-primary btn-sm">
                Get started <ArrowRight size={13} />
              </button>
            </Link>
          </div>
        </nav>
      </header>

      {/*Hero */}
      <section
        style={{ maxWidth: 1120, margin: "0 auto", padding: "88px 32px 72px" }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 56,
            alignItems: "center",
          }}
        >
          {/* Left copy */}
          <div style={{ maxWidth: 560 }}>
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              style={{ marginBottom: 24 }}
            >
              <span
                className="badge badge-accent"
                style={{ fontSize: 12, padding: "5px 12px" }}
              >
                <GitBranch size={11} />
                Version control for collaborative fiction
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.65,
                delay: 0.06,
                ease: [0.22, 1, 0.36, 1],
              }}
              style={{
                fontSize: "clamp(40px, 5.5vw, 68px)",
                lineHeight: 1.04,
                fontWeight: 400,
                letterSpacing: "-0.03em",
                color: "var(--text-primary)",
                fontFamily: "var(--font-display)",
                marginBottom: 24,
              }}
            >
              Stories that
              <br />
              <em style={{ fontStyle: "italic" }}>branch</em> and{" "}
              <em style={{ fontStyle: "italic" }}>evolve</em>.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.14 }}
              style={{
                fontSize: 18,
                color: "var(--text-secondary)",
                lineHeight: 1.7,
                maxWidth: 500,
                marginBottom: 36,
                fontFamily: "var(--font-body)",
                fontWeight: 400,
              }}
            >
              ForkTale brings Git version control to collaborative fiction.
              Branch timelines, fork stories, commit chapters — and let AI help
              write what comes next.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.22 }}
              style={{
                display: "flex",
                gap: 12,
                flexWrap: "wrap",
                marginBottom: 48,
              }}
            >
              <Link to="/register">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="btn btn-primary btn-lg"
                >
                  Start writing free <ArrowRight size={15} />
                </motion.button>
              </Link>
              <Link to="/discover">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="btn btn-secondary btn-lg"
                >
                  <BookOpen size={15} /> Browse stories
                </motion.button>
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.36 }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 20,
                flexWrap: "wrap",
              }}
            >
              {["No credit card", "Free to start", "Fork any story"].map(
                (t) => (
                  <div
                    key={t}
                    style={{ display: "flex", alignItems: "center", gap: 6 }}
                  >
                    <CheckCircle2
                      size={14}
                      style={{ color: "#16a34a", flexShrink: 0 }}
                    />
                    <span
                      style={{
                        fontSize: 13,
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

          {/* Right */}
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          >
            <BranchGraph />
          </motion.div>
        </div>
      </section>

      {/* Tech highlights */}
      <section
        style={{
          borderTop: "1px solid var(--border)",
          borderBottom: "1px solid var(--border)",
          background: "var(--bg-subtle)",
        }}
      >
        <div style={{ maxWidth: 1120, margin: "0 auto", padding: "36px 32px" }}>
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
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 7,
                      marginBottom: 5,
                      color: "var(--accent)",
                    }}
                  >
                    {t.icon}
                    <span
                      style={{
                        fontSize: 13,
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

      {/*Features*/}
      <section
        style={{ maxWidth: 1120, margin: "0 auto", padding: "96px 32px" }}
      >
        <Reveal>
          <motion.div variants={rise} style={{ marginBottom: 64 }}>
            <p
              style={{
                fontSize: 12,
                fontWeight: 600,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "var(--accent)",
                marginBottom: 14,
                fontFamily: "var(--font-body)",
              }}
            >
              Platform features
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
                  fontSize: "clamp(28px,4vw,44px)",
                  fontWeight: 400,
                  fontStyle: "italic",
                  letterSpacing: "-0.03em",
                  color: "var(--text-primary)",
                  fontFamily: "var(--font-display)",
                  lineHeight: 1.1,
                }}
              >
                Everything a story needs
              </h2>
              <p
                style={{
                  fontSize: 15,
                  color: "var(--text-secondary)",
                  lineHeight: 1.7,
                  maxWidth: 340,
                  fontFamily: "var(--font-body)",
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
              gridTemplateColumns: "repeat(3,1fr)",
              gap: 2,
              background: "var(--border)",
              border: "1.5px solid var(--border)",
              borderRadius: 14,
              overflow: "hidden",
            }}
          >
            {features.map((f) => (
              <motion.div
                key={f.title}
                variants={rise}
                style={{
                  background: "var(--bg)",
                  padding: "32px 28px",
                  cursor: "default",
                  transition: "background 0.18s",
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
                    width: 36,
                    height: 36,
                    borderRadius: 9,
                    marginBottom: 20,
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
                    fontSize: 15,
                    fontWeight: 600,
                    color: "var(--text-primary)",
                    marginBottom: 10,
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
                    lineHeight: 1.65,
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

      {/*CTA */}
      <section
        style={{ maxWidth: 1120, margin: "0 auto", padding: "0 32px 96px" }}
      >
        <Reveal>
          <motion.div
            variants={rise}
            style={{
              background: "var(--text-primary)",
              borderRadius: 20,
              padding: "72px 64px",
              display: "grid",
              gridTemplateColumns: "1fr auto",
              gap: 48,
              alignItems: "center",
            }}
          >
            <div>
              <p
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "rgba(255,255,255,0.45)",
                  marginBottom: 16,
                  fontFamily: "var(--font-body)",
                }}
              >
                Get started free
              </p>
              <h2
                style={{
                  fontSize: "clamp(28px, 4vw, 48px)",
                  fontWeight: 400,
                  fontStyle: "italic",
                  letterSpacing: "-0.03em",
                  color: "#fff",
                  fontFamily: "var(--font-display)",
                  lineHeight: 1.1,
                  marginBottom: 16,
                }}
              >
                Ready to write your
                <br />
                first branch?
              </h2>
              <p
                style={{
                  fontSize: 16,
                  color: "rgba(255,255,255,0.55)",
                  lineHeight: 1.7,
                  maxWidth: 400,
                  fontFamily: "var(--font-body)",
                  fontWeight: 300,
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
                gap: 12,
                minWidth: 200,
              }}
            >
              <Link to="/register">
                <motion.button
                  whileHover={{ scale: 1.03, background: "#f1f5f9" }}
                  whileTap={{ scale: 0.97 }}
                  style={{
                    width: "100%",
                    padding: "13px 24px",
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
                    gap: 8,
                    fontFamily: "var(--font-body)",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.12)",
                    transition: "all 0.15s",
                  }}
                >
                  Start writing free <ArrowRight size={14} />
                </motion.button>
              </Link>
              <Link to="/discover">
                <motion.button
                  whileHover={{
                    scale: 1.03,
                    background: "rgba(255,255,255,0.1)",
                  }}
                  whileTap={{ scale: 0.97 }}
                  style={{
                    width: "100%",
                    padding: "13px 24px",
                    fontSize: 14,
                    background: "transparent",
                    color: "rgba(255,255,255,0.75)",
                    border: "1px solid rgba(255,255,255,0.2)",
                    borderRadius: 8,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 8,
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

      {/*Footer*/}
      <footer
        style={{ borderTop: "1px solid var(--border)", padding: "32px 32px" }}
      >
        <div
          style={{
            maxWidth: 1120,
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 16,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div
              style={{
                width: 24,
                height: 24,
                background: "var(--text-primary)",
                borderRadius: 5,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <GitBranch size={12} color="white" />
            </div>
            <span
              style={{
                fontSize: 14,
                fontWeight: 600,
                color: "var(--text-primary)",
                fontFamily: "var(--font-body)",
              }}
            >
              ForkTale
            </span>
            <span
              style={{
                fontSize: 13,
                color: "var(--text-muted)",
                marginLeft: 8,
                fontFamily: "var(--font-body)",
              }}
            >
              Version control for storytellers.
            </span>
          </div>
          <div style={{ display: "flex", gap: 24 }}>
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
