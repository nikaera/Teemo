import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

import { viteStaticCopy } from "vite-plugin-static-copy";

export default defineConfig({
  plugins: [
    react(),
    viteStaticCopy({
      targets: [
        {
          src: "assets/**",
          dest: ".",
        },
        {
          src: "manifest.json",
          dest: ".",
        },
        {
          src: "background.js",
          dest: ".",
        },
      ],
    }),
  ],
  build: {
    outDir: "build",
  },
});
