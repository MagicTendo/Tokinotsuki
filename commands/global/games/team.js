const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, MessageFlags } = require("discord.js");
const { getValue } = require("../../../tools/database.js");
const { sendError } = require("../../../tools/error-catcher.js");
const { flagToTeam } = require("../../../tools/flags.js");
const { capitalize, getCurrencySymbol, getWinningTeam, simplify } = require("../../../tools/modules.js");

module.exports = {
    category: "Jeux",
    data: new SlashCommandBuilder()
        .setName("team")
        .setDescription("Tout ce qui concerne le système d'équipe !")
        .setIntegrationTypes([0])
        .setContexts([0])
        .addSubcommand(subcommand => subcommand
            .setName("join")
            .setDescription("Permet de rejoindre une équipe ! Cela coûtera 10 k Toki Coins.")
            .addStringOption(option => option
                .setName("team")
                .setDescription("Choisis l'équipe tu veux rejoindre.")
                .addChoices(
                    { name: "🍧 Graniti", value: "graniti-1" },
                    { name: "🫑 Pimentes", value: "pimentes-2" },
                    { name: "🌿 Mentis", value: "mentis-3" },
                    { name: "🍄 Champiture", value: "champiture-4" })
                .setRequired(true)))

        .addSubcommand(subcommand => subcommand
            .setName("rewards")
            .setDescription("Pour récupérer les récompenses actuelles de l'équipe gagnante (si tu l'as rejoint).")),
    async execute(interaction, client) {
        try {
            const userID = interaction.user.id;
            const userTeam = await getValue(userID, "users", "team");
            const userTeamName = userTeam ? await flagToTeam(userTeam) : null;
            const flagToColor = {
                1: [3, 120, 255],
                2: [97, 16, 12],
                3: [219, 210, 252],
                4: [17, 122, 17]
            };

            switch (interaction.options.getSubcommand()) {
                case "join":
                    if (userTeam > 0)
                        return await interaction.reply({ content: `❌ Tu as déjà rejoins une équipe, celle de ${userTeamName} !`, flags: [MessageFlags.Ephemeral] });
                    if (await getValue(userID, "users", "toki-coin") < 10_000)
                        return await interaction.reply({ content: `❌ Tu as besoin de ${await simplify(userID, 10_000)} ${getCurrencySymbol("toki-coin")} pour rejoindre une équipe !`, flags: [MessageFlags.Ephemeral] });

                    const team = interaction.options.getString("team").split("-");
                    const teamName = team[0];
                    const teamFlag = team[1];

                    const teamButton = new ActionRowBuilder().addComponents(
                        new ButtonBuilder()
                            .setEmoji({ name: "✨" })
                            .setLabel("Rejoindre !")
                            .setStyle(ButtonStyle.Secondary)
                            .setCustomId(`team_${teamName}_${teamFlag}_${userID}`));

                    const teamEmbed = new EmbedBuilder()
                        .setColor(flagToColor[teamFlag])
                        .setTitle("Confirmation")
                        .setDescription(`Es-tu sûr de vouloir rejoindre l'équipe **${capitalize(teamName)}** ? Une fois rejoins, tu ne pourras plus changer !`)
                        .setTimestamp()
                        .setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL({ extension: "png", size: 64 }) });

                    await interaction.reply({ embeds: [teamEmbed], components: [teamButton] });
                    break;

                case "rewards":
                    if (userTeam <= 0)
                        return await interaction.reply({ content: "❌ Tu dois rejoindre une équipe pour accéder à ceci !", flags: [MessageFlags.Ephemeral] });

                    const winningTeam = await getWinningTeam(userID);

                    if (!winningTeam["isUserTeamWinning"])
                        return await interaction.reply({ content: `❌ Ton équipe n'est pas gagnante, tu n'as pas accès à de récompenses... ${winningTeam["name"] === "tie" ? "Il y a actuellement une égalité, fait gagner des points à ton équipe pour qu'elle se démarque !" : `Celle en tête est **${capitalize(winningTeam["name"])}**, fait gagner des points à ton équipe pour la dépasser !`}`, flags: [MessageFlags.Ephemeral] });

                    const teamRewardsEmbed = new EmbedBuilder()
                        .setColor(flagToColor[userTeam])
                        .setTitle("Félicitation !")
                        .setDescription(`✨ Ton équipe, ${capitalize(userTeamName)}, est actuellement celle avec le plus de points ! Tu as désormais accès à ces avantages :\n\n- Ajout d'un bonus supplémentaire de 100 jours sur \`/daily\` et \`/weekly\`.\n- Un personnage bonus dans le \`/game fight\`.\n- Gains de \`/game roulette\` triplés, mais avec la possibilité de perdre le double de sa mise.\n- Temps d'attente de \`/game jackpot\`, \`/social cookie\` et \`/rob\` divisé par deux.\n- Badge d'équipe doré sur le \`/info user\`.`)
                        .setTimestamp()
                        .setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL({ extension: "png", size: 64 }) });

                    await interaction.reply({ embeds: [teamRewardsEmbed], flags: [MessageFlags.Ephemeral] });
                    break;
            }
        } catch (error) {
            await sendError(interaction, client, error);
        }
    }
};