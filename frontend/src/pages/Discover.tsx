import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Search,
  BookOpen,
  GitFork,
  GitBranch,
  Globe,
  SlidersHorizontal,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { storyService, forkService } from "../services/api";
import { useAuth } from "../context/AuthContext";
import type { Story } from "../types";
import { useDebounce } from "../hooks/useDebounce";

const genres = [
  "All",
  "Fantasy",
  "Sci-Fi",
  "Romance",
  "Thriller",
  "Horror",
  "Mystery",
  "Adventure",
  "Drama",
  "Historical",
  "Isekai",
];

function DiscoverCard({ story }: { story: Story }) {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [forking, setForking] = useState(false);

  const handleFork = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    try {
      setForking(true);
      await forkService.forkStory(story.id);
      navigate("/dashboard");
    } catch (err: any) {
      alert(err.response?.data?.message || "Could not fork story");
    } finally {
      setForking(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      onClick={() => navigate(`/stories/${story.id}/read`)}
      className="card card-hover"
      style={{
        cursor: "pointer",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Cover */}
      <div
        style={{
          width: "100%",
          height: 148,
          overflow: "hidden",
          background: "var(--bg-muted)",
          flexShrink: 0,
          position: "relative",
        }}
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
            <BookOpen size={24} style={{ color: "var(--border-strong)" }} />
          </div>
        )}
        {story.genre && (
          <span
            style={{
              position: "absolute",
              top: 10,
              right: 10,
              fontSize: 11,
              fontWeight: 500,
              padding: "3px 8px",
              borderRadius: 99,
              background: "rgba(255,255,255,0.92)",
              color: "var(--text-secondary)",
              fontFamily: "var(--font-body)",
              backdropFilter: "blur(4px)",
            }}
          >
            {story.genre}
          </span>
        )}
      </div>

      {/* Body */}
      <div
        style={{
          padding: "16px",
          flex: 1,
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Author */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            marginBottom: 8,
          }}
        >
          {story.author.avatar ? (
            <img
              src={story.author.avatar}
              alt={story.author.username}
              style={{
                width: 18,
                height: 18,
                borderRadius: "50%",
                objectFit: "cover",
              }}
            />
          ) : (
            <div
              style={{
                width: 18,
                height: 18,
                borderRadius: "50%",
                background: "var(--accent)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 9,
                fontWeight: 700,
                color: "white",
                fontFamily: "var(--font-body)",
              }}
            >
              {story.author.username[0].toUpperCase()}
            </div>
          )}
          <span
            style={{
              fontSize: 12,
              color: "var(--text-muted)",
              fontFamily: "var(--font-body)",
            }}
          >
            {story.author.name || story.author.username}
          </span>
        </div>

        {/* Title */}
        <h3
          style={{
            fontSize: 15,
            fontWeight: 600,
            color: "var(--text-primary)",
            letterSpacing: "-0.01em",
            lineHeight: 1.35,
            marginBottom: 6,
            fontFamily: "var(--font-body)",
            overflow: "hidden",
            textOverflow: "ellipsis",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
          }}
        >
          {story.title}
        </h3>

        {story.description && (
          <p
            style={{
              fontSize: 13,
              color: "var(--text-muted)",
              lineHeight: 1.55,
              fontFamily: "var(--font-body)",
              marginBottom: 14,
              flex: 1,
              overflow: "hidden",
              textOverflow: "ellipsis",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
            }}
          >
            {story.description}
          </p>
        )}

        {/* Footer */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: "auto",
            paddingTop: 12,
            borderTop: "1px solid var(--border)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            {[
              {
                icon: <GitBranch size={11} />,
                val: story._count?.branches || 0,
              },
              { icon: <GitFork size={11} />, val: story._count?.forks || 0 },
              { icon: <Globe size={11} />, val: `${story.wordCount} words` },
            ].map((s, i) => (
              <span
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                  fontSize: 12,
                  color: "var(--text-muted)",
                  fontFamily: "var(--font-body)",
                }}
              >
                {s.icon}
                {s.val}
              </span>
            ))}
          </div>
          <button
            onClick={handleFork}
            disabled={forking}
            className="btn btn-sm"
            style={{
              background: "var(--bg-subtle)",
              border: "1.5px solid var(--border)",
              color: "var(--text-secondary)",
              fontSize: 12,
              padding: "4px 10px",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor =
                "var(--accent)";
              (e.currentTarget as HTMLElement).style.color = "var(--accent)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor =
                "var(--border)";
              (e.currentTarget as HTMLElement).style.color =
                "var(--text-secondary)";
            }}
          >
            {forking ? (
              <span className="spinner" style={{ width: 12, height: 12 }} />
            ) : (
              <>
                <GitFork size={11} /> Fork
              </>
            )}
          </button>
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
          height: 148,
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
            height: 12,
            width: "40%",
            background: "var(--bg-muted)",
            borderRadius: 4,
            animation: "pulse 1.5s ease-in-out infinite",
          }}
        />
        <div
          style={{
            height: 15,
            width: "80%",
            background: "var(--bg-muted)",
            borderRadius: 4,
            animation: "pulse 1.5s ease-in-out infinite",
          }}
        />
        <div
          style={{
            height: 13,
            width: "60%",
            background: "var(--bg-muted)",
            borderRadius: 4,
            animation: "pulse 1.5s ease-in-out infinite",
          }}
        />
      </div>
    </div>
  );
}

export default function Discover() {
  const [search, setSearch] = useState("");
  const [genre, setGenre] = useState("All");
  const [sort, setSort] = useState<"latest" | "top">("latest");
  const debouncedSearch = useDebounce(search, 400);

  const { data, isLoading } = useQuery({
    queryKey: ["discover", debouncedSearch, search, genre, sort],
    queryFn: () =>
      storyService.discover({
        search: debouncedSearch || undefined,
        genre: genre === "All" ? undefined : genre,
        sort,
      }),
  });

  const stories: Story[] = data?.data?.stories || [];

  return (
    <div style={{ background: "var(--bg)", minHeight: "100vh" }}>
      {/* Header */}
      <div
        style={{
          borderBottom: "1px solid var(--border)",
          background: "var(--bg)",
        }}
      >
        <div
          style={{ maxWidth: 1120, margin: "0 auto", padding: "40px 32px 0" }}
        >
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <p
              style={{
                fontSize: 12,
                fontWeight: 600,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "var(--accent)",
                marginBottom: 8,
                fontFamily: "var(--font-body)",
              }}
            >
              Discover
            </p>
            <h1
              style={{
                fontSize: "clamp(24px,3vw,36px)",
                fontWeight: 400,
                fontStyle: "italic",
                letterSpacing: "-0.03em",
                color: "var(--text-primary)",
                fontFamily: "var(--font-display)",
                lineHeight: 1.1,
                marginBottom: 20,
              }}
            >
              Explore published stories
            </h1>
          </motion.div>

          {/* Search + Sort bar */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.08 }}
            style={{ display: "flex", gap: 10, marginBottom: 20 }}
          >
            <div style={{ position: "relative", flex: 1, maxWidth: 400 }}>
              <Search
                size={14}
                style={{
                  position: "absolute",
                  left: 11,
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "var(--text-muted)",
                  pointerEvents: "none",
                }}
              />
              <input
                type="text"
                placeholder="Search stories, authors..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="input"
                style={{ paddingLeft: 34, fontSize: 14 }}
              />
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <SlidersHorizontal
                size={13}
                style={{ color: "var(--text-muted)" }}
              />
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as any)}
                className="input"
                style={{
                  fontSize: 13,
                  padding: "9px 12px",
                  width: 130,
                  cursor: "pointer",
                }}
              >
                <option value="latest">Latest</option>
                <option value="top">Top rated</option>
              </select>
            </div>
          </motion.div>

          {/* Genre tabs */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.12 }}
            style={{
              display: "flex",
              gap: 2,
              flexWrap: "nowrap",
              overflowX: "auto",
              paddingBottom: 0,
            }}
          >
            {genres.map((g) => (
              <button
                key={g}
                onClick={() => setGenre(g)}
                style={{
                  padding: "8px 14px",
                  fontSize: 13,
                  fontFamily: "var(--font-body)",
                  fontWeight: 500,
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                  color:
                    genre === g ? "var(--text-primary)" : "var(--text-muted)",
                  borderBottom: `2px solid ${genre === g ? "var(--text-primary)" : "transparent"}`,
                  transition: "all 0.15s",
                  marginBottom: -1,
                }}
                onMouseEnter={(e) => {
                  if (genre !== g)
                    (e.currentTarget as HTMLElement).style.color =
                      "var(--text-secondary)";
                }}
                onMouseLeave={(e) => {
                  if (genre !== g)
                    (e.currentTarget as HTMLElement).style.color =
                      "var(--text-muted)";
                }}
              >
                {g}
              </button>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: 1120, margin: "0 auto", padding: "36px 32px" }}>
        {isLoading ? (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              gap: 20,
            }}
          >
            {[1, 2, 3, 4, 5, 6].map((i) => (
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
              No stories found
            </h3>
            <p
              style={{
                fontSize: 14,
                color: "var(--text-muted)",
                fontFamily: "var(--font-body)",
              }}
            >
              {search
                ? `No results for "${search}"`
                : "No published stories yet in this category"}
            </p>
          </motion.div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              gap: 20,
            }}
          >
            {stories.map((story) => (
              <DiscoverCard key={story.id} story={story} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
