const { dirname } = require('path');
const RootFolder = dirname(require.main.filename);
const fs = require('fs');

console.log('Successfully registered application commands!');
console.log('Starting bot...');
const { Client, Collection, Intents } = require('discord.js');
const { token } = require(RootFolder + '/config.json');

const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

const eventFiles = fs.readdirSync(RootFolder + '/events').filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
    const event = require(RootFolder + `/events/${file}`);
    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args));
    }
    else {
        client.on(event.name, (...args) => event.execute(...args));
    }
}

client.commands = new Collection();

const commandFiles = fs.readdirSync(RootFolder + '/commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(RootFolder + `/commands/${file}`);
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
        await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
    }
});

client.login(token); 