import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
const viteConfig = defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    minify: "oxc",
    cssMinify: "lightningcss",
  },
  css: {
    transformer: "lightningcss",
  },
});

export default viteConfig
