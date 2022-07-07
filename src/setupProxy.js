const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      // target: 'http://111.231.115.242:3000',
      target: 'http://localhost:3000',
      changeOrigin: true,
			pathRewrite:{
				'^/api/':'/'
			}
    })
  );
};
