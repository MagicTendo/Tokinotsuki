const { SlashCommandBuilder, PermissionsBitField, MessageFlags } = require("discord.js");
const { getValue, updateValue, deleteValue } = require("../../../tools/database.js");
const { sendError } = require("../../../tools/error-catcher.js");

module.exports = {
    category: "Utilitaire",
    data: new SlashCommandBuilder()
        .setName("counting-channel")
        .setDescription("Tout ce qui concerne la mise en place du jeu du comptage.")
        .setIntegrationTypes([0])
        .setContexts([0])
        .addSubcommand(subcommand => subcommand
            .setName("apply")
            .setDescription("Permet de mettre en place un jeu du comptage dans un salon !")
            .addChannelOption(option => option
                .setName("channel")
                .setDescription("Le salon où le jeu se déroulera.")
                .setRequired(true)))

        .addSubcommand(subcommand => subcommand
            .setName("remove")
            .setDescription("Enlève le jeu du comptage.")),
    async execute(interaction, client) {
        try {
            if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageGuild))
                return await interaction.reply({ content: "❌ Tu n'as pas la permisssion de gérer le serveur !", flags: [MessageFlags.Ephemeral] });

            const guildID = interaction.guild.id;

            switch (interaction.options.getSubcommand()) {
                case "apply":
                    const countingChannel = interaction.options.getChannel("channel");

                    if (countingChannel.id === await getValue(guildID, "guilds", "counting"))
                        return await interaction.reply({ content: "❌ Le jeu du comptage était déjà mis en place dans ce salon !", flags: [MessageFlags.Ephemeral] });

                    await updateValue(guildID, "guilds", "counting", countingChannel.id, false);

                    await interaction.reply({ content: `✅ Le jeu du comptage a bien été mis en place dans <#${countingChannel.id}> !` });
                    break;

                case "remove":
                    await deleteValue(guildID, "guilds", "counting");

                    await interaction.reply({ content: `✅ Le jeu du comptage a bien été enlevé !` });
                    break;
            }
        } catch (error) {
            await sendError(interaction, client, error);
        }
    }
};