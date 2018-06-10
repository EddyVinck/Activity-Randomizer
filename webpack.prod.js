const webpack = require('webpack');
const path = require('path');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
// const devMode = process.env.NODE_ENV !== 'production';

module.exports = (env, argv) => { 
	console.log(`mode: ${argv.mode}`);

	return {
		entry: {
			'activityrandomizer': './src/js/activity-randomizer.js',
			common: './src/js/common.js'
		},

		output: {
			filename: '[name].entry.js',
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
						presets: ['env'],
						"plugins": ["syntax-dynamic-import"]
					}
				},
				{
					test: /\.(png|svg|jpg|gif)$/,
					include: [
						path.resolve(__dirname, 'src/assets/img')
					],
					use: [
						{
							loader: 'file-loader',
							options: {
								name: '[name].[ext]',
								outputPath: 'assets/images'
							}
						}
					]
				},
				{
					test: /\.(woff|woff2|eot|ttf|otf|svg)$/,
					include: [
						path.resolve(__dirname, 'src/assets/fonts')
					],
					use: [
						{
							loader: 'file-loader',
							options: {
								name: '[name].[ext]',
								outputPath: 'assets/fonts/'
							}
						}
					]
				},
				{
					test: /\.(scss|css)$/,
					use: [
						
						{ loader: MiniCssExtractPlugin.loader,
							options: { publicPath: '../' } 
						},
						{
							loader: 'css-loader'
						},
						{
							loader: 'sass-loader'
						}
					]
				}
			]
		},
		resolve: {
			alias: {
				fontello: path.resolve(__dirname, 'src/assets/fonts/icons/fontello-icons'),
				img: path.resolve(__dirname, 'src/assets/img')				
			}
		},
		plugins: [
			new webpack.ProvidePlugin({
				$: 'jquery'
			}),
			new MiniCssExtractPlugin({
				filename: 'styles/[name].[hash].css',
				chunkFilename: 'styles/[id].[hash].css',
			}),
			new OptimizeCssAssetsPlugin({
				assetNameRegExp: /\.css$/g,
				cssProcessor: require('cssnano'),
				cssProcessorOptions: { discardComments: { removeAll: true } },
				canPrint: true
			}),
			new UglifyJSPlugin(),
			new HtmlWebpackPlugin({
				filename: 'index.html',				
				template: 'src/assets/html/index.html',
				hash: true,
				inject: false
			}),
			new HtmlWebpackPlugin({
				filename: 'google-sheet-tutorial.html',				
				template: 'src/assets/html/google-sheet-tutorial.html',
				hash: true,
				inject: false
			}),
		],
		// devtool: 'source-map' // CSS source not shown in devtools
	}
};
