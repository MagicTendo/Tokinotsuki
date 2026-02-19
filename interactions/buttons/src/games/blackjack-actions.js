const { EmbedBuilder, ActionRowBuilder } = require("discord.js");
const { cardValues, cardNumberValues, cardSymbols, deckToValue } = require("../../../../tools/card.js");
const { sendError } = require("../../../../tools/error-catcher.js");
const { updateValue } = require("../../../../tools/database.js");
const { getCurrencySymbol, simplify } = require("../../../../tools/modules.js");

module.exports = {
    async execute(interaction, client) {
        try {
            async function drawCard(deckID) {
                const cardResponse = await fetch(`https://deckofcardsapi.com/api/deck/${deckID}/draw/`);
                const cardData = await cardResponse.json();
                const card = cardData["cards"][0];
                const cardValue = card["value"];
                const cardName = (cardValues[cardValue] ?? cardValue) + cardSymbols[card["suit"]];

                return [cardName, cardNumberValues[cardValue] ?? Number(cardValue)];
            }

            const buttonContent = interaction.customId.split("_");
            const action = buttonContent[1];
            const deckID = buttonContent[2];
            const dealerCards = buttonContent[3].split("-");
            const playerCards = buttonContent[4].split("-");
            const betAmount = Number(buttonContent[5]);
            const blackjackEmbed = new EmbedBuilder(interaction.message.embeds[0].data);
            const userID = interaction.user.id;
            let dealerTotal = await deckToValue(dealerCards);
            let playerTotal = await deckToValue(playerCards);
            let blackjackButtons = [];
            let hasFinished = false;
            let gameStatus;
            let profit;

            const hasBlackjack = playerCards.length === 2 && playerCards.filter(card => card.startsWith("A")).length === 1 && playerTotal === 21;

            switch (action) {
                case "hit":
                    const card = await drawCard(deckID);

                    playerCards.push(card[0]);
                    playerTotal += card[1];

                    if (playerTotal > 21) {
                        hasFinished = true;
                    } else {
                        blackjackButtons = [new ActionRowBuilder().addComponents(interaction.message.components[0].components)];
                        blackjackButtons[0].components[0].data.custom_id = `blackjack_hit_${deckID}_${dealerCards.join("-")}_${playerCards.join("-")}_${betAmount}_${interaction.user.id}`;
                        blackjackButtons[0].components[1].data.custom_id = `blackjack_stand_${deckID}_${dealerCards.join("-")}_${playerCards.join("-")}_${betAmount}_${interaction.user.id}`;
                    }

                    blackjackEmbed.setFields(
                        { name: "🟠 __Tokinotsuki__", value: `${dealerCards.join(" | ")} | ?? (**${dealerTotal}**)`, inline: true },
                        { name: `🔵 __${interaction.user.globalName}__`, value: `${playerCards.join(" | ")} (**${playerTotal}**)`, inline: true });
                    break;

                case "stand":
                    hasFinished = true;
                    break;
            }

            if (hasFinished) {
                while (dealerTotal < 17) {
                    const card = await drawCard(deckID);

                    dealerCards.push(card[0]);
                    dealerTotal += card[1];
                }

                if ((playerTotal > 21 || dealerTotal > playerTotal) && dealerTotal <= 21) {
                    gameStatus = "lost";
                } else if (playerTotal === dealerTotal) {
                    gameStatus = "push";
                } else {
                    gameStatus = "win";
                }

                blackjackEmbed.setFields(
                    { name: "🟠 __Tokinotsuki__", value: `${dealerCards.join(" | ")} (**${dealerTotal}**)`, inline: true },
                    { name: `🔵 __${interaction.user.globalName}__`, value: `${playerCards.join(" | ")} (**${playerTotal}**)`, inline: true });

                if (gameStatus === "lost") {
                    profit = 0;

                    blackjackEmbed.setDescription("**Tokinotsuki** gagne la main ! Tu perds ta mise...");
                } else if (gameStatus === "push") {
                    profit = betAmount;

                    blackjackEmbed.setDescription("C'est un push ! Tu gardes ta mise.");
                } else {
                    if (hasBlackjack) {
                        profit = betAmount * 2.5;

                        blackjackEmbed.setDescription(`**${interaction.user.globalName}** gagne la main ! Tu as fait blackjack tu remportes x2.5 ta mise, soit **${await simplify(userID, profit)}** ${getCurrencySymbol("toki-coin")} !`);
                    } else {
                        profit = betAmount * 2;

                        blackjackEmbed.setDescription(`**${interaction.user.globalName}** gagne la main ! Tu doubles ta mise, soit **${await simplify(userID, profit)}** ${getCurrencySymbol("toki-coin")} !`);
                    }
                }

                await updateValue(userID, "users", "toki-coin", profit);
            }

            await interaction.update({ embeds: [blackjackEmbed], components: blackjackButtons });
        } catch (error) {
            await sendError(interaction, client, error);
        }
    }
};