const { SlashCommandBuilder, MessageFlags } = require("discord.js");
const { tryAddingUserToDatabase, getValue, updateValue } = require("../../../tools/database.js");
const { sendError } = require("../../../tools/error-catcher.js");
const { getCurrencySymbol, simplify } = require("../../../tools/modules.js");

module.exports = {
    category: "Jeux",
    data: new SlashCommandBuilder()
        .setName("pay")
        .setDescription("Permet de donner de l'argent à quelqu'un.")
        .setIntegrationTypes([0])
        .setContexts([0])
        .addIntegerOption(option => option
            .setName("amount")
            .setDescription("Le montant à donner.")
            .setMinValue(1)
            .setRequired(true))
        .addUserOption(option => option
            .setName("user")
            .setDescription("L'utilisateur à qui donner de l'argent.")
            .setRequired(true)),
    async execute(interaction, client) {
        try {
            const amount = interaction.options.getInteger("amount");
            const userPay = interaction.options.getUser("user");
            const userID = interaction.user.id;
            const userTokiCoins = await getValue(interaction.user.id, "users", "toki-coin");

            if (userPay.bot)
                return await interaction.reply({ content: "❌ Tu ne peux pas donner de l'argent à un bot !", flags: MessageFlags.Ephemeral });
            if (amount > userTokiCoins)
                return await interaction.reply({ content: `❌ Tu n'as pas assez d'argent ! Il te manque ${await simplify(userID, amount - userTokiCoins)} ${getCurrencySymbol("toki-coin")} !`, flags: MessageFlags.Ephemeral });
            if (userID === userPay.id)
                return await interaction.reply({ content: "❌ Tu ne peux pas envoyer de l'argent à toi même !", flags: MessageFlags.Ephemeral });

            await tryAddingUserToDatabase(interaction, client, userPay.id, "users");
            await updateValue(userID, "users", "toki-coin", -amount);
            await updateValue(userPay.id, "users", "toki-coin", amount);

            await interaction.reply({ content: `<@${userID}> à donné ${await simplify(userID, amount)} ${getCurrencySymbol("toki-coin")} à <@${userPay.id}> !` });
        } catch (error) {
            await sendError(interaction, client, error);
        }
    }
};