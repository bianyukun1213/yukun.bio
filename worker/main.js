import { WorkerEntrypoint } from "cloudflare:workers";

// ✅ CORS 白名单
const ALLOWED_ORIGINS = [
  "https://yukun.bio",
  "https://his2nd.life",
  "https://giscus.app"
];

export default class extends WorkerEntrypoint {
  async fetch(request, env, ctx) {
    const origin = request.headers.get("Origin");

    // ✅ CORS 预检请求
    if (request.method === "OPTIONS") {
      return this.handlePreflight(origin);
    }

    // ✅ 获取静态资源（来自 Pages / R2 / ASSETS 绑定）
    const assetResponse = await env.ASSETS.fetch(request);

    // ✅ 添加 CORS 头
    return this.applyCORSHeaders(assetResponse, origin);
  }

  // 处理 OPTIONS 请求
  handlePreflight(origin) {
    if (origin && ALLOWED_ORIGINS.includes(origin)) {
      return new Response(null, {
        status: 204,
        headers: {
          "Access-Control-Allow-Origin": origin,
          "Access-Control-Allow-Methods": "GET,HEAD,POST,OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
          "Access-Control-Max-Age": "86400",
          "Vary": "Origin"
        }
      });
    }

    return new Response("Forbidden", { status: 403 });
  }

  // 为响应添加 CORS 头
  applyCORSHeaders(response, origin) {
    if (origin && ALLOWED_ORIGINS.includes(origin)) {
      const headers = new Headers(response.headers);
      headers.set("Access-Control-Allow-Origin", origin);
      headers.set("Vary", "Origin");

      return new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers
      });
    }

    return response;
  }
}
