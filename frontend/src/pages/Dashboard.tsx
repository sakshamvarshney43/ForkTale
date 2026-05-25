import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Plus,
  BookOpen,
  GitBranch,
  GitFork,
  Users,
  MoreVertical,
  Trash2,
  Edit,
  Eye,
  Globe,
  Lock,
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { storyService, forkService } from "../services/api";
import { useAuth } from "../context/AuthContext";
import type { Story } from "../types";

//Story Card

function StoryCard({ story }: { story: Story }) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [menuOpen, setMenuOpen] = useState(false);

  const deleteMutation = useMutation({
    mutationFn: () => storyService.deleteStory(story.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myStories"] });
    },
  });

  const defaultBranch = story.branches?.[0];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
      className="card group relative"
    >
      {/*Cover Image*/}
      <div
        className="w-full h-36 rounded-xl mb-4 overflow-hidden cursor-pointer"
        onClick={() =>
          defaultBranch &&
          navigate(`/stories/${story.id}/branches/${defaultBranch.id}`)
        }
      >
        {story.coverImage ? (
          <img
            src={story.coverImage}
            alt={story.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary-600/20 to-purple-600/20 flex items-center justify-center">
            <BookOpen size={32} className="text-white/20" />
          </div>
        )}

        {/*Published badge*/}
        <div className="absolute top-3 left-3">
          <span
            className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full ${
              story.isPublished
                ? "bg-green-500/20 text-green-400 border border-green-500/20"
                : "bg-white/10 text-white/60 border border-white/10"
            }`}
          >
            {story.isPublished ? (
              <>
                <Globe size={10} />
                Published
              </>
            ) : (
              <>
                <Lock size={10} />
                Draft
              </>
            )}
          </span>
        </div>
      </div>
      
      {/* Content */}
      <div className="flex items-start justify-between gap-2">
        <div
          className="flex-1 cursor-pointer"
          onClick={() =>
            defaultBranch &&
            navigate(`/stories/${story.id}/branches/${defaultBranch.id}`)
          }
        >
          <h3 className="font-semibold text-white mb-1 line-clamp-1 group-hover:text-primary-400 transition-colors">
            {story.title}
          </h3>
          {story.description && (
            <p className="text-white/40 text-xs line-clamp-2 mb-3">
              {story.description}
            </p>
          )}
        </div>

        {/*Menu*/}
        {/* Menu */}
        <div className="relative">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-1.5 rounded-lg text-white/30 hover:text-white hover:bg-white/5 transition-all"
          >
            <MoreVertical size={16} />
          </button>

          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 4 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              className="absolute right-0 top-8 w-44 glass-strong rounded-xl border border-white/10 shadow-card z-10 overflow-hidden"
            >
              <div className="p-1.5">
                <button
                  onClick={() => {
                    navigate(`/stories/${story.id}/edit`);
                    setMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-white/70 hover:text-white hover:bg-white/5 transition-all"
                >
                  <Edit size={14} /> Edit Story
                </button>
                {defaultBranch && (
                  <button
                    onClick={() => {
                      navigate(
                        `/stories/${story.id}/branches/${defaultBranch.id}`
                      );
                      setMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-white/70 hover:text-white hover:bg-white/5 transition-all"
                  >
                    <Eye size={14} /> Open Editor
                  </button>
                )}
                <button
                  onClick={() => {
                    navigate(`/stories/${story.id}/collaborate`);
                    setMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-white/70 hover:text-white hover:bg-white/5 transition-all"
                >
                  <Users size={14} /> Collaborators
                </button>
              </div>
              <div className="border-t border-white/5 p-1.5">
                <button
                  onClick={() => {
                    if (confirm('Delete this story?')) {
                      deleteMutation.mutate();
                    }
                    setMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-red-400 hover:bg-red-500/10 transition-all"
                >
                  <Trash2 size={14} /> Delete
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </div>