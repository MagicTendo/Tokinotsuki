const { SlashCommandBuilder, PermissionsBitField, MessageFlags } = require("discord.js");
const { updateValue } = require("../../../tools/database.js");
const { sendError } = require("../../../tools/error-catcher.js");

module.exports = {
    category: "Serveur",
    data: new SlashCommandBuilder()
        .setName("backup-code")
        .setDescription("Permet d'avoir un code si tu as besoin de changer de compte, il sera régénéré si tu le redemandes.")
        .setDefaultMemberPermissions(PermissionsBitField.Flags.ViewAuditLog),
    async execute(interaction, client) {
        try {
            const letters = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];
            let code = "";

            for (let i = 0; i < 20; i++) {
                const randomLetter = i === 9 ? ":" : letters[Math.floor(Math.random() * letters.length)];

                code += randomLetter;
            }

            await updateValue("toki", "toki", interaction.user.id, code, false);

            await interaction.reply({ content: `🔐 Ton code est maintenant : **\`${code}\`** ! Pour rappel, si tu as besoin de changer de compte tout en gardant ton statut sur les serveurs de BakaTaida, donne lui ce code et le nom de ton ancien compte pour confirmer ton identité !`, flags: MessageFlags.Ephemeral });
        } catch (error) {
            await sendError(interaction, client, error);
        }
    }
};