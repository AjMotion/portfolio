import "./lib/error-capture";
import { renderErrorPage } from "./lib/error-page";

let cachedEntry: any;

async function getServerEntry() {
  if (!cachedEntry) {
    try {
      cachedEntry = await import("@tanstack/react-start/server-entry");
    } catch (e) {
      console.error("Failed to load server entry:", e);
      throw e;
    }
  }
  return cachedEntry.default || cachedEntry;
}

// Web API handler
async function fetchHandler(request: Request): Promise<Response> {
  try {
    const entry = await getServerEntry();
    if (entry && typeof entry.fetch === "function") {
      return await entry.fetch(request);
    }
    throw new Error("Server entry does not have a fetch function");
  } catch (error) {
    console.error("Server error:", error);
    return new Response(renderErrorPage(), {
      status: 500,
      headers: { "content-type": "text/html; charset=utf-8" },
    });
  }
}

// Node.js req/res handler for Vercel
async function nodeHandler(req: any, res: any) {
  try {
    const request = new Request(`http://${req.headers.host}${req.url}`, {
      method: req.method,
      headers: req.headers,
      body: ["GET", "HEAD"].includes(req.method) ? undefined : req,
    });

    const response = await fetchHandler(request);
    res.statusCode = response.status;
    response.headers.forEach((value, key) => {
      res.setHeader(key, value);
    });
    
    if (response.body) {
      res.end(await response.text());
    } else {
      res.end();
    }
  } catch (error) {
    console.error("Handler error:", error);
    res.statusCode = 500;
    res.setHeader("content-type", "text/html; charset=utf-8");
    res.end(renderErrorPage());
  }
}

export default nodeHandler;
