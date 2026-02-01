const { EmbedBuilder, ActionRowBuilder, MessageFlags } = require("discord.js");
const { hasValue, updateValue } = require("../../../../tools/database.js");
const { sendError } = require("../../../../tools/error-catcher.js");

module.exports = {
    async execute(interaction, client) {
        try {
            const buttonContent = interaction.customId.split("_");
            const userID = interaction.user.id;
            const itemName = buttonContent[1];

            if (await hasValue(userID, "users", itemName)) {
                await updateValue(userID, "users", itemName, -1);

                const itemIndex = buttonContent[2];
                const itemAmount = Number(buttonContent[3]) + 1;
                const translatedNames = {
                    "food-provision": "Provision de nourriture",
                    "water-provision": "Provision d'eau",
                    "care-kit": "Kit de soin",
                    "sleep-kit": "Kit de nuit"
                }

                const adventurePreparationsEmbed = new EmbedBuilder(interaction.message.embeds[0].data);
                const adventurePreparationsButtons = new ActionRowBuilder().addComponents(interaction.message.components[0].components);
                const adventurePreparationsMenu = new ActionRowBuilder().addComponents(interaction.message.components[1].components);

                adventurePreparationsButtons.components[itemIndex].data.label = `${translatedNames[itemName]} (${itemAmount})`;
                adventurePreparationsButtons.components[itemIndex].data.custom_id = `adventure_${itemName}_${itemIndex}_${itemAmount}_${userID}`;

                await interaction.update({ embeds: [adventurePreparationsEmbed], components: [adventurePreparationsButtons, adventurePreparationsMenu] });
            } else {
                await interaction.reply({ content: "❌ Tu n'as pas cette ressource !", flags: MessageFlags.Ephemeral });
            }
        } catch (error) {
            await sendError(interaction, client, error);
        }
    }
};