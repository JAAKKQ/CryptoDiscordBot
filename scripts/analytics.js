const { Client, Collection, Intents } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });
const { dirname } = require('path');
const RootFolder = dirname(require.main.filename);
const { token } = require(RootFolder + '/config.json');
var NumMembers;

client.login(token);

client.once('ready', c => {
	console.log(`Ready! Logged in as ${c.user.tag}`);
    console.log('\x1b[42m%s\x1b[0m', `---------------IN ${client.guilds.cache.size} SERVERS---------------`);
    client.guilds.cache.forEach(guild => {
        console.log('\x1b[32m%s\x1b[0m', `---------------| ${guild.name} |---------------`);
        console.log(`SERVER ID: ${guild.id}`);
        console.log(`MEMBERS: ${guild.memberCount}`);
        NumMembers = +[NumMembers] + +[guild.memberCount];
        console.log('\x1b[34m%s\x1b[0m', `SERVING ${NumMembers} MEMBERS`)
    })
});
//I never realized the lengths I'd have to go
//All the darkest corners of a sense
//I didn't know
//Just for one moment
//hearing someone call
//Looked beyond the day in hand
//There's nothing there at all