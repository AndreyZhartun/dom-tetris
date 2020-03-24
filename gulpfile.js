'use strict';

var gulp = require('gulp'),
    sass = require('gulp-sass'),
    browserSync = require('browser-sync'),
    del = require('del'),
    terser = require('gulp-terser'), //uglify doesn't work with ecmascript 6+
    usemin = require('gulp-usemin'),
    rev = require('gulp-rev'),
    cleanCss = require('gulp-clean-css'),
    flatmap = require('gulp-flatmap'),
    htmlmin = require('gulp-htmlmin');

gulp.task('sass', function () {
        return gulp.src('./css/*.scss')
          .pipe(sass().on('error', sass.logError))
          .pipe(gulp.dest('./css'));
});

gulp.task('sass:watch', function () {
    gulp.watch('./css/*.scss', ['sass']);
});

gulp.task('browser-sync', function () {
    var files = [
       './*.html',
       './css/*.css',
       './img/*.{png,jpg,gif}',
       './js/*.js'
    ];
 
    browserSync.init(files, {
       server: {
          baseDir: "./"
       }
    });
});

// Clean
gulp.task('clean', function() {
    del.sync(['docs']);
    return Promise.resolve('Cleaned');
});

gulp.task('copyfonts', function() {
   gulp.src('./node_modules/font-awesome/fonts/**/*.{ttf,woff,eof,svg}*')
   .pipe(gulp.dest('./docs/fonts'));
   return Promise.resolve('Copied');
});

gulp.task('usemin', function() {
    return gulp.src('./*.html')
    .pipe(flatmap(function(stream, file){
        return stream
          .pipe(usemin({
              css: [ rev() ],
              html: [ function() { return htmlmin({ collapseWhitespace: true })} ],
              js: [ terser(), rev() ],
              inlinejs: [ terser() ],
              inlinecss: [ cleanCss(), 'concat' ]
          }))
      }))
    .pipe(gulp.dest('docs/'));
    return Promise.resolve('Minified');
});
  
gulp.task('build', gulp.series('clean', 'copyfonts', 'usemin'));

// Default task
gulp.task('default', gulp.series('browser-sync', function() {
    gulp.start('sass:watch');
}));