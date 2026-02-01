const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require("discord.js");
const { sendError } = require("../../../tools/error-catcher.js");
const { getPing } = require("../../../tools/modules.js");

module.exports = {
    category: "Informations",
    data: new SlashCommandBuilder()
        .setName("ping")
        .setDescription("Te donne ma latence et celle de l'API.")
        .setIntegrationTypes([0, 1])
        .setContexts([0, 1, 2]),
    async execute(interaction, client) {
        try {
            const pings = await getPing(interaction, true);
            const ping = pings[0];
            const apiPing = pings[1];
            const speedAppreciation = pings[2];
            let pingComponent = [];

            if (Object.keys(interaction.authorizingIntegrationOwners)[0] === "0") {
                const pingRefreshButton = new ActionRowBuilder().addComponents(
                    new ButtonBuilder()
                        .setEmoji({ name: "🔃" })
                        .setStyle(ButtonStyle.Primary)
                        .setCustomId(`ping_${interaction.user.id}`));

                pingComponent.push(pingRefreshButton);
            }

            const pingEmbed = new EmbedBuilder()
                .setColor([255, 85, 0])
                .setDescription(`### 🏓 Pong <@${interaction.user.id}> !\n\n📊 **Score de rapidité** : ${speedAppreciation}\n🛜 **Latence (round-trip latency)** : ${ping}ms\n📶 **Latence du websocket heartbeat (API)** : ${apiPing}ms`)
                .setTimestamp()
                .setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL({ extension: "png", size: 64, dynamic: true }) });

            await interaction.editReply({ content: "", embeds: [pingEmbed], components: pingComponent });
        } catch (error) {
            await sendError(interaction, client, error);
        }
    }
};