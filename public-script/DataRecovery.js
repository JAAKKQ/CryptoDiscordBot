const readline = require('readline');
var store = require('data-storage-system')('.');
var fs = require('fs');
const fse = require('fs-extra')
const { dirname } = require('path');
const RootFolder = dirname(require.main.filename);

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
var NewToken;
var ClientID;
var AreFilesGood = true;

module.exports = function (dir) {
    return {
        dir: dir,

        start: function (cb) {
            const rl = readline.createInterface({
                input: process.stdin,
                output: process.stdout
            });
            rl.question('Insert old token: ', function (OldToken) {
                readline.moveCursor(process.stdout, 0, -1);
                Token = OldToken
                console.log('\033[1A' + 'Old token set to cache!');
                rl.question('Insert new token: ', function (NewToken) {
                    readline.moveCursor(process.stdout, 0, -1);
                    NewToken = NewToken;
                    console.log('\033[1A' + 'New token set to cache!');
                    rl.question('Insert new client ID: ', function (ClientID) {
                        ClientID = ClientID;
                        //asd
                        if (ClientID.length === 18) {
                            console.log('Client ID is valid!');
                            fs.readdir(RootFolder + '/data/member/', function (err, files) {
                                if (err) {
                                    console.error("Could not list the directory.", err);
                                    process.exit(1);
                                }
                                if (files.length) {
                                    var encryptor = require('simple-encryptor')(Token);
                                    var newencryptor = require('simple-encryptor')(NewToken);
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
                                                                                    store.add('config', 'token', NewToken, function (err, object) {
                                                                                        if (err) throw err;
                                                                                        console.log('\x1b[34m%s\x1b[0m', 'Updated token succesfully!');
                                                                                        console.log('Updating client ID...');
                                                                                        store.add('config', 'clientId', ClientID, function (err, object) {
                                                                                            if (err) throw err;
                                                                                            console.log('\x1b[34m%s\x1b[0m', 'Updated client ID succesfully!');
                                                                                            rl.close();
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
                                    store.add('config', 'token', NewToken, function (err, object) {
                                        if (err) throw err;
                                        console.log('\x1b[34m%s\x1b[0m', 'Updated token succesfully!');
                                        console.log('Updating client ID...');
                                        store.add('config', 'clientId', ClientID, function (err, object) {
                                            if (err) throw err;
                                            console.log('\x1b[34m%s\x1b[0m', 'Updated client ID succesfully!');
                                            var DeployWizard = require(RootFolder + '/public-script/deploy-commands.js')('.');
                                            DeployWizard.deploy(function () {
                                                rl.close();
                                                cb();
                                            });
                                        });
                                    });
                                }
                            });
                        } else {
                            rl.close();
                            console.log('\x1b[31m%s\x1b[0m', 'Client ID is not valid!');
                        }
                    });
                });
            });
        }
    }
};
//I never realized the lengths I'd have to go
//All the darkest corners of a sense
//I didn't know
//Just for one moment
//hearing someone call
//Looked beyond the day in hand
//There's nothing there at all