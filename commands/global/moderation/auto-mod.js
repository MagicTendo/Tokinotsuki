const { SlashCommandBuilder, EmbedBuilder, MessageFlags, AutoModerationActionType, AutoModerationRuleEventType, AutoModerationRuleKeywordPresetType, AutoModerationRuleTriggerType, PermissionsBitField, ChannelType } = require("discord.js");
const ms = require("ms");
const { sendError } = require("../../../tools/error-catcher.js");

module.exports = {
    category: "Modération",
    data: new SlashCommandBuilder()
        .setName("auto-mod")
        .setDescription("Permet de gérer l'AutoMod.")
        .setDefaultMemberPermissions(PermissionsBitField.Flags.ManageGuild)
        .setIntegrationTypes([0])
        .setContexts([0])
        .addSubcommand(subcommand => subcommand
            .setName("block-bad-words")
            .setDescription("Ajoute la règle pour limiter les mots interdits.")
            .addStringOption(option => option
                .setName("block-profanity")
                .setDescription("Faut-il bloquer le contenu à fort caractère obscène ?")
                .addChoices(
                    { name: "✅ Oui", value: "yes" },
                    { name: "❌ Non", value: "no" })
                .setRequired(true))
            .addStringOption(option => option
                .setName("block-slurs")
                .setDescription("Faut-il bloquer les insultes et les injures ?")
                .addChoices(
                    { name: "✅ Oui", value: "yes" },
                    { name: "❌ Non", value: "no" })
                .setRequired(true))
            .addStringOption(option => option
                .setName("block-sexual-content")
                .setDescription("Faut-il bloquer le contenu sexuel ?")
                .addChoices(
                    { name: "✅ Oui", value: "yes" },
                    { name: "❌ Non", value: "no" })
                .setRequired(true))
            .addStringOption(option => option
                .setName("block-message")
                .setDescription("Faut-il bloquer le message ?")
                .addChoices(
                    { name: "✅ Oui", value: "yes" },
                    { name: "❌ Non", value: "no" })
                .setRequired(true))
            .addStringOption(option => option
                .setName("block-message-content")
                .setDescription("Le contenu du message qui sera envoyé à l'utilisateur")
                .setMaxLength(150)
                .setRequired(false))
            .addChannelOption(option => option
                .setName("send-alert")
                .setDescription("Le salon où envoyer l'alerte.")
                .addChannelTypes(ChannelType.GuildText)
                .setRequired(false))
            .addStringOption(option => option
                .setName("words-exception")
                .setDescription("Les mots autorisés séparés par une virgule. * désigne n'importe quels caractères.")
                .setRequired(false))
            .addChannelOption(option => option
                .setName("channel-exception")
                .setDescription("Le salon où la règle ne sera pas affectée.")
                .setRequired(false))
            .addRoleOption(option => option
                .setName("role-exception")
                .setDescription("Le rôle à qui la règle ne sera pas affectée.")
                .setRequired(false))
            .addStringOption(option => option
                .setName("rule-name")
                .setDescription("Le nom de la règle.")
                .setMaxLength(100)
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
            .setName("block-custom-bad-words")
            .setDescription("Ajoute la règle pour limiter les mots interdits de ton choix.")
            .addStringOption(option => option
                .setName("words")
                .setDescription("Les mots non autorisés séparés par une virgule. * désigne n'importe quels caractères.")
                .setRequired(true))
            .addStringOption(option => option
                .setName("block-message")
                .setDescription("Faut-il bloquer le message ?")
                .addChoices(
                    { name: "✅ Oui", value: "yes" },
                    { name: "❌ Non", value: "no" })
                .setRequired(true))
            .addStringOption(option => option
                .setName("block-message-content")
                .setDescription("Le contenu du message qui sera envoyé à l'utilisateur")
                .setMaxLength(150)
                .setRequired(false))
            .addChannelOption(option => option
                .setName("send-alert")
                .setDescription("Le salon où envoyer l'alerte.")
                .addChannelTypes(ChannelType.GuildText)
                .setRequired(false))
            .addStringOption(option => option
                .setName("timeout-duration")
                .setDescription("La durée de l'exclusion (8d -> 8 jours, 3m -> minutes, etc.).")
                .setRequired(false))
            .addStringOption(option => option
                .setName("regex")
                .setDescription("Utilise du regex pour une recherche plus précise des mots à bloquer. Sépare tes expressions avec \\n.")
                .setRequired(false))
            .addStringOption(option => option
                .setName("words-exception")
                .setDescription("Les mots autorisés séparés par une virgule. * désigne n'importe quels caractères.")
                .setRequired(false))
            .addChannelOption(option => option
                .setName("channel-exception")
                .setDescription("Le salon où la règle ne sera pas affectée.")
                .setRequired(false))
            .addRoleOption(option => option
                .setName("role-exception")
                .setDescription("Le rôle à qui la règle ne sera pas affectée.")
                .setRequired(false))
            .addStringOption(option => option
                .setName("rule-name")
                .setDescription("Le nom de la règle.")
                .setMaxLength(100)
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
            .setName("mention-spam")
            .setDescription("Ajoute la règle pour limiter le spam de mention.")
            .addIntegerOption(option => option
                .setName("limit")
                .setDescription("Le nombre de mentions limite.")
                .setMinValue(1)
                .setMaxValue(50)
                .setRequired(true))
            .addStringOption(option => option
                .setName("block-message")
                .setDescription("Faut-il bloquer le message ?")
                .addChoices(
                    { name: "✅ Oui", value: "yes" },
                    { name: "❌ Non", value: "no" })
                .setRequired(true))
            .addStringOption(option => option
                .setName("block-message-content")
                .setDescription("Le contenu du message qui sera envoyé à l'utilisateur")
                .setMaxLength(150)
                .setRequired(false))
            .addChannelOption(option => option
                .setName("send-alert")
                .setDescription("Le salon où envoyer l'alerte.")
                .addChannelTypes(ChannelType.GuildText)
                .setRequired(false))
            .addStringOption(option => option
                .setName("timeout-duration")
                .setDescription("La durée de l'exclusion (8d -> 8 jours, 3m -> minutes, etc.).")
                .setRequired(false))
            .addChannelOption(option => option
                .setName("channel-exception")
                .setDescription("Le salon où la règle ne sera pas affectée.")
                .setRequired(false))
            .addRoleOption(option => option
                .setName("role-exception")
                .setDescription("Le rôle à qui la règle ne sera pas affectée.")
                .setRequired(false))
            .addStringOption(option => option
                .setName("rule-name")
                .setDescription("Le nom de la règle.")
                .setMaxLength(100)
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
            .setName("spam")
            .setDescription("Ajoute la règle pour limiter le spam.")
            .addStringOption(option => option
                .setName("block-message")
                .setDescription("Faut-il bloquer le message ?")
                .addChoices(
                    { name: "✅ Oui", value: "yes" },
                    { name: "❌ Non", value: "no" })
                .setRequired(true))
            .addStringOption(option => option
                .setName("block-message-content")
                .setDescription("Le contenu du message qui sera envoyé à l'utilisateur")
                .setMaxLength(150)
                .setRequired(false))
            .addChannelOption(option => option
                .setName("send-alert")
                .setDescription("Le salon où envoyer l'alerte.")
                .addChannelTypes(ChannelType.GuildText)
                .setRequired(false))
            .addChannelOption(option => option
                .setName("channel-exception")
                .setDescription("Le salon où la règle ne sera pas affectée.")
                .setRequired(false))
            .addRoleOption(option => option
                .setName("role-exception")
                .setDescription("Le rôle à qui la règle ne sera pas affectée.")
                .setRequired(false))
            .addStringOption(option => option
                .setName("rule-name")
                .setDescription("Le nom de la règle.")
                .setMaxLength(100)
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
            .setName("words-in-profile")
            .setDescription("Ajoute la règle bloquer des mots non appropriés présent dans un profile.")
            .addStringOption(option => option
                .setName("words")
                .setDescription("Les mots non autorisés séparés par une virgule. * désigne n'importe quels caractères.")
                .setRequired(true))
            .addStringOption(option => option
                .setName("block-interactions")
                .setDescription("Faut-il bloquer ses intéractions ?")
                .addChoices(
                    { name: "✅ Oui", value: "yes" },
                    { name: "❌ Non", value: "no" })
                .setRequired(true))
            .addStringOption(option => option
                .setName("block-message-content")
                .setDescription("Le contenu du message qui sera envoyé à l'utilisateur")
                .setMaxLength(150)
                .setRequired(false))
            .addChannelOption(option => option
                .setName("send-alert")
                .setDescription("Le salon où envoyer l'alerte.")
                .addChannelTypes(ChannelType.GuildText)
                .setRequired(false))
            .addStringOption(option => option
                .setName("regex")
                .setDescription("Utilise du regex pour une recherche plus précise des mots à bloquer. Sépare tes expressions avec \\n.")
                .setRequired(false))
            .addStringOption(option => option
                .setName("words-exception")
                .setDescription("Les mots autorisés séparés par une virgule. * désigne n'importe quels caractères.")
                .setRequired(false))
            .addRoleOption(option => option
                .setName("role-exception")
                .setDescription("Le rôle à qui la règle ne sera pas affectée.")
                .setRequired(false))
            .addStringOption(option => option
                .setName("rule-name")
                .setDescription("Le nom de la règle.")
                .setMaxLength(100)
                .setRequired(false))
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
            if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageGuild))
                return await interaction.reply({ content: "❌ Tu n'as pas la permisssion requise !", flags: [MessageFlags.Ephemeral] });
            if (!interaction.guild.members.me.permissions.has(PermissionsBitField.Flags.ManageGuild))
                return await interaction.reply({ content: "❌ Je n'ai pas la permission requise !", flags: [MessageFlags.Ephemeral] });

            const autoModSettings = {
                "block-bad-words": AutoModerationRuleTriggerType.KeywordPreset,
                "block-custom-bad-words": AutoModerationRuleTriggerType.Keyword,
                "mention-spam": AutoModerationRuleTriggerType.MentionSpam,
                "spam": AutoModerationRuleTriggerType.Spam,
                "words-in-profile": AutoModerationRuleTriggerType.MemberProfile
            }

            const autoModDefaultRuleNames = {
                "block-bad-words": "Bloquer les mots fréquemment signalés",
                "block-custom-bad-words": "Bloquer des mots personnalisés",
                "mention-spam": "Bloquer les spams de mentions",
                "spam": "Bloquer le contenu suspecté de spam",
                "words-in-profile": "Bloquer des mots dans les noms de profil des membres"
            }

            const autoModShortRuleNames = {
                "block-bad-words": "Enlève les mots inappropriés",
                "block-custom-bad-words": "Enlève des mots inappropriés choisis",
                "mention-spam": "Bloque les spams de mentions",
                "spam": "Bloque les spams",
                "words-in-profile": "Bloquer les mots inappropriés dans un profil"
            }

            const autoModSettingTypeRaw = interaction.options.getSubcommand();
            const blockProfanity = interaction.options.getString("block-profanity");
            const blockSlurs = interaction.options.getString("block-slurs");
            const blockSexualContent = interaction.options.getString("block-sexual-content");
            const blockInteractions = interaction.options.getString("block-interactions");
            const blockMessage = interaction.options.getString("block-message");
            const blockMessageContent = interaction.options.getString("block-message-content") ?? "Ton message a été bloqué !";
            const sendAlert = interaction.options.getChannel("send-alert");
            const timeoutDurationRaw = interaction.options.getString("timeout-duration") ?? 0;
            const meantionLimit = interaction.options.getInteger("limit");
            const regex = interaction.options.getString("regex")?.split("\n") ?? [];
            const customBadWords = interaction.options.getString("words")?.split(",") ?? [];
            const allowedWords = interaction.options.getString("words-exception")?.split(",") ?? [];
            const channelException = interaction.options.getChannel("channel-exception") ?? null;
            const roleException = interaction.options.getRole("role-exception") ?? null;
            const ruleName = interaction.options.getString("rule-name") ?? autoModDefaultRuleNames[autoModSettingTypeRaw];
            const reason = interaction.options.getString("reason") ?? "Aucune raison n'a été fournie...";
            const logChannel = interaction.options.getChannel("log-channel") ?? interaction.channel;
            const blockContents = [];
            const ruleActions = [];
            let timeoutDurationSeconds = 0;
            let logDescription = "";
            let timeoutDurationString = "";

            if (timeoutDurationRaw !== 0) {
                const timeoutDuration = timeoutDurationRaw.trim().replace(/ {2,}/g, " ").split(" ");

                for (let i = 0; i < timeoutDuration.length; i++) {
                    timeoutDurationSeconds += ms(timeoutDuration[i]);
                    timeoutDurationString += (timeoutDuration.length === i + 1 && timeoutDuration.length !== 1 ? "et " : "") + timeoutDuration[i].replace(/([0-9])ms/, "$1 milliseconde(s) ").replace(/([0-9])s/, "$1 seconde(s) ").replace(/([0-9])m/, "$1 minute(s) ").replace(/([0-9])h/, "$1 heure(s) ").replace(/([0-9])d/, "$1 jour(s) ").replace(/([0-9])w/, "$1 semaine(s) ").replace(/(^[0-9]$)/, "$1 milliseconde(s) ");
                }

                timeoutDurationSeconds /= 1_000;

                if (typeof timeoutDurationSeconds === "undefined" || isNaN(timeoutDurationSeconds))
                    return await interaction.reply({ content: "❌ La valeur de temps n'est pas correcte ! Cela doit être un nombre avec une lettre. Les unités disponibles sont `ms`, `s`, `m`, `h`, `d` et `w`, et s'utilisent avec un nombre, `9d` pour 9 jours, `3h 14m` pour 3 heures et 14 minutes, etc.", flags: [MessageFlags.Ephemeral] });
                if (timeoutDurationSeconds < 1)
                    return await interaction.reply({ content: "❌ La valeur doit être strictement positive et non nulle !", flags: [MessageFlags.Ephemeral] });
                if (timeoutDurationSeconds > 2419200)
                    return await interaction.reply({ content: "❌ Tu ne peux pas exclure quelqu'un pendant plus de 4 semaines !", flags: [MessageFlags.Ephemeral] });
            }

            if (meantionLimit) logDescription += `🔴 **Limite de mentions** : ${meantionLimit}\n`;

            if (blockProfanity === "yes") blockContents.push(AutoModerationRuleKeywordPresetType.Profanity);
            if (blockProfanity) logDescription += `👊 **Bloquer le contenu obscène** : ${blockProfanity === "yes" ? "Oui" : "Non"}\n`;
            if (blockSlurs === "yes") blockContents.push(AutoModerationRuleKeywordPresetType.Slurs);
            if (blockSlurs) logDescription += `💢 **Bloquer les insultes et injures** : ${blockSlurs === "yes" ? "Oui" : "Non"}\n`;
            if (blockSexualContent === "yes") blockContents.push(AutoModerationRuleKeywordPresetType.SexualContent);
            if (blockSexualContent) logDescription += `🔞 **Bloquer le contenu sexuel** : ${blockSexualContent === "yes" ? "Oui" : "Non"}\n`;

            if (customBadWords.length !== 0) logDescription += `📖 **Nombre de mots personalisés** : ${customBadWords.length}\n`;
            if (regex.length !== 0) logDescription += `🔎 **Nombre d'expressions regex** : ${regex.length}\n`;
            if (allowedWords.length !== 0) logDescription += `✔️ **Nombre de mots autorisés** : ${allowedWords.length}\n`;

            if (blockMessage === "yes") ruleActions.push({ type: AutoModerationActionType.BlockMessage, metadata: { channel: sendAlert, durationSeconds: timeoutDurationSeconds, customMessage: blockMessageContent } });
            if (blockMessage) logDescription += `🚫 **Bloquer le message** : ${blockMessage === "yes" ? "Oui" : "Non"}\n`;
            if (blockInteractions === "yes") ruleActions.push({ type: AutoModerationActionType.BlockMemberInteraction, metadata: { channel: sendAlert, durationSeconds: timeoutDurationSeconds, customMessage: blockMessageContent } });
            if (blockInteractions) logDescription += `🙅 **Bloquer les intéractions** : ${blockInteractions === "yes" ? "Oui" : "Non"}\n`;
            if (sendAlert) ruleActions.push({ type: AutoModerationActionType.SendAlertMessage, metadata: { channel: sendAlert, durationSeconds: timeoutDurationSeconds, customMessage: blockMessageContent } });

            logDescription += `🚨 **Envoyer une alerte** : ${sendAlert ? `Oui (<#${sendAlert.id}>)` : "Non"}\n`;

            if (timeoutDurationSeconds !== 0) ruleActions.push({ type: AutoModerationActionType.Timeout, metadata: { channel: sendAlert, durationSeconds: timeoutDurationSeconds, customMessage: blockMessageContent } }), logDescription += `🕰️ **Durée de l'exclusion** : ${timeoutDurationString}\n`;

            const rule = await interaction.guild.autoModerationRules.create({
                enabled: true,
                name: ruleName,
                eventType: autoModSettingTypeRaw === "words-in-profile" ? AutoModerationRuleEventType.MemberUpdate : AutoModerationRuleEventType.MessageSend,
                triggerType: autoModSettings[autoModSettingTypeRaw],
                triggerMetadata: {
                    keywordFilter: customBadWords,
                    allowList: allowedWords,
                    mentionTotalLimit: meantionLimit,
                    regexPatterns: regex,
                    presets: blockContents
                },
                actions: ruleActions,
                exemptChannels: channelException === null ? null : [channelException],
                exemptRoles: roleException === null ? null : [roleException],
                reason: reason
            }).catch(async error => {
                if (error.message.includes("BASE_TYPE_BAD_LENGTH")) return await interaction.reply({ content: "❌ Ta configuration n'est pas possible !", flags: [MessageFlags.Ephemeral] });
                if (error.message.includes("AUTO_MODERATION_MAX_RULES_OF_TYPE_EXCEEDED")) return await interaction.reply({ content: "❌ Tu ne peux plus créer cette règle car il y en a trop !", flags: [MessageFlags.Ephemeral] });
                if (error.message === "Missing Access") return await interaction.reply({ content: "❌ Cette fonctionalité n'est disponible que pour les serveurs communautaires !", flags: [MessageFlags.Ephemeral] });

                return await interaction.reply({ content: `❌ Cela semble être une erreur ! Signale-le à mon créateur avec la commande \`/report\` et ce message : \`\`\`js\n${error.message}\`\`\``, flags: [MessageFlags.Ephemeral] });
            });

            if (rule) {
                await interaction.reply({ content: `✅ La règle \`${ruleName}\` a bien été créée !`, flags: [MessageFlags.Ephemeral] });

                const automodEmbed = new EmbedBuilder()
                    .setColor([112, 7, 7])
                    .setDescription(`### Nouvelle règle créée : \`${ruleName}\`\n\n📂 **Type de règle** : ${autoModShortRuleNames[autoModSettingTypeRaw]}\n${logDescription.slice(0, -1)}\n🛋️ **Salon exclue** : ${channelException ?? "*aucun*"}\n🏷️ **Rôle exclue** : ${roleException ?? "*aucun*"}\n📝 **Raison** :\n> *${reason}*`)
                    .setTimestamp()
                    .setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL({ extension: "png", size: 64 }) });

                await logChannel.send({ embeds: [automodEmbed] });
            }
        } catch (error) {
            await sendError(interaction, client, error);
        }
    }
};