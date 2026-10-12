const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ModalBuilder, TextInputBuilder, TextInputStyle } = require("discord.js");
const { updateValue, deleteValue } = require("../../../../tools/database.js");
const { sendError } = require("../../../../tools/error-catcher.js");

module.exports = {
    async execute(interaction, client) {
        try {
            const buttonContent = interaction.customId.split("_");
            const userID = buttonContent[2];
            const reportDescription = interaction.message.embeds[0].description;
            const reportShortDescription = reportDescription.length > 25 ? `${reportDescription.slice(0, 25)}...` : reportDescription;

            switch (buttonContent[1]) {
                case "blacklist":
                    const userBlacklistID = buttonContent[2];

                    await updateValue(userBlacklistID, "users", "blacklist", 1, false);

                    const unblacklistButton = new ActionRowBuilder().addComponents(
                        new ButtonBuilder()
                            .setEmoji({ name: "⭐" })
                            .setLabel("Unblacklist")
                            .setStyle(ButtonStyle.Secondary)
                            .setCustomId(`report_unblacklist_${userBlacklistID}_610493430325313549`));

                    const reportBlacklistEmbed = new EmbedBuilder()
                        .setColor([0, 0, 0])
                        .setDescription(`### L'utilisateur ${client.users.cache.get(userBlacklistID).globalName} (${userBlacklistID}) a été mis dans la blacklist !\n>>> ${reportDescription.split(">>> ")[1] ?? reportDescription}`);

                    await interaction.update({ embeds: [reportBlacklistEmbed], components: [unblacklistButton] });

                    await client.users.cache.get(userBlacklistID).send({ content: "Salut ! Tu as été mis en blacklist et tu ne peux plus envoyer de rapport suite à un comportement potentiellement incorrecte..." });
                    break;

                case "deny":
                    const reportLastButtons = new ActionRowBuilder().addComponents(
                        new ButtonBuilder()
                            .setEmoji({ name: "✔️" })
                            .setLabel("Terminer")
                            .setStyle(ButtonStyle.Danger)
                            .setCustomId(`report_finish-deny_${userID}_610493430325313549`),
                        new ButtonBuilder()
                            .setEmoji({ name: "📨" })
                            .setLabel("Envoyer un message")
                            .setStyle(ButtonStyle.Primary)
                            .setCustomId(`report_send-message_${userID}_deny_610493430325313549`));

                    const reportDenyEmbed = new EmbedBuilder(interaction.message.embeds[0].data)
                        .setColor([112, 7, 7])
                        .setDescription(`### Le rapport suivant a été refusé !\n>>> ${reportDescription}`);

                    await interaction.update({ embeds: [reportDenyEmbed], components: [reportLastButtons] });
                    break;

                case "done":
                    const reportType = buttonContent[3];

                    const reportDoneEmbed = new EmbedBuilder(interaction.message.embeds[0].data)
                        .setColor([19, 189, 15])
                        .setDescription(`### Le rapport suivant a été fait !\n>>> ${reportDescription}`);

                    await interaction.update({ embeds: [reportDoneEmbed], components: [] });

                    if (reportType === "report")
                        await client.users.cache.get(userID).send({ content: `Salut ! Ta demande (\`${reportShortDescription}\`) a bien été effectuée !` });
                    else
                        await client.users.cache.get(userID).send({ content: `Salut ! Ton rapport (\`${reportShortDescription}\`) a bien été effectué, et sera implémenté ou corrigé dans la nouvelle version !` });
                    break;

                case "finish-deny":
                    const reportFinishEmbed = new EmbedBuilder(interaction.message.embeds[0].data);

                    await interaction.update({ embeds: [reportFinishEmbed], components: [] });
                    await client.users.cache.get(userID).send({ content: `Salut ! Ton rapport (\`${reportShortDescription}\`) a bien été effectué, et sera implémenté ou corrigé dans la nouvelle version !` });
                    break;

                case "send-message":
                    const modalReportDescription = interaction.message.embeds[0].description?.split(">>> ")[1] ?? interaction.message.embeds[0].description;
                    const modalReportShortDescription = modalReportDescription.length > 50 ? `${modalReportDescription.slice(0, 50)}...` : modalReportDescription;
                    const isDeny = buttonContent[3] === "deny" ? 1 : 0;

                    const reportDenyModal = new ModalBuilder()
                        .setTitle("Raison")
                        .setCustomId(`report-message_${isDeny}_${modalReportShortDescription}_${userID}`);

                    const reportDenyAmountInput = new TextInputBuilder()
                        .setLabel("Pour quelle raison ?")
                        .setStyle(TextInputStyle.Paragraph)
                        .setCustomId("reason");

                    const reportDenyModalActionRow = new ActionRowBuilder().addComponents(reportDenyAmountInput);

                    reportDenyModal.addComponents(reportDenyModalActionRow);

                    await interaction.showModal(reportDenyModal);
                    break;

                case "unblacklist":
                    const userUnblacklistID = buttonContent[2];

                    await deleteValue(userUnblacklistID, "users", "blacklist");

                    const blacklistButton = new ActionRowBuilder().addComponents(
                        new ButtonBuilder()
                            .setEmoji({ name: "⚠️" })
                            .setLabel("Blacklist")
                            .setStyle(ButtonStyle.Secondary)
                            .setCustomId(`report_blacklist_${userUnblacklistID}_610493430325313549`));

                    const reportUnblacklistEmbed = new EmbedBuilder()
                        .setDescription(`### L'utilisateur ${client.users.cache.get(userUnblacklistID).globalName} (${userUnblacklistID}) n'est plus dans la blacklist !\n>>> ${reportDescription.split(">>> ")[1] ?? reportDescription}`);

                    await interaction.update({ embeds: [reportUnblacklistEmbed], components: [blacklistButton] });

                    await client.users.cache.get(userUnblacklistID).send({ content: "Salut ! Tu as été enlevé de la blacklist, tu as été sois pardonné, sois c'était juste une erreur !" });
                    break;
            }
        } catch (error) {
            await sendError(interaction, client, error);
        }
    }
};