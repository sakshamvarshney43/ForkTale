import {
  useState,
  useEffect,
  useLayoutEffect,
  useRef,
  useMemo,
  useCallback,
} from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import PermissionNotice from "../components/PermissionNotice";
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
  Globe,
  Type,
  Users,
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  storyService,
  branchService,
  commitService,
  aiService,
  publishService,
  collaborateService,
} from "../services/api";
import type { Branch, Commit } from "../types";

const FONTS = [
  { label: "Georgia", value: "Georgia, 'Times New Roman', serif" },
  { label: "Merriweather", value: "'Merriweather', Georgia, serif" },
  { label: "System", value: "system-ui, -apple-system, sans-serif" },
  { label: "Mono", value: "'JetBrains Mono', 'Courier New', monospace" },
];

const SIZES = [
  { label: "S", value: 15 },
  { label: "M", value: 17 },
  { label: "L", value: 19 },
];

//  CommitModal

function CommitModal({
  onCommit,
  onClose,
  loading,
}: {
  onCommit: (msg: string) => void;
  onClose: () => void;
  loading: boolean;
}) {
  const [message, setMessage] = useState("");

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 50,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "0 16px",
        background: "rgba(0,0,0,0.45)",
      }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Save commit"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 8 }}
        transition={{ duration: 0.15 }}
        style={{
          width: "100%",
          maxWidth: 440,
          background: "var(--bg)",
          border: "1.5px solid var(--border)",
          borderRadius: 14,
          padding: 24,
          boxShadow: "var(--shadow-xl)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 18,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <GitCommit size={15} style={{ color: "var(--accent)" }} />
            <h3
              style={{
                fontSize: 15,
                fontWeight: 600,
                color: "var(--text-primary)",
                fontFamily: "var(--font-body)",
                margin: 0,
              }}
            >
              Save commit
            </h3>
          </div>
          {/* FIX: aria-label on icon-only button */}
          <button
            onClick={onClose}
            aria-label="Close"
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "var(--text-muted)",
              display: "flex",
              padding: 4,
              borderRadius: 6,
              transition: "color 0.15s",
            }}
            onMouseEnter={(e) =>
              ((e.currentTarget as HTMLElement).style.color =
                "var(--text-primary)")
            }
            onMouseLeave={(e) =>
              ((e.currentTarget as HTMLElement).style.color =
                "var(--text-muted)")
            }
          >
            <X size={15} />
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
          className="input"
          style={{ marginBottom: 16, fontSize: 14 }}
          aria-label="Commit message"
        />
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
          <button onClick={onClose} className="btn btn-ghost">
            Cancel
          </button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => message.trim() && onCommit(message.trim())}
            disabled={!message.trim() || loading}
            className="btn btn-primary"
            style={{ gap: 6 }}
          >
            {loading ? (
              <Loader2
                size={13}
                style={{ animation: "spin 0.7s linear infinite" }}
              />
            ) : (
              <Check size={13} />
            )}
            Commit
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}

//NewBranchModal

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

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 50,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "0 16px",
        background: "rgba(0,0,0,0.45)",
      }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Create new branch"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 8 }}
        transition={{ duration: 0.15 }}
        style={{
          width: "100%",
          maxWidth: 440,
          background: "var(--bg)",
          border: "1.5px solid var(--border)",
          borderRadius: 14,
          padding: 24,
          boxShadow: "var(--shadow-xl)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 18,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <GitBranch size={15} style={{ color: "var(--accent)" }} />
            <h3
              style={{
                fontSize: 15,
                fontWeight: 600,
                color: "var(--text-primary)",
                fontFamily: "var(--font-body)",
                margin: 0,
              }}
            >
              New branch
            </h3>
          </div>
          {/* FIX: aria-label on icon-only button */}
          <button
            onClick={onClose}
            aria-label="Close"
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "var(--text-muted)",
              display: "flex",
              padding: 4,
              borderRadius: 6,
              transition: "color 0.15s",
            }}
            onMouseEnter={(e) =>
              ((e.currentTarget as HTMLElement).style.color =
                "var(--text-primary)")
            }
            onMouseLeave={(e) =>
              ((e.currentTarget as HTMLElement).style.color =
                "var(--text-muted)")
            }
          >
            <X size={15} />
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
          className="input"
          style={{ marginBottom: 6, fontSize: 14 }}
          aria-label="Branch name"
        />
        <p
          style={{
            fontSize: 12,
            color: "var(--text-muted)",
            marginBottom: 16,
            fontFamily: "var(--font-body)",
          }}
        >
          Letters, numbers, hyphens and underscores only
        </p>
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
          <button onClick={onClose} className="btn btn-ghost">
            Cancel
          </button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => name.trim() && onCreate(name.trim())}
            disabled={!name.trim() || loading}
            className="btn btn-primary"
            style={{ gap: 6 }}
          >
            {loading ? (
              <Loader2
                size={13}
                style={{ animation: "spin 0.7s linear infinite" }}
              />
            ) : (
              <Plus size={13} />
            )}
            Create
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// AIPanel

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
        const lines = decoder.decode(value).split("\n");
        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.slice(6);
            if (data === "[DONE]") break;
            try {
              const p = JSON.parse(data);
              if (p.text) setStreamedText((prev) => prev + p.text);
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
      initial={{ opacity: 0, x: 16 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 16 }}
      transition={{ duration: 0.2 }}
      style={{
        width: 264,
        flexShrink: 0,
        borderLeft: "1px solid var(--border)",
        background: "var(--bg-subtle)",
        display: "flex",
        flexDirection: "column",
        height: "100%",
      }}
      role="complementary"
      aria-label="AI Assistant"
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "14px 16px",
          borderBottom: "1px solid var(--border)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
          <Sparkles size={14} style={{ color: "#16a34a" }} />
          <span
            style={{
              fontSize: 13,
              fontWeight: 600,
              color: "var(--text-primary)",
              fontFamily: "var(--font-body)",
            }}
          >
            AI Assistant
          </span>
        </div>
        {/* FIX: aria-label on icon-only button */}
        <button
          onClick={onClose}
          aria-label="Close AI panel"
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "var(--text-muted)",
            display: "flex",
            padding: 4,
            borderRadius: 4,
            transition: "color 0.15s",
          }}
          onMouseEnter={(e) =>
            ((e.currentTarget as HTMLElement).style.color =
              "var(--text-primary)")
          }
          onMouseLeave={(e) =>
            ((e.currentTarget as HTMLElement).style.color = "var(--text-muted)")
          }
        >
          <X size={14} />
        </button>
      </div>
      <div style={{ padding: "10px 10px 0" }}>
        {actions.map((action) => (
          <button
            key={action.key}
            onClick={() => runAction(action.key)}
            disabled={isStreaming}
            style={{
              width: "100%",
              textAlign: "left",
              padding: "9px 12px",
              borderRadius: 8,
              fontSize: 13,
              fontFamily: "var(--font-body)",
              fontWeight: 500,
              cursor: isStreaming ? "not-allowed" : "pointer",
              border: "none",
              marginBottom: 4,
              transition: "all 0.15s",
              background:
                activeAction === action.key
                  ? "var(--accent-subtle)"
                  : "transparent",
              color:
                activeAction === action.key
                  ? "var(--accent)"
                  : "var(--text-secondary)",
              opacity: isStreaming && activeAction !== action.key ? 0.4 : 1,
            }}
            onMouseEnter={(e) => {
              if (activeAction !== action.key && !isStreaming) {
                (e.currentTarget as HTMLElement).style.background =
                  "var(--bg-muted)";
                (e.currentTarget as HTMLElement).style.color =
                  "var(--text-primary)";
              }
            }}
            onMouseLeave={(e) => {
              if (activeAction !== action.key) {
                (e.currentTarget as HTMLElement).style.background =
                  "transparent";
                (e.currentTarget as HTMLElement).style.color =
                  "var(--text-secondary)";
              }
            }}
          >
            {action.label}
          </button>
        ))}
      </div>
      {result && (
        <>
          <div
            style={{
              height: 1,
              background: "var(--border)",
              margin: "8px 12px",
            }}
          />
          <div style={{ flex: 1, overflowY: "auto", padding: "0 12px 12px" }}>
            <p
              style={{
                fontSize: 13,
                color: "var(--text-secondary)",
                lineHeight: 1.7,
                marginBottom: 12,
                fontFamily: "var(--font-body)",
                whiteSpace: "pre-wrap",
              }}
            >
              {result}
              {isStreaming && (
                <motion.span
                  animate={{ opacity: [1, 0, 1] }}
                  transition={{ repeat: Infinity, duration: 0.9 }}
                  style={{
                    display: "inline-block",
                    width: 2,
                    height: 13,
                    background: "#16a34a",
                    marginLeft: 2,
                    verticalAlign: "middle",
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
                className="btn btn-primary"
                style={{
                  width: "100%",
                  justifyContent: "center",
                  fontSize: 13,
                }}
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

function FontMenu({
  fontIdx,
  sizeIdx,
  onFontChange,
  onSizeChange,
  onClose,
  anchorRef,
}: {
  fontIdx: number;
  sizeIdx: number;
  onFontChange: (i: number) => void;
  onSizeChange: (i: number) => void;
  onClose: () => void;
  anchorRef: React.RefObject<HTMLButtonElement | null>;
}) {
  const menuRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ top: 0, right: 0 });

  useLayoutEffect(() => {
    if (anchorRef.current) {
      const rect = anchorRef.current.getBoundingClientRect();
      setPos({
        top: rect.bottom + 4,
        right: window.innerWidth - rect.right,
      });
    }
  }, [anchorRef]);

  useEffect(() => {
    const handleMouse = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        menuRef.current &&
        !menuRef.current.contains(target) &&
        anchorRef.current &&
        !anchorRef.current.contains(target)
      ) {
        onClose();
      }
    };
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    const t = setTimeout(() => {
      document.addEventListener("mousedown", handleMouse, true);
      document.addEventListener("keydown", handleKey);
    }, 0);
    return () => {
      clearTimeout(t);
      document.removeEventListener("mousedown", handleMouse, true);
      document.removeEventListener("keydown", handleKey);
    };
  }, [onClose, anchorRef]);

  return (
    <motion.div
      ref={menuRef}
      initial={{ opacity: 0, y: 4, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 4, scale: 0.97 }}
      transition={{ duration: 0.12 }}
      style={{
        position: "fixed",
        top: pos.top,
        right: pos.right,
        width: 196,
        background: "var(--bg)",
        border: "1.5px solid var(--border)",
        borderRadius: 10,
        boxShadow: "0 10px 40px rgba(0,0,0,0.18)",
        padding: 4,
        zIndex: 9999,
      }}
      role="menu"
      aria-label="Typography settings"
    >
      <p
        style={{
          fontSize: 10,
          fontWeight: 600,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          color: "var(--text-muted)",
          padding: "6px 10px 4px",
          fontFamily: "var(--font-body)",
        }}
      >
        Font
      </p>
      {FONTS.map((f, i) => (
        <button
          key={f.label}
          role="menuitem"
          onClick={() => {
            onFontChange(i);
            onClose();
          }}
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "8px 10px",
            border: "none",
            cursor: "pointer",
            borderRadius: 7,
            fontSize: 14,
            background: i === fontIdx ? "var(--accent-subtle)" : "transparent",
            color: i === fontIdx ? "var(--accent)" : "var(--text-primary)",
            fontFamily: f.value,
            transition: "background 0.12s",
          }}
          onMouseEnter={(e) => {
            if (i !== fontIdx)
              (e.currentTarget as HTMLElement).style.background =
                "var(--bg-muted)";
          }}
          onMouseLeave={(e) => {
            if (i !== fontIdx)
              (e.currentTarget as HTMLElement).style.background = "transparent";
          }}
        >
          {f.label}
          {i === fontIdx && <Check size={12} />}
        </button>
      ))}
      <div
        style={{
          height: 1,
          background: "var(--border)",
          margin: "6px 4px 4px",
        }}
      />
      <p
        style={{
          fontSize: 10,
          fontWeight: 600,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          color: "var(--text-muted)",
          padding: "2px 10px 6px",
          fontFamily: "var(--font-body)",
        }}
      >
        Size
      </p>
      <div
        style={{ display: "flex", gap: 4, padding: "0 6px 8px" }}
        role="group"
        aria-label="Font size"
      >
        {SIZES.map((s, i) => (
          <button
            key={s.label}
            role="menuitem"
            aria-pressed={i === sizeIdx}
            onClick={() => onSizeChange(i)}
            style={{
              flex: 1,
              padding: "5px 0",
              border: "none",
              cursor: "pointer",
              borderRadius: 6,
              fontSize: 12,
              fontWeight: 600,
              fontFamily: "var(--font-body)",
              background:
                i === sizeIdx ? "var(--text-primary)" : "var(--bg-muted)",
              color: i === sizeIdx ? "white" : "var(--text-secondary)",
              transition: "all 0.12s",
            }}
          >
            {s.label}
          </button>
        ))}
      </div>
    </motion.div>
  );
}

//  BranchView

export default function BranchView() {
  const { storyId, branchId } = useParams<{
    storyId: string;
    branchId: string;
  }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const [content, setContent] = useState("");
  const [showCommitModal, setShowCommitModal] = useState(false);
  const [showBranchModal, setShowBranchModal] = useState(false);
  const [showBranchDrop, setShowBranchDrop] = useState(false);
  const [showFontMenu, setShowFontMenu] = useState(false);
  const [showAI, setShowAI] = useState(false);
  const [showCollaborators, setShowCollaborators] = useState(false);
  const [inviteUsername, setInviteUsername] = useState("");
  const [inviteRole, setInviteRole] = useState<"VIEWER" | "EDITOR">("EDITOR");
  const [hasChanges, setHasChanges] = useState(false);
  const [fontIdx, setFontIdx] = useState(0);
  const [sizeIdx, setSizeIdx] = useState(1);
  const [showMoreMenu, setShowMoreMenu] = useState(false);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fontBtnRef = useRef<HTMLButtonElement>(null);

  // Queries

  const { data: storyData } = useQuery({
    queryKey: ["story", storyId],
    queryFn: () => storyService.getMyStory(storyId!),
  });
  const { data: branchesData } = useQuery({
    queryKey: ["branches", storyId],
    queryFn: () => branchService.getBranches(storyId!),
  });
  const { data: latestData, isLoading: commitLoading } = useQuery({
    queryKey: ["latestCommit", storyId, branchId],
    queryFn: () => commitService.getLatestCommit(storyId!, branchId!),
  });

  const { data: collaboratorsData } = useQuery({
    queryKey: ["collaborators", storyId],
    queryFn: () => collaborateService.getCollaborators(storyId!),
    enabled: showCollaborators,
  });

  const story = storyData?.data?.story;
  const collaborators = collaboratorsData?.data?.collaborators || [];
  const branches: Branch[] = branchesData?.data?.branches || [];
  const currentBranch = branches.find((b) => b.id === branchId);
  const latestCommit: Commit | null = latestData?.data?.commit || null;
  const isAuthor = story?.authorId === user?.id;
  const myCollaboration = story?.collaborators?.find(
    (c: any) => c.userId === user?.id,
  );
  const role = isAuthor ? "AUTHOR" : myCollaboration?.role || "VIEWER";
  const isMainBranch = currentBranch?.isDefault;
  const mainBranchLocked = role === "EDITOR" && isMainBranch && !isAuthor;
  const isViewer = role === "VIEWER";
  const canEdit = !mainBranchLocked && !isViewer;

  const wordCount = useMemo(() => {
    if (!content.trim()) return 0;
    return content.trim().split(/\s+/).filter(Boolean).length;
  }, [content]);

  //Load commit content

  useEffect(() => {
    // FIX: use !== undefined check so empty-string content ("") is still applied
    if (latestCommit?.content !== undefined) {
      setContent(latestCommit.content ?? "");
      setHasChanges(false);
    }
  }, [latestCommit]);

  useEffect(() => {
    if (!showBranchDrop) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setShowBranchDrop(false);
    };
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest("[data-branch-switcher]")) {
        setShowBranchDrop(false);
      }
    };
    const t = setTimeout(() => {
      document.addEventListener("keydown", handleKey);
      document.addEventListener("mousedown", handleClick, true);
    }, 0);
    return () => {
      clearTimeout(t);
      document.removeEventListener("keydown", handleKey);
      document.removeEventListener("mousedown", handleClick, true);
    };
  }, [showBranchDrop]);

  // Close mobile more-menu on outside click

  useEffect(() => {
    if (!showMoreMenu) return;
    const handler = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest("[data-more-menu]")) setShowMoreMenu(false);
    };
    const t = setTimeout(
      () => document.addEventListener("mousedown", handler, true),
      0,
    );
    return () => {
      clearTimeout(t);
      document.removeEventListener("mousedown", handler, true);
    };
  }, [showMoreMenu]);

  // Mutations

  const commitMutation = useMutation({
    mutationFn: (message: string) =>
      commitService.createCommit(storyId!, branchId!, { message, content }),
    onSuccess: () => {
      setHasChanges(false);
      setShowCommitModal(false);
      queryClient.invalidateQueries({
        queryKey: ["latestCommit", storyId, branchId],
      });
      queryClient.invalidateQueries({
        queryKey: ["commits", storyId, branchId],
      });
      queryClient.invalidateQueries({ queryKey: ["story", storyId] });
      queryClient.invalidateQueries({ queryKey: ["branches", storyId] });
      toast.success("Changes committed!");
    },
    onError: (err: any) =>
      toast.error(err?.response?.data?.message || "Something went wrong"),
  });

  const inviteMutation = useMutation({
    mutationFn: () =>
      collaborateService.invite(storyId!, {
        username: inviteUsername,
        role: inviteRole,
      }),
    onSuccess: () => {
      setInviteUsername("");
      queryClient.invalidateQueries({ queryKey: ["collaborators", storyId] });
      toast.success("Collaborator invited!");
    },
    onError: (err: any) =>
      toast.error(err?.response?.data?.message || "Something went wrong"),
  });

  const publishMutation = useMutation({
    mutationFn: () => publishService.publish(storyId!, branchId!),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["story", storyId] });
      await queryClient.invalidateQueries({ queryKey: ["myStories"] });
      await queryClient.invalidateQueries({ queryKey: ["discover"] });
      toast.success("Branch published!");
    },
    onError: (err: any) =>
      toast.error(err?.response?.data?.message || "Something went wrong"),
  });

  const branchMutation = useMutation({
    mutationFn: (name: string) =>
      branchService.createBranch(storyId!, {
        name,
        fromCommitId: latestCommit?.id,
      }),
    onSuccess: (res) => {
      setShowBranchModal(false);
      queryClient.invalidateQueries({ queryKey: ["branches", storyId] });
      navigate(`/stories/${storyId}/branches/${res.data.branch.id}`);
    },
    onError: (err: any) =>
      toast.error(err?.response?.data?.message || "Something went wrong"),
  });

  const handleContentChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setContent(e.target.value);
      setHasChanges(true);
    },
    [],
  );

  const handleInsertAI = useCallback((text: string) => {
    setContent((prev) => (prev ? prev + "\n\n" + text : text));
    setHasChanges(true);
    setShowAI(false);
  }, []);

  const handleCommit = useCallback(
    (msg: string) => {
      commitMutation.mutate(msg);
    },
    [commitMutation],
  );

  const handleCreateBranch = useCallback(
    (name: string) => {
      branchMutation.mutate(name);
    },
    [branchMutation],
  );

  //Loading

  if (commitLoading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "var(--bg)",
        }}
      >
        <Loader2
          size={20}
          style={{
            color: "var(--text-muted)",
            animation: "spin 0.7s linear infinite",
          }}
        />
      </div>
    );
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        background: "var(--bg)",
        overflow: "hidden",
      }}
    >
      {/*Toolbar*/}
      <header
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 16px",
          height: 52,
          flexShrink: 0,
          borderBottom: "1px solid var(--border)",
          background: "var(--bg)",
          position: "relative",
          zIndex: 10,
        }}
      >
        {/* Left : title + branch switcher */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            minWidth: 0,
            flex: "1 1 0",
            overflow: "hidden",
          }}
        >
          <button
            onClick={() => navigate("/dashboard")}
            aria-label="Back to dashboard"
            style={{
              padding: 6,
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "var(--text-muted)",
              display: "flex",
              borderRadius: 6,
              transition: "all 0.15s",
              flexShrink: 0,
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.background =
                "var(--bg-muted)";
              (e.currentTarget as HTMLElement).style.color =
                "var(--text-primary)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.background = "transparent";
              (e.currentTarget as HTMLElement).style.color =
                "var(--text-muted)";
            }}
          >
            <ArrowLeft size={15} />
          </button>

          <div
            style={{
              width: 1,
              height: 18,
              background: "var(--border)",
              flexShrink: 0,
            }}
          />

          <span
            title={story?.title}
            style={{
              fontSize: 14,
              fontWeight: 600,
              color: "var(--text-primary)",
              fontFamily: "var(--font-body)",
              letterSpacing: "-0.01em",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {story?.title}
          </span>

          {/* Branch switcher  */}
          <div
            data-branch-switcher
            style={{ position: "relative", flexShrink: 0 }}
          >
            <button
              onClick={() => setShowBranchDrop((p) => !p)}
              aria-expanded={showBranchDrop}
              aria-haspopup="listbox"
              aria-label="Switch branch"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "5px 10px",
                borderRadius: 7,
                cursor: "pointer",
                background: "var(--bg-subtle)",
                border: "1.5px solid var(--border)",
                fontSize: 12,
                fontWeight: 600,
                color: "var(--accent)",
                fontFamily: "var(--font-mono)",
                transition: "border-color 0.15s",
              }}
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLElement).style.borderColor =
                  "var(--accent-border)")
              }
              onMouseLeave={(e) => {
                if (!showBranchDrop)
                  (e.currentTarget as HTMLElement).style.borderColor =
                    "var(--border)";
              }}
            >
              <GitBranch size={11} />
              {currentBranch?.name || "main"}
              <ChevronDown
                size={11}
                style={{
                  color: "var(--text-muted)",
                  transform: showBranchDrop ? "rotate(180deg)" : "rotate(0deg)",
                  transition: "transform 0.15s",
                }}
              />
            </button>

            <AnimatePresence>
              {showBranchDrop && (
                <motion.div
                  initial={{ opacity: 0, y: 4, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 4, scale: 0.97 }}
                  transition={{ duration: 0.12 }}
                  style={{
                    position: "absolute",
                    left: 0,
                    top: "calc(100% + 4px)",
                    width: 200,
                    background: "var(--bg)",
                    border: "1.5px solid var(--border)",
                    borderRadius: 10,
                    boxShadow: "var(--shadow-xl)",
                    padding: 4,
                    zIndex: 40,
                  }}
                  role="listbox"
                  aria-label="Select branch"
                >
                  {branches.map((branch) => (
                    <button
                      key={branch.id}
                      role="option"
                      aria-selected={branch.id === branchId}
                      onClick={() => {
                        navigate(`/stories/${storyId}/branches/${branch.id}`);
                        setShowBranchDrop(false);
                      }}
                      style={{
                        width: "100%",
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        padding: "8px 10px",
                        border: "none",
                        cursor: "pointer",
                        borderRadius: 7,
                        fontSize: 12,
                        fontFamily: "var(--font-mono)",
                        fontWeight: 500,
                        background:
                          branch.id === branchId
                            ? "var(--accent-subtle)"
                            : "transparent",
                        color:
                          branch.id === branchId
                            ? "var(--accent)"
                            : "var(--text-secondary)",
                        transition: "all 0.12s",
                      }}
                      onMouseEnter={(e) => {
                        if (branch.id !== branchId) {
                          (e.currentTarget as HTMLElement).style.background =
                            "var(--bg-muted)";
                          (e.currentTarget as HTMLElement).style.color =
                            "var(--text-primary)";
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (branch.id !== branchId) {
                          (e.currentTarget as HTMLElement).style.background =
                            "transparent";
                          (e.currentTarget as HTMLElement).style.color =
                            "var(--text-secondary)";
                        }
                      }}
                    >
                      <GitBranch size={11} />
                      {branch.name}
                      {branch.isDefault && (
                        <span
                          className="badge badge-default"
                          style={{ fontSize: 10, marginLeft: "auto" }}
                        >
                          default
                        </span>
                      )}
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
                      setShowBranchModal(true);
                      setShowBranchDrop(false);
                    }}
                    style={{
                      width: "100%",
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      padding: "8px 10px",
                      border: "none",
                      cursor: "pointer",
                      borderRadius: 7,
                      fontSize: 12,
                      fontFamily: "var(--font-body)",
                      color: "var(--text-secondary)",
                      background: "transparent",
                      transition: "all 0.12s",
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
                        "var(--text-secondary)";
                    }}
                  >
                    <Plus size={11} />
                    New branch
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            flexShrink: 0,
          }}
        >
          {/* Unsaved indicator*/}
          {hasChanges && (
            <span
              aria-live="polite"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 4,
                fontSize: 12,
                color: "#d97706",
                fontFamily: "var(--font-body)",
                background: "#fffbeb",
                border: "1px solid #fde68a",
                padding: "3px 8px",
                borderRadius: 99,
                flexShrink: 0,
              }}
            >
              <AlertCircle size={11} />
              <span className="hide-mobile">Unsaved</span>
            </span>
          )}

          {/* Font / style picker*/}
          <div style={{ position: "relative" }}>
            <button
              ref={fontBtnRef}
              onClick={() => setShowFontMenu((prev) => !prev)}
              aria-expanded={showFontMenu}
              aria-haspopup="menu"
              aria-label="Typography settings"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 5,
                padding: "5px 10px",
                borderRadius: 7,
                fontSize: 12,
                fontWeight: 500,
                cursor: "pointer",
                border: "1.5px solid var(--border)",
                background: showFontMenu ? "var(--bg-muted)" : "transparent",
                color: "var(--text-secondary)",
                fontFamily: "var(--font-body)",
                transition: "all 0.15s",
              }}
              onMouseEnter={(e) => {
                if (!showFontMenu)
                  (e.currentTarget as HTMLElement).style.background =
                    "var(--bg-muted)";
              }}
              onMouseLeave={(e) => {
                if (!showFontMenu)
                  (e.currentTarget as HTMLElement).style.background =
                    "transparent";
              }}
            >
              <Type size={12} />
              <span className="hide-mobile">
                {FONTS[fontIdx].label} · {SIZES[sizeIdx].label}
              </span>
            </button>
            {/* AnimatePresence enables exit animation on FontMenu */}
            <AnimatePresence>
              {showFontMenu && (
                <FontMenu
                  key="font-menu"
                  fontIdx={fontIdx}
                  sizeIdx={sizeIdx}
                  onFontChange={setFontIdx}
                  onSizeChange={setSizeIdx}
                  onClose={() => setShowFontMenu(false)}
                  anchorRef={fontBtnRef}
                />
              )}
            </AnimatePresence>
          </div>

          <div
            style={{
              width: 1,
              height: 18,
              background: "var(--border)",
              flexShrink: 0,
            }}
          />

          <button
            onClick={() =>
              navigate(`/stories/${storyId}/commits?branch=${branchId}`)
            }
            className="btn btn-ghost btn-sm hide-mobile"
            style={{ gap: 5 }}
            aria-label="View commit history"
          >
            <History size={13} />
            History
          </button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => publishMutation.mutate()}
            disabled={publishMutation.isPending}
            aria-label="Publish branch"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 5,
              padding: "6px 12px",
              borderRadius: 7,
              fontSize: 13,
              fontWeight: 500,
              cursor: "pointer",
              border: "1.5px solid #bbf7d0",
              background: "#f0fdf4",
              color: "#16a34a",
              fontFamily: "var(--font-body)",
              transition: "background 0.15s",
              flexShrink: 0,
            }}
            onMouseEnter={(e) =>
              ((e.currentTarget as HTMLElement).style.background = "#dcfce7")
            }
            onMouseLeave={(e) =>
              ((e.currentTarget as HTMLElement).style.background = "#f0fdf4")
            }
          >
            {publishMutation.isPending ? (
              <Loader2
                size={13}
                style={{ animation: "spin 0.7s linear infinite" }}
              />
            ) : (
              <Globe size={13} />
            )}
            {/* Hide label on mobile to save space; icon remains */}
            <span className="hide-mobile">Publish</span>
          </motion.button>

          <button
            className="hide-mobile"
            onClick={() => setShowCollaborators(true)}
            aria-label="Manage collaborators"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 5,
              padding: "6px 12px",
              borderRadius: 7,
              fontSize: 13,
              fontWeight: 500,
              cursor: "pointer",
              border: "1.5px solid var(--border)",
              background: "transparent",
              color: "var(--text-secondary)",
              fontFamily: "var(--font-body)",
              transition: "all 0.15s",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.background =
                "var(--bg-muted)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.background = "transparent";
            }}
          >
            <Users size={13} />
            Collaborators
          </button>

          <button
            onClick={() => setShowAI(!showAI)}
            aria-pressed={showAI}
            aria-label="Toggle AI assistant"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 5,
              padding: "6px 12px",
              borderRadius: 7,
              fontSize: 13,
              fontWeight: 500,
              cursor: "pointer",
              border: "1.5px solid",
              transition: "all 0.15s",
              background: showAI ? "#f0fdf4" : "transparent",
              borderColor: showAI ? "#bbf7d0" : "var(--border)",
              color: showAI ? "#16a34a" : "var(--text-secondary)",
              fontFamily: "var(--font-body)",
              flexShrink: 0,
            }}
            onMouseEnter={(e) => {
              if (!showAI)
                (e.currentTarget as HTMLElement).style.borderColor =
                  "var(--border-strong)";
            }}
            onMouseLeave={(e) => {
              if (!showAI)
                (e.currentTarget as HTMLElement).style.borderColor =
                  "var(--border)";
            }}
          >
            <Sparkles size={13} />
            <span className="hide-mobile">AI</span>
          </button>

          {/* Mobile overflow menu button*/}
          <button
            className="show-mobile"
            data-more-menu
            onClick={() => setShowMoreMenu((p) => !p)}
            aria-label="More options"
            aria-expanded={showMoreMenu}
            style={{
              alignItems: "center",
              justifyContent: "center",
              width: 34,
              height: 34,
              borderRadius: 7,
              border: "1.5px solid var(--border)",
              background: showMoreMenu ? "var(--bg-muted)" : "transparent",
              cursor: "pointer",
              color: "var(--text-secondary)",
              fontSize: 18,
              fontWeight: 700,
              flexShrink: 0,
              transition: "background 0.15s",
            }}
          >
            ⋮
          </button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowCommitModal(true)}
            disabled={!canEdit || !hasChanges}
            aria-label="Commit changes"
            className="btn btn-primary btn-sm"
            style={{
              gap: 5,
              opacity: canEdit && hasChanges ? 1 : 0.4,
              minWidth: 80,
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <Save size={13} />
            Commit
          </motion.button>
        </div>
      </header>

      {/* Permission notices*/}
      {mainBranchLocked && (
        <PermissionNotice
          title="Main branch protected"
          message="You cannot edit the author's main branch. Create a new branch to contribute."
        />
      )}
      {isViewer && (
        <PermissionNotice
          type="info"
          title="Read-only access"
          message="You can view this story but cannot create commits or publish changes."
        />
      )}

      {/*Status bar*/}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "5px 28px",
          borderBottom: "1px solid var(--border)",
          background: "var(--bg-subtle)",
        }}
        aria-label="Editor status"
      >
        <span
          style={{
            fontSize: 12,
            color: "var(--text-muted)",
            fontFamily: "var(--font-mono)",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {currentBranch?.name}
          {latestCommit ? ` / ${latestCommit.message}` : " / no commits yet"}
        </span>
        <span
          aria-live="polite"
          aria-label={`${wordCount} ${wordCount === 1 ? "word" : "words"}`}
          style={{
            fontSize: 12,
            color: "var(--text-muted)",
            fontFamily: "var(--font-body)",
            flexShrink: 0,
          }}
        >
          {wordCount.toLocaleString()} {wordCount === 1 ? "word" : "words"}
        </span>
      </div>

      {/*Writing area + AI panel  */}
      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        <div style={{ flex: 1, overflowY: "auto", background: "var(--bg)" }}>
          <textarea
            ref={textareaRef}
            readOnly={!canEdit}
            value={content}
            onChange={handleContentChange}
            placeholder={canEdit ? "Start writing your story…" : "Read-only"}
            aria-label="Story editor"
            aria-readonly={!canEdit}
            style={{
              display: "block",
              width: "100%",
              maxWidth: 680,
              margin: "0 auto",
              minHeight: "100%",
              padding: "48px 32px 120px",
              background: "transparent",
              border: "none",
              outline: "none",
              resize: "none",
              fontFamily: FONTS[fontIdx].value,
              fontSize: SIZES[sizeIdx].value,
              lineHeight: 1.85,
              color: "#1c1c1c",
              caretColor: "var(--accent)",
              letterSpacing: "0.008em",
              // FIX: communicate read-only state visually
              cursor: canEdit ? "text" : "default",
            }}
          />
        </div>
        <AnimatePresence>
          {showAI && (
            <AIPanel
              content={content}
              genre={story?.genre || undefined}
              // FIX: stable useCallback references
              onInsert={handleInsertAI}
              onClose={() => setShowAI(false)}
            />
          )}
        </AnimatePresence>
      </div>

      {/*Mobile more-menu*/}
      <AnimatePresence>
        {showMoreMenu && (
          <motion.div
            data-more-menu
            initial={{ opacity: 0, scale: 0.95, y: -4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -4 }}
            transition={{ duration: 0.12 }}
            style={{
              position: "fixed",
              top: 60,
              right: 12,
              background: "var(--bg)",
              border: "1.5px solid var(--border)",
              borderRadius: 12,
              boxShadow: "0 10px 30px rgba(0,0,0,0.12)",
              padding: 8,
              zIndex: 100,
              minWidth: 200,
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
          >
            {[
              {
                label: "History",
                action: () => {
                  navigate(`/stories/${storyId}/commits?branch=${branchId}`);
                  setShowMoreMenu(false);
                },
              },
              {
                label: "Collaborators",
                action: () => {
                  setShowCollaborators(true);
                  setShowMoreMenu(false);
                },
              },
            ].map(({ label, action }) => (
              <button
                key={label}
                onClick={action}
                style={{
                  textAlign: "left",
                  padding: "10px 12px",
                  border: "none",
                  background: "transparent",
                  cursor: "pointer",
                  borderRadius: 8,
                  fontSize: 14,
                  color: "var(--text-primary)",
                  fontFamily: "var(--font-body)",
                  transition: "background 0.12s",
                }}
                onMouseEnter={(e) =>
                  ((e.currentTarget as HTMLElement).style.background =
                    "var(--bg-muted)")
                }
                onMouseLeave={(e) =>
                  ((e.currentTarget as HTMLElement).style.background =
                    "transparent")
                }
              >
                {label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modals*/}
      <AnimatePresence>
        {showCommitModal && (
          <CommitModal
            onCommit={handleCommit}
            onClose={() => setShowCommitModal(false)}
            loading={commitMutation.isPending}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showBranchModal && (
          <NewBranchModal
            onCreate={handleCreateBranch}
            onClose={() => setShowBranchModal(false)}
            loading={branchMutation.isPending}
          />
        )}
      </AnimatePresence>

      {/*Collaborators panel */}
      <AnimatePresence>
        {showCollaborators && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.45)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 60,
              padding: "0 16px",
            }}
            onClick={() => setShowCollaborators(false)}
            role="dialog"
            aria-modal="true"
            aria-label="Collaborators"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                width: "min(420px, 100%)",
                background: "var(--bg)",
                borderRadius: 14,
                padding: 24,
                border: "1.5px solid var(--border)",
                boxShadow: "var(--shadow-xl)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: 20,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <Users size={15} style={{ color: "var(--accent)" }} />
                  <h3
                    style={{
                      fontSize: 15,
                      fontWeight: 600,
                      color: "var(--text-primary)",
                      fontFamily: "var(--font-body)",
                      margin: 0,
                    }}
                  >
                    Collaborators
                  </h3>
                </div>
                {/* FIX: aria-label on icon-only close button */}
                <button
                  onClick={() => setShowCollaborators(false)}
                  aria-label="Close"
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "var(--text-muted)",
                    padding: 4,
                    borderRadius: 6,
                    display: "flex",
                    transition: "color 0.15s",
                  }}
                  onMouseEnter={(e) =>
                    ((e.currentTarget as HTMLElement).style.color =
                      "var(--text-primary)")
                  }
                  onMouseLeave={(e) =>
                    ((e.currentTarget as HTMLElement).style.color =
                      "var(--text-muted)")
                  }
                >
                  <X size={15} />
                </button>
              </div>

              {/* Only authors can invite */}
              {isAuthor && (
                <>
                  <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
                    <input
                      className="input"
                      placeholder="Username"
                      value={inviteUsername}
                      onChange={(e) => setInviteUsername(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && inviteUsername.trim())
                          inviteMutation.mutate();
                      }}
                      style={{ flex: 1 }}
                      aria-label="Username to invite"
                    />
                    <select
                      className="input"
                      value={inviteRole}
                      onChange={(e) =>
                        setInviteRole(e.target.value as "VIEWER" | "EDITOR")
                      }
                      style={{ width: "auto" }}
                      aria-label="Collaborator role"
                    >
                      <option value="EDITOR">Editor</option>
                      <option value="VIEWER">Viewer</option>
                    </select>
                  </div>
                  <button
                    className="btn btn-primary"
                    style={{
                      width: "100%",
                      justifyContent: "center",
                      gap: 6,
                      marginBottom: 20,
                    }}
                    onClick={() => inviteMutation.mutate()}
                    disabled={
                      !inviteUsername.trim() || inviteMutation.isPending
                    }
                  >
                    {inviteMutation.isPending ? (
                      <Loader2
                        size={13}
                        style={{ animation: "spin 0.7s linear infinite" }}
                      />
                    ) : (
                      <Plus size={13} />
                    )}
                    Invite
                  </button>
                </>
              )}

              <div
                style={{
                  borderTop: "1px solid var(--border)",
                  paddingTop: 16,
                }}
              >
                {collaborators.length === 0 ? (
                  <p
                    style={{
                      fontSize: 13,
                      color: "var(--text-muted)",
                      fontFamily: "var(--font-body)",
                      textAlign: "center",
                      padding: "16px 0",
                    }}
                  >
                    No collaborators yet
                  </p>
                ) : (
                  collaborators.map((c: any) => (
                    <div
                      key={c.id}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: "10px 0",
                        borderBottom: "1px solid var(--border)",
                      }}
                    >
                      <span
                        style={{
                          fontSize: 14,
                          color: "var(--text-primary)",
                          fontFamily: "var(--font-body)",
                        }}
                      >
                        {c.user.username}
                      </span>
                      <span
                        style={{
                          fontSize: 11,
                          background: "var(--bg-muted)",
                          padding: "3px 8px",
                          borderRadius: 99,
                          color: "var(--text-secondary)",
                          fontFamily: "var(--font-mono)",
                          fontWeight: 600,
                        }}
                      >
                        {c.role}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Global styles */}
      <style>{`
        textarea::placeholder { color: #c4c4c4; font-style: italic; }
        textarea:focus { outline: none; }

        /* FIX: show-mobile visibility controlled by CSS class only —
         * no competing inline display style.
         * Default hidden on all viewports, revealed at mobile breakpoint. */
        .show-mobile { display: none !important; }

        @media (max-width: 768px) {
          .hide-mobile { display: none !important; }
          .show-mobile { display: flex !important; }
        }

        @media (max-width: 480px) {
          textarea { padding: 32px 20px 80px !important; }
        }
      `}</style>
    </div>
  );
}
