// resolve: { alias: { mobx: __dirname + "/node_modules/mobx/lib/mobx.es6.js" }}

module.exports = {
	css: {
		loaderOptions: {
			stylus: {
				use: [require('autoprefixer-stylus')(), require('nib')()]
			}
		}
	},
	configureWebpack: config => {
		if (process.env.NODE_ENV === 'production') {
			config.module.rules.forEach(rule => {
				if (rule.use) {
					let idx = rule.use.findIndex(w => w.loader === 'thread-loader')
					if (idx !== -1) rule.use.splice(idx, 1)
				}
			})
		}
	},
	chainWebpack: config => {
		config.resolve.extensions.prepend('.vue')

		config.module
			.rule('raw')
			.test(/\.(vert|frag|glsl)$/)
			.use('raw-loader')
			.loader('raw-loader')

		if (process.env.NODE_ENV === 'production') {
			// disable cache (not sure if this is actually useful...)
			config.module.rule('ts').uses.delete('cache-loader')

			config.module
				.rule('ts')
				.use('ts-loader')
				.loader('ts-loader')
				.tap(opts => {
					opts.transpileOnly = false
					opts.happyPackMode = false
					return opts
				})
		}
	}
}
