import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import federation from "@originjs/vite-plugin-federation";

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: "shell",
      remotes: {
        dashboard: "http://localhost:5001/assets/remoteEntry.js",
        sales: "http://localhost:5002/assets/remoteEntry.js",
      },
      shared: {
        react: { singleton: true, requiredVersion: "^19.1.1" },
        "react-dom": { singleton: true, requiredVersion: "^19.1.1" },
        "react-router-dom": { singleton: true, requiredVersion: "^7.8.2" },
      },
    }),
  ],
  build: {
    modulePreload: false,
    target: "esnext",
    minify: false,
    cssCodeSplit: false,
  },
  server: {
    port: 5000,
    strictPort: true,
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
  },
});
