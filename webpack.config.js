const path = require('path')
const webpack = require('webpack')
const glob = require('glob-all')
const PurgecssPlugin = require('purgecss-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')

class TailwindExtractor {
  static extract(content) {
    return content.match(/[A-z0-9-:\/]+/g) || []
  }
}

const config = {
  context: path.resolve(__dirname, 'src'),
  mode: process.env.NODE_ENV,
  resolve: {
    extensions: ['.js', '.json', '.vue'],
    alias: {
      '~': path.join(__dirname, 'src/app/')
    }
  },
  entry: {
    app: path.resolve(__dirname, 'src/app.js'),
    styles: path.resolve(__dirname, 'src/app.css'),
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
  },
  module: {
    rules: [
      {
        test: /\.js$/i,
        use: [{
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
            sourceMap: true,
          },
        }],
      },
      {
        test: /\.css$/i,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            { loader: 'css-loader', options: { importLoaders: 1 } },
            'postcss-loader',
          ],
        }),
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      }
    ],
  },
  plugins: [
    new ExtractTextPlugin('app.css'),
    new VueLoaderPlugin(),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'index.html',
    })
  ],
}

if (process.env.NODE_ENV === 'production') {
  config.output.filename = '[name].js'
  config['plugins'].push(
    new PurgecssPlugin({

      // Specify the locations of any files you want to scan for class names.
      paths: glob.sync([
        path.join(__dirname, 'src/**/*.vue'),
        path.join(__dirname, 'src/**/*.html')
      ]),
      extractors: [
        {
          extractor: TailwindExtractor,

          // Specify the file extensions to include when scanning for class names.
          extensions: ['html', 'js', 'vue']
        }
      ]
    })
  )

  config.plugins.push(
    new OptimizeCssAssetsPlugin({
      assetNameRegExp: /\.css$/,
      cssProcessorOptions: { discardComments: { removeAll: true } }
    })
  )
}

module.exports = config