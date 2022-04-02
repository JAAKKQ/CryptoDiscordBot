const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const { dirname } = require('path');
const RootFolder = dirname(require.main.filename);
const fs = require('fs');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('alerts')
        .setDescription('Returns list of every alert you have set.'),
    async execute(interaction) {
        if (!interaction.isCommand()) return;
        await interaction.deferReply();
        var Alerts = [];
        var AlertsEmbed = [];
        if (fs.existsSync(RootFolder + `/data/alerts/${interaction.user.id}.json`)) {
            fs.readFile(RootFolder + `/data/alerts/${interaction.user.id}.json`, 'utf8', function (err, code) {
                if (err) return cb("error loading file" + err);
                try {
                    code = JSON.parse(code);
                    const UserAlerts = Object.keys(code);
                    UserAlerts.forEach(function (UserAlert, index) {
                        if (index === Object.keys(code).length - 1) {
                            Alerts.forEach(function (Alert) {
                                AlertsEmbed.push({ name: `${Alert}`, value: `$${code[Alert]}` },)
                            });
                            const exampleEmbed = new MessageEmbed()
                                .setTitle(`List Of Your Alerts`)
                                .setColor('#F1C40F')
                                .addFields(
                                    AlertsEmbed
                                )
                                .setTimestamp()
                            interaction.editReply({ embeds: [exampleEmbed] });
                        } else {
                            if (!UserAlert.includes('id')) {
                                if (!UserAlert.includes('-state')) {
                                    Alerts.push(UserAlert);
                                }
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
                .setTitle(`You don't have any alerts.`)
                .setColor('#F1C40F')
                .setDescription('You can set alerts buy copying this command: `/alert coin: price:`')
            interaction.editReply({ embeds: [exampleEmbed] });
        }
    },
};