const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, MessageFlags } = require("discord.js");
const { updateValue } = require("../../../../tools/database.js");
const { sendError } = require("../../../../tools/error-catcher.js");
const { cards } = require("../../../../tools/items-table.js");

module.exports = {
    async execute(interaction, client) {
        try {
            const buttonContent = interaction.customId.split("_");
            const currentCardIndex = Number(buttonContent[1]) + 1;
            const cardIndex = buttonContent[currentCardIndex];
            const cardFullName = Object.keys(cards)[cardIndex];
            const card = cards[cardFullName];
            const cardName = card["name"];
            const cardColor = card["color"];

            buttonContent[1] = Number(buttonContent[1]) + 1;

            await updateValue(interaction.user.id, "users", cardName, 1);

            const packOpeningButton = [];

            if (currentCardIndex < 5)
                packOpeningButton.push(new ActionRowBuilder().addComponents(
                    new ButtonBuilder()
                        .setEmoji({ name: "🎴" })
                        .setLabel("Suivant")
                        .setStyle(ButtonStyle.Secondary)
                        .setCustomId(buttonContent.join("_"))));

            const packOpeningEmbed = new EmbedBuilder()
                .setColor(cardColor)
                .setTitle(cardFullName)
                .setImage(`attachment://card-${cardName}.png`)
                .setTimestamp()
                .setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL({ extension: "png", size: 64, dynamic: true }) });

            await interaction.update({ embeds: [packOpeningEmbed], files: [`./assets/images/cards/card-${cardName}.png`], components: packOpeningButton, flags: MessageFlags.Ephemeral });
        } catch (error) {
            await sendError(interaction, client, error);
        }
    }
};