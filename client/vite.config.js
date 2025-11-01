import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        // Any request starting with /api will be proxied
        target: "http://localhost:5000", // Your backend server address
        changeOrigin: true, // Necessary for virtual hosted sites
        // rewrite: (path) => path.replace(/^\/api/, ''), // If your backend routes did not start with /api
      },
    },
  },
});
