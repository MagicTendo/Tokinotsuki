const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, ChannelType, MessageFlags, PermissionsBitField } = require("discord.js");
const Color = require("color").default;
const { readFileSync } = require("fs");
const { dependencies } = require("../../../package.json");
const { getValue, hasValue } = require("../../../tools/database.js");
const { sendError } = require("../../../tools/error-catcher.js");
const { flagToTeam } = require("../../../tools/flags.js");
const { capitalize, simplify, getWinningTeam } = require("../../../tools/modules.js");

module.exports = {
    category: "Informations",
    data: new SlashCommandBuilder()
        .setName("info")
        .setDescription("Permet d'obtenir pleins d'informations sur pleins de choses !")
        .setIntegrationTypes([0])
        .setContexts([0])
        .addSubcommand(subcommand => subcommand
            .setName("channel")
            .setDescription("Permet d'obtenir des informations sur un salon.")
            .addChannelOption(option => option
                .setName("channel")
                .setDescription("Le salon à connaître.")
                .addChannelTypes(ChannelType.GuildText, ChannelType.GuildVoice, ChannelType.GuildCategory, ChannelType.GuildAnnouncement, ChannelType.AnnouncementThread, ChannelType.PublicThread, ChannelType.PrivateThread, ChannelType.GuildStageVoice, ChannelType.GuildForum, ChannelType.GuildMedia)
                .setRequired(true)))

        .addSubcommand(subcommand => subcommand
            .setName("color")
            .setDescription("Permet d'obtenir des informations sur une couleur.")
            .addStringOption(option => option
                .setName("color-code")
                .setDescription("Le code de la couleur (hexadécimal, RGB, HSL, etc.).")
                .setRequired(true)))

        .addSubcommand(subcommand => subcommand
            .setName("invite-link")
            .setDescription("Donne des informations sur un lien d'invitation Discord.")
            .addStringOption(option => option
                .setName("code-or-link")
                .setDescription("Le code ou le lien de l'invitation.")
                .setRequired(true)))

        .addSubcommand(subcommand => subcommand
            .setName("role")
            .setDescription("Permet d'obtenir des informations sur un rôle.")
            .addRoleOption(option => option
                .setName("role")
                .setDescription("Le rôle à connaître.")
                .setRequired(true)))

        .addSubcommand(subcommand => subcommand
            .setName("server")
            .setDescription("Permet d'obtenir des informations sur le serveur."))

        .addSubcommand(subcommand => subcommand
            .setName("toki")
            .setDescription("Permet d'obtenir des informations sur moi !"))

        .addSubcommand(subcommand => subcommand
            .setName("user")
            .setDescription("Permet d'obtenir des informations sur un utilisateur.")
            .addUserOption(option => option
                .setName("user")
                .setDescription("L'utilisateur à connaître."))),
    async execute(interaction, client) {
        try {
            const subcommand = interaction.commandType === 1 ? interaction.options?.getSubcommand() : "user";

            switch (subcommand) {
                case "channel":
                    const channel = interaction.options.getChannel("channel");
                    const channelName = channel.name;
                    const channelType = channel.type;
                    const channelDescription = channel.topic ?? "*Aucun*";
                    const channelID = channel.id;
                    const channelTypeName = String(channelType).replace("0", "Textuel").replace("2", "Vocal").replace("4", "Catégorie").replace("5", "Salons d'annonces").replace("10", "Fil d'annonces").replace("11", "Fil public").replace("12", "Fil privé").replace("13", "Conférance").replace("15", "Forum").replace("16", "Médias");
                    const channelCreationDate = channel.createdTimestamp;

                    const infoChannelEmbed = new EmbedBuilder()
                        .setColor([255, 85, 0])
                        .setDescription(`## __Informations sur ${channelType === 4 ? "la catégorie" : "le salon"} ${channelName}__\n** **${channelType === 0 ? `\n✏️ **__Description__**\n> ${channelDescription}\n\n** **` : ""}`)
                        .setFields(
                            { name: "🆔 __ID__", value: channelID, inline: true },
                            { name: "🛋️ __Type de salon__", value: channelTypeName, inline: true },
                            { name: "🕰️ __Date de création__", value: `<t:${Math.floor(channelCreationDate / 1_000)}:f>`, inline: true })
                        .setTimestamp()
                        .setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL({ extension: "png", size: 64 }) });

                    if (channelType !== 11) {
                        const channelPosition = String(channel.position + 1);

                        infoChannelEmbed.addFields(
                            { name: "🪜 __Position relative__", value: channelPosition, inline: true });
                    }

                    if (channelType === 0 || channelType === 2 || channelType === 11) {
                        const channelRateLimit = String(channel.rateLimitPerUser).replace(/^0$/g, "*Aucune limite*").replace(/^5$/g, "5 secondes").replace(/^10$/g, "10 secondes").replace(/^15$/g, "15 secondes").replace(/^30$/g, "30 secondes").replace(/^60$/g, "1 minute").replace(/^120$/g, "2 minutes").replace(/^300$/g, "5 minutes").replace(/^600$/g, "10 minutes").replace(/^900$/g, "15 minutes").replace(/^1800$/g, "30 minutes").replace(/^3600$/g, "1 heure").replace(/^7200$/g, "2 heures").replace(/^21600$/g, "6 heures");
                        const channelCategory = channel.parent?.name ?? "*Aucun*";
                        const channelLastMessageID = channel.lastMessageId;
                        const channelLastMessage = channelLastMessageID !== null && channelType !== 4 ? `${channel.url}/${channelLastMessageID}` : "*Il n'y a aucun message*";
                        const channelLastPinMessageTimestamp = `<t:${channel.lastPinTimestamp / 1_000}:f>`.replace(/<t:NaN:f>|<t:0:f>/, "*Aucun message n'est épinglé*");

                        infoChannelEmbed.addFields(
                            { name: "⏱️ __Mode lent__", value: channelRateLimit, inline: true });

                        if (channelType !== 11) {
                            const channelNSFW = channel.nsfw ? "Oui" : "Non";
                            const channelSynchronisedPermissions = channel.permissionsLocked === true ? "Oui" : "Non";

                            infoChannelEmbed.addFields(
                                { name: "🔞 __NSFW__", value: channelNSFW, inline: true },
                                { name: "✅ __Permissions synchronisées__", value: channelSynchronisedPermissions, inline: true });
                        }

                        infoChannelEmbed.addFields(
                            { name: "📁 __Parent__", value: channelCategory, inline: true },
                            { name: "✉️ __Dernier message__", value: channelLastMessage, inline: true },
                            { name: "📌 __Date du dernier message épinglé__", value: channelLastPinMessageTimestamp, inline: true });

                        if (channelType === 2) {
                            const country = {
                                "null": "Automatique",
                                "brazil": "Brésil",
                                "hongkong": "Hong Kong",
                                "india": "Inde",
                                "japan": "Japon",
                                "rotterdam": "Rotterdam",
                                "singapore": "Singapour",
                                "southafrica": "Afrique du Sud",
                                "sydney": "Sydney",
                                "us-central": "Centre des États-Unis",
                                "us-east": "Est des États-Unis",
                                "us-south": "Sud des États-Unis",
                                "us-west": "Ouest des États-Unis"
                            };

                            const channelRegion = country[String(channel.rtcRegion)];
                            const channelBitrate = `${channel.bitrate / 1_000}kbps`;
                            const channelIsFull = channel.full === true ? "Oui" : "Non";
                            const channelUserLimit = `${channel.userLimit} utilisateurs`;
                            const channelVideoQuality = channel.videoQualityMode === 2 ? "720p" : "Automatique";

                            infoChannelEmbed.addFields(
                                { name: "🌎 __Région__", value: channelRegion, inline: true },
                                { name: "🔊 __Bitrate__", value: channelBitrate, inline: true },
                                { name: "🎥 __Qualité vidéo__", value: channelVideoQuality, inline: true },
                                { name: "⚠️ __Limite__", value: channelUserLimit, inline: true },
                                { name: "🌐 __Est-ce plein__", value: channelIsFull, inline: true });
                        }
                    } else if (channelType === 4) {
                        const categoryChildren = String(channel.children.cache.size);

                        infoChannelEmbed.addFields(
                            { name: "🔢 __Nombre de salons__", value: categoryChildren, inline: true });
                    }

                    await interaction.reply({ embeds: [infoChannelEmbed] });
                    break;

                case "color":
                    const colorRaw = interaction.options.getString("color-code");

                    try {
                        const color = Color(colorRaw);
                        const colorRGBArray = color.rgb().array();
                        const colorLightOrDark = color.isDark() ? "La couleur est sombre." : "La couleur est claire";
                        const colorGrayscale = color.grayscale().string();
                        const colorNegative = color.negate().string();
                        const colorWord = capitalize(color.keyword());
                        const colorHexadecimal = color.hex();
                        const colorRGB = color.rgb().string();
                        const colorRGBPercent = color.percentString();
                        const colorHSL = `hsl(${color.hsl().color.map(color => Math.round(color)).join(", ")})`;
                        const colorHSV = `hsv(${color.hsv().color.map(color => Math.round(color)).join(", ")})`;
                        const colorCMYK = `cmyk(${color.cmyk().color.map(color => Math.round(color)).join(", ")})`;
                        const colorHWB = `hwb(${color.hwb().color.map(color => Math.round(color)).join(", ")})`;
                        const colorLCH = `lch(${color.lch().color.map(color => Math.round(color)).join(", ")})`;
                        const colorLAB = `lab(${color.lab().color.map(color => Math.round(color)).join(", ")})`;
                        const colorHCG = `hcg(${color.hcg().color.map(color => Math.round(color)).join(", ")})`;
                        const colorApple = `apple(${color.apple().color.map(color => Math.round(color)).join(", ")})`;
                        const colorXYZ = `xyz(${color.xyz().color.map(color => Math.round(color)).join(", ")})`;
                        const colorAnsi16 = String(color.ansi16().color[0]);
                        const colorAnsi256 = String(color.ansi256().color[0]);
                        const colorImage = `https://singlecolorimage.com/get/${colorHexadecimal.substring(1, 7)}/1000x1000`;

                        const infoColorEmbed = new EmbedBuilder()
                            .setColor(colorRGBArray)
                            .setDescription(`## __Informations sur la couleur ${colorRaw} !__\n** **\n💡 **__Luminance de la couleur__**\n> ${colorLightOrDark}\n\n🌫️ **__Niveaux de gris__**\n> ${colorGrayscale}\n\n🔳 **__Négatif__**\n> ${colorNegative}\n\n** **`)
                            .setFields(
                                { name: "📖 __Mot__", value: colorWord, inline: true },
                                { name: "🎨 __Hexadécimal__", value: colorHexadecimal, inline: true },
                                { name: "🔴 __RGB__", value: colorRGB, inline: true },
                                { name: "🧮 __RGB %__", value: colorRGBPercent, inline: true },
                                { name: "🔘 __HSL__", value: colorHSL, inline: true },
                                { name: "🔻 __HSV__", value: colorHSV, inline: true },
                                { name: "🟨 __CMYK__", value: colorCMYK, inline: true },
                                { name: "💠 __HWB__", value: colorHWB, inline: true },
                                { name: "📀 __LCH__", value: colorLCH, inline: true },
                                { name: "🥼 __LAB__", value: colorLAB, inline: true },
                                { name: "🧪 __HCG__", value: colorHCG, inline: true },
                                { name: "🍎 __Apple__", value: colorApple, inline: true },
                                { name: "📐 __XYZ__", value: colorXYZ, inline: true },
                                { name: "💽 __Ansi 16__", value: colorAnsi16, inline: true },
                                { name: "💻 __Ansi 256__", value: colorAnsi256, inline: true })
                            .setThumbnail(colorImage)
                            .setTimestamp()
                            .setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL({ extension: "png", size: 64 }) });

                        await interaction.reply({ embeds: [infoColorEmbed] });
                    } catch {
                        await interaction.reply({ content: `❌ \`${colorRaw}\` n'est pas une vraie couleur !`, flags: [MessageFlags.Ephemeral] });
                    }
                    break;

                case "invite-link":
                    const inviteInput = interaction.options.getString("code-or-link");
                    const inviteCode = inviteInput.split(/[/]+/).pop();
                    const inviteLink = `https://discord.gg/${inviteCode}`;

                    try {
                        const invite = await client.fetchInvite(inviteLink);
                        const guildDescription = invite.guild.description ?? "*Aucune ou profil privé*";;
                        const guildName = invite.guild.name;
                        const guildID = String(invite.guild.id);
                        const guildOwnerID = invite.guild.ownerId;
                        const guildOwner = guildOwnerID ? `<@${invite.guild.ownerId}>` : "???";
                        const guildInviterID = invite.inviterId;
                        const guildInviter = guildInviterID ? `<@${guildInviterID}>` : "???";
                        const guildChannelName = invite.channel.name;
                        const guildChannelID = invite.channelId;
                        const guildCustomLinkID = invite.guild.vanityURLCode;
                        const guildCustomLink = guildCustomLinkID !== null ? `https://discord.gg/${guildCustomLinkID}` : "*Aucun*";
                        const guildMemberCount = invite.memberCount ? String(invite.memberCount) : "???";
                        const guildOnlineCount = invite.presenceCount ? String(invite.presenceCount) : "???";
                        const fetchGuild = client.guilds.cache.get(guildID);
                        const isBotHere = fetchGuild?.members.me ? "Oui !" : "Non...";
                        const guildImageID = invite.guild.icon;
                        const guildBannerID = invite.guild.banner;
                        const guildImage = `https://cdn.discordapp.com/icons/${guildID}/${guildImageID}.png?size=4096`;
                        const guildBanner = `https://cdn.discordapp.com/banners/${guildID}/${guildBannerID}.png?size=4096`;

                        const infoInviteEmbed = new EmbedBuilder()
                            .setColor([255, 85, 0])
                            .setDescription(`## __Informations sur l'invitation [\`${inviteCode}\`](${inviteLink}) !__\n📖 **__Description du serveur__**\n> ${guildDescription}\n\n** **`)
                            .setFields(
                                { name: "✏️ __Nom du serveur__", value: guildName, inline: true },
                                { name: "🆔 __ID du serveur__", value: guildID, inline: true },
                                { name: "👷 __Propriétaire__", value: guildOwner, inline: true },
                                { name: "🤵 __Inviteur__", value: guildInviter, inline: true },
                                { name: "🛋️ __Salon de l'invitation__", value: `${guildChannelName} (<#${guildChannelID}>)`, inline: true },
                                { name: "🔗 __Lien personalisé__", value: guildCustomLink, inline: true },
                                { name: "🧍 __Membres__", value: guildMemberCount, inline: true },
                                { name: "🟢 __Connectés__", value: guildOnlineCount, inline: true },
                                { name: "⌚ __Y suis-je ?__", value: isBotHere, inline: true })
                            .setThumbnail(guildImage)
                            .setImage(guildBanner)
                            .setTimestamp()
                            .setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL({ extension: "png", size: 64 }) });

                        await interaction.reply({ embeds: [infoInviteEmbed] });
                    } catch {
                        await interaction.reply({ content: `❌ \`${inviteInput}\` ne semble pas être un lien ou code d'invitation valide !`, flags: [MessageFlags.Ephemeral] });
                    }
                    break;

                case "role":
                    const role = interaction.options.getRole("role");
                    const roleColorHexadecimal = `#${role.colors.primaryColor.toString(16).padStart(6, "0")}`;
                    const roleColorRGB = Color(roleColorHexadecimal).rgb().array();
                    const roleName = role.name;
                    const rolePermissionsAmount = role.permissions.bitfield !== 0n ? interaction.guild.roles.cache.get(role.id).permissions.toArray().length : 0;
                    const rolePermissions = role.permissions.bitfield !== 0n ? `\`${interaction.guild.roles.cache.get(role.id).permissions.toArray().map(permission => permission.toString()).join("` `")}\`` : "*`Aucune`*";
                    const roleMembersAmount = interaction.guild.roles.cache.get(role.id).members.size;
                    const roleMembers = interaction.guild.roles.cache.get(role.id).members.map(member => member.toString()).slice(0, 25).join(" ") || "*Personne*";
                    const roleID = role.id;
                    const roleCreationDateTimestamp = Math.floor(role.createdTimestamp / 1_000);
                    const rolePosition = String(role.position);
                    const roleIsMentionable = role.mentionable.valueOf().toString().replace(/false/g, "Non").replace(/true/g, "Oui");
                    const roleIsSeparated = role.hoist.valueOf().toString().replace(/false/g, "Non").replace(/true/g, "Oui");
                    const roleHasConnections = role.tags?.guildConnections?.valueOf().toString().replace(/true/g, "Oui") ?? "Non";
                    const roleNumberRoleUsers = String(role.members.size);

                    const infoRoleEmbed = new EmbedBuilder()
                        .setColor(roleColorRGB)
                        .setDescription(`## __Informations sur le role ${roleName}__\n** **\n🚩 **__Permissions__** (${rolePermissionsAmount})\n> ${rolePermissions}\n\n🎈 **__Membres ayant ce rôle__** (${roleMembersAmount})\n> ${roleMembers}${roleMembersAmount > 25 ? " ..." : ""}\n\n** **`)
                        .setFields(
                            { name: "🆔 __ID__", value: roleID, inline: true },
                            { name: "🎨 __Couleur__", value: roleColorHexadecimal, inline: true },
                            { name: "🕰️ __Date de création__", value: `<t:${roleCreationDateTimestamp}:f>`, inline: true },
                            { name: "🪜 __Position__", value: rolePosition, inline: true },
                            { name: "🔴 __Mentionable__", value: roleIsMentionable, inline: true },
                            { name: "📁 __Afficher séparément__", value: roleIsSeparated, inline: true },
                            { name: "🔗 __Rôle lié__", value: roleHasConnections, inline: true },
                            { name: "🔢 __Nombre de membres__", value: roleNumberRoleUsers, inline: true })
                        .setTimestamp()
                        .setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL({ extension: "png", size: 64 }) });

                    if (role.icon !== null) {
                        infoRoleEmbed.setThumbnail(role.iconURL({ extension: "png", size: 4_096, dynamic: true }));
                    } else if (role.unicodeEmoji !== null) {
                        infoRoleEmbed.addFields({ name: "🖼️ __Icône__", value: role.unicodeEmoji, inline: true });
                    }

                    await interaction.reply({ embeds: [infoRoleEmbed] });
                    break;

                case "server":
                    const guild = interaction.guild;
                    const guildName = guild.name;
                    const guildAcronym = guild.nameAcronym;
                    const guildDescription = guild.description ?? "*Aucune ou profil privé*";
                    const guildOnlineCount = guild.members.cache.filter(member => member.presence?.status === "online").size;
                    const guildIdleCount = guild.members.cache.filter(member => member.presence?.status === "idle").size;
                    const guildDndCount = guild.members.cache.filter(member => member.presence?.status === "dnd").size;
                    const guildOfflineCount = guild.members.cache.filter(member => typeof member.presence?.status === "undefined").size;
                    const guildVerificationLevel = String(guild.verificationLevel).replace(0, "*aucun*").replace(1, "faible").replace(2, "moyen").replace(3, "élevé").replace(4, "maximum");
                    const guildExplicitImageFilter = String(guild.explicitContentFilter).replace(0, "*aucun*").replace(1, "que pour les membres sans rôle").replace(2, "tout images");
                    const guildNSFWLevel = String(guild.nsfwLevel).replace(0, "non vérifié").replace(1, "explicite").replace(2, "sans problèmes").replace(3, "restriction d'âge");
                    const guildNotification = String(guild.defaultMessageNotifications).replace(0, "tous les messages").replace(1, "que les mentions");
                    const guildMaximumMembers = await simplify(interaction.user.id, guild.maximumMembers);
                    const guildMaximumBitrate = await simplify(interaction.user.id, guild.maximumBitrate);
                    const guildMaximumVideoChannelUsers = guild.maxVideoChannelUsers;
                    const guildMaximumStageVideoChannelUsers = guild.maxStageVideoChannelUsers;
                    const guildSystemChannel = `<#${guild.systemChannelId}>`.replace("<#null>", "*aucun*");
                    const guildAFKTimeout = guild.afkTimeout;
                    const guildAFKTimeoutClean = guildAFKTimeout === 3600 ? "1 heure" : `${guildAFKTimeout / 60} minutes`;
                    const guildAFKChannel = `<#${guild.afkChannelId}>`.replace("<#null>", "*aucun*");
                    const guildRulesChannel = `<#${guild.rulesChannelId}>`.replace("<#null>", "*aucun*");
                    const guildUpdatesChannel = `<#${guild.publicUpdatesChannelId}>`.replace("<#null>", "*aucun*");
                    const guildSafetyAlertsChannel = `<#${guild.safetyAlertsChannelId}>`.replace("<#null>", "*aucun*");
                    const guildSplashInvitation = guild.splash !== null ? `[Clique pour voir l'image !](${guild.splashURL({ extension: "png", size: 4_096, dynamic: true })})` : "*aucun*";
                    const guildSplashDiscover = guild.discoverySplash !== null ? `[Clique pour voir l'image !](${guild.discoverySplashURL({ extension: "png", size: 4_096, dynamic: true })})` : "*aucune*";

                    const guildEmojisArray = await guild.emojis.fetch().then((emojis) => {
                        let emojiList = [];

                        emojis.forEach(emoji => {
                            emojiList.push(`<${emoji.animated ? "a" : ""}:${emoji.name}:${emoji.id}>`);
                        });

                        return emojiList;
                    });
                    const guildEmojis = guildEmojisArray.length >= 1 && typeof guildEmojisArray === "object" ? guildEmojisArray.join(" ").toString() : "*aucun*";

                    const guildID = String(guild.id);
                    const guildOwnerID = guild.ownerId;
                    const guildNationality = guild.preferredLocale.split("-")[1].toLowerCase();
                    const guildCreationDateTimestamp = Math.floor(guild.createdTimestamp / 1_000);
                    const guildBoostTier = String(guild.premiumTier);
                    const guildBoostNumber = String(guild.premiumSubscriptionCount);
                    const guildHasCustomInvite = guild.vanityURLCode !== null ? guild.vanityURLCode : "*Aucun*";
                    const guildIsPartnered = guild.partnered.valueOf().toString().replace(/false/g, "Non").replace(/true/g, "Oui");
                    const guildIsVerified = guild.verified.valueOf().toString().replace(/false/g, "Non").replace(/true/g, "Oui");
                    const guildTextChannelNumber = String(guild.channels.cache.filter(channel => channel.type === ChannelType.GuildText).size);
                    const guildVoiceChannelNumber = String(guild.channels.cache.filter(channel => channel.type === ChannelType.GuildVoice).size);
                    const guildStageVoiceChannelNumber = String(guild.channels.cache.filter(channel => channel.type === ChannelType.GuildStageVoice).size);
                    const guildAnnouncementChannelNumber = String(guild.channels.cache.filter(channel => channel.type === ChannelType.GuildAnnouncement).size);
                    const guildThreadNumber = String(guild.channels.cache.filter(channel => channel.type === ChannelType.PublicThread || channel.type === ChannelType.PrivateThread || channel.type === ChannelType.AnnouncementThread).size);
                    const guildForumChannelNumber = String(guild.channels.cache.filter(channel => channel.type === ChannelType.GuildForum).size);
                    const guildMediaChannelNumber = String(guild.channels.cache.filter(channel => channel.type === ChannelType.GuildMedia).size);
                    const guildCategoryNumber = String(guild.channels.cache.filter(channel => channel.type === ChannelType.GuildCategory).size);
                    const guildRoleNumber = String(guild.roles.cache.size - 1);
                    const guildEmojiNumber = typeof guildEmojisArray === "object" ? guildEmojisArray.length : "*permission manquante*";
                    const guildStickerNumber = String(guild.stickers.cache.size);
                    const guildSoundNumber = String(guild.soundboardSounds.cache.size);

                    const guildInviteNumber = interaction.guild.members.me.permissions.has(PermissionsBitField.Flags.ManageGuild) ? await guild.invites.fetch().then((invites) => {
                        let inviteList = [];

                        invites.forEach(invite => {
                            inviteList.push(invite);
                        });

                        return String(inviteList.length);
                    }) : "*Permission manquante*";

                    const guildBotNumber = String(guild.members.cache.filter(member => member.user.bot).size);
                    const guildMemberNumber = String(guild.memberCount - guildBotNumber);
                    const guildProfilePicture = guild.iconURL({ extension: "png", size: 4_096, dynamic: true });
                    const guildBanner = guild.bannerURL({ extension: "png", size: 4_096, dynamic: true });

                    const infoServerEmbed = new EmbedBuilder()
                        .setColor([255, 85, 0])
                        .setDescription(`## __Informations sur ${guildName}__\n** **\n📖 **__Description du serveur__**\n> ${guildDescription}\n\n🪧 **__Statuts des membres__**\n> 🟢 **En ligne** : ${guildOnlineCount}\n> 🟡 **Inactif** : ${guildIdleCount}\n> 🔴 **Ne pas déranger** : ${guildDndCount}\n> ⚪ **Hors ligne / Invisible** : ${guildOfflineCount}\n\n🛡️ **__Sécurité__**\n> ✔️ **Niveau de vérification** : ${guildVerificationLevel}\n> 🔞 **Niveau d'explicité du serveur** : ${guildNSFWLevel}\n> 🗃️ **Filtre d'images** : ${guildExplicitImageFilter}\n\n⛔ **__Restrictions et notifications__**\n> 🔔 **Paramètre de notification** : ${guildNotification}\n> 🏘️ **Maximum de membres** : ${guildMaximumMembers}\n> 🎙️ **Bitrate maximum** : ${guildMaximumBitrate}bps\n> 📹 **Maximum de membres dans un appel vidéo** : ${guildMaximumVideoChannelUsers}\n> 🗣️ **Maximum de membres dans une conférance vidéo** : ${guildMaximumStageVideoChannelUsers}\n\n✨ **__Salons spéciaux__**\n> ⚙️ **Salon de messages système** : ${guildSystemChannel}\n> 🛏️ **Salon AFK** : ${guildAFKChannel} (délai de ${guildAFKTimeoutClean})\n> 📜 **Salon des règles ou de la chartre d'utilisation** : ${guildRulesChannel}\n> 📄 **Salon de mises à jour de la communauté** : ${guildUpdatesChannel}\n> 🚨 **Salon de notifications de sécurité** : ${guildSafetyAlertsChannel}\n\n📷 **__Images__**\n> ⛰️ **Arrière-plan d'invitation de serveur** : ${guildSplashInvitation}\n> 🧭 **Banière sur l'onglet découverte** : ${guildSplashDiscover}\n\n🫠 **__Émojis__** (${guildEmojiNumber})\n> ${guildEmojis}\n\n** **`)
                        .setFields(
                            { name: "🆔 __ID__", value: guildID, inline: true },
                            { name: "👷 __Propriétaire__", value: `<@${guildOwnerID}>`, inline: true },
                            { name: "✏️ __Nom acronyme__", value: guildAcronym, inline: true },
                            { name: "🏳️ __Nationalité__", value: `:flag_${guildNationality}:`, inline: true },
                            { name: "🕰️ __Date de création__", value: `<t:${guildCreationDateTimestamp}:f>`, inline: true },
                            { name: "🟪 __Niveau de boost__", value: guildBoostTier, inline: true },
                            { name: "🟣 __Boosts__", value: guildBoostNumber, inline: true },
                            { name: "✉️ __Invitation personalisé__", value: guildHasCustomInvite, inline: true },
                            { name: "🤝 __Partenaire__", value: guildIsPartnered, inline: true },
                            { name: "✅ __Vérifié__", value: guildIsVerified, inline: true },
                            { name: "💬 __Salons textuels__", value: guildTextChannelNumber, inline: true },
                            { name: "🔊 __Salons vocaux__", value: guildVoiceChannelNumber, inline: true },
                            { name: "🎤 __Conférences__", value: guildStageVoiceChannelNumber, inline: true },
                            { name: "📣 __Salons annonces__", value: guildAnnouncementChannelNumber, inline: true },
                            { name: "🧵 __Fils (threads)__", value: guildThreadNumber, inline: true },
                            { name: "💬 __Salons forums__", value: guildForumChannelNumber, inline: true },
                            { name: "🖼️ __Salons médias__", value: guildMediaChannelNumber, inline: true },
                            { name: "🗃️ __Catégories__", value: guildCategoryNumber, inline: true },
                            { name: "🎉 __Rôles__", value: guildRoleNumber, inline: true },
                            { name: "🍚 __Autocollants__", value: guildStickerNumber, inline: true },
                            { name: "🔊 __Sons__", value: guildSoundNumber, inline: true },
                            { name: "🎈 __Liens d'invitation__", value: guildInviteNumber, inline: true },
                            { name: "🧍 __Membres__", value: guildMemberNumber, inline: true },
                            { name: "🤖 __Bots__", value: guildBotNumber, inline: true })
                        .setThumbnail(guildProfilePicture)
                        .setImage(guildBanner)
                        .setTimestamp()
                        .setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL({ extension: "png", size: 64 }) });

                    await interaction.reply({ embeds: [infoServerEmbed] });
                    break;

                case "toki":
                    const uptime = client.uptime;
                    const uptimeDays = Math.floor(uptime / 86_400_000);
                    const uptimeHours = Math.floor(uptime / 3_600_000) % 24;
                    const uptimeMinutes = Math.floor(uptime / 60_000) % 60;
                    const uptimeSeconds = Math.floor(uptime / 1_000) % 60;
                    const helpJSON = readFileSync("./json/help.json", "utf-8");
                    const commandList = JSON.parse(helpJSON);
                    const numberCommands = String(commandList["count"]);
                    const numberGuilds = client.guilds.cache.size;
                    const numberUsers = client.users.cache.size;
                    const ram = Math.round(process.memoryUsage().heapUsed / 1024 / 1024 * 10) / 10;
                    const numberNPMPackages = String(Object.keys(dependencies).length);
                    const fetchToki = await client.user.fetch();
                    const tokiBanner = fetchToki.bannerURL({ extension: "png", size: 4_096, dynamic: true });
                        
                    const infoBotEmbed = new EmbedBuilder()
                        .setColor([255, 85, 0])
                        .setDescription(`## __Informations sur moi !__\n** **\nJe suis connectée depuis **${uptimeDays}** jours, **${uptimeHours}** heures, **${uptimeMinutes}** minutes, et **${uptimeSeconds}** secondes !\n-# *Encore merci à [Hasuko](https://www.youtube.com/@ohanashihasuko6535) (créateur du bot [Hasu](https://top.gg/bot/353949197571194890)) et à YuriSensei pour les tout débuts du projet, ainsi qu'à [Ninjdai](https://github.com/Ninjdai1) pour la suite et la première documentation !*\n\n** **`)
                        .setFields(
                            { name: "📁 __Version__", value: "v4.2.0", inline: true },
                            { name: "⌚ __Dernière mise à jour__", value: "<t:1789682400:D>", inline: true },
                            { name: "💾 __Commandes__", value: numberCommands, inline: true },
                            { name: "🔧 __Développeur__", value: "<@610493430325313549>", inline: true },
                            { name: "🗺️ __Serveurs__", value: `${numberGuilds} serveurs`, inline: true },
                            { name: "🧍 __Utilisateurs__", value: `${numberUsers} utilisateurs`, inline: true },
                            { name: "🕰️ __Date de création__", value: "<t:1608760222:f>", inline: true },
                            { name: "💾 __Mémoire utilisée__", value: `≈ ${ram} Mo`, inline: true },
                            { name: "📦 __Paquets__", value: numberNPMPackages, inline: true })
                        .setImage(tokiBanner)
                        .setTimestamp()
                        .setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL({ extension: "png", size: 64 }) });

                    const infoBotButtons = new ActionRowBuilder()
                        .addComponents(
                            new ButtonBuilder()
                                .setEmoji({ name: "📄" })
                                .setLabel("Documentation")
                                .setStyle(ButtonStyle.Link)
                                .setURL("https://tokinotsuki.rf.gd"),
                            new ButtonBuilder()
                                .setEmoji({ name: "✨" })
                                .setLabel("M'inviter")
                                .setStyle(ButtonStyle.Link)
                                .setURL("https://discord.com/oauth2/authorize?client_id=791437575642152982&scope=bot&permissions=8"),
                            new ButtonBuilder()
                                .setEmoji({ name: "🤖" })
                                .setLabel("Top.gg")
                                .setStyle(ButtonStyle.Link)
                                .setURL("https://top.gg/bot/791437575642152982"),
                            new ButtonBuilder()
                                .setEmoji({ name: "❓" })
                                .setLabel("Serveur support")
                                .setStyle(ButtonStyle.Link)
                                .setURL("https://discord.com/invite/ZNvTCvNGbZ"));

                    await interaction.reply({ embeds: [infoBotEmbed], components: [infoBotButtons] });
                    break;

                case "user":
                    const rawUser = interaction.options.getUser("user") ?? client.users.cache.get(interaction.targetId) ?? interaction.user;
                    const user = await rawUser.fetch();
                    const userID = user.id;

                    if (!client.guilds.cache.get(interaction.guild.id).members.cache.get(userID))
                        return await interaction.reply({ content: "❌ L'utilisateur n'est pas sur le serveur !", flags: [MessageFlags.Ephemeral] });

                    const pinsList = ["pin-cirno", "pin-retro", "pin-beta-tester", "pin-bug-hunter", "quest-master"];
                    const pinsEmoji = {
                        "pin-cirno": "<:CirnoPin:1462200543127670976>",
                        "pin-retro": "<:RetroToki:1467442122482253896>",
                        "pin-beta-tester": "<:BetaTester:1462199245632311493>",
                        "pin-bug-hunter": "<:Bug:1462199247322747036>",
                        "graniti": "🍧",
                        "pimentes": "🫑",
                        "mentis": "<:Mentis:1462199254813507869>",
                        "champiture": "🍄",
                        "graniti-gold": "🥇",
                        "pimentes-gold": "💴",
                        "mentis-gold": "<:MentisGold:1462208934239539373>",
                        "champiture-gold": "🟠",
                        "quest-master": "📙"
                    };
                    let pins = [];

                    for (let i = 0; i < pinsList.length; i++) {
                        const pin = await hasValue(userID, "users", pinsList[i]);

                        if (pin)
                            pins.push(pinsEmoji[pinsList[i]]);
                    }

                    const winningTeam = await getWinningTeam(userID);
                    const userTeamFlag = await getValue(userID, "users", "team");
                    const userTeamName = userTeamFlag > 0 ? await flagToTeam(userTeamFlag) : `*Aucune*`;
                    const userTeamPinsName = (winningTeam["isUserTeamWinning"] ? `${userTeamName}-gold` : userTeamName).toLowerCase();

                    if (userTeamFlag > 0)
                        pins.push(pinsEmoji[userTeamPinsName]);

                    pins = pins.length === 0 ? "*Aucun*" : pins.join(" ");

                    const userColor = user.accentColor ? user.accentColor : [255, 85, 0];
                    const member = interaction.guild.members.cache.get(userID);
                    const isBot = user.bot.valueOf();
                    const userName = isBot ? `${user.username}#${user.discriminator}` : `${user.globalName} (@${user.username})`;
                    const numberRoles = member.roles.cache.size - 1;
                    const roleList = numberRoles > 0 ? member.roles.cache.filter((role) => role.name !== "@everyone").map(role => role).slice(0, 25).join(" ") : "*Aucun*";
                    const avatarDecorationLink = `https://cdn.discordapp.com/avatar-decoration-presets/${user.avatarDecorationData?.asset}.png?size=4096`;
                    const avatarDecorationName = user.avatarDecorationData?.skuId;
                    const avatarDecoration = avatarDecorationName !== undefined ? `[${avatarDecorationName}](${avatarDecorationLink})` : "*aucune*";
                    const nominativePlaqueLink = `https://cdn.discordapp.com/assets/collectibles/${user.collectibles?.nameplate?.asset}asset.webm`;
                    const nominativePlaqueID = user.collectibles?.nameplate?.skuId;
                    const nominativePlaqueName = user.collectibles?.nameplate?.label;
                    const nominativePlaqueCleanName = nominativePlaqueName ? nominativePlaqueName.split("_").slice(2, -1).join(" ").toLowerCase() : null;
                    const nominativePlaque = nominativePlaqueID !== undefined && nominativePlaqueID !== null ? `[${capitalize(nominativePlaqueCleanName)}](${nominativePlaqueLink}) (${nominativePlaqueID})` : "*aucune*";

                    const guildTagName = user.primaryGuild?.tag;
                    let guildTag = "*aucun*";

                    if (guildTagName != null) {
                        const guildTagIcon = user.primaryGuild.badge;
                        const guildTagGuildID = user.primaryGuild.identityGuildId;

                        guildTag = `\`${guildTagName}\` ([icône](https://cdn.discordapp.com/clan-badges/${guildTagGuildID}/${guildTagIcon}.png?size=4096))`;
                    }

                    const hasNitro = user.premiumType > 0;
                    const badgesBitfield = user.flags.toArray();
                    const badgesArray = hasNitro ? badgesBitfield.unshift("Nitro") : badgesBitfield;
                    const badgeIcons = {
                        "Nitro": "<:NitroBadge:1397216614579048509>",
                        "Staff": "<:StaffBadge:1397216636141965342>",
                        "Partner": "<:PartnerBadge:1397216625119465492>",
                        "Hypesquad": "<:HypeSquadEventBadge:1397216593448271965>",
                        "BugHunterLevel1": "<:BugHunterBadge:1397216519875854386>",
                        "HypeSquadOnlineHouse1": "<:HypeSquadBraveryBadge:1397216572916895875>",
                        "HypeSquadOnlineHouse2": "<:HypeSquadBrillianceBadge:1397216583016775692>",
                        "HypeSquadOnlineHouse3": "<:HypeSquadBalanceBadge:1397216561617567875>",
                        "PremiumEarlySupporter": "<:EarlySupporterBadge:1397216551412961521>",
                        "BugHunterLevel2": "<:BugHunterGoldBadge:1397216530462150827>",
                        "VerifiedBot": "<:VerifiedBotBadge:1397216648100057200>",
                        "VerifiedDeveloper": "<:DeveloperBadge:1397216540620755045>",
                        "CertifiedModerator": "<:ModeratorBadge:1397216604051210271>",
                        "ActiveDeveloper": "<:ActiveDeveloperBadge:1397216509503340645>"
                    };
                    const badges = badgesArray.length > 0 ? badgesArray.map(badge => badgeIcons[badge]).join(" ") : "*Aucun*";
                    const isBotClean = isBot ? "Oui" : "Non";
                    const isSystem = user.system.valueOf();
                    const isSystemClean = isSystem ? "Oui" : "Non";
                    const currentStatus = member.presence?.status.replace("online", "En ligne").replace("idle", "Inactif").replace("dnd", "Ne pas déranger") ?? "Hors ligne";
                    const nickname = member.nickname ?? "*Aucun*";
                    const userColorHex = user.accentColor ? Color(userColor).hex() : "*Aucune*";
                    const userCreationDateTimestamp = Math.floor(user.createdTimestamp / 1_000);
                    const joinDateTimestamp = Math.floor(member.joinedTimestamp / 1_000);
                    const communicationDisabledUntilDateTimestamp = member.communicationDisabledUntilTimestamp != null ? `<t:${Math.floor(member.communicationDisabledUntilTimestamp / 1_000)}:R>` : "*N'est pas exlcue*";
                    const userProfilePicture = user.displayAvatarURL({ extension: "png", size: 4_096, dynamic: true });
                    const userBanner = user.bannerURL({ extension: "png", size: 4_096, dynamic: true });

                    const infoUserComponents = [];
                    const actionsButton = new ActionRowBuilder().addComponents(
                        new ButtonBuilder()
                            .setEmoji({ name: "🎒" })
                            .setLabel("Ouvrir son inventaire")
                            .setStyle(ButtonStyle.Secondary)
                            .setCustomId(`info-user_inventory_${userID}_${interaction.user.id}`),
                        new ButtonBuilder()
                            .setEmoji({ name: "🍪" })
                            .setLabel("Lui donner un cookie")
                            .setStyle(ButtonStyle.Secondary)
                            .setCustomId(`info-user_social_${userID}_${interaction.user.id}`));

                    if (!isBot && !isSystem)
                        infoUserComponents.push(actionsButton);

                    const infoUserEmbed = new EmbedBuilder()
                        .setColor(userColor)
                        .setDescription(`## __Informations sur ${userName}__\n** **\n✨ **__Décoration d'avatar__** : ${avatarDecoration}\n🏷️ **__Plaque nominative__** : ${nominativePlaque}\n🛡️ **__Tag de serveur__** : ${guildTag}\n\n🎉 **__Rôles__** (${numberRoles})\n> ${roleList}${numberRoles > 25 ? " ..." : ""}\n\n** **`)
                        .setFields(
                            { name: "📍 __Pin's__", value: pins, inline: true },
                            { name: "🏅 __Badges__", value: badges, inline: true },
                            { name: "🎉 __Équipe__", value: userTeamName, inline: true },
                            { name: "🆔 __ID__", value: userID, inline: true },
                            { name: "🤖 __Bot__", value: isBotClean, inline: true },
                            { name: "💾 __Système__", value: isSystemClean, inline: true },
                            { name: "❗ __Statut__", value: currentStatus, inline: true },
                            { name: "✏️ __Nom sur le serveur__", value: nickname, inline: true },
                            { name: "🎨 __Couleur__", value: userColorHex, inline: true },
                            { name: "🕑 __Compte créé le__", value: `<t:${userCreationDateTimestamp}:f>`, inline: true },
                            { name: "⌚ __A rejoint le serveur le__ ", value: `<t:${joinDateTimestamp}:f>`, inline: true },
                            { name: "⏳ __Durée de fin de l'exclusion__ ", value: communicationDisabledUntilDateTimestamp, inline: true })
                        .setThumbnail(userProfilePicture)
                        .setTimestamp()
                        .setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL({ extension: "png", size: 64 }) });

                    if (userBanner)
                        infoUserEmbed.setImage(userBanner);

                    await interaction.reply({ embeds: [infoUserEmbed], components: infoUserComponents });
                    break;
            }
        } catch (error) {
            await sendError(interaction, client, error);
        }
    }
};