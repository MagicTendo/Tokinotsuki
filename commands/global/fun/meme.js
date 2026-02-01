const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { sendError } = require("../../../tools/error-catcher.js");

module.exports = {
    category: "Fun",
    data: new SlashCommandBuilder()
        .setName("meme")
        .setDescription("Affiche un meme aléatoire (SFW) provenant de Reddit.")
        .setIntegrationTypes([0, 1])
        .setContexts([0, 1, 2]),
    async execute(interaction, client) {
        try {
            async function getMeme() {
                const memeResponse = await fetch("https://meme-api.com/gimme");
                let data = await memeResponse.json();

                if (data["nsfw"]) return await getMeme();

                const memeTitle = data["title"];
                const memeSubreddit = data["subreddit"];
                const memeLink = data["postLink"];
                const memeAuthor = data["author"];
                const memeImage = data["url"];

                return [memeTitle, memeSubreddit, memeLink, memeAuthor, memeImage];
            }

            const meme = await getMeme();

            const memeEmbed = new EmbedBuilder()
                .setColor([255, 85, 0])
                .setTitle(`${meme[0]} - [r/${meme[1]}]`)
                .setURL(meme[2])
                .setAuthor({ name: `u/${meme[3]}` })
                .setImage(meme[4])
                .setTimestamp()
                .setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL({ extension: "png", size: 64, dynamic: true }) });

            await interaction.reply({ embeds: [memeEmbed] });
        } catch (error) {
            await sendError(interaction, client, error);
        }
    }
};