import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { GitBranch, Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "../context/AuthContext";
import { authService } from "../services/api";

//Validation

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

type LoginForm = z.infer<typeof loginSchema>;

//Page
export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    try {
      setIsLoading(true);
      setError("");

      const res = await authService.login(data);

      login(res.data.token, res.data.user);

      navigate("/dashboard");
    } catch (err: any) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative">
      {/* Background blobs */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-primary-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-purple-600/10 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-ai flex items-center justify-center shadow-glow">
              <GitBranch size={20} className="text-white" />
            </div>

            <span className="font-bold text-xl gradient-text">ForkTale</span>
          </Link>

          <h1 className="text-3xl font-bold mb-2">Welcome back</h1>

          <p className="text-white/40">Continue your story</p>
        </div>

        {/* Card */}
        <div className="card">
          {/* Error */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm px-4 py-3 rounded-xl mb-6"
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Email */}
            <div>
              <label className="text-sm text-white/60 mb-2 block">Email</label>

              <div className="relative">
                <Mail
                  size={16}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30"
                />

                <input
                  {...register("email")}
                  type="email"
                  placeholder="you@example.com"
                  className="input pl-11"
                />
              </div>

              {errors.email && (
                <p className="text-red-400 text-xs mt-1.5">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/*Password*/}
            <div>
              <label className="text-sm text-white/60 mb-2 block">
                Password
              </label>

              <div className="relative">
                <Lock
                  size={16}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30"
                />

                <input
                  {...register("password")}
                  type={showPassword ? "text" : "password"}
                  placeholder="*********"
                  className="input pl-11 pr-11"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>

              {errors.password && (
                <p className="text-red-400 text-xs mt-1.5">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Submit */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full py-3"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Log In
                  <ArrowRight size={16} />
                </>
              )}
            </motion.button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-white/5" />
            <span className="text-white/20 text-xs">or</span>
            <div className="flex-1 h-px bg-white/5" />
          </div>

          {/* Register link */}
          <p className="text-center text-white/40 text-sm">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-primary-400 hover:text-primary-300 font-medium transition-colors"
            >
              Sign up free
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
