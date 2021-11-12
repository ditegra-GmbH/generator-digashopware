const gulp = require('gulp');
const zip = require('gulp-zip');
const flog = require('fancy-log');
var path = require('path');
const ansi = require('ansi-colors');
const { series } = require('gulp');
const del = require('del');
var fs = require('fs');
var parser = require('xml2json');

var appName = null;
var appType = null;
var appFolder = null;

function setAppName(){
    var i = process.argv.indexOf("--app");
    if(i>-1) {
        appName = process.argv[i+1].replace(/\\/g, '');
    }
}

function setAppType(){

    if(fs.existsSync('./plugins/' + appName))
        appType = 'plugin';

    if(fs.existsSync('./apps/' + appName))
        appType = 'app';

}

function setAppFolder(){

    if(fs.existsSync('./plugins/' + appName))
        appFolder = './plugins/' + appName;

    if(fs.existsSync('./apps/' + appName))
        appFolder = './apps/' + appName;

}

function createtmp(){

    setAppName();
    
    if(!appName) {
        flog.error(ansi.red("ERROR: missing parameter 'app', (usage: gulp bundle --app [AppFolderName])"));
        process.exit(0);
    }

    // check if right folder
    if(!fs.existsSync('./plugins')){
        flog.error(ansi.red("ERROR: wrong base folder, this bundle must be located in html/custom"));
        process.exit(0);
    }

    setAppFolder();

    // check for existance
    if(!appFolder){
        flog.error(ansi.red("ERROR: invalid app parameter, can't find: '" + appName  + "' plugin or app folder"));
        process.exit(0);
    }

    setAppType();

    flog.info(ansi.green("App folder found, app type, '" + appType  + "' detected ..."));

    // change directory to plugin folder
    process.chdir(appFolder);
    
    var appFolderName = path.basename(process.cwd());
    var json = getDefinition();
    var destPath = './tmp/'+ appFolderName + "-" + json.version + '/' + appFolderName ;

    return gulp.src(json.files).pipe(gulp.dest(destPath));
}

function getDefinition(){
    
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
    
    var currentFolderName = path.basename(process.cwd());

    var json = getDefinition();
    process.chdir('./tmp');
    
    var zipSrc = './'+ currentFolderName + "-" + json.version + '/**';
    var zipTarget = '' + currentFolderName + "-" + json.version + '.zip';

    flog.info(ansi.green("Zip created: " + zipTarget));

    return gulp.src([zipSrc, '!./tmp/**'])
        .pipe(zip(zipTarget))
        .pipe(gulp.dest('../../'));    
}

function cleanup(){
    process.chdir('..');
    flog.info(ansi.green("Cleanup: " + process.cwd()));
    return del('./tmp', {force:true});
}

exports.tmp = createtmp;
exports.zip = zipplugin;
exports.cleanup = cleanup;

exports.bundle = series(createtmp, zipplugin, cleanup);