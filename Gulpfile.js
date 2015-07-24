var gulp = require("gulp");
var babel = require("gulp-babel");
var sourcemaps = require("gulp-sourcemaps");
var uglify = require("gulp-uglify");

gulp.task("javascript", function () {
  return gulp.src("src/index.js")
  	.pipe(sourcemaps.init())
    .pipe(babel())
    .pipe(uglify())
    .pipe(sourcemaps.write("."))
    .pipe(gulp.dest("dist"));
});

gulp.task("watch", function () {
	gulp.watch("src/**/*.js", ["javascript"]);
});