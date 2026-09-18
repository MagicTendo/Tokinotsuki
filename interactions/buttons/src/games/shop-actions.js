const { ActionRowBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, MessageFlags } = require("discord.js");
const { getValue, updateValue } = require("../../../../tools/database.js");
const { sendError } = require("../../../../tools/error-catcher.js");
const { shopToItemTable } = require("../../../../tools/items-table.js");
const { getCurrencySymbol, simplify } = require("../../../../tools/modules.js");
const { refreshShop } = require("../../../../tools/refresh-shop.js");

module.exports = {
    async execute(interaction, client) {
        try {
            const buttonContent = interaction.customId.split("_");
            const shopOption = buttonContent[1];
            const shopType = buttonContent[2];
            const userID = interaction.user.id;
            const messageComponents = interaction.message.components;

            switch (shopOption) {
                case "sell-all":
                    const sellAllButtons = new ActionRowBuilder().addComponents(
                        new ButtonBuilder()
                            .setEmoji({ name: "❓" })
                            .setLabel("Êtes-vous sûr de tout vouloir vendre ?")
                            .setStyle(ButtonStyle.Secondary)
                            .setDisabled(true)
                            .setCustomId("shop_sell-all-message"),
                        new ButtonBuilder()
                            .setEmoji({ name: "📦" })
                            .setLabel("Oui")
                            .setStyle(ButtonStyle.Danger)
                            .setCustomId(`shop_sell-all-confirm_${shopType}_${userID}`),
                        new ButtonBuilder()
                            .setEmoji({ name: "✖️" })
                            .setLabel("Non")
                            .setStyle(ButtonStyle.Primary)
                            .setCustomId(`shop_sell-all-deny_${shopType}_${userID}`));

                    messageComponents.pop();
                    messageComponents.push(sellAllButtons);

                    await interaction.update({ components: messageComponents });
                    break;

                case "sell-all-confirm":
                    const itemTable = shopToItemTable[shopType];
                    let tokiCoinSum = 0;
                    let cookieSum = 0;

                    for (let i = 0; i < Object.keys(itemTable).length; i++) {
                        const itemKey = Object.keys(itemTable)[i];
                        const item = itemTable[itemKey]["name"];
                        const userItem = await getValue(userID, "users", item);

                        if (userItem > 0) {
                            const itemPrice = Number(itemTable[itemKey]["price"]) * userItem;
                            const itemCurrency = itemTable[itemKey]["currency"] ?? "toki-coin";

                            itemCurrency === "toki-coin" ? tokiCoinSum += itemPrice : cookieSum += itemPrice;

                            await updateValue(userID, "users", item, 0, false);
                            await updateValue(userID, "users", itemCurrency, itemPrice);
                        }
                    }

                    const finalSumText = tokiCoinSum > 0 && cookieSum > 0 ? `${await simplify(userID, tokiCoinSum)} ${getCurrencySymbol("toki-coin")} et ${await simplify(userID, cookieSum)} ${getCurrencySymbol("cookie")}` : tokiCoinSum > 0 ? `${await simplify(userID, tokiCoinSum)} ${getCurrencySymbol("toki-coin")}` : `${await simplify(userID, cookieSum)} ${getCurrencySymbol("cookie")}`;
                    const shop = await refreshShop(shopToItemTable[shopType], userID, shopType, "sell");
                    const shopComponents = shop["components"];
                    const shopFields = shop["fields"];
                    const shopEmbed = new EmbedBuilder(interaction.message.embeds[0].data);

                    shopEmbed.setFields(shopFields);
                    shopEmbed.setImage(`attachment://${shopType}.png`)

                    const refreshedShopContent = { embeds: [shopEmbed], files: [`./assets/images/shops/${shopType}.png`], components: shopComponents };

                    await interaction.update(refreshedShopContent);
                    await interaction.followUp({ content: `✅ Tu as bien tout vendu pour ${finalSumText} !`, flags: [MessageFlags.Ephemeral] });
                    break;

                case "sell-all-deny":
                    const sellAllButton = new ActionRowBuilder().addComponents(
                        new ButtonBuilder()
                            .setEmoji({ name: "📦" })
                            .setLabel("Tout vendre")
                            .setStyle(ButtonStyle.Success)
                            .setCustomId(`shop_sell-all_${shopType}_${userID}`));

                    messageComponents.pop();
                    messageComponents.push(sellAllButton);

                    await interaction.update({ components: messageComponents });
                    break;
            }
        } catch (error) {
            await sendError(interaction, client, error);
        }
    }
};