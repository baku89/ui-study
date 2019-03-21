module.exports = {
	css: {
		loaderOptions: {
			stylus: {
				use: [require('autoprefixer-stylus')(), require('nib')()]
			}
		}
	},
	chainWebpack: config => {
		config.resolve.extensions.prepend('.vue')

		config.module
			.rule('raw')
			.test(/\.(vert|frag|glsl)$/)
			.use('raw-loader')
			.loader('raw-loader')
	}
}
