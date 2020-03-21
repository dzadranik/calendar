const gulp = require('gulp')
const sass = require('gulp-sass')
const sourcemaps = require('gulp-sourcemaps')

module.exports = function scsstocss() {
	return gulp
		.src('./src/styles/styles.scss')
		.pipe(sourcemaps.init())
		.pipe(sass())
		.pipe(sourcemaps.write())
		.pipe(gulp.dest('./build/css'))
}
