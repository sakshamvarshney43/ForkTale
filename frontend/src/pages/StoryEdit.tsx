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

  //Fetch story
  const { data, isLoading } = useQuery({
    queryKey: ["story", storyId],
    queryFn: () => storyService.getStory(storyId!),
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

  //Update mutation
  const updateMutation = useMutation({
    mutationFn: (data: Form) =>
      storyService.updateStory(storyId!, { ...data, tags }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["story", storyId] });
      queryClient.invalidateQueries({ queryKey: ["myStories"] });
    },
  });

  //Delete mutation
  const deleteMutation = useMutation({
    mutationFn: () => storyService.deleteStory(storyId!),
    onSuccess: () => navigate("/dashboard"),
  });

  //Tag helpers
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
}
