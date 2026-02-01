const { SlashCommandBuilder, EmbedBuilder, MessageFlags } = require("discord.js")
const { getCooldownList } = require("../../../tools/cooldown.js");
const { getValue } = require("../../../tools/database.js");
const { sendError } = require("../../../tools/error-catcher.js");

module.exports = {
    category: "Jeux",
    data: new SlashCommandBuilder()
        .setName("cooldowns")
        .setDescription("Affiche la liste de tous tes temps d'attentes.")
        .setIntegrationTypes([0])
        .setContexts([0]),
    async execute(interaction, client) {
        try {
            const userID = interaction.user.id;
            const currentDate = Date.now();
            const adventureCooldown = await getValue(userID, "users", "adventure-duration");
            const cooldownTimes = await getCooldownList();
            const cooldownNames = ["daily", "weekly", "fish", "pikpik", "arkeology", "snap-bird", "adventure", "fight", "roulette", "blackjack", "jackpot", "gtn", "guess-my-ping", "cookie", "rob", "vote"];
            const cooldowns = [];

            for (let i = 0; i < cooldownNames.length; i++) {
                const cooldown = await getValue(userID, "users", `${cooldownNames[i]}-cooldown`) + (cooldownTimes[cooldownNames[i]] ?? adventureCooldown);

                cooldowns.push(isNaN(cooldown) || cooldown <= currentDate ? "✅ Aucun" : `❌ <t:${Math.floor(cooldown / 1_000)}:R>`);
            }

            const cooldownsEmbed = new EmbedBuilder()
                .setColor([255, 85, 0])
                .setTitle("Tes cooldowns")
                .setFields(
                    { name: "🕑 __Daily__", value: cooldowns[0], inline: true },
                    { name: "📅 __Weekly__", value: cooldowns[1], inline: true },
                    { name: "🎣 __Fish__", value: cooldowns[2], inline: true },
                    { name: "⛏️ __PikPik__", value: cooldowns[3], inline: true },
                    { name: "🖌️ __Arkeology__", value: cooldowns[4], inline: true },
                    { name: "📸 __Snap Bird__", value: cooldowns[5], inline: true },
                    { name: "🧭 __Aventure__", value: cooldowns[6], inline: true },
                    { name: "⚔️ __Fight__", value: cooldowns[7], inline: true },
                    { name: "♦️ __Roulette__", value: cooldowns[8], inline: true },
                    { name: "🎴 __Blackjack__", value: cooldowns[9], inline: true },
                    { name: "🎰 __Jackpot__", value: cooldowns[10], inline: true },
                    { name: "🔢 __GTN__", value: cooldowns[11], inline: true },
                    { name: "🏓 __Guess my ping__", value: cooldowns[12], inline: true },
                    { name: "🍪 __Cookie__", value: cooldowns[13], inline: true },
                    { name: "💰 __Vol__", value: cooldowns[14], inline: true },
                    { name: "🗳️ __Vote__", value: cooldowns[15], inline: true })
                .setTimestamp()
                .setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL({ extension: "png", size: 64, dynamic: true }) });

            await interaction.reply({ embeds: [cooldownsEmbed], flags: MessageFlags.Ephemeral });
        } catch (error) {
            await sendError(interaction, client, error);
        }
    }
};