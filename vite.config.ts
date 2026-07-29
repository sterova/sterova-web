import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import tailwindcss from "@tailwindcss/vite";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));

// Pre-import nitro so the defineConfig callback stays synchronous
const { nitro } = await import("nitro/vite");

export default defineConfig(({ command, mode }) => {
  // Load VITE_* env vars so they are available via import.meta.env
  const env = loadEnv(mode, process.cwd(), "VITE_");
  const envDefine: Record<string, string> = {};
  for (const [key, value] of Object.entries(env)) {
    envDefine[`import.meta.env.${key}`] = JSON.stringify(value);
  }

  const plugins = [
    // TanStack Start (SSR, file-based routing, server functions)
    tanstackStart({
      importProtection: {
        behavior: "error",
        client: {
          files: ["**/server/**"],
          specifiers: ["server-only"],
        },
      },
      // Use src/server.ts as the SSR entry (our error wrapper)
      server: { entry: "server" },
    }),

    // React (JSX transform, fast refresh)
    react(),

    // Tailwind CSS v4
    tailwindcss(),
  ];

  // Nitro (Cloudflare Workers build) — only during production builds
  if (command === "build") {
    plugins.push(
      nitro({
        defaultPreset: "cloudflare-module",
      }),
    );
  }

  return {
    define: envDefine,

    css: { transformer: "lightningcss" },

    resolve: {
      alias: { "@": resolve(__dirname, "src") },
      tsconfigPaths: true,
      dedupe: [
        "react",
        "react-dom",
        "react/jsx-runtime",
        "react/jsx-dev-runtime",
        "@tanstack/react-query",
        "@tanstack/query-core",
      ],
    },

    optimizeDeps: {
      include: [
        "react",
        "react-dom",
        "react-dom/client",
        "react/jsx-runtime",
        "react/jsx-dev-runtime",
      ],
    },

    server: {
      host: "::",
      port: 8080,
    },

    plugins,
  };
});
