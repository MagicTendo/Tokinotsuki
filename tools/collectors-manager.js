const { MessageFlags } = require("discord.js");

const activeCollectors = new Set();

async function canCreateCollector(interaction, guildID) {
    if (activeCollectors.has(guildID)) {
        await interaction.reply({ content: "❌ Il y a déjà une collecteur actif sur ce serveur ! C'est à dire qu'il y a déjà sois une partie de congelo, sois un test de rapidité ou sois une commande d'apprentissage en cours, cette action doit d'abord être terminé avant de faire cette commande !", flags: [MessageFlags.Ephemeral] });
        return false;
    } else {
        activeCollectors.add(guildID);
        return true;
    }
}

async function endCollector(guildID) {
    activeCollectors.delete(guildID);
}

module.exports = { canCreateCollector, endCollector };