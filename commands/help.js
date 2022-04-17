const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('Returns the help menu!'),
  async execute(interaction) {
    if (!interaction.isCommand()) return;
    await interaction.deferReply({ ephemeral: true });
    const exampleEmbed = new MessageEmbed()
      .setColor('#F1C40F')
      .setTitle(`Help`)
      .addFields(
        { name: '/price coin:', value: `Returns the current price if defined coin.` },
        { name: '/buy amount: coin:', value: `Buy coins with USD!` },
        { name: '/sell amount: coin:', value: `Sell coins and receive USD!` },
        { name: '/pay amount: user:', value: `Send USD to user!` },
        { name: '/wallet coin:', value: `Returns the amount of specified coin!` },
        { name: '/mine', value: `Asnwer simple math question and receive USD` },
        { name: '/alert coin: price:', value: `Set price alerts.` },
        { name: '/alerts', value: `Returns all your price alerts.` },
        { name: '/info coin:', value: `Get some advanced information about the defined coin.` },
        { name: '/top', value: `Returns top 10 (by market cap) coins.` },

      )
      .setTimestamp();
    interaction.editReply({ embeds: [exampleEmbed], ephemeral: true });
  },
};
//I never realized the lengths I'd have to go
//All the darkest corners of a sense
//I didn't know
//Just for one moment
//hearing someone call
//Looked beyond the day in hand
//There's nothing there at all