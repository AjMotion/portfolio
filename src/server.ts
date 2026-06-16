import fs from "fs";
import path from "path";
import { renderErrorPage } from "./lib/error-page";

let indexHtmlCache: string | null = null;

function getIndexHtml(): string {
  if (indexHtmlCache) return indexHtmlCache;
  
  try {
    // Try multiple possible paths for index.html
    const possiblePaths = [
      path.join(process.cwd(), "dist/client/index.html"),
      path.join(__dirname, "../client/index.html"),
      path.join(__dirname, "../../dist/client/index.html"),
    ];

    for (const indexPath of possiblePaths) {
      if (fs.existsSync(indexPath)) {
        console.log("Loading index.html from:", indexPath);
        indexHtmlCache = fs.readFileSync(indexPath, "utf-8");
        return indexHtmlCache;
      }
    }

    console.error("index.html not found in any of:", possiblePaths);
    return renderErrorPage();
  } catch (e) {
    console.error("Failed to read index.html:", e);
    return renderErrorPage();
  }
}

export default async (req: any, res: any) => {
  try {
    const url = new URL(req.url || "/", `http://${req.headers.host || "localhost"}`);
    const pathname = url.pathname;

    console.log("Request:", req.method, pathname);

    // Serve static assets from dist/client
    if (pathname.startsWith("/_") || pathname.match(/\.[a-z]+$/i)) {
      const assetPath = path.join(process.cwd(), "dist/client", pathname);
      try {
        if (fs.existsSync(assetPath)) {
          const content = fs.readFileSync(assetPath);
          res.setHeader("cache-control", "public, max-age=31536000, immutable");
          res.setHeader("content-type", getContentType(pathname));
          res.end(content);
          return;
        }
      } catch (err) {
        console.error("Asset error:", err);
      }
      res.statusCode = 404;
      res.setHeader("content-type", "text/plain");
      res.end("Not found");
      return;
    }

    // Serve index.html for all other routes (SPA mode)
    const html = getIndexHtml();
    res.setHeader("content-type", "text/html; charset=utf-8");
    res.setHeader("cache-control", "no-cache, no-store, must-revalidate");
    res.statusCode = 200;
    res.end(html);
  } catch (error) {
    console.error("Server error:", error);
    res.statusCode = 500;
    res.setHeader("content-type", "text/html; charset=utf-8");
    res.end(renderErrorPage());
  }
};

function getContentType(pathname: string): string {
  if (pathname.endsWith(".js")) return "application/javascript";
  if (pathname.endsWith(".css")) return "text/css";
  if (pathname.endsWith(".json")) return "application/json";
  if (pathname.endsWith(".svg")) return "image/svg+xml";
  if (pathname.endsWith(".png")) return "image/png";
  if (pathname.endsWith(".jpg") || pathname.endsWith(".jpeg")) return "image/jpeg";
  if (pathname.endsWith(".gif")) return "image/gif";
  if (pathname.endsWith(".woff2")) return "font/woff2";
  if (pathname.endsWith(".woff")) return "font/woff";
  return "application/octet-stream";
