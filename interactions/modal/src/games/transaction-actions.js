const { MessageFlags } = require("discord.js");
const { getValue, updateValue } = require("../../../../tools/database.js");
const { sendError } = require("../../../../tools/error-catcher.js");
const { allBuyableTables, allSellableTables } = require("../../../../tools/items-table.js");
const { getCurrencySymbol, simplify } = require("../../../../tools/modules.js");

module.exports = {
    async execute(interaction, client) {
        try {
            function getItem(table, item, amount = 1) {
                const result = { "name": null, "price": null, "currency": null };

                for (let i = 0; i < table.length; i++) {
                    for (let j = 0; j < Object.values(table[i]).length; j++) {
                        if (Object.values(table[i])[j].name.split("|")[0] === item) {
                            result["name"] = Object.keys(table[i])[j].split("|")[2];
                            result["price"] = Object.values(table[i])[j].price * amount;
                            result["currency"] = Object.values(table[i])[j]?.currency ?? "toki-coin";

                            return result;
                        }
                    }
                }

                return result;
            }

            const amount = Number(interaction.fields.getTextInputValue("transaction-amount"));
            const modalOptions = interaction.customId.split("_");
            const transactionType = modalOptions[1];
            const item = modalOptions[2];
            const table = transactionType === "buy" ? allBuyableTables : allSellableTables;
            const userID = interaction.user.id;

            if (isNaN(amount) || !isFinite(amount) || amount <= 0 || amount !== Math.round(amount))
                return await interaction.reply({ content: "❌ Met un nombre entier strictement supérieur à 0 !", flags: MessageFlags.Ephemeral });
            if (item === "ping" && amount > 9)
                return await interaction.reply({ content: "❌ Tu ne peux pas acheter plus de 9 fois cet objet !", flags: MessageFlags.Ephemeral });

            const itemInformations = getItem(table, item, amount);
            const itemName = itemInformations["name"];

            if (itemName === null)
                return await sendError(interaction, client, `Objet ${item} inconnu dans la table ${table} ?`);

            let itemPrice = itemInformations["price"];
            const itemCurrency = itemInformations["currency"];
            const itemCurrencySymbol = getCurrencySymbol(itemCurrency);

            if (transactionType === "buy") {
                const userMoney = await getValue(userID, "users", itemCurrency);

                if (itemPrice > userMoney)
                    return await interaction.reply({ content: `💰 Tu n'as pas assez d'argent ! Il te manque **${await simplify(userID, itemPrice - userMoney)}** ${itemCurrencySymbol} !`, flags: MessageFlags.Ephemeral });

                if (item === "ping") {
                    for (let i = 0; i < amount; i++) {
                        const pingMessage = await client.users.send(userID, "Ping !");

                        await pingMessage.delete();
                    }
                } else {
                    await updateValue(userID, "users", itemCurrency, -itemPrice);
                    await updateValue(userID, "users", item, amount);
                }

                await interaction.reply({ content: `✅ Tu as bien acheté ${await simplify(userID, amount)} \`${itemName}\` pour ${await simplify(userID, itemPrice)} ${itemCurrencySymbol} !`, flags: MessageFlags.Ephemeral });
            } else {
                const userItemStock = await getValue(userID, "users", item);

                if (amount > userItemStock)
                    return await interaction.reply({ content: "📦️ Tu n'as pas assez d'exemplaires de l'objet !", flags: MessageFlags.Ephemeral });

                await updateValue(userID, "users", itemCurrency, itemPrice);
                await updateValue(userID, "users", item, -amount);

                await interaction.reply({ content: `🏷️ Tu as bien vendu ${await simplify(userID, amount)} \`${itemName}\` pour ${await simplify(userID, itemPrice)} ${itemCurrencySymbol} !`, flags: MessageFlags.Ephemeral });
            }
        } catch (error) {
            await sendError(interaction, client, error);
        }
    }
};