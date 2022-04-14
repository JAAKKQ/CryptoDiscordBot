//107 s. 12 r.
const readline = require('readline');
const {
    dirname
} = require('path');
const RootFolder = dirname(require.main.filename);
var TokenWizard = require(RootFolder + '/scripts/NewToken.js')('.');
var DataRecoveryWizard = require(RootFolder + '/scripts/DataRecovery.js')('.');
var SetupWizard = require(RootFolder + '/scripts/SetupWizard.js')('.');
var CommandWizard = require(RootFolder + '/scripts/deploy-commands.js')('.');
const fs = require('fs');
var index = 10;
var WebsiteDir;

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function InitWizards() {
    if (fs.existsSync(RootFolder + '/config.json')) {
        //Create a timeout for the set new token question.
        TokenTimeout();
        console.log('Skipping token wizard in ' + [index] + ' seconds. Be FAST to win the battle against the clock!');

        //Create set timeout question.
        rl.question('Set new token? y/n: ', function (Result) {
            rl.close();
            if (Result === 'y') {
                index = 0;
                TokenWizard.new(function () {
                    BotInit();
                });
            }
            if (Result === 'n') {
                index = 0;
                BotInit();
            }
        });
    } else {
        rl.question('Config file not found. Would you like to setup a new config or recover old data? s/r: ', function (Result) {
            rl.close();
            if (Result === 's') {
                SetupWizard.start(function () {
                    BotInit();
                });
            }
            if (Result === 'r') {
                console.log('You are now in the data recovery wizard.');
                DataRecoveryWizard.start(function () {
                    BotInit();
                });
            }
        });
    }
}

InitWizards();

//Token timeout function
function TokenTimeout() {
    if (index === 0) {
        rl.write("e\n");
        console.log('Skipped setting new token question...')
        BotInit();
    } else {
        setTimeout(function () {
            index = +[index] - 1;
            TokenTimeout();
        }, 1000);
    }
}

//Base bot functionality
function BotInit() {
    CommandWizard.deploy(function () {
        console.log('Starting bot...');
        const {
            Client,
            Collection,
            Intents
        } = require('discord.js');
        const {
            token
        } = require(RootFolder + '/config.json');

        const client = new Client({
            intents: [Intents.FLAGS.GUILDS]
        });

        const eventFiles = fs.readdirSync(RootFolder + '/events').filter(file => file.endsWith('.js'));

        for (const file of eventFiles) {
            const event = require(RootFolder + `/events/$ {
                file
            }`);
            if (event.once) {
                client.once(event.name, (...args) => event.execute(...args));
            } else {
                client.on(event.name, (...args) => event.execute(...args));
            }
        }

        client.commands = new Collection();

        const commandFiles = fs.readdirSync(RootFolder + '/commands').filter(file => file.endsWith('.js'));

        for (const file of commandFiles) {
            const command = require(RootFolder + `/commands/$ {
                file
            }`);
            // Set a new item in the Collection
            // With the key as the command name and the value as the exported module
            client.commands.set(command.data.name, command);
        }

        client.on('interactionCreate', async interaction => {
            if (!interaction.isCommand()) return;

            const command = client.commands.get(interaction.commandName);

            if (!command) return;

            try {
                await command.execute(interaction);
            }
            catch (error) {
                console.error(error);
                await interaction.reply({
                    content: 'There was an error while executing this command!', ephemeral: true
                });
            }
        });

        client.on("guildCreate",
            guild => {
                console.log("Joined a new guild: " + guild.name);

                function GetTotalMembers(cb) {
                    var TotalMembers;
                    client.guilds.cache.forEach(guild, index => {
                        if (!client.guilds.cache.size === index) {
                            TotalMembers = +[TotalMembers] + +[guild.memberCount];
                        } else {
                            cd(TotalMembers);
                        }
                    })
                }
                GetTotalMembers(function(total) {
                    console.log(total);
                });

                fs.readFile(RootFolder + '/config.json',
                    'utf-8',
                    (err, data) => {
                        if (err) {
                            throw err;
                        }

                        // parse JSON object
                        JSONconf = JSON.parse(data);
                        WebsiteDir = JSONconf.WebsiteDir;

                        if (WebsiteDir === undefined) {
                            console.log('Website directory not defined.' + WebsiteDir);
                        } else {
                            if (fs.existsSync(WebsiteDir + '/stats.json')) {
                                const rawData = {
                                    "serverCount": client.guilds.cache.size,
                                    "memberCount": "a lot of"
                                };

                                const data = JSON.stringify(rawData);
                                fs.writeFile(WebsiteDir + '/stats.json', data, (err) => {
                                    if (err) {
                                        throw err;
                                    }
                                    console.log("Updated website member count.");
                                });
                            } else {
                                console.log("Website directory does not exist.");
                            }
                        }

                        // print JSON object
                        console.log('Website dir:' + WebsiteDir);
                    });
            })

        client.login(token);
    });
}
//I never realized the lengths I'd have to go
//All the darkest corners of a sense
//I didn't know
//Just for one moment
//hearing someone call
//Looked beyond the day in hand
//There's nothing there at all
