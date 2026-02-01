const { EmbedBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder, MessageFlags } = require("discord.js");
const { getValue, hasValue, updateValue } = require("../../../../tools/database.js");
const { sendError } = require("../../../../tools/error-catcher.js");
const { shopToItemTable } = require("../../../../tools/items-table.js");
const { getCurrencySymbol, simplify } = require("../../../../tools/modules.js");
const { refreshShop } = require("../../../../tools/refresh-shop.js");
module.exports = {
    async execute(interaction, client) {
        try {
            const transactionType = interaction.customId.split("_")[1];
            const menuCurrentValue = interaction.values[0];
            const selectedItem = menuCurrentValue.split("_")[0];
            const itemUniqueDetails = menuCurrentValue.split("_")[1];
            const shopName = menuCurrentValue.split("_")[2];
            const itemUnique = itemUniqueDetails?.split("|")[0];
            const isItemUpgrade = selectedItem.includes("upgrade");
            const itemUpgradeBaseName = selectedItem.split("-upgrade")[0];
            const userID = interaction.user.id;
            const hasItem = selectedItem === "ping" ? false : isItemUpgrade ? await getValue(userID, "users", itemUpgradeBaseName) > 1 : await hasValue(userID, "users", selectedItem);

            if (itemUnique === "unique") {
                const uniqueItemPrice = itemUniqueDetails.split("|")[1];
                const uniqueItemCurrency = itemUniqueDetails.split("|")[2];
                const itemName = itemUniqueDetails.split("|")[3];
                const itemCurrencySymbol = getCurrencySymbol(uniqueItemCurrency);
                const userMoney = await getValue(userID, "users", uniqueItemCurrency);

                if (hasItem)
                    return await interaction.reply({ content: "🧾 Tu l'as déjà acheté !", flags: MessageFlags.Ephemeral });
                if (uniqueItemPrice > userMoney)
                    return await interaction.reply({ content: `💰 Tu n'as pas assez d'argent ! Il te manque **${await simplify(userID, uniqueItemPrice - userMoney)}** ${itemCurrencySymbol} !`, flags: MessageFlags.Ephemeral });
                if (isItemUpgrade && !(await hasValue(userID, "users", itemUpgradeBaseName)))
                    return await interaction.reply({ content: "🛠️ Tu as besoin de l'outil de base afin de pour pouvoir acheter son amélioration !", flags: MessageFlags.Ephemeral });

                await updateValue(userID, "users", uniqueItemCurrency, -uniqueItemPrice);
                await updateValue(userID, "users", isItemUpgrade ? itemUpgradeBaseName : selectedItem, 1);

                const shop = await refreshShop(shopToItemTable[shopName], userID, shopName, transactionType);
                const shopComponents = shop["components"];

                if (shopComponents.length !== 0) {
                    const shopFields = shop["fields"];
                    const shopEmbed = new EmbedBuilder(interaction.message.embeds[0].data);

                    shopEmbed.setFields(shopFields);
                    shopEmbed.setImage(`attachment://${shopName}.png`)

                    const refreshedShopContent = { embeds: [shopEmbed], files: [`./assets/images/shops/${shopName}.png`], components: shopComponents };

                    interaction.replied ? await interaction.editReply(refreshedShopContent) : await interaction.update(refreshedShopContent);
                } else {
                    const closedMessageContent = { content: "🏪 Tu as tout acheté dans ce magasin !", embeds: [], files: [], components: [] };

                    interaction.replied ? await interaction.editReply(closedMessageContent) : await interaction.update(closedMessageContent);
                }

                return await interaction.followUp({ content: `✅ Tu as bien acheté ${itemName} pour ${await simplify(userID, uniqueItemPrice)} ${itemCurrencySymbol} !`, flags: MessageFlags.Ephemeral });
            } else {
                if (transactionType === "sell" && !hasItem)
                    return await interaction.reply({ content: "📦 Tu n'as pas cet objet, par conséquent, tu ne peux pas le vendre !", flags: MessageFlags.Ephemeral });

                const transactionModal = new ModalBuilder()
                    .setTitle("⚖️ Quantité")
                    .setCustomId(`transaction_${transactionType}_${selectedItem}`);

                const transactionAmountInput = new TextInputBuilder()
                    .setLabel(transactionType === "buy" ? "Quelle quantité veux-tu acheter ?" : "Quelle quantité veux-tu vendre ?")
                    .setStyle(TextInputStyle.Short)
                    .setCustomId(`transaction-amount`);

                const transactionModalActionRow = new ActionRowBuilder().addComponents(transactionAmountInput);

                transactionModal.addComponents(transactionModalActionRow);

                await interaction.showModal(transactionModal);
            }
        } catch (error) {
            await sendError(interaction, client, error);
        }
    }
};