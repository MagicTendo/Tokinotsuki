const { SlashCommandBuilder, EmbedBuilder, MessageFlags } = require("discord.js");
const moment = require("moment");
const { sendError } = require("../../../tools/error-catcher.js");

moment.locale("fr");

module.exports = {
    category: "Fun",
    data: new SlashCommandBuilder()
        .setName("anime")
        .setDescription("Tout ce qui concerne les anime.")
        .setIntegrationTypes([0, 1])
        .setContexts([0, 1, 2])
        .addSubcommand(subcommand => subcommand
            .setName("character")
            .setDescription("Permet de rechercher un personnage d'anime ou de manga.")
            .addStringOption(option => option
                .setName("character-name")
                .setDescription("Le nom du personnage.")
                .setRequired(true)))

        .addSubcommand(subcommand => subcommand
            .setName("manga")
            .setDescription("Pour chercher un manga.")
            .addStringOption(option => option
                .setName("manga-name")
                .setDescription("Le nom du manga.")
                .setRequired(true)))

        .addSubcommand(subcommand => subcommand
            .setName("search")
            .setDescription("Permet de chercher un anime.")
            .addStringOption(option => option
                .setName("anime-name")
                .setDescription("Le nom de l'anime.")
                .setRequired(true))),
    async execute(interaction, client) {
        try {
            const name = interaction.options.getString("character-name") ?? interaction.options.getString("manga-name") ?? interaction.options.getString("anime-name");
            const searchTypeRaw = interaction.options.getSubcommand();
            const searchType = searchTypeRaw === "character" ? "characters" : searchTypeRaw === "search" ? "anime" : "manga";

            await fetch(`https://api.jikan.moe/v4/${searchType}?q=${name}`).then(function (response) {
                return response.json();
            }).then(async function (data) {
                if (data["data"].length === 0)
                    return await interaction.reply({ content: `❌ \`${name}\` ne semble pas exister !`, flags: MessageFlags.Ephemeral });

                const animeTag = data["data"][0]?.["genres"];
                const isHentai = animeTag?.some(tag => tag.name === "Hentai");

                if (interaction?.channel === null)
                    return await interaction.reply({ content: "❌ Je dois être sur le serveur afin de savoir si le salon est NSFW !", flags: MessageFlags.Ephemeral });
                if (isHentai && !interaction.channel.nsfw)
                    return await interaction.reply({ content: "❌ Tu dois être dans un salon NSFW pour celui là !", flags: MessageFlags.Ephemeral });

                await interaction.deferReply();

                const japaneseName = (searchType === "characters" ? data["data"][0]["name_kanji"] : data["data"][0]["title_japanese"]) ?? "???";
                const englishName = (searchType === "characters" ? data["data"][0]["name"] : data["data"][0]["title"]) ?? "???";
                const url = data["data"][0]["url"];
                let description = searchType === "characters" ? data["data"][0]["about"] : data["data"][0]["synopsis"];

                if (description !== null) {
                    const translationResponse = await fetch(`https://ftapi.pythonanywhere.com/translate?sl=en&dl=fr&text=${description}`);
                    const responseData = await translationResponse?.json() ?? description;
                    description = responseData["destination-text"].split(" [")[0];
                } else {
                    description = "*Aucune information n'est disponible...*";
                }

                const image = data["data"][0]["images"]["jpg"]["large_image_url"] ?? data["data"][0]["images"]["jpg"]["image_url"];

                const animeEmbed = new EmbedBuilder()
                    .setColor([255, 85, 0])
                    .setTitle(`${japaneseName} (${englishName})`)
                    .setURL(url)
                    .setDescription(description)
                    .setThumbnail(image)
                    .setTimestamp()
                    .setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL({ extension: "png", size: 64, dynamic: true }) });

                if (searchType !== "characters") {
                    const publishingType = searchType === "manga" ? "published" : "aired";
                    const start = data["data"][0][publishingType]["from"];
                    const end = data["data"][0][publishingType]["to"];
                    const startDate = start !== null ? moment(start).format("D MMMM YYYY") : "???";
                    const endDate = end !== null ? moment(end).format("D MMMM YYYY") : "???";
                    const dates = `${startDate} ~ ${endDate}`;

                    animeEmbed.setAuthor({ "name": dates })
                }

                await interaction.editReply({ embeds: [animeEmbed] });
            });
        } catch (error) {
            await sendError(interaction, client, error);
        }
    }
};