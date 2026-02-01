const { SlashCommandBuilder, AttachmentBuilder, MessageFlags } = require("discord.js");
const { getDictionary } = require("simple-spellchecker");
const { sendError } = require("../../../tools/error-catcher.js");

module.exports = {
    category: "Utilitaire",
    data: new SlashCommandBuilder()
        .setName("spellcheck")
        .setDescription("Vérifie si une phrase est bien orthographiée. Cele ne vérifie pas la grammaire !")
        .setIntegrationTypes([0, 1])
        .setContexts([0, 1, 2])
        .addStringOption(option => option
            .setName("sentence")
            .setDescription("La phrase à corriger.")
            .setMaxLength(1_000)
            .setRequired(true))
        .addStringOption(option => option
            .setName("language")
            .setDescription("La langue de la phrase.")
            .addChoices(
                { name: "🦅 Anglais d'Amérique", value: "en-US" },
                { name: "🍵 Anglais d'Angleterre", value: "en-GB" },
                { name: "🥨 Allemand", value: "de-DE" },
                { name: "🥘 Espagnol d'Espagne", value: "es-ES" },
                { name: "🌵 Espagnol du Mexique", value: "es-MX" },
                { name: "🥖 Français", value: "fr-FR" },
                { name: "🍝 Italien", value: "it-IT" },
                { name: "🌷 Néerlandais", value: "nl-NL" },
                { name: "🥟 Polonais", value: "pl-PL" },
                { name: "☕ Portugais du Brésil", value: "pt-BR" },
                { name: "🐻 Russe", value: "ru-RU" },
                { name: "⛄ Suédois", value: "sv-SE" },
                { name: "🌻 Ukrainien", value: "uk-UA" })
            .setRequired(false)),
    async execute(interaction, client) {
        try {
            const sentence = interaction.options.getString("sentence");
            const language = interaction.options.getString("language") ?? "fr-FR";
            const words = sentence.replace(/ {2,}/g, " ").replace(/[^\w\s']/g, "").trim().split(" ");
            let suggestions = "";
            let errors = 0;

            getDictionary(language, async function (error, dictionary) {
                if (error)
                    await sendError(interaction, client, error);

                for (let i = 0; i < words.length; i++) {
                    const word = words[i];
                    const misspelled = !dictionary.spellCheck(word);

                    if (misspelled) {
                        const suggestionsArray = dictionary.getSuggestions(word);

                        suggestions += `${word} => ${suggestionsArray.length === 0 ? "???" : suggestionsArray.join(", ")}\n`;
                        errors += 1;
                    }
                }

                if (errors === 0)
                    return await interaction.reply({ content: `> ${sentence}\nAucune erreur n'a été trouvée !`, flags: MessageFlags.Ephemeral });

                const spellcheck = `> ${sentence}\n**${errors}** erreur(s) trouvée(s) !\n\n${suggestions}`;

                if (spellcheck.length > 2000) {
                    const spellcheckFile = new AttachmentBuilder(new Buffer.from(suggestions), { name: "spellcheck.txt" });

                    await interaction.reply({ content: `> ${sentence}\n**${errors}** erreur(s) trouvée(s) !\n\n-# *La réponse est trop longue et a été mise dans un fichier texte !*`, files: [spellcheckFile], flags: MessageFlags.Ephemeral });
                } else {
                    await interaction.reply({ content: spellcheck, flags: MessageFlags.Ephemeral });
                }
            });
        } catch (error) {
            await sendError(interaction, client, error);
        }
    }
};