import express, { type Express } from "express";
import fs from "fs";
import { type Server } from "http";
import { nanoid } from "nanoid";
import path from "path";
import { createServer as createViteServer } from "vite";
import viteConfig from "../../vite.config";

export async function setupVite(app: Express, server: Server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true as const,
  };

  const vite = await createViteServer({
    ...viteConfig,
    configFile: false,
    server: serverOptions,
    appType: "custom",
  });

  app.use(vite.middlewares);
  app.use("*", async (req, res, next) => {
    const url = req.originalUrl;

    try {
      const clientTemplate = path.resolve(
        import.meta.dirname,
        "../..",
        "client",
        "index.html"
      );

      // always reload the index.html file from disk incase it changes
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e as Error);
      next(e);
    }
  });
}

export function serveStatic(app: Express) {
  // In production, the server is bundled to dist/index.js by esbuild
  // The client build output is at dist/public (from vite.config.prod.ts)
  // So from dist/index.js, dist/public is at ./public (same directory)
  
  const distPublicPath = path.resolve(import.meta.dirname, "public");
  
  console.log("[serveStatic] __dirname:", import.meta.dirname);
  console.log("[serveStatic] Serving from:", distPublicPath);
  console.log("[serveStatic] Path exists:", fs.existsSync(distPublicPath));
  
  if (!fs.existsSync(distPublicPath)) {
    console.error("[serveStatic] ERROR: dist/public not found");
    
    app.use("*", (_req, res) => {
      res.status(500).send(`
        <!DOCTYPE html>
        <html>
          <head><title>FlipandSift - Error</title></head>
          <body style="font-family: sans-serif; padding: 40px;">
            <h1>Build Error</h1>
            <p>The frontend build files are missing.</p>
            <p>Expected: ${distPublicPath}</p>
          </body>
        </html>
      `);
    });
    return;
  }

  // Serve static files (CSS, JS, images, etc.)
  app.use(express.static(distPublicPath));

  // For ALL non-API routes, serve index.html (SPA fallback)
  // This must be AFTER express.static
  app.get("*", (req, res, next) => {
    // Skip API routes
    if (req.path.startsWith("/api/")) {
      return next();
    }
    
    // Serve index.html for all other routes
    res.sendFile(path.join(distPublicPath, "index.html"));
  });
}
