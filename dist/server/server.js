let lastCapturedError = null;
function consumeLastCapturedError() {
  const error = lastCapturedError;
  lastCapturedError = null;
  return error;
}
function renderErrorPage() {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Error</title>
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
          }
          .container {
            background: white;
            border-radius: 8px;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
            padding: 40px;
            max-width: 600px;
            text-align: center;
          }
          h1 {
            color: #667eea;
            margin-bottom: 10px;
            font-size: 48px;
          }
          p {
            color: #666;
            font-size: 16px;
            line-height: 1.6;
            margin-bottom: 20px;
          }
          .error-code {
            background: #f5f5f5;
            border-left: 4px solid #667eea;
            padding: 15px;
            margin: 20px 0;
            text-align: left;
            font-family: monospace;
            font-size: 14px;
            color: #333;
            border-radius: 4px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>500</h1>
          <p>Oops! Something went wrong on our end.</p>
          <p>Our team has been notified. Please try again later.</p>
          <div class="error-code">
            Internal Server Error
          </div>
        </div>
      </body>
    </html>
  `;
}
let serverEntryPromise;
async function getServerEntry() {
  if (!serverEntryPromise) {
    serverEntryPromise = import("./assets/server-DmFqtuUc.js").then((n) => n.s).then(
      (m) => m.default ?? m
    );
  }
  return serverEntryPromise;
}
function brandedErrorResponse() {
  return new Response(renderErrorPage(), {
    status: 500,
    headers: { "content-type": "text/html; charset=utf-8" }
  });
}
const handler = async (request, env, ctx) => {
  const serverEntry = await getServerEntry();
  try {
    return await serverEntry.fetch(request, env, ctx);
  } catch (e) {
    console.error("SSR Error:", e);
    const lastError = consumeLastCapturedError();
    if (lastError) {
      console.error("Last captured error:", lastError);
    }
    return brandedErrorResponse();
  }
};
const fetch = handler;
export {
  handler as default,
  fetch,
  renderErrorPage as r
};
