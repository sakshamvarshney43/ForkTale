import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, BookOpen, Tag, X, ImagePlus, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { storyService } from "../services/api";

//Validation
const schema = z.object({
  title: z.string().min(1, "Title is required").max(100),
  description: z.string().max(500).optional(),
  genre: z.string().optional(),
});
type Form = z.infer<typeof schema>;

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

//Page

export default function StoryCreate() {
  const navigate = useNavigate();
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

  //Tag Helper
  const addTag = () => {
    const t = tagInput.trim().toLowerCase();
    if (t && !tags.includes(t) && tags.length < 5) {
      setTags([...tags, t]);
      setTagInput("");
    }
  };
}

const removeTag = (tag: string) => setTags(Tags.filter((t) => t !== tag));

const handleTagKey = (e: React.KeyboardEvent) => {
  if (e.key == "Enter") {
    e.preventDefault();
    addTag();
  }
};

//Submit
const onSubmit = async (data: Form) => {
  try {
    setLoading(true);
    setError("");
    const res = await storyService.create({
      ...data,
      tags,
    });
    const story = res.data.story;
    const branch = story.branches?.[0];
    if (branch) {
      navigate(`/stories/${story.id}/branches/${branch.id}`);
    } else {
      navigate("/dashboard");
    }
  } catch (err: any) {
    setError(err.response?.data?.message || "Something went wrong.");
  } finally {
    setLoading(false);
  }
};

return (
  <div className="min-h-screen px-4 py-8" style={{ background: "#08090a" }}>
    <div className="max-w-2xl mx-auto">
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
            New story
          </h1>
          <p style={{ color: "#62666d", fontSize: "12px" }}>
            A main branch will be created automatically
          </p>
        </div>
      </motion.div>
    </div>
  </div>
);
