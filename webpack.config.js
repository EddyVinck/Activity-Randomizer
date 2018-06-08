const webpack = require('webpack');
const path = require('path');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
// const devMode = process.env.NODE_ENV !== 'production';

module.exports = (env, argv) => { 
	console.log(`mode: ${argv.mode}`);

	return {
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
						'file-loader'
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
				}
			]
		},

		devServer: {
			contentBase: "./dist",
			compress: true,
			port: "9000",
		},
		watchOptions: {
			aggregateTimeout: 300,
			poll: 1000,
			ignored: /node_modules/
		},
		resolve: {
			alias: {
				fontello: path.resolve(__dirname, 'src/assets/fonts/icons/fontello-icons'),
				img: path.resolve(__dirname, 'src/assets/img')				
			}
		},
		devtool: 'source-map', // 	CSS source not shown in devtools
		plugins: [		
			new webpack.ProvidePlugin({
				$: 'jquery'
			}),	
			// new UglifyJSPlugin(),
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
		]
	}
};
