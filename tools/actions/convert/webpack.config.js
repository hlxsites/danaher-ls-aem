const path = require('path');
const webpack = require('webpack');

module.exports = {
    mode: 'development',
    devtool: 'source-map',
    target: 'node',
    output: {
        filename: 'main.js',
        path: path.resolve(__dirname, 'dist'),
        library: {
            type: 'commonjs',
        },
    },
    resolve: {
        modules: [
            'node_modules',
            // fallback to resolution within an absolute path to support require of files outside of the actions path.
            path.resolve(__dirname, 'node_modules'),
        ],
        alias: {
            // alias for helix-m2docx as it has a dependency to adobe/fetch which did not build well with webpack:
            // https://github.com/webpack/webpack/issues/16724 (even though its closed, still a problem with 5.88.2)
            // (and we don't need it anyway)
            '@adobe/helix-md2docx': false
        }
    },
    plugins: [
        new webpack.optimize.LimitChunkCountPlugin({ maxChunks: 1 }),
        // Provide dependencies/context for import.js
        new webpack.ProvidePlugin({
            'WebImporter': '@adobe/helix-importer',
            'decodeHtmlEntities': ['html-entities', 'decode'],
        }),
        new webpack.DefinePlugin({
            'window': null
        }),
        // for those jsdom dependencies we want to throw a missing module error if they would be used on the execution 
        // path
        new webpack.IgnorePlugin({ resourceRegExp: /canvas/ }),
        new webpack.IgnorePlugin({ resourceRegExp: /bufferutil/ }),
        new webpack.IgnorePlugin({ resourceRegExp: /utf-8-validate/ }),
    ],
    module: {
        rules: [
            {
                test: /\.ya?ml$/,
                use: 'yaml-loader'
            }
        ]
    }
};