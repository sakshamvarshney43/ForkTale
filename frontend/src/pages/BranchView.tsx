import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  GitBranch,
  GitCommit,
  Plus,
  ChevronDown,
  Save,
  Sparkles,
  History,
  ArrowLeft,
  Loader2,
  X,
  Check,
  AlertCircle,
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  storyService,
  branchService,
  commitService,
  aiService,
} from "../services/api";
import type { Branch, Commit } from "../types";

// Commit Modal
function CommitModal({
  onCommit,
  onClose,
  loading,
}: {
  onCommit: (message: string) => void;
  onClose: () => void;
  loading: boolean;
}) {
  const [message, setMessage] = useState("");

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{ background: "rgba(8, 9, 10, 0.85)" }}
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 8 }}
        transition={{ duration: 0.15 }}
        className="w-full max-w-md rounded-md p-5"
        style={{
          background: "#0f1011",
          border: "1px solid #23252a",
          boxShadow: "rgba(8, 9, 10, 0.6) 0px 4px 32px 0px",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <GitCommit size={14} style={{ color: "#8dd6ff" }} />
            <h3
              className="font-medium text-sm"
              style={{ color: "#f7f8f8", letterSpacing: "-0.1px" }}
            >
              Save commit
            </h3>
          </div>
          <button
            onClick={onClose}
            style={{ color: "#62666d" }}
            onMouseEnter={(e) =>
              ((e.currentTarget as HTMLElement).style.color = "#f7f8f8")
            }
            onMouseLeave={(e) =>
              ((e.currentTarget as HTMLElement).style.color = "#62666d")
            }
          >
            <X size={14} />
          </button>
        </div>

        <input
          autoFocus
          type="text"
          placeholder="Describe what changed..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && message.trim()) onCommit(message.trim());
          }}
          className="input w-full mb-4"
          style={{ fontSize: "13px" }}
        />

        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="btn-ghost text-xs px-3 py-1.5">
            Cancel
          </button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => message.trim() && onCommit(message.trim())}
            disabled={!message.trim() || loading}
            className="btn-primary text-xs px-3 py-1.5 flex items-center gap-1.5"
          >
            {loading ? (
              <Loader2 size={12} className="animate-spin" />
            ) : (
              <Check size={12} />
            )}
            Commit
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// New Branch Modal
function NewBranchModal({
  onCreate,
  onClose,
  loading,
}: {
  onCreate: (name: string) => void;
  onClose: () => void;
  loading: boolean;
}) {
  const [name, setName] = useState("");

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{ background: "rgba(8, 9, 10, 0.85)" }}
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 8 }}
        transition={{ duration: 0.15 }}
        className="w-full max-w-md rounded-md p-5"
        style={{
          background: "#0f1011",
          border: "1px solid #23252a",
          boxShadow: "rgba(8, 9, 10, 0.6) 0px 4px 32px 0px",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <GitBranch size={14} style={{ color: "#8dd6ff" }} />
            <h3
              className="font-medium text-sm"
              style={{ color: "#f7f8f8", letterSpacing: "-0.1px" }}
            >
              New branch
            </h3>
          </div>
          <button
            onClick={onClose}
            style={{ color: "#62666d" }}
            onMouseEnter={(e) =>
              ((e.currentTarget as HTMLElement).style.color = "#f7f8f8")
            }
            onMouseLeave={(e) =>
              ((e.currentTarget as HTMLElement).style.color = "#62666d")
            }
          >
            <X size={14} />
          </button>
        </div>

        <input
          autoFocus
          type="text"
          placeholder="branch-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && name.trim()) onCreate(name.trim());
          }}
          className="input w-full mb-1"
          style={{ fontSize: "13px" }}
        />
        <p className="text-xs mb-4" style={{ color: "#62666d" }}>
          Letters, numbers, hyphens and underscores only
        </p>

        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="btn-ghost text-xs px-3 py-1.5">
            Cancel
          </button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => name.trim() && onCreate(name.trim())}
            disabled={!name.trim() || loading}
            className="btn-primary text-xs px-3 py-1.5 flex items-center gap-1.5"
          >
            {loading ? (
              <Loader2 size={12} className="animate-spin" />
            ) : (
              <Plus size={12} />
            )}
            Create
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// AI panel
function AIPanel({
  content,
  genre,
  onInsert,
  onClose,
}: {
  content: string;
  genre?: string;
  onInsert: (text: string) => void;
  onClose: () => void;
}) {
  const [activeAction, setActiveAction] = useState<string | null>(null);
  const [streamedText, setStreamedText] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [fixedText, setFixedText] = useState("");

  const actions = [
    { key: "next", label: "Continue story" },
    { key: "twist", label: "Plot twist" },
    { key: "improve", label: "Improve writing" },
    { key: "grammar", label: "Fix grammar" },
  ];

  const runAction = async (key: string) => {
    setActiveAction(key);
    setStreamedText("");
    setFixedText("");

    if (key === "grammar") {
      try {
        const res = await aiService.fixGrammar(content);
        setFixedText(res.data.fixed);
      } catch {
        setFixedText("Error — please try again.");
      }
      return;
    }

    setIsStreaming(true);
    try {
      let response;
      if (key === "next")
        response = await aiService.suggestNext(content, genre);
      else if (key === "twist")
        response = await aiService.suggestTwist(content, genre);
      else response = await aiService.improveWriting(content);

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) return;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.slice(6);
            if (data === "[DONE]") break;
            try {
              const parsed = JSON.parse(data);
              if (parsed.text) {
                setStreamedText((prev) => prev + parsed.text);
              }
            } catch {}
          }
        }
      }
    } catch {
      setStreamedText("Error — please try again.");
    } finally {
      setIsStreaming(false);
    }
  };

  const result = fixedText || streamedText;

  return (
    <motion.div
      initial={{ opacity: 0, x: 12 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 12 }}
      transition={{ duration: 0.2 }}
      className="flex flex-col h-full"
      style={{
        width: "280px",
        borderLeft: "1px solid #23252a",
        background: "#0f1011",
      }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 py-3"
        style={{ borderBottom: "1px solid #23252a" }}
      >
        <div className="flex items-center gap-2">
          <Sparkles size={13} style={{ color: "#5fed83" }} />
          <span className="text-xs font-medium" style={{ color: "#f7f8f8" }}>
            AI Assistant
          </span>
        </div>
        <button
          onClick={onClose}
          style={{ color: "#62666d" }}
          onMouseEnter={(e) =>
            ((e.currentTarget as HTMLElement).style.color = "#f7f8f8")
          }
          onMouseLeave={(e) =>
            ((e.currentTarget as HTMLElement).style.color = "#62666d")
          }
        >
          <X size={13} />
        </button>
      </div>

      {/* Actions */}
      <div className="p-3 space-y-1">
        {actions.map((action) => (
          <button
            key={action.key}
            onClick={() => runAction(action.key)}
            disabled={isStreaming}
            className="w-full text-left px-3 py-2 rounded text-xs transition-colors duration-100"
            style={{
              background:
                activeAction === action.key ? "#161718" : "transparent",
              color: activeAction === action.key ? "#8dd6ff" : "#8a8f98",
              border:
                activeAction === action.key
                  ? "1px solid rgba(141, 214, 255, 0.2)"
                  : "1px solid transparent",
            }}
            onMouseEnter={(e) => {
              if (activeAction !== action.key) {
                (e.currentTarget as HTMLElement).style.background = "#161718";
                (e.currentTarget as HTMLElement).style.color = "#f7f8f8";
              }
            }}
            onMouseLeave={(e) => {
              if (activeAction !== action.key) {
                (e.currentTarget as HTMLElement).style.background =
                  "transparent";
                (e.currentTarget as HTMLElement).style.color = "#8a8f98";
              }
            }}
          >
            {action.label}
          </button>
        ))}
      </div>

      {/* Result */}
      {result && (
        <>
          <div
            style={{ height: "1px", background: "#23252a", margin: "0 12px" }}
          />
          <div className="flex-1 overflow-y-auto p-3">
            <p
              className="text-xs leading-relaxed mb-3"
              style={{ color: "#d0d6e0", lineHeight: "1.6" }}
            >
              {result}
              {isStreaming && (
                <span
                  className="inline-block w-0.5 h-3 ml-0.5 align-middle"
                  style={{
                    background: "#5fed83",
                    animation: "pulse 1s infinite",
                  }}
                />
              )}
            </p>

            {!isStreaming && result && (
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onInsert(result)}
                className="btn-primary w-full text-xs py-2"
              >
                Insert into editor
              </motion.button>
            )}
          </div>
        </>
      )}
    </motion.div>
  );
}

// Branch View Page

export default function BranchView() {
  const { storyId, branchId } = useParams<{
    storyId: string;
    branchId: string;
  }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [content, setContent] = useState("");
  const [showCommitModal, setShowCommitModal] = useState(false);
  const [showBranchModal, setShowBranchModal] = useState(false);
  const [showBranchDropdown, setShowBranchDropdown] = useState(false);
  const [showAI, setShowAI] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Fetch story
  const { data: storyData } = useQuery({
    queryKey: ["story", storyId],
    queryFn: () => storyService.getMyStory(storyId!),
  });

  // Fetch branches
  const { data: branchesData } = useQuery({
    queryKey: ["branches", storyId],
    queryFn: () => branchService.getBranches(storyId!),
  });

  //Fetch latest commit
  const { data: latestData, isLoading: commitLoading } = useQuery({
    queryKey: ["latestCommit", storyId, branchId],
    queryFn: () => commitService.getLatestCommit(storyId!, branchId!),
  });

  const story = storyData?.data?.story;
  const branches: Branch[] = branchesData?.data?.branches || [];
  const currentBranch = branches.find((b) => b.id === branchId);
  const latestCommit: Commit | null = latestData?.data?.commit || null;

  // Populate editor with latest content
  useEffect(() => {
    if (latestCommit?.content) {
      setContent(latestCommit.content);
      setHasChanges(false);
    }
  }, [latestCommit]);

  //Commit mutation
  const commitMutation = useMutation({
    mutationFn: (message: string) =>
      commitService.createCommit(storyId!, branchId!, {
        message,
        content,
      }),
    onSuccess: () => {
      setHasChanges(false);
      setShowCommitModal(false);
      queryClient.invalidateQueries({
        queryKey: ["latestCommit", storyId, branchId],
      });
      queryClient.invalidateQueries({
        queryKey: ["commits", storyId, branchId],
      });
    },
  });

  //New branch mutation
  const branchMutation = useMutation({
    mutationFn: (name: string) =>
      branchService.createBranch(storyId!, {
        name,
        fromCommitId: latestCommit?.id,
      }),
    onSuccess: (res) => {
      const newBranch = res.data.branch;
      setShowBranchModal(false);
      queryClient.invalidateQueries({ queryKey: ["branches", storyId] });
      navigate(`/stories/${storyId}/branches/${newBranch.id}`);
    },
  });

  // Handle content change
  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
    setHasChanges(true);
  };

  //Insert AI text
  const handleInsert = (text: string) => {
    setContent((prev) => prev + "\n\n" + text);
    setHasChanges(true);
    setShowAI(false);
  };

  if (commitLoading) {
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

  return (
    <div className="flex flex-col h-screen" style={{ background: "#08090a" }}>
      {/*Top Bar*/}
      <div
        className="flex items-center justify-between px-4 py-2.5 flex-shrink-0"
        style={{ borderBottom: "1px solid #23252a", background: "#0f1011" }}
      >
        {/* Left */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/dashboard")}
            className="p-1.5 rounded transition-colors duration-150"
            style={{ color: "#62666d" }}
            onMouseEnter={(e) =>
              ((e.currentTarget as HTMLElement).style.color = "#f7f8f8")
            }
            onMouseLeave={(e) =>
              ((e.currentTarget as HTMLElement).style.color = "#62666d")
            }
          >
            <ArrowLeft size={14} />
          </button>

          <div
            style={{ width: "1px", height: "16px", background: "#23252a" }}
          />

          <span
            className="text-sm font-medium"
            style={{ color: "#d0d6e0", letterSpacing: "-0.1px" }}
          >
            {story?.title}
          </span>

          {/* Branch switcher */}
          <div className="relative">
            <button
              onClick={() => setShowBranchDropdown(!showBranchDropdown)}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded text-xs transition-colors duration-150"
              style={{
                background: "#161718",
                border: "1px solid #23252a",
                color: "#8dd6ff",
              }}
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLElement).style.borderColor = "#383b3f")
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLElement).style.borderColor = "#23252a")
              }
            >
              <GitBranch size={11} />
              {currentBranch?.name || "main"}
              <ChevronDown
                size={11}
                style={{
                  color: "#62666d",
                  transform: showBranchDropdown
                    ? "rotate(180deg)"
                    : "rotate(0)",
                  transition: "transform 0.15s",
                }}
              />
            </button>

            <AnimatePresence>
              {showBranchDropdown && (
                <motion.div
                  initial={{ opacity: 0, y: 4, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 4, scale: 0.97 }}
                  transition={{ duration: 0.12 }}
                  className="absolute left-0 mt-1 w-48 rounded-md overflow-hidden z-10"
                  style={{
                    background: "#161718",
                    border: "1px solid #23252a",
                    boxShadow: "rgba(8, 9, 10, 0.6) 0px 4px 32px 0px",
                  }}
                >
                  <div className="p-1">
                    {branches.map((branch) => (
                      <button
                        key={branch.id}
                        onClick={() => {
                          navigate(`/stories/${storyId}/branches/${branch.id}`);
                          setShowBranchDropdown(false);
                        }}
                        className="w-full flex items-center gap-2 px-2.5 py-2 rounded text-xs transition-colors duration-100"
                        style={{
                          color: branch.id === branchId ? "#8dd6ff" : "#8a8f98",
                          background:
                            branch.id === branchId ? "#23252a" : "transparent",
                        }}
                        onMouseEnter={(e) => {
                          if (branch.id !== branchId) {
                            (e.currentTarget as HTMLElement).style.background =
                              "#23252a";
                            (e.currentTarget as HTMLElement).style.color =
                              "#f7f8f8";
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (branch.id !== branchId) {
                            (e.currentTarget as HTMLElement).style.background =
                              "transparent";
                            (e.currentTarget as HTMLElement).style.color =
                              "#8a8f98";
                          }
                        }}
                      >
                        <GitBranch size={11} />
                        {branch.name}
                        {branch.isDefault && (
                          <span
                            className="ml-auto text-xs px-1 rounded"
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
                  </div>

                  <div
                    style={{ borderTop: "1px solid #23252a" }}
                    className="p-1"
                  >
                    <button
                      onClick={() => {
                        setShowBranchModal(true);
                        setShowBranchDropdown(false);
                      }}
                      className="w-full flex items-center gap-2 px-2.5 py-2 rounded text-xs transition-colors duration-100"
                      style={{ color: "#8a8f98" }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLElement).style.background =
                          "#23252a";
                        (e.currentTarget as HTMLElement).style.color =
                          "#f7f8f8";
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLElement).style.background =
                          "transparent";
                        (e.currentTarget as HTMLElement).style.color =
                          "#8a8f98";
                      }}
                    >
                      <Plus size={11} />
                      New branch
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Right */}
        <div className="flex items-center gap-2">
          {/* Unsaved indicator */}
          {hasChanges && (
            <span
              className="flex items-center gap-1 text-xs"
              style={{ color: "#62666d" }}
            >
              <AlertCircle size={11} />
              Unsaved
            </span>
          )}

          {/* Commit history */}
          <button
            onClick={() =>
              navigate(`/stories/${storyId}/commits?branch=${branchId}`)
            }
            className="flex items-center gap-1.5 px-2.5 py-1 rounded text-xs transition-colors duration-150"
            style={{
              color: "#8a8f98",
              border: "1px solid #23252a",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.color = "#f7f8f8";
              (e.currentTarget as HTMLElement).style.borderColor = "#383b3f";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.color = "#8a8f98";
              (e.currentTarget as HTMLElement).style.borderColor = "#23252a";
            }}
          >
            <History size={12} />
            History
          </button>

          {/* AI toggle */}
          <button
            onClick={() => setShowAI(!showAI)}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded text-xs transition-all duration-150"
            style={
              showAI
                ? {
                    background: "rgba(95, 237, 131, 0.1)",
                    border: "1px solid rgba(95, 237, 131, 0.2)",
                    color: "#5fed83",
                  }
                : {
                    color: "#8a8f98",
                    border: "1px solid #23252a",
                  }
            }
            onMouseEnter={(e) => {
              if (!showAI) {
                (e.currentTarget as HTMLElement).style.color = "#f7f8f8";
                (e.currentTarget as HTMLElement).style.borderColor = "#383b3f";
              }
            }}
            onMouseLeave={(e) => {
              if (!showAI) {
                (e.currentTarget as HTMLElement).style.color = "#8a8f98";
                (e.currentTarget as HTMLElement).style.borderColor = "#23252a";
              }
            }}
          >
            <Sparkles size={12} />
            AI
          </button>

          {/* Commit button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowCommitModal(true)}
            disabled={!hasChanges}
            className="btn-primary text-xs px-3 py-1.5 flex items-center gap-1.5"
            style={{ opacity: hasChanges ? 1 : 0.4 }}
          >
            <Save size={12} />
            Commit
          </motion.button>
        </div>
      </div>

      {/*Editor Area*/}
      <div className="flex flex-1 overflow-hidden">
        {/* Editor */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Word count bar */}
          <div
            className="flex items-center justify-between px-6 py-1.5"
            style={{ borderBottom: "1px solid #161718" }}
          >
            <span
              style={{
                color: "#62666d",
                fontSize: "11px",
                fontFamily: "monospace",
              }}
            >
              {currentBranch?.name} /
              {latestCommit ? ` ${latestCommit.message}` : " no commits yet"}
            </span>
            <span
              style={{
                color: "#62666d",
                fontSize: "11px",
                fontFamily: "monospace",
              }}
            >
              {content.trim().split(/\s+/).filter(Boolean).length} words
            </span>
          </div>

          {/* Textarea */}
          <textarea
            ref={textareaRef}
            value={content}
            onChange={handleContentChange}
            placeholder="Start writing your story..."
            className="flex-1 resize-none outline-none p-8 font-serif"
            style={{
              background: "#08090a",
              color: "#d0d6e0",
              fontSize: "16px",
              lineHeight: "1.8",
              letterSpacing: "0.01px",
              caretColor: "#8dd6ff",
              maxWidth: "720px",
              margin: "0 auto",
              width: "100%",
            }}
          />
        </div>

        {/* AI Panel */}
        <AnimatePresence>
          {showAI && (
            <AIPanel
              content={content}
              genre={story?.genre || undefined}
              onInsert={handleInsert}
              onClose={() => setShowAI(false)}
            />
          )}
        </AnimatePresence>
      </div>

      {/*Modals*/}
      <AnimatePresence>
        {showCommitModal && (
          <CommitModal
            onCommit={(msg) => commitMutation.mutate(msg)}
            onClose={() => setShowCommitModal(false)}
            loading={commitMutation.isPending}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showBranchModal && (
          <NewBranchModal
            onCreate={(name) => branchMutation.mutate(name)}
            onClose={() => setShowBranchModal(false)}
            loading={branchMutation.isPending}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
