const { merge } = require('webpack-merge')
const path = require('path')

const config = require('./webpack.config')

module.exports = merge(config, {
  mode: 'development',

  devtool: 'inline-source-map',
  devServer: {
    devMiddleware: {
      writeToDisk: true
    },
    historyApiFallback: true,
    // contentBase deprecated
    static: {
      directory: path.resolve(__dirname, 'static')
    },
    // open: true,
    compress: true,
    hot: true,
    port: 8080,
  },

  output: {
    path: path.resolve(__dirname, 'dev'),
    filename: 'index.js'
  }
})
