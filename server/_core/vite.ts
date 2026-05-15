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
    path.resolve(import.meta.dirname, "..", "public"),      // dist/public (when server is at dist/index.js)
    path.resolve(import.meta.dirname, "..", "..", "dist", "public"), // project-root/dist/public
    path.resolve(process.cwd(), "dist", "public"),          // cwd/dist/public
    path.resolve("/opt/render/project/src/dist/public"),    // Render specific path
  ];

  let distPath: string | null = null;

  for (const testPath of possiblePaths) {
    console.log(`Checking path: ${testPath}`);
    if (fs.existsSync(testPath)) {
      console.log(`Found static files at: ${testPath}`);
      distPath = testPath;
      break;
    }
  }

  if (!distPath) {
    console.error("Could not find static files in any of the expected locations");
    console.error("Checked paths:", possiblePaths);
    console.error("Current directory:", process.cwd());
    console.error("__dirname:", import.meta.dirname);
    
    // Return a helpful error page
    app.use("*", (_req, res) => {
      res.status(500).send(`
        <html>
          <body>
            <h1>Server Error</h1>
            <p>Could not find static files. Please check the build.</p>
            <pre>Checked paths:\n${possiblePaths.join("\n")}</pre>
          </body>
        </html>
      `);
    });
    return;
  }

  console.log(`Serving static files from: ${distPath}`);
  app.use(express.static(distPath));

  // fall through to index.html if the file doesn't exist
  app.use("*", (_req, res) => {
    res.sendFile(path.resolve(distPath!, "index.html"));
  });
}
