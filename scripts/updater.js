const { dirname } = require('path');
const RootFolder = dirname(require.main.filename);
var shell = require('shelljs');
const fs = require('fs');

module.exports = function (dir) {
    return {
        dir: dir,

        auto: function (cb) {
            if(!fs.existsSync(RootFolder + '.git')){
                shell.cd(RootFolder)
                shell.exec('git clone -b devlopment https://github.com/JAAKKQ/CryptoDiscordBot')
            }
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