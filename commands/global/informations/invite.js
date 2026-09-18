const { SlashCommandBuilder, EmbedBuilder, MessageFlags } = require("discord.js");
const { sendError } = require("../../../tools/error-catcher.js");

module.exports = {
    category: "Informations",
    data: new SlashCommandBuilder()
        .setName("invite")
        .setDescription("Te donne mon lien d'invitation pour m'ajouter sur d'autres serveurs.")
        .setIntegrationTypes([0, 1])
        .setContexts([0, 1, 2]),
    async execute(interaction, client) {
        try {
            const inviteEmbed = new EmbedBuilder()
                .setColor([255, 85, 0])
                .setTitle("Clique ici pour m'inviter dans ton monde !")
                .setURL("https://discord.com/oauth2/authorize?client_id=791437575642152982")
                .setImage("attachment://qr-code.png")
                .setTimestamp()
                .setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL({ extension: "png", size: 64 }) });

            await interaction.reply({ embeds: [inviteEmbed], files: ["./assets/images/qr-code.png"] });
        } catch (error) {
            await sendError(interaction, client, error);
        }
    }
};