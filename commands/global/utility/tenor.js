const { SlashCommandBuilder, MediaGalleryBuilder, MessageFlags } = require("discord.js");
const { sendError } = require("../../../tools/error-catcher.js");

module.exports = {
    category: "Utilitaire",
    data: new SlashCommandBuilder()
        .setName("tenor")
        .setDescription("Permet de chercher des GIFs sur Tenor.")
        .setIntegrationTypes([0, 1])
        .setContexts([0, 1, 2])
        .addStringOption(option => option
            .setName("keywords")
            .setDescription("Les mots clés à rechercher.")
            .setRequired(true)),
    async execute(interaction, client) {
        try {
            const keywords = interaction.options.getString("keywords");

            await fetch(`https://g.tenor.com/v1/search?q=${keywords.replaceAll(" ", "%20")}&key=LIVDSRZULELA&limit=9`).then(function (response) {
                return response.json();
            }).then(async function (data) {
                const gifs = data["results"];
                const gifAmount = Object.keys(gifs).length;

                if (gifAmount === 0) {
                    await interaction.reply({ content: "Aucun GIF ne correspond aux mots clés !", flags: [MessageFlags.Ephemeral] });
                } else {
                    const gifsGallery = new MediaGalleryBuilder();

                    for (let i = 0; i < Math.min(gifAmount, 9); i++) {
                        gifsGallery.addItems(gif => gif
                            .setDescription(gifs[i]["content_description"])
                            .setURL(gifs[i]["media"][0]["gif"]["url"]));
                    }

                    await interaction.reply({ components: [gifsGallery], flags: [MessageFlags.Ephemeral, MessageFlags.IsComponentsV2] });
                }
            });
        } catch (error) {
            await sendError(interaction, client, error);
        }
    }
};