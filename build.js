const fs = require('fs');
const fse = require('fs-extra');
var store = require('data-storage-systemNoEnc')('.');
var BotVersion = "";
                              
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
    console.log(`Building Version ${BotVersion}`)
    store.add('version', 'BotVersion', BotVersion, function(err, object){
        copyFile('./commands/', './build/commands/');
        copyFile('./events/', './build/events/');
        copyFile('./node_modules/', './build/node_modules/');
        copyFile('./config.json/', './build/config.json/');
        copyFile('./index.js/', './build/index.js/');
        copyFile('./package.json/', './build/package.json/');
        copyFile('./package-lock.json/', './build/package-lock.json/');
        copyFile('./Start.bat/', './build/Start.bat/');
        copyFile('./UpdateToken.bat/', './build/UpdateToken.bat/');
        copyFile('./NewToken.js/', './build/NewToken.js/');
        copyFile('./data/member/', './build/data/member/');
        AchiveFile('./build/');
        if(err) throw err;
      });

    if(err) throw err;
  });

