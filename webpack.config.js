// eslint-disable-next-line import/no-extraneous-dependencies
const CopyWebpackPlugin = require('copy-webpack-plugin');
// eslint-disable-next-line import/extensions
const packageJson = require('./package.json');

// remove all fileInclude properties from the json
packageJson.copyDependencies.forEach((dependency) => {
  delete dependency.fileInclude;
});

module.exports = {
  entry: {},
  output: {
    path: __dirname,
  },
  plugins: [
    new CopyWebpackPlugin({
      patterns: packageJson.copyDependencies,
    }),
  ],
};
