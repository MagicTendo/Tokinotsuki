const { EmbedBuilder } = require("discord.js");
const { readFileSync } = require("fs");
const { sendError } = require("../../../../tools/error-catcher.js");

module.exports = {
    async execute(interaction, client) {
        try {
            const helpJSON = readFileSync("./json/help.json", "utf-8");
            const commandByCategoryList = JSON.parse(helpJSON);
            const selectedCategory = interaction.values[0];
            const categoryName = selectedCategory.toLowerCase();
            const categoryCommands = commandByCategoryList[selectedCategory]["commands"];
            let helpDescription = "";

            categoryCommands.forEach(command => {
                helpDescription += `${command.name} - ${command.description}\n\n`;
            });

            const categoryEmbed = new EmbedBuilder()
                .setColor([255, 85, 0])
                .setTitle(`Commandes ${categoryName === "serveur" ? "pour le serveur Yunayunori" : categoryName} (${Object.keys(categoryCommands).length})`)
                .setDescription(helpDescription)
                .setTimestamp()
                .setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL({ extension: "png", size: 64 }) });

            await interaction.update({ embeds: [categoryEmbed] });
        } catch (error) {
            await sendError(interaction, client, error);
        }
    }
};