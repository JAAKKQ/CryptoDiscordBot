const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('bal')
		.setDescription('Returns your USD balance!'),
	async execute(interaction) {
		if (!interaction.isCommand()) return;
        //Code here
	},
};