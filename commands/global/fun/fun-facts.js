const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const factList = require("../../../json/facts.json");
const { sendError } = require("../../../tools/error-catcher.js");

module.exports = {
    category: "Fun",
    data: new SlashCommandBuilder()
        .setName("fun-facts")
        .setDescription("Pour avoir un fait aléatoire sur tout et rien !")
        .setIntegrationTypes([0])
        .setContexts([0, 1, 2])
        .addStringOption(option => option
            .setName("category")
            .setDescription("Choisis une catégorie.")
            .addChoices(
                { name: "🎲 Aléatoire", value: "random" },
                { name: "🎨 Art", value: "art" },
                { name: "🧬 Biologie", value: "biology" },
                { name: "🧪 Chimie", value: "chemistry" },
                { name: "🌍 Géographie", value: "geography" },
                { name: "🧲 Physique", value: "physics" },
                { name: "⌚ Tokinotsuki", value: "toki" })
            .setRequired(true)),
    async execute(interaction, client) {
        try {
            const factCategory = interaction.options.getString("category");
            const categoryEmojis = ["🎨", "🧬", "🧪", "🌍", "🧲", "⌚"];
            const categoryNames = ["l'art", "la biologie", "la chimie", "la géographie", "la physique", "Tokinotsuki"];
            const category = factCategory === "random" ? Object.keys(factList)[Math.floor(Math.random() * (Object.keys(factList).length - 1))] : factCategory;
            const facts = factList[category];
            const factsNumber = facts.length;
            const factIndex = Math.floor(Math.random() * factsNumber);
            const categoryIndex = Object.keys(factList).findIndex(name => name === category);
            const categoryEmoji = categoryEmojis[categoryIndex];
            const categoryName = categoryNames[categoryIndex];
            const fact = facts[factIndex];

            const factEmbed = new EmbedBuilder()
                .setColor([255, 85, 0])
                .setTitle(`${categoryEmoji} Fait sur ${categoryName} Nº${factIndex + 1} / ${factsNumber} !`)
                .setDescription(fact)
                .setTimestamp()
                .setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL({ extension: "png", size: 64 }) });

            await interaction.reply({ embeds: [factEmbed] });
        } catch (error) {
            await sendError(interaction, client, error);
        }
    }
};