const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const fetch = require('node-fetch');
const { dirname } = require('path');
const RootFolder = dirname(require.main.filename);
var store = require('data-storage-system/WithEnc')(RootFolder + '/data/member');
const isEmptyObject = (obj) => Object.keys(obj).length === 0;
const { token } = require(RootFolder + '/config.json');
var key = token;
var encryptor = require('simple-encryptor')(key);
const fs = require('fs');


module.exports = {
  data: new SlashCommandBuilder()
    .setName('wallet')
    .setDescription("Returns specified coin's balance!")
    .addStringOption(option =>
      option.setName('coin')
        .setDescription('Define the coin! Example: bitcoin')),
  async execute(interaction) {
    if (!interaction.isCommand()) return;
    await interaction.deferReply();
    const cc = interaction.options.getString('coin')
    console.log(cc);
    const target = interaction.options.getUser('user') ?? interaction.user;
    if (!cc === null) {
      const cc = cc.toLowerCase()
      const ccupper = interaction.options.getString('coin').toUpperCase()
      const response = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${cc}&vs_currencies=usd`);
      const data = await response.json();
      const ToCoin = `COIN-${ccupper}`
      if (!isEmptyObject(data)) {
        store.load(`${target.id}`, ToCoin, function (err, object) {
          if (err) throw err;
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
    } else {
      if (fs.existsSync(RootFolder + '/data/member/' + target.id + '.json')) {
        fs.readFile(RootFolder + '/data/member/' + target.id + '.json', 'utf8', function (err, code) {
          if (err) return cb("error loading file" + err);
          try {
            var jsonObj = JSON.parse(code);
            jsonObj = encryptor.decrypt(jsonObj);
            const dataObj = Object.keys(jsonObj);
            var coins = [];
            dataObj.forEach(function (data, index) {
              if (!data.includes('COIN-')) {
                coins.push(data);
                if(dataObj.length >= index){
                  const exampleEmbed = new MessageEmbed()
                  .setColor('#F1C40F')
                  .setTitle(`Your wallet overview`)
                  .addFields(
                    { name: 'Bitcoin', value: `0 BTC (0 USD)` },
                  )
                  .setTimestamp();
                interaction.editReply({ embeds: [exampleEmbed] });
                }
              }
            });
          }
          catch (e) {
            console.log("Error parsing " + f + ": " + e);
          }
        });
      } else {
        const exampleEmbed = new MessageEmbed()
        .setColor('#F1C40F')
        .setTitle(`Your wallet overview`)
        .addFields(
          { name: 'Bitcoin', value: `0 BTC (0 USD)` },
        )
        .setTimestamp();
      interaction.editReply({ embeds: [exampleEmbed] });
      }
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