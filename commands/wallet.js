const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const fetch = require('node-fetch');
var store = require('json-fs-store')('./data/member');
const isEmptyObject = (obj) => Object.keys(obj).length === 0;


module.exports = {
	data: new SlashCommandBuilder()
		.setName('wallet')
		.setDescription("Returns specified coin's balance!")
        .addStringOption(option =>
            option.setName('coin')
            .setDescription('Define the coin! Example: bitcoin')
            .setRequired(true)),
	async execute(interaction) {
		if (!interaction.isCommand()) return;
        await interaction.deferReply();
        const cc = interaction.options.getString('coin').toLowerCase()
        const ccupper = interaction.options.getString('coin').toUpperCase()
        const response = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${cc}&vs_currencies=usd`);
        const data = await response.json();
        const ToCoin = `COIN-${ccupper}`
        const target = interaction.options.getUser('user') ?? interaction.user;
        if (!isEmptyObject(data)) {
			store.load(`${target.id}`, ToCoin, function(err, object){
                if(err) throw err;
                const CoinBal = object
                const exampleEmbed = new MessageEmbed()
                    .setColor('#F1C40F')
                    .setTitle(`Your ${ccupper} wallet`)
                    .addFields(
                        { name: 'Balance', value: `${CoinBal} ${ccupper}` },
                        )
                    .setTimestamp();
                interaction.editReply({ embeds: [exampleEmbed] });
              });
            } else {
            const exampleEmbed = new MessageEmbed()
            .setColor('#E74C3C')
				    .setTitle(`${ccupper} is not supported!`);
            interaction.editReply({ embeds: [exampleEmbed] });
          }
        },
      };