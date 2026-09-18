const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { sendError } = require("../../../tools/error-catcher.js");

module.exports = {
    category: "Fun",
    data: new SlashCommandBuilder()
        .setName("mix-names")
        .setDescription("Mélange deux pseudonymes pour en créer un nouveau.")
        .setIntegrationTypes([0, 1])
        .setContexts([0, 1, 2])
        .addUserOption(option => option
            .setName("first-user")
            .setDescription("Le premier utilisateur.")
            .setRequired(true))
        .addUserOption(option => option
            .setName("second-user")
            .setDescription("Et le deuxième utilisateur.")
            .setRequired(true)),
    async execute(interaction, client) {
        try {
            const firstUser = interaction.options.getUser("first-user");
            const secondUser = interaction.options.getUser("second-user");
            const firstMember = interaction.options.getMember("first-user");
            const secondMember = interaction.options.getMember("second-user");
            const firstUserName = firstMember.nickname ?? firstMember.nick ?? firstUser.nickname ?? firstUser.globalName ?? firstUser.username;
            const secondUserName = secondMember.nickname ?? secondMember.nick ?? secondUser.nickname ?? secondUser.globalName ?? secondUser.username;
            const firstUserHalfName = firstUserName.slice(0, Math.floor(firstUserName.length / 2));
            const secondUserHalfName = secondUserName.slice(Math.floor(secondUserName.length / 2));

            const mixNamesEmbed = new EmbedBuilder()
                .setColor([255, 85, 0])
                .setDescription(`### <@${firstUser.id}> + <@${secondUser.id}>\n> ## = ${firstUserHalfName}${secondUserHalfName} !`)
                .setTimestamp()
                .setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL({ extension: "png", size: 64 }) });

            await interaction.reply({ embeds: [mixNamesEmbed] });
        } catch (error) {
            await sendError(interaction, client, error);
        }
    }
};