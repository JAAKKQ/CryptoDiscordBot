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
            console.log('')
            rl.question('Insert Bot Token: ', function (Token) {
                console.log('\033[1A' + 'Insert new token: ******************************************************************');
                store.add('config', 'token', Token, function (err) {
                    if (err) throw err;
                    rl.question('Insert Bot Clinet ID: ', function (ClientID) {
                        rl.close();
                        store.add('config', 'clientId', ClientID, function (err) {
                            if (err) throw err;
                            console.log('Completed token wizard!');
                            console.log('');
                            cb();
                        });
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