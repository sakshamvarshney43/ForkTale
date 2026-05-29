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
import { useAuth } from "../context/AuthContext";
import { Branch, Commit } from "../types";

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

//New branch Modal
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

// AI Panel
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
