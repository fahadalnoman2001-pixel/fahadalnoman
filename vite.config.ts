import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id: string) {
          if (id.includes("node_modules/react-dom") || id.includes("node_modules/react/") || id.includes("node_modules/react-router")) {
            return "vendor-react";
          }
          if (id.includes("node_modules/framer-motion")) {
            return "vendor-motion";
          }
          if (id.includes("node_modules/sonner") || id.includes("node_modules/lucide-react")) {
            return "vendor-ui";
          }
        },
      },
    },
    // Enable CSS code splitting so each route only loads its own styles
    cssCodeSplit: true,
    // Target modern browsers for smaller output
    target: "es2020",
    // Increase chunk size warning to avoid noise
    chunkSizeWarningLimit: 600,
  },
});
