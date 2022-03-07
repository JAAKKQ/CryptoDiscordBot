const readline = require('readline');
var store = require('data-storage-systemNoEnc')('.');
var fs = require('fs');
var path = require('path');
const fse = require('fs-extra');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

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

var Token;
var ClientID;

store.load('config', 'token', function(err, object){
    Token = object
    copyFile('./data/', `./data-backup-${Token}`);

    rl.question('Insert new token: ', function (NewToken) {
        var newkey = NewToken;
        store.add('config', 'token', newkey, function(err, object){
            if(err) throw err;
          });
        rl.question('Insert new clinet ID: ', function (NewID) {
            ClientID = NewID
            fs.readdir('./data/member/', function (err, files) {
                if (err) {
                  console.error("Could not list the directory.", err);
                  process.exit(1);
                }
                var encryptor = require('simple-encryptor')(Token);
                var newencryptor = require('simple-encryptor')(newkey);
                files.forEach(function (file, index) {
                    console.log(file);
                    fs.readFile(`./data/member/${file}`, 'utf8', function(err, code) {
                        if (err) return cb("error loading file" + err);
                        try {
                          var jsonObj = JSON.parse(code);
                          console.log('Decrypting file...');
                          jsonObj = encryptor.decrypt(jsonObj);
                          console.log('Encrypting file with new key...');
                          jsonObj = newencryptor.encrypt(jsonObj);
                          try {
                            json = JSON.stringify(jsonObj, null, 2);
                            fs.writeFile( `./data/member/${file}`, json, 'utf8', function(err) {
                                console.log(`Converted ${file} to new key.`);
                                if (err) return cb(err);
                                console.log('Finnished!')
                                process.exit()
                            });
                          }
                          catch (e) {
                            console.log(e)
                          }
                        }
                        catch (e) {
                          console.log("Error parsing " + f + ": " + e);
                        }
                    });
                });
            });
        });
    });
    
    if(err) throw err;
});
