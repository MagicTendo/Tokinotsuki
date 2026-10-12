const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, MessageFlags, PresenceUpdateStatus } = require("discord.js");
const { existsSync, lstatSync, readdirSync } = require("fs");
const moment = require("moment");
const { Pool } = require("pg");
const { getCooldownList } = require("../../../tools/cooldown.js");
const { keyvUsers, keyvGuilds, keyvToki, updateValue } = require("../../../tools/database.js");
const { sendError } = require("../../../tools/error-catcher.js");
const { getRandomItem } = require("../../../tools/game-result.js");
const { fishTable, oreTable, birdTable, artefactTable, cards } = require("../../../tools/items-table.js");
const { getCurrencySymbol, simplify } = require("../../../tools/modules.js");
const { socialMediaRoutes, sendMessage } = require("../../../tools/rss-feeds.js");

moment.locale("fr");

module.exports = {
    category: "Développeur",
    data: new SlashCommandBuilder()
        .setName("dev")
        .setDescription("Ces commandes sont uniquement pour mon développeur !")
        .setIntegrationTypes([0])
        .setContexts([0])
        .addSubcommand(subcommand => subcommand
            .setName("create-code")
            .setDescription("Pour créer un code de récompenses.")
            .addStringOption(option => option
                .setName("secret-code")
                .setDescription("Ce code n'est pas un easter egg et sert juste comme double vérification !")
                .setRequired(true))
            .addStringOption(option => option
                .setName("rewards")
                .setDescription("La liste des récompenses.")
                .setRequired(true))
            .addBooleanOption(option => option
                .setName("expiration")
                .setDescription("Pour mettre un date limite.")
                .setRequired(false))
            .addBooleanOption(option => option
                .setName("owner")
                .setDescription("Pour l'attribuer à un utilisateur.")
                .setRequired(false)))

        .addSubcommand(subcommand => subcommand
            .setName("eval")
            .setDescription("Permet de tester une portion de code.")
            .addStringOption(option => option
                .setName("secret-code")
                .setDescription("Ce code n'est pas un easter egg et sert juste comme double vérification !")
                .setRequired(true))
            .addStringOption(option => option
                .setName("code")
                .setDescription("Le code à tester.")
                .setRequired(true))
            .addStringOption(option => option
                .setName("message-id")
                .setDescription("L'identifiant d'un message à modifier.")
                .setRequired(false))
            .addBooleanOption(option => option
                .setName("is-async")
                .setDescription("Pour que le code soit asynchrone.")
                .setRequired(false)))

        .addSubcommand(subcommand => subcommand
            .setName("delete")
            .setDescription("Permet de supprimer des éléments dans la base de données.")
            .addStringOption(option => option
                .setName("secret-code")
                .setDescription("Ce code n'est pas un easter egg et sert juste comme double vérification !")
                .setRequired(true))
            .addStringOption(option => option
                .setName("table")
                .setDescription("Dans quelle table se trouve la clé ou la valeur à supprimer ?")
                .addChoices(
                    { name: "🧍 Utilisateurs", value: "users" },
                    { name: "💻 Serveurs", value: "guilds" },
                    { name: "⌚️ Toki", value: "toki" })
                .setRequired(true))
            .addStringOption(option => option
                .setName("key")
                .setDescription("Quelle clé supprimer ?")
                .setRequired(true))
            .addStringOption(option => option
                .setName("value")
                .setDescription("Quelle valeur supprimer ?")
                .setRequired(false)))

        .addSubcommand(subcommand => subcommand
            .setName("file")
            .setDescription("Permet d'effectuer des actions sur les fichiers du bot.")
            .addStringOption(option => option
                .setName("secret-code")
                .setDescription("Ce code n'est pas un easter egg et sert juste comme double vérification !")
                .setRequired(true))
            .addStringOption(option => option
                .setName("action")
                .setDescription("Choisis l'action à faire.")
                .addChoices(
                    { name: "📂 Open", value: "open" },
                    { name: "💽 List", value: "list" },
                    { name: "🔄️ Reload", value: "reload" })
                .setRequired(true))
            .addStringOption(option => option
                .setName("file-path")
                .setDescription("Le chemin relatif du fichier.")
                .setRequired(true)))

        .addSubcommand(subcommand => subcommand
            .setName("give")
            .setDescription("Permet de donner un objet à quelqu'un.")
            .addStringOption(option => option
                .setName("secret-code")
                .setDescription("Ce code n'est pas un easter egg et sert juste comme double vérification !")
                .setRequired(true))
            .addStringOption(option => option
                .setName("item")
                .setDescription("L'objet à donner.")
                .setRequired(true))
            .addIntegerOption(option => option
                .setName("value")
                .setDescription("La quantité.")
                .setRequired(true))
            .addUserOption(option => option
                .setName("user")
                .setDescription("La personne qui le recevra.")
                .setRequired(true))
            .addBooleanOption(option => option
                .setName("is-additive")
                .setDescription("Est-ce que cela s'ajoute à la valeur précédante ou non.")
                .setRequired(true)))

        .addSubcommand(subcommand => subcommand
            .setName("rss")
            .setDescription("Force l'envoi d'un message d'un ou plusieurs flux RSS.")
            .addStringOption(option => option
                .setName("secret-code")
                .setDescription("Ce code n'est pas un easter egg et sert juste comme double vérification !")
                .setRequired(true))
            .addStringOption(option => option
                .setName("feed")
                .setDescription("Quel flux RSS ?")
                .addChoices(
                    { name: "🌐 Tous", value: "all" },
                    { name: "✨ YouTube (BakaTaida)", value: "youtube-bakataida" },
                    { name: "🛑 YouTube (Otomadan)", value: "youtube-otomadan" },
                    { name: "🔁 YouTube (BakaTaida VOWOD)", value: "youtube-vowod" },
                    { name: "🌱 YouTube (Team Pik)", value: "youtube-team-pik" },
                    { name: "🎴 YouTube (Yunayunori)", value: "youtube-yunayunori" },
                    { name: "🚙 YouTube (Olivier)", value: "youtube-olivier" },
                    { name: "📹️ Twitch", value: "twitch" },
                    { name: "📸 Instagram", value: "instagram" },
                    { name: "🎨 pixiv", value: "pixiv" },
                    { name: "🦋 Bluesky", value: "bluesky" },
                    { name: "🎼 Bandcamp", value: "bandcamp" },
                    { name: "💻 Github", value: "github" })
                .setRequired(true)))

        .addSubcommand(subcommand => subcommand
            .setName("simulate")
            .setDescription("Permet de faire des simulations pour tester les probabilités !")
            .addStringOption(option => option
                .setName("secret-code")
                .setDescription("Ce code n'est pas un easter egg et sert juste comme double vérification !")
                .setRequired(true))
            .addIntegerOption(option => option
                .setName("amount")
                .setDescription("Le nombre de tirage à faire.")
                .setRequired(true))
            .addStringOption(option => option
                .setName("data-set")
                .setDescription("Avec quels données faire la simulation ?")
                .addChoices(
                    { name: "🕘 Daily", value: "daily" },
                    { name: "📅 Weekly", value: "weekly" },
                    { name: "🐟 Poissons", value: "fish" },
                    { name: "💎 Minerais", value: "ore" },
                    { name: "🗿 Artéfacts", value: "artefact" },
                    { name: "🐦 Photo d'oiseaux", value: "bird" },
                    { name: "🎴 Cartes", value: "card" })
                .setRequired(true))
            .addBooleanOption(option => option
                .setName("rare")
                .setDescription("Faut-il augmenter la chance ?")
                .setRequired(false))
            .addBooleanOption(option => option
                .setName("has-more-bonus")
                .setDescription("Activer le bonus supplémentaire pour le daily (super bonus) et la mine (chemin secondaire) ?")
                .setRequired(false)))

        .addSubcommand(subcommand => subcommand
            .setName("query")
            .setDescription("Permet de faire des requêtes à la base de données.")
            .addStringOption(option => option
                .setName("secret-code")
                .setDescription("Ce code n'est pas un easter egg et sert juste comme double vérification !")
                .setRequired(true))
            .addStringOption(option => option
                .setName("sql")
                .setDescription("La requête SQL.")
                .setRequired(true))),
    async execute(interaction, client) {
        try {
            const secretCode = interaction.options.getString("secret-code");

            if (interaction.user.id !== "610493430325313549")
                return await interaction.reply({ content: "❌ Cette commande n'est pas pour toi !", flags: [MessageFlags.Ephemeral] });
            if (secretCode !== process.env.SECRET_DEV_CODE)
                return await interaction.reply({ content: "❌ Le code est invalide !", flags: [MessageFlags.Ephemeral] });

            switch (interaction.options.getSubcommand()) {
                case "create-code":
                    const codeRewards = interaction.options.getString("rewards");
                    const codeExpiration = interaction.options.getString("expiration");
                    const codeOwner = interaction.options.getString("owner");
                    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
                    const firstPattern = Math.floor(Math.random() * 899) + 100;
                    const thirdPattern = Math.floor(Math.random() * 899) + 100;
                    let secondPattern = "";

                    for (let i = 0; i < 3; i++) {
                        secondPattern += letters[Math.floor(Math.random() * letters.length)];
                    }

                    await interaction.reply({ content: `${firstPattern}-${secondPattern}-${thirdPattern}`, flags: [MessageFlags.Ephemeral] });
                    break;

                case "eval":
                    function cleanEval(text) {
                        if (typeof (text) === "string") {
                            return text.replace(/`/g, "`" + String.fromCharCode(8203)).replaceAll("@", "@" + String.fromCharCode(8203));
                        } else {
                            return text;
                        }
                    }

                    const code = interaction.options.getString("code");
                    const messageID = interaction.options.getString("message-id") ?? null;
                    const isAsync = interaction.options.getBoolean("is-async") ?? false;

                    try {
                        if (messageID !== null && !await interaction.channel.messages?.fetch(messageID))
                            return await interaction.reply({ content: "Can't fetch message !", flags: [MessageFlags.Ephemeral] });

                        let evaled;
                        messageID === null ? isAsync ? evaled = await eval(code) : evaled = eval(code) : evaled = eval(`interaction.channel.messages?.fetch(messageID).then(interaction => { ${code} });`);

                        if (typeof evaled !== "string") evaled = require("util").inspect(evaled);

                        const evalFinal = cleanEval(evaled).substring(0, 4000);

                        const devEmbed = new EmbedBuilder()
                            .setColor([29, 245, 0])
                            .setDescription(`## ✅ Success !\n\`${code}\`\n\n\`\`\`js\n${evalFinal}\`\`\`\n\n`)
                            .setTimestamp()
                            .setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL({ extension: "png", size: 64 }) });

                        await interaction.reply({ embeds: [devEmbed], flags: [MessageFlags.Ephemeral] });
                    } catch (error) {
                        const errorDevEmbed = new EmbedBuilder()
                            .setColor([224, 0, 0])
                            .setDescription(`## ❌ Error...\n\`${code}\`\n\n\`\`\`js\n${cleanEval(error)}\`\`\`\n\n`)
                            .setTimestamp()
                            .setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL({ extension: "png", size: 64 }) });

                        await interaction.reply({ embeds: [errorDevEmbed], flags: [MessageFlags.Ephemeral] });
                    }
                    break;

                case "delete":
                    const deleteRawTable = interaction.options.getString("table");
                    const deleteTable = deleteRawTable === "users" ? keyvUsers : deleteRawTable === "guilds" ? keyvGuilds : keyvToki;
                    const deleteKey = interaction.options.getString("key");
                    const deleteValue = interaction.options.getString("value");

                    if (deleteValue) {
                        await deleteTable.query(`UPDATE ${deleteRawTable} SET value = (value::jsonb - '${deleteValue}')::text WHERE key = '${deleteKey}';`);

                        await interaction.reply({ content: `La valeur \`${deleteValue}\` de la clé \`${deleteKey}\` a bien était supprimée de la table \`${deleteRawTable}\` !`, flags: [MessageFlags.Ephemeral] });
                    } else {
                        await deleteTable.delete(deleteKey);

                        await interaction.reply({ content: `La clé \`${deleteKey}\` a bien était supprimée de la table \`${deleteRawTable}\` !`, flags: [MessageFlags.Ephemeral] });
                    }
                    break;

                case "file":
                    const fileAction = interaction.options.getString("action");
                    let filePath = interaction.options.getString("file-path");

                    try {
                        switch (fileAction) {
                            case "open":
                                await interaction.reply({ files: [`./${filePath}`], flags: [MessageFlags.Ephemeral] });
                                break;

                            case "list":
                                !filePath.endsWith("/") ? filePath = `${filePath}/` : filePath;

                                let folders = [];
                                let files = [];

                                readdirSync(filePath).forEach(file => {
                                    if (existsSync(`${filePath}${file}`) && lstatSync(`${filePath}${file}`).isDirectory()) {
                                        folders.push(`- ${file}`);
                                    } else {
                                        files.push(`+ ${file}`);
                                    }
                                });

                                const finalList = `${folders.join("\n")}\n${files.join("\n")}`;

                                await interaction.reply({ content: `\`\`\`diff\n${finalList}\n\`\`\``, flags: [MessageFlags.Ephemeral] });
                                break;

                            case "reload":
                                await client.user.setStatus(PresenceUpdateStatus.DoNotDisturb);

                                const commandName = filePath.match(/(?=[^\/]+$)(.*(?=\.))/)[0];
                                const command = interaction.client.commands.get(commandName);

                                if (!command)
                                    return await interaction.reply({ content: `❌ Il n'y a pas de commande \`/${commandName}\` !`, flags: [MessageFlags.Ephemeral] });

                                delete require.cache[require.resolve(`../../${filePath}`)];

                                const newCommand = require(`../../${filePath}`);

                                await interaction.client.commands.set(newCommand.data.name, newCommand);
                                await interaction.reply({ content: `✅ La commande \`/${newCommand.data.name}\` a bien été rechargée !`, flags: [MessageFlags.Ephemeral] });

                                await client.user.setStatus(PresenceUpdateStatus.Online);
                                break;
                        }
                    } catch (error) {
                        const errorDevEmbed = new EmbedBuilder()
                            .setColor([224, 0, 0])
                            .setDescription(`## ❌ Error...\n\n\`\`\`js\n${cleanEval(error)}\`\`\`\n\n`)
                            .setTimestamp()
                            .setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL({ extension: "png", size: 64 }) });

                        await interaction.reply({ embeds: [errorDevEmbed], flags: [MessageFlags.Ephemeral] });
                    }
                    break;

                case "give":
                    try {
                        const giveItem = interaction.options.getString("item");
                        const giveValue = interaction.options.getInteger("value");
                        const giveUserID = interaction.options.getUser("user").id;
                        const giveIsAdditive = interaction.options.getBoolean("is-additive");

                        await updateValue(giveUserID, "users", giveItem, giveValue, giveIsAdditive);

                        await interaction.reply({ content: `<@${giveUserID}> a bien obtenu ${await simplify(interaction.user.id, giveValue, true)} (${giveValue}) ${giveItem} !`, flags: [MessageFlags.Ephemeral] });
                    } catch (error) {
                        const errorDevEmbed = new EmbedBuilder()
                            .setColor([224, 0, 0])
                            .setDescription(`## ❌ Error...\n\n\`\`\`js\n${cleanEval(error)}\`\`\`\n\n`)
                            .setTimestamp()
                            .setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL({ extension: "png", size: 64 }) });

                        await interaction.reply({ embeds: [errorDevEmbed], flags: [MessageFlags.Ephemeral] });
                    }
                    break;

                case "rss":
                    await interaction.deferReply({ flags: [MessageFlags.Ephemeral] });

                    const feed = interaction.options.getString("feed");
                    let finalMessage = "";
                    let result;

                    if (feed === "all") {
                        const socialMediaNames = Object.keys(socialMediaRoutes);
                        let socialMediaName;

                        for (let i = 0; i < socialMediaNames.length; i++) {
                            socialMediaName = socialMediaNames[i];

                            result = await sendMessage(client, socialMediaRoutes[socialMediaName], socialMediaName);

                            finalMessage += !result["error"] ? `✅ Message envoyé pour ${socialMediaName} !\n` : `❌ Erreur avec ${socialMediaName} : **${result["message"].toLowerCase()}**\n`;
                        }
                    } else {
                        result = await sendMessage(client, socialMediaRoutes[feed], feed);

                        !result["error"] ? finalMessage = "✅ La notification du dernier post a bien été envoyée !" : finalMessage = `❌ Une erreur s'est produite : **${result["message"].toLowerCase()}**`;
                    }

                    await interaction.editReply({ content: finalMessage });
                    break;

                case "simulate":
                    await interaction.deferReply({ flags: [MessageFlags.Ephemeral] });

                    const simulationIterations = interaction.options.getInteger("amount");
                    const simulationDataSet = interaction.options.getString("data-set");
                    const simulationRarity = interaction.options.getBoolean("rare");
                    const simulationHasMoreBonus = interaction.options.getBoolean("has-more-bonus");
                    const cooldownTimes = await getCooldownList();
                    const dataSets = {
                        "artefact": artefactTable,
                        "bird": birdTable,
                        "card": cards,
                        "fish": fishTable,
                        "ore": oreTable
                    };
                    const dataCooldowns = {
                        "artefact": cooldownTimes["arkeology"],
                        "bird": cooldownTimes["snap-bird"],
                        "daily": cooldownTimes["daily"],
                        "fish": cooldownTimes["fish"],
                        "ore": cooldownTimes["pikpik"],
                        "weekly": cooldownTimes["weekly"]
                    };
                    let simulationResult = {};
                    let finalTokiCoinGain = 0;
                    let finalCookieGain = 0;
                    let totalSeconds = 0;
                    let finalResult = "";

                    for (let i = 0; i < simulationIterations; i++) {
                        if (simulationDataSet === "daily") {
                            finalTokiCoinGain += Math.floor((Math.floor(Math.random() * 300) + 200) * (1 + (simulationRarity ? 100 + i : i) / 100));
                        } else if (simulationDataSet === "weekly") {
                            finalTokiCoinGain += Math.floor((Math.floor(Math.random() * 2_000) + 1_000));
                        } else {
                            const item = getRandomItem(dataSets[simulationDataSet], simulationRarity, simulationHasMoreBonus);
                            const itemName = item?.catchedName;

                            itemName in simulationResult ? simulationResult[itemName] += 1 : simulationResult[itemName] = 1;

                            if (simulationDataSet !== "card")
                                item.currency === "cookie" ? finalCookieGain += item.price : finalTokiCoinGain += item.price;
                        }

                        if (simulationDataSet != "card")
                            totalSeconds += dataCooldowns[simulationDataSet] / 1_000;
                    }

                    if (simulationDataSet === "daily" || simulationDataSet === "weekly") {
                        if (simulationHasMoreBonus)
                            finalTokiCoinGain *= 3;

                        finalResult = `${getCurrencySymbol("toki-coin")} : ${await simplify(interaction.user.id, finalTokiCoinGain, true)} (${finalTokiCoinGain})`;
                    } else {
                        const sortedResult = Object.fromEntries(Object.entries(simulationResult).sort((a, b) => b[1] - a[1]));

                        for (let i = 0; i < Object.keys(sortedResult).length; i++) {
                            finalResult += `**${Object.keys(sortedResult)[i]}** : ${Object.values(sortedResult)[i]}\n`;
                        }

                        if (simulationDataSet !== "card")
                            finalResult += `\n${getCurrencySymbol("toki-coin")} : ${await simplify(interaction.user.id, finalTokiCoinGain, true)} (${finalTokiCoinGain})\n${getCurrencySymbol("cookie")} : ${await simplify(interaction.user.id, finalCookieGain, true)} (${finalCookieGain})`;
                    }

                    if (totalSeconds != 0)
                        finalResult += `\n\n> *⌚️ Estimation du temps de jeu : ${moment.duration(totalSeconds, "seconds").format("d[j] H[h] m[m]")}*`;

                    await interaction.editReply({ content: finalResult });
                    break;

                case "query":
                    const query = interaction.options.getString("sql");

                    const pool = new Pool({
                        connectionString: `postgresql://${process.env.DATABASE_USER}:${process.env.DATABASE_PASSWORD}@${process.env.DATABASE_HOST}/${process.env.DATABASE_NAME}`,
                        ssl: process.env.TESTING_MODE === "false" ? { rejectUnauthorized: false } : false
                    });

                    try {
                        const queryResult = await pool.query(query);
                        let tableContent = "";
                        const headers = Object.keys(queryResult.rows[0]);
                        const columnWidths = headers.map(header => Math.max(header.length, ...queryResult.rows.map(row => `${row[header]}`.length)));

                        tableContent += `| ${headers.map((header, index) => header.padEnd(columnWidths[index])).join(' | ')} |\n`;
                        tableContent += `|${columnWidths.map(width => '-'.repeat(width + 2)).join('|')}|\n`;

                        queryResult.rows.forEach(row => {
                            tableContent += `| ${headers.map((header, index) => `${row[header]}`.padEnd(columnWidths[index])).join(' | ')} |\n`;
                        });

                        const queryEmbed = new EmbedBuilder()
                            .setColor([14, 207, 0])
                            .setDescription(`## ✅ Success !\n\`${query}\`\n\n\`\`\`sql\n${tableContent.slice(0, 4045)}\`\`\`\n\n`)
                            .setTimestamp()
                            .setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL({ extension: "png", size: 64 }) });

                        await interaction.reply({ embeds: [queryEmbed], flags: [MessageFlags.Ephemeral] });
                    } catch (error) {
                        const errorQueryEmbed = new EmbedBuilder()
                            .setColor([224, 0, 0])
                            .setDescription(`## ❌ Error...\n\`${query}\`\n\n\`\`\`js\n${cleanEval(error)}\`\`\`\n\n`)
                            .setTimestamp()
                            .setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL({ extension: "png", size: 64 }) });

                        await interaction.reply({ embeds: [errorQueryEmbed], flags: [MessageFlags.Ephemeral] });
                    }
                    break;
            }
        } catch (error) {
            await sendError(interaction, client, error);
        }
    }
};