const readline = require('readline');
var store = require('data-storage-system')('.');
var fs = require('fs');
var path = require('path');
const fse = require('fs-extra')
var RootFolder = path.resolve("./");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// To copy a folder or file  
function copyFile(srcDir, destDir) {
  console.log(`Copying files from ${srcDir} to ${destDir}`);
  fse.copySync(srcDir, destDir, { overwrite: true }, function (err) {
    if (err) {
      console.error(err);
    } else {
      console.log("success!");
    }
  });
}
function IsGoodString(str) {
  if (str === 'null') {
    return false;
  } else {
    return true;
  }
}

if (!fs.existsSync(RootFolder + '/data/member/')) {
  fs.mkdirSync(RootFolder + '/data/member/', { recursive: true });
  console.log(`Made new data directory!`);
}

var Token;
var ClientID;
var AreFilesGood = true;

module.exports = function (dir) {
  return {
    dir: dir,

    new: function (cb) {
      store.load('config', 'token', function (err, object) {
        Token = object
        rl.question('Insert new token: ', function (NewToken) {
          readline.moveCursor(process.stdout, 0, -1)
          console.log('\033[1A' + 'New token set to cache!');
          var newkey = NewToken;
          rl.question('Insert new client ID: ', function (NewID) {
            ClientID = NewID
            if (ClientID.length === 18) {
              console.log('Client ID is valid!');
              fs.readdir(RootFolder + '/data/member/', function (err, files) {
                if (err) {
                  console.error("Could not list the directory.", err);
                  process.exit(1);
                }
                if (files.length) {
                  var encryptor = require('simple-encryptor')(Token);
                  var newencryptor = require('simple-encryptor')(newkey);
                  files.forEach(function (file, index) {
                    fs.readFile(RootFolder + `/data/member/${file}`, 'utf8', function (err, code) {
                      if (err) return cb("error loading file" + err);
                      try {
                        console.log('\x1b[32m%s\x1b[0m', `-------------------${file}-------------------`);
                        var jsonObj = JSON.parse(code);
                        console.log('Decrypting file...');
                        jsonObj = encryptor.decrypt(jsonObj);
                        console.log('Output:' + jsonObj);
                        console.log('Encrypting file with new key...');
                        jsonObj = newencryptor.encrypt(jsonObj);
                        console.log('Encrypted file...');
                        console.log('Output:' + jsonObj);
                        jsonObj = newencryptor.decrypt(jsonObj);
                        console.log('Decrypted file with new key...');
                        console.log('Output:' + jsonObj);
                        const IsDataGood = IsGoodString(JSON.stringify(jsonObj));
                        console.log('Is Data Good: ' + IsDataGood);
                        if (IsDataGood) {
                          console.log('\x1b[32m%s\x1b[0m', `-------------------------------------------------------------`);
                          if (files.length === index + 1) {
                            if (AreFilesGood) {
                              console.log('Finnished converting all files succesfully!');
                              console.log('Wrting all files with converted data...');
                              files.forEach(function (file, index) {
                                fs.readFile(RootFolder + `/data/member/${file}`, 'utf8', function (err, code) {
                                  if (err) return cb("error loading file" + err);
                                  try {
                                    console.log('\x1b[32m%s\x1b[0m', `-------------------Writing ${file}-------------------`);
                                    var jsonObj = JSON.parse(code);
                                    console.log('Decrypting file...');
                                    jsonObj = encryptor.decrypt(jsonObj);
                                    console.log('Output:' + jsonObj);
                                    console.log('Encrypting file with new key...');
                                    jsonObj = newencryptor.encrypt(jsonObj);
                                    console.log('Encrypted file!');
                                    console.log('Output:' + jsonObj);
                                    console.log('Writing data to file!');
                                    try {
                                      json = JSON.stringify(jsonObj, null, 2);
                                      fs.writeFile(RootFolder + `/data/member/${file}`, json, 'utf8', function (err) {
                                        console.log(`Converted ${file} to new key.`);
                                        console.log('\x1b[32m%s\x1b[0m', `--------------------------------------------------------------------`);
                                        if (files.length === index + 1) {
                                          console.log('\x1b[34m%s\x1b[0m', 'Finnished converting all files succesfully!');
                                          console.log('Updating token...');
                                          store.add('config', 'token', newkey, function (err, object) {
                                            if (err) throw err;
                                            console.log('\x1b[34m%s\x1b[0m', 'Updated token succesfully!');
                                            console.log('Updating client ID...');
                                            store.add('config', 'clientId', ClientID, function (err, object) {
                                              if (err) throw err;
                                              console.log('\x1b[34m%s\x1b[0m', 'Updated client ID succesfully!');
                                              cb();
                                            });
                                          });
                                        }
                                        if (err) return cb(err);
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
                            } else {
                              console.log('\x1b[31m%s\x1b[0m', 'Cannot write new files since atleast one file corruted!');
                            }
                          } else {
                            console.log('Finnished data convertation for ' + file);
                          }
                        } else {
                          AreFilesGood = false;
                          console.log(`Error decrypting file ${file} with new key!`);
                          console.log(`${file} is most likely corrupted!`);
                          console.log('\x1b[31m%s\x1b[0m', `-------------------------------------------------------------`);
                        }
                      }
                      catch (e) {
                        console.log("Error parsing " + f + ": " + e);
                      }
                    });
                  });
                } else {
                  console.log('Data directory is empty!');
                  console.log('Updating token...');
                  store.add('config', 'token', newkey, function (err, object) {
                    if (err) throw err;
                    console.log('\x1b[34m%s\x1b[0m', 'Updated token succesfully!');
                    console.log('Updating client ID...');
                    store.add('config', 'clientId', ClientID, function (err, object) {
                      if (err) throw err;
                      console.log('\x1b[34m%s\x1b[0m', 'Updated client ID succesfully!');
                      var DeployWizard = require(RootFolder + '/public-script/deploy-commands.js')('.');
                      DeployWizard.deploy(function () {
                        cb();
                      });
                    });
                  });
                }
              });
            } else {
              console.log('\x1b[31m%s\x1b[0m', 'Client ID is not valid!');
            }
          });
        });
        if (err) throw err;
      });
    }
  }
};