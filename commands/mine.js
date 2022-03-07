const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
var store = require('data-storage-system/WithEnc')('./data/member');

Number.prototype.countDecimals = function () {
    if(Math.floor(this.valueOf()) === this.valueOf()) return 0;
    return this.toString().split(".")[1].length || 0; 
}
function hasDecimal (num) {
	return !!(num % 1);
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName('mine')
		.setDescription('Solve math questions and receive USD.')
        .addNumberOption(option =>
            option.setName('answer')
                .setDescription("If you don't define answer it will give you a new math question.")
                .setRequired(false)),
	async execute(interaction) {
		if (!interaction.isCommand()) return;
        const RawAnswer = interaction.options.getNumber('answer')
        await interaction.deferReply();
        var Difficulty = "";
        if (RawAnswer === null) {
            var a = Math.floor(Math.random() * 10) + 1;
            var b = Math.floor(Math.random() * 10) + 1;
            var c = [Math.floor(Math.random()*4)];
            var op = ["+", "-", "/", "*"][c];
            const question = `${a}${op}${b}`;
            const CorrectAnswer = eval( a + op + b);
            const target = interaction.options.getUser('user') ?? interaction.user;
            store.add(target.id, "Question-Answer", CorrectAnswer, function(err, object){
                if(err) throw err;
              });
            const exampleEmbed = new MessageEmbed()
            .setColor('#F1C40F')
			.setTitle(`Miner`)
            .setDescription("Answer the question with `/mine [answer]`. If you don't define answer it will give you a new math question.")
			.addFields(
                { name: 'The Question', value: `${question}` },
                )
                .setTimestamp()
                interaction.editReply({ embeds: [exampleEmbed]});
                console.log(Difficulty);
        } else {
            const target = interaction.options.getUser('user') ?? interaction.user;
            store.load(target.id, "Question-Answer", function(err, object){
                const CorAnswer = object;
                var Reward = "";
                var EmbedColor = "#E74C3C";
                if (+[RawAnswer] === +[CorAnswer]){
                    Reward = [CorAnswer] / 2;
                    EmbedColor = "#F1C40F";
                } else {
                    Reward = -[CorAnswer] / 2;
                    EmbedColor = "#E74C3C";
                }
                var a = Math.floor(Math.random() * 10) + 1;
                var b = Math.floor(Math.random() * 10) + 1;
                var c = [Math.floor(Math.random()*4)];
                var op = ["+", "-", "/", "*"][c];
                const question = `${a}${op}${b}`;
                const CorrectAnswer = eval( a + op + b);
                store.add(target.id, "Question-Answer", CorrectAnswer, function(err, object){
                    if(err) throw err;
                });
                const exampleEmbed = new MessageEmbed()
                .setColor(EmbedColor)
                .setTitle(`Transaction`)
                .addFields(
                    { name: 'Client', value: `${target.tag}` },
                    { name: 'Client Answer', value: `${RawAnswer}` },
                    { name: 'Correct Answer', value: `${CorAnswer}` },
                    { name: 'Reward', value: `$${Reward}` },
                    { name: 'New Question', value: `${question}` }
                    )
                    .setTimestamp()
                    .setFooter({ text: 'Type: Miner'});
                    interaction.editReply({ embeds: [exampleEmbed]});
                store.load(target.id, "USD", function(err, object){
                    var NewBal = +[object] + +[Reward];
                    if (NewBal <= 0){
                        NewBal = 0
                    }
                    store.add(target.id, "USD", NewBal, function(err, object){
                        if(err) throw err;
                      });
                    if(err) throw err;
                  });
                if(err) throw err;
              });
        }
	},
};