const { sendError } = require("../../../../tools/error-catcher.js");

module.exports = {
    async execute(interaction, client) {
        try {
            const buttonContent = interaction.customId.split("_");

            switch (buttonContent[1]) {
                case "accept":
                    const channelClear = interaction.channel;
                    const channelPosition = channelClear.position;
                    const channelName = channelClear.name;
                    const channelTopic = channelClear.topic;

                    const newChannel = await channelClear.clone();

                    newChannel.setPosition(channelPosition);
                    newChannel.setName(channelName);
                    newChannel.setTopic(channelTopic);

                    client.channels.cache.get(channelClear.id).delete();
                    break;

                case "deny":
                    interaction.update({ content: "Action annulée !", embeds: [], components: [] });
                    break;
            }
        } catch (error) {
            await sendError(interaction, client, error);
        }
    }
};