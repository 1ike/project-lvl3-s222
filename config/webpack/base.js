// import webpack from 'webpack';
import path from 'path';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import CleanWebpackPlugin from 'clean-webpack-plugin';
import autoprefixer from 'autoprefixer';

export default () => ({
  entry: ['./src/js/index.js', './src/sass/main.scss'],
  output: {
    filename: 'js/webpack-package.js',
  },
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: 'babel-loader',
          options: {
            cacheDirectory: true,
            presets: [
              ['env', {
                modules: false,
                targets: {
                  browsers: '> 0%',
                  uglify: true,
                },
                useBuiltIns: true,
              }],
            ],

            plugins: [
              'syntax-dynamic-import',
            ],
          },
        },
      },
      {
        test: /\.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader', // translates CSS into CommonJS modules
            options: {
              sourceMap: true,
            },
          }, {
            loader: 'postcss-loader', // Run post css actions
            options: {
              plugins: [
                autoprefixer({
                  browsers: ['> 1%', 'last 2 versions'],
                }),
              ],
              sourceMap: true,
            },
          }, {
            loader: 'sass-loader',
            options: {
              sourceMap: true,
            },
          }],
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin(['dist'], {
      root: path.resolve('.'),
    }),
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: 'css/[name].css',
      // chunkFilename: "[id].css"
    }),
    new HtmlWebpackPlugin({
      template: 'src/index.html',
      title: 'RSS Reader',
    }),
  ],
/*   optimization: {
    minimize: false,
    runtimeChunk: { name: 'vendor' },
    splitChunks: {
      cacheGroups: {
        default: false,
        commons: {
          test: /\.js$/,
          chunks: 'all',
          minChunks: Infinity,
          name: 'vendor',
          enforce: true,
        },
      },
    },
  }, */
});
