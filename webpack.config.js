const path = require('path');

const HtmlWebPackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const webpack = require('webpack');

module.exports = {
  entry: {
    index: ['./src/index.css', './src/init.js']
  },
  node: false,
  output: {
    path: path.join(__dirname, 'dist'),
    chunkFilename: 'chunks/[id].js',
    //publicPath: '/website/mapservice/',
    clean: true
  },
  devServer: {
    static: path.join(__dirname, 'dist'),
    compress: true,
    port: 3001,
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        enforce: "pre",
        use: ["source-map-loader"],
      },
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader'
        ]
      },
    ]
  },
  resolve: {
    alias: {
        jquery: "jquery/src/jquery"
    }
  },
  plugins: [
    new HtmlWebPackPlugin({
      title: 'Output Management',
      template: './public/index.html',
      filename: './index.html',
      chunksSortMode: 'none',
      inlineSource: '.(css)$'
    }),
    new MiniCssExtractPlugin({
      filename: "[name].[chunkhash].css",
      chunkFilename: "[id].css"
    }),
    new webpack.ProvidePlugin({
      $: "jquery",
      jQuery: "jquery"
    })
  ]
};
