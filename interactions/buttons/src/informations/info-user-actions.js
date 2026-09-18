const { sendError } = require("../../../../tools/error-catcher.js");

module.exports = {
    async execute(interaction, client) {
        try {
            const command = client.commands.get(interaction.customId.split("_")[1]);

            await command.execute(interaction, client);
        } catch (error) {
            await sendError(interaction, client, error);
        }
    }
};