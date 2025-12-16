import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import federation from "@originjs/vite-plugin-federation";
import path from "path";

export default defineConfig({
  resolve: {
    alias: {
      "@crm/shared": path.resolve(__dirname, "../shared/src"),
    },
  },
  plugins: [
    react(),
    federation({
      name: "shell",
      remotes: {
        salesMfe: "http://localhost:5001/assets/remoteEntry.js",
        financeMfe: "http://localhost:5002/assets/remoteEntry.js",
        reportsMfe: "http://localhost:5003/assets/remoteEntry.js",
        accessControlMfe: "http://localhost:5004/assets/remoteEntry.js",
        brandsMfe: "http://localhost:5005/assets/remoteEntry.js",
        documentsMfe: "http://localhost:5006/assets/remoteEntry.js",
        configMfe: "http://localhost:5007/assets/remoteEntry.js",
      },
      shared: {
        react: { singleton: true, requiredVersion: "^19.1.1" },
        "react-dom": { singleton: true, requiredVersion: "^19.1.1" },
        "react-router-dom": { singleton: true, requiredVersion: "^7.8.2" },
        "@reduxjs/toolkit": { singleton: true },
        "react-redux": { singleton: true },
        axios: { singleton: true },
        "react-hot-toast": { singleton: true },
        "socket.io-client": { singleton: true },
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
