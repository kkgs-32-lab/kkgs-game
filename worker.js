const NOT_FOUND_HTML = "<!DOCTYPE html>\n<html lang=\"ja\">\n\n<head>\n  <meta charset=\"utf-8\">\n  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n  <title>404 Not Found | KKGS-32</title>\n  <link rel=\"icon\" type=\"image/svg+xml\" href=\"/icon/favicon.svg\">\n  <style>\n    body {\n      margin: 0;\n      font-family: 'Noto Sans JP', system-ui, -apple-system, Segoe UI, Helvetica, Arial, sans-serif;\n      background: #fff;\n      color: #063f5c;\n    }\n\n    .error_404 {\n      max-width: 470px;\n      width: 94%;\n      margin: 22vh auto 140px;\n    }\n\n    .error_404 .stit {\n      font-size: 64px;\n      font-weight: bold;\n      letter-spacing: 0.1em;\n      margin-bottom: 34px;\n      line-height: 1em;\n    }\n\n    .error_404 p {\n      font-size: 14px;\n      line-height: 1.5em;\n    }\n\n    .error_404 a {\n      background-color: #48c5f4;\n      display: block;\n      color: #fff;\n      text-align: center;\n      line-height: 1em;\n      font-size: 20px;\n      padding: 16px 0;\n      width: 100%;\n      margin: 34px auto 0;\n      letter-spacing: 0.1em;\n      border-radius: 5px;\n      font-weight: bold;\n      text-decoration: none;\n    }\n  </style>\n</head>\n\n<body>\n  <div class=\"error_404\">\n    <p class=\"stit\">NOT FOUND</p>\n    <p>\u304a\u63a2\u3057\u306e\u30da\u30fc\u30b8\u306f\u300c\u3059\u3067\u306b\u524a\u9664\u3055\u308c\u3066\u3044\u308b\u300d\u300c\u516c\u958b\u671f\u9593\u304c\u7d42\u308f\u3063\u3066\u3044\u308b\u300d\u300c\u30a2\u30af\u30bb\u30b9\u3057\u305f\u30a2\u30c9\u30ec\u30b9\u304c\u7570\u306a\u3063\u3066\u3044\u308b\u300d\u306a\u3069\u306e\u7406\u7531\u3067\u898b\u3064\u304b\u308a\u307e\u305b\u3093\u3067\u3057\u305f\u3002</p>\n    <a href=\"/\">TOP</a>\n  </div>\n</body>\n\n</html>";

function notFound(request) {
  const accept = request.headers.get("Accept") || "";
  const dest = request.headers.get("Sec-Fetch-Dest") || "";
  const mode = request.headers.get("Sec-Fetch-Mode") || "";
  const wantsHtml = accept.includes("text/html") || dest === "document" || mode === "navigate";
  if (!wantsHtml) return new Response("Not Found", { status: 404 });
  const headers = new Headers({ "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store" });
  return new Response(NOT_FOUND_HTML, { status: 404, headers });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;
    if (path === "/delete" || path.startsWith("/delete/")) {
      return Response.redirect(`${url.origin}/#delete`, 302);
    }
    if (path === "/blocked" || path.startsWith("/blocked/")) {
      return Response.redirect(`${url.origin}/#blocked`, 302);
    }
    const response = await env.ASSETS.fetch(request);
    if (response.status !== 404) return response;
    if (request.method !== "GET" && request.method !== "HEAD") return response;
    return notFound(request);
  }
};
