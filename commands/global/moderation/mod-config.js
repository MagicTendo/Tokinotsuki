const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField, MessageFlags } = require("discord.js");
const { hasValue, updateValue, deleteValue } = require("../../../tools/database.js");
const { sendError } = require("../../../tools/error-catcher.js");

module.exports = {
    category: "Modération",
    data: new SlashCommandBuilder()
        .setName("mod-config")
        .setDescription("Pour configurer des fonctionalités supplémentaires sur le serveur !")
        .setDefaultMemberPermissions(PermissionsBitField.Flags.ManageGuild)
        .setIntegrationTypes([0])
        .setContexts([0])
        .addSubcommand(subcommand => subcommand
            .setName("anti-bot")
            .setDescription("Empêche n'importe qui d'ajouter un bot au serveur. Pratique pour éviter les raids.")
            .addStringOption(option => option
                .setName("action")
                .setDescription("Choisis l'action à faire.")
                .addChoices(
                    { name: "✅ Activer", value: "activate" },
                    { name: "❌ Désactiver", value: "desactivate" })
                .setRequired(true)))

        .addSubcommand(subcommand => subcommand
            .setName("anti-link")
            .setDescription("Supprime tous les messages contenant un lien.")
            .addStringOption(option => option
                .setName("action")
                .setDescription("Choisis l'action à faire.")
                .addChoices(
                    { name: "✅ Activer", value: "activate" },
                    { name: "❌ Désactiver", value: "desactivate" })
                .setRequired(true))
            .addRoleOption(option => option
                .setName("role-exception")
                .setDescription("Ce rôle pourra envoyer des liens.")
                .setRequired(false)))

        .addSubcommand(subcommand => subcommand
            .setName("anti-raid")
            .setDescription("Empêche n'importe qui de rejoindre le serveur en les prévenant.")
            .addStringOption(option => option
                .setName("action")
                .setDescription("Choisis l'action à faire.")
                .addChoices(
                    { name: "✅ Activer", value: "activate" },
                    { name: "❌ Désactiver", value: "desactivate" })
                .setRequired(true)))

        .addSubcommand(subcommand => subcommand
            .setName("anti-say")
            .setDescription("Permet d'activer ou non les commandes /say classic, /say embed et /useless no-you.")
            .addStringOption(option => option
                .setName("action")
                .setDescription("Choisis l'action à faire.")
                .addChoices(
                    { name: "✅ Activer", value: "activate" },
                    { name: "❌ Désactiver", value: "desactivate" })
                .setRequired(true))
            .addRoleOption(option => option
                .setName("role-exception")
                .setDescription("Ce rôle pourra utiliser la commande /say.")
                .setRequired(false)))

        .addSubcommand(subcommand => subcommand
            .setName("anti-scam")
            .setDescription("Permet de supprimer les potentiels messages d'arnaque. Attention, il peut y avoir des faux-positifs.")
            .addStringOption(option => option
                .setName("action")
                .setDescription("Choisis l'action à faire.")
                .addChoices(
                    { name: "✅ Activer", value: "activate" },
                    { name: "❌ Désactiver", value: "desactivate" })
                .setRequired(true))
            .addRoleOption(option => option
                .setName("role-exception")
                .setDescription("Ce rôle sera immuniser contre cela.")
                .setRequired(false)))

        .addSubcommand(subcommand => subcommand
            .setName("recap")
            .setDescription("Indique l'état de ma configuraion sur ce serveur.")),
    async execute(interaction, client) {
        try {
            const settingType = interaction.options.getSubcommand();

            if (settingType !== "recap" && interaction.user.id !== interaction.guild.ownerId)
                return await interaction.reply({ content: "❌ Tu n'es pas le propriétaire du serveur !", flags: MessageFlags.Ephemeral });
            if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageGuild))
                return await interaction.reply({ content: "❌ Tu n'as pas la permission requise pour voir le récapitulatif !", flags: MessageFlags.Ephemeral });

            const guildID = interaction.guild.id;
            const settingsWithRole = ["anti-link", "anti-say", "anti-scam"];

            async function activateFeature() {
                const action = interaction.options.getString("action");
                const role = interaction.options.getRole("role-exception")?.id ?? null;

                switch (action) {
                    case "activate":
                        await updateValue(guildID, "guilds", settingType, 1, false);

                        if (settingsWithRole.includes(settingType))
                            await updateValue(guildID, "guilds", `${settingType}-role`, role, false);

                        await interaction.reply({ content: `L'${settingType} a bien été activé ${role !== null ? `sauf pour <@&${role}> !` : "!"}`, flags: MessageFlags.Ephemeral });
                        break;

                    case "desactivate":
                        await deleteValue(guildID, "guilds", settingType);

                        await interaction.reply({ content: `L'${settingType} a bien été désactivé !`, flags: MessageFlags.Ephemeral });
                        break;
                }
            }

            switch (settingType) {
                case "recap":
                    const configurationNames = ["anti-bot", "anti-link", "anti-raid", "anti-say", "anti-scam"];
                    const configurations = [];

                    for (let i = 0; i < configurationNames.length; i++) {
                        const configuration = await hasValue(guildID, "guilds", configurationNames[i]);

                        configurations.push(configuration ? "✅ Activé" : "❌ Désactivé");
                    }

                    const configRecapEmbed = new EmbedBuilder()
                        .setColor([255, 85, 0])
                        .setTitle("Ma configuration sur ce serveur")
                        .setDescription("⚠️ **__Attention__** !\nPour certaines fonctionalités, j'ai besoin de permissions, sinon rien ne se passera !\n\n> 🤖 **Anti-bot** : `Bannir des membres`\n> 🔗 **Anti-lien** : `Gérer les messages`\n> 🛡️ **Anti-raid** : `Expulser, accepter et refuser des membres`\n> 💸 **Anti-scam** : `Gérer les messages`\n\n** **")
                        .setFields(
                            { name: "🤖 __Anti-bot__", value: configurations[0], inline: true },
                            { name: "🔗 __Anti-link__", value: configurations[1], inline: true },
                            { name: "🛡️ __Anti-raid__", value: configurations[2], inline: true },
                            { name: "💬 __Anti-say__", value: configurations[3], inline: true },
                            { name: "💸 __Anti-scam__", value: configurations[4], inline: true })
                        .setTimestamp()
                        .setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL({ extension: "png", size: 64, dynamic: true }) });

                    await interaction.reply({ embeds: [configRecapEmbed], flags: MessageFlags.Ephemeral });
                    break;

                default:
                    await activateFeature();
                    break;
            }
        } catch (error) {
            await sendError(interaction, client, error);
        }
    }
};