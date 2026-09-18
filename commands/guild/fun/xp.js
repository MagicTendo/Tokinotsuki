const { SlashCommandBuilder, MessageFlags } = require("discord.js");
const { getValue } = require("../../../tools/database.js");
const { sendError } = require("../../../tools/error-catcher.js");
const { simplify } = require("../../../tools/modules.js");

module.exports = {
    category: "Serveur",
    data: new SlashCommandBuilder()
        .setName("xp")
        .setDescription("Pour voir ton XP et ton niveau !"),
    async execute(interaction, client) {
        try {
            const currentXP = await getValue(interaction.user.id, "users", "xp") ?? 0;
            const currentLevel = await getValue(interaction.user.id, "users", "level") ?? 0;

            await interaction.reply({ content: `Tu as **${await simplify(interaction.user.id, currentXP)}** XP <:XP:1462199261792960777> et tu es niveau **${currentLevel + 1}** !`, flags: [MessageFlags.Ephemeral] });
        } catch (error) {
            await sendError(interaction, client, error);
        }
    }
};