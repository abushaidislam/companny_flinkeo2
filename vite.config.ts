import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes("node_modules")) {
            return undefined;
          }

          if (
            id.includes("@tiptap/") ||
            id.includes("@syfxlin/tiptap-starter-kit") ||
            id.includes("prosemirror")
          ) {
            return "editor-vendor";
          }

          if (
            id.includes("katex") ||
            id.includes("mermaid") ||
            id.includes("chart.js") ||
            id.includes("react-markdown") ||
            id.includes("remark-") ||
            id.includes("rehype-") ||
            id.includes("highlight.js")
          ) {
            return "content-vendor";
          }

          if (id.includes("@supabase/")) {
            return "supabase-vendor";
          }

          if (id.includes("framer-motion") || id.includes("/motion/")) {
            return "motion-vendor";
          }

          return undefined;
        },
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
