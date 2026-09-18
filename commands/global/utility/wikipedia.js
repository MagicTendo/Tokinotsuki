const { SlashCommandBuilder, EmbedBuilder, MessageFlags } = require("discord.js");
const wiki = require("wikijs").default;
const { sendError } = require("../../../tools/error-catcher.js");

module.exports = {
    category: "Utilitaire",
    data: new SlashCommandBuilder()
        .setName("wikipedia")
        .setDescription("Pour avoir des informations sur quelque chose grâce à Wikipédia.")
        .setIntegrationTypes([0, 1])
        .setContexts([0, 1, 2])
        .addStringOption(option => option
            .setName("article")
            .setDescription("L'article à chercher.")
            .setRequired(true)),
    async execute(interaction, client) {
        try {
            const article = interaction.options.getString("article");

            await wiki({ apiUrl: "https://fr.wikipedia.org/w/api.php" })
                .page(article)
                .then(async page => {
                    const articleCategories = await page.categories();
                    const isNSFW = articleCategories.some(category => category.toLowerCase().includes("pornographie") || category.toLowerCase().includes("sexuel") || category.toLowerCase().includes("hentai") || category.toLowerCase().includes("suicide"));

                    if (isNSFW && !interaction.channel.nsfw)
                        return await interaction.reply({ content: "❌ Tu dois être dans un salon NSFW pour celui là !", flags: [MessageFlags.Ephemeral] });

                    await interaction.deferReply();

                    const articleTitle = page["title"];
                    const articleURL = page.url();
                    const articleDescription = await page.summary();
                    const articleImage = await page.mainImage();
                    const articleImages = await page.images();
                    const articleThumbnail = articleImages.length > 1 ? articleImages[0] !== articleImage ? articleImages[0] : articleImages[1] : "";

                    const wikipediaEmbed = new EmbedBuilder()
                        .setColor([255, 85, 0])
                        .setTitle(articleTitle)
                        .setURL(articleURL)
                        .setDescription(articleDescription)
                        .setThumbnail(articleThumbnail)
                        .setImage(articleImage)
                        .setTimestamp()
                        .setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL({ extension: "png", size: 64 }) });

                    await interaction.editReply({ embeds: [wikipediaEmbed] });
                }).catch(async error => {
                    interaction.replied ? await interaction.editReply({ content: "❌ Aucun article n'a été trouvé à ce sujet !" }) : await interaction.reply({ content: "❌ Aucun article n'a été trouvé à ce sujet !", flags: [MessageFlags.Ephemeral] });
                });
        } catch (error) {
            await sendError(interaction, client, error);
        }
    }
};