const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function setupProxy(app) {
  app.use(
    "/storage-proxy",
    createProxyMiddleware({
      target: "https://design.trafointel.com",
      changeOrigin: true,
      pathRewrite: {
        "^/storage-proxy": "",
      },
    })
  );
};
