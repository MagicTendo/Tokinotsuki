const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require("discord.js");
const { sendError } = require("../../../../tools/error-catcher.js");

module.exports = {
    async execute(interaction, client) {
        try {
            const clicks = Number(interaction.customId.split("_")[1]);

            const bakaButton = new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                    .setEmoji({ name: "🍞" })
                    .setStyle(ButtonStyle.Primary)
                    .setCustomId(`baka-button_${clicks + 1}_0`));

            const bakaEmbed = new EmbedBuilder()
                .setColor([255, 85, 0])
                .setTitle("Ce bouton ne fait absolument rien !")
                .setDescription(`> **${clicks}** clics l'ont confirmés !`)
                .setTimestamp()
                .setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL({ extension: "png", size: 64, dynamic: true }) });

            await interaction.update({ embeds: [bakaEmbed], components: [bakaButton] });
        } catch (error) {
            await sendError(interaction, client, error);
        }
    }
};