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
  // In production, the server is bundled to dist/index.js
  // The client build output is at dist/public (relative to project root)
  // When running from dist/index.js, we need to go up one level to find dist/public
  
  const distPublicPath = path.resolve(import.meta.dirname, "..", "public");
  
  console.log("[serveStatic] __dirname:", import.meta.dirname);
  console.log("[serveStatic] Attempting to serve from:", distPublicPath);
  console.log("[serveStatic] Path exists:", fs.existsSync(distPublicPath));
  
  if (!fs.existsSync(distPublicPath)) {
    console.error("[serveStatic] ERROR: dist/public not found at", distPublicPath);
    console.error("[serveStatic] CWD:", process.cwd());
    
    // List what's in the current directory for debugging
    try {
      const files = fs.readdirSync(process.cwd());
      console.error("[serveStatic] Files in CWD:", files);
    } catch (e) {
      console.error("[serveStatic] Could not list CWD:", e);
    }
    
    // Return error for all routes
    app.get("*", (_req, res) => {
      res.status(500).send(`
        <!DOCTYPE html>
        <html>
          <head><title>FlipandSift - Error</title></head>
          <body style="font-family: sans-serif; padding: 40px;">
            <h1>Build Error</h1>
            <p>The frontend build files are missing.</p>
            <p>Expected path: ${distPublicPath}</p>
            <p>Current directory: ${process.cwd()}</p>
          </body>
        </html>
      `);
    });
    return;
  }

  // Serve static files
  app.use(express.static(distPublicPath, {
    maxAge: "1d",
    etag: true
  }));

  // SPA fallback - serve index.html for all non-API routes
  app.get("*", (req, res) => {
    // Don't interfere with API routes
    if (req.path.startsWith("/api/")) {
      return res.status(404).json({ error: "API endpoint not found" });
    }
    
    const indexPath = path.join(distPublicPath, "index.html");
    if (fs.existsSync(indexPath)) {
      res.sendFile(indexPath);
    } else {
      res.status(500).send("index.html not found in build");
    }
  });
}
