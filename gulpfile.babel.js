/* global process */

const gulp = require('gulp')
const $ = require('gulp-load-plugins')()

const webpack = require('webpack')
const WebpackStream = require('webpack-stream')

const BrowserSync = require('browser-sync')
const browserSync = BrowserSync.create()

const runSequence = require('run-sequence')
const args = require('shell-arguments')

let developmentMode = true

process.env.NODE_ENV = 'dev'

function requireUncached($module) {
	delete require.cache[require.resolve($module)]
	return require($module)
}

//==================================================
gulp.task('webpack', () => {
	let config = require('./webpack.config.js')

	return gulp.src('')
		.pipe($.plumber())
		.pipe(WebpackStream(config))
		.pipe(gulp.dest('public/js'))
		
    .pipe(browserSync.stream())
})

//==================================================
gulp.task('pug', () => {
	return gulp.src('./src/*.pug')
		.pipe($.plumber())
		.pipe($.data(() => {
			let data = {
				date: Date.now().toString()
			}
			return data
		}))
		.pipe($.pug({pretty: developmentMode}))
		.pipe(gulp.dest('public'))
		.pipe(browserSync.stream())
})

//==================================================
gulp.task('stylus', () => {
	return gulp.src('./src/stylus/*.styl')
		.pipe($.plumber())
		.pipe($.stylus({use: [require('nib')()]}))
		.pipe($.autoprefixer())
		// .pipe($.if(!developmentMode, $.combineMq()))
		.pipe($.if(!developmentMode, $.cleanCss()))
		.pipe(gulp.dest('public/css'))
		.pipe(browserSync.stream())
})


//==================================================
gulp.task('browser-sync', () => {
	browserSync.init({
		ghostMode: {
			clicks: false,
			forms: false,
			scroll: false
		},
		port: 9000,
		server: {
			baseDir: 'public',
			serveStaticOptions: {
				extensions: ['html']
			}
		},
		open: args.o
	})
})

//==================================================
gulp.task('watch', () => {
	gulp.watch('./src/**/*.styl', ['stylus'])
	gulp.watch(['./src/*.pug', './src/pug/**/*'], ['pug'])
})

//==================================================
gulp.task('release', () => {
	developmentMode = false
	process.env.NODE_ENV = 'production'
})

//==================================================

gulp.task('default', ['webpack', 'pug', 'stylus', 'watch', 'browser-sync'])
gulp.task('build', () => {
	runSequence(
		'release',
		['pug', 'stylus', 'webpack']
	)
})