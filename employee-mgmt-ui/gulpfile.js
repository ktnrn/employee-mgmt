var gulp = require("gulp");
var gutil = require("gulp-util");
var concat = require("gulp-concat");
var notify = require("gulp-notify");
var uglify = require("gulp-uglify");
var jshint = require("gulp-jshint");
var sourcemaps = require("gulp-sourcemaps");
var rename = require("gulp-rename");

gulp.task("build", function() {
  return gulp
    .src(["src/**/*.js"])
    .pipe(sourcemaps.init())
    .pipe(concat("app.js"))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest("dist/"))
    .pipe(notify({ message: "JS files successfully concated and reduced" }));
});