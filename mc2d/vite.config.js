import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// `base:` is the full subpath of the URL.
// Set it dynamically from an env variable,
// as different gh branches are deployed to different subpaths

export default defineConfig({
  plugins: [react()],
  base: process.env.BRANCH_SUBPATH || "/",
  // moyo-wasm locates its .wasm via `new URL(..., import.meta.url)`; if
  // pre-bundled into node_modules/.vite/deps that URL points at a missing
  // file (dev server returns index.html). Serve both packages unbundled.
  optimizeDeps: {
    exclude: ["matsci-parse", "@spglib/moyo-wasm"],
  },
});
