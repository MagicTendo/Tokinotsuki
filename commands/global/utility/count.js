const { SlashCommandBuilder, MessageFlags } = require("discord.js");
const { sendError } = require("../../../tools/error-catcher.js");

module.exports = {
    category: "Utilitaire",
    data: new SlashCommandBuilder()
        .setName("count")
        .setDescription("Tout ce qui est en rapport avec le fait de compter.")
        .setIntegrationTypes([0, 1])
        .setContexts([0, 1, 2])
        .addSubcommand(subcommand => subcommand
            .setName("characters")
            .setDescription("Pour compter le nombre de caractères dans une phrase.")
            .addStringOption(option => option
                .setName("text")
                .setDescription("Le texte à compter.")
                .setRequired(true)))

        .addSubcommand(subcommand => subcommand
            .setName("pattern")
            .setDescription("Pour compter le nombre de fois qu'un caractère ou mot est répété.")
            .addStringOption(option => option
                .setName("text")
                .setDescription("Le texte à compter.")
                .setRequired(true))
            .addStringOption(option => option
                .setName("pattern")
                .setDescription("Le caractère ou mot à compter.")
                .setRequired(true)))

        .addSubcommand(subcommand => subcommand
            .setName("words")
            .setDescription("Pour compter le nombre de mots dans une phrase.")
            .addStringOption(option => option
                .setName("text")
                .setDescription("Le texte à compter.")
                .setRequired(true))),
    async execute(interaction, client) {
        try {
            const text = interaction.options.getString("text");

            switch (interaction.options.getSubcommand()) {
                case "characters":
                    const characterCount = text.length;

                    await interaction.reply({ content: `Il y a **${characterCount}** caractère(s) !`, flags: [MessageFlags.Ephemeral] });
                    break;

                case "pattern":
                    const pattern = interaction.options.getString("pattern");
                    const regexExpression = new RegExp(pattern, "g");
                    const patternCount = text.match(regexExpression)?.length ?? 0

                    await interaction.reply({ content: `\`${pattern}\` est répété **${patternCount}** fois !`, flags: [MessageFlags.Ephemeral] });
                    break;

                case "words":
                    const wordCount = text.split(" ").length;

                    await interaction.reply({ content: `Il y a **${wordCount}** mot(s) !`, flags: [MessageFlags.Ephemeral] });
                    break;
            }
        } catch (error) {
            await sendError(interaction, client, error);
        }
    }
};