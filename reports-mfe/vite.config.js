import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { federation } from "@module-federation/vite";
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
      name: "reportsMfe",
      filename: "remoteEntry.js",
      exposes: {
        "./ReportsApp": "./src/App.jsx",
      },
      shared: {
        react: {
          singleton: true,
          requiredVersion: "^19.1.1",
          strictVersion: false,
          eager: true
        },
        "react-dom": {
          singleton: true,
          requiredVersion: "^19.1.1",
          strictVersion: false,
          eager: true
        },
        "react-router-dom": {
          singleton: true,
          requiredVersion: "^7.8.2",
          strictVersion: false
        },
        "@reduxjs/toolkit": { singleton: true, strictVersion: false },
        "react-redux": { singleton: true, strictVersion: false },
        axios: { singleton: true, strictVersion: false },
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
    port: 5003,
    strictPort: true,
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
  },
});
