const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const NodeExternals = require('webpack-node-externals');
const path = require('path');

module.exports = {

	entry: path.resolve(__dirname, 'src/server/index.ts'),

	target: 'node',

	output: {
		filename: 'bundle.js',
		path: path.resolve(__dirname, 'dist/server')
	},

	externals: [NodeExternals()],

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