const { SlashCommandBuilder } = require('@discordjs/builders');
const fetch = require('node-fetch');
const { MessageEmbed } = require('discord.js');
const isEmptyObject = (obj) => Object.keys(obj).length === 0;
const { dirname } = require('path');
const RootFolder = dirname(require.main.filename);

module.exports = {
	data: new SlashCommandBuilder()
		.setName('p')
		.setDescription('Replies with the price of defined coin!')
		.addStringOption(option =>
			option.setName('coin')
				.setDescription('Get price of defined coin!')
				.setRequired(true)),
	async execute(interaction) {
		if (!interaction.isCommand()) return;
		const { ChartKey } = require(RootFolder + '/config.json');
		const cc = interaction.options.getString('coin').toLowerCase();
		const ccupper = (cc.toUpperCase());
		const response = await fetch(`https://api.coingecko.com/api/v3/coins/${cc}`);
		const data = await response.json();
		if (isEmptyObject(data)) {
			await interaction.deferReply();
			const exampleEmbed = new MessageEmbed()
				.setColor('#E74C3C')
				.setTitle(`${ccupper} is not valid!`);
			interaction.editReply({ embeds: [exampleEmbed] });
		}
		if (!isEmptyObject(data)) {
			const usdprice = data.market_data.current_price.usd;
			const pricechange = data.market_data.price_change_24h;
			await interaction.deferReply();
			const exampleEmbed = new MessageEmbed()
				.setColor('#F1C40F')
				.setTitle(`${ccupper} = $${usdprice}`)
				.setDescription(`24h: ${pricechange}`)
				.setImage(`https://api.chart-img.com/v1/tradingview/advanced-chart?width=500&symbol=COINBASE:${data.symbol}USD&height=300&key=${ChartKey}`)
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