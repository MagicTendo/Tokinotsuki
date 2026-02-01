const { SlashCommandBuilder, MessageFlags } = require("discord.js");
const { sendError } = require("../../../tools/error-catcher.js");

module.exports = {
    category: "Utilitaire",
    data: new SlashCommandBuilder()
        .setName("grab")
        .setDescription("Permet de récupérer des émojis, des stickers et des sons.")
        .setIntegrationTypes([0, 1])
        .setContexts([0, 1, 2])
        .addSubcommand(subcommand => subcommand
            .setName("emoji")
            .setDescription("Permet de récupérer l'image d'un émoji.")
            .addStringOption(option => option
                .setName("emoji-id")
                .setDescription("L'émoji ou son identifiant à récupérer. Active le mode développeur sur ton compte pour le copier !")
                .setRequired(true))
            .addStringOption(option => option
                .setName("is-animated")
                .setDescription("Est-ce que l'émoji est animé ?")
                .addChoices(
                    { name: "✅ Oui", value: "yes" },
                    { name: "❌ Non", value: "no" })
                .setRequired(false)))

        .addSubcommand(subcommand => subcommand
            .setName("sound")
            .setDescription("Permet de récupérer l'audio d'un son.")
            .addStringOption(option => option
                .setName("sound-id")
                .setDescription("L'identifiant du son. Active le mode développeur sur ton compte pour le copier !")
                .setRequired(true)))

        .addSubcommand(subcommand => subcommand
            .setName("sticker")
            .setDescription("Permet de récupérer l'image d'un sticker.")
            .addStringOption(option => option
                .setName("sticker-id")
                .setDescription("L'identifiant du sticker à récupérer. Active le mode développeur sur ton compte pour le copier !")
                .setRequired(true))),
    async execute(interaction, client) {
        try {
            switch (interaction.options.getSubcommand()) {
                case "emoji":
                    async function getEmojiURL(id, isAnimated) {
                        const link = `https://cdn.discordapp.com/emojis/${id}.${isAnimated === "yes" ? "gif" : "png"}?size=4096`;
                        const attempt = await fetch(link);

                        if (attempt.status === 200)
                            return link;

                        return null;
                    }

                    const emojiID = interaction.options.getString("emoji-id");
                    const isAnimated = interaction.options.getString("is-animated");
                    const emojiURL = await getEmojiURL(emojiID, isAnimated);

                    if (emojiURL === null)
                        return await interaction.reply({ content: "❌ Mets un seul vrai ID d'émoji !", flags: MessageFlags.Ephemeral });

                    await interaction.reply({ content: emojiURL, flags: MessageFlags.Ephemeral });
                    break;

                case "sticker":
                    async function getStickerURL(id) {
                        const firstLink = `https://cdn.discordapp.com/stickers/${id}.png?size=4096`;
                        const firstAttempt = await fetch(firstLink);

                        if (firstAttempt.status === 200)
                            return firstLink;

                        const secondLink = `https://media.discordapp.net/stickers/${id}.png?size=4096`;
                        const secondAttempt = await fetch(secondLink);

                        if (secondAttempt.status === 200)
                            return secondLink;

                        return null;
                    }

                    const stickerID = interaction.options.getString("sticker-id");
                    const stickerURL = await getStickerURL(stickerID);

                    if (stickerURL === null)
                        return await interaction.reply({ content: "❌ Mets un seul vrai ID de sticker ! Si l'identifiant est bien correct, alors c'est un sticker officiel de Discord qui ne peut pas être récupéré !", flags: MessageFlags.Ephemeral });

                    await interaction.reply({ content: `${stickerURL}\n\n-# Si le sticker est censé être animé et qu'il ne bouge pas, c'est normal, ce n'est pas un PNG mais un APNG, [convertissez-le en GIF](<https://ezgif.com/apng-to-gif>) et ça sera bon !`, flags: MessageFlags.Ephemeral });
                    break;

                case "sound":
                    async function getSoundURL(id) {
                        const link = `https://cdn.discordapp.com/soundboard-sounds/${id}`;
                        const attempt = await fetch(link);

                        if (attempt.status === 200)
                            return link;

                        return null;
                    }

                    const soundID = interaction.options.getString("sound-id");
                    const soundURL = await getSoundURL(soundID);

                    if (soundURL === null)
                        return await interaction.reply({ content: "❌ Mets un seul vrai ID de son !", flags: MessageFlags.Ephemeral });

                    await interaction.reply({ content: soundURL, flags: MessageFlags.Ephemeral });
                    break;
            }
        } catch (error) {
            await sendError(interaction, client, error);
        }
    }
};