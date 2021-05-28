const gulp = require('gulp');
const zip = require('gulp-zip');
var path = require('path');
const { series } = require('gulp');
const del = require('del');
var fs = require('fs');

function createtmp(){

    var json = JSON.parse(fs.readFileSync('./composer.json'));

    return gulp.src(['./**', 
              '!./{.git, .git/**}', 
              '!./CHANGELOG.md',
              '!./gulpfile.js',
              '!./package.json',
              '!./package-lock.json',
              '!./node_modules/**'])
        .pipe(gulp.dest('./tmp/'+ path.basename(path.dirname(__filename))+ "-" + json.version + '/' + path.basename(path.dirname(__filename)) ));
}

function zipplugin(){

    var json = JSON.parse(fs.readFileSync('./composer.json'));
    process.chdir('./tmp');

    return gulp.src(['./'+ path.basename(path.dirname(__filename))+ "-" + json.version + '/**', '!./tmp/**'])
        .pipe(zip(path.basename(path.dirname(__filename))+ "-" + json.version + '.zip'))
        .pipe(gulp.dest('../../'));
}

function cleanup(){
    process.chdir('..');
    return del('./tmp', {force:true});
}

exports.tmp = createtmp;
exports.zip = zipplugin;
exports.cleanup = cleanup;

exports.bundle = series(createtmp, zipplugin, cleanup);
