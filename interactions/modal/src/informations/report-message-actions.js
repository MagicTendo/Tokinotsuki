const { MessageFlags } = require("discord.js");
const { sendError } = require("../../../../tools/error-catcher.js");

module.exports = {
    async execute(interaction, client) {
        try {
            const reason = interaction.fields.getTextInputValue("reason");
            const modalOptions = interaction.customId.split("_");
            const isDeny = modalOptions[1];
            const reportShortDescription = modalOptions[2];
            const userID = modalOptions[3];

            if (reason) {
                await client.users.cache.get(userID).send({ content: `Salut ! ${isDeny === "1" ? `Ton rapport (\`${reportShortDescription}\`) a été refusé pour la raison suivante :` : `Mon créateur a fait part d'une remarque sur ton rapport (\`${reportShortDescription}\`) :`}\n\`\`\`\n${reason}\n\`\`\`` });
                return await interaction.reply({ content: "✅ Raison envoyée !", flags: MessageFlags.Ephemeral });
            }

            await interaction.reply({ content: "❌ Aucune raison n'a été envoyée !", flags: MessageFlags.Ephemeral });
        } catch (error) {
            await sendError(interaction, client, error);
        }
    }
};