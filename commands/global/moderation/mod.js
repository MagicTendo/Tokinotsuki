const { SlashCommandBuilder, PermissionsBitField, OverwriteType, EmbedBuilder, MessageFlags } = require("discord.js");
const ms = require("ms");
const { sendError } = require("../../../tools/error-catcher.js");
const { clean } = require("../../../tools/modules.js");

module.exports = {
    category: "Modération",
    data: new SlashCommandBuilder()
        .setName("mod")
        .setDescription("Permet de gérer tout ce qui tourne autour de la modération.")
        .setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator | PermissionsBitField.Flags.BanMembers | PermissionsBitField.Flags.KickMembers | PermissionsBitField.Flags.ModerateMembers | PermissionsBitField.Flags.ManageChannels)
        .setIntegrationTypes([0])
        .setContexts([0])
        .addSubcommand(subcommand => subcommand
            .setName("ban")
            .setDescription("Pour bannir un utilisateur.")
            .addUserOption(option => option
                .setName("user")
                .setDescription("L'utilisateur à bannir.")
                .setRequired(true))
            .addStringOption(option => option
                .setName("reason")
                .setDescription("La raison du bannissement.")
                .setRequired(false))
            .addChannelOption(option => option
                .setName("log-channel")
                .setDescription("Le salon dans lequelle le message sera envoyé.")
                .setRequired(false)))

        .addSubcommand(subcommand => subcommand
            .setName("clean-username")
            .setDescription("Ajoute un pseudo de serveur basé sur le pseudo de base, avec des caractères lisibles.")
            .addUserOption(option => option
                .setName("user")
                .setDescription("L'utilisateur à changer le pseudo.")
                .setRequired(true))
            .addStringOption(option => option
                .setName("reason")
                .setDescription("La raison de cela.")
                .setRequired(false))
            .addChannelOption(option => option
                .setName("log-channel")
                .setDescription("Le salon dans lequelle le message sera envoyé.")
                .setRequired(false)))

        .addSubcommand(subcommand => subcommand
            .setName("kick")
            .setDescription("Pour expulser un utilisateur.")
            .addUserOption(option => option
                .setName("user")
                .setDescription("L'utilisateur à expulser.")
                .setRequired(true))
            .addStringOption(option => option
                .setName("reason")
                .setDescription("La raison de l'expulsion.")
                .setRequired(false))
            .addChannelOption(option => option
                .setName("log-channel")
                .setDescription("Le salon dans lequelle le message sera envoyé.")
                .setRequired(false)))

        .addSubcommand(subcommand => subcommand
            .setName("lock")
            .setDescription("Pour bloquer ou débloquer en écriture un salon.")
            .addStringOption(option => option
                .setName("action")
                .setDescription("Choisis l'action à effectuer.")
                .addChoices(
                    { name: "🔒 Bloquer", value: "lock" },
                    { name: "🔓 Débloquer", value: "unlock" })
                .setRequired(true))
            .addRoleOption(option => option
                .setName("role")
                .setDescription("Le rôle qui sera bloqué en écriture, la valeur de défaut est @everyone.")
                .setRequired(false))
            .addStringOption(option => option
                .setName("reason")
                .setDescription("La raison de cela.")
                .setRequired(false))
            .addChannelOption(option => option
                .setName("log-channel")
                .setDescription("Le salon dans lequelle le message sera envoyé.")
                .setRequired(false)))

        .addSubcommand(subcommand => subcommand
            .setName("remove-roles")
            .setDescription("Enlève tout les rôles d'un utilisateur.")
            .addUserOption(option => option
                .setName("user")
                .setDescription("L'utilisateur à qui enlever les rôles.")
                .setRequired(true))
            .addStringOption(option => option
                .setName("reason")
                .setDescription("La raison de cela.")
                .setRequired(false))
            .addChannelOption(option => option
                .setName("log-channel")
                .setDescription("Le salon dans lequelle le message sera envoyé.")
                .setRequired(false)))

        .addSubcommand(subcommand => subcommand
            .setName("soft-ban")
            .setDescription("Pour soft bannir un utilisateur. Il sera ban puis unban, enlevant ses messages des 7 derniers jours.")
            .addUserOption(option => option
                .setName("user")
                .setDescription("L'utilisateur à soft bannir.")
                .setRequired(true))
            .addStringOption(option => option
                .setName("reason")
                .setDescription("La raison du soft bannissement.")
                .setRequired(false))
            .addChannelOption(option => option
                .setName("log-channel")
                .setDescription("Le salon dans lequelle le message sera envoyé.")
                .setRequired(false)))

        .addSubcommand(subcommand => subcommand
            .setName("timeout")
            .setDescription("Pour exclure un utilisateur.")
            .addUserOption(option => option
                .setName("user")
                .setDescription("L'utilisateur à exclure.")
                .setRequired(true))
            .addStringOption(option => option
                .setName("duration")
                .setDescription("La durée de l'exclusion (8d -> 8 jours, 3m -> minutes, etc.).")
                .setRequired(true))
            .addStringOption(option => option
                .setName("reason")
                .setDescription("La raison de l'exclusion.")
                .setRequired(false))
            .addChannelOption(option => option
                .setName("log-channel")
                .setDescription("Le salon dans lequelle le message sera envoyé.")
                .setRequired(false)))

        .addSubcommand(subcommand => subcommand
            .setName("unban")
            .setDescription("Pour unbannir un utilisateur.")
            .addUserOption(option => option
                .setName("user")
                .setDescription("L'utilisateur à unbannir.")
                .setRequired(true))
            .addStringOption(option => option
                .setName("reason")
                .setDescription("La raison du bannissement.")
                .setRequired(false))
            .addChannelOption(option => option
                .setName("log-channel")
                .setDescription("Le salon dans lequelle le message sera envoyé.")
                .setRequired(false)))

        .addSubcommand(subcommand => subcommand
            .setName("untimeout")
            .setDescription("Pour enlever l'exclusion d'un utilisateur.")
            .addUserOption(option => option
                .setName("user")
                .setDescription("L'utilisateur à qui enlever l'exclusion.")
                .setRequired(true))
            .addStringOption(option => option
                .setName("reason")
                .setDescription("La raison de cela.")
                .setRequired(false))
            .addChannelOption(option => option
                .setName("log-channel")
                .setDescription("Le salon dans lequelle le message sera envoyé.")
                .setRequired(false))),
    async execute(interaction, client) {
        try {
            let user = interaction.options.getMember("user");
            const reason = interaction.options.getString("reason") ?? "Aucune raison n'a été fournie...";
            const lockOrUnlock = interaction.options.getString("action") ?? null;
            const logChannel = interaction.options.getChannel("log-channel") ?? interaction.channel;
            const actionType = interaction.options.getSubcommand();

            let actions = {
                "ban": [PermissionsBitField.Flags.BanMembers, "🔨", "été banni"],
                "soft-ban": [PermissionsBitField.Flags.BanMembers, "🚪", "été soft banni"],
                "unban": [PermissionsBitField.Flags.BanMembers, "✔️", "été débanni"],
                "clean-username": [PermissionsBitField.Flags.ManageNicknames, "✏️", "été renommé"],
                "kick": [PermissionsBitField.Flags.KickMembers, "👞", "été expulsé"],
                "timeout": [PermissionsBitField.Flags.ModerateMembers, "🕰️", "été exclu pour [time]"],
                "untimeout": [PermissionsBitField.Flags.ModerateMembers, "⏰", "perdu son exclusion"],
                "remove-roles": [PermissionsBitField.Flags.ManageRoles, "🚫", "perdu tout ses rôles"],
                "lock": [PermissionsBitField.Flags.ManageChannels]
            };

            if (!interaction.member.permissions.has(actions[actionType][0]))
                return await interaction.reply({ content: "❌ Tu n'as pas la permisssion requise !", flags: MessageFlags.Ephemeral });
            if (!interaction.guild.members.me.permissions.has(actions[actionType][0]))
                return await interaction.reply({ content: "❌ Je n'ai pas la permission requise !", flags: MessageFlags.Ephemeral });

            if (actionType !== "lock" && actionType !== "unban") {
                if (typeof interaction.guild.members.cache.get(user.id) === "undefined" || !user)
                    return await interaction.reply({ content: "❌ L'utilisateur n'est pas sur le serveur !", flags: MessageFlags.Ephemeral });
                if (user.user.id === interaction.user.id && actionType !== "clean-username")
                    return await interaction.reply({ content: "❌ Je ne veux pas le faire sur toi !", flags: MessageFlags.Ephemeral });
                if (!user.bannable)
                    return await interaction.reply({ content: "❌ Je ne peux pas faire cette action sur cette personne, probablement à cause des permissions (permission manquante, rôle supérieur ou égal,  fondateur, etc.) !", flags: MessageFlags.Ephemeral });

                const userRoleRawPosition = user.roles.highest.rawPosition;
                const memberRoleRawPosition = interaction.member.roles.highest.rawPosition;

                if (userRoleRawPosition >= memberRoleRawPosition)
                    return await interaction.reply({ content: "❌ Tu ne peux pas faire ça, cet utilisateur a un rôle superieur à toi !", flags: MessageFlags.Ephemeral });
            } else if (actionType === "lock") {
                if (!interaction.guild.members.me.permissions.has(PermissionsBitField.Flags.ManageRoles))
                    return await interaction.reply({ content: "❌ J'ai besoin de la permission de gérer les rôles !", flags: MessageFlags.Ephemeral });
            }

            switch (actionType) {
                case "ban":
                    await user.ban({ reason: reason });
                    break;

                case "soft-ban":
                    await user.ban({ reason: reason, deleteMessageSeconds: 3 * 24 * 60 * 60 });

                    user = interaction.options.getUser("user");

                    await interaction.guild.members.unban(user);
                    break;

                case "unban":
                    user = interaction.options.getUser("user");

                    try {
                        await interaction.guild.bans.fetch(user.id);
                        await interaction.guild.members.unban(user);
                    } catch {
                        return await interaction.reply({ content: "❌ Cet utilisateur n'est pas banni !", flags: MessageFlags.Ephemeral });
                    }
                    break;

                case "clean-username":
                    const username = user.nickname ?? user.user.username;
                    const newUsername = await clean(username);

                    if (username === newUsername)
                        return await interaction.reply({ content: "❌ Le nom de l'utilisateur ne contient pas de caractère spécial !", flags: MessageFlags.Ephemeral });

                    await user.setNickname(newUsername);
                    break;

                case "kick":
                    await user.kick({ reason: reason });
                    break;

                case "timeout":
                    const timeoutDurationRaw = interaction.options.getString("duration");
                    const timeoutDuration = timeoutDurationRaw.trim().replace(/ {2,}/g, " ").split(" ");
                    let timeoutDurationMilliseconds = 0;
                    let timeoutDurationString = "";

                    for (let i = 0; i < timeoutDuration.length; i++) {
                        timeoutDurationMilliseconds += ms(timeoutDuration[i]);
                        timeoutDurationString += (timeoutDuration.length === i + 1 && timeoutDuration.length !== 1 ? "et " : "") + timeoutDuration[i].replace(/([0-9])ms/, "$1 milliseconde(s) ").replace(/([0-9])s/, "$1 seconde(s) ").replace(/([0-9])m/, "$1 minute(s) ").replace(/([0-9])h/, "$1 heure(s) ").replace(/([0-9])d/, "$1 jour(s) ").replace(/([0-9])w/, "$1 semaine(s) ").replace(/(^[0-9]$)/, "$1 milliseconde(s) ");
                    }

                    if (typeof timeoutDurationMilliseconds === "undefined" || isNaN(timeoutDurationMilliseconds))
                        return await interaction.reply({ content: "❌ La valeur de temps n'est pas correcte ! Cela doit être un nombre avec une lettre. Les unités disponibles sont `ms`, `s`, `m`, `h`, `d` et `w`, et s'utilisent avec un nombre, `9d` pour 9 jours, `3h 14m` pour 3 heures et 14 minutes, etc.", flags: MessageFlags.Ephemeral });
                    if (timeoutDurationMilliseconds < 1)
                        return await interaction.reply({ content: "❌ La valeur doit être strictement positive et non nulle !", flags: MessageFlags.Ephemeral });
                    if (timeoutDurationMilliseconds > 2_332_800_000)
                        return await interaction.reply({ content: "❌ Tu ne peux pas exclure quelqu'un pendant plus de 27 jours !", flags: MessageFlags.Ephemeral });

                    actions["timeout"][2] = actions["timeout"][2].replace("[time]", timeoutDurationString.trim());

                    await user.timeout(timeoutDurationMilliseconds);
                    break;

                case "untimeout":
                    await user.timeout(null);
                    break;

                case "remove-roles":
                    await user.roles.remove(user.roles.cache);
                    break;

                case "lock":
                    const roleLock = interaction.options.getRole("role");
                    const roleLockID = interaction.guild.id || roleLock?.rawPosition === 0 ? interaction.guild.id : roleLock.id;
                    const channelNameLock = interaction.channel.name;

                    switch (lockOrUnlock) {
                        case "lock":
                            if (String(channelNameLock).startsWith("🔒") && String(channelNameLock).endsWith("🔒"))
                                return await interaction.reply({ content: "❌ Le salon est déjà bloqué, ou alors c'est que tu as mis `🔒` au début et à la fin du nom du salon !", flags: MessageFlags.Ephemeral });

                            await interaction.channel.permissionOverwrites.set([{
                                id: roleLockID,
                                type: OverwriteType.Role,
                                deny: [PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.CreatePublicThreads, PermissionsBitField.Flags.CreatePrivateThreads, PermissionsBitField.Flags.AddReactions]
                            }]);

                            await interaction.channel.setName(`🔒-${channelNameLock}-🔒`);
                            break;

                        case "unlock":
                            await interaction.channel.permissionOverwrites.set([{
                                id: roleLockID,
                                type: OverwriteType.Role,
                                allow: [PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.CreatePublicThreads, PermissionsBitField.Flags.CreatePrivateThreads, PermissionsBitField.Flags.AddReactions]
                            }]);

                            if (String(channelNameLock).startsWith("🔒") && String(channelNameLock).endsWith("🔒"))
                                await interaction.channel.setName(channelNameLock.replace("🔒-", "").replace("-🔒", ""));
                            break;
                    }
                    break;
            }

            if (actionType === "lock") {
                const unlockEmbed = new EmbedBuilder()
                    .setColor([112, 7, 7])
                    .setDescription(`### ${lockOrUnlock === "lock" ? "🔒" : "🔓"} Le salon (**${interaction.channel.id}**) a bien été ${lockOrUnlock === "lock" ? "" : "dé"}bloqué pour le rôle **<@&${roleLockID}>** !\n\n**__Raison__**\n> *${reason}*`)
                    .setTimestamp()
                    .setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL({ extension: "png", size: 64, dynamic: true }) });

                await logChannel.send({ embeds: [unlockEmbed] });
            } else {
                const modEmbed = new EmbedBuilder()
                    .setColor([112, 7, 7])
                    .setDescription(`### ${actions[actionType][1]} L'utilisateur **${user.nickname ?? user.user?.globalName ?? user.user?.username}** (**${user.user?.id ?? user.id}**) a bien ${actions[actionType][2]} par **<@${interaction.user.id}>** !\n\n**__Raison__**\n> *${reason}*`)
                    .setTimestamp()
                    .setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL({ extension: "png", size: 64, dynamic: true }) });

                await logChannel.send({ embeds: [modEmbed] });
            }

            await interaction.reply({ content: "✅ L'action a bien été effectuée !", flags: MessageFlags.Ephemeral });
        } catch (error) {
            await sendError(interaction, client, error);
        }
    }
};