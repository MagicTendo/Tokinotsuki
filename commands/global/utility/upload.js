const { SlashCommandBuilder, PermissionsBitField, MessageFlags } = require("discord.js");
const { sendError } = require("../../../tools/error-catcher.js");

module.exports = {
    category: "Utilitaire",
    data: new SlashCommandBuilder()
        .setName("upload")
        .setDescription("Pour ajouter des émojis, stickers et sons sur un serveur !")
        .setDefaultMemberPermissions(PermissionsBitField.Flags.ManageGuildExpressions)
        .setIntegrationTypes([0])
        .setContexts([0])
        .addSubcommand(subcommand => subcommand
            .setName("emoji")
            .setDescription("Permet d'ajouter un émoji sur le serveur.")
            .addAttachmentOption(option => option
                .setName("file")
                .setDescription("L'image de l'émoji.")
                .setRequired(true))
            .addStringOption(option => option
                .setName("name")
                .setDescription("Le nom de l'émoji.")
                .setMinLength(2)
                .setMaxLength(32)
                .setRequired(true)))

        .addSubcommand(subcommand => subcommand
            .setName("sound")
            .setDescription("Permet d'ajouter un son sur le serveur.")
            .addAttachmentOption(option => option
                .setName("file")
                .setDescription("L'audio du son.")
                .setRequired(true))
            .addStringOption(option => option
                .setName("name")
                .setDescription("Le nom du son.")
                .setMinLength(2)
                .setMaxLength(32)
                .setRequired(true))
            .addStringOption(option => option
                .setName("emoji")
                .setDescription("L'émoji du son.")
                .setMinLength(1)
                .setRequired(true))
            .addIntegerOption(option => option
                .setName("volume")
                .setDescription("Le volume de base du son.")
                .setMinValue(0)
                .setMaxValue(100)
                .setRequired(false)))

        .addSubcommand(subcommand => subcommand
            .setName("sticker")
            .setDescription("Permet d'ajouter un sticker sur le serveur.")
            .addAttachmentOption(option => option
                .setName("file")
                .setDescription("L'image du sticker.")
                .setRequired(true))
            .addStringOption(option => option
                .setName("name")
                .setDescription("Le nom du sticker.")
                .setMinLength(2)
                .setMaxLength(30)
                .setRequired(true))
            .addStringOption(option => option
                .setName("tags")
                .setDescription("Les étiquettes du sticker pour l'identifier (mots, séparés, par, une, virgule).")
                .setRequired(true))
            .addStringOption(option => option
                .setName("description")
                .setDescription("La description du sticker.")
                .setMinLength(2)
                .setMaxLength(100)
                .setRequired(false))),
    async execute(interaction, client) {
        try {
            if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageGuildExpressions))
                return await interaction.reply({ content: "❌ Tu n'as pas la permission de gérer les expressions !", flags: [MessageFlags.Ephemeral] });
            if (!interaction.guild.members.me.permissions.has(PermissionsBitField.Flags.ManageGuildExpressions))
                return await interaction.reply({ content: "❌ Je n'ai pas la permission de gérer les expressions !", flags: [MessageFlags.Ephemeral] });

            await interaction.deferReply();

            const expressionFile = interaction.options.getAttachment("file");
            const expressionFileResponse = await fetch(expressionFile.attachment);
            const expressionFileArrayBuffer = await expressionFileResponse.arrayBuffer();
            const expressionFileBuffer = new Buffer.from(expressionFileArrayBuffer);
            const expressionName = interaction.options.getString("name");

            switch (interaction.options.getSubcommand()) {
                case "emoji":
                    await interaction.guild.emojis.create({ attachment: expressionFileBuffer, name: expressionName })
                        .then(async emoji => await interaction.editReply({ content: `L'émoji \`${emoji.name}\` a bien été ajouté ! <:${emoji.name}:${emoji.id}>` }))
                        .catch(async () => await interaction.editReply({ content: "Impossible d'ajouter cet émoji ! Vérifie le format (.png, .gif) le poids du fichier(< 256Ko), ainsi que le format du nom (alphanumérique et tirets bas uniquement) et si tu peux encore en ajouter un !" }));
                    break;

                case "sticker":
                    const stickerTags = interaction.options.getString("tags");
                    const stickerDescription = interaction.options.getString("description") ?? "";

                    await interaction.guild.stickers.create({ file: expressionFileBuffer, name: expressionName, tags: stickerTags, description: stickerDescription })
                        .then(async sticker => await interaction.editReply({ content: `Le sticker \`${sticker.name}\` a bien été ajouté !` }))
                        .catch(async () => await interaction.editReply({ content: "Impossible d'ajouter ce sticker ! Vérifie le format (.png, .gif) le poids du fichier (< 512Ko), ainsi que le format du nom, de la description et si tu peux encore en ajouter un !" }));
                    break;

                case "sound":
                    const soundEmoji = interaction.options.getString("emoji");
                    const soundVolume = interaction.options.getInteger("volume") ?? 100;

                    await interaction.guild.soundboardSounds.create({ file: expressionFileBuffer, name: expressionName, emojiName: soundEmoji, volume: soundVolume / 100 })
                        .then(async sound => await interaction.editReply({ content: `Le son \`${sound.name}\` a bien été ajouté !` }))
                        .catch(async () => await interaction.editReply({ content: "Impossible d'ajouter ce son ! Vérifie le format (.ogg), la longueur (<= 5s) le poids du fichier (< 512Ko), ainsi que le format du nom et si tu peux encore en ajouter un !" }));
                    break;
            }
        } catch (error) {
            await sendError(interaction, client, error);
        }
    }
};