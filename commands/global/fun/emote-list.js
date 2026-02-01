const { SlashCommandBuilder, EmbedBuilder, MessageFlags } = require("discord.js");
const { sendError } = require("../../../tools/error-catcher.js");
const { getEmoteList } = require("../../../tools/modules.js");

module.exports = {
    category: "Fun",
    data: new SlashCommandBuilder()
        .setName("emote-list")
        .setDescription("Donne une liste de tous les émojis utilisables pour la commande /say.")
        .setIntegrationTypes([0, 1])
        .setContexts([0, 1, 2]),
    async execute(interaction, client) {
        try {
            const emoteList = await getEmoteList();
            let emotes = "";

            for (let i = 3; i < Object.keys(emoteList).length; i++) {
                emotes += `- **${Object.keys(emoteList)[i]}** => ${Object.values(emoteList)[i]}\n`;
            }

            const emoteListEmbed = new EmbedBuilder()
                .setColor([255, 85, 0])
                .setTitle("Liste des emotes utilisables")
                .setDescription(`> Cela fonctionne uniquement pour la commande \`/say\` !\n\n${emotes}`)
                .setTimestamp()
                .setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL({ extension: "png", size: 64, dynamic: true }) });

            await interaction.reply({ embeds: [emoteListEmbed], flags: MessageFlags.Ephemeral });
        } catch (error) {
            await sendError(interaction, client, error);
        }
    }
};