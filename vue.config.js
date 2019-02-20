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
			.rule('vue')
			.use('vue-svg-inline-loader')
			.loader('vue-svg-inline-loader')
			.options({})

		config.module
			.rule('raw')
			.test(/\.(vert|frag|glsl)$/)
			.use('raw-loader')
			.loader('raw-loader')
	}
}
