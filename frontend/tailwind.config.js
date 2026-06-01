/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["'Instrument Serif'", "Georgia", "serif"],
        body: ["'DM Sans'", "system-ui", "sans-serif"],
        mono: ["'JetBrains Mono'", "'Fira Code'", "monospace"],
      },
      colors: {
        bg: {
          DEFAULT: "#ffffff",
          subtle: "#f8f9fa",
          muted: "#f1f3f5",
        },
        border: {
          DEFAULT: "#e5e7eb",
          strong: "#d1d5db",
        },
        text: {
          primary: "#111827",
          secondary: "#4b5563",
          muted: "#9ca3af",
        },
        accent: {
          DEFAULT: "#2563eb",
          hover: "#1d4ed8",
          subtle: "#eff6ff",
          border: "#bfdbfe",
        },
      },
      boxShadow: {
        xs: "0 1px 2px rgba(0,0,0,0.05)",
        sm: "0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04)",
        md: "0 4px 6px -1px rgba(0,0,0,0.07), 0 2px 4px -2px rgba(0,0,0,0.05)",
        lg: "0 10px 24px -3px rgba(0,0,0,0.08), 0 4px 8px -4px rgba(0,0,0,0.04)",
        xl: "0 20px 48px -8px rgba(0,0,0,0.10), 0 8px 16px -6px rgba(0,0,0,0.05)",
      },
      borderRadius: {
        sm: "4px",
        md: "8px",
        lg: "12px",
        xl: "16px",
      },
      spacing: {
        18: "72px",
        22: "88px",
        26: "104px",
      },
      maxWidth: {
        "8xl": "1440px",
      },
    },
  },
  plugins: [],
};
