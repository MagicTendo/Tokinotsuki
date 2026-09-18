const { EmbedBuilder, ActionRowBuilder, MessageFlags } = require("discord.js");
const { hasValue, updateValue } = require("../../../../tools/database.js");
const { sendError } = require("../../../../tools/error-catcher.js");
const { adventureFlags } = require("../../../../tools/flags.js");
const { capitalize } = require("../../../../tools/modules.js");

module.exports = {
    async execute(interaction, client) {
        try {
            const userID = interaction.user.id;

            if (await hasValue(userID, "users", "adventure-status"))
                return await interaction.reply({ content: "🧭 Il y a déjà une expédition en cours !", flags: [MessageFlags.Ephemeral] })

            const selectedRegionInformations = interaction.values[0].split("_");
            const adventureButtons = new ActionRowBuilder().addComponents(interaction.message.components[0].components).components;
            const items = ["food-provision", "water-provision", "care-kit", "sleep-kit"];
            const minimumRessources = [2, 3, 1, 1];
            const regionToFlag = {
                "yukidami": adventureFlags.yukidamiSuccess,
                "yogandaichi": adventureFlags.yogandaichiSuccess,
                "tennenrin": adventureFlags.tennenrinSuccess,
                "reidaihosun": adventureFlags.reidaihosunSuccess,
                "iryujon": adventureFlags.iryujonSuccess,
                "arkotalan": adventureFlags.arkotalanSuccess,
            };

            let isExpeditionSuccess = regionToFlag[selectedRegionInformations[0]];

            for (let i = 0; i < items.length; i++) {
                const amount = adventureButtons[i].data.custom_id.split("_")[3];
                const requirement = Math.floor(Math.random() * selectedRegionInformations[1]) + 1;

                if (amount < minimumRessources[i] * requirement)
                    isExpeditionSuccess = adventureFlags.failed;

                await updateValue(userID, "users", items[i], -amount);
            }

            await updateValue(userID, "users", "adventure-status", isExpeditionSuccess, false);
            await updateValue(userID, "users", "adventure-time", Date.now(), false);
            await updateValue(userID, "users", "adventure-duration", Number(selectedRegionInformations[2]), false);

            const adventureStartEmbed = new EmbedBuilder()
                .setColor([255, 85, 0])
                .setTitle("L'expédition est lancée !")
                .setDescription(`Miyunira est partie en direction de la région de \`${capitalize(selectedRegionInformations[0])}\` !`)
                .setTimestamp()
                .setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL({ extension: "png", size: 64 }) });

            await interaction.update({ embeds: [adventureStartEmbed], components: [] });
        } catch (error) {
            await sendError(interaction, client, error);
        }
    }
};