const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
    app.use(
        [
            '/content',
            '/etc.clientlibs/*/clientlibs/clientlib-base.*.*',
        ],
        createProxyMiddleware({
            target: 'http://localhost:4502',
            changeOrigin: true,
        })
    );
};
