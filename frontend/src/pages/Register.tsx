import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  GitBranch,
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "../context/AuthContext";
import { authService } from "../services/api";

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  username: z
    .string()
    .min(3, "At least 3 characters")
    .max(20, "Max 20 characters")
    .regex(/^[a-zA-Z0-9_]+$/, "Letters, numbers and underscores only"),
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "At least 6 characters"),
});
type Form = z.infer<typeof schema>;

const perks = [
  "Branch timelines without limits",
  "AI co-author built in",
  "Fork any published story",
  "Free forever to start",
];

export default function Register() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Form>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: Form) => {
    try {
      setLoading(true);
      setError("");
      const res = await authService.register(data);
      login(res.data.token, res.data.user);
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    {
      name: "name" as const,
      label: "Full name",
      type: "text",
      placeholder: "John Doe",
      Icon: User,
      prefix: null,
    },
    {
      name: "username" as const,
      label: "Username",
      type: "text",
      placeholder: "johndoe",
      Icon: null,
      prefix: "@",
    },
    {
      name: "email" as const,
      label: "Email address",
      type: "email",
      placeholder: "you@example.com",
      Icon: Mail,
      prefix: null,
    },
  ];

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        background: "var(--bg)",
      }}
    >
      {/* Left*/}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "48px 32px",
          background: "var(--bg)",
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          style={{ width: "100%", maxWidth: 380 }}
        >
          {/* Logo */}
          <Link
            to="/"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              marginBottom: 40,
            }}
          >
            <div
              style={{
                width: 28,
                height: 28,
                background: "var(--text-primary)",
                borderRadius: 6,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <GitBranch size={14} color="white" />
            </div>
            <span
              style={{
                fontSize: 15,
                fontWeight: 700,
                color: "var(--text-primary)",
                fontFamily: "var(--font-body)",
              }}
            >
              ForkTale
            </span>
          </Link>

          {/* Heading */}
          <div style={{ marginBottom: 32 }}>
            <h1
              style={{
                fontSize: 26,
                fontWeight: 400,
                fontStyle: "italic",
                letterSpacing: "-0.03em",
                color: "var(--text-primary)",
                fontFamily: "var(--font-display)",
                marginBottom: 6,
              }}
            >
              Create your account
            </h1>
            <p
              style={{
                fontSize: 14,
                color: "var(--text-secondary)",
                fontFamily: "var(--font-body)",
              }}
            >
              Start your first branch.{" "}
              <Link
                to="/login"
                style={{ color: "var(--accent)", fontWeight: 500 }}
              >
                Already have an account?
              </Link>
            </p>
          </div>

          {/* Error */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              className="alert alert-danger"
              style={{ marginBottom: 20 }}
            >
              {error}
            </motion.div>
          )}

          {/* Form */}
          <form
            onSubmit={handleSubmit(onSubmit)}
            style={{ display: "flex", flexDirection: "column", gap: 16 }}
          >
            {fields.map(({ name, label, type, placeholder, Icon, prefix }) => (
              <div key={name}>
                <label className="label">{label}</label>
                <div style={{ position: "relative" }}>
                  {Icon && (
                    <Icon
                      size={14}
                      style={{
                        position: "absolute",
                        left: 11,
                        top: "50%",
                        transform: "translateY(-50%)",
                        color: "var(--text-muted)",
                        pointerEvents: "none",
                      }}
                    />
                  )}
                  {prefix && (
                    <span
                      style={{
                        position: "absolute",
                        left: 11,
                        top: "50%",
                        transform: "translateY(-50%)",
                        fontSize: 13,
                        color: "var(--text-muted)",
                        fontFamily: "var(--font-body)",
                        pointerEvents: "none",
                      }}
                    >
                      {prefix}
                    </span>
                  )}
                  <input
                    {...register(name)}
                    type={type}
                    placeholder={placeholder}
                    className={`input ${errors[name] ? "input-error" : ""}`}
                    style={{ paddingLeft: Icon || prefix ? 34 : 12 }}
                  />
                </div>
                {errors[name] && (
                  <p className="field-error">{errors[name]?.message}</p>
                )}
              </div>
            ))}

            {/* Password */}
            <div>
              <label className="label">Password</label>
              <div style={{ position: "relative" }}>
                <Lock
                  size={14}
                  style={{
                    position: "absolute",
                    left: 11,
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "var(--text-muted)",
                    pointerEvents: "none",
                  }}
                />
                <input
                  {...register("password")}
                  type={showPw ? "text" : "password"}
                  placeholder="Min. 6 characters"
                  className={`input ${errors.password ? "input-error" : ""}`}
                  style={{ paddingLeft: 34, paddingRight: 36 }}
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  style={{
                    position: "absolute",
                    right: 10,
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "var(--text-muted)",
                    display: "flex",
                    padding: 2,
                  }}
                >
                  {showPw ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
              {errors.password && (
                <p className="field-error">{errors.password.message}</p>
              )}
            </div>

            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              type="submit"
              disabled={loading}
              className="btn btn-primary"
              style={{
                width: "100%",
                padding: "11px",
                fontSize: 14,
                marginTop: 4,
                justifyContent: "center",
              }}
            >
              {loading ? (
                <span className="spinner" />
              ) : (
                <>
                  Create account <ArrowRight size={14} />
                </>
              )}
            </motion.button>
          </form>

          <p
            style={{
              marginTop: 20,
              fontSize: 12,
              color: "var(--text-muted)",
              textAlign: "center",
              fontFamily: "var(--font-body)",
              lineHeight: 1.6,
            }}
          >
            By signing up, you agree to our{" "}
            <span style={{ color: "var(--text-secondary)" }}>
              Terms of Service
            </span>{" "}
            and{" "}
            <span style={{ color: "var(--text-secondary)" }}>
              Privacy Policy
            </span>
            .
          </p>
        </motion.div>
      </div>

      {/*Right*/}
      <div
        style={{
          background: "var(--bg-subtle)",
          borderLeft: "1px solid var(--border)",
          padding: "48px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
        className="hidden lg:flex"
      >
        <div style={{ maxWidth: 340 }}>
          <p
            style={{
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "var(--accent)",
              marginBottom: 20,
              fontFamily: "var(--font-body)",
            }}
          >
            What you get
          </p>
          <h2
            style={{
              fontSize: "clamp(24px,2.5vw,34px)",
              fontWeight: 400,
              fontStyle: "italic",
              letterSpacing: "-0.03em",
              color: "var(--text-primary)",
              fontFamily: "var(--font-display)",
              lineHeight: 1.15,
              marginBottom: 36,
            }}
          >
            Everything you need to write stories that evolve.
          </h2>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 16,
              marginBottom: 40,
            }}
          >
            {perks.map((p) => (
              <div
                key={p}
                style={{ display: "flex", alignItems: "flex-start", gap: 12 }}
              >
                <CheckCircle2
                  size={16}
                  style={{ color: "#16a34a", flexShrink: 0, marginTop: 1 }}
                />
                <span
                  style={{
                    fontSize: 14,
                    color: "var(--text-secondary)",
                    fontFamily: "var(--font-body)",
                    lineHeight: 1.5,
                  }}
                >
                  {p}
                </span>
              </div>
            ))}
          </div>

          {/* Mini branch visual */}
          <div
            style={{
              background: "var(--bg)",
              border: "1.5px solid var(--border)",
              borderRadius: 10,
              padding: "16px 20px",
              boxShadow: "var(--shadow-sm)",
            }}
          >
            <p
              style={{
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                color: "var(--text-muted)",
                marginBottom: 12,
                fontFamily: "var(--font-body)",
              }}
            >
              Sample story
            </p>
            {[
              { name: "main", color: "#2563eb", label: "12 commits" },
              { name: "dark-ending", color: "#7c3aed", label: "8 commits" },
              { name: "hero-arc", color: "#16a34a", label: "5 commits" },
            ].map((b) => (
              <div
                key={b.name}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  marginBottom: 8,
                }}
              >
                <div
                  style={{
                    width: 7,
                    height: 7,
                    borderRadius: "50%",
                    background: b.color,
                    flexShrink: 0,
                  }}
                />
                <span
                  style={{
                    fontSize: 12,
                    fontFamily: "var(--font-mono)",
                    color: "var(--text-primary)",
                    flex: 1,
                  }}
                >
                  {b.name}
                </span>
                <span
                  style={{
                    fontSize: 11,
                    color: "var(--text-muted)",
                    fontFamily: "var(--font-body)",
                  }}
                >
                  {b.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
