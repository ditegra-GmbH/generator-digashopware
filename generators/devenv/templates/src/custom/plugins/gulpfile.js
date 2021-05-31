const gulp = require('gulp');
const zip = require('gulp-zip');
var path = require('path');
const { series } = require('gulp');
const del = require('del');
var fs = require('fs');

function getAppName(){
    var appName, i = process.argv.indexOf("--app");
    if(i>-1) {
        appName = process.argv[i+1].replace(/\\/g, '');
    }
    return appName;
}

function createtmp(){

    var appName = getAppName();
    if(!appName) {
        console.log("usage: gulp bundle --app [AppFolderName]" );
    }
    // change directory to plugin folder
    process.chdir("./" + appName);
    
    var appFolderName = path.basename(process.cwd());  
    var json = JSON.parse(fs.readFileSync('./composer.json'));    
    var destPath = './tmp/'+ appFolderName + "-" + json.version + '/' + appFolderName ;

    return gulp.src(['./**', 
              '!./{.git, .git/**}', 
              '!./CHANGELOG.md',
              '!./gulpfile.js',
              '!./package.json',
              '!./package-lock.json',
              '!./node_modules/**'])
        .pipe(gulp.dest(destPath));
}

function zipplugin(){
    
    var appName = getAppName();
    if(!appName) {
        console.log("usage: gulp bundle --app [AppFolderName]" );
    }
    var currentFolderName = path.basename(process.cwd());

    var json = JSON.parse(fs.readFileSync('./composer.json'));
    process.chdir('./tmp');
    
    var zipSrc = './'+ currentFolderName + "-" + json.version + '/**';
    // console.log("zipSrc: ");
    // console.log(zipSrc);

    var zipTarget = currentFolderName + "-" + json.version + '.zip';
    // console.log("zipTarget");
    // console.log(zipTarget);

    return gulp.src([zipSrc, '!./tmp/**'])
        .pipe(zip(zipTarget))
        .pipe(gulp.dest('../../'));    
}

function cleanup(){

    console.log("cleanup: ");
    process.chdir('..');
    console.log(process.cwd());
    return del('./tmp', {force:true});
}

exports.tmp = createtmp;
exports.zip = zipplugin;
exports.cleanup = cleanup;

exports.bundle = series(createtmp, zipplugin, cleanup);