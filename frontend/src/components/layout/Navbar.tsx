import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  GitBranch,
  Compass,
  LayoutDashboard,
  User,
  LogOut,
  Menu,
  X,
  Plus,
  ChevronDown,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setProfileOpen(false);
  }, [location]);

  // close profile dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node))
        setProfileOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const active = (href: string) => location.pathname === href;

  /* shared link style */
  const navLink = (isActive: boolean): React.CSSProperties => ({
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    padding: "6px 12px",
    borderRadius: 6,
    fontSize: 14,
    fontWeight: 500,
    fontFamily: "var(--font-body)",
    textDecoration: "none",
    cursor: "pointer",
    transition: "all 0.15s",
    color: isActive ? "var(--text-primary)" : "var(--text-secondary)",
    background: isActive ? "var(--bg-muted)" : "transparent",
  });

  return (
    <>
      {/* Bar*/}
      <motion.header
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          background: scrolled ? "rgba(255,255,255,0.94)" : "var(--bg)",
          borderBottom: `1px solid ${scrolled ? "var(--border)" : "var(--border)"}`,
          backdropFilter: scrolled ? "blur(12px)" : "none",
          transition: "background 0.2s, box-shadow 0.2s",
          boxShadow: scrolled ? "var(--shadow-sm)" : "none",
        }}
      >
        <div style={{ maxWidth: 1120, margin: "0 auto", padding: "0 32px" }}>
          <div
            style={{
              height: 56,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 16,
            }}
          >
            {/* Logo */}
            <Link
              to="/"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                textDecoration: "none",
                flexShrink: 0,
              }}
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

            {/* Desktop centre links */}
            <nav
              style={{ display: "flex", alignItems: "center", gap: 2, flex: 1 }}
              className="hide-mobile"
            >
              <Link
                to="/discover"
                style={navLink(active("/discover"))}
                onMouseEnter={(e) => {
                  if (!active("/discover")) {
                    (e.currentTarget as HTMLElement).style.background =
                      "var(--bg-subtle)";
                    (e.currentTarget as HTMLElement).style.color =
                      "var(--text-primary)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!active("/discover")) {
                    (e.currentTarget as HTMLElement).style.background =
                      "transparent";
                    (e.currentTarget as HTMLElement).style.color =
                      "var(--text-secondary)";
                  }
                }}
              >
                <Compass size={14} /> Discover
              </Link>
              {isAuthenticated && (
                <Link
                  to="/dashboard"
                  style={navLink(active("/dashboard"))}
                  onMouseEnter={(e) => {
                    if (!active("/dashboard")) {
                      (e.currentTarget as HTMLElement).style.background =
                        "var(--bg-subtle)";
                      (e.currentTarget as HTMLElement).style.color =
                        "var(--text-primary)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!active("/dashboard")) {
                      (e.currentTarget as HTMLElement).style.background =
                        "transparent";
                      (e.currentTarget as HTMLElement).style.color =
                        "var(--text-secondary)";
                    }
                  }}
                >
                  <LayoutDashboard size={14} /> Dashboard
                </Link>
              )}
            </nav>

            {/* Desktop right */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                flexShrink: 0,
              }}
              className="hide-mobile"
            >
              {isAuthenticated ? (
                <>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => navigate("/stories/create")}
                    className="btn btn-primary btn-sm"
                    style={{ gap: 6 }}
                  >
                    <Plus size={13} /> New story
                  </motion.button>

                  {/* Profile dropdown */}
                  <div ref={profileRef} style={{ position: "relative" }}>
                    <button
                      onClick={() => setProfileOpen(!profileOpen)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 7,
                        padding: "5px 10px 5px 6px",
                        borderRadius: 8,
                        cursor: "pointer",
                        background: profileOpen
                          ? "var(--bg-muted)"
                          : "transparent",
                        border: "1.5px solid var(--border)",
                        transition: "all 0.15s",
                        fontFamily: "var(--font-body)",
                      }}
                      onMouseEnter={(e) =>
                        ((e.currentTarget as HTMLElement).style.borderColor =
                          "var(--border-strong)")
                      }
                      onMouseLeave={(e) => {
                        if (!profileOpen)
                          (e.currentTarget as HTMLElement).style.borderColor =
                            "var(--border)";
                      }}
                    >
                      {user?.avatar ? (
                        <img
                          src={user.avatar}
                          alt={user.username}
                          style={{
                            width: 22,
                            height: 22,
                            borderRadius: "50%",
                            objectFit: "cover",
                          }}
                        />
                      ) : (
                        <div
                          style={{
                            width: 22,
                            height: 22,
                            borderRadius: "50%",
                            background: "var(--accent)",
                            color: "white",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: 11,
                            fontWeight: 700,
                            fontFamily: "var(--font-body)",
                          }}
                        >
                          {user?.username?.[0]?.toUpperCase()}
                        </div>
                      )}
                      <span
                        style={{
                          fontSize: 13,
                          fontWeight: 500,
                          color: "var(--text-primary)",
                          fontFamily: "var(--font-body)",
                        }}
                      >
                        {user?.username}
                      </span>
                      <ChevronDown
                        size={12}
                        style={{
                          color: "var(--text-muted)",
                          transform: profileOpen
                            ? "rotate(180deg)"
                            : "rotate(0deg)",
                          transition: "transform 0.15s",
                        }}
                      />
                    </button>

                    <AnimatePresence>
                      {profileOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 6, scale: 0.97 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 6, scale: 0.97 }}
                          transition={{ duration: 0.13 }}
                          style={{
                            position: "absolute",
                            right: 0,
                            top: "calc(100% + 6px)",
                            width: 192,
                            background: "var(--bg)",
                            border: "1.5px solid var(--border)",
                            borderRadius: 10,
                            boxShadow: "var(--shadow-xl)",
                            overflow: "hidden",
                            padding: 4,
                            zIndex: 100,
                          }}
                        >
                          {[
                            {
                              icon: <User size={13} />,
                              label: "Profile",
                              to: `/u/${user?.username}`,
                            },
                            {
                              icon: <LayoutDashboard size={13} />,
                              label: "Dashboard",
                              to: "/dashboard",
                            },
                          ].map((item) => (
                            <Link
                              key={item.label}
                              to={item.to}
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 9,
                                padding: "8px 10px",
                                borderRadius: 7,
                                fontSize: 13,
                                color: "var(--text-secondary)",
                                fontFamily: "var(--font-body)",
                                textDecoration: "none",
                                transition: "all 0.12s",
                              }}
                              onMouseEnter={(e) => {
                                (
                                  e.currentTarget as HTMLElement
                                ).style.background = "var(--bg-subtle)";
                                (e.currentTarget as HTMLElement).style.color =
                                  "var(--text-primary)";
                              }}
                              onMouseLeave={(e) => {
                                (
                                  e.currentTarget as HTMLElement
                                ).style.background = "transparent";
                                (e.currentTarget as HTMLElement).style.color =
                                  "var(--text-secondary)";
                              }}
                            >
                              {item.icon}
                              {item.label}
                            </Link>
                          ))}
                          <div
                            style={{
                              height: 1,
                              background: "var(--border)",
                              margin: "4px 0",
                            }}
                          />
                          <button
                            onClick={logout}
                            style={{
                              width: "100%",
                              display: "flex",
                              alignItems: "center",
                              gap: 9,
                              padding: "8px 10px",
                              border: "none",
                              background: "none",
                              cursor: "pointer",
                              fontSize: 13,
                              color: "#dc2626",
                              fontFamily: "var(--font-body)",
                              borderRadius: 7,
                              transition: "background 0.12s",
                              textAlign: "left",
                            }}
                            onMouseEnter={(e) =>
                              ((
                                e.currentTarget as HTMLElement
                              ).style.background = "#fef2f2")
                            }
                            onMouseLeave={(e) =>
                              ((
                                e.currentTarget as HTMLElement
                              ).style.background = "transparent")
                            }
                          >
                            <LogOut size={13} />
                            Log out
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </>
              ) : (
                <>
                  <Link to="/login">
                    <button className="btn btn-ghost btn-sm">Log in</button>
                  </Link>
                  <Link to="/register">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="btn btn-primary btn-sm"
                    >
                      Get started
                    </motion.button>
                  </Link>
                </>
              )}
            </div>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="show-mobile"
              style={{
                padding: 8,
                background: "none",
                border: "1.5px solid var(--border)",
                borderRadius: 7,
                cursor: "pointer",
                color: "var(--text-secondary)",
                display: "none",
              }}
            >
              {mobileOpen ? <X size={16} /> : <Menu size={16} />}
            </button>
          </div>
        </div>
      </motion.header>

      {/*Mobile menu*/}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18 }}
            style={{
              position: "fixed",
              top: 56,
              left: 0,
              right: 0,
              zIndex: 49,
              background: "var(--bg)",
              borderBottom: "1px solid var(--border)",
              boxShadow: "var(--shadow-md)",
            }}
          >
            <div
              style={{
                maxWidth: 1120,
                margin: "0 auto",
                padding: "12px 24px 16px",
                display: "flex",
                flexDirection: "column",
                gap: 2,
              }}
            >
              {[
                {
                  label: "Discover",
                  to: "/discover",
                  icon: <Compass size={14} />,
                  show: true,
                },
                {
                  label: "Dashboard",
                  to: "/dashboard",
                  icon: <LayoutDashboard size={14} />,
                  show: isAuthenticated,
                },
                {
                  label: "Profile",
                  to: `/u/${user?.username}`,
                  icon: <User size={14} />,
                  show: isAuthenticated,
                },
              ]
                .filter((l) => l.show)
                .map((l) => (
                  <Link
                    key={l.to}
                    to={l.to}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      padding: "10px 12px",
                      borderRadius: 8,
                      fontSize: 14,
                      fontWeight: 500,
                      color: active(l.to)
                        ? "var(--text-primary)"
                        : "var(--text-secondary)",
                      background: active(l.to)
                        ? "var(--bg-muted)"
                        : "transparent",
                      fontFamily: "var(--font-body)",
                      textDecoration: "none",
                    }}
                  >
                    {l.icon}
                    {l.label}
                  </Link>
                ))}

              {isAuthenticated && (
                <>
                  <Link
                    to="/stories/create"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      padding: "10px 12px",
                      borderRadius: 8,
                      fontSize: 14,
                      fontWeight: 600,
                      color: "var(--accent)",
                      fontFamily: "var(--font-body)",
                      textDecoration: "none",
                    }}
                  >
                    <Plus size={14} />
                    New story
                  </Link>
                  <div
                    style={{
                      height: 1,
                      background: "var(--border)",
                      margin: "4px 0",
                    }}
                  />
                  <button
                    onClick={logout}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      padding: "10px 12px",
                      borderRadius: 8,
                      fontSize: 14,
                      fontWeight: 500,
                      color: "#dc2626",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      fontFamily: "var(--font-body)",
                      textAlign: "left",
                    }}
                  >
                    <LogOut size={14} />
                    Log out
                  </button>
                </>
              )}
              {!isAuthenticated && (
                <div style={{ display: "flex", gap: 8, padding: "8px 0 0" }}>
                  <Link to="/login" style={{ flex: 1 }}>
                    <button
                      className="btn btn-secondary"
                      style={{ width: "100%", justifyContent: "center" }}
                    >
                      Log in
                    </button>
                  </Link>
                  <Link to="/register" style={{ flex: 1 }}>
                    <button
                      className="btn btn-primary"
                      style={{ width: "100%", justifyContent: "center" }}
                    >
                      Get started
                    </button>
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div style={{ height: 56 }} />

      {/* Responsive CSS*/}
      <style>{`
        @media (max-width: 768px) {
          .hide-mobile { display: none !important; }
          .show-mobile { display: flex !important; }
        }
        @media (min-width: 769px) {
          .show-mobile { display: none !important; }
        }
      `}</style>
    </>
  );
}
