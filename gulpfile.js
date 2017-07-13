const gulp = require('gulp');
const uglify = require('gulp-uglify');
const concat = require('gulp-concat');
const urlAdjuster = require('gulp-css-url-adjuster');
const gulpRename = require('gulp-rename');


gulp.task('uglifyJs', function() {
    return gulp.src('./public/**/*.js')
        .pipe(concat('bundle.js'))
        .pipe(uglify())
        .pipe(gulp.dest('dist'))
});

gulp.task('default', ['uglifyJs'], function() {});
