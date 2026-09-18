const { MessageFlags } = require("discord.js");
const { tryAddingUserToDatabase, updateValue } = require("../tools/database.js");
const { sendError } = require("../tools/error-catcher.js");
const { buttonList } = require("../interactions/buttons/index.js");
const { selectMenuList } = require("../interactions/select-menus/index.js");
const { modalList } = require("../interactions/modal/index.js");

module.exports = {
    name: "interactionCreate",
    async execute(interaction, client) {
        try {
            const userID = interaction.user.id;

            await tryAddingUserToDatabase(interaction, client, userID, "users");

            if (interaction.isChatInputCommand() || interaction.isContextMenuCommand()) {
                const command = client.commands.get(interaction.commandName);

                if (!command) return;

                await updateValue("toki", "toki", "usages", 1);

                await command.execute(interaction, client);
            } else if (interaction.isAutocomplete()) {
                const command = interaction.client.commands.get(interaction.commandName);

                await command.autocomplete(interaction);
            } else if (interaction.isButton()) {
                const buttonContent = interaction.customId;
                const buttonID = buttonContent.split("_")[0] ?? buttonContent;
                const buttonOwner = buttonContent.split("_").slice(-1)[0] ?? null;

                if (buttonList[buttonID]) {
                    if (buttonOwner === userID || buttonOwner === "0" || buttonOwner === null) {
                        await buttonList[buttonID].execute(interaction, client);
                    } else {
                        await interaction.reply({ content: "❌ Ce n'est pas pour toi !", flags: [MessageFlags.Ephemeral] });
                    }
                } else {
                    await interaction.reply({ content: "❌ Interaction introuvable ou trop ancienne !", flags: [MessageFlags.Ephemeral] });
                }
            } else if (interaction.isStringSelectMenu()) {
                const selectMenuContent = interaction.customId;
                const selectMenuID = selectMenuContent.split("_")[0] ?? selectMenuContent;
                const selectMenuOwner = selectMenuContent.split("_").slice(-1)[0] ?? null;

                if (selectMenuList[selectMenuID]) {
                    if (selectMenuOwner === userID || selectMenuOwner === "0" || selectMenuOwner === null) {
                        await selectMenuList[selectMenuID].execute(interaction, client);
                    } else {
                        await interaction.reply({ content: "❌ Ce n'est pas pour toi !", flags: [MessageFlags.Ephemeral] });
                    }
                } else {
                    await interaction.reply({ content: "❌ Interaction introuvable ou trop ancienne !", flags: [MessageFlags.Ephemeral] });
                }
            } else if (interaction.isModalSubmit()) {
                const modalContent = interaction.customId;
                const modalID = modalContent.split("_")[0] ?? modalContent;

                await modalList[modalID].execute(interaction, client);
            }
        } catch (error) {
            await sendError(interaction, client, error);
        }
    }
};