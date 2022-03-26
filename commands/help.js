const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('help')
		.setDescription('Returns the help menu!'),
	async execute(interaction) {
		if (!interaction.isCommand()) return;
    await interaction.deferReply();
        const exampleEmbed = new MessageEmbed()
            .setColor('#E74C3C')
            .setTitle(`Help`)
            .addFields(
              { name: '/Price [Coin]', value: `Returns the current price if defined coin.` },
              { name: '/Buy [Amount] [Coin]', value: `Buy coins with USD!` },
              { name: '/Sell [Amount] [Coin]', value: `Sell coins and receive USD!` },
              { name: '/Pay [Amount] [User]', value: `Send USD to @user!` },
              { name: '/Wallet [Coin]', value: `Returns the amount of specified coin!` }
              )
              .setTimestamp();
              interaction.editReply({ embeds: [exampleEmbed] });
	},
};
//I never realized the lengths I'd have to go
//All the darkest corners of a sense
//I didn't know
//Just for one moment
//hearing someone call
//Looked beyond the day in hand
//There's nothing there at all