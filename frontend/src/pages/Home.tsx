import { use, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useInView } from "framer-motion";
import {
  GitBranch,
  GitFork,
  Sparkles,
  BookOpen,
  Users,
  ArrowRight,
  Star,
  Zap,
  Globe,
} from "lucide-react";

//Animation Variants
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

const stagger = {
  visible: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.6 } },
};

//Feature Card

const features = [
  {
    icon: <GitBranch size={24} />,
    title: "Branch Your Story",
    description:
      'Create alternate timelines and narrative branches. Every "what if" becomes its own story path.',
    color: "from-blue-500 to-indigo-600",
    glow: "shadow-blue-500/20",
  },
  {
    icon: <GitFork size={24} />,
    title: "Fork & Continue",
    description:
      "Love a story but want to take it somewhere new? Fork it and write your own ending.",
    color: "from-purple-500 to-pink-600",
    glow: "shadow-purple-500/20",
  },
  {
    icon: <Sparkles size={24} />,
    title: "AI Co-Author",
    description:
      "Get real time AI suggestions, plot twists, grammar fixes and writing improvements as you type.",
    color: "from-amber-500 to-orange-600",
    glow: "shadow-amber-500/20",
  },
  {
    icon: <Users size={24} />,
    title: "Collaborate",
    description:
      "Invite co-authors with role-based access. Editors write, viewers read you stay in control.",
    color: "from-green-500 to-teal-600",
    glow: "shadow-green-500/20",
  },
  {
    icon: <BookOpen size={24} />,
    title: "Multiple Endings",
    description:
      "Publish different branches as different endings. Let readers choose their own adventure.",
    color: "from-red-500 to-rose-600",
    glow: "shadow-red-500/20",
  },
  {
    icon: <Globe size={24} />,
    title: "Discover Stories",
    description:
      "Browse a world of collaborative fiction. Rate endings, fork favourites, join the community.",
    color: "from-cyan-500 to-blue-600",
    glow: "shadow-cyan-500/20",
  },
];

//Section Wrapper
function AnimatedSection({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      variants={stagger}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      className={className}
    >
      {children}
    </motion.div>
  );
}

//HomePage

export default function Home(){
    return (
      <div className="min-h-screen overflow-hidden">
        {/*BackGround Effects */}
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-600/10 rounded-full blur-3xl" />
          <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-purple-600/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 left-1/3 w-64 h-64 bg-pink-600/5 rounded-full blur-3xl" />
        </div>

        {/* Hero Section */}
        <section className="relative min-h-screen flex flex-col items-center justify-center px-4 pt-20">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <span className="inline-flex items-center gap-2 glass border border-primary-500/30 text-primary-400 text-sm font-medium px-4 py-2 rounded-full">
              <Zap size={14} className="animate-pulse" />
              Git-Inspired Collaborative Storytelling
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl md:text-7xl font-bold text-center max-w-4xl leading-tight mb-6"
          >
            Where Stories
            <span className="block gradient-text">Branch & Evolve</span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl text-white/50 text-center max-w-2xl mb-10 leading-relaxed"
          >
            ForkTale brings the power of Git version control to collaborative
            fiction. Branch timelines, fork stories, commit chapters and let AI
            help you write what comes next.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 mb-16"
          >
            <Link to="/register">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-primary text-base px-8 py-4 shadow-glow-lg"
              >
                Start Writing Free
                <ArrowRight size={18} />
              </motion.button>
            </Link>
            <Link to="/discover">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-secondary text-base px-8 py-4"
              >
                <BookOpen size={18} />
                Browse Stories
              </motion.button>
            </Link>
          </motion.div>

        {/* Git Branch Diagram */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="relative w-full max-w-3xl"
        >
          <div className="glass rounded-3xl border border-white/10 p-8 shadow-card">
            {/* Fake terminal header */}
            <div className="flex items-center gap-2 mb-6">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <span className="ml-3 text-white/30 text-xs font-mono">
                forktale — story-editor
              </span>
            </div>
            
            {/* Branch visualization */}
            <div className="font-mono text-sm space-y-3">
              {[
                {
                  color: 'text-blue-400',
                  dot: 'bg-blue-400',
                  line: true,
                  text: 'main',
                  msg: 'The kingdom falls into darkness',
                },
                {
                  color: 'text-blue-400',
                  dot: 'bg-blue-400',
                  line: true,
                  text: 'main',
                  msg: 'The prince sets out on his journey',
                },
                {
                  color: 'text-purple-400',
                  dot: 'bg-purple-400',
                  line: false,
                  text: 'dark-ending',
                  msg: 'The witch claims her final victory',
                },
                {
                  color: 'text-blue-400',
                  dot: 'bg-blue-400',
                  line: true,
                  text: 'main',
                  msg: 'Light returns to the kingdom',
                },
                {
                  color: 'text-green-400',
                  dot: 'bg-green-400',
                  line: false,
                  text: 'hero-ending',
                  msg: 'The prince breaks the curse forever',
                },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + i * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <div className={`w-3 h-3 rounded-full ${item.dot} shadow-lg flex-shrink-0`} />
                  <span className={`text-xs ${item.color} w-24 flex-shrink-0`}>
                    {item.text}
                  </span>
                  <span className="text-white/40 text-xs truncate">
                    {item.msg}
                  </span>
                </motion.div>
              ))}

        </section>
      </div>
    );
}