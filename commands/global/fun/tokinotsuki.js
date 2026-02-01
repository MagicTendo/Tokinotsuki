const { SlashCommandBuilder, EmbedBuilder } = require("discord.js")
const { sendError } = require("../../../tools/error-catcher.js");
const { readdirSync } = require("fs");

module.exports = {
    category: "Fun",
    data: new SlashCommandBuilder()
        .setName("tokinotsuki")
        .setDescription("Affiche une image aléatoire de moi dans un autre univers !")
        .setIntegrationTypes([0, 1])
        .setContexts([0, 1, 2]),
    async execute(interaction, client) {
        try {
            await interaction.deferReply();

            const tokimageList = readdirSync("./assets/images/tokimages/");
            const tokimagesNumber = tokimageList.length;
            const randomImageIndex = Math.floor(Math.random() * tokimagesNumber);
            const tokimage = tokimageList[randomImageIndex];

            const references = {
                "among-us": "Among Us",
                "arkotalan-project": "Arkotalan Project",
                "back-to-the-future": "Retour vers le futur",
                "discord": "Discord",
                "gta": "Grand Theft Auto V",
                "javascript": "JavaScript",
                "kill-me-baby": "Kill Me Baby (キルミーベイベー)",
                "lidl": "Lidl",
                "mario-bros": "Super Mario Bros.",
                "meme": "Ancien meme Reddit",
                "miku": "Hatsune Miku (初音ミク)",
                "minecraft": "Minecraft",
                "netflix": "Netflix",
                "nord-vpn": "Nord VPN",
                "pikmin": "Pikmin 2",
                "pikmin-bloom": "Pikmin Bloom",
                "pokemon": "Pokémon",
                "shantae": "Shantae and the Pirate's Curse",
                "shutanopikuseru": "Shūtānopikuseru",
                "squid-game": "Squid Game",
                "stonks": "Stonks",
                "super-mario-maker": "Super Mario Maker 2",
                "three-shots-of-derek-bum": "Kitchen Gun - 3 Shots Of Derek Bum",
                "tokino-sky": "Rolling Sky",
                "undertale": "Undertale",
                "youtube": "YouTube"
            };

            const tokimgEmbed = new EmbedBuilder()
                .setColor([255, 85, 0])
                .setTitle(`Tokinotsuki Nº${randomImageIndex + 1} / ${tokimagesNumber} !`)
                .setDescription(`> ### ${references[tokimage.split(".")[0]]}`)
                .setImage(`attachment://${tokimage}`)
                .setTimestamp()
                .setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL({ extension: "png", size: 64, dynamic: true }) });

            await interaction.editReply({ embeds: [tokimgEmbed], files: [`./assets/images/tokimages/${tokimage}`] });
        } catch (error) {
            await sendError(interaction, client, error);
        }
    }
};