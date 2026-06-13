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

const steps = [
  {
    n: "1",
    title: "Create a story",
    desc: "Start a new project. A main branch is created automatically — your canonical timeline.",
  },
  {
    n: "2",
    title: "Write and commit",
    desc: "Save chapters as commits with a short message. Every version is stored and reversible.",
  },
  {
    n: "3",
    title: "Branch alternate paths",
    desc: "Fork your own story at any point to explore a different direction. No risk, no pressure.",
  },
  {
    n: "4",
    title: "Publish your endings",
    desc: "Publish one or many branches. Readers arrive at your story and choose how it ends.",
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

/*Feather Pen Graphic*/
function FeatherPenIllustration() {
  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        minHeight: 380,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* Decorative ring 1 */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* Outer glow ring */}
        <div
          style={{
            position: "absolute",
            width: 340,
            height: 340,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(37,99,235,0.07) 0%, rgba(37,99,235,0.02) 60%, transparent 80%)",
          }}
        />
        {/* Middle dashed ring */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          style={{
            position: "absolute",
            width: 280,
            height: 280,
            borderRadius: "50%",
            border: "1.5px dashed rgba(37,99,235,0.15)",
          }}
        />
        {/* Inner solid ring */}
        <div
          style={{
            position: "absolute",
            width: 200,
            height: 200,
            borderRadius: "50%",
            border: "1px solid rgba(37,99,235,0.1)",
            background: "rgba(37,99,235,0.03)",
          }}
        />

        {/* The feather pen */}
        <motion.div
          initial={{ opacity: 0, y: 20, rotate: -10 }}
          animate={{ opacity: 1, y: 0, rotate: 0 }}
          transition={{ duration: 0.9, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
          style={{
            position: "relative",
            zIndex: 10,
            filter:
              "drop-shadow(0 12px 32px rgba(37,99,235,0.18)) drop-shadow(0 2px 8px rgba(0,0,0,0.08))",
          }}
        >
          {/* Floating animation wrapper */}
          <motion.div
            animate={{ y: [-6, 6, -6] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 48 48"
              width="140"
              height="140"
            >
              <g>
                <path
                  fill="var(--text-primary, #0f172a)"
                  d="M40.2384 1.5c-4.5201 0 -8.8426 0.8513 -12.815 2.40277 -0.1254 0.04898 -0.2257 0.14646 -0.2783 0.27038l-0.0004 0.00092 -0.001 0.00241 -0.0039 0.00919 -0.015 0.03542c-0.013 0.03099 -0.0321 0.07649 -0.0565 0.13498 -0.0487 0.11696 -0.1186 0.28591 -0.2035 0.49464 -0.1698 0.41729 -0.4002 0.99443 -0.6423 1.63355 -0.331 0.87409 -0.6924 1.88573 -0.9475 2.76652l-1.5271 -2.12507c-0.4488 -0.62455 -1.3084 -0.81685 -1.977 -0.40464C11.8229 12.8542 5.15266 23.796 5.00264 36.307c-1.60814 2.5806 -2.937 5.2676 -3.89333 8.0409 -0.360079 1.0443 0.19453 2.1827 1.23877 2.5427 1.04423 0.3601 2.18264 -0.1945 2.54272 -1.2387 2.35258 -6.8225 7.3502 -13.3074 13.4713 -19 4.6713 -4.3443 10.0706 -7.9539 15.6768 -10.9726 0.7294 -0.3928 1.6391 -0.1199 2.0319 0.6095 0.3927 0.7295 0.1198 1.6391 -0.6096 2.0319 -5.261 2.8329 -11.1224 6.7764 -16.1602 11.4615 -4.1509 3.8604 -7.683 8.1687 -9.89112 12.7178h1.35182c6.5302 0 12.647 -1.7768 17.8915 -4.8735 1.0247 -0.605 0.9113 -2.062 -0.114 -2.5717l-2.159 -1.0734c1.5046 -0.1303 3.2186 -0.3728 4.7134 -0.6121 1.3298 -0.2129 2.657 -0.4446 3.978 -0.7068 0.0945 -0.0188 0.1816 -0.0646 0.2507 -0.1318 6.5856 -6.4021 10.6778 -15.358 10.6778 -25.26884 0 -1.17158 -0.0572 -2.32996 -0.169 -3.47247 -0.11 -1.12403 -0.9964 -2.0105 -2.1205 -2.12045C42.5682 1.55718 41.4099 1.5 40.2384 1.5Z"
                />
              </g>
            </svg>
          </motion.div>
        </motion.div>
      </motion.div>
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

      {/* Hero */}
      <section
        style={{ maxWidth: 1120, margin: "0 auto", padding: "96px 32px 80px" }}
      >
        {/* Split container balancing content text and graphics */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
            gap: 48,
            alignItems: "center",
          }}
        >
          <div style={{ maxWidth: 760 }}>
            {/* Eyebrow */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              style={{ marginBottom: 28 }}
            >
              <span
                className="badge badge-accent"
                style={{ fontSize: 12, padding: "5px 12px" }}
              >
                <GitBranch size={11} />
                Version control for collaborative fiction
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.65,
                delay: 0.06,
                ease: [0.22, 1, 0.36, 1],
              }}
              style={{
                fontSize: "clamp(44px, 6.5vw, 76px)",
                lineHeight: 1.04,
                fontWeight: 400,
                letterSpacing: "-0.03em",
                color: "var(--text-primary)",
                fontFamily: "var(--font-display)",
                marginBottom: 28,
              }}
            >
              Stories that
              <br />
              <em style={{ fontStyle: "italic" }}>branch</em> and{" "}
              <em style={{ fontStyle: "italic" }}>evolve</em>.
            </motion.h1>

            {/* Sub */}
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.14 }}
              style={{
                fontSize: 18,
                color: "var(--text-secondary)",
                lineHeight: 1.7,
                maxWidth: 540,
                marginBottom: 40,
                fontFamily: "var(--font-body)",
                fontWeight: 400,
              }}
            >
              ForkTale brings Git version control to collaborative fiction.
              Branch timelines, fork stories, commit chapters — and let AI help
              write what comes next.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.22 }}
              style={{
                display: "flex",
                gap: 12,
                flexWrap: "wrap",
                marginBottom: 56,
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

            {/* Trust line */}
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

          {/* Right Column — Feather Pen Graphic (UNCHANGED) */}
          <div>
            <FeatherPenIllustration />
          </div>
        </div>

        {/* Hero visual — terminal + branch graph (UNCHANGED) */}
        <motion.div
          initial={{ opacity: 0, y: 36 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.28, ease: [0.22, 1, 0.36, 1] }}
          style={{ marginTop: 72 }}
        >
          {/* Outer shell */}
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
                padding: "14px 20px",
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
                      width: 11,
                      height: 11,
                      borderRadius: "50%",
                      background: c,
                    }}
                  />
                ))}
              </div>
              <span
                style={{
                  marginLeft: 12,
                  fontSize: 12,
                  fontFamily: "var(--font-mono)",
                  color: "var(--text-muted)",
                  letterSpacing: "0.01em",
                }}
              >
                forktale / the-last-kingdom
              </span>
            </div>

            {/* Two-pane layout */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}>
              {/* Left — branch list */}
              <div
                style={{
                  padding: "24px 28px",
                  borderRight: "1px solid var(--border)",
                }}
              >
                <p
                  style={{
                    fontSize: 11,
                    fontWeight: 600,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    color: "var(--text-muted)",
                    marginBottom: 16,
                    fontFamily: "var(--font-body)",
                  }}
                >
                  Branches
                </p>
                {[
                  { name: "main", color: "#2563eb", commits: 12, active: true },
                  {
                    name: "dark-ending",
                    color: "#7c3aed",
                    commits: 8,
                    active: false,
                  },
                  {
                    name: "hero-arc",
                    color: "#16a34a",
                    commits: 5,
                    active: false,
                  },
                  {
                    name: "twist-ending",
                    color: "#ea580c",
                    commits: 3,
                    active: false,
                  },
                ].map((b, i) => (
                  <motion.div
                    key={b.name}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + i * 0.07 }}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "9px 12px",
                      borderRadius: 8,
                      marginBottom: 4,
                      background: b.active
                        ? "var(--accent-subtle)"
                        : "transparent",
                      border: `1.5px solid ${b.active ? "var(--accent-border)" : "transparent"}`,
                      cursor: "pointer",
                    }}
                  >
                    <div
                      style={{ display: "flex", alignItems: "center", gap: 10 }}
                    >
                      <div
                        style={{
                          width: 7,
                          height: 7,
                          borderRadius: "50%",
                          background: b.color,
                          flexShrink: 0,
                        }}
                      />
                      <span
                        style={{
                          fontSize: 13,
                          fontFamily: "var(--font-mono)",
                          color: b.active
                            ? "var(--accent)"
                            : "var(--text-primary)",
                        }}
                      >
                        {b.name}
                      </span>
                    </div>
                    <span
                      style={{
                        fontSize: 11,
                        color: "var(--text-muted)",
                        fontFamily: "var(--font-body)",
                      }}
                    >
                      {b.commits} commits
                    </span>
                  </motion.div>
                ))}
              </div>

              {/* Right — commit feed + AI */}
              <div style={{ padding: "24px 28px" }}>
                <p
                  style={{
                    fontSize: 11,
                    fontWeight: 600,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    color: "var(--text-muted)",
                    marginBottom: 16,
                    fontFamily: "var(--font-body)",
                  }}
                >
                  Recent commits
                </p>
                {[
                  {
                    msg: "The kingdom falls into darkness",
                    time: "2m ago",
                    branch: "main",
                  },
                  {
                    msg: "The prince sets out on his journey",
                    time: "1h ago",
                    branch: "main",
                  },
                  {
                    msg: "The witch claims her final victory",
                    time: "3h ago",
                    branch: "dark-ending",
                  },
                  {
                    msg: "Light returns to the kingdom",
                    time: "1d ago",
                    branch: "hero-arc",
                  },
                ].map((c, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 + i * 0.08 }}
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: 10,
                      paddingBottom: 12,
                      marginBottom: 12,
                      borderBottom: i < 3 ? "1px solid var(--border)" : "none",
                    }}
                  >
                    <div
                      style={{
                        width: 6,
                        height: 6,
                        borderRadius: "50%",
                        background: "var(--border-strong)",
                        flexShrink: 0,
                        marginTop: 5,
                      }}
                    />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p
                        style={{
                          fontSize: 13,
                          color: "var(--text-primary)",
                          fontFamily: "var(--font-body)",
                          marginBottom: 2,
                          lineHeight: 1.4,
                        }}
                      >
                        {c.msg}
                      </p>
                      <div style={{ display: "flex", gap: 8 }}>
                        <span
                          style={{
                            fontSize: 11,
                            color: "var(--text-muted)",
                            fontFamily: "var(--font-mono)",
                          }}
                        >
                          {c.branch}
                        </span>
                        <span
                          style={{ fontSize: 11, color: "var(--text-muted)" }}
                        >
                          ·
                        </span>
                        <span
                          style={{ fontSize: 11, color: "var(--text-muted)" }}
                        >
                          {c.time}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}

                {/* AI suggestion */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.0 }}
                  style={{
                    marginTop: 4,
                    padding: "10px 14px",
                    borderRadius: 8,
                    background: "#f0fdf4",
                    border: "1px solid #bbf7d0",
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 10,
                  }}
                >
                  <Sparkles
                    size={13}
                    style={{ color: "#16a34a", flexShrink: 0, marginTop: 1 }}
                  />
                  <div>
                    <p
                      style={{
                        fontSize: 11,
                        fontWeight: 600,
                        color: "#15803d",
                        fontFamily: "var(--font-body)",
                        marginBottom: 2,
                      }}
                    >
                      AI suggestion
                    </p>
                    <p
                      style={{
                        fontSize: 12,
                        color: "#166534",
                        fontFamily: "var(--font-body)",
                        lineHeight: 1.5,
                      }}
                    >
                      "A hooded figure appears at the gate just as dawn breaks
                      over the castle..."
                    </p>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ─── Tech highlights (replaces fake stats bar) ────────── */}
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

      {/* Features */}
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

      {/* How it works */}
      <section
        style={{
          background: "var(--bg-subtle)",
          borderTop: "1px solid var(--border)",
          borderBottom: "1px solid var(--border)",
          padding: "96px 32px",
        }}
      >
        <div style={{ maxWidth: 1120, margin: "0 auto" }}>
          <Reveal>
            <motion.div
              variants={rise}
              style={{ textAlign: "center", marginBottom: 72 }}
            >
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
                How it works
              </p>
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
                Like Git, but for your imagination
              </h2>
            </motion.div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(4,1fr)",
                gap: 40,
                position: "relative",
              }}
            >
              {/* connector line */}
              <div
                style={{
                  position: "absolute",
                  top: 20,
                  left: "12.5%",
                  right: "12.5%",
                  height: 1,
                  background: "var(--border)",
                  zIndex: 0,
                }}
              />

              {steps.map((s, i) => (
                <motion.div
                  key={s.n}
                  variants={rise}
                  style={{ position: "relative", zIndex: 1 }}
                >
                  {/* Step number */}
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: "50%",
                      background: i === 0 ? "var(--text-primary)" : "var(--bg)",
                      border: `1.5px solid ${i === 0 ? "var(--text-primary)" : "var(--border-strong)"}`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginBottom: 24,
                      boxShadow: "var(--shadow-sm)",
                    }}
                  >
                    <span
                      style={{
                        fontSize: 14,
                        fontWeight: 700,
                        color: i === 0 ? "#fff" : "var(--text-secondary)",
                        fontFamily: "var(--font-body)",
                      }}
                    >
                      {s.n}
                    </span>
                  </div>
                  <h3
                    style={{
                      fontSize: 16,
                      fontWeight: 600,
                      color: "var(--text-primary)",
                      marginBottom: 10,
                      fontFamily: "var(--font-body)",
                      letterSpacing: "-0.01em",
                    }}
                  >
                    {s.title}
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
                    {s.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* CTA */}
      <section
        style={{ maxWidth: 1120, margin: "0 auto", padding: "96px 32px" }}
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

      {/* Footer */}
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
