const { SlashCommandBuilder, EmbedBuilder, MessageFlags } = require("discord.js");
const { getValue, hasValue, updateValue } = require("../../../tools/database.js");
const { sendError } = require("../../../tools/error-catcher.js");
const { getCurrencySymbol, simplify } = require("../../../tools/modules.js");

module.exports = {
    category: "Jeux",
    data: new SlashCommandBuilder()
        .setName("bank")
        .setDescription("Tout ce qui concerne ton compte Foyllori.")
        .setIntegrationTypes([0])
        .setContexts([0])
        .addSubcommand(subcommand => subcommand
            .setName("account")
            .setDescription("Permet de voir ton compte Foyllori."))

        .addSubcommand(subcommand => subcommand
            .setName("money")
            .setDescription("Pour gérer l'argent sur ton compte Foyllori.")
            .addStringOption(option => option
                .setName("action")
                .setDescription("Que faire à la Foyllori ?")
                .addChoices(
                    { name: "📥 Déposer", value: "deposit" },
                    { name: "📤 Retirer", value: "withdraw" })
                .setRequired(true))
            .addIntegerOption(option => option
                .setName("amount")
                .setDescription("Le montant à déposer ou retirer.")
                .setMinValue(1)
                .setRequired(true))),
    async execute(interaction, client) {
        try {
            const userID = interaction.user.id;
            const capacityTier = await getValue(userID, "users", "bank-capacity");
            const maximumCapacity = 50_000 * (capacityTier + 1);

            if (!(await hasValue(userID, "users", "bank")))
                return await interaction.reply({ content: "❌ Tu dois d'abord avoir un compte Foyllori ! Pour cela, achète-le dans le magasin de Kerusuna !", flags: [MessageFlags.Ephemeral] });

            switch (interaction.options.getSubcommand()) {
                case "account":
                    const userTokiCoinsBank = await getValue(userID, "users", "bank-toki-coin");
                    const tokiCoinFoyllori = await simplify(userID, userTokiCoinsBank);

                    const inventoryEmbed = new EmbedBuilder()
                        .setColor([240, 204, 0])
                        .setTitle("Ton compte Foyllori")
                        .setDescription(`### Toki Coins stockés\n> **${tokiCoinFoyllori}** ${getCurrencySymbol("toki-coin")}\n\n### Capacité maximale\n> **${await simplify(userID, maximumCapacity)}** ${getCurrencySymbol("toki-coin")}\n\n`)
                        .setTimestamp()
                        .setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL({ extension: "png", size: 64 }) });

                    await interaction.reply({ embeds: [inventoryEmbed], flags: [MessageFlags.Ephemeral] });
                    break;

                case "money":
                    const action = interaction.options.getString("action");
                    let amount = interaction.options.getInteger("amount");

                    switch (action) {
                        case "deposit":
                            const userTokiCoins = await getValue(userID, "users", "toki-coin");
                            const bankTokiCoins = await getValue(userID, "users", "bank-toki-coin");

                            if (amount > userTokiCoins)
                                return await interaction.reply({ content: `❌ Tu n'as pas assez d'argent ! Il te manque ${await simplify(userID, amount - userTokiCoins)} ${getCurrencySymbol("toki-coin")} !`, flags: [MessageFlags.Ephemeral] });
                            if (bankTokiCoins >= maximumCapacity)
                                return await interaction.reply({ content: "❌ Ton compte Foyllori a atteint sa capacité maximale !", flags: [MessageFlags.Ephemeral] });
                            if (bankTokiCoins + amount > maximumCapacity)
                                amount = amount - ((bankTokiCoins + amount) - maximumCapacity);

                            const isFull = bankTokiCoins + amount >= maximumCapacity;

                            await updateValue(userID, "users", "toki-coin", -amount);
                            await updateValue(userID, "users", "bank-toki-coin", amount);

                            await interaction.reply({ content: `Tu as déposé ${await simplify(userID, amount)} ${getCurrencySymbol("toki-coin")} à ton compte Foyllori !${isFull ? "❌ Ton compte Foyllori a atteint sa capacité maximale ! Tu peux acheter plus d'espace dans le magasin de Kerusuna." : ""}`, flags: [MessageFlags.Ephemeral] });
                            break;

                        case "withdraw":
                            if (amount > await getValue(userID, "users", "bank-toki-coin"))
                                return await interaction.reply({ content: "❌ Tu n'as pas assez d'argent dans ton compte Foyllori !", flags: [MessageFlags.Ephemeral] });

                            await updateValue(userID, "users", "toki-coin", amount);
                            await updateValue(userID, "users", "bank-toki-coin", -amount);

                            await interaction.reply({ content: `Tu as retiré ${await simplify(userID, amount)} ${getCurrencySymbol("toki-coin")} de la Foyllori !`, flags: [MessageFlags.Ephemeral] });
                            break;
                    }
                    break;
            }
        } catch (error) {
            await sendError(interaction, client, error);
        }
    }
};