const { EmbedBuilder, ModalBuilder, LabelBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder, MessageFlags } = require("discord.js");
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
            const itemDetails = menuCurrentValue.split("_");
            const itemID = itemDetails[0];
            const itemIsUnique = itemDetails[1];
            const itemPrice = itemDetails[2];
            const itemCurrency = itemDetails[3];
            const itemFullName = itemDetails[4];
            const shopName = itemDetails[5];
            const isItemUpgrade = itemID.includes("upgrade");
            const itemUpgradeBaseName = itemID.split("-upgrade")[0];
            const userID = interaction.user.id;
            const hasItem = itemID === "ping" ? false : isItemUpgrade ? await getValue(userID, "users", itemUpgradeBaseName) > 1 : await hasValue(userID, "users", itemID);

            if (itemIsUnique === "unique") {
                const itemCurrencySymbol = getCurrencySymbol(itemCurrency);
                const userMoney = await getValue(userID, "users", itemCurrency);

                if (hasItem)
                    return await interaction.reply({ content: "🧾 Tu l'as déjà acheté !", flags: [MessageFlags.Ephemeral] });
                if (itemPrice > userMoney)
                    return await interaction.reply({ content: `💰 Tu n'as pas assez d'argent ! Il te manque **${await simplify(userID, itemPrice - userMoney)}** ${itemCurrencySymbol} !`, flags: [MessageFlags.Ephemeral] });
                if (isItemUpgrade && !(await hasValue(userID, "users", itemUpgradeBaseName)))
                    return await interaction.reply({ content: "🛠️ Tu as besoin de l'outil de base afin de pour pouvoir acheter son amélioration !", flags: [MessageFlags.Ephemeral] });

                await updateValue(userID, "users", itemCurrency, -itemPrice);
                await updateValue(userID, "users", isItemUpgrade ? itemUpgradeBaseName : itemID, 1);

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

                const itemName = itemFullName.split(" ").slice(1).join(" ");
                const itemNameDeterminer = itemFullName.split(" ")[0];

                return await interaction.followUp({ content: `✅ Tu as bien acheté ${itemNameDeterminer} \`${itemName}\` pour ${await simplify(userID, itemPrice)} ${itemCurrencySymbol} !`, flags: [MessageFlags.Ephemeral] });
            } else {
                if (transactionType === "sell" && !hasItem)
                    return await interaction.reply({ content: "📦 Tu n'as pas cet objet, par conséquent, tu ne peux pas le vendre !", flags: [MessageFlags.Ephemeral] });

                let modal;

                if (itemID === "change-team") {
                    const userCookies = await getValue(userID, "users", "cookie");

                    if (itemPrice > userCookies)
                        return await interaction.reply({ content: `💰 Tu n'as pas assez d'argent ! Il te manque **${await simplify(userID, itemPrice - userCookies)}** ${getCurrencySymbol("cookie")} !`, flags: [MessageFlags.Ephemeral] });

                    modal = new ModalBuilder()
                        .setTitle("🔁 Transfert vers une autre équipe")
                        .setCustomId(`change-team_${itemPrice}`);

                    const newTeamComponent = new StringSelectMenuBuilder()
                        .setPlaceholder("La nouvelle équipe...")
                        .addOptions(
                            new StringSelectMenuOptionBuilder()
                                .setLabel("🍧 Graniti")
                                .setValue("1"),
                            new StringSelectMenuOptionBuilder()
                                .setLabel("🫑 Pimentes")
                                .setValue("2"),
                            new StringSelectMenuOptionBuilder()
                                .setLabel("🌿 Mentis")
                                .setValue("3"),
                            new StringSelectMenuOptionBuilder()
                                .setLabel("🍄 Champiture")
                                .setValue("4"))
                        .setRequired(true)
                        .setCustomId("change-team-flag");

                    const newTeamLabel = new LabelBuilder()
                        .setLabel("Quelle sera ta nouvelle équipe ?")
                        .setStringSelectMenuComponent(newTeamComponent);

                    modal.addLabelComponents(newTeamLabel);
                } else {
                    modal = new ModalBuilder()
                        .setTitle("⚖️ Quantité")
                        .setCustomId(`transaction_${transactionType}_${itemID}_${itemPrice}_${itemCurrency}_${itemFullName}`);

                    const quantityComponent = new TextInputBuilder()
                        .setPlaceholder("La quantité désirée...")
                        .setStyle(TextInputStyle.Short)
                        .setRequired(true)
                        .setCustomId("transaction-amount");

                    const quantityLabel = new LabelBuilder()
                        .setLabel(transactionType === "buy" ? "Quelle quantité veux-tu acheter ?" : "Quelle quantité veux-tu vendre ?")
                        .setTextInputComponent(quantityComponent);

                    modal.addLabelComponents(quantityLabel);
                }

                await interaction.showModal(modal);
            }
        } catch (error) {
            await sendError(interaction, client, error);
        }
    }
};