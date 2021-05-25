const injectScripts = require('webpack-dev-server-inject-scripts');


module.exports = {
    devServer: (devServerConfig) => {
        const before = devServerConfig.before;
        devServerConfig.before = (app, server, compiler) => {
            app.use(injectScripts(compiler));
            before(app, server, compiler);
        };
        return devServerConfig;
    },
};
