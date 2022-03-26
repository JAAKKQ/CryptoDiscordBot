const fs = require('fs');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
var path = require('path');
var RootFolder = path.resolve("./");
const { clientId, guildId, token } = require(RootFolder + '/config.json');

module.exports = function (dir) {
	return {
		dir: dir,

		deploy: function (cb) {
			console.log('Registering application commands...')
			const commands = [];
			const commandFiles = fs.readdirSync(RootFolder + '/commands').filter(file => file.endsWith('.js'));

			for (const file of commandFiles) {
				const command = require(RootFolder + `/commands/${file}`);
				commands.push(command.data.toJSON());
			}

			const rest = new REST({ version: '9' }).setToken(token);

			rest.put(Routes.applicationCommands(clientId, guildId), { body: commands })
				.then(() => cb())
				.catch(console.error);
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