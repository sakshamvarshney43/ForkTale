import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Save,
  Tag,
  X,
  ImagePlus,
  Loader2,
  Trash2,
  Globe,
  Lock,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { storyService } from "../services/api";
import { upload } from "../config/cloudinary";

// Validation

const schema = z.object({
  title: z.string().min(1, "Title is required").max(100),
  description: z.string().max(500).optional(),
  genre: z.string().optional(),
  isPublished: z.boolean().optional(),
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
];

// Page
export default function StoryEdit() {
  const { storyId } = useParams<{ storyId: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [error, setError] = useState("");
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [uploadingCover, setUploadingCover] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isDirty },
  } = useForm<Form>({ resolver: zodResolver(schema) });

  const selectedGenre = watch("genre");
  const isPublished = watch("isPublished");

  // Fetch story
  const { data, isLoading } = useQuery({
    queryKey: ["story", storyId],
    queryFn: () => storyService.getMyStory(storyId!),
  });

  const story = data?.data?.story;

  // Populate form
  useEffect(() => {
    if (story) {
      reset({
        title: story.title,
        description: story.description || "",
        genre: story.genre || "",
        isPublished: story.isPublished,
      });
      setTags(story.tags || []);
      setCoverPreview(story.coverImage || null);
    }
  }, [story, reset]);

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: (data: Form) =>
      storyService.updateStory(storyId!, { ...data, tags }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["story", storyId] });
      queryClient.invalidateQueries({ queryKey: ["myStories"] });
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: () => storyService.deleteStory(storyId!),
    onSuccess: () => navigate("/dashboard"),
  });

  // Tag helpers
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

  //Cover upload
  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setCoverFile(file);
    setCoverPreview(URL.createObjectURL(file));
  };

  // Submit
  const onSubmit = async (data: Form) => {
    try {
      setError("");

      // Upload cover if changed
      if (coverFile) {
        setUploadingCover(true);
        await storyService.uploadCover(storyId!, coverFile);
        setUploadingCover(false);
        setCoverFile(null);
      }

      await updateMutation.mutateAsync(data);
    } catch (err: any) {
      setError(err.response?.data?.message || "Something went wrong.");
      setUploadingCover(false);
    }
  };

  const isSaving = updateMutation.isPending || uploadingCover;
  const isSaved = updateMutation.isSuccess && !isDirty;

  //Loading
  if (isLoading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: "#08090a" }}
      >
        <Loader2
          size={20}
          className="animate-spin"
          style={{ color: "#8a8f98" }}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 py-8" style={{ background: "#08090a" }}>
      <div className="max-w-2xl mx-auto">
        {/*Header*/}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div className="flex items-center gap-3">
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
                Edit story
              </h1>
              <p style={{ color: "#62666d", fontSize: "12px" }}>
                {story?.title}
              </p>
            </div>
          </div>

          {/* Delete */}
          <button
            onClick={() => {
              if (confirm("Delete this story? This cannot be undone.")) {
                deleteMutation.mutate();
              }
            }}
            disabled={deleteMutation.isPending}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs transition-colors duration-150"
            style={{
              background: "transparent",
              border: "1px solid rgba(235, 87, 87, 0.2)",
              color: "#eb5757",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.background =
                "rgba(235, 87, 87, 0.08)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.background = "transparent";
            }}
          >
            <Trash2 size={12} />
            Delete
          </button>
        </motion.div>

        {/* Form*/}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="rounded-md p-6"
          style={{
            background: "#0f1011",
            border: "1px solid #23252a",
            boxShadow:
              "rgba(255, 255, 255, 0.03) 0px 0px 0px 1px inset, rgba(0, 0, 0, 0.6) 0px 0px 0px 1px",
          }}
        >
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-5 px-3 py-2.5 rounded text-xs"
              style={{
                background: "rgba(235, 87, 87, 0.08)",
                border: "1px solid rgba(235, 87, 87, 0.2)",
                color: "#eb5757",
              }}
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Cover Image */}
            <div>
              <label
                className="block mb-2 text-xs font-medium"
                style={{ color: "#8a8f98" }}
              >
                Cover image
              </label>
              <div
                className="relative w-full h-40 rounded overflow-hidden cursor-pointer group"
                style={{ border: "1px solid #23252a" }}
                onClick={() => document.getElementById("cover-input")?.click()}
              >
                {coverPreview ? (
                  <>
                    <img
                      src={coverPreview}
                      alt="Cover"
                      className="w-full h-full object-cover"
                    />
                    <div
                      className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-150"
                      style={{ background: "rgba(8, 9, 10, 0.7)" }}
                    >
                      <div
                        className="flex items-center gap-2 text-xs"
                        style={{ color: "#f7f8f8" }}
                      >
                        <ImagePlus size={14} />
                        Change cover
                      </div>
                    </div>
                  </>
                ) : (
                  <div
                    className="w-full h-full flex flex-col items-center justify-center gap-2 transition-colors duration-150"
                    style={{ background: "#161718" }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background = "#23252a")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background = "#161718")
                    }
                  >
                    <ImagePlus size={20} style={{ color: "#383b3f" }} />
                    <span style={{ color: "#62666d", fontSize: "12px" }}>
                      Click to upload cover
                    </span>
                  </div>
                )}
                <input
                  id="cover-input"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleCoverChange}
                />
              </div>
            </div>

            {/* Publish toggle */}
            <div
              className="flex items-center justify-between px-3 py-2.5 rounded"
              style={{ background: "#161718", border: "1px solid #23252a" }}
            >
              <div className="flex items-center gap-2">
                {isPublished ? (
                  <Globe size={13} style={{ color: "#5fed83" }} />
                ) : (
                  <Lock size={13} style={{ color: "#62666d" }} />
                )}
                <div>
                  <p
                    className="text-xs font-medium"
                    style={{ color: "#d0d6e0" }}
                  >
                    {isPublished ? "Published" : "Draft"}
                  </p>
                  <p style={{ color: "#62666d", fontSize: "11px" }}>
                    {isPublished
                      ? "Visible to everyone"
                      : "Only visible to you and collaborators"}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() =>
                  setValue("isPublished", !isPublished, { shouldDirty: true })
                }
                className="relative w-9 h-5 rounded-full transition-colors duration-200"
                style={{
                  background: isPublished
                    ? "rgba(95, 237, 131, 0.3)"
                    : "#23252a",
                  border: isPublished
                    ? "1px solid rgba(95, 237, 131, 0.4)"
                    : "1px solid #383b3f",
                }}
              >
                <span
                  className="absolute top-0.5 w-4 h-4 rounded-full transition-all duration-200"
                  style={{
                    background: isPublished ? "#5fed83" : "#383b3f",
                    left: isPublished ? "17px" : "1px",
                  }}
                />
              </button>
            </div>

            {/* Title */}
            <div>
              <label
                className="block mb-1.5 text-xs font-medium"
                style={{ color: "#8a8f98" }}
              >
                Title <span style={{ color: "#eb5757" }}>*</span>
              </label>
              <input
                {...register("title")}
                type="text"
                className="input"
                style={{ fontSize: "14px" }}
              />
              {errors.title && (
                <p className="mt-1 text-xs" style={{ color: "#eb5757" }}>
                  {errors.title.message}
                </p>
              )}
            </div>

            {/* Description */}
            <div>
              <label
                className="block mb-1.5 text-xs font-medium"
                style={{ color: "#8a8f98" }}
              >
                Description
              </label>
              <textarea
                {...register("description")}
                rows={3}
                className="input resize-none"
                style={{ fontSize: "13px", lineHeight: "1.5" }}
              />
            </div>

            {/* Genre */}
            <div>
              <label
                className="block mb-2 text-xs font-medium"
                style={{ color: "#8a8f98" }}
              >
                Genre
              </label>
              <div className="flex flex-wrap gap-1.5">
                {genres.map((g) => (
                  <button
                    key={g}
                    type="button"
                    onClick={() =>
                      setValue("genre", selectedGenre === g ? "" : g, {
                        shouldDirty: true,
                      })
                    }
                    className="px-2.5 py-1 rounded text-xs transition-all duration-150"
                    style={
                      selectedGenre === g
                        ? {
                            background: "rgba(141, 214, 255, 0.1)",
                            border: "1px solid rgba(141, 214, 255, 0.25)",
                            color: "#8dd6ff",
                          }
                        : {
                            background: "transparent",
                            border: "1px solid #23252a",
                            color: "#8a8f98",
                          }
                    }
                    onMouseEnter={(e) => {
                      if (selectedGenre !== g) {
                        (e.currentTarget as HTMLElement).style.borderColor =
                          "#383b3f";
                        (e.currentTarget as HTMLElement).style.color =
                          "#f7f8f8";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (selectedGenre !== g) {
                        (e.currentTarget as HTMLElement).style.borderColor =
                          "#23252a";
                        (e.currentTarget as HTMLElement).style.color =
                          "#8a8f98";
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
              <label
                className="block mb-1.5 text-xs font-medium"
                style={{ color: "#8a8f98" }}
              >
                Tags
                <span
                  className="ml-1.5"
                  style={{ color: "#62666d", fontWeight: 400 }}
                >
                  up to 5
                </span>
              </label>

              {tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs"
                      style={{
                        background: "#23252a",
                        color: "#8a8f98",
                        border: "1px solid #383b3f",
                      }}
                    >
                      <Tag size={9} />
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        style={{ color: "#62666d" }}
                        onMouseEnter={(e) =>
                          ((e.currentTarget as HTMLElement).style.color =
                            "#eb5757")
                        }
                        onMouseLeave={(e) =>
                          ((e.currentTarget as HTMLElement).style.color =
                            "#62666d")
                        }
                      >
                        <X size={10} />
                      </button>
                    </span>
                  ))}
                </div>
              )}

              <div className="flex gap-2">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleTagKey}
                  placeholder="Add a tag..."
                  disabled={tags.length >= 5}
                  className="input flex-1"
                  style={{ fontSize: "13px" }}
                />
                <button
                  type="button"
                  onClick={addTag}
                  disabled={!tagInput.trim() || tags.length >= 5}
                  className="btn-secondary px-3 py-2 text-xs"
                >
                  Add
                </button>
              </div>
            </div>

            {/* Actions */}
            <div
              className="flex items-center justify-end gap-2 pt-2"
              style={{ borderTop: "1px solid #23252a" }}
            >
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="btn-ghost text-xs px-3 py-2"
              >
                Cancel
              </button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isSaving}
                className="btn-primary text-xs px-4 py-2 flex items-center gap-1.5"
              >
                {isSaving ? (
                  <Loader2 size={13} className="animate-spin" />
                ) : (
                  <Save size={13} />
                )}
                {isSaving
                  ? uploadingCover
                    ? "Uploading..."
                    : "Saving..."
                  : isSaved
                    ? "Saved"
                    : "Save changes"}
              </motion.button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
