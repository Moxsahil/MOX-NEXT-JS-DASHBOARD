import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "dark-gradient":
          "linear-gradient(135deg, #0f1419 0%, #1a1f2e 50%, #0f1419 100%)",
        "premium-gradient": "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        "accent-gradient": "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
        "surface-gradient": "linear-gradient(135deg, #18181b 0%, #27272a 100%)",
      },

      colors: {
        // 🌑 Modern Dark Theme System
        dark: {
          primary: "#0a0a0b",
          secondary: "#111113",
          tertiary: "#18181b",
          accent: "#27272a",
          elevated: "#3f3f46",
          text: {
            primary: "#fafafa",
            secondary: "#a1a1aa",
            tertiary: "#71717a",
            inverse: "#18181b",
          },
          border: {
            primary: "#27272a",
            secondary: "#3f3f46",
            accent: "#52525b",
          },
        },

        // 🎨 Brand Colors (mapped to Tailwind primary/secondary)
        primary: {
          50: "#eff6ff",
          100: "#dbeafe",
          200: "#bfdbfe",
          300: "#93c5fd",
          400: "#60a5fa",
          500: "#3b82f6", // brand.primary
          600: "#2563eb",
          700: "#1d4ed8",
          800: "#1e40af",
          900: "#1e3a8a",
        },
        secondary: {
          50: "#f5f3ff",
          100: "#ede9fe",
          200: "#ddd6fe",
          300: "#c4b5fd",
          400: "#a78bfa",
          500: "#8b5cf6", // brand.secondary
          600: "#7c3aed",
          700: "#6d28d9",
          800: "#5b21b6",
          900: "#4c1d95",
        },

        // keep brand for backward compatibility
        brand: {
          primary: "#3b82f6",
          secondary: "#8b5cf6",
          success: "#10b981",
          warning: "#f59e0b",
          danger: "#ef4444",
          error: "#ef4444",
          info: "#06b6d4",
        },

        // 🌈 Accent Colors for Data Visualization
        accent: {
          blue: "#3b82f6",
          purple: "#8b5cf6",
          emerald: "#10b981",
          amber: "#f59e0b",
          orange: "#f97316",
          red: "#ef4444",
          cyan: "#06b6d4",
          teal: "#14b8a6",
          pink: "#ec4899",
          rose: "#f43f5e",
          indigo: "#6366f1",
          lime: "#84cc16",
        },

        // ✅ Status Colors
        status: {
          success: {
            primary: "#10b981",
            bg: "#064e3b",
            border: "#065f46",
            text: "#d1fae5",
          },
          warning: {
            primary: "#f59e0b",
            bg: "#78350f",
            border: "#92400e",
            text: "#fef3c7",
          },
          error: {
            primary: "#ef4444",
            bg: "#7f1d1d",
            border: "#991b1b",
            text: "#fee2e2",
          },
          info: {
            primary: "#06b6d4",
            bg: "#164e63",
            border: "#0e7490",
            text: "#cffafe",
          },
        },
      },

      fontFamily: {
        sans: [
          "Inter",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "sans-serif",
        ],
        display: ["Cal Sans", "Inter", "sans-serif"],
        mono: ["JetBrains Mono", "Monaco", "Consolas", "monospace"],
      },

      fontSize: {
        "2xs": [
          "0.625rem",
          { lineHeight: "0.875rem", letterSpacing: "0.025em" },
        ],
        xs: ["0.75rem", { lineHeight: "1rem", letterSpacing: "0.025em" }],
        sm: ["0.875rem", { lineHeight: "1.375rem", letterSpacing: "0.025em" }],
        base: ["1rem", { lineHeight: "1.5rem", letterSpacing: "0" }],
        lg: ["1.125rem", { lineHeight: "1.75rem", letterSpacing: "-0.025em" }],
        xl: ["1.25rem", { lineHeight: "1.875rem", letterSpacing: "-0.025em" }],
        "2xl": ["1.5rem", { lineHeight: "2rem", letterSpacing: "-0.025em" }],
        "3xl": [
          "1.875rem",
          { lineHeight: "2.25rem", letterSpacing: "-0.05em" },
        ],
        "4xl": ["2.25rem", { lineHeight: "2.5rem", letterSpacing: "-0.05em" }],
        "5xl": ["3rem", { lineHeight: "3.5rem", letterSpacing: "-0.05em" }],
      },

      spacing: {
        18: "4.5rem",
        88: "22rem",
        128: "32rem",
      },

      borderRadius: {
        none: "0px",
        sm: "0.25rem",
        md: "0.375rem",
        lg: "0.5rem",
        xl: "0.75rem",
        "2xl": "1rem",
        "3xl": "1.5rem",
      },

      boxShadow: {
        sm: "0 1px 2px 0 rgb(0 0 0 / 0.15)",
        md: "0 4px 6px -1px rgb(0 0 0 / 0.3), 0 2px 4px -2px rgb(0 0 0 / 0.3)",
        lg: "0 10px 15px -3px rgb(0 0 0 / 0.4), 0 4px 6px -4px rgb(0 0 0 / 0.4)",
        xl: "0 20px 25px -5px rgb(0 0 0 / 0.5), 0 8px 10px -6px rgb(0 0 0 / 0.5)",
        "2xl": "0 25px 50px -12px rgb(0 0 0 / 0.6)",
        inner: "inset 0 2px 4px 0 rgb(0 0 0 / 0.2)",
        premium: "0 8px 30px rgb(0 0 0 / 0.4), 0 2px 6px rgb(0 0 0 / 0.3)",
        modern: "0 8px 30px rgb(0 0 0 / 0.4), 0 2px 6px rgb(0 0 0 / 0.3)",
        soft: "0 4px 20px -2px rgba(0, 0, 0, 0.08)",
        glow: "0 0 20px rgb(59 130 246 / 0.5)",
        "glow-lg": "0 0 40px rgb(59 130 246 / 0.3)",
      },

      animation: {
        "fade-in": "fadeIn 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
        "fade-in-up": "fadeInUp 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
        "slide-in-right": "slideInRight 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
        "pulse-glow": "pulseGlow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "scale-in": "scaleIn 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        shimmer: "shimmer 2s linear infinite",
      },

      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        fadeInUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideInRight: {
          "0%": { opacity: "0", transform: "translateX(-20px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        scaleIn: {
          "0%": { opacity: "0", transform: "scale(0.95)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        pulseGlow: {
          "0%, 100%": {
            boxShadow: "0 0 20px rgb(59 130 246 / 0.1)",
          },
          "50%": {
            boxShadow: "0 0 20px rgb(59 130 246 / 0.3)",
          },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },

      backdropBlur: {
        xs: "2px",
      },
    },
  },
  plugins: [],
};

export default config;
