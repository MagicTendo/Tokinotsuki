const { SlashCommandBuilder, EmbedBuilder, MessageFlags, ChannelType, PermissionsBitField } = require("discord.js");
const Color = require("color").default;
const { getValue, hasValue } = require("../../../tools/database.js");
const { sendError } = require("../../../tools/error-catcher.js");
const { isLink, getEmoteList } = require("../../../tools/modules.js");

module.exports = {
    category: "Fun",
    data: new SlashCommandBuilder()
        .setName("say")
        .setDescription("Contient tout ce qui est en rapport avec le fait de dire des choses.")
        .setIntegrationTypes([0])
        .setContexts([0])
        .addSubcommand(subcommand => subcommand
            .setName("classic")
            .setDescription("Me fait dire ce que tu veux !")
            .addStringOption(option => option
                .setName("message")
                .setDescription("Le message à me faire dire.")
                .setMaxLength(2_000)
                .setRequired(true))
            .addChannelOption(option => option
                .setName("channel")
                .setDescription("L'endroit où je dis le message (nécessite la permission administrateur).")
                .addChannelTypes(ChannelType.GuildText)
                .setRequired(false)))

        .addSubcommand(subcommand => subcommand
            .setName("embed")
            .setDescription("Envoie un embed complet.")
            .addStringOption(option => option
                .setName("color")
                .setDescription("La couleur en format hexadecimal (par exemple, #ff5500, ou RANDOM pour une couleur aléatoire).")
                .setMaxLength(7)
                .setRequired(false))
            .addStringOption(option => option
                .setName("title")
                .setDescription("Le titre de l'embed.")
                .setMaxLength(200)
                .setRequired(false))
            .addStringOption(option => option
                .setName("url")
                .setDescription("L'URL qui sera dans le titre.")
                .setMaxLength(150)
                .setRequired(false))
            .addStringOption(option => option
                .setName("author-name")
                .setDescription("Le nom de l'auteur.")
                .setMaxLength(200)
                .setRequired(false))
            .addAttachmentOption(option => option
                .setName("author-image")
                .setDescription("L'image de l'auteur.")
                .setRequired(false))
            .addStringOption(option => option
                .setName("author-url")
                .setDescription("L'URL qui sera dans l'auteur.")
                .setMaxLength(150)
                .setRequired(false))
            .addStringOption(option => option
                .setName("description")
                .setDescription("La description.")
                .setMaxLength(4_000)
                .setRequired(false))
            .addStringOption(option => option
                .setName("field-name-1")
                .setDescription("Le nom du premier champs.")
                .setMaxLength(75)
                .setRequired(false))
            .addStringOption(option => option
                .setName("field-value-1")
                .setDescription("La valeur du premier champs.")
                .setMaxLength(200)
                .setRequired(false))
            .addStringOption(option => option
                .setName("field-inline-1")
                .setDescription("Rendre ce champs aligné ou non.")
                .addChoices(
                    { name: "✅ Oui", value: "yes" },
                    { name: "❌ Non", value: "no" })
                .setRequired(false))
            .addStringOption(option => option
                .setName("field-name-2")
                .setDescription("Le nom du deuxième champs.")
                .setMaxLength(75)
                .setRequired(false))
            .addStringOption(option => option
                .setName("field-value-2")
                .setDescription("La valeur du deuxième champs.")
                .setMaxLength(200)
                .setRequired(false))
            .addStringOption(option => option
                .setName("field-inline-2")
                .setDescription("Rendre ce champs aligné ou non.")
                .addChoices(
                    { name: "✅ Oui", value: "yes" },
                    { name: "❌ Non", value: "no" })
                .setRequired(false))
            .addStringOption(option => option
                .setName("field-name-3")
                .setDescription("Le nom du troisième champs.")
                .setMaxLength(75)
                .setRequired(false))
            .addStringOption(option => option
                .setName("field-value-3")
                .setDescription("La valeur du troisième champs.")
                .setMaxLength(200)
                .setRequired(false))
            .addStringOption(option => option
                .setName("field-inline-3")
                .setDescription("Rendre ce champs aligné ou non.")
                .addChoices(
                    { name: "✅ Oui", value: "yes" },
                    { name: "❌ Non", value: "no" })
                .setRequired(false))
            .addStringOption(option => option
                .setName("field-name-4")
                .setDescription("Le nom du troisième champs.")
                .setMaxLength(75)
                .setRequired(false))
            .addStringOption(option => option
                .setName("field-value-4")
                .setDescription("La valeur du troisième champs.")
                .setMaxLength(200)
                .setRequired(false))
            .addStringOption(option => option
                .setName("field-inline-4")
                .setDescription("Rendre ce champs aligné ou non.")
                .addChoices(
                    { name: "✅ Oui", value: "yes" },
                    { name: "❌ Non", value: "no" })
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
                .setName("timestamp")
                .setDescription("True affichera la date et l'heure en pied de page.")
                .addChoices(
                    { name: "✅ Oui", value: "yes" },
                    { name: "❌ Non", value: "no" })
                .setRequired(false))
            .addStringOption(option => option
                .setName("footer")
                .setDescription("Le texte en pied de page.")
                .setMaxLength(200)
                .setRequired(false))
            .addAttachmentOption(option => option
                .setName("footer-image")
                .setDescription("L'image en pied de page.")
                .setRequired(false))
            .addChannelOption(option => option
                .setName("channel")
                .setDescription("L'endroit où je dis le message (nécessite la permission administrateur).")
                .addChannelTypes(ChannelType.GuildText)
                .setRequired(false))),
    async execute(interaction, client) {
        try {
            const sayType = interaction.options.getSubcommand();
            const channelSay = interaction.options.getChannel("channel") ?? interaction.channel;

            if (sayType !== "embed" && sayType !== "nqn" && await hasValue(interaction.guild.id, "guilds", "anti-say")) {
                const antisayRole = await getValue(interaction.guild.id, "guilds", "anti-say-role");

                if (!interaction.member.roles.cache.some(role => role.id === antisayRole))
                    return await interaction.reply({ content: "❌ Cette fonctionalité est désactivée sur ce serveur !", flags: MessageFlags.Ephemeral });
            }

            if (channelSay !== interaction.channel && !interaction.member.permissions.has(PermissionsBitField.Flags.Administrator))
                return await interaction.reply({ content: "❌ Tu n'as pas la permission d'envoyer un message dans un salon spécifique !", flags: MessageFlags.Ephemeral });

            const emoteList = await getEmoteList();
            const rawMessage = interaction.options.getString("message") ?? "";
            const messageTypingSpeed = rawMessage.length * 5;
            let finalMessage = rawMessage;

            for (let i = 0; i < Object.keys(emoteList).length; i++) {
                finalMessage = finalMessage.replaceAll(Object.keys(emoteList)[i], Object.values(emoteList)[i]);
            }

            await interaction.reply({ content: "⏳ Laisse moi le temps de recopier le message...", flags: MessageFlags.Ephemeral });

            switch (sayType) {
                case "classic":
                    const messageTimeout = messageTypingSpeed > 5_000 ? 5_000 : messageTypingSpeed;

                    await channelSay.sendTyping();

                    setTimeout(async function () {
                        await channelSay.send({ content: finalMessage.replaceAll("@", "") });
                        await interaction.editReply({ content: `✅ Message envoyé ${channelSay === interaction.channel ? "!" : `dans <#${channelSay.id}> !`}`, flags: MessageFlags.Ephemeral });
                    }, messageTimeout);
                    break;

                case "embed":
                    if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageMessages))
                        return await interaction.reply({ content: "❌ Tu n'as pas la permisssion pour envoyer ce type de message !", flags: MessageFlags.Ephemeral });

                    let colorEmbed = interaction.options.getString("color") ?? [0, 0, 0];
                    const titleEmbed = interaction.options.getString("title");
                    let urlEmbed = interaction.options.getString("url");
                    const authorNameEmbed = interaction.options.getString("author-name");
                    const authorImageEmbed = interaction.options.getAttachment("author-image")?.url;
                    const authorURLEmbed = interaction.options.getString("author-url");
                    const descriptionEmbed = interaction.options.getString("description") ?? "‎";
                    const firstFieldNameEmbed = interaction.options.getString("field-name-1");
                    const firstFieldValueEmbed = interaction.options.getString("field-value-1");
                    const firstFieldInlineEmbed = interaction.options.getString("field-inline-1") === "no";
                    const secondFieldNameEmbed = interaction.options.getString("field-name-2");
                    const secondFieldValueEmbed = interaction.options.getString("field-value-2");
                    const secondFieldInlineEmbed = interaction.options.getString("field-inline-2") === "no";
                    const thirdFieldNameEmbed = interaction.options.getString("field-name-3");
                    const thirdFieldValueEmbed = interaction.options.getString("field-value-3");
                    const thirdFieldInlineEmbed = interaction.options.getString("field-inline-3") === "no";
                    const fourthFieldNameEmbed = interaction.options.getString("field-name-4");
                    const fourthFieldValueEmbed = interaction.options.getString("field-value-4");
                    const fourthFieldInlineEmbed = interaction.options.getString("field-inline-4") === "no";
                    const thumbnailEmbed = interaction.options.getAttachment("thumbnail")?.url;
                    const imageEmbed = interaction.options.getAttachment("image")?.url;
                    const hasTimestampEmbed = interaction.options.getString("timestamp") === "yes";
                    const footerEmbed = interaction.options.getString("footer");
                    const footerImageEmbed = interaction.options.getAttachment("footer-image")?.url;

                    if ((urlEmbed !== null && !(await isLink(urlEmbed))) || (authorURLEmbed !== null && !(await isLink(authorURLEmbed))))
                        return await interaction.editReply({ content: "❌ Au moins une URL est incorrecte !", flags: MessageFlags.Ephemeral });
                    if (String(colorEmbed).toLowerCase() === "random")
                        colorEmbed = `#${Math.floor(Math.random() * 16_777_215).toString(16)}`;
                    if (typeof titleEmbed === "undefined")
                        urlEmbed = "";

                    colorEmbed = Color(colorEmbed).rgb().array();

                    const embedEmbed = new EmbedBuilder()
                        .setColor(colorEmbed)
                        .setTitle(titleEmbed)
                        .setURL(urlEmbed)
                        .setAuthor({ name: authorNameEmbed, iconURL: authorImageEmbed, url: authorURLEmbed })
                        .setDescription(descriptionEmbed)
                        .setThumbnail(thumbnailEmbed)
                        .setImage(imageEmbed)
                        .setFooter({ text: footerEmbed, iconURL: footerImageEmbed });

                    if (firstFieldNameEmbed || firstFieldValueEmbed)
                        embedEmbed.addFields({ name: firstFieldNameEmbed ?? "‎", value: firstFieldValueEmbed ?? "‎", inline: firstFieldInlineEmbed });
                    if (secondFieldNameEmbed || secondFieldValueEmbed)
                        embedEmbed.addFields({ name: secondFieldNameEmbed ?? "‎", value: secondFieldValueEmbed ?? "‎", inline: secondFieldInlineEmbed });
                    if (thirdFieldNameEmbed || thirdFieldValueEmbed)
                        embedEmbed.addFields({ name: thirdFieldNameEmbed ?? "‎", value: thirdFieldValueEmbed ?? "‎", inline: thirdFieldInlineEmbed });
                    if (fourthFieldNameEmbed || fourthFieldValueEmbed)
                        embedEmbed.addFields({ name: fourthFieldNameEmbed ?? "‎", value: fourthFieldValueEmbed ?? "‎", inline: fourthFieldInlineEmbed });
                    if (hasTimestampEmbed)
                        embedEmbed.setTimestamp();

                    await channelSay.send({ embeds: [embedEmbed] });
                    await interaction.editReply({ content: `✅ Embed envoyé ${channelSay === interaction.channel ? "!" : `dans <#${channelSay.id}> !`}`, flags: MessageFlags.Ephemeral });
                    break;
            }
        } catch (error) {
            await sendError(interaction, client, error);
        }
    }
};