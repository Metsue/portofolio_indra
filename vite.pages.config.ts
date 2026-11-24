import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: process.env.PAGES_BASE_PATH || "/portofolio_indra/",
  plugins: [react()],
  publicDir: false,
  define: {
    "import.meta.env.VITE_STATIC_SITE": JSON.stringify("true"),
  },
  build: {
    outDir: "dist-pages",
    emptyOutDir: true,
    rollupOptions: { input: "pages.html" },
  },
});
