const { SlashCommandBuilder, EmbedBuilder, MessageFlags } = require("discord.js");
const { sendError } = require("../../../tools/error-catcher.js");

module.exports = {
    category: "Jeux",
    data: new SlashCommandBuilder()
        .setName("pins")
        .setDescription("Permet de voir tout les pin's obtenable !")
        .setIntegrationTypes([0, 1])
        .setContexts([0, 1, 2]),
    async execute(interaction, client) {
        try {
            const pinsEmbed = new EmbedBuilder()
                .setColor([255, 85, 0])
                .setTitle("Liste des pin's")
                .addFields(
                    { name: "🧊 Old Friend", value: "Pour ceux qui ont aidé au développement de la toute première version, Cirno !", inline: true },
                    { name: "✨ Retro Toki", value: "Pour ceux qui ont été là avant la v4.", inline: true },
                    { name: "👾 Beta Tester", value: "Être un bêta testeur officiel du projet.", inline: true },
                    { name: "🐛 Bug Hunter", value: "Trouver 5 bugs validés.", inline: true },
                    { name: "🎉 Équipe", value: "Rejoindre l'équipe Graniti, Pimentes, Mentis ou Champiture !", inline: true },
                    { name: "📜 Quest Master", value: "Accomplir toutes les quêtes.", inline: true })
                .setTimestamp()
                .setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL({ extension: "png", size: 64 }) });

            await interaction.reply({ embeds: [pinsEmbed], flags: [MessageFlags.Ephemeral] });
        } catch (error) {
            await sendError(interaction, client, error);
        }
    }
};