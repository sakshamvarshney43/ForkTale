import { useState } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  GitCommit,
  GitBranch,
  Clock,
  ChevronRight,
  Loader2,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { storyService, branchService, commitService } from "../services/api";
import type { Branch, Commit } from "../types";

// Helper
const timeAgo = (date: string) => {
  const diff = Date.now() - new Date(date).getTime();
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(mins / 60);
  const days = Math.floor(hours / 24);
  if (days > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  if (mins > 0) return `${mins}m ago`;
  return "just now";
};

//Commit Card
function CommitCard({
  commit,
  isLatest,
  storyId,
  branchId,
}: {
  commit: Commit;
  isLatest: boolean;
  storyId: string;
  branchId: string;
}) {
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative"
    >
      {/* Timeline line */}
      <div
        className="absolute left-3.5 top-8 bottom-0 w-px"
        style={{ background: "#23252a" }}
      />

      <div className="flex gap-4">
        {/* Dot */}
        <div className="relative flex-shrink-0 mt-3">
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center"
            style={{
              background: isLatest ? "rgba(141, 214, 255, 0.1)" : "#161718",
              border: isLatest
                ? "1px solid rgba(141, 214, 255, 0.3)"
                : "1px solid #23252a",
            }}
          >
            <GitCommit
              size={12}
              style={{ color: isLatest ? "#8dd6ff" : "#62666d" }}
            />
          </div>
        </div>

        {/* Card */}
        <div
          className="flex-1 mb-3 rounded-md transition-colors duration-150"
          style={{
            background: "#0f1011",
            border: "1px solid #23252a",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#383b3f")}
          onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#23252a")}
        >
          {/* Header */}
          <div className="flex items-start justify-between gap-3 p-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                {isLatest && (
                  <span
                    className="text-xs px-1.5 py-0.5 rounded"
                    style={{
                      background: "rgba(141, 214, 255, 0.08)",
                      border: "1px solid rgba(141, 214, 255, 0.15)",
                      color: "#8dd6ff",
                      fontSize: "10px",
                    }}
                  >
                    latest
                  </span>
                )}
                <h3
                  className="font-medium text-sm truncate"
                  style={{ color: "#d0d6e0", letterSpacing: "-0.1px" }}
                >
                  {commit.message}
                </h3>
              </div>

              <div className="flex items-center gap-3">
                {/* Author */}
                <div className="flex items-center gap-1.5">
                  {commit.author?.avatar ? (
                    <img
                      src={commit.author.avatar}
                      alt={commit.author.username}
                      className="w-4 h-4 rounded-full object-cover"
                    />
                  ) : (
                    <div
                      className="w-4 h-4 rounded-full flex items-center justify-center"
                      style={{
                        background: "#8dd6ff",
                        color: "#08090a",
                        fontSize: "9px",
                        fontWeight: 600,
                      }}
                    >
                      {commit.author?.username?.[0]?.toUpperCase()}
                    </div>
                  )}
                  <span style={{ color: "#62666d", fontSize: "12px" }}>
                    {commit.author?.username}
                  </span>
                </div>

                {/* Time */}
                <span
                  className="flex items-center gap-1"
                  style={{ color: "#62666d", fontSize: "12px" }}
                >
                  <Clock size={10} />
                  {timeAgo(commit.createdAt)}
                </span>

                {/* Word count */}
                <span style={{ color: "#62666d", fontSize: "12px" }}>
                  {commit.wordCount}w
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1.5 flex-shrink-0">
              <button
                onClick={() => setExpanded(!expanded)}
                className="px-2 py-1 rounded text-xs transition-colors duration-100"
                style={{
                  color: "#8a8f98",
                  border: "1px solid #23252a",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.color = "#f7f8f8";
                  (e.currentTarget as HTMLElement).style.borderColor =
                    "#383b3f";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.color = "#8a8f98";
                  (e.currentTarget as HTMLElement).style.borderColor =
                    "#23252a";
                }}
              >
                {expanded ? "Hide" : "Preview"}
              </button>

              {isLatest && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() =>
                    navigate(`/stories/${storyId}/branches/${branchId}`)
                  }
                  className="btn-primary text-xs px-2.5 py-1 flex items-center gap-1"
                >
                  Edit
                  <ChevronRight size={11} />
                </motion.button>
              )}
            </div>
          </div>

          {/* Preview */}
          {expanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.15 }}
              style={{ borderTop: "1px solid #23252a" }}
            >
              <div className="p-3">
                <p
                  className="text-xs leading-relaxed line-clamp-6"
                  style={{
                    color: "#8a8f98",
                    fontFamily: "Georgia, serif",
                    lineHeight: "1.7",
                  }}
                >
                  {commit.content}
                </p>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

//Page
export default function CommitHistory() {
  const { storyId } = useParams<{ storyId: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const branchIdFromUrl = searchParams.get("branch");
  const [activeBranchId, setActiveBranchId] = useState<string>(
    branchIdFromUrl || "",
  );

  //Fetch Story
  const { data: storyData } = useQuery<any>({
    queryKey: ["story", storyId],
    queryFn: () => storyService.getMyStory(storyId!),
  });

  //Fetch Branch
  const { data: branchesData } = useQuery<any>({
    queryKey: ["branches", storyId],
    queryFn: () => branchService.getBranches(storyId!),
  });

  //Fetch Commit
  const { data: commitsData, isLoading: commitsLoading } = useQuery<any>({
    queryKey: ["commits", storyId, activeBranchId],
    queryFn: () => commitService.getCommits(storyId!, activeBranchId),
    enabled: !!activeBranchId,
  });

  const story = storyData?.data?.story;
  const branches: Branch[] = branchesData?.data?.branches || [];
  const commits: Commit[] = commitsData?.data?.commits || [];
  const activeBranch = branches.find((b) => b.id === activeBranchId);

  return (
    <div className="min-h-screen px-4 py-8" style={{ background: "#08090a" }}>
      <div className="max-w-3xl mx-auto">
        {/*Header*/}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 mb-8"
        >
          <button
            onClick={() => navigate(-1)}
            className="p-1.5 rounded transition-colors duration-150"
            style={{ color: "#62666d", border: "1px solid #23252a" }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.color = "#f7f8f8";
              (e.currentTarget as HTMLElement).style.borderColor = "#383b3f";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.color = "#62666d";
              (e.currentTarget as HTMLElement).style.borderColor = "#23252a";
            }}
          >
            <ArrowLeft size={14} />
          </button>
          <div>
            <h1
              className="font-semibold"
              style={{
                fontSize: "18px",
                letterSpacing: "-0.22px",
                color: "#f7f8f8",
              }}
            >
              Commit history
            </h1>
            <p style={{ color: "#62666d", fontSize: "12px" }}>{story?.title}</p>
          </div>
        </motion.div>

        {/*Branch tabs*/}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.05 }}
          className="flex gap-1 mb-6 flex-wrap"
          style={{ borderBottom: "1px solid #23252a", paddingBottom: "0" }}
        >
          {branches.map((branch) => (
            <button
              key={branch.id}
              onClick={() => setActiveBranchId(branch.id)}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium transition-all duration-150"
              style={{
                color: activeBranchId === branch.id ? "#8dd6ff" : "#8a8f98",
                borderBottom:
                  activeBranchId === branch.id
                    ? "1px solid #8dd6ff"
                    : "1px solid transparent",
                marginBottom: "-1px",
              }}
            >
              <GitBranch size={11} />
              {branch.name}
              {branch.isDefault && (
                <span
                  className="px-1 rounded"
                  style={{
                    background: "#23252a",
                    color: "#62666d",
                    fontSize: "10px",
                  }}
                >
                  default
                </span>
              )}
            </button>
          ))}
        </motion.div>

        {/*Stats bar*/}
        {activeBranch && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.08 }}
            className="flex items-center gap-4 mb-6 px-3 py-2 rounded"
            style={{ background: "#0f1011", border: "1px solid #23252a" }}
          >
            <span
              className="flex items-center gap-1.5 text-xs"
              style={{ color: "#8a8f98" }}
            >
              <GitCommit size={11} style={{ color: "#8dd6ff" }} />
              {commits.length} commits
            </span>
            <span
              className="flex items-center gap-1.5 text-xs"
              style={{ color: "#8a8f98" }}
            >
              <GitBranch size={11} style={{ color: "#8dd6ff" }} />
              {activeBranch.name}
            </span>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() =>
                navigate(`/stories/${storyId}/branches/${activeBranchId}`)
              }
              className="ml-auto btn-primary text-xs px-3 py-1.5 flex items-center gap-1.5"
            >
              Open editor
              <ChevronRight size={11} />
            </motion.button>
          </motion.div>
        )}

        {/*Commits*/}
        {commitsLoading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2
              size={18}
              className="animate-spin"
              style={{ color: "#8a8f98" }}
            />
          </div>
        ) : commits.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <GitCommit
              size={28}
              className="mx-auto mb-3"
              style={{ color: "#383b3f" }}
            />
            <h3
              className="font-medium text-sm mb-1"
              style={{ color: "#8a8f98" }}
            >
              No commits yet
            </h3>
            <p className="text-xs" style={{ color: "#62666d" }}>
              Start writing to create your first commit
            </p>
          </motion.div>
        ) : (
          <div className="relative">
            {commits.map((commit, index) => (
              <CommitCard
                key={commit.id}
                commit={commit}
                isLatest={index === 0}
                storyId={storyId!}
                branchId={activeBranchId}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
