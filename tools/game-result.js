const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const { fakeItems } = require("./items-table.js");
const { simplify } = require("./modules.js");

function getRandomItem(items, rare = false, isPath = false) {
    let chance = rare ? 15 : 100;

    if (isPath) {
        const pathSuccessProbability = Math.floor(Math.random() * 3);

        if (pathSuccessProbability > 0)
            return { catchedName: "fail", keptName: "fail", shortName: "fail", color: [168, 3, 0], price: "0" };

        rare ? chance = 2.5 : chance = 5;
    }

    const winner = Math.random() * chance + (100 - chance);
    let threshold = 0;

    for (let i = 0; i < Object.keys(items).length; i++) {
        threshold += items[Object.keys(items)[i]]["probability"];

        if (threshold > winner) {
            const catchedItem = Object.keys(items)[i];
            const catchedItemName = catchedItem.includes(fakeItems) ? catchedItem : catchedItem.split("|").filter(element => element != catchedItem.split("|")[1]).join(" ");
            const keptItemName = catchedItem.includes(fakeItems) ? catchedItem : catchedItem.split("|").slice(1).join(" ").replace("' ", "'");
            const itemShortName = items[catchedItem]["name"];
            const itemColor = items[catchedItem]?.["color"];
            const itemCurrency = items[catchedItem]?.["currency"];
            const itemPrice = items[catchedItem]?.["price"];

            return { id: i, catchedName: catchedItemName, keptName: keptItemName, shortName: itemShortName, color: itemColor, currency: itemCurrency, price: itemPrice };
        }
    }
}

async function sendResult(item, gameType, interaction, userID, hasPickaxe = false) {
    const title = item.catchedName === "path" ? "Un chemin secret sauvage !" : fakeItems.includes(item.shortName) ? "Oh non !" : `${item.catchedName}${gameType === "fish" || gameType === "bird" ? " sauvage " : ""} !`;
    const description = item.catchedName === "broken" ? "Ta pioche s'est cassée et sera réparée par Opukira !" : item.catchedName === "path" ? "Tu as trouvé un chemin secret qui pourraît amener vers un minerai rare ! Mais ce chemin est dangereux, veux-tu prendre le risque ?" : item.catchedName === "fail" ? "La mine s'est effondrée, le chemin était trop dangereux !" : item.catchedName === "blur" ? "La photo est flou et inutilisable !" : "Que faire avec ?";
    const imageLink = `attachment://${item.shortName}.png`;
    let itemButtons = new ActionRowBuilder();
    let imageFiles = [];

    const itemEmbed = new EmbedBuilder()
        .setColor(item.color)
        .setTitle(title)
        .setDescription(description)
        .setTimestamp()
        .setFooter({ text: interaction.user.globalName, iconURL: interaction.user.displayAvatarURL({ extension: "png", size: 64 }) });

    if (!fakeItems.includes(item.shortName)) {
        itemEmbed.setAuthor({ name: await simplify(userID, item.price), iconURL: `attachment://${item.currency ?? "toki-coin"}.png` });
        imageFiles.push(`./assets/images/money/${item.currency ?? "toki-coin"}.png`);
    }

    imageFiles.push(`./assets/images/${gameType === "fish" ? "fishes": gameType === "pikpik" ? "ores" : gameType === "arkeology" ? "artefacts" : "birds"}/${item.shortName}.png`);

    gameType === "bird" ? itemEmbed.setImage(imageLink) : itemEmbed.setThumbnail(imageLink);

    gameType === "pikpik" && item.shortName === "path" && itemButtons.addComponents(
        new ButtonBuilder()
            .setEmoji({ name: "🕳️" })
            .setLabel("Y aller !")
            .setStyle(ButtonStyle.Danger)
            .setCustomId(`pikpik_${hasPickaxe}_path_${userID}`));

    gameType === "pikpik" && itemButtons.addComponents(
        new ButtonBuilder()
            .setEmoji({ name: "⛏️" })
            .setLabel("Miner")
            .setStyle(ButtonStyle.Primary)
            .setCustomId(`pikpik_${hasPickaxe}_regular_${userID}`));

    item.shortName === "path" ? null : fakeItems.includes(item.shortName) ? itemButtons = null : itemButtons.addComponents(
        new ButtonBuilder()
            .setEmoji({ name: "🪙" })
            .setLabel("Vendre")
            .setStyle(ButtonStyle.Success)
            .setCustomId(`item_sell_${item.price}${gameType === "arkeology" ? `_${gameType}` : ""}_${userID}${gameType === "arkeology" ? "_0" : ""}`),
        new ButtonBuilder()
            .setEmoji({ name: "🎒" })
            .setLabel("Garder")
            .setStyle(ButtonStyle.Secondary)
            .setCustomId(`item_keep_${item.shortName}_${item.keptName}${gameType === "arkeology" ? `_${gameType}` : ""}_${userID}${gameType === "arkeology" ? "_0" : ""}`));

    const messageContent = { content: null, embeds: [itemEmbed], components: itemButtons !== null ? [itemButtons] : [], files: imageFiles };

    return interaction.replied ? interaction.editReply(messageContent) : interaction.update(messageContent);
}

module.exports = { getRandomItem, sendResult };