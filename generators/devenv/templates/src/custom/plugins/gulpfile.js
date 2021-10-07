const gulp = require('gulp');
const zip = require('gulp-zip');
var path = require('path');
const { series } = require('gulp');
const del = require('del');
var fs = require('fs');
var parser = require('xml2json');

function getAppName(){
    var appName, i = process.argv.indexOf("--app");
    if(i>-1) {
        appName = process.argv[i+1].replace(/\\/g, '');
    }
    return appName;
}

function getAppType(){
    return __dirname.indexOf('custom/apps')!=-1 ? 'app' : 'plugin';
}

function createtmp(){
    var appName = getAppName();
    if(!appName) {
        console.log("usage: gulp bundle --app [AppFolderName] --appType [plugin|app]");
    }

    // change directory to plugin folder
    process.chdir("./" + appName);
    
    var appFolderName = path.basename(process.cwd());
    var json = getDefinition();
    var destPath = './tmp/'+ appFolderName + "-" + json.version + '/' + appFolderName ;

    return gulp.src(json.files).pipe(gulp.dest(destPath));
}

function getDefinition(){
    
    var appType = getAppType();
    let files = [
        './**', 
        '!./{.git, .git/**}', 
        '!./CHANGELOG.md',
        '!./gulpfile.js',
        '!./package.json',
        '!./EULA.md',
        '!./package-lock.json',
        '!./node_modules/**'
    ];

    if(appType == 'plugin'){
        var json = JSON.parse(fs.readFileSync('./composer.json')); 
        version = json.version;
        files = files.concat([
            '!./manifest.xml',
            '!./icon.png',
            '!./Resources/**'
        ]);
    }
    else{
        var json = JSON.parse(parser.toJson(fs.readFileSync('./manifest.xml'))); 
        version = json.manifest.meta.version;
        files = files.concat([
            '!./composer.json',
            '!./src/**'
        ]);
    }

    return {
        version,
        files
    }
}

function zipplugin(){
    
    var appName = getAppName();
    if(!appName) {
        console.log("usage: gulp bundle --app [AppFolderName]" );
    }
    var currentFolderName = path.basename(process.cwd());

    var json = getDefinition();
    process.chdir('./tmp');
    
    var zipSrc = './'+ currentFolderName + "-" + json.version + '/**';
    var zipTarget = currentFolderName + "-" + json.version + '.zip';

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