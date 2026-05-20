import path from "node:path";
import react from "@vitejs/plugin-react";
import { type ProxyOptions, defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

// Forward Flowgro / api / actuator calls to the backend so the browser sees
// them as same-origin (no CORS preflight). Mirrors the proxy strategy used by
// the host Next.js app, but in Vite dev server form.
const BACKEND_PROXY_TARGET =
  process.env.BACKEND_PROXY_TARGET ?? "http://localhost:8180";

function backendProxy(): ProxyOptions {
  return {
    target: BACKEND_PROXY_TARGET,
    changeOrigin: true,
    secure: false,
    configure: (proxy) => {
      proxy.on("proxyReq", (proxyReq, req) => {
        const ct = req.headers["content-type"] ?? "";
        const cl = req.headers["content-length"] ?? "";
        const auth = req.headers.authorization ? "[Bearer present]" : "[none]";
        const createdBy = req.headers["created-by"] ?? "[none]";
        // biome-ignore lint/suspicious/noConsole: dev-only proxy logging
        console.log(
          `[vite-proxy] ${req.method} ${req.url} | ct=${ct} | cl=${cl} | auth=${auth} | created-by=${createdBy}`,
        );
        // Show all headers seen by the proxy for POST/PUT requests on /drafts.
        if (
          (req.method === "POST" || req.method === "PUT") &&
          (req.url ?? "").includes("/drafts")
        ) {
          // biome-ignore lint/suspicious/noConsole: dev-only proxy logging
          console.log(
            `[vite-proxy]   headers seen: ${JSON.stringify(req.headers, null, 0)}`,
          );
          // biome-ignore lint/suspicious/noConsole: dev-only proxy logging
          console.log(
            `[vite-proxy]   proxied headers: ${JSON.stringify(proxyReq.getHeaders(), null, 0)}`,
          );
        }
      });
      proxy.on("proxyRes", (proxyRes, req) => {
        if ((req.url ?? "").includes("/drafts")) {
          // biome-ignore lint/suspicious/noConsole: dev-only proxy logging
          console.log(
            `[vite-proxy] ← ${proxyRes.statusCode} ${req.method} ${req.url}`,
          );
        }
      });
      proxy.on("error", (err, req) => {
        // biome-ignore lint/suspicious/noConsole: dev-only proxy logging
        console.log(
          `[vite-proxy] ERROR ${req.method} ${req.url}: ${err.message}`,
        );
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  resolve: {
    alias: {
      auth: path.resolve(__dirname, "src/auth"),
      context: path.resolve(__dirname, "src/context"),
      hooks: path.resolve(__dirname, "src/hooks"),
      layout: path.resolve(__dirname, "src/layout"),
      pages: path.resolve(__dirname, "src/pages"),
      routes: path.resolve(__dirname, "src/routes"),
    },
  },
  server: {
    port: 3001,
    strictPort: true,
    // Backend Flowgro APIs live under /flowgro/v1/* and /flowgro/integration/*;
    // the bare /flowgro/* prefix is owned by client-side React Router
    // (flowgro/flowDesign, flowgro/deployment, flowgro/process-cockpit,
    // flowgro/my-tasks), so it MUST NOT be proxied — otherwise SPA navigation
    // hits the backend and 401s.
    proxy: {
      "/flowgro/v1": backendProxy(),
      "/flowgro/integration": backendProxy(),
      "/api": backendProxy(),
      "/actuator": backendProxy(),
    },
  },
  build: {
    outDir: "dist",
    sourcemap: false,
    chunkSizeWarningLimit: 4000,
  },
  cacheDir: ".vite",
});
