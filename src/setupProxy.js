const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      // target: 'http://124.223.85.93:3000',
      target: 'http://localhost:3000',
      // target: 'https://syswing.icu',
      changeOrigin: true,
			pathRewrite:{
				'^/api/':'/'
			}
    })
  );
};
