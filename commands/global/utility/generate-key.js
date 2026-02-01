const { SlashCommandBuilder, MessageFlags } = require("discord.js");
const { sendError } = require("../../../tools/error-catcher.js");

module.exports = {
    category: "Utilitaire",
    data: new SlashCommandBuilder()
        .setName("generate-key")
        .setDescription("Génère une clé sécurisée aléatoire avec une longueur personalisable.")
        .setIntegrationTypes([0, 1])
        .setContexts([0, 1, 2])
        .addIntegerOption(option => option
            .setName("length")
            .setDescription("La longueur de la clé.")
            .setMinValue(1)
            .setMaxValue(1_500)
            .setRequired(true)),
    async execute(interaction, client) {
        try {
            const length = interaction.options.getInteger("length");
            const characters = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "&", "~", "#", "'", "-", "|", "_", "/", "\\", "@", "+", "*", "=", ",", ".", ":", ";", "!", "?", "§"];
            const key = [];

            for (let i = 0; i < length; i++) {
                const character = Math.floor(Math.random() * characters.length);

                key.push(characters[character]);
            }

            await interaction.reply({ content: `\`${key.join("")}\``, flags: MessageFlags.Ephemeral });
        } catch (error) {
            await sendError(interaction, client, error);
        }
    }
};