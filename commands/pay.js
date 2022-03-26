const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const { dirname } = require('path');
const RootFolder = dirname(require.main.filename);
var store = require('data-storage-system/WithEnc')(RootFolder + '/data/member');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('pay')
    .setDescription('Pay to other users in USD')
    .addNumberOption(option =>
      option.setName('amount')
        .setDescription('How much you want to send?')
        .setRequired(true))
    .addUserOption(option =>
      option.setName('user')
        .setDescription('Who you want to send the money?')
        .setRequired(true)),
  async execute(interaction) {
    if (!interaction.isCommand()) return;
    const RawAmount = interaction.options.getNumber('amount')
    const Amount = Math.abs(RawAmount)
    const User = interaction.options.getUser('user')
    const target = interaction.user;
    await interaction.deferReply();
    store.load(`${target.id}`, "USD", function (err, object) {
      const Bal = object
      if (Bal >= Amount) {
        const BalAfterSub = +[Bal] - +[Amount]
        store.load(`${User.id}`, "USD", function (err, object, Name) {
          if (err) throw err;
          const RBal = object
          const ReceiverBal = +[RBal] + +[Amount]
          store.add(`${target.id}`, "USD", BalAfterSub, function (err, object, Name) {
            if (err) throw err;
            store.add(`${User.id}`, "USD", ReceiverBal, function (err, object, Name) {
              if (err) throw err;
              const exampleEmbed = new MessageEmbed()
                .setColor('#F1C40F')
                .setTitle(`Transaction`)
                .addFields(
                  { name: 'Client', value: `${target.tag}` },
                  { name: 'Reciever', value: `${User.tag}` },
                  { name: 'Send Amount', value: `$${Amount}` },
                )
                .setTimestamp()
                .setFooter({ text: 'Type: Client Payment' });
              interaction.editReply({ embeds: [exampleEmbed] });
            });
          });
        });
      } else {
        const exampleEmbed = new MessageEmbed()
          .setColor('#E74C3C')
          .setTitle(`You don't have enough USD!`)
          .addFields(
            { name: 'Balance', value: `$${Bal}` }
          )
          .setTimestamp();
        interaction.editReply({ embeds: [exampleEmbed] });
      }
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