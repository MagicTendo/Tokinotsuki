const { SlashCommandBuilder, ChannelType, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, PermissionsBitField, MessageFlags } = require("discord.js");
const { sendError } = require("../../../tools/error-catcher.js");

module.exports = {
    category: "Utilitaire",
    data: new SlashCommandBuilder()
        .setName("ticket")
        .setDescription("Permet de créer simplement un système de tickets !")
        .setIntegrationTypes([0])
        .setContexts([0])
        .addSubcommand(subcommand => subcommand
            .setName("setup")
            .setDescription("Pour mettre en place un système de ticket sur le serveur !")
            .addChannelOption(option => option
                .setName("channel")
                .setDescription("Le salon où il y aura le message du ticket.")
                .addChannelTypes(ChannelType.GuildText)
                .setRequired(true))
            .addChannelOption(option => option
                .setName("category")
                .setDescription("La catégorie où seront créé les tickets.")
                .addChannelTypes(ChannelType.GuildCategory)
                .setRequired(true))
            .addRoleOption(option => option
                .setName("role")
                .setDescription("Le rôle qui pourra voir le salon.")
                .setRequired(false))
            .addStringOption(option => option
                .setName("title")
                .setDescription("Le titre du message.")
                .setMaxLength(256)
                .setRequired(false))
            .addStringOption(option => option
                .setName("description")
                .setDescription("La description du message.")
                .setMaxLength(4_096)
                .setRequired(false))
            .addAttachmentOption(option => option
                .setName("thumbnail")
                .setDescription("La miniature en haut à droite.")
                .setRequired(false))
            .addAttachmentOption(option => option
                .setName("image")
                .setDescription("L'image en grand en bas.")
                .setRequired(false))
            .addStringOption(option => option
                .setName("button-label")
                .setDescription("Ce qu'il y aura d'écrit sur le bouton.")
                .setMaxLength(100)
                .setRequired(false)))

        .addSubcommand(subcommand => subcommand
            .setName("status")
            .setDescription("Pour activer ou désactiver temporairement le système.")
            .addStringOption(option => option
                .setName("action")
                .setDescription("Choisis l'action à faire.")
                .addChoices(
                    { name: "✅ Activer", value: "activate" },
                    { name: "❌ Désactiver", value: "desactivate" })
                .setRequired(true))
            .addChannelOption(option => option
                .setName("channel")
                .setDescription("Le salon avec le message.")
                .addChannelTypes(ChannelType.GuildText)
                .setRequired(true))
            .addStringOption(option => option
                .setName("message-id")
                .setDescription("L'identifiant du message. Active le mode développeur sur ton compte pour le copier !")
                .setMaxLength(20)
                .setRequired(true))),
    async execute(interaction, client) {
        try {
            if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageGuild))
                return await interaction.reply({ content: "❌ Tu n'as pas la permisssion de gérer le serveur !", flags: [MessageFlags.Ephemeral] });

            const ticketChannel = interaction.options.getChannel("channel");

            switch (interaction.options.getSubcommand()) {
                case "setup":
                    const ticketCategoryID = interaction.options.getChannel("category").id;
                    const ticketRole = interaction.options.getRole("role").id ?? 0;
                    const ticketTitle = interaction.options.getString("title") ?? "Tickets !";
                    const ticketDescription = interaction.options.getString("description") ?? "Clique sur le bouton ci-dessous pour créer un ticket !";
                    const ticketThumbnail = interaction.options.getAttachment("thumbnail")?.url;
                    const ticketImage = interaction.options.getAttachment("image")?.url;
                    const ticketButtonLabel = interaction.options.getString("button-label") ?? "Créer un ticket";

                    const ticketButton = new ActionRowBuilder().addComponents(
                        new ButtonBuilder()
                            .setEmoji({ name: "🎫" })
                            .setLabel(ticketButtonLabel)
                            .setStyle(ButtonStyle.Secondary)
                            .setCustomId(`ticket_1_${ticketCategoryID}_${ticketRole}_0`));

                    const ticketEmbed = new EmbedBuilder()
                        .setColor([255, 85, 0])
                        .setTitle(ticketTitle)
                        .setDescription(ticketDescription)
                        .setThumbnail(ticketThumbnail)
                        .setImage(ticketImage)
                        .setTimestamp()
                        .setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL({ extension: "png", size: 64 }) });

                    await ticketChannel.send({ embeds: [ticketEmbed], components: [ticketButton] });
                    await interaction.reply({ content: `✅ Le système a bien été mis en place dans <#${ticketChannel.id}> !`, flags: [MessageFlags.Ephemeral] });
                    break;

                case "status":
                    const ticketOption = interaction.options.getString("action");
                    const ticketOptionValue = ticketOption === "desactivate";
                    const ticketMessageID = interaction.options.getString("message-id");

                    const ticketMessage = await client.guilds.cache.get(interaction.guild.id).channels.cache.get(ticketChannel.id).messages.fetch(ticketMessageID).catch(() => undefined);

                    if (ticketMessage === undefined)
                        return await interaction.reply({ content: "❌ Impossible de trouver le message !", flags: [MessageFlags.Ephemeral] });
                    if (ticketMessage.author.id !== client.user.id)
                        return await interaction.reply({ content: "❌ Ce message ne m'appartient pas !", flags: [MessageFlags.Ephemeral] });
                    if (!ticketMessage.components[0].components[0].data.custom_id.startsWith("ticket"))
                        return await interaction.reply({ content: "❌ Ce message n'est pas en rapport avec le système de tickets !", flags: [MessageFlags.Ephemeral] });

                    const newTicketEmbed = new EmbedBuilder(ticketMessage.embeds[0].data);
                    const newTicketButton = new ActionRowBuilder().addComponents(new ButtonBuilder(ticketMessage.components[0].components[0].data).setDisabled(ticketOptionValue));

                    await ticketMessage.edit({ embeds: [newTicketEmbed], components: [newTicketButton] });
                    await interaction.reply({ content: `✅ Le changement a bien été effectué à https://discord.com/channels/${interaction.guild.id}/${ticketChannel.id}/${ticketMessageID} !`, flags: [MessageFlags.Ephemeral] });
                    break;
            }
        } catch (error) {
            await sendError(interaction, client, error);
        }
    }
};