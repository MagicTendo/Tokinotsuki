const { EmbedBuilder } = require("discord.js");
const { sendError } = require("../../../../tools/error-catcher.js");

module.exports = {
    async execute(interaction, client) {
        try {
            const buttonContent = interaction.customId.split("_");
            const choice = buttonContent[1];
            const answer = buttonContent[2];
            const prize = buttonContent[3];
            const hasWon = choice === answer;
            const userID = interaction.user.id;

            const dilemmaEmbed = new EmbedBuilder()
                .setColor([255, 85, 0])
                .setDescription(`# ${hasWon ? `Gagné <@${userID}> ! La réponse était bien ${answer} !` : `Perdu <@${userID}>... La réponse était ${answer}...`}${prize ? `\n### 🎁 ${hasWon ? "Tu as remporté" : "Tu n'as pas remporté"} : ${prize}` : ""}`)
                .setTimestamp()
                .setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL({ extension: "png", size: 64 }) });

            await interaction.update({ embeds: [dilemmaEmbed], components: [] });
        } catch (error) {
            await sendError(interaction, client, error);
        }
    }
};