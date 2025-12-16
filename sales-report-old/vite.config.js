import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { federation } from "@module-federation/vite";

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: "sales",
      filename: "remoteEntry.js",
      exposes: {
        "./Invoice": "./src/pages/Invoice.jsx",
        "./Lead": "./src/pages/Lead.jsx",
      },
      shared: {
        react: { singleton: true, requiredVersion: "^19.1.1" },
        "react-dom": { singleton: true, requiredVersion: "^19.1.1" },
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
    port: 5002,
    strictPort: true,
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
  },
});
