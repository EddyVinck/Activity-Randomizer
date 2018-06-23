
const HtmlWebpackPlugin = require('html-webpack-plugin');
const fs = require('fs');

/**
 * TODO: check for certain file extensions like .hbs
 */
const getFilesInFolder = (folder) => {
	fs.readdir(folder, (err, files) => {
		files.forEach(file => {
			console.log(`${folder}/${file}`);
		});
	});
}
// getFilesInFolder('./src/assets/html');

const pages = [
	'src/assets/html/boilerplated-tutorial.hbs',
	'src/assets/html/google-sheet-tutorial.hbs',
	'src/assets/html/index.hbs'
];

const createPages = () => {
  return [
		new HtmlWebpackPlugin({
			filename: 'index.html',				
			template: 'src/assets/html/index.hbs',
			hash: true,
			inject: false
		}),
		new HtmlWebpackPlugin({
			filename: 'google-sheet-tutorial.html',				
			template: 'src/assets/html/google-sheet-tutorial.hbs',
			hash: true,
			inject: false
		}),
	];
}

module.exports = createPages;