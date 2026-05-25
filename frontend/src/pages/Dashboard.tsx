import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
                        `/stories/${story.id}/branches/${defaultBranch.id}`,
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
                    if (confirm("Delete this story?")) {
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

      {/*Stats*/}
      <div className="flex items-center gap-4 mt-2">
        {story.genre && (
          <span className="text-xs text-white/30 bg-white/5 px-2 py-0.5 rounded-full">
            {story.genre}
          </span>
        )}

        <span className="flex items-center gap-1 text-xs text-white/30">
          <GitBranch size={11} />
          {story._count?.branches || 0}
        </span>

        <span className="flex items-center gap-1 text-xs text-white/30">
          <GitFork size={11} />
          {story._count?.forks || 0}
        </span>

        <span className="text-xs text-white/20 ml-auto">
          {story.wordCount} words
        </span>
      </div>
    </motion.div>
  );
}

//DashBoard Page

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<"stories" | "forks" | "collabs">(
    "stories",
  );

  // Fetch my stories
  const { data: storiesData, isLoading: storiesLoading } = useQuery({
    queryKey: ["myStories"],
    queryFn: () => storyService.getMyStories(),
  });

  // Fetch my forks
  const { data: forksData, isLoading: forksLoading } = useQuery({
    queryKey: ["myForks"],
    queryFn: () => forkService.getMyForks(),
  });

  const stories: Story[] = storiesData?.data?.stories || [];
  const forks: Story[] = forksData?.data?.forks || [];

  const tabs = [
    { key: "stories", label: "My Stories", count: stories.length },
    { key: "forks", label: "Forked", count: forks.length },
  ];

  return (
    <div className="min-h-screen px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/*Header*/}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div>
            <h1 className="text-3xl font-bold mb-1">
              Welcome back,{" "}
              <span className="gradient-text">
                {user?.name || user?.username}
              </span>
            </h1>

            <p className="text-white/40">
              {stories.length} stories · {forks.length} forks
            </p>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/stories/create")}
            className="btn-primary"
          >
            <Plus size={18} />
            New Story
          </motion.button>
        </motion.div>

        {/*Tabs*/}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex gap-2 mb-6"
        >
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                activeTab === tab.key
                  ? "bg-primary-600/20 text-primary-400 border border-primary-500/30"
                  : "text-white/40 hover:text-white hover:bg-white/5"
              }`}
            >
              {tab.label}

              <span
                className={`text-xs px-1.5 py-0.5 rounded-full ${
                  activeTab === tab.key
                    ? "bg-primary-500/20 text-primary-400"
                    : "bg-white/5 text-white/30"
                }`}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </motion.div>

        {/*Content*/}
        {activeTab === "stories" && (
          <>
            {storiesLoading ? (
              // Skeleton loading
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="card">
                    <div className="shimmer w-full h-36 rounded-xl mb-4" />
                    <div className="shimmer h-4 w-3/4 rounded mb-2" />
                    <div className="shimmer h-3 w-1/2 rounded" />
                  </div>
                ))}
              </div>
            ) : stories.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-20"
              >
                <BookOpen size={48} className="text-white/10 mx-auto mb-4" />

                <h3 className="text-lg font-medium text-white/40 mb-2">
                  No stories yet
                </h3>

                <p className="text-white/20 text-sm mb-6">
                  Create your first story and start branching
                </p>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate("/stories/create")}
                  className="btn-primary"
                >
                  <Plus size={16} />
                  Create Story
                </motion.button>
              </motion.div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {stories.map((story) => (
                  <StoryCard key={story.id} story={story} />
                ))}
              </div>
            )}
          </>
        )}

        {activeTab === "forks" && (
          <>
            {forksLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2].map((i) => (
                  <div key={i} className="card">
                    <div className="shimmer w-full h-36 rounded-xl mb-4" />
                    <div className="shimmer h-4 w-3/4 rounded mb-2" />
                    <div className="shimmer h-3 w-1/2 rounded" />
                  </div>
                ))}
              </div>
            ) : forks.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-20"
              >
                <GitFork size={48} className="text-white/10 mx-auto mb-4" />

                <h3 className="text-lg font-medium text-white/40 mb-2">
                  No forks yet
                </h3>

                <p className="text-white/20 text-sm mb-6">
                  Fork a published story to continue it your way
                </p>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate("/discover")}
                  className="btn-secondary"
                >
                  Browse Stories
                </motion.button>
              </motion.div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {forks.map((story) => (
                  <div key={story.id} className="relative">
                    <StoryCard story={story} />

                    {story.forkedFrom && (
                      <div className="mt-2 flex items-center gap-1 text-xs text-white/30 px-1">
                        <GitFork size={11} />
                        Forked from{" "}
                        <span className="text-primary-400/70">
                          {story.forkedFrom.author.username}/
                          {story.forkedFrom.title}
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
