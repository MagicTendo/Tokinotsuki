const { SlashCommandBuilder, MessageFlags } = require("discord.js");
const { Api } = require("@top-gg/sdk");
const topgg = new Api(process.env.TOPGG_API_KEY);
const { getCooldownList, hasCooldownFinished } = require("../../../tools/cooldown.js");
const { updateValue } = require("../../../tools/database.js");
const { sendError } = require("../../../tools/error-catcher.js");
const { addTeamPoints, getCurrencySymbol, simplify } = require("../../../tools/modules.js");

module.exports = {
    category: "Informations",
    data: new SlashCommandBuilder()
        .setName("vote")
        .setDescription("Pour avoir des récompenses en me votant sur Top.gg !")
        .setIntegrationTypes([0])
        .setContexts([0]),
    async execute(interaction, client) {
        try {
            const userID = interaction.user.id;
            const voted = await topgg.hasVoted(userID);

            if (!voted)
                return await interaction.reply({ content: "🗳️ Pour recevoir la récompense, vote moi sur [**Top.gg**](https://top.gg/bot/791437575642152982/vote) !", flags: [MessageFlags.Ephemeral] });

            const cooldownList = await getCooldownList();

            if (await hasCooldownFinished(interaction, "vote", cooldownList["vote"])) {
                const randomTokiCoinAmount = Math.floor(Math.random() * 3_500) + 1_500;

                await updateValue(userID, "users", "toki-coin", randomTokiCoinAmount);

                await interaction.reply({ content: `Merci d'avoir voté pour moi ! Tu as gagné ${await simplify(userID, randomTokiCoinAmount)} ${getCurrencySymbol("toki-coin")} !` });

                await addTeamPoints(interaction, userID, 5);
            }
        } catch (error) {
            await sendError(interaction, client, error);
        }
    }
};