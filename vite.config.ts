import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import laravel from "laravel-vite-plugin";
export default defineConfig({
  base: "./",
  plugins: [
    laravel({
      input: ["src/main.tsx"],
      refresh: ["resources/views/**", "routes/**"],
    }),
    react(),
  ],
  server: { port: 5173, strictPort: true },
});
