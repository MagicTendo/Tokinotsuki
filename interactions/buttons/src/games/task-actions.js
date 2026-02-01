const { getValue, updateValue } = require("../../../../tools/database.js");
const { sendError } = require("../../../../tools/error-catcher.js");
const { completeQuest, getCurrencySymbol, simplify } = require("../../../../tools/modules.js");

module.exports = {
    async execute(interaction, client) {
        try {
            const userID = interaction.user.id;
            const buttonContent = interaction.customId.split("_");
            const taskNumber = buttonContent[1];
            const taskTotal = buttonContent[2];
            const currentTask = await getValue(userID, "users", "task");

            if (taskNumber != currentTask)
                return await interaction.deferUpdate() & await interaction.deleteReply();

            const taskPrizes = [500, 1_000, 5_000, 10_000, 15_000, 25_000, 50_000, 75_000, 100_000];
            const taskPrize = taskPrizes[taskNumber];
            let taskComment = "Tu peux passer à la tâche suivante !";

            await updateValue(userID, "users", "task", 1);
            await updateValue(userID, "users", "toki-coin", taskPrize);

            if (Number(taskNumber) + 1 >= taskTotal) {
                await completeQuest(userID, "task");

                taskComment = "Tu as terminé toutes les tâches, tu peux valider la quête `Task Expert` !";
            }

            await interaction.update({ content: `Tu as gagné ${await simplify(userID, taskPrize)} ${getCurrencySymbol("toki-coin")} ! ${taskComment}`, embeds: [], components: [] });
        } catch (error) {
            await sendError(interaction, client, error);
        }
    }
};