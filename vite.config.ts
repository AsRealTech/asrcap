// import { defineConfig } from "vite";
// import react from "@vitejs/plugin-react";
// import tailwindcss from "@tailwindcss/vite";
// import path from "path";

// export default defineConfig({
//   plugins: [react(), tailwindcss()],
//   resolve: {
//     alias: {
//       "@": path.resolve(__dirname, "src"),
//       "@workspace/api-client-react": path.resolve(__dirname, "src/lib/api-client"),
//     },
//   },
//   server: {
//     port: import.meta.env.VITE_PORT, 
//     proxy: {
//       "/api": {
//         target: "http://localhost:3001",
//         changeOrigin: true,
//       },
//     },
//   },
// });

import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());

  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "src"),
        "@workspace/api-client-react": path.resolve(__dirname, "src/lib/api-client"),
      },
    },
    build: {
      outDir: path.resolve(__dirname, "dist"),
      sourcemap: true,
      emptyOutDir: true,
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes("node_modules")) {
              if (id.includes("react") || id.includes("react-dom")) {
                return "vendor-react";
              }
              if (id.includes("@radix-ui") || id.includes("lucide-react") || id.includes("recharts") || id.includes("embla-carousel-react") || id.includes("date-fns") || id.includes("react-hook-form") || id.includes("wouter") || id.includes("sonner")) {
                return "vendor-ui";
              }
              return "vendor";
            }
          },
        },
      },
    },
    server: {
      port: Number(env.VITE_PORT) || 5173, // fallback is important
      proxy: {
        "/api": {
          target: env.VITE_API_URL,
          changeOrigin: true,
        },
      },
    },
  };
});
