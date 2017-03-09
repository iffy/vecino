const webpack = require('webpack');
const WebpackNotifierPlugin = require('webpack-notifier');

module.exports = {
  entry: [
    './style.css',
    './js/main.jsx',
  ],
  output: {
    filename: 'src/bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          "style-loader",
          "css-loader",
        ],
      },
      {
        test: /.jsx?$/,
        use: [
          'babel-loader',
        ],
        exclude: /node_modules/,
      }
    ],
  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
      },
      output: {
        comments: false,
      },
    }),
    new WebpackNotifierPlugin({alwaysNotify: true}),
  ],
};
