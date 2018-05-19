const webpack = require('webpack');
const path = require('path');

/*
 * We've enabled UglifyJSPlugin for you! This minifies your app
 * in order to load faster and run less javascript.
 *
 * https://github.com/webpack-contrib/uglifyjs-webpack-plugin
 *
 */

const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

/*
 * I've added HtmlWebpackPlugin
 */

const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
	entry: './src/index',

	output: {
		filename: '[name].bundle.js',
		path: path.resolve(__dirname, 'dist')
	},

	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				include: path.resolve(__dirname, "src"),
				loader: 'babel-loader',

				options: {
					presets: ['env']
				}
			},
			{
				test: /\.(scss|css)$/,
				use: [
					{
						loader: 'style-loader'
					},
					{
						loader: 'css-loader'
					},
					{
						loader: 'sass-loader'
					}
				]
			},
			{
				test: /\.(png|svg|jpg|gif)$/,
				use: [
					'file-loader'
				]
			},
			{
				test: /\.(woff|woff2|eot|ttf|otf)$/,
				use: [
					{
						loader: 'file-loader',
						options: {
							name: '[name].[ext]',
							outputPath: 'fonts/'
						}
					}
				]
			},
		]
	},

	plugins: [
		new UglifyJSPlugin(),
		new HtmlWebpackPlugin({
			title: "Output management",
			template: 'src/assets/html/index.html'
		}),
	],

	devServer: {
		contentBase: "./dev",
		compress: true,
		port: "9000"
	},
	watchOptions: {
		aggregateTimeout: 300,
		poll: 1000,
		ignored: /node_modules/
	},
	resolve: {
		alias: {
			fontello: path.resolve(__dirname, 'src/assets/icons/fontello-icons')
		}
	}
	// devtool: 'source-map' // CSS source not shown in devtools
};
