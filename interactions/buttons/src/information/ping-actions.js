const { EmbedBuilder } = require("discord.js");
const { sendError } = require("../../../../tools/error-catcher.js");
const { getPing } = require("../../../../tools/modules.js");

module.exports = {
    async execute(interaction, client) {
        try {
            const pings = await getPing(interaction, true, true);
            const ping = pings[0];
            const apiPing = pings[1];
            const speedAppreciation = pings[2];

            const pingEmbed = new EmbedBuilder()
                .setColor([255, 85, 0])
                .setDescription(`### 🏓 Pong <@${interaction.user.id}> !\n\n📊 **Score de rapidité** : ${speedAppreciation}\n🛜 **Latence (round-trip latency)** : ${ping}ms\n📶 **Latence du websocket heartbeat (API)** : ${apiPing}ms`);

            await interaction.channel.messages.fetch(interaction.message.id).then(message => message.edit({ embeds: [pingEmbed] }));
        } catch (error) {
            await sendError(interaction, client, error);
        }
    }
};