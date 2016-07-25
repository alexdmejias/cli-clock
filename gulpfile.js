var gulp = require('gulp');
var ts = require('gulp-typescript');
var sourcemaps = require('gulp-sourcemaps');
var merge = require('merge2');
var mocha = require('gulp-spawn-mocha');


var tsProject = ts.createProject('tsconfig.json');

gulp.task('default', function () {
  var tsResult = tsProject.src('tsconfig.json')
    .pipe(sourcemaps.init())
    .pipe(ts(tsProject));

  return merge([
    tsResult.dts.pipe(gulp.dest('dist')),
    tsResult.js
      .pipe(sourcemaps.write('.', {
        includeContent: false,
        sourceRoot: '../src'
      }))
      .pipe(gulp.dest('dist'))
  ]);
});

gulp.task('test', function() {
  return gulp
    .src(['test/*.js'])
    .pipe(mocha({
      growl: true,
      // reporter: "min",
      istanbul: false,
      require: 'source-map-support/register'
    }));
});

gulp.task('watch', ['default'], function () {
  gulp.watch(['src/**/*.ts'], ['default']);
});

gulp.task('tdd', ['default', 'test'], function () {
  gulp.watch(['src/**/*.ts', 'test/*.js'], ['default', 'test']);
});