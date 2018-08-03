const HtmlWebpackPlugin = require('html-webpack-plugin');
// const fs = require('fs');

// /**
//  * TODO: check for certain file extensions like .hbs
//  */
// const getFilesInFolder = (folder) => {
// 	fs.readdir(folder, (err, files) => {
// 		files.forEach(file => {
// 			console.log(`${folder}/${file}`);
// 		});
// 	});
// }
// // getFilesInFolder('./src/assets/html');

// const pages = [
// 	'src/views/boilerplated-tutorial.hbs',
// 	'src/views/google-sheet-tutorial.hbs',
// 	'src/views/index.hbs'
// ];

const createPages = (mode) => [
  new HtmlWebpackPlugin({
    filename: 'index.html',
    template: 'src/views/index.pug',
    hash: true,
    inject: false,
  }),
  new HtmlWebpackPlugin({
    filename: 'google-sheet-tutorial.html',
    template: 'src/views/google-sheet-tutorial.pug',
    hash: true,
    inject: false,
  }),
];

module.exports = createPages;
