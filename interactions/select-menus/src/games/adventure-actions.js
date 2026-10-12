const { EmbedBuilder, ActionRowBuilder, MessageFlags } = require("discord.js");
const { hasValue, updateValue } = require("../../../../tools/database.js");
const { sendError } = require("../../../../tools/error-catcher.js");
const { adventureFlags } = require("../../../../tools/flags.js");
const { capitalise } = require("../../../../tools/modules.js");

module.exports = {
    async execute(interaction, client) {
        try {
            const userID = interaction.user.id;

            if (await hasValue(userID, "users", "adventure-status"))
                return await interaction.reply({ content: "🧭 Il y a déjà une expédition en cours !", flags: [MessageFlags.Ephemeral] })

            const selectedRegionInformation = interaction.values[0].split("_");
            const adventureButtons = new ActionRowBuilder().addComponents(interaction.message.components[0].components).components;
            const items = ["food-provision", "water-provision", "care-kit", "sleep-kit"];
            const minimumRessources = [2, 3, 1, 1];
            const regionToFlag = {
                "yukami": adventureFlags.yukamiSuccess,
                "yokanatcci": adventureFlags.yokanatcciSuccess,
                "tenerina": adventureFlags.tenerinaSuccess,
                "reinaisu": adventureFlags.reinaisuSuccess,
                "iyiya": adventureFlags.iyiyaSuccess,
                "arukota": adventureFlags.arukotaSuccess,
            };

            let isExpeditionSuccess = regionToFlag[selectedRegionInformation[0]];

            for (let i = 0; i < items.length; i++) {
                const amount = adventureButtons[i].data.custom_id.split("_")[3];
                const requirement = Math.floor(Math.random() * selectedRegionInformation[1]) + 1;

                if (amount < minimumRessources[i] * requirement)
                    isExpeditionSuccess = adventureFlags.failed;

                await updateValue(userID, "users", items[i], -amount);
            }

            await updateValue(userID, "users", "adventure-status", isExpeditionSuccess, false);
            await updateValue(userID, "users", "adventure-time", Date.now(), false);
            await updateValue(userID, "users", "adventure-duration", Number(selectedRegionInformation[2]), false);

            const adventureStartEmbed = new EmbedBuilder()
                .setColor([255, 85, 0])
                .setTitle("L'expédition est lancée !")
                .setDescription(`Miyunira est partie en direction de la région de \`${capitalise(selectedRegionInformation[0])}\` !`)
                .setTimestamp()
                .setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL({ extension: "png", size: 64 }) });

            await interaction.update({ embeds: [adventureStartEmbed], components: [] });
        } catch (error) {
            await sendError(interaction, client, error);
        }
    }
};