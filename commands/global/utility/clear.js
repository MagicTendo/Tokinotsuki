const { SlashCommandBuilder, PermissionsBitField, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, MessageFlags } = require("discord.js");
const { sendError } = require("../../../tools/error-catcher.js");

module.exports = {
    category: "Utilitaire",
    data: new SlashCommandBuilder()
        .setName("clear")
        .setDescription("Pour faire du ménage dans les messages.")
        .setDefaultMemberPermissions(PermissionsBitField.Flags.ManageMessages)
        .setIntegrationTypes([0])
        .setContexts([0])
        .addSubcommand(subcommand => subcommand
            .setName("classic")
            .setDescription("Efface un certains nombre (entre 1 et 100) de messages.")
            .addIntegerOption(option => option
                .setName("amount")
                .setDescription("Le nombre de messages à supprimer.")
                .setMinValue(1)
                .setMaxValue(100)
                .setRequired(true)))

        .addSubcommand(subcommand => subcommand
            .setName("channel")
            .setDescription("Supprime et recrée à l'identique un salon pour le nettoyer."))

        .addSubcommand(subcommand => subcommand
            .setName("user")
            .setDescription("Efface un certain nombre (entre 1 et 100) de messages d'un utilisateur spécifique.")
            .addIntegerOption(option => option
                .setName("amount")
                .setDescription("Le nombre de messages à supprimer.")
                .setMinValue(1)
                .setMaxValue(100)
                .setRequired(true))
            .addUserOption(option => option
                .setName("user")
                .setDescription("L'utilisateur cible.")
                .setRequired(true))),
    async execute(interaction, client) {
        try {
            if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageMessages))
                return await interaction.reply({ content: "❌ Tu n'as pas la permisssion de gérer les messages !", flags: MessageFlags.Ephemeral });
            if (!interaction.guild.members.me.permissions.has(PermissionsBitField.Flags.ManageMessages))
                return await interaction.reply({ content: "❌ Je n'ai pas la permission de gérer les messages !", flags: MessageFlags.Ephemeral });

            const amount = interaction.options.getInteger("amount");

            switch (interaction.options.getSubcommand()) {
                case "classic":
                    let finalAmount;

                    await interaction.channel.bulkDelete(amount, true).then(deleted => {
                        finalAmount = deleted.size;
                    });

                    await interaction.reply({ content: `🗑️ ${finalAmount} message(s) ont bien été supprimé(s) !`, flags: MessageFlags.Ephemeral });
                    break;

                case "channel":
                    if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator))
                        return await interaction.reply({ content: "❌ Tu n'as pas la permisssion administrateur !", flags: MessageFlags.Ephemeral });
                    if (!interaction.guild.members.me.permissions.has(PermissionsBitField.Flags.ManageChannels))
                        return await interaction.reply({ content: "❌ Je n'ai pas la permission de gérer les salons !", flags: MessageFlags.Ephemeral });

                    const channelClearButtons = new ActionRowBuilder().addComponents(
                        new ButtonBuilder()
                            .setEmoji({ name: "✅" })
                            .setLabel("Oui")
                            .setStyle(ButtonStyle.Success)
                            .setCustomId(`clear-channel_accept_${interaction.user.id}`),
                        new ButtonBuilder()
                            .setEmoji({ name: "❌" })
                            .setLabel("Non")
                            .setStyle(ButtonStyle.Danger)
                            .setCustomId(`clear-channel_deny_${interaction.user.id}`));

                    const clearEmbed = new EmbedBuilder()
                        .setColor([255, 85, 0])
                        .setTitle("Vérification")
                        .setDescription("Es-tu sûr de supprimer tout le contenue de ce salon ?")
                        .setTimestamp()
                        .setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL({ extension: "png", size: 64, dynamic: true }) });

                    await interaction.reply({ embeds: [clearEmbed], components: [channelClearButtons], flags: MessageFlags.Ephemeral })
                    break;

                case "user":
                    const user = interaction.options.getUser("user");
                    let finalUserAmount = 0;

                    await interaction.channel.messages.fetch({
                        limit: 100
                    }).then(async (messages) => {
                        for (let i = 0; i < Array.from(messages).length; i++) {
                            if (finalUserAmount >= amount) break;

                            if (Array.from(messages)[i][1].author.id === user.id) {
                                client.channels.fetch(interaction.channel.id).then(channel => {
                                    channel.messages.delete(Array.from(messages)[i][0]);
                                });

                                finalUserAmount += 1;
                            }
                        }
                    });

                    await interaction.reply({ content: `🗑️ ${finalUserAmount} messages de <@${user.id}> ont bien été supprimés !`, flags: MessageFlags.Ephemeral });
                    break;
            }
        } catch (error) {
            await sendError(interaction, client, error);
        }
    }
};