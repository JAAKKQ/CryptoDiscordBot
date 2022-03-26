const { SlashCommandBuilder } = require('@discordjs/builders');
const fetch = require('node-fetch');
const { MessageEmbed } = require('discord.js');
const isEmptyObject = (obj) => Object.keys(obj).length === 0;

module.exports = {
	data: new SlashCommandBuilder()
		.setName('price')
		.setDescription('Replies with the price of defined coin!')
		.addStringOption(option =>
			option.setName('coin')
				.setDescription('Get price of defined coin!')
				.setRequired(true)),
	async execute(interaction) {
		if (!interaction.isCommand()) return;
		const cc = interaction.options.getString('coin').toLowerCase();
		const ccupper = (cc.toUpperCase());
		const response = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${cc}&vs_currencies=usd&include_24hr_change=true`);
		const data = await response.json();
		if (isEmptyObject(data)) {
			await interaction.deferReply();
			const exampleEmbed = new MessageEmbed()
				.setColor('#E74C3C')
				.setTitle(`${ccupper} is not valid!`);
			interaction.editReply({ embeds: [exampleEmbed] });
		}
		if (!isEmptyObject(data)) {
			const usdprice = data[cc].usd;
			const pricechange = data[cc].usd_24h_change;
			console.log([usdprice]);
			await interaction.deferReply();
			const exampleEmbed = new MessageEmbed()
				.setColor('#F1C40F')
				.setTitle(`${ccupper} = $${usdprice}`)
				.setDescription(`24h: ${pricechange}`)
				.setTimestamp();
			interaction.editReply({ embeds: [exampleEmbed] });
		}
	},
};
//I never realized the lengths I'd have to go
//All the darkest corners of a sense
//I didn't know
//Just for one moment
//hearing someone call
//Looked beyond the day in hand
//There's nothing there at all