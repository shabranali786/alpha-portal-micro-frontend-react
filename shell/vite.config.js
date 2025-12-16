import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { federation } from "@module-federation/vite";
import path from "path";

const sharedDeps = {
  react: {
    singleton: true,
    requiredVersion: "^19.1.1",
  },
  "react-dom": {
    singleton: true,
    requiredVersion: "^19.1.1",
  },
  "react-router-dom": {
    singleton: true,
    requiredVersion: "^7.8.2",
  },
  "@headlessui/react": {
    singleton: true,
  },
  "react-select": {
    singleton: true,
  },
  "react-redux": {
    singleton: true,
  },
  "@reduxjs/toolkit": {
    singleton: true,
  },
  "react-hot-toast": {
    singleton: true,
  },
  axios: {
    singleton: true,
  },
};

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
        salesMfe: {
          type: "module",
          name: "salesMfe",
          entry: "http://localhost:5001/remoteEntry.js",
          entryGlobalName: "salesMfe",
        },
        financeMfe: {
          type: "module",
          name: "financeMfe",
          entry: "http://localhost:5002/remoteEntry.js",
          entryGlobalName: "financeMfe",
        },
        reportsMfe: {
          type: "module",
          name: "reportsMfe",
          entry: "http://localhost:5003/remoteEntry.js",
          entryGlobalName: "reportsMfe",
        },
        accessControlMfe: {
          type: "module",
          name: "accessControlMfe",
          entry: "http://localhost:5004/remoteEntry.js",
          entryGlobalName: "accessControlMfe",
        },
        brandsMfe: {
          type: "module",
          name: "brandsMfe",
          entry: "http://localhost:5005/remoteEntry.js",
          entryGlobalName: "brandsMfe",
        },
        documentsMfe: {
          type: "module",
          name: "documentsMfe",
          entry: "http://localhost:5006/remoteEntry.js",
          entryGlobalName: "documentsMfe",
        },
        configMfe: {
          type: "module",
          name: "configMfe",
          entry: "http://localhost:5007/remoteEntry.js",
          entryGlobalName: "configMfe",
        },
      },
      shared: sharedDeps,
    }),
  ],
  build: {
    target: "esnext",
    minify: false,
    cssCodeSplit: false,
  },
  server: {
    port: 5000,
    strictPort: true,
    cors: true,
  },
});
