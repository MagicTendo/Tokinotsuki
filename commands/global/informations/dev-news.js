const { SlashCommandBuilder, EmbedBuilder, MessageFlags } = require("discord.js");
const moment = require("moment");
const { sendError } = require("../../../tools/error-catcher.js");

moment.locale("fr");

module.exports = {
    category: "Informations",
    data: new SlashCommandBuilder()
        .setName("dev-news")
        .setDescription("Pour avoir les dernières informations de mon développeur !")
        .setIntegrationTypes([0, 1])
        .setContexts([0, 1, 2]),
    async execute(interaction, client) {
        try {
            await fetch("https://magictendo.github.io/api/baka-news.json").then(function (response) {
                return response.json();
            }).then(async function (data) {
                const lastNewsIndex = data["latest-news"];
                const newsTitle = data[lastNewsIndex]["title"];
                const newsDescription = data[lastNewsIndex]["description"];
                const newsDate = data[lastNewsIndex]["date"];
                const newsFormattedDate = moment(newsDate).format("D MMMM YYYY");
                const newsProjects = data[lastNewsIndex]["projects"];
                const newsFormattedProjects = newsProjects.map(project => `\`${project}\``).join(" ");

                const devNewsEmbed = new EmbedBuilder()
                    .setColor([255, 85, 0])
                    .setTitle("Voilà la dernière information des projets de BakaTaida !")
                    .setURL("https://bakataida.rf.gd")
                    .setDescription(`## ${newsTitle}\n\n> ${newsFormattedProjects}\n${newsDescription}\n-# *Écrit le ${newsFormattedDate}*`)
                    .setTimestamp()
                    .setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL({ extension: "png", size: 64, dynamic: true }) });

                await interaction.reply({ embeds: [devNewsEmbed], flags: MessageFlags.Ephemeral });
            });
        } catch (error) {
            await sendError(interaction, client, error);
        }
    }
};