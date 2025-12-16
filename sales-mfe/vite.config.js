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
      name: "salesMfe",
      filename: "remoteEntry.js",
      exposes: {
        "./SalesApp": "./src/App.jsx",
      },
      shared: {
        react: {
          singleton: true,
          requiredVersion: "^19.1.1",
          strictVersion: false,
          eager: true,
        },
        "react-dom": {
          singleton: true,
          requiredVersion: "^19.1.1",
          strictVersion: false,
          eager: true,
        },
        "react-router-dom": {
          singleton: true,
          requiredVersion: "^7.8.2",
          strictVersion: false,
          eager: true,
        },

        "@headlessui/react": {
          singleton: true,
          strictVersion: false,
          eager: true,
        },

        "react-select": {
          singleton: true,
          strictVersion: false,
          eager: true,
        },

        "@reduxjs/toolkit": {
          singleton: true,
          strictVersion: false,
          eager: true,
        },
        "react-redux": {
          singleton: true,
          strictVersion: false,
          eager: true,
        },
        "react-hot-toast": {
          singleton: true,
          strictVersion: false,
          eager: true,
        },
        axios: {
          singleton: true,
          strictVersion: false,
        },
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
