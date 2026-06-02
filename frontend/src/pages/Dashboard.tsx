import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Plus,
  BookOpen,
  GitBranch,
  GitFork,
  Users,
  MoreHorizontal,
  Trash2,
  Edit,
  Eye,
  Globe,
  Lock,
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { storyService, forkService } from "../services/api";
import { useAuth } from "../context/AuthContext";
import type { Story } from "../types";

function StoryCard({ story }: { story: Story }) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [menuOpen, setMenuOpen] = useState(false);

  const deleteMutation = useMutation({
    mutationFn: () => storyService.deleteStory(story.id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["myStories"] }),
  });

  const defaultBranch = story.branches?.[0];

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="card"
      style={{
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        transition: "box-shadow 0.2s, transform 0.2s",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.boxShadow = "var(--shadow-lg)";
        (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.boxShadow = "var(--shadow-sm)";
        (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
      }}
    >
      {/* Cover */}
      <div
        style={{
          width: "100%",
          height: 130,
          background: "var(--bg-muted)",
          flexShrink: 0,
          overflow: "hidden",
          cursor: "pointer",
          position: "relative",
        }}
        onClick={() =>
          defaultBranch &&
          navigate(`/stories/${story.id}/branches/${defaultBranch.id}`)
        }
      >
        {story.coverImage ? (
          <img
            src={story.coverImage}
            alt={story.title}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              transition: "transform 0.3s",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.transform = "scale(1.03)")
            }
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
          />
        ) : (
          <div
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <BookOpen size={22} style={{ color: "var(--border-strong)" }} />
          </div>
        )}
        {/* Status */}
        <span
          style={{
            position: "absolute",
            top: 10,
            left: 10,
            fontSize: 11,
            fontWeight: 500,
            padding: "3px 8px",
            borderRadius: 99,
            fontFamily: "var(--font-body)",
            display: "inline-flex",
            alignItems: "center",
            gap: 4,
            backdropFilter: "blur(4px)",
            background: story.isPublished
              ? "rgba(22,163,74,0.1)"
              : "rgba(255,255,255,0.85)",
            border: story.isPublished
              ? "1px solid rgba(22,163,74,0.2)"
              : "1px solid var(--border)",
            color: story.isPublished ? "#16a34a" : "var(--text-muted)",
          }}
        >
          {story.isPublished ? (
            <>
              <Globe size={9} />
              Published
            </>
          ) : (
            <>
              <Lock size={9} />
              Draft
            </>
          )}
        </span>
      </div>

      {/* Body */}
      <div
        style={{
          padding: "14px 16px",
          flex: 1,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: 8,
            marginBottom: 6,
          }}
        >
          <h3
            onClick={() =>
              defaultBranch &&
              navigate(`/stories/${story.id}/branches/${defaultBranch.id}`)
            }
            style={{
              fontSize: 14,
              fontWeight: 600,
              color: "var(--text-primary)",
              letterSpacing: "-0.01em",
              cursor: "pointer",
              lineHeight: 1.35,
              fontFamily: "var(--font-body)",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              flex: 1,
              transition: "color 0.15s",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.color = "var(--accent)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.color = "var(--text-primary)")
            }
          >
            {story.title}
          </h3>

          {/* Menu */}
          <div style={{ position: "relative", flexShrink: 0 }}>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              style={{
                padding: 4,
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "var(--text-muted)",
                borderRadius: 4,
                display: "flex",
                transition: "all 0.15s",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.background =
                  "var(--bg-muted)";
                (e.currentTarget as HTMLElement).style.color =
                  "var(--text-primary)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.background =
                  "transparent";
                (e.currentTarget as HTMLElement).style.color =
                  "var(--text-muted)";
              }}
            >
              <MoreHorizontal size={14} />
            </button>

            {menuOpen && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 4 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.12 }}
                style={{
                  position: "absolute",
                  right: 0,
                  top: "calc(100% + 4px)",
                  width: 168,
                  zIndex: 20,
                  background: "var(--bg)",
                  border: "1.5px solid var(--border)",
                  borderRadius: 10,
                  boxShadow: "var(--shadow-xl)",
                  overflow: "hidden",
                  padding: 4,
                }}
              >
                {[
                  {
                    icon: <Edit size={13} />,
                    label: "Edit story",
                    onClick: () => {
                      navigate(`/stories/${story.id}/edit`);
                      setMenuOpen(false);
                    },
                  },
                  ...(defaultBranch
                    ? [
                        {
                          icon: <Eye size={13} />,
                          label: "Open editor",
                          onClick: () => {
                            navigate(
                              `/stories/${story.id}/branches/${defaultBranch.id}`,
                            );
                            setMenuOpen(false);
                          },
                        },
                      ]
                    : []),
                  {
                    icon: <Users size={13} />,
                    label: "Collaborators",
                    onClick: () => {
                      navigate(`/stories/${story.id}/collaborate`);
                      setMenuOpen(false);
                    },
                  },
                ].map((item) => (
                  <button
                    key={item.label}
                    onClick={item.onClick}
                    style={{
                      width: "100%",
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      padding: "8px 10px",
                      border: "none",
                      background: "none",
                      cursor: "pointer",
                      fontSize: 13,
                      color: "var(--text-secondary)",
                      fontFamily: "var(--font-body)",
                      borderRadius: 6,
                      transition: "all 0.12s",
                      textAlign: "left",
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
                    {item.icon}
                    {item.label}
                  </button>
                ))}
                <div
                  style={{
                    height: 1,
                    background: "var(--border)",
                    margin: "4px 0",
                  }}
                />
                <button
                  onClick={() => {
                    if (confirm("Delete this story?")) deleteMutation.mutate();
                    setMenuOpen(false);
                  }}
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "8px 10px",
                    border: "none",
                    background: "none",
                    cursor: "pointer",
                    fontSize: 13,
                    color: "#dc2626",
                    fontFamily: "var(--font-body)",
                    borderRadius: 6,
                    transition: "background 0.12s",
                    textAlign: "left",
                  }}
                  onMouseEnter={(e) =>
                    ((e.currentTarget as HTMLElement).style.background =
                      "#fef2f2")
                  }
                  onMouseLeave={(e) =>
                    ((e.currentTarget as HTMLElement).style.background =
                      "transparent")
                  }
                >
                  <Trash2 size={13} />
                  Delete
                </button>
              </motion.div>
            )}
          </div>
        </div>

        {story.description && (
          <p
            style={{
              fontSize: 12,
              color: "var(--text-muted)",
              lineHeight: 1.5,
              marginBottom: 12,
              fontFamily: "var(--font-body)",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {story.description}
          </p>
        )}

        {/* Stats */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            marginTop: "auto",
            paddingTop: 10,
            borderTop: "1px solid var(--border)",
          }}
        >
          {story.genre && (
            <span className="badge badge-default" style={{ fontSize: 11 }}>
              {story.genre}
            </span>
          )}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              marginLeft: "auto",
            }}
          >
            {[
              {
                icon: <GitBranch size={11} />,
                val: story._count?.branches || 0,
              },
              { icon: <GitFork size={11} />, val: story._count?.forks || 0 },
            ].map((s, i) => (
              <span
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 3,
                  fontSize: 12,
                  color: "var(--text-muted)",
                  fontFamily: "var(--font-body)",
                }}
              >
                {s.icon}
                {s.val}
              </span>
            ))}
            <span
              style={{
                fontSize: 12,
                color: "var(--text-muted)",
                fontFamily: "var(--font-body)",
              }}
            >
              {story.wordCount}w
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function SkeletonCard() {
  return (
    <div className="card" style={{ overflow: "hidden" }}>
      <div
        style={{
          width: "100%",
          height: 130,
          background: "var(--bg-muted)",
          animation: "pulse 1.5s ease-in-out infinite",
        }}
      />
      <div
        style={{
          padding: 16,
          display: "flex",
          flexDirection: "column",
          gap: 8,
        }}
      >
        <div
          style={{
            height: 14,
            width: "70%",
            background: "var(--bg-muted)",
            borderRadius: 4,
            animation: "pulse 1.5s ease-in-out infinite",
          }}
        />
        <div
          style={{
            height: 12,
            width: "45%",
            background: "var(--bg-muted)",
            borderRadius: 4,
            animation: "pulse 1.5s ease-in-out infinite",
          }}
        />
        <div
          style={{ height: 1, background: "var(--border)", margin: "4px 0" }}
        />
        <div style={{ display: "flex", gap: 8 }}>
          <div
            style={{
              height: 12,
              width: 40,
              background: "var(--bg-muted)",
              borderRadius: 4,
              animation: "pulse 1.5s ease-in-out infinite",
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"stories" | "forks">("stories");

  const { data: storiesData, isLoading: storiesLoading } = useQuery({
    queryKey: ["myStories"],
    queryFn: () => storyService.getMyStories(),
  });
  const { data: forksData, isLoading: forksLoading } = useQuery({
    queryKey: ["myForks"],
    queryFn: () => forkService.getMyForks(),
  });

  const stories: Story[] = storiesData?.data?.stories || [];
  const forks: Story[] = forksData?.data?.forks || [];

  const tabs = [
    { key: "stories", label: "My stories", count: stories.length },
    { key: "forks", label: "Forked", count: forks.length },
  ];

  return (
    <div style={{ background: "var(--bg)", minHeight: "100vh" }}>
      {/* Page header */}
      <div
        style={{
          borderBottom: "1px solid var(--border)",
          background: "var(--bg)",
        }}
      >
        <div
          style={{ maxWidth: 1120, margin: "0 auto", padding: "36px 32px 0" }}
        >
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "space-between",
              marginBottom: 28,
            }}
          >
            <div>
              <p
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "var(--accent)",
                  marginBottom: 6,
                  fontFamily: "var(--font-body)",
                }}
              >
                Dashboard
              </p>
              <h1
                style={{
                  fontSize: "clamp(22px,3vw,32px)",
                  fontWeight: 400,
                  fontStyle: "italic",
                  letterSpacing: "-0.03em",
                  color: "var(--text-primary)",
                  fontFamily: "var(--font-display)",
                  lineHeight: 1.1,
                }}
              >
                {user?.name
                  ? `Welcome, ${user.name.split(" ")[0]}`
                  : "Your stories"}
              </h1>
              <p
                style={{
                  fontSize: 13,
                  color: "var(--text-muted)",
                  marginTop: 4,
                  fontFamily: "var(--font-body)",
                }}
              >
                {stories.length} {stories.length === 1 ? "story" : "stories"} ·{" "}
                {forks.length} {forks.length === 1 ? "fork" : "forks"}
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate("/stories/create")}
              className="btn btn-primary"
              style={{ gap: 7 }}
            >
              <Plus size={14} /> New story
            </motion.button>
          </motion.div>

          {/* Tabs */}
          <div style={{ display: "flex", gap: 0 }}>
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                style={{
                  padding: "10px 16px",
                  fontSize: 14,
                  fontFamily: "var(--font-body)",
                  fontWeight: 500,
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  color:
                    activeTab === tab.key
                      ? "var(--text-primary)"
                      : "var(--text-muted)",
                  borderBottom: `2px solid ${activeTab === tab.key ? "var(--text-primary)" : "transparent"}`,
                  marginBottom: -1,
                  transition: "all 0.15s",
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                {tab.label}
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 600,
                    padding: "1px 7px",
                    borderRadius: 99,
                    background:
                      activeTab === tab.key
                        ? "var(--text-primary)"
                        : "var(--bg-muted)",
                    color:
                      activeTab === tab.key ? "white" : "var(--text-muted)",
                    fontFamily: "var(--font-body)",
                  }}
                >
                  {tab.count}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: 1120, margin: "0 auto", padding: "32px 32px" }}>
        {/* Stories tab */}
        {activeTab === "stories" &&
          (storiesLoading ? (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
                gap: 20,
              }}
            >
              {[1, 2, 3].map((i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : stories.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{ textAlign: "center", padding: "96px 0" }}
            >
              <div
                style={{
                  width: 56,
                  height: 56,
                  background: "var(--bg-muted)",
                  borderRadius: 14,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 16px",
                }}
              >
                <BookOpen size={24} style={{ color: "var(--text-muted)" }} />
              </div>
              <h3
                style={{
                  fontSize: 16,
                  fontWeight: 600,
                  color: "var(--text-primary)",
                  marginBottom: 6,
                  fontFamily: "var(--font-body)",
                }}
              >
                No stories yet
              </h3>
              <p
                style={{
                  fontSize: 14,
                  color: "var(--text-muted)",
                  marginBottom: 24,
                  fontFamily: "var(--font-body)",
                }}
              >
                Create your first story and start branching timelines
              </p>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => navigate("/stories/create")}
                className="btn btn-primary"
                style={{ margin: "0 auto" }}
              >
                <Plus size={14} /> Create story
              </motion.button>
            </motion.div>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
                gap: 20,
              }}
            >
              {stories.map((story) => (
                <StoryCard key={story.id} story={story} />
              ))}
            </div>
          ))}

        {/* Forks tab */}
        {activeTab === "forks" &&
          (forksLoading ? (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
                gap: 20,
              }}
            >
              {[1, 2].map((i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : forks.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{ textAlign: "center", padding: "96px 0" }}
            >
              <div
                style={{
                  width: 56,
                  height: 56,
                  background: "var(--bg-muted)",
                  borderRadius: 14,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 16px",
                }}
              >
                <GitFork size={24} style={{ color: "var(--text-muted)" }} />
              </div>
              <h3
                style={{
                  fontSize: 16,
                  fontWeight: 600,
                  color: "var(--text-primary)",
                  marginBottom: 6,
                  fontFamily: "var(--font-body)",
                }}
              >
                No forks yet
              </h3>
              <p
                style={{
                  fontSize: 14,
                  color: "var(--text-muted)",
                  marginBottom: 24,
                  fontFamily: "var(--font-body)",
                }}
              >
                Fork a published story to continue it your own way
              </p>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => navigate("/discover")}
                className="btn btn-secondary"
                style={{ margin: "0 auto" }}
              >
                Browse stories
              </motion.button>
            </motion.div>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
                gap: 20,
              }}
            >
              {forks.map((story) => (
                <div key={story.id}>
                  <StoryCard story={story} />
                  {story.forkedFrom && (
                    <p
                      style={{
                        marginTop: 6,
                        paddingLeft: 4,
                        fontSize: 12,
                        color: "var(--text-muted)",
                        display: "flex",
                        alignItems: "center",
                        gap: 5,
                        fontFamily: "var(--font-body)",
                      }}
                    >
                      <GitFork size={10} />
                      Forked from{" "}
                      <span style={{ color: "var(--accent)", fontWeight: 500 }}>
                        {story.forkedFrom.author.username}/
                        {story.forkedFrom.title}
                      </span>
                    </p>
                  )}
                </div>
              ))}
            </div>
          ))}
      </div>
    </div>
  );
}
