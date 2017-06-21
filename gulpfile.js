'use strict';

const gulp = require('gulp');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const sass = require('gulp-sass');
const cleanCSS = require('gulp-clean-css');
const autoprefixer = require('gulp-autoprefixer');
const babel = require('gulp-babel');
const sourcemaps = require('gulp-sourcemaps');
const wrap = require('gulp-wrap');

const argv = require('yargs').argv;
const path = require('path');


const buildPath = 'public/dist/';
const cssSrc = [
  'public/src/libs/*.css',
  'public/src/css/*.scss',
];
const appScriptSrc = [
  'public/src/app/*.js',
  'public/src/app/**/*.js',
];
const libScriptSrc = [
  'public/src/libs/babel-polyfill.min.js',
  'public/src/libs/jquery-1.11.3.min.js',
  'public/src/libs/angular-1.5.7/angular.js',
  'public/src/libs/angular-1.5.7/angular-touch.js',
  'public/src/libs/ng-infinite-scroll.js',
  'public/src/libs/parse.js',
];


function buildLibraries(outputName, src) {
  return gulp.src(src)
    .pipe(sourcemaps.init())
    .pipe(concat(outputName))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(`${buildPath}js/`));
}


function buildApp(outputName, src) {
  return gulp.src(src)
    .pipe(wrap('(function(){ <%= contents %> })();'))
    .pipe(sourcemaps.init())
    .pipe(babel({
      presets: ['es2015', 'stage-2'],
      plugins: ['transform-async-to-generator'],
    }))
    .pipe(concat(outputName))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(`${buildPath}js/`));
}

function buildSass(outputName, src) {
  return gulp.src(src)
    .pipe(sourcemaps.init())
    .pipe(sass())
    .pipe(autoprefixer())
    .pipe(concat(outputName))
    .pipe(cleanCSS())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(`${buildPath}css/`));
}


gulp.task('libScripts', () => buildLibraries('libs.min.js', libScriptSrc));
gulp.task('appScripts', () => buildApp('app.min.js', appScriptSrc));
gulp.task('sass', () => buildSass('all.min.css', cssSrc));
gulp.task('watch', () => {
  if (argv.production) return;
  gulp.watch(cssSrc, ['sass']);
  gulp.watch(appScriptSrc, ['appScripts']);
});


gulp.task('default', ['libScripts', 'appScripts', 'sass', 'watch']);

