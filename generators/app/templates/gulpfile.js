const gulp = require('gulp');
const zip = require('gulp-zip');
var path = require('path');

exports.default = () => (
    gulp.src(['./**', 
              '!./{.git, .git/**}', 
              '!./CHANGELOG.md',
              '!./gulpfile.js'])
        .pipe(zip(path.basename(path.dirname(__filename)) + '.zip'))
        .pipe(gulp.dest('./'))
);