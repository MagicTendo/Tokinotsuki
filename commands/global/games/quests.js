const { SlashCommandBuilder, EmbedBuilder, MessageFlags } = require("discord.js");
const { getValue, updateValue } = require("../../../tools/database.js");
const { sendError } = require("../../../tools/error-catcher.js");
const { questFlags } = require("../../../tools/flags.js");
const { fishes, ores, birds, artefacts, cards } = require("../../../tools/items-table.js");
const { addTeamPoints, getCurrencySymbol, simplify } = require("../../../tools/modules.js");

module.exports = {
    category: "Jeux",
    data: new SlashCommandBuilder()
        .setName("quests")
        .setDescription("Tout ce qui concerne les quêtes.")
        .setIntegrationTypes([0])
        .setContexts([0])
        .addSubcommand(subcommand => subcommand
            .setName("claim")
            .setDescription("Récupère la récompense d'une quête accomplie.")
            .addStringOption(option => option
                .setName("quest")
                .setDescription("Quelle quête ?")
                .addChoices(
                    { name: "🐟 Fishing time !", value: "quest-fishing" },
                    { name: "💎 Mining time !", value: "quest-mining" },
                    { name: "🦴 Searching time !", value: "quest-searching" },
                    { name: "🐦 Snapping time !", value: "quest-snapping" },
                    { name: "🎴 Card fanatic", value: "quest-card" },
                    { name: "🌅 Daily routine", value: "quest-routine" },
                    { name: "🍪 COOKIES !!!", value: "quest-cookie" },
                    { name: "🔢 GTN genius", value: "quest-gtn" },
                    { name: "🧊 Icy", value: "quest-icy" },
                    { name: "💞 Pure love", value: "quest-love" },
                    { name: "🎯 Task expert", value: "quest-task" },
                    { name: "📜 Quest master", value: "quest-master" })
                .setRequired(true)))

        .addSubcommand(subcommand => subcommand
            .setName("list")
            .setDescription("Liste toutes les quêtes disponibles.")),
    async execute(interaction, client) {
        try {
            const userID = interaction.user.id;
            const questsPrizes = {
                "quest-fishing": [15_000, "toki-coin"],
                "quest-mining": [15_000, "toki-coin"],
                "quest-searching": [15_000, "toki-coin"],
                "quest-snapping": [15_000, "toki-coin"],
                "quest-card": [50_000, "toki-coin"],
                "quest-routine": [20_000, "toki-coin"],
                "quest-cookie": [100, "cookie"],
                "quest-gtn": [25_000, "toki-coin"],
                "quest-icy": [20_000, "toki-coin"],
                "quest-love": [5_000, "toki-coin"],
                "quest-task": [50_000, "toki-coin"],
                "quest-master": [1, "badge-quest"]
            };

            switch (interaction.options.getSubcommand()) {
                case "claim":
                    const quest = interaction.options.getString("quest");
                    const userQuest = await getValue(userID, "users", quest);
                    let isCompleted = false;

                    if (userQuest === questFlags.completed)
                        return await interaction.reply({ content: "❌ Tu as déjà validé cette quête !", flags: MessageFlags.Ephemeral });

                    if (quest === "quest-cookie") {
                        if (await getValue(userID, "users", "cookie") >= 999)
                            isCompleted = true;
                    } else if (["quest-fishing", "quest-mining", "quest-searching", "quest-snapping", "quest-card", "quest-master"].includes(quest)) {
                        const objects = quest === "quest-fishing" ? fishes : quest === "quest-mining" ? ores : quest === "quest-searching" ? artefacts : quest === "quest-snapping" ? birds : quest === "quest-card" ? cards : Object.keys(questsPrizes);

                        isCompleted = true;

                        for (let i = 0; i < objects.length; i++) {
                            const object = await getValue(userID, "users", objects[i]);

                            if (objects[i] === "quest-master")
                                continue;

                            if ((objects[i].startsWith("quest") && object <= 1) || object == 0) {
                                isCompleted = false;
                                break;
                            }
                        }
                    } else if (userQuest === questFlags.done) {
                        isCompleted = true;
                    }

                    if (isCompleted) {
                        const prizeAmount = questsPrizes[quest][0];
                        const prize = questsPrizes[quest][1];

                        await updateValue(userID, "users", quest, 2, false);
                        await updateValue(userID, "users", prize, prizeAmount, false);
                        await interaction.reply({ content: `✅ Quête validée ! Tu as gagné 1 ${getCurrencySymbol("questshroom")} !`, flags: MessageFlags.Ephemeral });
                        await addTeamPoints(interaction, userID, 5);
                    } else {
                        await interaction.reply({ content: "❌ Tu n'as pas terminé la quête !", flags: MessageFlags.Ephemeral });
                    }
                    break;

                case "list":
                    const questStatus = [];

                    for (let i = 0; i < Object.keys(questsPrizes).length; i++) {
                        const quest = await getValue(userID, "users", Object.keys(questsPrizes)[i]);
                        const status = quest === 2 ? "✅" : quest === 1 ? "❕" : "❌";

                        questStatus.push(status);
                    }

                    const questsEmbed = new EmbedBuilder()
                        .setColor([255, 85, 0])
                        .setTitle("Liste des quêtes")
                        .setDescription(`-# *Accomplir une quête te rapportera 1 ${getCurrencySymbol("questshroom")} en plus de la récompense de base.*`)
                        .addFields(
                            { name: `${questStatus[0]} Fishing time ! 🐟`, value: `Avoir tous les poissons dans l'inventaire.\n> ${await simplify(userID, questsPrizes[Object.keys(questsPrizes)[0]][0])} ${getCurrencySymbol("toki-coin")}`, inline: true },
                            { name: `${questStatus[1]} Mining time ! 💎`, value: `Avoir tous les minerais dans l'inventaire.\n> ${await simplify(userID, questsPrizes[Object.keys(questsPrizes)[1]][0])} ${getCurrencySymbol("toki-coin")}`, inline: true },
                            { name: `${questStatus[2]} Searching time ! 🦴`, value: `Avoir tous les artéfacts dans l'inventaire.\n> ${await simplify(userID, questsPrizes[Object.keys(questsPrizes)[2]][0])} ${getCurrencySymbol("toki-coin")}`, inline: true },
                            { name: `${questStatus[3]} Snapping time ! 🐦`, value: `Avoir toutes les photos d'oiseaux dans l'inventaire.\n> ${await simplify(userID, questsPrizes[Object.keys(questsPrizes)[3]][0])} ${getCurrencySymbol("toki-coin")}`, inline: true },
                            { name: `${questStatus[4]} Card fanatic 🎴`, value: `Avoir toutes les cartes.\n> ${await simplify(userID, questsPrizes[Object.keys(questsPrizes)[4]][0])} ${getCurrencySymbol("toki-coin")}`, inline: true },
                            { name: `${questStatus[5]} Daily routine 🌅`, value: `Avoir 100 jours d'affilé sur \`/daily\`.\n> ${await simplify(userID, questsPrizes[Object.keys(questsPrizes)[5]][0])} ${getCurrencySymbol("toki-coin")}`, inline: true },
                            { name: `${questStatus[6]} COOKIES !!! 🍪`, value: `Obtient 999 cookies !\n> ${await simplify(userID, questsPrizes[Object.keys(questsPrizes)[6]][0])} ${getCurrencySymbol("cookie")}`, inline: true },
                            { name: `${questStatus[7]} GTN genius 🔢`, value: `Gagner un partie GTN en ultra difficile en 15 coups ou moins.\n> ${await simplify(userID, questsPrizes[Object.keys(questsPrizes)[7]][0])} ${getCurrencySymbol("toki-coin")}`, inline: true },
                            { name: `${questStatus[8]} Icy 🧊`, value: `Avoir 200 points ou plus en Congelo.\n> ${await simplify(userID, questsPrizes[Object.keys(questsPrizes)[8]][0])} ${getCurrencySymbol("toki-coin")}`, inline: true },
                            { name: `${questStatus[9]} Pure love 💞`, value: `Avoir 100% d'amour avec \`/love\`.\n> ${await simplify(userID, questsPrizes[Object.keys(questsPrizes)[9]][0])} ${getCurrencySymbol("toki-coin")}`, inline: true },
                            { name: `${questStatus[10]} Task expert 🎯`, value: `Réalise toutes les tâches !\n> ${await simplify(userID, questsPrizes[Object.keys(questsPrizes)[10]][0])} ${getCurrencySymbol("toki-coin")}`, inline: true },
                            { name: `${questStatus[11]} Quest Master 📜`, value: "Réussir toutes les quêtes !\n> Un pin's", inline: true })
                        .setTimestamp()
                        .setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL({ extension: "png", size: 64, dynamic: true }) });

                    await interaction.reply({ embeds: [questsEmbed], flags: MessageFlags.Ephemeral });
                    break;
            }
        } catch (error) {
            await sendError(interaction, client, error);
        }
    }
};