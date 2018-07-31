const webpack = require('webpack');
const path = require('path');
// const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
// const HtmlWebpackPlugin = require('html-webpack-plugin');
const createPages = require('./webpack.functions');
// const devMode = process.env.NODE_ENV !== 'production';
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = (env, argv) => {
  console.log(`mode: ${argv.mode}`);

  const myWebpackConfig = {
    entry: {
      activityrandomizer: './src/js/activity-randomizer.js',
      common: './src/js/common.js',
    },

    output: {
      filename: '[name].entry.js',
      path: path.resolve(__dirname, 'server'),
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
              loader: 'style-loader',
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
          test: /\.hbs$/,
          loader: 'raw-loader',
        },
      ],
    },
    resolve: {
      alias: {
        fontello: path.resolve(__dirname, 'src/assets/fonts/icons/fontello-icons'),
        img: path.resolve(__dirname, 'src/assets/img'),
      },
    },
    devtool: 'source-map', // 	CSS source not shown in devtools
    plugins: [
      new webpack.ProvidePlugin({
        $: 'jquery',
      }),
      new CopyWebpackPlugin([{ context: './src/views/', from: `**/*`, to: 'views' }]),
    ],
  };

  return myWebpackConfig;
};
