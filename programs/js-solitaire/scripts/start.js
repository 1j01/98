process.env.NODE_ENV = 'development';
process.env.BABEL_ENV = 'development';
process.on('unhandledRejection', err => {
    throw err;
});

const WebpackDevServer = require('webpack-dev-server');
const webpack = require('webpack');
const config = require('../config/webpack.config.js');
const paths = require('../config/paths');

const PORT = 3000;
const HOST = 'localhost';

const serverConfig = {
    clientLogLevel: 'none',
    contentBase: paths.build,
    compress: true,
    port: PORT
};

const compiler = webpack(config);
const devServer = new WebpackDevServer(compiler, serverConfig);

devServer.listen(PORT, HOST, err => {
    if (err) return console.log(err);
    console.log(`Starting the development server on ${HOST}:${PORT}...`);
});

['SIGINT', 'SIGTERM'].forEach(sig => {
    process.on(sig, () => {
        devServer.close();
        process.exit();
    });
});
