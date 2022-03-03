const webpack = require('webpack');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');

const path = require('path');
const argvs = require('yargs').argv;
const devMode = process.env.WEBPACK_SERVE || argvs.mode === 'development';

const DEFAULT_PORT = 8080;
const host = process.env.MONACA_SERVER_HOST || argvs.host || '0.0.0.0';
const port = argvs.port || DEFAULT_PORT;
const socketProtocol = process.env.MONACA_TERMINAL ? 'wss' : 'ws';

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
        // Mark files inside `@angular/core` as using SystemJS style dynamic imports.
        // Removing this will cause deprecation warnings to appear.
        test: /(\\|\/)@angular(\\|\/)core(\\|\/).+\.js$/,
        parser: { system: true },
      },
      {
        test: /\.html$/,
        use: [
          {
            loader: 'html-loader',
            options: {
              minimize: true,
              removeAttributeQuotes: false,
              keepClosingSlash: true,
              caseSensitive: true,
              conservativeCollapse: true
            }
          }
        ]
      },
      {
        test: /\.(png|jpe?g|gif|svg|woff|woff2|ttf|eot|ico)(\?\S*)?$/,
        type: 'asset/resource',
        generator: {
          filename: 'assets/[name].[hash].[ext]'
        }
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
    new MiniCssExtractPlugin({
      filename: '[name].css',
      chunkFilename: '[name].css'
    }),
    new ProgressBarPlugin(),
    new webpack.DefinePlugin({
      '__PROCESS__': {
        'PROD': !devMode,
      }
    }),
    new webpack.ContextReplacementPlugin( /angular(\\|\/)core(\\|\/)/, path.resolve(__dirname, './src') )
  ],

  resolveLoader: {
    modules: [ 'node_modules' ]
  },

  performance: {
    hints: false
  }
}

// Development mode
if(devMode) {

  webpackConfig.devtool = 'eval';

  webpackConfig.devServer = {
    port: port,
    host: host,
    allowedHosts: 'all',
    client: {
      webSocketURL: `${socketProtocol}://${host}:${port}/ws`,
    },
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
    }
  }

  // ignore all warnings - System.import() is deprecated and will be removed soon. Use import() instead.
  webpackConfig.ignoreWarnings = [
    (warning) => true,
  ];

  let devPlugins = [
    new HtmlWebPackPlugin({
      template: 'src/public/index.html.ejs',
      chunksSortMode: 'auto'
    })
  ];

  webpackConfig.plugins = webpackConfig.plugins.concat(devPlugins);

} else {

  // Production mode
  let prodPlugins = [
    new HtmlWebPackPlugin({
      template: 'src/public/index.html.ejs',
      chunksSortMode: 'auto',
      externalCSS: ['components/loader.css'],
      externalJS: ['components/loader.js'],
      minify: {
        caseSensitive: true,
        collapseWhitespace: true,
        conservativeCollapse: true,
        removeAttributeQuotes: true,
        removeComments: true
      }
    })
  ];
  webpackConfig.plugins = webpackConfig.plugins.concat(prodPlugins);

}

module.exports = webpackConfig;
