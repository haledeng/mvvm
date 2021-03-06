/**
 * dependency
 * gulp
 * gulp-uglify
 * gulp-concat
 * gulp-babel
 * babel-preset-es2015
 */
var gulp = require('gulp');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
// gulp webpack
var webpack = require('webpack-stream');
var babel = require('gulp-babel');
// var remove = require('gulp-remove-content');


gulp.task('es6', function() {
	return gulp.src(['./src/**/**.js', './mvvmx/**.js'])
		.pipe(babel({
			presets: ['es2015']
		}))
		// .pipe(remove({
		// 	match: /(\'|\")use\sstrict(\'|\");/
		// }))
		.pipe(gulp.dest('./compile/'));
});



gulp.task('webpack', ['es6'], function() {
	gulp.src(['./compile/index.js'])
		.pipe(webpack({
			output: {
				libraryTarget: 'umd',
				umdNamedDefine: true,
				filename: 'mvvm.js'
			}
		}))
		.pipe(gulp.dest('./dist/'));

	gulp.src(['./compile/mvvmx.js'])
		.pipe(webpack({
			output: {
				libraryTarget: 'umd',
				umdNamedDefine: true,
				filename: 'mvvmx.js'
			}
		}))
		.pipe(gulp.dest('./dist/'));
});

// 信息流
gulp.task('dist', ['webpack']);


// development
gulp.task('dev', function() {
	gulp.watch('./**/**/**', ['dist']);
});