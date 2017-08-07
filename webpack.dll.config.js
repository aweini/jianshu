const webpack = require('webpack');

const vendors = [
  'react',
  'react-dom',
  'react-router',
  'jquery',
  'react-router-dom',
  'semantic-ui'
  
];

module.exports = {
  output: {
    path: 'build',
    filename: '[name].[chunkhash].js',
    library: '[name]_[chunkhash]',
  },
  entry: {
    vendor: vendors,
  },
  plugins: [
    new webpack.DllPlugin({
      path: 'manifest.json',
      name: '[name]_[chunkhash]',
      context: __dirname,
    }),
  ],
};