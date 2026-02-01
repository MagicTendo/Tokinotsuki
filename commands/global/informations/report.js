const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, MessageFlags } = require("discord.js");
const { hasValue } = require("../../../tools/database.js");
const { sendError } = require("../../../tools/error-catcher.js");

module.exports = {
    category: "Informations",
    data: new SlashCommandBuilder()
        .setName("report")
        .setDescription("Pour faire des remarques et des suggestions à mon développeur !")
        .setIntegrationTypes([0, 1])
        .setContexts([0, 1, 2])
        .addStringOption(option => option
            .setName("type")
            .setDescription("Choisis le type de rapport à faire.")
            .addChoices(
                { name: "🐛 Bug", value: "bug" },
                { name: "💡 Suggestion", value: "suggestion" },
                { name: "📄 Erreur d'écriture (orthographe, grammaire, etc.)", value: "spelling" },
                { name: "📂 Demande (suppression de données, changement de compte, etc.)", value: "report" })
            .setRequired(true))
        .addStringOption(option => option
            .setName("content")
            .setDescription("Le contenu du rapport.")
            .setRequired(true))
        .addStringOption(option => option
            .setName("command")
            .setDescription("La commande qui est en lien avec ton rapport.")
            .setMaxLength(30)
            .setRequired(false))
        .addAttachmentOption(option => option
            .setName("image")
            .setDescription("Tu peux mettre une image pour illustrer ton propos.")
            .setRequired(false)),
    async execute(interaction, client) {
        try {
            const userID = interaction.user.id;;

            if (await hasValue(userID, "users", "blacklist"))
                return await interaction.reply({ content: "❌ Tu ne peux plus utiliser cette commande car tu as été mis en blacklist. Tu peux rejoindre mon serveur support avec la commande `/support` si tu penses que c'est une erreur.", flags: MessageFlags.Ephemeral });

            const reportType = interaction.options.getString("type");
            const reportTypeName = reportType === "bug" ? "Bug" : reportType === "suggestion" ? "Suggestion" : reportType === "spelling" ? "Écriture" : "Demande";
            const reportColor = reportType === "bug" ? [255, 0, 0] : reportType === "suggestion" ? [255, 238, 0] : reportType === "spelling" ? [0, 195, 255] : [255, 34, 147];
            const reportContent = interaction.options.getString("content");
            const reportCommand = interaction.options.getString("command") ?? "Non spécifiée";
            const reportImage = interaction.options.getAttachment("image")?.url;

            const reportButtons = new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                    .setEmoji({ name: "✅" })
                    .setLabel("Valider")
                    .setStyle(ButtonStyle.Success)
                    .setCustomId(`report_done_${userID}_${reportType}_610493430325313549`),
                new ButtonBuilder()
                    .setEmoji({ name: "✖️" })
                    .setLabel("Refuser")
                    .setStyle(ButtonStyle.Danger)
                    .setCustomId(`report_deny_610493430325313549`),
                new ButtonBuilder()
                    .setEmoji({ name: "📨" })
                    .setLabel("Envoyer un message")
                    .setStyle(ButtonStyle.Primary)
                    .setCustomId(`report_send-message_${userID}_610493430325313549`),
                new ButtonBuilder()
                    .setEmoji({ name: "⚠️" })
                    .setLabel("Blacklist")
                    .setStyle(ButtonStyle.Secondary)
                    .setCustomId(`report_blacklist_${userID}_610493430325313549`));

            const reportEmbed = new EmbedBuilder()
                .setColor(reportColor)
                .setAuthor({ name: `${interaction.user.globalName} (${userID})`, iconURL: interaction.user.displayAvatarURL({ extension: "png", size: 64, dynamic: true }) })
                .setTitle(`${reportTypeName} - \`${reportCommand}\``)
                .setDescription(reportContent)
                .setTimestamp()
                .setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL({ extension: "png", size: 64, dynamic: true }) });

            if (reportImage)
                reportEmbed.setImage(reportImage);

            const channel = client.channels.cache.get(process.env.REPORT_CHANNEL_ID);

            await channel.send({ embeds: [reportEmbed], components: [reportButtons] });
            await channel.send({ content: "<@610493430325313549>" }).then(message => message.delete());

            await interaction.reply({ content: "✅ Ton rapport a bien été envoyé à mon créateur !", flags: MessageFlags.Ephemeral });
        } catch (error) {
            await sendError(interaction, client, error);
        }
    }
};