const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { keyvUsers, getValue } = require("../../../tools/database.js");
const { sendError } = require("../../../tools/error-catcher.js");
const { capitalize, getCurrencySymbol, simplify } = require("../../../tools/modules.js");

module.exports = {
    category: "Jeux",
    data: new SlashCommandBuilder()
        .setName("top")
        .setDescription("Affiche et classe les utilisateurs ou les équipes avec le plus de ressources ou de points !")
        .setIntegrationTypes([0])
        .setContexts([0])
        .addStringOption(option => option
            .setName("category")
            .setDescription("La catégorie du classement.")
            .addChoices(
                { name: "🪙 Toki Coins", value: "toki-coin" },
                { name: "🍪 Cookie", value: "cookie" },
                { name: "🧊 Congelo", value: "congelo" },
                { name: "🎉 Points d'équipe", value: "team" },
                { name: "🐛 Bug", value: "bug" })
            .setRequired(true)),
    async execute(interaction, client) {
        try {
            await interaction.deferReply();

            const topCategory = interaction.options.getString("category");
            const userID = interaction.user.id;
            let leaderboard = {};
            let description = "";

            if (topCategory === "team") {
                const teams = ["graniti", "pimentes", "mentis", "champiture"];

                for (let i = 0; i < teams.length; i++) {
                    const teamPoints = await getValue("toki", "toki", teams[i]);

                    leaderboard[teams[i]] = teamPoints;
                }
            } else {
                const getData = await keyvUsers.query("SELECT * FROM users;");

                for (let i = 0; i < getData.length; i++) {
                    const userValues = JSON.parse(getData[i]["value"]);

                    if (topCategory in userValues)
                        leaderboard[getData[i]["key"]] = userValues[topCategory];
                }
            }

            leaderboard = Object.keys(leaderboard).map(k => ([k, leaderboard[k]])).sort((a, b) => (b[1] - a[1])).slice(0, 15);

            for (let i = 0; i < leaderboard.length; i++) {
                description += `${userID === leaderboard[i][0] ? "> " : ""}**${i + 1}** - ${topCategory === "team" ? capitalize(leaderboard[i][0]) : await client.users.cache?.get(leaderboard[i][0])?.globalName ?? `<@${leaderboard[i][0]}>`} | \`${await simplify(userID, leaderboard[i][1])}\` ${topCategory === "toki-coin" ? getCurrencySymbol("toki-coin") : topCategory === "cookie" ? getCurrencySymbol("cookie") : topCategory === "congelo" ? getCurrencySymbol("congelo") : topCategory === "team" ? "points" : "<:Bug:1462199247322747036>"}\n`;
            }

            const topEmbed = new EmbedBuilder()
                .setColor(topCategory === "toki-coin" ? [255, 196, 0] : topCategory === "cookie" ? [217, 158, 130] : topCategory === "congelo" ? [3, 169, 252] : topCategory === "team" ? [107, 17, 56] : [0, 255, 4])
                .setTitle(`Classement des ${topCategory === "toki-coin" ? `Toki Coins ${getCurrencySymbol("toki-coin")}` : topCategory === "cookie" ? `cookies ${getCurrencySymbol("cookie")}` : topCategory === "congelo" ? `points en Congelo ${getCurrencySymbol("congelo")}` : topCategory === "team" ? "points d'équipe 🎉" : "bugs <:Bug:1462199247322747036>"}`)
                .setDescription(description || "Personne n'est dans le classement pour l'instant...")
                .setTimestamp()
                .setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL({ extension: "png", size: 64, dynamic: true }) });

            await interaction.editReply({ embeds: [topEmbed] });
        } catch (error) {
            await sendError(interaction, client, error);
        }
    }
};