const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function setupProxy(app) {
  app.use(
    "/storage-proxy",
    createProxyMiddleware({
      target: "https://transformer.treffertech.com",
      changeOrigin: true,
      pathRewrite: {
        "^/storage-proxy": "",
      },
    })
  );
};
