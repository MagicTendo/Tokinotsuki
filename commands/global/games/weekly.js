const { SlashCommandBuilder } = require("discord.js");
const { getCooldownList, hasCooldownFinished } = require("../../../tools/cooldown.js");
const { updateValue } = require("../../../tools/database.js");
const { sendError } = require("../../../tools/error-catcher.js");
const { getCurrencySymbol, getWinningTeam, simplify } = require("../../../tools/modules.js");

module.exports = {
    category: "Jeux",
    data: new SlashCommandBuilder()
        .setName("weekly")
        .setDescription("Permet d'obtenir une récompense toutes les semaines.")
        .setIntegrationTypes([0, 1])
        .setContexts([0, 1, 2]),
    async execute(interaction, client) {
        try {
            const cooldownList = await getCooldownList();

            if (await hasCooldownFinished(interaction, "weekly", cooldownList["weekly"])) {
                const userID = interaction.user.id;
                const winningTeam = await getWinningTeam(userID);
                let randomTokiCoinAmount = Math.floor((Math.floor(Math.random() * 2_000) + 500) * (winningTeam["isUserTeamWinning"] ? 2 : 1));

                await updateValue(userID, "users", "toki-coin", randomTokiCoinAmount);

                await interaction.reply({ content: `Tu as gagné ${await simplify(userID, randomTokiCoinAmount)} ${getCurrencySymbol("toki-coin")} !` });
            }
        } catch (error) {
            await sendError(interaction, client, error);
        }
    }
};