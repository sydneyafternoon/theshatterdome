import { defineConfig } from "vite";
import path from "path";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

const srcPath = path.resolve(new URL('.', import.meta.url).pathname, "src");

export default defineConfig({
  resolve: {
    alias: {
      "@": srcPath,
    },
  },
  plugins: [react(), tailwindcss()],
});