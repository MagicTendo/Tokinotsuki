const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { sendError } = require("../../../tools/error-catcher.js");

module.exports = {
    category: "Fun",
    data: new SlashCommandBuilder()
        .setName("9ball")
        .setDescription("Permet d'avoir une réponse à n'importe quelle question !")
        .setIntegrationTypes([0, 1])
        .setContexts([0, 1, 2])
        .addStringOption(option => option
            .setName("question")
            .setDescription("Quelle est ta question ?")
            .setRequired(true)),
    async execute(interaction, client) {
        try {
            const question = interaction.options.getString("question");
            const answers = [
                "Oui",
                "Ouais",
                "D'après mes sources, oui",
                "Carrément",
                "Totalement",
                "Évidemment",
                "Très certainement",
                "Très probable",

                "Non",
                "Nan",
                "D'après mes sources, non",
                "Clairement pas",
                "Pas du tout",
                "Peu probable",
                "Impossible",
                "Jamais",

                "Peut être",
                "C'est possible, à voir",
                "Comment tu veux que je sache ça moi",
                "Bonne question",
                "Tous ce que je sais, c'est que j'ai faim",
            ];

            const punctuations = [
                "",
                " !",
                "..."
            ];

            const answerIndex = Math.floor(Math.random() * answers.length);
            const punctuationIndex = Math.floor(Math.random() * punctuations.length);

            const answerEmbed = new EmbedBuilder()
                .setColor([0, 152, 217])
                .setTitle(`<:9Ball:838153873226072154> ${question}`)
                .setDescription(`> ${answers[answerIndex]}${punctuations[punctuationIndex]}`)
                .setThumbnail("attachment://9-ball.png")
                .setTimestamp()
                .setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL({ extension: "png", size: 64, dynamic: true }) });

            await interaction.reply({ embeds: [answerEmbed], files: ["./assets/images/fun/9-ball.png"] });
        } catch (error) {
            await sendError(interaction, client, error);
        }
    }
};