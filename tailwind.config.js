/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: [
    "./index.html",
    "./js/**/*.{js,ts}",
    "./css/**/*.css"
  ],
  theme: {
    extend: {
      colors: {
        // Primary - Royal Vibrant Indigo
        "primary": "#4f46e5",
        "primary-deep": "#4338ca",
        "primary-container": "#4338ca",
        "primary-fixed": "#e0e7ff",
        "primary-fixed-dim": "#c7d2fe",
        "on-primary": "#ffffff",
        "on-primary-container": "#ffffff",

        // Secondary - Electric Violet
        "secondary": "#7c3aed",
        "secondary-container": "#8a4cfc",
        "secondary-fixed": "#ede9fe",
        "secondary-fixed-dim": "#ddd6fe",
        "on-secondary": "#ffffff",
        "on-secondary-container": "#ffffff",

        // Tertiary - Emerald Mastery
        "tertiary": "#059669",
        "tertiary-container": "#005e40",
        "tertiary-fixed": "#d1fae5",
        "tertiary-fixed-dim": "#a7f3d0",
        "on-tertiary": "#ffffff",
        "on-tertiary-container": "#ffffff",

        // Light Theme Canvas & Surfaces
        "background": "#FAFAF9",
        "surface": "#ffffff",
        "surface-bright": "#ffffff",
        "surface-dim": "#f5f5f4",
        "surface-container-lowest": "#ffffff",
        "surface-container-low": "#FAF8F5",
        "surface-container": "#F5F0EB",
        "surface-container-high": "#EFE8E1",
        "surface-container-highest": "#E7DFD7",
        "surface-variant": "#F5F0EB",
        "surface-glass": "rgba(255, 255, 255, 0.90)",
        "surface-glass-active": "rgba(255, 255, 255, 0.98)",

        // Typography
        "on-surface": "#1C1917",
        "on-surface-variant": "#57534E",
        "on-background": "#1C1917",

        // Borders & Glass
        "outline": "#A8A29E",
        "outline-variant": "#E7E5E4",
        "border-glass": "rgba(99, 102, 241, 0.12)",
        "border-glass-highlight": "rgba(99, 102, 241, 0.25)",

        // Status & Alerts
        "error": "#dc2626",
        "error-container": "#fee2e2",
        "on-error": "#ffffff",
        "on-error-container": "#991b1b",

        // Accents
        "soft-coral": "#F06A8E",
        "mesh-glow-indigo": "rgba(99, 102, 241, 0.15)",
        "mesh-glow-emerald": "rgba(16, 185, 129, 0.12)",
        "mesh-glow-amber": "rgba(245, 158, 11, 0.12)",
        "mesh-glow-coral": "rgba(240, 106, 142, 0.12)"
      },
      spacing: {
        "space-2xl": "3rem",
        "gutter-desktop": "1.5rem",
        "space-4xl": "6rem",
        "margin-mobile": "1.25rem",
        "space-xl": "2rem",
        "space-3xs": "0.125rem",
        "space-sm": "0.75rem",
        "margin-desktop": "3rem",
        "space-3xl": "4rem",
        "space-2xs": "0.25rem",
        "space-md": "1rem",
        "space-xs": "0.5rem",
        "space-lg": "1.5rem",
        "gutter-mobile": "1rem"
      },
      borderRadius: {
        "DEFAULT": "1rem",
        "lg": "1.5rem",
        "xl": "2rem",
        "2xl": "2.5rem",
        "full": "9999px"
      },
      fontFamily: {
        "body-lg": ["Plus Jakarta Sans", "Inter", "sans-serif"],
        "body-md": ["Plus Jakarta Sans", "Inter", "sans-serif"],
        "body-sm": ["Plus Jakarta Sans", "Inter", "sans-serif"],
        "body-xl": ["Plus Jakarta Sans", "Inter", "sans-serif"],
        "headline-sm": ["Plus Jakarta Sans", "sans-serif"],
        "headline-md": ["Plus Jakarta Sans", "sans-serif"],
        "headline-lg": ["Plus Jakarta Sans", "sans-serif"],
        "headline-display": ["Plus Jakarta Sans", "sans-serif"],
        "label-sm": ["Plus Jakarta Sans", "sans-serif"],
        "label-md": ["Plus Jakarta Sans", "sans-serif"],
        "label-lg": ["Plus Jakarta Sans", "sans-serif"]
      }
    }
  },
  plugins: []
};
