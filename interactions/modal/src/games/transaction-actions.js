const { MessageFlags } = require("discord.js");
const { getValue, updateValue } = require("../../../../tools/database.js");
const { sendError } = require("../../../../tools/error-catcher.js");
const { getCurrencySymbol, simplify } = require("../../../../tools/modules.js");

module.exports = {
    async execute(interaction, client) {
        try {
            const modalOptions = interaction.customId.split("_");
            const amount = Number(interaction.fields.getTextInputValue("transaction-amount"));
            const userID = interaction.user.id;
            const transactionType = modalOptions[1];
            const itemID = modalOptions[2];
            const itemPrice = Number(modalOptions[3]) * amount;
            const itemCurrency = modalOptions[4];
            const itemCurrencySymbol = getCurrencySymbol(itemCurrency);
            const itemName = modalOptions[5].split(" ").slice(1).join(" ");
            const itemNameDeterminer = amount === 1 ? modalOptions[5].split(" ")[0] : "";

            if (isNaN(amount) || !isFinite(amount) || amount <= 0 || amount !== Math.round(amount))
                return await interaction.reply({ content: "❌ Met un nombre entier strictement supérieur à 0 !", flags: [MessageFlags.Ephemeral] });
            if (itemID === "ping" && amount > 9)
                return await interaction.reply({ content: "❌ Tu ne peux pas acheter plus de 9 fois cet objet !", flags: [MessageFlags.Ephemeral] });

            if (transactionType === "buy") {
                const userMoney = await getValue(userID, "users", itemCurrency);

                if (itemPrice > userMoney)
                    return await interaction.reply({ content: `💰 Tu n'as pas assez d'argent ! Il te manque **${await simplify(userID, itemPrice - userMoney)}** ${itemCurrencySymbol} !`, flags: [MessageFlags.Ephemeral] });

                if (itemID === "ping") {
                    for (let i = 0; i < amount; i++) {
                        const pingMessage = await client.users.send(userID, "Ping !");

                        await pingMessage.delete();
                    }
                } else {
                    await updateValue(userID, "users", itemCurrency, -itemPrice);
                    await updateValue(userID, "users", itemID, amount);
                }

                await interaction.reply({ content: `✅ Tu as bien acheté ${amount > 1 ? await simplify(userID, amount) : itemNameDeterminer} \`${itemName}\` pour ${await simplify(userID, itemPrice)} ${itemCurrencySymbol} !`, flags: [MessageFlags.Ephemeral] });
            } else {
                const userItemStock = await getValue(userID, "users", itemID);

                if (amount > userItemStock)
                    return await interaction.reply({ content: "📦️ Tu n'as pas assez d'exemplaires de l'objet !", flags: [MessageFlags.Ephemeral] });

                await updateValue(userID, "users", itemCurrency, itemPrice);
                await updateValue(userID, "users", itemID, -amount);

                await interaction.reply({ content: `🏷️ Tu as bien vendu ${amount > 1 ? await simplify(userID, amount) : itemNameDeterminer} \`${itemName}\` pour ${await simplify(userID, itemPrice)} ${itemCurrencySymbol} !`, flags: [MessageFlags.Ephemeral] });
            }
        } catch (error) {
            await sendError(interaction, client, error);
        }
    }
};