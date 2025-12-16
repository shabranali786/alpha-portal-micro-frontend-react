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
      name: "salesMfe",
      filename: "remoteEntry.js",
      exposes: {
        "./SalesApp": "./src/App.jsx",
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
    port: 5001,
    strictPort: true,
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
  },
});
