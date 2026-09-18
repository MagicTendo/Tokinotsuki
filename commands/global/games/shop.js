const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const { sendError } = require("../../../tools/error-catcher.js");
const { shopToItemTable } = require("../../../tools/items-table.js");
const { capitalize } = require("../../../tools/modules.js");
const { refreshShop } = require("../../../tools/refresh-shop.js");

module.exports = {
    category: "Jeux",
    data: new SlashCommandBuilder()
        .setName("shop")
        .setDescription("Affiche toutes les boutiques avec les objets achetables ou pouvant être vendus.")
        .setIntegrationTypes([0])
        .setContexts([0])
        .addStringOption(option => option
            .setName("type")
            .setDescription("Quel magasin visiter ?")
            .addChoices(
                { name: "📦 Kerusuna (objets et banque)", value: "kerusuna" },
                { name: "🍪 Tokinotsuki (cookies)", value: "tokinotsuki" },
                { name: "🐟 Kafisana (poissons)", value: "kafisana" },
                { name: "💎 Opukira (minerais)", value: "opukira" },
                { name: "🦴 Tcceisa (artéfacts)", value: "tcceisa" },
                { name: "📷 Ekayasena (photo d'oiseaux)", value: "ekayasena" },
                { name: "🥊 Reisifinaa (améliorations)", value: "reisifinaa" })
            .setRequired(true)),
    async execute(interaction, client) {
        try {
            await interaction.deferReply();

            const shopType = interaction.options.getString("type");
            const itemTable = shopToItemTable[shopType];
            const userID = interaction.user.id;
            let shopColor;
            let shopDescription;
            let shopMode;

            switch (shopType) {
                case "kerusuna":
                    shopColor = [130, 74, 0];
                    shopDescription = "Avec le temps, Kerusuna accumule des objets perdus ou inutilisés dans son bureau. Elle a aussi de très bonnes relations avec Inillori, qui sait gérer l'économie.";
                    shopMode = "buy";
                    break;

                case "tokinotsuki":
                    shopColor = [255, 85, 0];
                    shopDescription = "Tokinotsuki, de son vrai nom Isokitsu, adore les cookies, tellement qu'elle essaye d'en faire tout un commerce entier !";
                    break;

                case "kafisana":
                    shopColor = [13, 158, 32];
                    shopDescription = "Kafisana adore passionnement tout ce qui ce rapporte à la nature, dont les poissons qu'elle étudie et répertorie.";
                    shopMode = "sell";
                    break;

                case "opukira":
                    shopColor = [81, 13, 140];
                    shopDescription = "Opukira adore la spéléologie ainsi que la minéralogie, et aimerai découvrir et comprendre tous les minerais qui existent.";
                    shopMode = "sell";
                    break;

                case "tcceisa":
                    shopColor = [252, 252, 252];
                    shopDescription = "Yatccuria étant très occupé sur la recherche dimensionnelle, il a confié à Tcceisa la recherche des fossiles et des reliques afin de mieux comprendre l'histoire de Yunayunori.";
                    shopMode = "sell";
                    break;

                case "ekayasena":
                    shopColor = [143, 143, 143];
                    shopDescription = "Passionée par tout ce qui se passe dans le ciel, Ekayasena s'est donnée pour objectif de photographier tous les oiseaux qui existent.";
                    shopMode = "sell";
                    break;

                case "reisifinaa":
                    shopColor = [14, 7, 48];
                    shopDescription = "Grâce à ses pouvoirs spectrals, Reisifinaa peut créer des entités ou même améliorer certains objets.";
                    shopMode = "buy";
                    break;
            }

            const shop = await refreshShop(itemTable, userID, shopType, shopMode);
            const shopComponents = shop["components"];

            if (shopComponents.length !== 0) {
                const shopFields = shop["fields"];
                const shopEmbed = new EmbedBuilder()
                    .setColor(shopColor)
                    .setTitle(`Magasin de ${capitalize(shopType)}`)
                    .setDescription(`-# *${shopDescription}*`)
                    .setImage(`attachment://${shopType}.png`)
                    .setTimestamp()
                    .setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL({ extension: "png", size: 64 }) });

                shopEmbed.setFields(shopFields);

                if (shop["canSellAll"]) {
                    const sellAllButton = new ActionRowBuilder().addComponents(
                        new ButtonBuilder()
                            .setEmoji({ name: "📦" })
                            .setLabel("Tout vendre")
                            .setStyle(ButtonStyle.Success)
                            .setCustomId(`shop_sell-all_${shopType}_${userID}`));

                    shopComponents.push(sellAllButton);
                }

                await interaction.editReply({ embeds: [shopEmbed], files: [`./assets/images/shops/${shopType}.png`], components: shopComponents });
            } else {
                await interaction.editReply({ content: "🏪 Tu as déjà tout acheté dans ce magasin !" });
            }
        } catch (error) {
            await sendError(interaction, client, error);
        }
    }
};