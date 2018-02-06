let webpack = require('webpack')

const isDev		= process.env.NODE_ENV === 'dev'

module.exports = {
	entry: {
		'main': './src/js/main.tsx'
	},
	output: {
		filename: '[name].js',
		publicPath: '/js/'
	},
	resolve: {
		alias: {},
		extensions: ['', '.js', '.jsx', '.ts', '.tsx'],
		modulesDirectories: [
			'node_modules'
		]
	},
	target: 'web',
	module: {
		loaders: [
			{
				test: /\.(ts|tsx)$/,
				loader: 'ts-loader!tslint-loader',
				exclude: /node_modules/
			},
			{
				test: /\.(json)$/,
				loader: 'json-loader'
			},
			{
				test: /\.styl$/,
				loader: 'style-loader!css-loader!stylus-loader'
			},
			{
				test: /\.(vert|frag|glsl)$/,
				loader: 'raw-loader!glslify-loader'
			}
		]
	},
	stylus: {
		use: [require('nib')()]
	},

	// dev
	watch: isDev,
	devtool: isDev ? 'inline-source-map' : undefined,

	// prod
	plugins: (isDev ? [] : [
			new webpack.optimize.UglifyJsPlugin(),
			new webpack.optimize.DedupePlugin()
	])
}