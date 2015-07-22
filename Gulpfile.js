var gulp = require("gulp");
var babel = require("gulp-babel");

gulp.task("babel", function () {
  return gulp.src("src/index.js")
    .pipe(babel())
    .pipe(gulp.dest("dist"));
});

gulp.task("watch", function () {
	gulp.watch("src/**/*.js", ["babel"]);
});