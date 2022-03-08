const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
var store = require('data-storage-system/WithEnc')('./data/member');
var MathCreator = require('math-question-creator')();

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
        var Difficulty;
        var Question;
        if (RawAnswer === null) {
            MathCreator.new(function(CalQuestion, CalDiff){
                Difficulty = CalDiff;
                Question = CalQuestion;
            });
            const CorrectAnswer = eval(Question);
            const target = interaction.options.getUser('user') ?? interaction.user;
            store.add(target.id, "Question-Answer", CorrectAnswer, function(err, object){
                if(err) throw err;
                store.add(target.id, "Question-Diff", Difficulty, function(err, object){
                    if(err) throw err;
                  });
              });
            const exampleEmbed = new MessageEmbed()
            .setColor('#F1C40F')
			.setTitle(`Miner`)
            .setDescription("Answer the question with `/mine [answer]`. If you don't define answer it will give you a new math question.")
			.addFields(
                { name: 'The Question', value: `${Question}` },
                { name: 'Estimated Reward', value: `${Difficulty}` }
                )
                .setTimestamp()
                interaction.editReply({ embeds: [exampleEmbed]});
        } else {
            const target = interaction.options.getUser('user') ?? interaction.user;
            store.load(target.id, "Question-Answer", function(err, object){
                const CorAnswer = object;
                var Reward;
                var QuesReward;
                store.load(target.id, "Question-Diff", function(err, object){
                    QuesReward = object;
                    var EmbedColor = "#E74C3C";
                    if (+[RawAnswer] === +[CorAnswer]){
                        Reward = [QuesReward];
                        EmbedColor = "#F1C40F";
                    } else {
                        Reward = 0;
                        EmbedColor = "#E74C3C";
                    }
                    MathCreator.new(function(CalQuestion, CalDiff){
                        Difficulty = CalDiff;
                        Question = CalQuestion;
                        const CorrectAnswer = eval(Question);
                        store.add(target.id, "Question-Answer", CorrectAnswer, function(err, object){
                            if(err) throw err;
                            store.add(target.id, "Question-Diff", Difficulty, function(err, object){
                                if(err) throw err;
                            });
                        });
                    });
                    const exampleEmbed = new MessageEmbed()
                    .setColor(EmbedColor)
                    .setTitle(`Transaction`)
                    .addFields(
                        { name: 'Client', value: `${target.tag}` },
                        { name: 'Client Answer', value: `${RawAnswer}`},
                        { name: 'Correct Answer', value: `${CorAnswer}` },
                        { name: 'Reward', value: `$${Reward}` },
                        { name: 'New Question', value: `${Question}`, inline: true},
                        { name: 'Estimated Reward', value: `${Difficulty}`, inline: true}
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
                if(err) throw err;
              });
        }
	},
};