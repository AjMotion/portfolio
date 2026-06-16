import fs from "fs";
import path from "path";
import { renderErrorPage } from "./lib/error-page";

let indexHtmlCache: string | null = null;

function getIndexHtml(): string {
  if (indexHtmlCache) return indexHtmlCache;
  
  try {
    const indexPath = path.join(process.cwd(), "dist/client/index.html");
    indexHtmlCache = fs.readFileSync(indexPath, "utf-8");
    return indexHtmlCache;
  } catch (e) {
    console.error("Failed to read index.html:", e);
    return renderErrorPage();
  }
}

export default async (req: any, res: any) => {
  try {
    // Serve static files from dist/client
    const url = new URL(req.url, `http://${req.headers.host}`);
    const pathname = url.pathname;

    // Check if requesting a static asset
    if (pathname.startsWith("/_")) {
      const assetPath = path.join(process.cwd(), "dist/client", pathname);
      try {
        const content = fs.readFileSync(assetPath);
        res.setHeader("cache-control", "public, max-age=31536000, immutable");
        res.end(content);
        return;
      } catch {
        res.statusCode = 404;
        res.end("Not found");
        return;
      }
    }

    // Serve index.html for all other routes (SPA mode)
    const html = getIndexHtml();
    res.setHeader("content-type", "text/html; charset=utf-8");
    res.setHeader("cache-control", "no-cache, no-store, must-revalidate");
    res.end(html);
  } catch (error) {
    console.error("Server error:", error);
    res.statusCode = 500;
    res.setHeader("content-type", "text/html; charset=utf-8");
    res.end(renderErrorPage());
  }
};
