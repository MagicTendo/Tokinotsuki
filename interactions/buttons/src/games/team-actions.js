const { EmbedBuilder } = require("discord.js");
const { updateValue } = require("../../../../tools/database.js");
const { sendError } = require("../../../../tools/error-catcher.js");
const { capitalize, addTeamPoints } = require("../../../../tools/modules.js");

module.exports = {
    async execute(interaction, client) {
        try {
            const buttonContent = interaction.customId.split("_");
            const teamName = buttonContent[1];
            const teamFlag = buttonContent[2];

            await updateValue(interaction.user.id, "users", "toki-coin", -10_000, true);
            await updateValue(interaction.user.id, "users", "team", Number(teamFlag), false);

            const newTeamEmbed = new EmbedBuilder(interaction.message.embeds[0].data)
                .setTitle("Succès !")
                .setDescription(`Tu as bien rejoint l'équipe **${capitalize(teamName)}** !`);

            await interaction.update({ embeds: [newTeamEmbed], components: [] });

            await addTeamPoints(interaction, interaction.user.id, 1);
        } catch (error) {
            await sendError(interaction, client, error);
        }
    }
};