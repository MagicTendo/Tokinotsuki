const { SlashCommandBuilder } = require("discord.js");
const { getCooldownList, hasCooldownFinished } = require("../../../tools/cooldown.js");
const { getValue, updateValue } = require("../../../tools/database.js");
const { sendError } = require("../../../tools/error-catcher.js");
const { completeQuest, getCurrencySymbol, getWinningTeam, simplify } = require("../../../tools/modules.js");

module.exports = {
    category: "Jeux",
    data: new SlashCommandBuilder()
        .setName("daily")
        .setDescription("Permet d'obtenir une récompense toutes les 24 heures.")
        .setIntegrationTypes([0, 1])
        .setContexts([0, 1, 2]),
    async execute(interaction, client) {
        try {
            const cooldownList = await getCooldownList();

            if (await hasCooldownFinished(interaction, "daily", cooldownList["daily"])) {
                const userID = interaction.user.id;
                const winningTeam = await getWinningTeam(userID);
                const isUserTeamWinning = winningTeam["isUserTeamWinning"];
                const isMegaBonus = Math.floor(Math.random() * 9) === 0;
                const bonus = await getValue(userID, "users", "toki-coin-streak");
                const streak = bonus + 1;
                const hasStreakBonus = streak > 1;
                let streakBonus = 1 + bonus / 100;

                if (streak === 100)
                    await completeQuest(userID, "routine");
                if (isUserTeamWinning)
                    streakBonus += 1;

                let randomTokiCoinAmount = Math.floor((Math.floor(Math.random() * 300) + 200) * streakBonus);

                if (isMegaBonus)
                    randomTokiCoinAmount *= 3;

                let dailyText = `Tu as gagné ${await simplify(userID, randomTokiCoinAmount)} ${getCurrencySymbol("toki-coin")} !`;

                if (hasStreakBonus)
                    dailyText += ` Tu as un bonus de x${streakBonus} pour avoir fait cette comande ${streak} jours d'affilé !`;
                if (isUserTeamWinning)
                    dailyText += " Vu que ton équipe est celle avec le plus de points, un bonus de 100 jours a était ajouté !";
                if (isMegaBonus)
                    dailyText += ` Tu as ${hasStreakBonus || isUserTeamWinning ? "aussi eu" : "obtenu"} un super bonus qui a triplé ta récompense !`;

                await updateValue(userID, "users", "toki-coin", randomTokiCoinAmount);

                await interaction.reply({ content: dailyText });
            }
        } catch (error) {
            await sendError(interaction, client, error);
        }
    }
};