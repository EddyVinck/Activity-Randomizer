const webpack = require('webpack');
const path = require('path');
// const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
// const HtmlWebpackPlugin = require('html-webpack-plugin');
const createPages = require('./webpack.functions');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
// const devMode = process.env.NODE_ENV !== 'production';

module.exports = (env, argv) => {
  console.log(`mode: ${argv.mode}`);

  const myWebpackConfig = {
    entry: {
      activityrandomizer: './src/js/activity-randomizer.js',
      common: './src/js/common.js',
    },

    output: {
      filename: '[name].entry.[hash].js',
      path: path.resolve(__dirname, 'dist'),
    },

    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          include: path.resolve(__dirname, 'src'),
          use: [
            {
              loader: 'babel-loader',
              options: {
                presets: ['env'],
                plugins: ['syntax-dynamic-import'],
              },
            },
            {
              loader: 'eslint-loader',
            },
          ],
        },
        {
          test: /\.(png|svg|jpg|gif|ico|webmanifest)$/,
          include: [path.resolve(__dirname, 'src/assets/img')],
          use: [
            {
              loader: 'file-loader',
              options: {
                name: '[name].[ext]',
                outputPath: 'assets/img/',
              },
            },
          ],
        },
        {
          test: /\.(woff|woff2|eot|ttf|otf|svg)$/,
          include: [path.resolve(__dirname, 'src/assets/fonts')],
          use: [
            {
              loader: 'file-loader',
              options: {
                name: '[name].[ext]',
                outputPath: 'assets/fonts/',
              },
            },
          ],
        },
        {
          test: /\.(scss|css)$/,
          use: [
            {
              loader: MiniCssExtractPlugin.loader,
              options: { publicPath: '../' },
            },
            {
              loader: 'css-loader',
              options: {
                sourceMap: true,
              },
            },
            {
              loader: 'sass-loader',
              options: {
                sourceMap: true,
              },
            },
          ],
        },
        {
          test: /\.pug$/,
          loader: 'pug-loader',

          options: {},
        },
      ],
    },

    devServer: {
      contentBase: './dist',
      compress: true,
      port: '9000',
    },
    watchOptions: {
      aggregateTimeout: 300,
      poll: 1000,
      ignored: /node_modules/,
    },
    resolve: {
      alias: {
        fontello: path.resolve(__dirname, 'src/assets/fonts/icons/fontello-icons'),
        img: path.resolve(__dirname, 'src/assets/img'),
      },
    },
    devtool: 'source-map',
    plugins: [
      new webpack.ProvidePlugin({
        $: 'jquery',
      }),
      new MiniCssExtractPlugin({
        filename: 'styles/[name].[hash].css',
        chunkFilename: 'styles/[id].[hash].css',
      }),
    ].concat(createPages()),
  };

  console.log();

  return myWebpackConfig;
};
