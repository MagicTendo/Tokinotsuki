const { ContextMenuCommandBuilder, ApplicationCommandType } = require("discord.js");
const { sendError } = require("../../../tools/error-catcher.js");

module.exports = {
    data: new ContextMenuCommandBuilder()
        .setName("Love")
        .setType(ApplicationCommandType.User)
        .setIntegrationTypes([0]),
    async execute(interaction, client) {
        try {
            const command = client.commands.get("love");

            await command.execute(interaction, client);
        } catch (error) {
            await sendError(interaction, client, error);
        }
    }
};