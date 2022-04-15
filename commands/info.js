const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const fetch = require('node-fetch');
const isEmptyObject = (obj) => Object.keys(obj).length === 0;

function InvalidCoin(interaction, coin){
	const exampleEmbed = new MessageEmbed()
		.setColor('#E74C3C')
		.setTitle(`${coin} is not valid!`);
	interaction.editReply({ embeds: [exampleEmbed] });
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('info')
        .setDescription('Stats about defined coin')
        .addStringOption(option =>
			option.setName('coin')
				.setDescription('On what coin you want to get info?')
				.setRequired(true)),
    async execute(interaction) {
        if (!interaction.isCommand()) return;
        const cc = interaction.options.getString('coin').toLowerCase();
        const ccupper = interaction.options.getString('coin').toUpperCase();
        const response = await fetch(`https://api.coingecko.com/api/v3/coins/${cc}?market_data=true`);
        const data = await response.json();
        await interaction.deferReply();
        if (isEmptyObject(data)) {
            InvalidCoin(interaction, ccupper);
        }
        if (!isEmptyObject(data) && !JSON.stringify(data).includes('error')) {
            const id = data.symbol;
            const exampleEmbed = new MessageEmbed()
                .setColor('#F1C40F')
                .setTitle(`Info About ${data.name}`)
                .addFields(
                    { name: `${data.name}`, value: `**Value:** *$${data.market_data.current_price.usd}*
                    **ATH: ** *${data.market_data.ath.usd}*
                    **ATH DATE: ** *$${data.market_data.ath_date.usd}*
                    **Market Cap: ** *$${data.market_data.market_cap[id]}*
                    **MC Rank: ** *${data.market_data.market_cap_rank}*
                    **Total Supply: ** *${data.market_data.total_supply} ${data.symbol.toUpperCase()}*
                    **Current Supply: ** *${data.market_data.circulating_supply} ${data.symbol.toUpperCase()}*
                    **24h: ** *${data.market_data.price_change_percentage_24h_in_currency.usd} %*
                    **7d: ** *${data.market_data.price_change_percentage_7d_in_currency.usd} %*
                    **30d: ** *${data.market_data.price_change_percentage_30d_in_currency.usd} %*
                    **1y: ** *${data.market_data.price_change_percentage_1y_in_currency.usd} %*
                    **Genesis Date: ** *${data.genesis_date}*` },
                )
                .setTimestamp();
            interaction.editReply({ embeds: [exampleEmbed] });
        } else {
            InvalidCoin(interaction, ccupper);
        }
    },
};