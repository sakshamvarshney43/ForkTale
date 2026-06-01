import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  BookOpen,
  GitFork,
  GitBranch,
  Star,
  Globe,
  Loader2,
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  storyService,
  publishService,
  ratingService,
  forkService,
} from "../services/api";
import { useAuth } from "../context/AuthContext";
import type { Publishing } from "../types";

//Helper
const timeAgo = (date: string) => {
  const diff = Date.now() - new Date(date).getTime();
  const days = Math.floor(diff / 86400000);
  if (days > 30) return new Date(date).toLocaleDateString();
  if (days > 0) return `${days}d ago`;
  const hours = Math.floor(diff / 3600000);
  if (hours > 0) return `${hours}h ago`;
  return "just now";
};

//Star Rating
function StarRating({
  publishingId,
  avgRating,
  totalRatings,
  userRating,
}: {
  publishingId: string;
  avgRating: number;
  totalRatings: number;
  userRating: number | null;
}) {
  const queryClient = useQueryClient();
  const { isAuthenticated } = useAuth();
  const [hovered, setHovered] = useState(0);

  const rateMutation = useMutation({
    mutationFn: (stars: number) => ratingService.rate(publishingId, stars),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ending", publishingId] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => ratingService.deleteRating(publishingId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ending", publishingId] });
    },
  });

  return (
    <div className="flex items-center gap-3">
      {/* Stars */}
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            disabled={!isAuthenticated}
            onClick={() => {
              if (userRating === star) {
                deleteMutation.mutate();
              } else {
                rateMutation.mutate(star);
              }
            }}
            onMouseEnter={() => isAuthenticated && setHovered(star)}
            onMouseLeave={() => setHovered(0)}
            className="transition-transform duration-100"
            style={{
              transform: hovered >= star ? "scale(1.15)" : "scale(1)",
            }}
          >
            <Star
              size={16}
              style={{
                color:
                  hovered >= star || (userRating ?? 0) >= star
                    ? "#f0b429"
                    : "#383b3f",
                fill:
                  hovered >= star || (userRating ?? 0) >= star
                    ? "#f0b429"
                    : "transparent",
                transition: "all 0.1s",
              }}
            />
          </button>
        ))}
      </div>

      {/* Stats */}
      <span style={{ color: "#62666d", fontSize: "12px" }}>
        {avgRating > 0 ? avgRating.toFixed(1) : "—"}
        {totalRatings > 0 && <span className="ml-1">({totalRatings})</span>}
      </span>

      {userRating && (
        <span
          className="text-xs px-1.5 py-0.5 rounded"
          style={{
            background: "rgba(240, 180, 41, 0.08)",
            border: "1px solid rgba(240, 180, 41, 0.15)",
            color: "#f0b429",
          }}
        >
          Your rating: {userRating}★
        </span>
      )}
    </div>
  );
}

// Ending Card
function EndingCard({
  ending,
  isActive,
  onClick,
}: {
  ending: Publishing;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="w-full text-left px-3 py-2.5 rounded transition-colors duration-150"
      style={{
        background: isActive ? "#161718" : "transparent",
        border: isActive
          ? "1px solid rgba(141, 214, 255, 0.2)"
          : "1px solid #23252a",
        color: isActive ? "#8dd6ff" : "#8a8f98",
      }}
      onMouseEnter={(e) => {
        if (!isActive) {
          (e.currentTarget as HTMLElement).style.background = "#161718";
          (e.currentTarget as HTMLElement).style.color = "#f7f8f8";
          (e.currentTarget as HTMLElement).style.borderColor = "#383b3f";
        }
      }}
      onMouseLeave={(e) => {
        if (!isActive) {
          (e.currentTarget as HTMLElement).style.background = "transparent";
          (e.currentTarget as HTMLElement).style.color = "#8a8f98";
          (e.currentTarget as HTMLElement).style.borderColor = "#23252a";
        }
      }}
    >
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs font-medium">{ending.branch.name}</span>
        {ending.avgRating && ending.avgRating > 0 ? (
          <span
            className="flex items-center gap-1 text-xs"
            style={{ color: "#f0b429" }}
          >
            <Star size={10} fill="#f0b429" />
            {ending.avgRating.toFixed(1)}
          </span>
        ) : null}
      </div>
      <p className="text-xs" style={{ color: "#62666d" }}>
        {timeAgo(ending.publishedAt)}
        {ending.totalRatings ? ` · ${ending.totalRatings} ratings` : ""}
      </p>
    </button>
  );
}

//Page
export default function StoryRead() {
  const { storyId } = useParams<{ storyId: string }>();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [activeEndingId, setActiveEndingId] = useState<string | null>(null);
  const [forking, setForking] = useState(false);

  //Fetch story
  const { data: storyData, isLoading: storyLoading } = useQuery<any>({
    queryKey: ["story", storyId],
    queryFn: () => storyService.getMyStory(storyId!),
  });

  //Fetch endings
  const { data: endingsData } = useQuery<any>({
    queryKey: ["endings", storyId],
    queryFn: () => publishService.getEndings(storyId!),
    onSuccess: (data: any) => {
      const endings = data?.data?.endings || [];
      if (!activeEndingId && endings.length > 0) {
        setActiveEndingId(endings[0].id);
      }
    },
  } as any);

  //Fetch active ending
  const { data: endingData, isLoading: endingLoading } = useQuery<any>({
    queryKey: ["ending", activeEndingId],
    queryFn: () => publishService.readEnding(activeEndingId!),
    enabled: !!activeEndingId,
  });

  const story = storyData?.data?.story;
  const endings: Publishing[] = endingsData?.data?.endings || [];
  const ending = endingData?.data?.ending;

  //Fork
  const handleFork = async () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    try {
      setForking(true);
      await forkService.forkStory(storyId!);
      navigate("/dashboard");
    } catch (err: any) {
      alert(err.response?.data?.message || "Could not fork.");
    } finally {
      setForking(false);
    }
  };

  if (storyLoading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: "#08090a" }}
      >
        <Loader2
          size={18}
          className="animate-spin"
          style={{ color: "#8a8f98" }}
        />
      </div>
    );
  }

  if (!story) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: "#08090a" }}
      >
        <div className="text-center">
          <BookOpen
            size={28}
            className="mx-auto mb-3"
            style={{ color: "#383b3f" }}
          />
          <p style={{ color: "#8a8f98", fontSize: "14px" }}>Story not found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: "#08090a" }}>
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/*Back*/}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 mb-6 text-xs transition-colors duration-150"
          style={{ color: "#62666d" }}
          onMouseEnter={(e) =>
            ((e.currentTarget as HTMLElement).style.color = "#f7f8f8")
          }
          onMouseLeave={(e) =>
            ((e.currentTarget as HTMLElement).style.color = "#62666d")
          }
        >
          <ArrowLeft size={13} />
          Back
        </motion.button>

        <div className="flex gap-8">
          {/* Main Content*/}
          <div className="flex-1 min-w-0">
            {/* Story header */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              {/* Cover */}
              {story.coverImage && (
                <div className="w-full h-52 rounded-md overflow-hidden mb-6">
                  <img
                    src={story.coverImage}
                    alt={story.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* Meta */}
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex-1">
                  <h1
                    className="font-semibold mb-2"
                    style={{
                      fontSize: "28px",
                      letterSpacing: "-0.22px",
                      color: "#f7f8f8",
                      lineHeight: "1.2",
                    }}
                  >
                    {story.title}
                  </h1>

                  {/* Author */}
                  <div className="flex items-center gap-2 mb-3">
                    {story.author.avatar ? (
                      <img
                        src={story.author.avatar}
                        alt={story.author.username}
                        className="w-5 h-5 rounded-full object-cover"
                      />
                    ) : (
                      <div
                        className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-semibold"
                        style={{
                          background: "#8dd6ff",
                          color: "#08090a",
                          fontSize: "9px",
                        }}
                      >
                        {story.author.username[0].toUpperCase()}
                      </div>
                    )}
                    <button
                      onClick={() => navigate(`/u/${story.author.username}`)}
                      className="text-xs transition-colors duration-100"
                      style={{ color: "#8a8f98" }}
                      onMouseEnter={(e) =>
                        ((e.target as HTMLElement).style.color = "#8dd6ff")
                      }
                      onMouseLeave={(e) =>
                        ((e.target as HTMLElement).style.color = "#8a8f98")
                      }
                    >
                      {story.author.name || story.author.username}
                    </button>
                  </div>

                  {/* Tags */}
                  {story.tags?.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {story.tags.map((tag: string) => (
                        <span
                          key={tag}
                          className="text-xs px-2 py-0.5 rounded"
                          style={{
                            background: "#161718",
                            border: "1px solid #23252a",
                            color: "#8a8f98",
                          }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Stats */}
                  <div className="flex items-center gap-4">
                    {story.genre && (
                      <span
                        className="text-xs px-2 py-0.5 rounded"
                        style={{
                          background: "#23252a",
                          color: "#8a8f98",
                        }}
                      >
                        {story.genre}
                      </span>
                    )}
                    <span
                      className="flex items-center gap-1 text-xs"
                      style={{ color: "#62666d" }}
                    >
                      <GitBranch size={11} />
                      {story._count?.branches || 0} branches
                    </span>
                    <span
                      className="flex items-center gap-1 text-xs"
                      style={{ color: "#62666d" }}
                    >
                      <GitFork size={11} />
                      {story._count?.forks || 0} forks
                    </span>
                    <span
                      className="flex items-center gap-1 text-xs"
                      style={{ color: "#62666d" }}
                    >
                      <Globe size={11} />
                      {story.wordCount}w
                    </span>
                  </div>
                </div>

                {/* Fork button */}
                {story.authorId !== user?.id && (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleFork}
                    disabled={forking}
                    className="btn-secondary text-xs px-3 py-2 flex items-center gap-1.5 flex-shrink-0"
                  >
                    {forking ? (
                      <Loader2 size={12} className="animate-spin" />
                    ) : (
                      <GitFork size={12} />
                    )}
                    Fork story
                  </motion.button>
                )}
              </div>

              {/* Description */}
              {story.description && (
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: "#8a8f98", lineHeight: "1.6" }}
                >
                  {story.description}
                </p>
              )}
            </motion.div>

            {/*Reading area*/}
            {endings.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-16 rounded-md"
                style={{
                  background: "#0f1011",
                  border: "1px solid #23252a",
                }}
              >
                <BookOpen
                  size={28}
                  className="mx-auto mb-3"
                  style={{ color: "#383b3f" }}
                />
                <p className="text-sm" style={{ color: "#8a8f98" }}>
                  No published endings yet
                </p>
              </motion.div>
            ) : endingLoading ? (
              <div className="flex items-center justify-center py-16">
                <Loader2
                  size={18}
                  className="animate-spin"
                  style={{ color: "#8a8f98" }}
                />
              </div>
            ) : ending ? (
              <motion.div
                key={activeEndingId}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                {/* Reading header */}
                <div
                  className="flex items-center justify-between mb-6 pb-4"
                  style={{ borderBottom: "1px solid #23252a" }}
                >
                  <div>
                    <p className="text-xs mb-0.5" style={{ color: "#62666d" }}>
                      Reading ending
                    </p>
                    <h2
                      className="font-medium text-sm"
                      style={{ color: "#8dd6ff" }}
                    >
                      {ending.branch?.name}
                    </h2>
                  </div>

                  {/* Rating */}
                  <StarRating
                    publishingId={ending.id}
                    avgRating={ending.avgRating || 0}
                    totalRatings={ending.totalRatings || 0}
                    userRating={ending.userRating || null}
                  />
                </div>

                {/* Story content — reading mode */}
                <div
                  className="prose max-w-none"
                  style={{
                    fontFamily: "Georgia, serif",
                    fontSize: "17px",
                    lineHeight: "1.85",
                    color: "#d0d6e0",
                    letterSpacing: "0.01px",
                  }}
                >
                  {ending.finalContent
                    .split("\n\n")
                    .filter(Boolean)
                    .map((para: string, i: number) => (
                      <p key={i} style={{ marginBottom: "1.5rem" }}>
                        {para}
                      </p>
                    ))}
                </div>

                {/* End of story */}
                <div
                  className="flex items-center gap-3 mt-10 pt-6"
                  style={{ borderTop: "1px solid #23252a" }}
                >
                  <div
                    className="flex-1 h-px"
                    style={{ background: "#23252a" }}
                  />
                  <span
                    style={{
                      color: "#383b3f",
                      fontSize: "12px",
                      fontFamily: "monospace",
                    }}
                  >
                    end of {ending.branch?.name}
                  </span>
                  <div
                    className="flex-1 h-px"
                    style={{ background: "#23252a" }}
                  />
                </div>

                {/* Post-read actions */}
                <div className="flex items-center justify-between mt-6">
                  <StarRating
                    publishingId={ending.id}
                    avgRating={ending.avgRating || 0}
                    totalRatings={ending.totalRatings || 0}
                    userRating={ending.userRating || null}
                  />
                  {story.authorId !== user?.id && (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleFork}
                      disabled={forking}
                      className="btn-secondary text-xs px-3 py-2 flex items-center gap-1.5"
                    >
                      <GitFork size={12} />
                      Fork and continue
                    </motion.button>
                  )}
                </div>
              </motion.div>
            ) : null}
          </div>

          {/*Sidebar*/}
          <div className="w-56 flex-shrink-0 hidden lg:block">
            <div className="sticky top-24">
              <p
                className="text-xs font-medium mb-3"
                style={{ color: "#8a8f98" }}
              >
                {endings.length} ending{endings.length !== 1 ? "s" : ""}
              </p>

              <div className="space-y-1.5">
                {endings.map((e) => (
                  <EndingCard
                    key={e.id}
                    ending={e}
                    isActive={activeEndingId === e.id}
                    onClick={() => setActiveEndingId(e.id)}
                  />
                ))}
              </div>

              {/* Forked from */}
              {story.forkedFrom && (
                <div
                  className="mt-6 p-3 rounded"
                  style={{
                    background: "#0f1011",
                    border: "1px solid #23252a",
                  }}
                >
                  <p className="text-xs mb-1" style={{ color: "#62666d" }}>
                    Forked from
                  </p>
                  <button
                    onClick={() =>
                      navigate(`/stories/${story.forkedFrom!.id}/read`)
                    }
                    className="text-xs transition-colors duration-100"
                    style={{ color: "#8dd6ff" }}
                    onMouseEnter={(e) =>
                      ((e.target as HTMLElement).style.color = "#a8e0ff")
                    }
                    onMouseLeave={(e) =>
                      ((e.target as HTMLElement).style.color = "#8dd6ff")
                    }
                  >
                    {story.forkedFrom.title}
                  </button>
                  <p className="text-xs mt-0.5" style={{ color: "#62666d" }}>
                    by {story.forkedFrom.author.username}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
