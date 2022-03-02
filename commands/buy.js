const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const fetch = require('node-fetch');
const bal = require('./bal');
const isEmptyObject = (obj) => Object.keys(obj).length === 0;
var store = require('json-fs-store')('./data/member');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('buy')
		.setDescription('Buy coins with USD!')
        .addNumberOption(option =>
			option.setName('amount')
				.setDescription('How many coins you want to buy?')
				.setRequired(true))
        .addStringOption(option =>
            option.setName('coin')
            .setDescription('Define the coin you want to buy!')
            .setRequired(true)),
	async execute(interaction) {
		if (!interaction.isCommand()) return;
        const cc = interaction.options.getString('coin').toLowerCase()
        const RawAmount = interaction.options.getNumber('amount')
        const amount = Math.abs(RawAmount)
        const response = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${cc}&vs_currencies=usd`);
		const data = await response.json();
		if (!isEmptyObject(data)) {
			await interaction.deferReply();
            const Price = data[cc].usd;
            const Cost = [Price] * [amount];
            const FixedCost = Cost.toFixed(5);
            const target = interaction.options.getUser('user') ?? interaction.user;
            const ccupper = cc.toUpperCase(); //Pippeli
			const ToCoin = `COIN-${ccupper}`
			store.load(`${target.id}`, "USD", function(err, object){
				if(err) throw err;
				const Bal = object
				if (Bal >= Cost){
					store.load(`${target.id}`, ToCoin, function(err, object, Name){
						if(err) throw err;
						const CoinBal = object
						const USDBalAfterSub = +[Bal] - +[Cost]
						store.add(`${target.id}`, "USD", USDBalAfterSub, function(err, object, Name){
							if(err) throw err;
							const CoinBalAfterAdd = +[CoinBal] + +[amount]
							store.add(`${target.id}`, ToCoin, CoinBalAfterAdd, function(err, object, Name){
								if(err) throw err;
								const exampleEmbed = new MessageEmbed()
								.setColor('#F1C40F')
								.setTitle(`Transaction`)
								.addFields(
									{ name: 'Client', value: `${target.tag}` },
									{ name: 'Bought Amount', value: `+${amount} ${ccupper}` },
									{ name: 'Total $', value: `-${FixedCost}` },
									)
									.setTimestamp()
									.setFooter({ text: 'Type: Buy'});
									interaction.editReply({ embeds: [exampleEmbed]});
								});
							});
						});
				}else {
				const exampleEmbed = new MessageEmbed()
				.setColor('#E74C3C')
				.setTitle(`You don't have enough USD!`)
				.addFields(
					{ name: 'Balance', value: `$${Bal}` },
					)
					.setTimestamp();
				interaction.editReply({ embeds: [exampleEmbed] });
				  }
			});
		}
        if (isEmptyObject(data)) {
			await interaction.deferReply();
            const ccupper = cc.toUpperCase();
			const exampleEmbed = new MessageEmbed()
				.setColor('#E74C3C')
				.setTitle(`${ccupper} is not valid!`);
			interaction.editReply({ embeds: [exampleEmbed] });
        }
	},
};