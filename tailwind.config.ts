import type { Config } from "tailwindcss";

/**
 * Tailwind CSS configuration with the full portfolio design system.
 *
 * All design tokens are defined here so components never hardcode
 * raw values — they always reference a named token.
 *
 * Token groups:
 *  - colors      : brand palette + surface + text
 *  - spacing      : 4px-based scale (already Tailwind default)
 *  - borderRadius : sm → full
 *  - boxShadow    : glow effects + card shadows
 *  - fontFamily   : display (Space Grotesk) / body (Inter) / mono (JetBrains Mono)
 *  - fontSize     : modular scale 12px → 72px
 *  - animation    : shimmer, pulse-glow, float, blob
 *  - keyframes    : backing definitions for custom animations
 */
const config: Config = {
  // ─── Content paths ───────────────────────────────────────────────────────────
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./data/**/*.{js,ts}",
    "./lib/**/*.{js,ts}",
  ],

  // ─── Dark-mode: class strategy so ThemeProvider controls the toggle ──────────
  darkMode: "class",

  theme: {
    extend: {
      // ── Colors ───────────────────────────────────────────────────────────────
      colors: {
        // Brand
        primary: "#6C63FF",
        secondary: "#00D4AA",
        accent: "#FF6B6B",

        // Backgrounds
        bg: {
          dark: "#080810",  // near-black with cool blue undertone
          light: "#F8F9FF", // soft off-white with cool undertone
        },

        // Card / surface layers
        surface: {
          dark: "#13131A",
          light: "#FFFFFF",
        },

        // Typography
        text: {
          "primary-dark": "#E8E8F0",
          "primary-light": "#1A1A2E",
          muted: "#8888AA",
        },

        // Status colours (used in Toast)
        success: "#22C55E",
        error: "#EF4444",
        warning: "#F59E0B",
        info: "#3B82F6",
      },

      // ── Border radius ─────────────────────────────────────────────────────────
      borderRadius: {
        sm: "4px",
        md: "8px",
        lg: "16px",
        xl: "24px",
        full: "9999px",
      },

      // ── Box shadows / glows ───────────────────────────────────────────────────
      boxShadow: {
        "glow-primary": "0 0 14px rgba(108, 99, 255, 0.35)",
        "glow-secondary": "0 0 14px rgba(0, 212, 170, 0.25)",
        "glow-accent": "0 0 14px rgba(255, 107, 107, 0.25)",
        card: "0 4px 20px rgba(0, 0, 0, 0.10)",
        "card-hover": "0 6px 28px rgba(108, 99, 255, 0.15)",
        "glass-inset": "inset 0 1px 0 rgba(255, 255, 255, 0.08)",
      },

      // ── Font families ─────────────────────────────────────────────────────────
      fontFamily: {
        // Loaded via next/font in app/layout.tsx; CSS variables set there
        display: ["var(--font-space-grotesk)", "Space Grotesk", "sans-serif"],
        body: ["var(--font-inter)", "Inter", "sans-serif"],
        mono: ["var(--font-jetbrains-mono)", "JetBrains Mono", "monospace"],
      },

      // ── Font sizes (modular scale) ────────────────────────────────────────────
      fontSize: {
        "2xs": ["0.75rem", { lineHeight: "1rem" }],       // 12px
        xs: ["0.875rem", { lineHeight: "1.25rem" }],      // 14px
        sm: ["1rem", { lineHeight: "1.5rem" }],           // 16px
        md: ["1.125rem", { lineHeight: "1.75rem" }],      // 18px
        lg: ["1.25rem", { lineHeight: "1.75rem" }],       // 20px
        xl: ["1.5rem", { lineHeight: "2rem" }],           // 24px
        "2xl": ["1.875rem", { lineHeight: "2.25rem" }],   // 30px
        "3xl": ["2.25rem", { lineHeight: "2.5rem" }],     // 36px
        "4xl": ["3rem", { lineHeight: "1" }],             // 48px
        "5xl": ["3.75rem", { lineHeight: "1" }],          // 60px
        "6xl": ["4.5rem", { lineHeight: "1" }],           // 72px
      },

      // ── Custom animations ─────────────────────────────────────────────────────
      animation: {
        // Availability pill dot
        "pulse-dot": "pulse-dot 1.5s ease-in-out infinite",
        // Hero avatar ring
        "spin-slow": "spin 20s linear infinite",
        // Floating tech icons around avatar
        float: "float 3s ease-in-out infinite",
        // Shimmer sweep on certificate cards
        shimmer: "shimmer 600ms ease-in-out",
        // Scroll indicator chevron
        "bounce-slow": "bounce 1.5s ease-in-out infinite",
        // Background gradient blobs (slowed down for smoother rendering)
        blob: "blob 14s ease-in-out infinite",
        // Page entrance fade-in
        "fade-in": "fade-in 400ms ease-out forwards",
        // Gradient text shift (optional heading accent)
        "gradient-shift": "gradient-shift 4s ease infinite",
      },

      // ── Keyframes ─────────────────────────────────────────────────────────────
      keyframes: {
        "pulse-dot": {
          "0%, 100%": { opacity: "1", transform: "scale(1)" },
          "50%": { opacity: "0.5", transform: "scale(0.85)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-8px)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% center" },
          "100%": { backgroundPosition: "200% center" },
        },
        blob: {
          "0%, 100%": { transform: "scale(1)", opacity: "0.12" },
          "33%": { transform: "scale(1.06) translate(8px, -8px)", opacity: "0.10" },
          "66%": { transform: "scale(0.96) translate(-4px, 4px)", opacity: "0.14" },
        },
        "fade-in": {
          from: { opacity: "0", transform: "translateY(8px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "gradient-shift": {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
      },

      // ── Background sizes (for shimmer and gradient animations) ────────────────
      backgroundSize: {
        "200%": "200%",
        "300%": "300%",
      },
    },
  },

  plugins: [],
};

export default config;
