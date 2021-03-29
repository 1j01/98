process.env.NODE_ENV = 'production';
process.env.BABEL_ENV = 'production';
process.on('unhandledRejection', err => {
    throw err;
});

const config = require('../config/webpack.config.js');
const webpack = require('webpack');

const compiler = webpack(config);
compiler.run((err, stats) => {
    if (err) {
        console.log('Error while building application', err);
    } else {
        if (stats.compilation.errors) {
            console.log(stats.compilation.errors);
        }
        console.log('Application successfully built');
    }
});
