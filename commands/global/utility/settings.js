const { SlashCommandBuilder, MessageFlags } = require("discord.js");
const { updateValue, deleteValue } = require("../../../tools/database.js");

module.exports = {
    category: "Utilitaire",
    data: new SlashCommandBuilder()
        .setName("settings")
        .setDescription("Permet de modifier mes paramètres !")
        .setIntegrationTypes([0, 1])
        .setContexts([0, 1, 2])
        .addSubcommand(subcommand => subcommand
            .setName("simplify")
            .setDescription("Simplifie l'écriture d'un nombre. Le désactiver donnera une valeur plus précise.")
            .addStringOption(option => option
                .setName("action")
                .setDescription("Choisis l'action à faire.")
                .addChoices(
                    { name: "✅ Activer (9,5k) [par défaut]", value: "activate" },
                    { name: "❌ Désactiver (9 500)", value: "desactivate" })
                .setRequired(true))),
    async execute(interaction, client) {
        try {
            const settingAction = interaction.options.getString("action");
            const userID = interaction.user.id;

            switch (interaction.options.getSubcommand()) {
                case "simplify":
                    if (settingAction === "activate") {
                        await deleteValue(userID, "users", "unsimplify");

                        await interaction.reply({ content: "✅ Le module `simplify` a bien été activé !", flags: [MessageFlags.Ephemeral] });
                    } else {
                        await updateValue(userID, "users", "unsimplify", 1, false);

                        await interaction.reply({ content: "❌ Le module `simplify` a bien été déactivé !", flags: [MessageFlags.Ephemeral] });
                    }
                    break;
            }
        } catch (error) {
            await sendError(interaction, client, error);
        }
    }
};