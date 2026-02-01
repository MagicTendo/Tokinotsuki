const { sendError } = require("../../../../tools/error-catcher.js");
const { getRandomItem, sendResult } = require("../../../../tools/game-result.js");
const { oreTable } = require("../../../../tools/items-table.js");

module.exports = {
    async execute(interaction, client) {
        try {
            const userID = interaction.user.id;
            const buttonContent = interaction.customId.split("_");
            const hasPickaxe = buttonContent[1] === "true";
            const ore = getRandomItem(oreTable, hasPickaxe, buttonContent[2] === "path");

            await sendResult(ore, "pikpik", interaction, userID, hasPickaxe);
        } catch (error) {
            await sendError(interaction, client, error);
        }
    }
};