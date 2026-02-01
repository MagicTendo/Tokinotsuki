const { MessageFlags } = require("discord.js");
const { getValue, updateValue } = require("./database.js");
const { getWinningTeam } = require("./modules.js");

async function getCooldownList() {
    const cooldowns = {
        "arkeology": 5_400_000,
        "cookie": 3_600_000,
        "daily": 86_400_000,
        "fight": 3_600_000,
        "fish": 1_800_000,
        "gtn": 60_000,
        "guess-my-ping": 1_800_000,
        "blackjack": 1_800_000,
        "jackpot": 1_800_000,
        "pikpik": 3_600_000,
        "rob": 10_800_000,
        "roulette": 1_800_000,
        "snap-bird": 7_200_000,
        "vote": 43_200_000,
        "weekly": 604_800_000
    };

    return cooldowns;
}

async function hasCooldownFinished(interaction, dataType, delay) {
    const userID = interaction.user.id;
    const cooldownLastTime = await getValue(userID, "users", `${dataType}-cooldown`);
    const currentTime = Date.now();
    const timeDifference = currentTime - cooldownLastTime;
    const winningTeam = await getWinningTeam(userID);
    const isUserTeamWinning = winningTeam["isUserTeamWinning"];
    const teamSpecialCooldowns = ["cookie", "jackpot", "rob"];

    if (timeDifference >= delay) {
        await updateValue(userID, "users", `${dataType}-cooldown`, 0, false);

        if (dataType === "daily")
            timeDifference >= delay * 2 ? await updateValue(userID, "users", "toki-coin-streak", 0, false) : await updateValue(userID, "users", "toki-coin-streak", 1);

        await updateValue(userID, "users", `${dataType}-cooldown`, isUserTeamWinning && teamSpecialCooldowns.includes(dataType) ? currentTime - (delay / 2) : currentTime, false);

        return true;
    } else {
        const finishTimeSeconds = Math.round((cooldownLastTime + delay) / 1_000);

        await interaction.reply({ content: `⌚ Attends encore un peu, tu pourras refaire cette commande <t:${finishTimeSeconds}:R> !`, flags: MessageFlags.Ephemeral });

        return false;
    }
}

module.exports = { getCooldownList, hasCooldownFinished };