export default {
  async fetch(request, env, ctx) {
    const origin = request.headers.get("Origin");

    // OPTIONS 预检
    if (request.method === "OPTIONS") {
      if (origin && isAllowedOrigin(origin)) {
        return new Response(null, {
          status: 204,
          headers: corsHeaders(origin)
        });
      } else {
        return new Response("Forbidden", { status: 403 });
      }
    }

    // 直接代理给静态资源服务
    const response = await env.ASSETS.fetch(request);

    // 添加 CORS 响应头
    if (origin && isAllowedOrigin(origin)) {
      const newHeaders = new Headers(response.headers);
      newHeaders.set("Access-Control-Allow-Origin", origin);
      newHeaders.set("Vary", "Origin");
      return new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers: newHeaders
      });
    }

    return response;
  }
};

function isAllowedOrigin(origin) {
  return [
    "https://yukun.bio",
    "https://his2nd.life",
    "https://giscus.app"
  ].includes(origin);
}

function corsHeaders(origin) {
  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Methods": "GET,HEAD,POST,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400",
    "Vary": "Origin"
  };
}
