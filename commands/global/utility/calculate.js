const { SlashCommandBuilder, EmbedBuilder, MessageFlags } = require("discord.js");
const { sendError } = require("../../../tools/error-catcher.js");
const { plot } = require("asciichart");
const { compile } = require("mathjs");
const nerdamer = require("nerdamer/all.min");

module.exports = {
    category: "Utilitaire",
    data: new SlashCommandBuilder()
        .setName("calculate")
        .setDescription("Permet de calculer (arithmétique, équations, intégrales, etc.). Donne aussi la notation LaTeX.")
        .setIntegrationTypes([0, 1])
        .setContexts([0, 1, 2])
        .addStringOption(option => option
            .setName("calculation")
            .setDescription("Le calcul à effectuer.")
            .setRequired(true))
        .addStringOption(option => option
            .setName("graph-mode")
            .setDescription("Affiche la courbe représentative au lieu de calculer.")
            .addChoices(
                { name: "✅ Oui", value: "yes" },
                { name: "❌ Non", value: "no" })
            .setRequired(false)),
    async execute(interaction, client) {
        try {
            const calculation = interaction.options.getString("calculation").replaceAll("²", "^2");
            const graphMode = interaction.options.getString("graph-mode");
            const codes = process.env.PUZZLE_CODES.split(",");

            if (calculation.toLowerCase() === codes[14])
                return await interaction.reply({ content: `\`${codes[15]}\``, flags: MessageFlags.Ephemeral });

            try {
                if (graphMode === "yes") {
                    const minimumX = -15;
                    const maximumX = 15;
                    const step = 1;
                    const compiled = compile(calculation);
                    let series = [];

                    for (let x = minimumX; x <= maximumX; x += step) {
                        series.push(compiled.evaluate({ x }));
                    }

                    await interaction.reply({ content: `\`\`\`\n${plot(series, { height: 15 })}\n\`\`\`` });
                } else {
                    const rawResult = await nerdamer(calculation);
                    const resultLaTeX = await nerdamer.convertToLaTeX(calculation);;
                    const preciseResult = rawResult.toString().replace("Infinity", "∞");
                    const result = rawResult.evaluate().text("decimals").replace("Infinity", "∞");
                    const latexImage = `https://latex.codecogs.com/png.image?\\dpi{500}${encodeURI(resultLaTeX)}`;

                    const calculateEmbed = new EmbedBuilder()
                        .setColor([255, 85, 0])
                        .setDescription(`**Calcul**\n\`${calculation}\`\n\n**LaTeX**\n\`\`\`tex\n${resultLaTeX}\`\`\`\n\n**Résultat précis**\n\`\`\`mathematica\n${preciseResult === "9" ? "⑨" : preciseResult}\`\`\`${preciseResult !== result ? `\n**Représentation décimale**\n\`\`\`mathematica\n${result}\`\`\`\n` : "\n"}> [Voir la liste complète des formules](https://nerdamer.com/documentation.html)`)
                        .setImage(latexImage)
                        .setTimestamp()
                        .setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL({ extension: "png", size: 64, dynamic: true }) });

                    await interaction.reply({ embeds: [calculateEmbed] });
                }
            } catch (error) {
                await interaction.reply({ content: `❌ La syntaxe du calcul \`${calculation}\` semble incorrecte !`, flags: MessageFlags.Ephemeral });
            }
        } catch (error) {
            await sendError(interaction, client, error);
        }
    }
};