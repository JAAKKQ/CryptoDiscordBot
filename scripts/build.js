const fs = require('fs');
const fse = require('fs-extra');
var store = require('data-storage-system')('.');
var BotVersion = "";
var path = require('path');
var RootFolder = path.resolve("./");
var BuildDir = RootFolder + '/build/';


// To copy a folder or file  
function copyFile( srcDir, destDir ) {
    console.log(`Copying files from ${srcDir} to ${destDir}`);
    fse.copySync(srcDir, destDir, { overwrite: true }, function (err) {
        if (err) {
          console.error(err);
        } else {
          console.log("success!");
        }
      });
}
//Achive the file(s) or folder(s)
function AchiveFile( srcDir ) {
    var fs = require('fs');
    var archiver = require('archiver');

    var output = fs.createWriteStream(`BotBuild-V${BotVersion}.zip`);
    var archive = archiver('zip');
    
    output.on('close', function () {
        console.log(archive.pointer() + ' total bytes');
        console.log('Archiver has been finalized and the output file descriptor has closed.');
    });
    archive.on('error', function(err){
        throw err;
    });
    
    archive.pipe(output);
    
    // append files from a sub-directory, putting its contents at the root of archive
    archive.directory(srcDir, false);
    
    // append files from a sub-directory and naming it `new-subdir` within the archive
    
    archive.directory('subdir/', 'new-subdir');
    archive.finalize();
}

//Make folder containing needed files and compress that
store.load('version', 'BotVersion', function(err, object){
    BotVersion = +[object] + 1;
    if (fs.existsSync(BuildDir)){
      fs.rm(BuildDir, { recursive: true }, (err) => {
        if (err) {
            throw err;
        }
        console.log(`Old build is deleted!`);
        if (!fs.existsSync(BuildDir)){
          fs.mkdirSync(BuildDir, { recursive: true });
          console.log(`Made new build directory!`);
        }
        if (!fs.existsSync(RootFolder + '/build/data/member')){
          fs.mkdirSync(RootFolder + '/build/data/member', { recursive: true });
          console.log(`Made new build data directory!`);
        }
        console.log(`Building Version ${BotVersion}`)
        store.add('version', 'BotVersion', BotVersion, function(err, object){
        copyFile(RootFolder + '/commands/', './build/commands/');
        copyFile(RootFolder + '/events/', './build/events/');
        copyFile(RootFolder + '/node_modules/', './build/node_modules/');
        copyFile(RootFolder + '/index.js/', './build/index.js/');
        copyFile(RootFolder + '/package.json/', './build/package.json/');
        copyFile(RootFolder + '/package-lock.json/', './build/package-lock.json/');
        copyFile(RootFolder + '/Start.bat/', './build/Start.bat/');
        copyFile(RootFolder + '/UpdateToken.bat/', './build/UpdateToken.bat/');
        copyFile(RootFolder + '/public-script/', './build/public-script/');
        AchiveFile(RootFolder + '/build/');
        if(err) throw err;
      });

    });
  } else {
        console.log(`Old build is already deleted!`);
        if (!fs.existsSync(BuildDir)){
          fs.mkdirSync(BuildDir, { recursive: true });
          console.log(`Made new build directory!`);
        }
        if (!fs.existsSync(RootFolder + '/build/data/member')){
          fs.mkdirSync(RootFolder + '/build/data/member', { recursive: true });
          console.log(`Made new build data directory!`);
        }
        console.log(`Building Version ${BotVersion}`)
        store.add('version', 'BotVersion', BotVersion, function(err, object){
        copyFile(RootFolder + '/commands/', './build/commands/');
        copyFile(RootFolder + '/events/', './build/events/');
        copyFile(RootFolder + '/node_modules/', './build/node_modules/');
        copyFile(RootFolder + '/index.js/', './build/index.js/');
        copyFile(RootFolder + '/package.json/', './build/package.json/');
        copyFile(RootFolder + '/package-lock.json/', './build/package-lock.json/');
        copyFile(RootFolder + '/Start.bat/', './build/Start.bat/');
        copyFile(RootFolder + '/UpdateToken.bat/', './build/UpdateToken.bat/');
        copyFile(RootFolder + '/public-script/', './build/public-script/');
        AchiveFile(RootFolder + '/build/');
        if(err) throw err;
      });

  }
    if(err) throw err;
  });