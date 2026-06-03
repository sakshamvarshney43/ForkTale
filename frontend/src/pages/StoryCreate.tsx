import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, BookOpen, Tag, X, Loader2, GitBranch } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { storyService } from "../services/api";
import { useQueryClient } from "@tanstack/react-query";

const schema = z.object({
  title: z.string().min(1, "Title is required").max(100),
  description: z.string().max(500).optional(),
  genre: z.string().optional(),
});
type Form = z.infer<typeof schema>;

const genres = [
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

export default function StoryCreate() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<Form>({ resolver: zodResolver(schema) });
  const selectedGenre = watch("genre");

  const addTag = () => {
    const t = tagInput.trim().toLowerCase();
    if (t && !tags.includes(t) && tags.length < 5) {
      setTags([...tags, t]);
      setTagInput("");
    }
  };
  const removeTag = (tag: string) => setTags(tags.filter((t) => t !== tag));
  const handleTagKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag();
    }
  };

  const onSubmit = async (data: Form) => {
    try {
      setLoading(true);
      setError("");
      const res = await storyService.create({ ...data, tags });
      const story = res.data.story;
      await queryClient.invalidateQueries({
        queryKey: ["myStories"],
      });
      const branch = story.branches?.[0];
      if (branch) navigate(`/stories/${story.id}/branches/${branch.id}`);
      else navigate("/dashboard");
    } catch (err: any) {
      setError(err.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ background: "var(--bg)", minHeight: "100vh" }}>
      <div
        style={{ maxWidth: 680, margin: "0 auto", padding: "40px 32px 80px" }}
      >
        {/* Back + heading */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            marginBottom: 40,
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
            <h1
              style={{
                fontSize: 22,
                fontWeight: 400,
                fontStyle: "italic",
                letterSpacing: "-0.03em",
                color: "var(--text-primary)",
                fontFamily: "var(--font-display)",
                lineHeight: 1,
              }}
            >
              New story
            </h1>
            <p
              style={{
                fontSize: 13,
                color: "var(--text-muted)",
                marginTop: 3,
                fontFamily: "var(--font-body)",
              }}
            >
              A main branch is created automatically
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
        >
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="alert alert-danger"
              style={{ marginBottom: 24 }}
            >
              {error}
            </motion.div>
          )}

          <form
            onSubmit={handleSubmit(onSubmit)}
            style={{ display: "flex", flexDirection: "column", gap: 24 }}
          >
            {/* Title */}
            <div>
              <label className="label">
                Title <span style={{ color: "var(--danger)" }}>*</span>
              </label>
              <input
                {...register("title")}
                type="text"
                placeholder="The Lost Kingdom"
                className={`input ${errors.title ? "input-error" : ""}`}
                style={{ fontSize: 15 }}
              />
              {errors.title && (
                <p className="field-error">{errors.title.message}</p>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="label">
                Description{" "}
                <span style={{ color: "var(--text-muted)", fontWeight: 400 }}>
                  — optional
                </span>
              </label>
              <textarea
                {...register("description")}
                rows={3}
                placeholder="A short synopsis of your story..."
                className="input"
                style={{ resize: "none", lineHeight: 1.6, fontSize: 14 }}
              />
            </div>

            {/* Genre */}
            <div>
              <label className="label">
                Genre{" "}
                <span style={{ color: "var(--text-muted)", fontWeight: 400 }}>
                  — optional
                </span>
              </label>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {genres.map((g) => (
                  <button
                    key={g}
                    type="button"
                    onClick={() =>
                      setValue("genre", selectedGenre === g ? "" : g)
                    }
                    style={{
                      padding: "6px 14px",
                      borderRadius: 99,
                      fontSize: 13,
                      fontFamily: "var(--font-body)",
                      fontWeight: 500,
                      cursor: "pointer",
                      border: "1.5px solid",
                      transition: "all 0.15s",
                      background:
                        selectedGenre === g
                          ? "var(--text-primary)"
                          : "transparent",
                      borderColor:
                        selectedGenre === g
                          ? "var(--text-primary)"
                          : "var(--border-strong)",
                      color:
                        selectedGenre === g ? "white" : "var(--text-secondary)",
                    }}
                    onMouseEnter={(e) => {
                      if (selectedGenre !== g) {
                        (e.currentTarget as HTMLElement).style.borderColor =
                          "var(--text-primary)";
                        (e.currentTarget as HTMLElement).style.color =
                          "var(--text-primary)";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (selectedGenre !== g) {
                        (e.currentTarget as HTMLElement).style.borderColor =
                          "var(--border-strong)";
                        (e.currentTarget as HTMLElement).style.color =
                          "var(--text-secondary)";
                      }
                    }}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>

            {/* Tags */}
            <div>
              <label className="label">
                Tags{" "}
                <span style={{ color: "var(--text-muted)", fontWeight: 400 }}>
                  — up to 5
                </span>
              </label>
              {tags.length > 0 && (
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 6,
                    marginBottom: 10,
                  }}
                >
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 5,
                        padding: "4px 10px",
                        borderRadius: 99,
                        background: "var(--bg-muted)",
                        border: "1px solid var(--border-strong)",
                        fontSize: 12,
                        color: "var(--text-secondary)",
                        fontFamily: "var(--font-body)",
                      }}
                    >
                      <Tag size={9} style={{ color: "var(--text-muted)" }} />
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        style={{
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          color: "var(--text-muted)",
                          display: "flex",
                          padding: 0,
                          marginLeft: 2,
                        }}
                        onMouseEnter={(e) =>
                          ((e.currentTarget as HTMLElement).style.color =
                            "var(--danger)")
                        }
                        onMouseLeave={(e) =>
                          ((e.currentTarget as HTMLElement).style.color =
                            "var(--text-muted)")
                        }
                      >
                        <X size={11} />
                      </button>
                    </span>
                  ))}
                </div>
              )}
              <div style={{ display: "flex", gap: 8 }}>
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleTagKey}
                  placeholder="Type a tag and press Enter..."
                  disabled={tags.length >= 5}
                  className="input"
                  style={{ flex: 1, fontSize: 13 }}
                />
                <button
                  type="button"
                  onClick={addTag}
                  disabled={!tagInput.trim() || tags.length >= 5}
                  className="btn btn-secondary"
                  style={{ flexShrink: 0, fontSize: 13 }}
                >
                  Add
                </button>
              </div>
            </div>

            {/* Info box */}
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: 12,
                padding: "14px 16px",
                borderRadius: 10,
                background: "var(--accent-subtle)",
                border: "1px solid var(--accent-border)",
              }}
            >
              <GitBranch
                size={15}
                style={{ color: "var(--accent)", flexShrink: 0, marginTop: 1 }}
              />
              <p
                style={{
                  fontSize: 13,
                  color: "var(--accent)",
                  lineHeight: 1.6,
                  fontFamily: "var(--font-body)",
                }}
              >
                A <strong>main</strong> branch will be created automatically.
                You can add more branches from the editor.
              </p>
            </div>

            {/* Actions */}
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: 10,
                paddingTop: 8,
                borderTop: "1px solid var(--border)",
              }}
            >
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="btn btn-ghost"
                style={{ fontSize: 14 }}
              >
                Cancel
              </button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="btn btn-primary"
                style={{
                  fontSize: 14,
                  minWidth: 130,
                  justifyContent: "center",
                }}
              >
                {loading ? (
                  <>
                    <Loader2
                      size={14}
                      style={{ animation: "spin 0.7s linear infinite" }}
                    />{" "}
                    Creating...
                  </>
                ) : (
                  <>
                    <BookOpen size={14} /> Create story
                  </>
                )}
              </motion.button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
