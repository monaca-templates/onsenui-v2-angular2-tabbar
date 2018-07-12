const webpack = require('webpack');
const HtmlWebPackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const ProgressBarPlugin = require('progress-bar-webpack-plugin');

const path = require("path");
const argvs = require('yargs').argv;
const devMode = process.env.WEBPACK_SERVE || argvs.mode === 'development';

const DEFAULT_PORT = '8000';
const host = process.env.MONACA_TERMINAL ? '0.0.0.0': ( argvs.host ? argvs.host : '0.0.0.0' );
const port = process.env.MONACA_TERMINAL ? argvs.port: ( argvs.port ? argvs.port : DEFAULT_PORT );
const protocol = process.env.MONACA_TERMINAL ? 'https' : 'http';

let webpackConfig = {
  mode: devMode ? 'development' : 'production',

  entry: {
    app: ['./src/polyfills.ts', './src/main.ts', './src/vendor.ts'],
  },

  output: {
    path: path.resolve(__dirname, 'www'),
    filename: '[name].js'
  },

  optimization: {
    removeAvailableModules: true,
    splitChunks: {
      chunks: 'all'
    },
    runtimeChunk: true,
    removeEmptyChunks: true,
    providedExports: true
  },

  resolve: {
    extensions: ['.ts', '.js', '.tsx', '.json', '.css', '.html', '.styl'],
    modules: [
      path.resolve(__dirname, 'src'),
      'node_modules'
    ]
  },

  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [
          {
            loader: 'ts-loader',
            options: {
              transpileOnly: true
            }
          }
        ]
      },
      {
        test: /\.html$/,
        use: [
          {
            loader: 'html-loader',
            options: { minimize: true }
          }
        ]
      },
      {
        test: /\.(png|jpe?g|gif|svg|woff|woff2|ttf|eot|ico)(\?\S*)?$/,
        loader: 'file-loader?name=assets/[name].[hash].[ext]'
      },
      {
        test: /\.css$/,
        use: [          
          devMode ? 'style-loader' : MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: { importLoaders: 1 }
          },
          {
            loader: 'postcss-loader',
            options: { sourceMap: true }
          }
        ]
      },
      {
        test: /\.json$/,
        loader: 'json-loader'
      }
    ],

    noParse: [/.+zone\.js\/dist\/.+/, /.+angular2\/bundles\/.+/, /angular2-polyfills\.js/]
  },

  plugins: [
    new HtmlWebPackPlugin({
      template: 'src/public/index.html.ejs',
      chunksSortMode: 'dependency'
    }),
    new MiniCssExtractPlugin({
      filename: "[name].css",
      chunkFilename: "[name].css"
    }),
    new ProgressBarPlugin(),
    new webpack.DefinePlugin({
      '__PROCESS__': {
        'PROD': !devMode,
      }
    })
  ],

  resolveLoader: {
    modules: [ 'node_modules' ]
  },
 
  performance: {
    hints: false
  }
}

/*
* Dev
*/
if(devMode) {

  webpackConfig.devtool = 'eval';

  webpackConfig.serve = {
    port: port,
    host: host,
    devMiddleware: {
      publicPath: '/',
      stats: {
        colors: true,
        errorDetails: true,
        performance: true,
        source: true,
        warnings: true,
        builtAt: true,
      }
    },
    hotClient: true,
    hmr: true,
    reload: true
  }

  let devPlugins = [
    new webpack.LoaderOptionsPlugin({ debug: true }),
  ];
  
  webpackConfig.plugins = webpackConfig.plugins.concat( devPlugins　);
}

module.exports = webpackConfig;
