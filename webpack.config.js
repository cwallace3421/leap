const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const path = require('path');

module.exports = {

	entry: path.resolve(__dirname, 'src/client/js/index.ts'),

	target: 'web',

	output: {
		filename: 'bundle.js',
		path: path.resolve(__dirname, 'dist/client')
	},

	resolve: {
		extensions: ['.ts', '.js']
	},

	module: {
		loaders: [
			{
				test: /\.ts$/,
				loader: 'ts-loader'
			}
		]
	},

	plugins: [
		new UglifyJSPlugin({
			uglifyOptions: {
				compress: false,
				mangle: false,
				output: {
					comments: false,
					beautify: true
				}
			},
			parallel: true
		})
	]

}