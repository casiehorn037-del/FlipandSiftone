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
  // Try multiple possible paths for the static files
  const possiblePaths = [
    path.resolve(import.meta.dirname, "public"),           // dist/public (if server is at dist/index.js)
    path.resolve(import.meta.dirname, "..", "public"),     // dist/public (if server is at dist/_core/index.js)
    path.resolve(process.cwd(), "dist", "public"),         // ./dist/public from cwd
    path.resolve("/opt/render/project/src/dist/public"),   // Render absolute path
  ];
  
  console.log("[serveStatic] __dirname:", import.meta.dirname);
  console.log("[serveStatic] CWD:", process.cwd());
  
  let distPublicPath: string | null = null;
  
  for (const testPath of possiblePaths) {
    const exists = fs.existsSync(testPath);
    console.log(`[serveStatic] Checking: ${testPath} - exists: ${exists}`);
    if (exists && !distPublicPath) {
      distPublicPath = testPath;
    }
  }
  
  if (!distPublicPath) {
    console.error("[serveStatic] ERROR: Could not find dist/public in any location");
    
    // List what's in various directories for debugging
    try {
      console.error("[serveStatic] Listing CWD:", process.cwd());
      console.error("[serveStatic] Files in CWD:", fs.readdirSync(process.cwd()));
    } catch (e) {
      console.error("[serveStatic] Could not list CWD:", e);
    }
    
    try {
      const distPath = path.resolve(process.cwd(), "dist");
      if (fs.existsSync(distPath)) {
        console.error("[serveStatic] Listing dist/:", fs.readdirSync(distPath));
      } else {
        console.error("[serveStatic] dist/ does not exist");
      }
    } catch (e) {
      console.error("[serveStatic] Could not list dist/:", e);
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
            <p>Checked paths:</p>
            <ul>
              ${possiblePaths.map(p => `<li>${p}</li>`).join('')}
            </ul>
            <p>CWD: ${process.cwd()}</p>
            <p>__dirname: ${import.meta.dirname}</p>
          </body>
        </html>
      `);
    });
    return;
  }
  
  console.log("[serveStatic] Serving from:", distPublicPath);

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
