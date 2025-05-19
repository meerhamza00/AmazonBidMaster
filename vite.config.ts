import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path, { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Try to load optional plugins
const loadOptionalPlugins = async () => {
  const plugins = [react()];
  
  try {
    const runtimeErrorOverlay = await import("@replit/vite-plugin-runtime-error-modal");
    plugins.push(runtimeErrorOverlay.default());
  } catch (e) {
    console.log("Runtime error overlay plugin not available");
  }
  
  try {
    const themePlugin = await import("@replit/vite-plugin-shadcn-theme-json");
    plugins.push(themePlugin.default());
  } catch (e) {
    console.log("Theme plugin not available");
  }
  
  // Add cartographer plugin only in development mode on Replit
  if (process.env.NODE_ENV !== "production" && process.env.REPL_ID !== undefined) {
    try {
      const cartographer = await import("@replit/vite-plugin-cartographer");
      plugins.push(cartographer.cartographer());
    } catch (e) {
      console.log("Cartographer plugin not available");
    }
  }
  
  return plugins;
};

export default defineConfig(async () => ({
  plugins: await loadOptionalPlugins(),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "client", "src"),
      "@shared": path.resolve(__dirname, "shared"),
    },
  },
  root: path.resolve(__dirname, "client"),
  build: {
    outDir: path.resolve(__dirname, "dist/public"),
    emptyOutDir: true,
  },
  server: {
    port: 3000,
    strictPort: true,
    proxy: {
      '/api': {
        target: 'http://localhost:4000',
        changeOrigin: true,
      },
      '/ws': {
        target: 'ws://localhost:4000',
        ws: true,
      },
    },
    hmr: {
      overlay: true,
    },
    watch: {
      usePolling: true,
    },
  },
}));
