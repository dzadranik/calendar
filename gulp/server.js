var gulp = require('gulp')
const pug2html = require('./pug2html.js')
const styles = require('./styles.js')
const script = require('./scripts.js')

var browserSync = require('browser-sync').create()

module.exports = function server(cb) {
	browserSync.init({
		server: 'build',
		open: false
	})

	gulp.watch('src/styles/*.scss', gulp.series(styles))
	gulp.watch('src/**/*.js', gulp.series(script))
	gulp.watch('src/**/*.pug', gulp.series(pug2html))
	gulp.watch('build/**/*.*').on('change', browserSync.reload)
	return cb()
}
