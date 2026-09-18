const { ActionRowBuilder, StringSelectMenuBuilder } = require("discord.js");
const { hasValue, getValue } = require("./database.js");
const { fakeItems } = require("./items-table.js");
const { capitalize, getCurrencySymbol, simplify } = require("./modules.js");

async function refreshShop(itemTable, userID, shopType, mode) {
    const embedFields = [];
    const menuComponents = [];
    let canSellAll = false;

    const shopMenuBuy = new ActionRowBuilder().addComponents(
        new StringSelectMenuBuilder()
            .setPlaceholder("🛍️ Objets à acheter")
            .setCustomId("shop_buy_0"));

    const shopMenuSell = new ActionRowBuilder().addComponents(
        new StringSelectMenuBuilder()
            .setPlaceholder("🏷️ Objets à vendre")
            .setCustomId("shop_sell_0"));

    for (let i = 0; i < Object.keys(itemTable).length; i++) {
        const itemKey = Object.keys(itemTable)[i];
        const itemSeperatedName = itemKey.split("|");
        const item = itemTable[itemKey];
        const itemPrice = item["price"];
        const itemID = item["name"];
        const isItemUnique = item["unique"] ?? false;

        if (fakeItems.includes(itemID) || (isItemUnique && (itemID.includes("upgrade") ? await getValue(userID, "users", itemID.slice(0, -8)) > 1 : await hasValue(userID, "users", itemID))))
            continue;

        const itemPresentationName = capitalize(itemSeperatedName[2]);
        const itemName = `${itemSeperatedName[0].toLowerCase()} ${itemSeperatedName[2]}`;
        const itemEmoji = item["emoji"];
        const canReveal = mode !== "sell" || await getValue(userID, "users", itemID, true) >= 0;
        const itemFinalPrice = await simplify(userID, itemPrice);
        const itemCurrency = item?.["currency"] ?? "toki-coin";
        const itemCurrencySymbol = getCurrencySymbol(itemCurrency);

        embedFields.push({
            name: canReveal ? `${itemEmoji} ${itemPresentationName}` : "???",
            value: `${itemFinalPrice} ${itemCurrencySymbol}`,
            inline: true
        });

        const itemMenuOption = {
            emoji: { name: canReveal ? itemEmoji : "❔" },
            label: canReveal ? itemPresentationName : "???",
            description: `${itemFinalPrice} ${itemCurrencySymbol}`,
            value: `${itemID}_${isItemUnique ? "unique" : ""}_${itemPrice}_${itemCurrency}_${itemName}_${shopType}`
        };

        if (!canSellAll && mode === "sell" && canReveal)
            canSellAll = true;
        if (!mode || mode === "buy")
            shopMenuBuy.components[0].addOptions(itemMenuOption);
        if (item["canSell"] || mode === "sell")
            shopMenuSell.components[0].addOptions(itemMenuOption);
    }

    if (shopMenuBuy.components[0].options.length > 0)
        menuComponents.push(shopMenuBuy);
    if (shopMenuSell.components[0].options.length > 0)
        menuComponents.push(shopMenuSell);

    return { "canSellAll": canSellAll, "fields": embedFields, "components": menuComponents };
};

module.exports = { refreshShop };