const { MessageFlags } = require("discord.js");
const { getValue, updateValue } = require("../../../../tools/database.js");
const { sendError } = require("../../../../tools/error-catcher.js");
const { flagToTeam } = require("../../../../tools/flags.js");

module.exports = {
    async execute(interaction, client) {
        try {
            const modalOptions = interaction.customId.split("_");
            const newTeamFlag = interaction.fields.getStringSelectValues("change-team-flag")[0];
            const userID = interaction.user.id;
            const currentFlag = await getValue(userID, "users", "team");
            const contractPrice = Number(modalOptions[1]);

            if (currentFlag == newTeamFlag) {
                await interaction.reply({ content: "❌ Tu es déjà dans cette équipe !", flags: [MessageFlags.Ephemeral] });
            } else {
                await updateValue(userID, "users", "cookie", -contractPrice);
                await updateValue(userID, "users", "team", newTeamFlag, false);

                await interaction.reply({ content: `✅ Tu es maintenant dans l'équipe \`${await flagToTeam(newTeamFlag)}\` !`, flags: [MessageFlags.Ephemeral] });
            }
        } catch (error) {
            await sendError(interaction, client, error);
        }
    }
};