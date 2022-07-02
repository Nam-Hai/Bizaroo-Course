const webpack = require('webpack')
const path = require('path')

const CopyWebpackPlugin = require('copy-webpack-plugin')
const MiniCssExtratPlugin = require('mini-css-extract-plugin')
const ImageMinimizerPlugin = require("image-minimizer-webpack-plugin");
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const TerserPlugin = require("terser-webpack-plugin");

// const { dir } = require('console')

const IS_DEVELOPMENT = process.env.NODE_ENV === 'dev'

const dirApp = path.join(__dirname, 'app')
const dirShared = path.join(__dirname, 'shared')
const dirStyles = path.join(__dirname, 'styles')
const dirFonts = path.join(__dirname, 'fonts')
const dirImages = path.join(__dirname, 'images')


const dirNode = 'node_modules'

console.log(dirApp, dirShared, dirStyles, dirFonts);

module.exports = {
  entry: [
    path.join(dirApp, 'index.js'),
    path.join(dirStyles, 'index.scss')
  ],

  resolve: {
    modules: [
      dirApp,
      dirShared,
      dirStyles,
      dirImages,
      dirFonts,
      dirNode
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      IS_DEVELOPMENT
    }),
    // permet d'import dans tout tes js les lib que tu veux
    // new webpack.ProvidePlugin({

    // }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: './shared',
          to: 'assets'
        },
        {
          from: './fonts',
          to: 'fonts'
        }
      ]
    }),
    new MiniCssExtratPlugin({
      filename: '[name].css',
      chunkFilename: '[id].css'
    }),
    new ImageMinimizerPlugin({
      minimizer: {
        implementation: ImageMinimizerPlugin.imageminMinify,
        options: {
          // Lossless optimization with custom option
          // Feel free to experiment with options for better result for you
          plugins: [
            ["gifsicle", { interlaced: true }],
            ["jpegtran", { progressive: true }],
            ["optipng", { optimizationLevel: 5 }],
          ]
        }
      }
    }),
    new CleanWebpackPlugin()

  ],
  optimization: {
    minimize: true,
    // uglyfy
    minimizer: [new TerserPlugin()],
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: 'babel-loader'
        }
      },
      {
        test: /\.scss$/,
        use: [
          {
            loader: MiniCssExtratPlugin.loader,
            options: {
              publicPath: ''
            }
          },
          {
            loader: 'css-loader'
          },
          {
            loader: 'postcss-loader'
          },
          {
            loader: 'sass-loader'
          }
        ]
      },
      {
        test: /\.(jpe?g|png|gif|svg|fnt|webp)$/,
        loader: 'file-loader',
        options: {
          outputPath: 'http://localhost:3000/assets',
          // outputPath: 'assets',
          name(file) {
            return '[hash].[ext]'
          }
        }
      },
      // {
      //   test: /fonts\/.*\.(woff|woff2|eot|ttf|svg)$/,
      //   loader: 'file-loader',
      //   options: {
      //     outputPath: 'fonts',
      //     // outputPath: 'localhost:3000/fonts', // Development
      //     name(file) {
      //       return '[hash].[ext]'
      //     }
      //   }
      // },
      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        use: [
          {
            loader: ImageMinimizerPlugin.loader,
            // enforce: "pre",
            options: {
              minimizer: {
                implementation: ImageMinimizerPlugin.imageminMinify,
                options: {
                  plugins: [
                    "imagemin-gifsicle",
                    "imagemin-mozjpeg",
                    "imagemin-pngquant",
                    "imagemin-svgo",
                  ],
                },
              },
            },
          },
        ]
      },
      {
        test: /\.(glsl|frag|vert)$/,
        loader: 'raw-loader',
        exclude: /node_modules/
      },
      {
        test: /\.(glsl|frag|vert)$/,
        loader: 'glslify-loader',
        exclude: /node_modules/
      }
    ]
  }
}
