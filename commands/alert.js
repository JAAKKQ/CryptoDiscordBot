const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const isEmptyObject = (obj) => Object.keys(obj).length === 0;
var alert = require('data-storage-system')('./data/alerts');
const fetch = require('node-fetch');

function InvalidCoin(interaction, coin){
	const exampleEmbed = new MessageEmbed()
		.setColor('#E74C3C')
		.setTitle(`${coin} is not valid!`);
	interaction.editReply({ embeds: [exampleEmbed] });
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('alert')
        .setDescription('Set price alerts')
        .addStringOption(option =>
            option.setName('coin')
                .setDescription("Bitcoin, Ethereum what coin?")
                .setRequired(true))
        .addNumberOption(option =>
            option.setName('price')
                .setDescription("Alert at this price point.")
                .setRequired(true)),
    async execute(interaction) {
        if (!interaction.isCommand()) return;
        await interaction.deferReply();
        const AlertCoin = interaction.options.getString('coin').toUpperCase();
        const AlertPrice = interaction.options.getNumber('price');
        const target = interaction.options.getUser('user') ?? interaction.user;
        const response = await fetch(`https://api.coingecko.com/api/v3/coins/${AlertCoin.toLowerCase()}`);
		const data = await response.json();
        if (isEmptyObject(data)) {
            InvalidCoin(interaction, AlertCoin);
        }
        if (!isEmptyObject(data) && !JSON.stringify(data).includes('error')) {
            alert.add(`${target.id}`, AlertCoin, AlertPrice, function (err, object, Name) {
                if (err) throw err;
                alert.add(`${target.id}`, AlertCoin + '-state', 0, function (err, object) {
                    const exampleEmbed = new MessageEmbed()
                        .setTitle(`Alert Set`)
                        .setColor('#F1C40F')
                        .addFields(
                            { name: 'Coin', value: `${AlertCoin}` },
                            { name: 'Alert At', value: `$${AlertPrice}` },
                            { name: 'Current Price', value: `$${data.market_data.current_price.usd}` }
                        )
                        .setTimestamp()
                    interaction.editReply({ embeds: [exampleEmbed] });
                });
            });
        }else{
            InvalidCoin(interaction, AlertCoin);
        }
    },
};