const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ChannelType, OverwriteType, PermissionsBitField, MessageFlags } = require("discord.js");
const { sendError } = require("../../../../tools/error-catcher.js");

module.exports = {
    async execute(interaction, client) {
        try {
            if (!interaction.guild.members.me.permissions.has(PermissionsBitField.Flags.ManageChannels))
                return await interaction.reply({ content: "❌ Je n'ai pas la permission de gérer les salons !", flags: MessageFlags.Ephemeral });

            const buttonContent = interaction.customId.split("_");
            const ticketNumber = buttonContent[1];
            const ticketCategory = buttonContent[2];
            const ticketRole = buttonContent[3];
            const channelPermissions = [{
                id: interaction.guild.id,
                type: OverwriteType.Role,
                deny: [PermissionsBitField.Flags.ViewChannel]
            },
            {
                id: interaction.user.id,
                type: OverwriteType.Member,
                allow: [PermissionsBitField.Flags.ViewChannel]
            }];

            if (ticketRole !== 0)
                channelPermissions.push({
                    id: ticketRole,
                    type: OverwriteType.Role,
                    allow: [PermissionsBitField.Flags.ViewChannel]
                });

            const ticketEmbed = new EmbedBuilder(interaction.message.embeds[0].data);
            const ticketButton = new ActionRowBuilder().addComponents(
                new ButtonBuilder(interaction.message.components[0].components[0].data)
                    .setCustomId(`ticket_${Number(ticketNumber) + 1}_${ticketCategory}_${ticketRole}_0`));

            const ticketChannel = await interaction.guild.channels.create({
                name: `ticket-${ticketNumber}`,
                type: ChannelType.GuildText,
                parent: ticketCategory,
                permissionOverwrites: channelPermissions
            });

            await interaction.update({ embeds: [ticketEmbed], components: [ticketButton] });
            await interaction.followUp({ content: `✅ Ticket créé à <#${ticketChannel.id}> !`, flags: MessageFlags.Ephemeral });
        } catch (error) {
            await sendError(interaction, client, error);
        }
    }
};