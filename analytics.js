const { Client, Collection, Intents } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });
const { dirname } = require('path');
const RootFolder = dirname(require.main.filename);
const { token } = require(RootFolder + '/config.json');

client.login(token);

client.once('ready', c => {
	console.log(`Ready! Logged in as ${c.user.tag}`);
    console.log('\x1b[42m%s\x1b[0m', '---------------SERVERS---------------');
    client.guilds.cache.forEach(guild => {
        console.log('\x1b[32m%s\x1b[0m', `---------------${guild.name}---------------`);
        console.log(`SERVER ID: ${guild.id}`);
        console.log(`MEMBERS: ${guild.memberCount}`);
    })
});