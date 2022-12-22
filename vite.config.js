// vite.config.js
import { resolve } from "path";
import { defineConfig } from "vite";

export default defineConfig({
  build: {
    lib: {
      // Could also be a dictionary or array of multiple entry points
      entry: resolve(__dirname, "build/wasm/wasm32/release/clipper2.mjs"),
      name: "clipper2",
      // the proper extensions will be added
      fileName: "clipper2",
      //   formats: ["es", "cjs", "umd"],
    },
  },
});
