const { SlashCommandBuilder, MessageFlags } = require("discord.js");
const translate = require("@iamtraction/google-translate");
const { sendError } = require("../../../tools/error-catcher.js");

module.exports = {
    category: "Utilitaire",
    data: new SlashCommandBuilder()
        .setName("translate")
        .setDescription("Pour traduire un texte dans une autre langue !")
        .setIntegrationTypes([0, 1])
        .setContexts([0, 1, 2])
        .addStringOption(option => option
            .setName("text")
            .setDescription("Le texte à traduire.")
            .setRequired(true))
        .addStringOption(option => option
            .setName("language")
            .setDescription("La langue dans laquelle traduire.")
            .addChoices(
                { name: "🪘 Afrikaans", value: "af" },
                { name: "🍵 Anglais", value: "en" },
                { name: "🥨 Allemand", value: "de" },
                { name: "🐪 Arabe", value: "ar" },
                { name: "🥡 Chinois simplifié", value: "zh-cn" },
                { name: "🏮 Chinois traditionnel", value: "zh-tw" },
                { name: "🎐 Coréen", value: "ko" },
                { name: "🥘 Espagnol", value: "es" },
                { name: "🥗 Esperanto", value: "eo" },
                { name: "🪨 Estonien", value: "et" },
                { name: "🥖 Français", value: "fr" },
                { name: "🔱 Grec", value: "el" },
                { name: "🍝 Italien", value: "it" },
                { name: "🍙 Japonais", value: "ja" },
                { name: "📜 Latin", value: "la" },
                { name: "🌷 Néerlandais", value: "nl" },
                { name: "🥟 Polonais", value: "pl" },
                { name: "☕ Portugais", value: "pt" },
                { name: "🐻 Russe", value: "ru" },
                { name: "⛄ Suédois", value: "sv" },
                { name: "🌻 Ukrainien", value: "uk" },
                { name: "🪷 Vietnamien", value: "vi" })
            .setRequired(true)),
    async execute(interaction, client) {
        try {
            await interaction.deferReply({ flags: MessageFlags.Ephemeral });

            const text = interaction.options.getString("text");
            const language = interaction.options.getString("language");

            await translate(text, { to: language }).then(async translation => {
                await interaction.editReply({ content: translation.text });
            }).catch(async error => {
                await sendError(interaction, client, error);
            });
        } catch (error) {
            await sendError(interaction, client, error);
        }
    }
};