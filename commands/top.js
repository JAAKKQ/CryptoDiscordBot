const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const fetch = require('node-fetch');
const isEmptyObject = (obj) => Object.keys(obj).length === 0;

function InvalidCoin(interaction) {
    const exampleEmbed = new MessageEmbed()
        .setColor('#E74C3C')
        .setTitle(`API call error`);
    interaction.editReply({ embeds: [exampleEmbed] });
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('top')
        .setDescription('Stats about top 5 coins'),
    async execute(interaction) {
        if (!interaction.isCommand()) return;
        const response = await fetch(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=5&page=1&sparkline=false`);
        const data = await response.json();
        await interaction.deferReply();
        if (isEmptyObject(data)) {
            InvalidCoin(interaction);
        }
        if (!isEmptyObject(data) && !JSON.stringify(data).includes('error')) {
            const exampleEmbed = new MessageEmbed()
                .setColor('#F1C40F')
                .setTitle(`TOP 5 COINS`)
                .addFields(
                    { name: `${data[0].market_cap_rank}. ${data[0].name}`, value: `**Value:** *$${data[0].current_price}*
                    **ATH:** *$${data[0].ath}*
                    **ATH DATE:** *${data[0].ath_date}*
                    **Market Cap:** *${data[0].market_cap}*
                    **Total Suply:** *${data[0].total_supply} ${data[0].symbol.toUpperCase()}*
                    **24h:** *${data[0].price_change_percentage_24h}%*` },
                    { name: `${data[1].market_cap_rank}. ${data[1].name}`, value: `**Value:** *$${data[1].current_price}*
                    **ATH:** *${data[1].ath}*
                    **ATH DATE:** *${data[1].ath_date}*
                    **Market Cap:** *${data[1].market_cap}*
                    **Total Suply:** *${data[1].total_supply} ${data[1].symbol.toUpperCase()}*
                    **24h:** *${data[1].price_change_percentage_24h}%*` },
                    { name: `${data[2].market_cap_rank}. ${data[2].name}`, value: `**Value:** *$${data[2].current_price}*
                    **ATH:** *${data[2].ath}*
                    **ATH DATE:** *${data[2].ath_date}*
                    **Market Cap:** *${data[2].market_cap}*
                    **Total Suply:** *${data[2].total_supply} ${data[2].symbol.toUpperCase()}*
                    **24h:** *${data[2].price_change_percentage_24h}%*` },
                    { name: `${data[3].market_cap_rank}. ${data[3].name}`, value: `**Value:** *$${data[3].current_price}*
                    **ATH:** *${data[3].ath}*
                    **ATH DATE:** *${data[3].ath_date}*
                    **Market Cap:** *${data[3].market_cap}*
                    **Total Suply:** *${data[3].total_supply} ${data[3].symbol.toUpperCase()}*
                    **24h:** *${data[3].price_change_percentage_24h}%*` },
                    { name: `${data[4].market_cap_rank}. ${data[4].name}`, value: `**Value:** *$${data[4].current_price}*
                    **ATH:** *${data[4].ath}*
                    **ATH DATE:** *${data[4].ath_date}*
                    **Market Cap:** *${data[4].market_cap}*
                    **Total Suply:** *${data[4].total_supply} ${data[4].symbol.toUpperCase()}*
                    **24h:** *${data[4].price_change_percentage_24h}%*` },
                )
                .setTimestamp();
            interaction.editReply({ embeds: [exampleEmbed] });
        } else {
            InvalidCoin(interaction);
        }
    },
};