const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, MessageFlags } = require("discord.js");
const { getValue, hasValue, updateValue } = require("../../../tools/database.js");
const { sendError } = require("../../../tools/error-catcher.js");
const { getRandomItem } = require("../../../tools/game-result.js");
const { cards } = require("../../../tools/items-table.js");

module.exports = {
    category: "Jeux",
    data: new SlashCommandBuilder()
        .setName("cards")
        .setDescription("Tout ce qui concerne les cartes.")
        .setIntegrationTypes([0, 1])
        .setContexts([0, 1, 2])
        .addSubcommand(subcommand => subcommand
            .setName("collection")
            .setDescription("Affiche ta collection de cartes actuel.")
            .addUserOption(option => option
                .setName("user")
                .setDescription("Pour afficher l'inventaire d'un autre utilisateur.")
                .setRequired(false)))

        .addSubcommand(subcommand => subcommand
            .setName("drop")
            .setDescription("Ouvre un de tes paquets de cartes.")),
    async execute(interaction, client) {
        try {
            const user = interaction.options.getUser("user") ?? interaction.user;
            const userID = user.id;

            if (user.bot)
                return await interaction.reply({ content: "❌ L'utilisateur ne peut pas être un bot !", flags: MessageFlags.Ephemeral });

            switch (interaction.options.getSubcommand()) {
                case "collection":
                    const collectionEmbeds = [];

                    const characterCardsEmbed = new EmbedBuilder()
                        .setColor([0, 152, 217])
                        .setTitle("Ta collection de cartes personnages")
                        .setTimestamp()
                        .setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL({ extension: "png", size: 64, dynamic: true }) });

                    const bururuCardsEmbed = new EmbedBuilder()
                        .setColor([0, 152, 217])
                        .setTitle("Ta collection de cartes bururu")
                        .setTimestamp()
                        .setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL({ extension: "png", size: 64, dynamic: true }) });

                    for (let i = 0; i < Object.keys(cards).length; i++) {
                        const cardFullName = Object.keys(cards)[i];
                        const card = cards[cardFullName];
                        const cardName = card["name"];

                        if (await hasValue(userID, "users", cardName)) {
                            const cardField = { name: `${card["emoji"]} ${cardFullName}`, value: String(await getValue(userID, "users", cardName)), inline: true };

                            card["type"] === "character" ? characterCardsEmbed.addFields(cardField) : bururuCardsEmbed.addFields(cardField);
                        }
                    }

                    if (characterCardsEmbed.data.fields)
                        collectionEmbeds.push(characterCardsEmbed);
                    if (bururuCardsEmbed.data.fields)
                        collectionEmbeds.push(bururuCardsEmbed);
                    if (collectionEmbeds.length === 0)
                        return await interaction.reply({ content: userID === interaction.user.id ? "❌ Tu n'as aucune carte !" : `❌ <@${userID}> n'a aucune carte !`, flags: MessageFlags.Ephemeral });

                    await interaction.reply({ embeds: collectionEmbeds });
                    break;

                case "drop":
                    if (!(await hasValue(userID, "users", "booster-pack")))
                        return await interaction.reply({ content: "❌ Tu n'as pas de paquet à ouvrir !", flags: MessageFlags.Ephemeral });

                    const cardsID = [];

                    for (let i = 0; i < 4; i++) {
                        const card = getRandomItem(cards);

                        cardsID.push(card["id"]);
                    }

                    await updateValue(userID, "users", "booster-pack", -1);

                    const packOpeningButton = new ActionRowBuilder().addComponents(
                        new ButtonBuilder()
                            .setEmoji({ name: "🎴" })
                            .setLabel("Suivant")
                            .setStyle(ButtonStyle.Secondary)
                            .setCustomId(`cards_1_${cardsID.join("_")}_${userID}`));

                    const packOpeningEmbed = new EmbedBuilder()
                        .setColor([0, 152, 217])
                        .setImage("attachment://card-back.png")
                        .setTimestamp()
                        .setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL({ extension: "png", size: 64, dynamic: true }) });

                    await interaction.reply({ embeds: [packOpeningEmbed], files: ["./assets/images/cards/card-back.png"], components: [packOpeningButton] });
                    break;
            }
        } catch (error) {
            await sendError(interaction, client, error);
        }
    }
};