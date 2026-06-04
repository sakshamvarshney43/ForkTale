import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import ConfirmModal from "../components/ui/ConfirmModal";
import toast from "react-hot-toast";
import {
  ArrowLeft,
  Users,
  UserPlus,
  Crown,
  Eye,
  Edit3,
  Trash2,
  Loader2,
  GitBranch,
  Globe,
  Lock,
  ChevronDown,
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  storyService,
  collaborateService,
  publishService,
} from "../services/api";
import { useAuth } from "../context/AuthContext";
import type { Collaborator } from "../types";

/*Role badge colors*/
const roleStyle = (role: string) =>
  role === "EDITOR"
    ? {
        color: "var(--accent)",
        bg: "var(--accent-subtle)",
        border: "var(--accent-border)",
      }
    : { color: "#16a34a", bg: "#f0fdf4", border: "#bbf7d0" };

/* Invite Form */

function InviteForm({
  storyId,
  onSuccess,
}: {
  storyId: string;
  onSuccess: () => void;
}) {
  const queryClient = useQueryClient();
  const [username, setUsername] = useState("");
  const [role, setRole] = useState<"VIEWER" | "EDITOR">("EDITOR");
  const [error, setError] = useState("");
  const [showDrop, setShowDrop] = useState(false);

  const inviteMutation = useMutation({
    mutationFn: () => collaborateService.invite(storyId, { username, role }),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["collaborators", storyId],
      });

      await queryClient.invalidateQueries({
        queryKey: ["myCollaborations"],
      });

      await queryClient.invalidateQueries({
        queryKey: ["story", storyId],
      });

      setUsername("");
      setError("");
      onSuccess();
    },

    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Something went wrong");
    },
  });
  return (
    <div
      style={{
        background: "var(--bg)",
        border: "1.5px solid var(--border)",
        borderRadius: 12,
        padding: "20px",
        marginBottom: 24,
        boxShadow: "var(--shadow-sm)",
      }}
    >
      <h3
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          fontSize: 13,
          fontWeight: 600,
          color: "var(--text-primary)",
          marginBottom: 16,
          fontFamily: "var(--font-body)",
        }}
      >
        <UserPlus size={14} style={{ color: "var(--accent)" }} /> Invite
        collaborator
      </h3>

      {error && (
        <div
          className="alert alert-danger"
          style={{ marginBottom: 14, fontSize: 13 }}
        >
          {error}
        </div>
      )}

      <div style={{ display: "flex", gap: 8 }}>
        {/* Username */}
        <div style={{ position: "relative", flex: 1 }}>
          <span
            style={{
              position: "absolute",
              left: 11,
              top: "50%",
              transform: "translateY(-50%)",
              fontSize: 13,
              color: "var(--text-muted)",
              pointerEvents: "none",
            }}
          >
            @
          </span>
          <input
            type="text"
            placeholder="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && username.trim()) inviteMutation.mutate();
            }}
            className="input"
            style={{ paddingLeft: 26, fontSize: 13 }}
          />
        </div>

        {/* Role dropdown */}
        <div style={{ position: "relative" }}>
          <button
            onClick={() => setShowDrop(!showDrop)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "0 12px",
              height: "100%",
              minWidth: 100,
              borderRadius: 8,
              cursor: "pointer",
              background: "var(--bg-subtle)",
              border: "1.5px solid var(--border)",
              fontSize: 13,
              fontFamily: "var(--font-body)",
              fontWeight: 500,
              color: roleStyle(role).color,
              transition: "border-color 0.15s",
            }}
            onMouseEnter={(e) =>
              ((e.currentTarget as HTMLElement).style.borderColor =
                "var(--border-strong)")
            }
            onMouseLeave={(e) => {
              if (!showDrop)
                (e.currentTarget as HTMLElement).style.borderColor =
                  "var(--border)";
            }}
          >
            {role === "EDITOR" ? <Edit3 size={12} /> : <Eye size={12} />}
            {role}
            <ChevronDown
              size={11}
              style={{
                color: "var(--text-muted)",
                transform: showDrop ? "rotate(180deg)" : "rotate(0)",
                transition: "transform 0.15s",
              }}
            />
          </button>
          <AnimatePresence>
            {showDrop && (
              <motion.div
                initial={{ opacity: 0, y: 4, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 4, scale: 0.97 }}
                transition={{ duration: 0.12 }}
                style={{
                  position: "absolute",
                  right: 0,
                  top: "calc(100% + 4px)",
                  width: 180,
                  background: "var(--bg)",
                  border: "1.5px solid var(--border)",
                  borderRadius: 10,
                  boxShadow: "var(--shadow-xl)",
                  padding: 4,
                  zIndex: 20,
                }}
              >
                {(["EDITOR", "VIEWER"] as const).map((r) => (
                  <button
                    key={r}
                    onClick={() => {
                      setRole(r);
                      setShowDrop(false);
                    }}
                    style={{
                      width: "100%",
                      display: "flex",
                      alignItems: "flex-start",
                      gap: 10,
                      padding: "10px 12px",
                      border: "none",
                      cursor: "pointer",
                      borderRadius: 7,
                      fontSize: 13,
                      fontFamily: "var(--font-body)",
                      textAlign: "left",
                      background:
                        role === r ? "var(--bg-muted)" : "transparent",
                      color: "var(--text-primary)",
                      transition: "background 0.12s",
                    }}
                    onMouseEnter={(e) => {
                      if (role !== r)
                        (e.currentTarget as HTMLElement).style.background =
                          "var(--bg-subtle)";
                    }}
                    onMouseLeave={(e) => {
                      if (role !== r)
                        (e.currentTarget as HTMLElement).style.background =
                          "transparent";
                    }}
                  >
                    <span style={{ color: roleStyle(r).color, marginTop: 2 }}>
                      {r === "EDITOR" ? <Edit3 size={13} /> : <Eye size={13} />}
                    </span>
                    <div>
                      <p style={{ fontWeight: 600, marginBottom: 1 }}>{r}</p>
                      <p style={{ fontSize: 11, color: "var(--text-muted)" }}>
                        {r === "EDITOR"
                          ? "Can write & commit"
                          : "Can read only"}
                      </p>
                    </div>
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Submit */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => username.trim() && inviteMutation.mutate()}
          disabled={!username.trim() || inviteMutation.isPending}
          className="btn btn-primary"
          style={{ gap: 6, whiteSpace: "nowrap" }}
        >
          {inviteMutation.isPending ? (
            <Loader2
              size={13}
              style={{ animation: "spin 0.7s linear infinite" }}
            />
          ) : (
            <UserPlus size={13} />
          )}
          Invite
        </motion.button>
      </div>
    </div>
  );
}

/* Collaborator Row */
function CollaboratorRow({
  collaborator,
  storyId,
  isAuthor,
}: {
  collaborator: Collaborator;
  storyId: string;
  isAuthor: boolean;
}) {
  const queryClient = useQueryClient();
  const [showDrop, setShowDrop] = useState(false);
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const rs = roleStyle(collaborator.role);

  const updateRoleMutation = useMutation({
    mutationFn: (role: "VIEWER" | "EDITOR") =>
      collaborateService.updateRole(storyId, collaborator.id, role),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["collaborators", storyId],
      });

      await queryClient.invalidateQueries({
        queryKey: ["story", storyId],
      });

      setShowDrop(false);
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Something went wrong");
    },
  });
  const removeMutation = useMutation({
    mutationFn: () => collaborateService.remove(storyId, collaborator.id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["collaborators", storyId],
      });

      await queryClient.invalidateQueries({
        queryKey: ["story", storyId],
      });

      setShowDrop(false);
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Something went wrong");
    },
  });

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "12px 16px",
          borderRadius: 10,
          background: "var(--bg)",
          border: "1.5px solid var(--border)",
          transition: "border-color 0.15s",
        }}
        onMouseEnter={(e) =>
          ((e.currentTarget as HTMLElement).style.borderColor =
            "var(--border-strong)")
        }
        onMouseLeave={(e) =>
          ((e.currentTarget as HTMLElement).style.borderColor = "var(--border)")
        }
      >
        {/* User */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {collaborator.user.avatar ? (
            <img
              src={collaborator.user.avatar}
              alt={collaborator.user.username}
              style={{
                width: 32,
                height: 32,
                borderRadius: "50%",
                objectFit: "cover",
              }}
            />
          ) : (
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: "50%",
                background: "var(--accent)",
                color: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 13,
                fontWeight: 700,
                fontFamily: "var(--font-body)",
              }}
            >
              {collaborator.user.username[0].toUpperCase()}
            </div>
          )}
          <div>
            <p
              style={{
                fontSize: 14,
                fontWeight: 600,
                color: "var(--text-primary)",
                fontFamily: "var(--font-body)",
              }}
            >
              {collaborator.user.name || collaborator.user.username}
            </p>
            <p
              style={{
                fontSize: 12,
                color: "var(--text-muted)",
                fontFamily: "var(--font-body)",
              }}
            >
              @{collaborator.user.username}
            </p>
          </div>
        </div>

        {/* Role + actions */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {isAuthor ? (
            <div style={{ position: "relative" }}>
              <button
                onClick={() => setShowDrop(!showDrop)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "5px 10px",
                  borderRadius: 7,
                  cursor: "pointer",
                  background: rs.bg,
                  border: `1px solid ${rs.border}`,
                  fontSize: 12,
                  fontWeight: 600,
                  color: rs.color,
                  fontFamily: "var(--font-body)",
                  transition: "opacity 0.15s",
                }}
                onMouseEnter={(e) =>
                  ((e.currentTarget as HTMLElement).style.opacity = "0.75")
                }
                onMouseLeave={(e) =>
                  ((e.currentTarget as HTMLElement).style.opacity = "1")
                }
              >
                {collaborator.role === "EDITOR" ? (
                  <Edit3 size={11} />
                ) : (
                  <Eye size={11} />
                )}
                {collaborator.role}
                <ChevronDown
                  size={10}
                  style={{
                    color: rs.color,
                    transform: showDrop ? "rotate(180deg)" : "rotate(0)",
                    transition: "transform 0.15s",
                  }}
                />
              </button>
              <AnimatePresence>
                {showDrop && (
                  <motion.div
                    initial={{ opacity: 0, y: 4, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 4, scale: 0.97 }}
                    transition={{ duration: 0.12 }}
                    style={{
                      position: "absolute",
                      right: 0,
                      top: "calc(100% + 4px)",
                      width: 160,
                      background: "var(--bg)",
                      border: "1.5px solid var(--border)",
                      borderRadius: 10,
                      boxShadow: "var(--shadow-xl)",
                      padding: 4,
                      zIndex: 20,
                    }}
                  >
                    {(["EDITOR", "VIEWER"] as const).map((r) => (
                      <button
                        key={r}
                        onClick={() => updateRoleMutation.mutate(r)}
                        disabled={updateRoleMutation.isPending}
                        style={{
                          width: "100%",
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                          padding: "9px 10px",
                          border: "none",
                          cursor: "pointer",
                          borderRadius: 7,
                          fontSize: 13,
                          fontFamily: "var(--font-body)",
                          background:
                            collaborator.role === r
                              ? "var(--bg-muted)"
                              : "transparent",
                          color: roleStyle(r).color,
                          fontWeight: 500,
                          transition: "background 0.12s",
                        }}
                        onMouseEnter={(e) => {
                          if (collaborator.role !== r)
                            (e.currentTarget as HTMLElement).style.background =
                              "var(--bg-subtle)";
                        }}
                        onMouseLeave={(e) => {
                          if (collaborator.role !== r)
                            (e.currentTarget as HTMLElement).style.background =
                              "transparent";
                        }}
                      >
                        {r === "EDITOR" ? (
                          <Edit3 size={12} />
                        ) : (
                          <Eye size={12} />
                        )}
                        {r}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 5,
                padding: "5px 10px",
                borderRadius: 7,
                fontSize: 12,
                fontWeight: 600,
                background: rs.bg,
                border: `1px solid ${rs.border}`,
                color: rs.color,
                fontFamily: "var(--font-body)",
              }}
            >
              {collaborator.role === "EDITOR" ? (
                <Edit3 size={11} />
              ) : (
                <Eye size={11} />
              )}
              {collaborator.role}
            </span>
          )}

          {isAuthor && (
            <button
              onClick={() => {
                setShowRemoveModal(true);
              }}
              disabled={removeMutation.isPending}
              style={{
                padding: 6,
                borderRadius: 6,
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "var(--text-muted)",
                display: "flex",
                transition: "all 0.15s",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.color = "#dc2626";
                (e.currentTarget as HTMLElement).style.background = "#fef2f2";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.color =
                  "var(--text-muted)";
                (e.currentTarget as HTMLElement).style.background =
                  "transparent";
              }}
            >
              {removeMutation.isPending ? (
                <Loader2
                  size={13}
                  style={{ animation: "spin 0.7s linear infinite" }}
                />
              ) : (
                <Trash2 size={13} />
              )}
            </button>
          )}
        </div>
      </motion.div>
      <ConfirmModal
        open={showRemoveModal}
        title="Remove Collaborator"
        message="Remove this collaborator from the story?"
        confirmText="Remove"
        loading={removeMutation.isPending}
        onCancel={() => setShowRemoveModal(false)}
        onConfirm={() => {
          removeMutation.mutate();
          setShowRemoveModal(false);
        }}
      />
    </>
  );
}

/* Page */
export default function Collaborate() {
  const { storyId } = useParams<{ storyId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [publishingBranchId, setPublishingBranchId] = useState("");
  const [endingToUnpublish, setEndingToUnpublish] = useState<string | null>(
    null,
  );

  const { data: storyData } = useQuery({
    queryKey: ["story", storyId],
    queryFn: () => storyService.getMyStory(storyId!),
  });
  const { data: collabData, isLoading } = useQuery({
    queryKey: ["collaborators", storyId],
    queryFn: () => collaborateService.getCollaborators(storyId!),
  });
  const { data: endingsData } = useQuery({
    queryKey: ["endings", storyId],
    queryFn: () => publishService.getEndings(storyId!),
  });

  const story = storyData?.data?.story;
  const collaborators: Collaborator[] = collabData?.data?.collaborators || [];
  const endings = endingsData?.data?.endings || [];
  const isAuthor = story?.authorId === user?.id;
  const branches = story?.branches || [];

  const publishMutation = useMutation({
    mutationFn: () => publishService.publish(storyId!, publishingBranchId),
  });
  const unpublishMutation = useMutation({
    mutationFn: (publishingId: string) =>
      publishService.unpublish(storyId!, publishingId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["endings", storyId],
      });

      await queryClient.invalidateQueries({
        queryKey: ["story", storyId],
      });

      await queryClient.invalidateQueries({
        queryKey: ["myStories"],
      });

      await queryClient.invalidateQueries({
        queryKey: ["discover"],
      });
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Something went wrong");
    },
  });

  return (
    <div style={{ background: "var(--bg)", minHeight: "100vh" }}>
      {/* Header */}
      <div style={{ borderBottom: "1px solid var(--border)" }}>
        <div
          style={{ maxWidth: 760, margin: "0 auto", padding: "32px 32px 0" }}
        >
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
              marginBottom: 28,
            }}
          >
            <button
              onClick={() => navigate(-1)}
              className="btn btn-secondary btn-sm"
              style={{ padding: "7px 10px" }}
            >
              <ArrowLeft size={14} />
            </button>
            <div>
              <p
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "var(--accent)",
                  marginBottom: 3,
                  fontFamily: "var(--font-body)",
                }}
              >
                Collaborate
              </p>
              <h1
                style={{
                  fontSize: "clamp(18px,2.5vw,26px)",
                  fontWeight: 400,
                  fontStyle: "italic",
                  letterSpacing: "-0.03em",
                  color: "var(--text-primary)",
                  fontFamily: "var(--font-display)",
                  lineHeight: 1,
                }}
              >
                {story?.title}
              </h1>
            </div>
          </motion.div>
        </div>
      </div>

      <div
        style={{ maxWidth: 760, margin: "0 auto", padding: "28px 32px 80px" }}
      >
        {/* Invite */}
        {isAuthor && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
          >
            <InviteForm storyId={storyId!} onSuccess={() => {}} />
          </motion.div>
        )}

        {/* Collaborators */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          style={{ marginBottom: 36 }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginBottom: 14,
            }}
          >
            <Users size={14} style={{ color: "var(--accent)" }} />
            <h2
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: "var(--text-primary)",
                fontFamily: "var(--font-body)",
              }}
            >
              Collaborators
            </h2>
            <span className="badge badge-default">{collaborators.length}</span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {/* Author row */}
            {story && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "12px 16px",
                  borderRadius: 10,
                  background: "var(--bg-subtle)",
                  border: "1.5px solid var(--border)",
                }}
              >
                {story.author?.avatar ? (
                  <img
                    src={story.author.avatar}
                    alt={story.author.username}
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: "50%",
                      objectFit: "cover",
                    }}
                  />
                ) : (
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: "50%",
                      background: "var(--text-primary)",
                      color: "white",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 13,
                      fontWeight: 700,
                      fontFamily: "var(--font-body)",
                    }}
                  >
                    {story.author?.username?.[0]?.toUpperCase()}
                  </div>
                )}
                <div style={{ flex: 1 }}>
                  <p
                    style={{
                      fontSize: 14,
                      fontWeight: 600,
                      color: "var(--text-primary)",
                      fontFamily: "var(--font-body)",
                    }}
                  >
                    {story.author?.name || story.author?.username}
                  </p>
                  <p
                    style={{
                      fontSize: 12,
                      color: "var(--text-muted)",
                      fontFamily: "var(--font-body)",
                    }}
                  >
                    @{story.author?.username}
                  </p>
                </div>
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 5,
                    padding: "4px 10px",
                    borderRadius: 7,
                    fontSize: 12,
                    fontWeight: 600,
                    background: "var(--bg-muted)",
                    border: "1px solid var(--border)",
                    color: "var(--text-secondary)",
                    fontFamily: "var(--font-body)",
                  }}
                >
                  <Crown size={11} /> Author
                </span>
              </div>
            )}

            {isLoading ? (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  padding: "32px 0",
                }}
              >
                <Loader2
                  size={18}
                  style={{
                    color: "var(--text-muted)",
                    animation: "spin 0.7s linear infinite",
                  }}
                />
              </div>
            ) : collaborators.length === 0 ? (
              <div
                style={{
                  textAlign: "center",
                  padding: "32px",
                  borderRadius: 10,
                  background: "var(--bg-subtle)",
                  border: "1.5px solid var(--border)",
                }}
              >
                <Users
                  size={22}
                  style={{ color: "var(--text-muted)", margin: "0 auto 8px" }}
                />
                <p
                  style={{
                    fontSize: 13,
                    color: "var(--text-muted)",
                    fontFamily: "var(--font-body)",
                  }}
                >
                  No collaborators yet
                </p>
              </div>
            ) : (
              collaborators.map((c) => (
                <CollaboratorRow
                  key={c.id}
                  collaborator={c}
                  storyId={storyId!}
                  isAuthor={isAuthor}
                />
              ))
            )}
          </div>
        </motion.div>

        {/* Publish endings */}
        {isAuthor && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.15 }}
          >
            <div
              style={{
                height: 1,
                background: "var(--border)",
                marginBottom: 28,
              }}
            />

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                marginBottom: 16,
              }}
            >
              <GitBranch size={14} style={{ color: "var(--accent)" }} />
              <h2
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: "var(--text-primary)",
                  fontFamily: "var(--font-body)",
                }}
              >
                Publish endings
              </h2>
            </div>

            {/* Publish selector */}
            <div
              style={{
                background: "var(--bg)",
                border: "1.5px solid var(--border)",
                borderRadius: 12,
                padding: "20px",
                marginBottom: 16,
                boxShadow: "var(--shadow-sm)",
              }}
            >
              <p
                style={{
                  fontSize: 13,
                  color: "var(--text-secondary)",
                  marginBottom: 14,
                  fontFamily: "var(--font-body)",
                }}
              >
                Publish a branch as a story ending visible to all readers
              </p>
              <div style={{ display: "flex", gap: 8 }}>
                <select
                  value={publishingBranchId}
                  onChange={(e) => setPublishingBranchId(e.target.value)}
                  className="input"
                  style={{ flex: 1, fontSize: 13, cursor: "pointer" }}
                >
                  <option value="">Select a branch...</option>
                  {branches.map((b: any) => (
                    <option key={b.id} value={b.id}>
                      {b.name}
                      {b.isDefault ? " (default)" : ""}
                    </option>
                  ))}
                </select>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => publishMutation.mutate()}
                  disabled={!publishingBranchId || publishMutation.isPending}
                  className="btn btn-primary"
                  style={{ gap: 6, whiteSpace: "nowrap" }}
                >
                  {publishMutation.isPending ? (
                    <Loader2
                      size={13}
                      style={{ animation: "spin 0.7s linear infinite" }}
                    />
                  ) : (
                    <Globe size={13} />
                  )}
                  Publish
                </motion.button>
              </div>
              {publishMutation.isError && (
                <p
                  style={{
                    marginTop: 10,
                    fontSize: 12,
                    color: "#dc2626",
                    fontFamily: "var(--font-body)",
                  }}
                >
                  {(publishMutation.error as any)?.response?.data?.message ||
                    "Could not publish."}
                </p>
              )}
            </div>

            {/* Published list */}
            {endings.length > 0 && (
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {endings.map((ending: any) => (
                  <div
                    key={ending.id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "12px 16px",
                      borderRadius: 10,
                      background: "#f0fdf4",
                      border: "1px solid #bbf7d0",
                    }}
                  >
                    <div
                      style={{ display: "flex", alignItems: "center", gap: 10 }}
                    >
                      <Globe size={13} style={{ color: "#16a34a" }} />
                      <span
                        style={{
                          fontSize: 14,
                          fontWeight: 600,
                          color: "var(--text-primary)",
                          fontFamily: "var(--font-body)",
                        }}
                      >
                        {ending.branch?.name}
                      </span>
                      <span
                        style={{
                          fontSize: 11,
                          fontWeight: 600,
                          padding: "2px 8px",
                          borderRadius: 99,
                          background: "#dcfce7",
                          border: "1px solid #bbf7d0",
                          color: "#16a34a",
                          fontFamily: "var(--font-body)",
                        }}
                      >
                        Published
                      </span>
                    </div>
                    <button
                      onClick={() => {
                        setEndingToUnpublish(ending.id);
                      }}
                      disabled={unpublishMutation.isPending}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 5,
                        padding: "6px 12px",
                        borderRadius: 7,
                        background: "transparent",
                        border: "1px solid #fecaca",
                        color: "#dc2626",
                        fontSize: 12,
                        fontFamily: "var(--font-body)",
                        cursor: "pointer",
                        transition: "background 0.15s",
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
                      <Lock size={11} /> Unpublish
                    </button>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </div>
      <ConfirmModal
        open={!!endingToUnpublish}
        title="Unpublish Ending"
        message="This ending will no longer appear publicly."
        confirmText="Unpublish"
        loading={unpublishMutation.isPending}
        onCancel={() => setEndingToUnpublish(null)}
        onConfirm={() => {
          if (endingToUnpublish) {
            unpublishMutation.mutate(endingToUnpublish);
          }
          setEndingToUnpublish(null);
        }}
      />
    </div>
  );
}
