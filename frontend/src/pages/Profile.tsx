import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  BookOpen,
  Globe,
  Edit2,
  Camera,
  Save,
  Loader2,
  User,
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { userServices } from "../services/api";
import { useAuth } from "../context/AuthContext";
import type { Story } from "../types";
import toast from "react-hot-toast";

interface MutationResponse {
  data: { user: any };
}

function ProfileStoryCard({ story }: { story: Story }) {
  const navigate = useNavigate();
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      onClick={() => navigate(`/stories/${story.id}/read`)}
      className="card card-hover"
      style={{ overflow: "hidden", cursor: "pointer" }}
    >
      <div
        style={{
          width: "100%",
          height: 120,
          background: "var(--bg-muted)",
          overflow: "hidden",
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
            <BookOpen size={20} style={{ color: "var(--border-strong)" }} />
          </div>
        )}
      </div>
      <div style={{ padding: "14px 16px" }}>
        <h3
          style={{
            fontSize: 14,
            fontWeight: 600,
            color: "var(--text-primary)",
            letterSpacing: "-0.01em",
            marginBottom: 5,
            fontFamily: "var(--font-body)",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {story.title}
        </h3>
        {story.description && (
          <p
            style={{
              fontSize: 13,
              color: "var(--text-muted)",
              lineHeight: 1.5,
              marginBottom: 10,
              fontFamily: "var(--font-body)",
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
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            paddingTop: 10,
            borderTop: "1px solid var(--border)",
          }}
        >
          {story.genre && (
            <span className="badge badge-default" style={{ fontSize: 11 }}>
              {story.genre}
            </span>
          )}
          <span
            style={{
              display: "flex",
              alignItems: "center",
              gap: 4,
              fontSize: 12,
              color: "var(--text-muted)",
              marginLeft: "auto",
              fontFamily: "var(--font-body)",
            }}
          >
            <Globe size={11} />
            {story.wordCount}w
          </span>
        </div>
      </div>
    </motion.div>
  );
}

function EditProfileForm({
  user,
  onClose,
}: {
  user: any;
  onClose: () => void;
}) {
  const { updateUser } = useAuth();
  const queryClient = useQueryClient();
  const [name, setName] = useState(user.name || "");
  const [bio, setBio] = useState(user.bio || "");
  const [username, setUsername] = useState(user.username || "");
  const [error, setError] = useState("");

  const updateMutation = useMutation<MutationResponse, any, void>({
    mutationFn: () => userServices.updateProfile({ name, bio, username }),
    onSuccess: (res) => {
      updateUser(res.data.user);
      queryClient.invalidateQueries({ queryKey: ["profile", username] });
      onClose();
    },
    onError: (err: any) =>
      setError(err.response?.data?.message || "Something went wrong."),
  });

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
        background: "rgba(0,0,0,0.4)",
      }}
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
          borderRadius: 16,
          padding: 28,
          boxShadow: "var(--shadow-xl)",
        }}
      >
        <h3
          style={{
            fontSize: 17,
            fontWeight: 600,
            color: "var(--text-primary)",
            marginBottom: 20,
            fontFamily: "var(--font-body)",
            letterSpacing: "-0.01em",
          }}
        >
          Edit profile
        </h3>

        {error && (
          <div
            className="alert alert-danger"
            style={{ marginBottom: 16, fontSize: 13 }}
          >
            {error}
          </div>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div>
            <label className="label">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input"
            />
          </div>
          <div>
            <label className="label">Username</label>
            <div style={{ position: "relative" }}>
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
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="input"
                style={{ paddingLeft: 26 }}
              />
            </div>
          </div>
          <div>
            <label className="label">Bio</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={3}
              maxLength={200}
              placeholder="Tell the world about yourself..."
              className="input"
              style={{ resize: "none", lineHeight: 1.6 }}
            />
            <p
              style={{
                fontSize: 11,
                color: "var(--text-muted)",
                textAlign: "right",
                marginTop: 4,
                fontFamily: "var(--font-body)",
              }}
            >
              {bio.length}/200
            </p>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: 8,
            marginTop: 24,
          }}
        >
          <button onClick={onClose} className="btn btn-ghost">
            Cancel
          </button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => updateMutation.mutate()}
            disabled={updateMutation.isPending}
            className="btn btn-primary"
            style={{ gap: 6 }}
          >
            {updateMutation.isPending ? (
              <Loader2
                size={13}
                style={{ animation: "spin 0.7s linear infinite" }}
              />
            ) : (
              <Save size={13} />
            )}
            Save changes
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function Profile() {
  const { username } = useParams<{ username: string }>();
  const navigate = useNavigate();
  const { user: authUser, updateUser } = useAuth();
  const queryClient = useQueryClient();
  const [showEdit, setShowEdit] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const isOwnProfile = authUser?.username === username;

  const { data, isLoading } = useQuery({
    queryKey: ["profile", username],
    queryFn: () => userServices.getPublicProfile(username!),
    enabled: !!username,
  });

  const profile = data?.data?.user;
  const stories: Story[] = profile?.stories || [];

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setUploadingAvatar(true);
      const res = await userServices.updateAvatar(file);
      updateUser(res.data.user);
      queryClient.invalidateQueries({ queryKey: ["profile", username] });
    } catch {
      toast.error("Failed to upload avatar.");
    } finally {
      setUploadingAvatar(false);
    }
  };

  if (isLoading)
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

  if (!profile)
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
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              width: 56,
              height: 56,
              background: "var(--bg-muted)",
              borderRadius: 14,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 14px",
            }}
          >
            <User size={24} style={{ color: "var(--text-muted)" }} />
          </div>
          <p
            style={{
              fontSize: 14,
              color: "var(--text-secondary)",
              fontFamily: "var(--font-body)",
            }}
          >
            User not found.
          </p>
        </div>
      </div>
    );

  return (
    <div style={{ background: "var(--bg)", minHeight: "100vh" }}>
      {/* Profile header band */}
      <div
        style={{
          borderBottom: "1px solid var(--border)",
          background: "var(--bg)",
        }}
      >
        <div
          style={{
            maxWidth: 1000,
            margin: "0 auto",
            padding: "32px 32px 36px",
          }}
        >
          {/* Back */}
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={() => navigate(-1)}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              marginBottom: 24,
              fontSize: 13,
              color: "var(--text-muted)",
              background: "none",
              border: "none",
              cursor: "pointer",
              fontFamily: "var(--font-body)",
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
            <ArrowLeft size={14} /> Back
          </motion.button>

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ display: "flex", alignItems: "flex-start", gap: 24 }}
          >
            {/* Avatar */}
            <div style={{ position: "relative", flexShrink: 0 }}>
              {profile.avatar ? (
                <img
                  src={profile.avatar}
                  alt={profile.username}
                  style={{
                    width: 72,
                    height: 72,
                    borderRadius: "50%",
                    objectFit: "cover",
                    border: "3px solid var(--bg)",
                    boxShadow: "var(--shadow-md)",
                  }}
                />
              ) : (
                <div
                  style={{
                    width: 72,
                    height: 72,
                    borderRadius: "50%",
                    background: "var(--accent)",
                    color: "white",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 24,
                    fontWeight: 700,
                    fontFamily: "var(--font-body)",
                    border: "3px solid var(--bg)",
                    boxShadow: "var(--shadow-md)",
                  }}
                >
                  {profile.username?.[0]?.toUpperCase() || "?"}
                </div>
              )}
              {isOwnProfile && (
                <label
                  htmlFor="avatar-input"
                  style={{
                    position: "absolute",
                    bottom: -2,
                    right: -2,
                    width: 26,
                    height: 26,
                    borderRadius: "50%",
                    background: "var(--bg)",
                    border: "1.5px solid var(--border)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    color: "var(--text-secondary)",
                    transition: "all 0.15s",
                    boxShadow: "var(--shadow-sm)",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.background =
                      "var(--text-primary)";
                    (e.currentTarget as HTMLElement).style.color = "white";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.background =
                      "var(--bg)";
                    (e.currentTarget as HTMLElement).style.color =
                      "var(--text-secondary)";
                  }}
                >
                  {uploadingAvatar ? (
                    <Loader2
                      size={11}
                      style={{ animation: "spin 0.7s linear infinite" }}
                    />
                  ) : (
                    <Camera size={11} />
                  )}
                  <input
                    id="avatar-input"
                    type="file"
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={handleAvatarChange}
                  />
                </label>
              )}
            </div>

            {/* Info */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  justifyContent: "space-between",
                  gap: 16,
                }}
              >
                <div>
                  <h1
                    style={{
                      fontSize: "clamp(20px,2.5vw,28px)",
                      fontWeight: 400,
                      fontStyle: "italic",
                      letterSpacing: "-0.03em",
                      color: "var(--text-primary)",
                      fontFamily: "var(--font-display)",
                      lineHeight: 1.1,
                      marginBottom: 4,
                    }}
                  >
                    {profile.name || profile.username}
                  </h1>
                  <p
                    style={{
                      fontSize: 13,
                      color: "var(--text-muted)",
                      marginBottom: 10,
                      fontFamily: "var(--font-body)",
                    }}
                  >
                    @{profile.username}
                  </p>
                  {profile.bio && (
                    <p
                      style={{
                        fontSize: 14,
                        color: "var(--text-secondary)",
                        lineHeight: 1.65,
                        maxWidth: 480,
                        marginBottom: 16,
                        fontFamily: "var(--font-body)",
                      }}
                    >
                      {profile.bio}
                    </p>
                  )}
                  {/* Stats */}
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 24 }}
                  >
                    {[
                      { val: profile._count?.stories || 0, label: "stories" },
                      {
                        val: profile._count?.collaborations || 0,
                        label: "collaborations",
                      },
                    ].map((s) => (
                      <div key={s.label}>
                        <span
                          style={{
                            fontSize: 16,
                            fontWeight: 700,
                            color: "var(--text-primary)",
                            fontFamily: "var(--font-body)",
                          }}
                        >
                          {s.val}
                        </span>
                        <span
                          style={{
                            fontSize: 13,
                            color: "var(--text-muted)",
                            marginLeft: 5,
                            fontFamily: "var(--font-body)",
                          }}
                        >
                          {s.label}
                        </span>
                      </div>
                    ))}
                    <span
                      style={{
                        fontSize: 13,
                        color: "var(--text-muted)",
                        fontFamily: "var(--font-body)",
                      }}
                    >
                      Joined{" "}
                      {profile.createdAt
                        ? new Date(profile.createdAt).toLocaleDateString(
                            "en-US",
                            { month: "short", year: "numeric" },
                          )
                        : ""}
                    </span>
                  </div>
                </div>

                {isOwnProfile && (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowEdit(true)}
                    className="btn btn-secondary btn-sm"
                    style={{ gap: 6, flexShrink: 0 }}
                  >
                    <Edit2 size={13} /> Edit profile
                  </motion.button>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Stories */}
      <div
        style={{ maxWidth: 1000, margin: "0 auto", padding: "36px 32px 80px" }}
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              marginBottom: 24,
            }}
          >
            <h2
              style={{
                fontSize: 16,
                fontWeight: 600,
                color: "var(--text-primary)",
                fontFamily: "var(--font-body)",
              }}
            >
              Published stories
            </h2>
            <span className="badge badge-default">{stories.length}</span>
          </div>

          {stories.length === 0 ? (
            <div style={{ textAlign: "center", padding: "72px 0" }}>
              <div
                style={{
                  width: 52,
                  height: 52,
                  background: "var(--bg-muted)",
                  borderRadius: 14,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 14px",
                }}
              >
                <BookOpen size={22} style={{ color: "var(--text-muted)" }} />
              </div>
              <p
                style={{
                  fontSize: 14,
                  color: "var(--text-secondary)",
                  fontFamily: "var(--font-body)",
                }}
              >
                {isOwnProfile
                  ? "You have no published stories yet"
                  : "No published stories yet"}
              </p>
            </div>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
                gap: 20,
              }}
            >
              {stories.map((story) => (
                <ProfileStoryCard key={story.id} story={story} />
              ))}
            </div>
          )}
        </motion.div>
      </div>

      <AnimatePresence>
        {showEdit && (
          <EditProfileForm user={profile} onClose={() => setShowEdit(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}
