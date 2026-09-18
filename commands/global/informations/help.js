const { SlashCommandBuilder, EmbedBuilder, StringSelectMenuBuilder, ActionRowBuilder } = require("discord.js");
const commandList = require("../../../json/help.json");
const { sendError } = require("../../../tools/error-catcher.js");

module.exports = {
    category: "Informations",
    data: new SlashCommandBuilder()
        .setName("help")
        .setDescription("Affiche la liste de toutes mes commandes avec une courte description.")
        .setIntegrationTypes([0, 1])
        .setContexts([0, 1, 2]),
    async execute(interaction, client) {
        try {
            const commandsCount = commandList["count"];
            let categoryCount = Object.keys(commandList).length - 1;

            if (process.env.GUILD_COMMANDS_ID !== interaction.guild.id)
                categoryCount--;

            const dropdownOptions = Object.keys(commandList).filter(category => category !== "count" && (process.env.GUILD_COMMANDS_ID === interaction.guild.id || category !== "Serveur")).map((category, i) => ({
                page: `Page ${i + 1}`,
                name: category,
                emoji: commandList[category]["emoji"]
            }));

            const helpMenu = new ActionRowBuilder().addComponents(
                new StringSelectMenuBuilder()
                    .setPlaceholder("🗃️ Catégories")
                    .addOptions(...dropdownOptions.map(category => ({
                        emoji: { name: category.emoji },
                        label: category.page,
                        description: category.name === "Serveur" ? "Commandes pour le serveur Yunayunori" : category.name,
                        value: category.name
                    })))
                    .setCustomId(`help_${interaction.user.id}`));

            const helpEmbed = new EmbedBuilder()
                .setColor([255, 85, 0])
                .setTitle("Liste des commandes")
                .setDescription(`Tu trouveras dans le menu toutes les commandes réparties en **${categoryCount}** catégories. J'ai au total **${commandsCount}** commandes !\n### Liens utiles\n>>> 🎴 **[Serveur support](https://discord.gg/DYQutQvbSu)**\n🍊 **[Documentation](https://tokinotsuki.rf.gd)**\n🤖 **[Page Top.gg](https://top.gg/bot/791437575642152982)**\n📃 **[Conditions générales d'utilisation](https://tokinotsuki.rf.gd/terms-of-service)**\n🔒 **[Politique de confidentialité](https://tokinotsuki.rf.gd/privacy-policy)**`)
                .setTimestamp()
                .setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL({ extension: "png", size: 64 }) });

            await interaction.reply({ embeds: [helpEmbed], components: [helpMenu] });
        } catch (error) {
            await sendError(interaction, client, error);
        }
    }
};