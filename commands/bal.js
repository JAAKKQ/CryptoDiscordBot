const { SlashCommandBuilder } = require('@discordjs/builders');
const fetch = require('node-fetch');
const { dirname } = require('path');
const RootFolder = dirname(require.main.filename);
const { MessageEmbed } = require('discord.js');
var store = require('data-storage-system/WithEnc')(RootFolder + '/data/member');
const isEmptyObject = (obj) => Object.keys(obj).length === 0;

module.exports = {
	data: new SlashCommandBuilder()
		.setName('bal')
		.setDescription('Returns your USD balance!'),
	async execute(interaction) {
		if (!interaction.isCommand()) return;
        await interaction.deferReply();
        const target = interaction.options.getUser('user') ?? interaction.user;
		store.load(`${target.id}`, "USD", function(err, object, Name){
			if(err) throw err;
			const Bal = object;
			const exampleEmbed = new MessageEmbed()
				.setColor('#F1C40F')
				.setTitle(`Your balance`)
				.setDescription(`$${Bal}`)
				.setTimestamp();
			interaction.editReply({ embeds: [exampleEmbed] });
		  });
	},
};
//I never realized the lengths I'd have to go
//All the darkest corners of a sense
//I didn't know
//Just for one moment
//hearing someone call
//Looked beyond the day in hand
//There's nothing there at all