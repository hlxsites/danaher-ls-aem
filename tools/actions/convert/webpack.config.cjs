const path = require('path');
const webpack = require('webpack');

module.exports = {
    devtool: false,
    target: 'node',
    entry: './src/index.js',
    output: {
        filename: 'main.js',
        path: path.resolve(__dirname, 'dist'),
        library: {
            type: 'commonjs',
        },
    },
    plugins: [
        new webpack.optimize.LimitChunkCountPlugin({ maxChunks: 1 }),
        new webpack.IgnorePlugin({ resourceRegExp: /canvas/ })
    ],
};