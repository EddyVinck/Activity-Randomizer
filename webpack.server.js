const webpack = require('webpack');
const path = require('path');
// const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
// const HtmlWebpackPlugin = require('html-webpack-plugin');
const createPages = require('./webpack.functions');
// const devMode = process.env.NODE_ENV !== 'production';
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = (env, argv) => {
  console.log(`mode: ${argv.mode}`);

  const myWebpackConfig = {
    entry: {
      activityrandomizer: './src/js/activity-randomizer.js',
      common: './src/js/common.js',
    },

    output: {
      filename: 'public/js/[name].js',
      path: path.resolve(__dirname, 'server'),
      publicPath: '/',
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
                outputPath: 'public/assets/img/',
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
                outputPath: 'public/assets/fonts/',
                publicPath: '/static/assets/fonts/',
              },
            },
          ],
        },
        {
          test: /\.(scss|css)$/,
          use: [
            {
              loader: MiniCssExtractPlugin.loader,
              options: { publicPath: '/static/css/' },
            },
            {
              loader: 'css-loader',
            },
            {
              loader: 'sass-loader',
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
    resolve: {
      alias: {
        fontello: path.resolve(__dirname, 'src/assets/fonts/icons/fontello-icons'),
        img: path.resolve(__dirname, 'src/assets/img'),
      },
    },
    plugins: [
      new webpack.ProvidePlugin({
        $: 'jquery',
      }),
      new MiniCssExtractPlugin({
        filename: 'public/css/[name].css',
        chunkFilename: 'public/css/[id].css',
      }),
      new CopyWebpackPlugin([
        { context: './src/assets/img', from: `*.+(png|jpg)`, to: 'public/assets/img' },
        { context: './src/assets/img', from: 'favicon/', to: 'public/assets/img/favicon' },
      ]),
    ],
  };

  return myWebpackConfig;
};
