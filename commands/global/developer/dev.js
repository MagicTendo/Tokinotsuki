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
                .setDescription("Ce code n'est pas un easter egg et sert comme double vérification !")
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
                .setDescription("Ce code n'est pas un easter egg et sert comme double vérification !")
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
                .setDescription("Ce code n'est pas un easter egg et sert comme double vérification !")
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
                .setDescription("Ce code n'est pas un easter egg et sert comme double vérification !")
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
                .setDescription("Ce code n'est pas un easter egg et sert comme double vérification !")
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
            .setName("simulate")
            .addStringOption(option => option
                .setName("secret-code")
                .setDescription("Ce code n'est pas un easter egg et sert comme double vérification !")
                .setRequired(true))
            .setDescription("Permet de faire des simulations pour tester les probabilités !")
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
            .setName("tesuto")
            .setDescription("Juste une commande de test qui peut faire des trucs divers.")
            .addStringOption(option => option
                .setName("secret-code")
                .setDescription("Ce code n'est pas un easter egg et sert comme double vérification !")
                .setRequired(true)))

        .addSubcommand(subcommand => subcommand
            .setName("query")
            .setDescription("Permet de faire des requêtes à la base de données.")
            .addStringOption(option => option
                .setName("secret-code")
                .setDescription("Ce code n'est pas un easter egg et sert comme double vérification !")
                .setRequired(true))
            .addStringOption(option => option
                .setName("sql")
                .setDescription("La requête SQL.")
                .setRequired(true))),
    async execute(interaction, client) {
        try {
            const secretCode = interaction.options.getString("secret-code");

            if (interaction.user.id !== "610493430325313549")
                return await interaction.reply({ content: "❌ Cette commande n'est pas pour toi !", flags: MessageFlags.Ephemeral });
            if (secretCode !== process.env.SECRET_DEV_CODE)
                return await interaction.reply({ content: "❌ Le code est invalide !", flags: MessageFlags.Ephemeral });

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

                    await interaction.reply({ content: `${firstPattern}-${secondPattern}-${thirdPattern}`, flags: MessageFlags.Ephemeral });
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
                            return await interaction.reply({ content: "Can't fetch message !", flags: MessageFlags.Ephemeral });

                        let evaled;
                        messageID === null ? isAsync ? evaled = await eval(code) : evaled = eval(code) : evaled = eval(`interaction.channel.messages?.fetch(messageID).then(interaction => { ${code} });`);

                        if (typeof evaled !== "string") evaled = require("util").inspect(evaled);

                        const evalFinal = cleanEval(evaled).substring(0, 4000);

                        const devEmbed = new EmbedBuilder()
                            .setColor([29, 245, 0])
                            .setDescription(`## ✅ Success !\n\`${code}\`\n\n\`\`\`js\n${evalFinal}\`\`\`\n\n`)
                            .setTimestamp()
                            .setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL({ extension: "png", size: 64, dynamic: true }) });

                        await interaction.reply({ embeds: [devEmbed], flags: MessageFlags.Ephemeral });
                    } catch (error) {
                        const errorDevEmbed = new EmbedBuilder()
                            .setColor([224, 0, 0])
                            .setDescription(`## ❌ Error...\n\`${code}\`\n\n\`\`\`js\n${cleanEval(error)}\`\`\`\n\n`)
                            .setTimestamp()
                            .setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL({ extension: "png", size: 64, dynamic: true }) });

                        await interaction.reply({ embeds: [errorDevEmbed], flags: MessageFlags.Ephemeral });
                    }
                    break;

                case "delete":
                    const deleteRawTable = interaction.options.getString("table");
                    const deleteTable = deleteRawTable === "users" ? keyvUsers : deleteRawTable === "guilds" ? keyvGuilds : keyvToki;
                    const deleteKey = interaction.options.getString("key");
                    const deleteValue = interaction.options.getString("value");

                    if (deleteValue) {
                        await deleteTable.query(`UPDATE ${deleteRawTable} SET value = (value::jsonb - '${deleteValue}')::text WHERE key = '${deleteKey}';`);

                        await interaction.reply({ content: `La valeur \`${deleteValue}\` de la clé \`${deleteKey}\` a bien était supprimée de la table \`${deleteRawTable}\` !`, flags: MessageFlags.Ephemeral });
                    } else {
                        await deleteTable.delete(deleteKey);

                        await interaction.reply({ content: `La clé \`${deleteKey}\` a bien était supprimée de la table \`${deleteRawTable}\` !`, flags: MessageFlags.Ephemeral });
                    }
                    break;

                case "file":
                    const fileAction = interaction.options.getString("action");
                    let filePath = interaction.options.getString("file-path");

                    try {
                        switch (fileAction) {
                            case "open":
                                await interaction.reply({ files: [`./${filePath}`], flags: MessageFlags.Ephemeral });
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

                                await interaction.reply({ content: `\`\`\`diff\n${finalList}\n\`\`\``, flags: MessageFlags.Ephemeral });
                                break;

                            case "reload":
                                await client.user.setStatus(PresenceUpdateStatus.DoNotDisturb);

                                const commandName = filePath.match(/(?=[^\/]+$)(.*(?=\.))/)[0];
                                const command = interaction.client.commands.get(commandName);

                                if (!command)
                                    return await interaction.reply({ content: `❌ Il n'y a pas de commande \`/${commandName}\` !`, flags: MessageFlags.Ephemeral });

                                delete require.cache[require.resolve(`../../${filePath}`)];

                                const newCommand = require(`../../${filePath}`);

                                await interaction.client.commands.set(newCommand.data.name, newCommand);
                                await interaction.reply({ content: `✅ La commande \`/${newCommand.data.name}\` a bien été rechargée !`, flags: MessageFlags.Ephemeral });

                                await client.user.setStatus(PresenceUpdateStatus.Online);
                                break;
                        }
                    } catch (error) {
                        const errorDevEmbed = new EmbedBuilder()
                            .setColor([224, 0, 0])
                            .setDescription(`## ❌ Error...\n\n\`\`\`js\n${cleanEval(error)}\`\`\`\n\n`)
                            .setTimestamp()
                            .setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL({ extension: "png", size: 64, dynamic: true }) });

                        await interaction.reply({ embeds: [errorDevEmbed], flags: MessageFlags.Ephemeral });
                    }
                    break;

                case "give":
                    try {
                        const giveItem = interaction.options.getString("item");
                        const giveValue = interaction.options.getInteger("value");
                        const giveUserID = interaction.options.getUser("user").id;
                        const giveIsAdditive = interaction.options.getBoolean("is-additive");

                        await updateValue(giveUserID, "users", giveItem, giveValue, giveIsAdditive);

                        await interaction.reply({ content: `<@${giveUserID}> a bien obtenu ${await simplify(interaction.user.id, giveValue, true)} (${giveValue}) ${giveItem} !`, flags: MessageFlags.Ephemeral });
                    } catch (error) {
                        const errorDevEmbed = new EmbedBuilder()
                            .setColor([224, 0, 0])
                            .setDescription(`## ❌ Error...\n\n\`\`\`js\n${cleanEval(error)}\`\`\`\n\n`)
                            .setTimestamp()
                            .setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL({ extension: "png", size: 64, dynamic: true }) });

                        await interaction.reply({ embeds: [errorDevEmbed], flags: MessageFlags.Ephemeral });
                    }
                    break;

                case "tesuto":
                    // === Check if accounts existed with a list of IDs ===
                    // await interaction.deferReply({ flags: MessageFlags.Ephemeral });

                    // const retroUsers = ["USER_IDS"];
                    // const finalUsers = [];
                    // const embeds = [];
                    // let description = "";

                    // for (let i = 0; i < 10; i++) {
                    //     description = "";

                    //     for (let j = 0; j < retroUsers.length / 10; j++) {
                    //         console.log(`${(i * (retroUsers.length / 10)) + (j + 1)} / ${retroUsers.length} (${((i * (retroUsers.length / 10) + (j + 1)) / retroUsers.length * 100).toFixed(2)}%)`);

                    //         const userID = retroUsers[(i * (retroUsers.length / 10)) + j];
                    //         const user = await client.users.fetch?.(userID);
                    //         const isDeleted = !user || (user && user?.username?.startsWith("deleted_user"));

                    //         if (!isDeleted && !user.bot && userID != "610493430325313549")
                    //             finalUsers.push(userID);

                    //         description += `<@${userID}> ${isDeleted ? "❌" : "✅"}\n`;
                    //     }

                    //     const embed = new EmbedBuilder()
                    //         .setColor([255, 85, 0])
                    //         .setDescription(description);

                    //     embeds.push(embed);
                    // }

                    // const embed = new EmbedBuilder()
                    //     .setColor([255, 85, 0])
                    //     .setDescription(`[${finalUsers.join(",")}] (${finalUsers.length})`);

                    // await interaction.editReply({ embeds: embeds });
                    // await interaction.followUp({ embeds: [embed], flags: MessageFlags.Ephemeral });


                    // === Get v3 leaderboards ===
                    // await interaction.reply({ embeds: [tesutoEmbed], flags: MessageFlags.Ephemeral });

                    // const oldTokiCoinLeaderboardID = [["719970883938287720", 398534], ["743089421749977109", 366337], ["830313779182567476", 337339], ["286787996940894209", 252880], ["697438073646088194", 198550], ["385772850499420161", 113171], ["448847464884207627", 90202], ["426000385895825408", 70577], ["482897963744624660", 55315], ["730434563360424047", 48012], ["494552404747091969", 46775], ["718456289704804392", 27533], ["610493430325313549", 19813], ["833326528401637376", 19777], ["930832815468216400", 12417], ["526775472885858306", 12345], ["851871020188434492", 11399], ["781443974497435658", 10521], ["809053504030638121", 9004], ["692833570334572554", 8879], ["742438761530654861", 6791], ["723494807569170483", 6292], ["556454400772538388", 4769], ["887639389809819709", 2999], ["689028243256639524", 2557], ["807546731587829770", 2504], ["437504868840898569", 1897], ["1135850277644275732", 1366], ["277136155244232706", 1259], ["575656511691554816", 1180], ["713001105252155473", 1030], ["477485109403058176", 972], ["991024791970537544", 922], ["891610376985260033", 906], ["785591158280814664", 866], ["886353118491721779", 852], ["945376610767491092", 780], ["1026052826658504734", 735], ["916387535314386944", 728], ["767446931499909131", 715], ["826047634757517343", 681], ["827232338039144518", 679], ["576847831940464668", 640], ["419885376027623434", 637], ["763350993512562709", 636], ["784835010263777356", 619], ["587887807284903936", 563], ["615965033683484684", 555], ["458218450393890831", 545], ["928703852167962665", 535], ["919991063177990184", 524], ["922187797169848362", 485], ["638087966715019294", 484], ["629020731862286336", 472], ["447480244207616002", 464], ["708039665189388289", 448], ["726058517001273358", 431], ["1025082642485493870", 413], ["793281583985590302", 413], ["609300543730483201", 384], ["235425276903948289", 314], ["746022329511051324", 311], ["635411133091807254", 296], ["766291588708040734", 247], ["870253081659605002", 240], ["754033387072782396", 225], ["1057243614935261334", 28], ["495278377821798401", 2]];
                    // const oldTokiCoinLeaderboardName = [["Bebaal", 398534], ["Nagano", 366337], ["Arcose 🗣", 337339], ["Ska", 252880], ["Ninjdai", 198550], ["ScoobyBrown", 113171], ["MGW_Zoro", 90202], ["undefined", 70577], ["Richard Pudépié", 55315], ["undefined", 48012], ["undefined", 46775], ["Seaclye", 27533], ["BakaTaida", 19813], ["Leo Le Pik", 19777], ["undefined", 12417], [".", 12345], ["undefined", 11399], ["undefined", 10521], ["kapla", 9004], ["cool kyuju", 8879], ["Shadox", 6791], ["undefined", 6292], [".꧁╭⊱Zelda🌺 ⊱╮꧂", 4769], ["undefined", 2999], ["arno", 2557], ["undefined", 2504], ["Gab", 1897], ["˗ˏˋ 𝐀𝐥𝐢𝐚  ´ˎ˗", 1366], ["Dawn 🍊", 1259], ["ProHartz", 1180], ["Aélizya", 1030], ["Nono Mystica", 972], ["undefined", 922], ["Twentysix - Settings_Server", 906], ["polo3515", 866], ["undefined", 852], ["!   M. ARGOS 🦚", 780], ["undefined", 735], ["Mangaka Émancipé ☆♡☆", 728], ["undefined", 715], ["undefined", 681], ["Arcﾑde", 679], ["undefined", 640], ["[Ancien Compte] F²", 637], ["XinKaoDai", 636], ["undefined", 619], ["undefined", 563], ["undefined", 555], ["undefined", 545], ["Noah_411", 535], ["Adrien™", 524], ["undefined", 485], ["undefined", 484], ["Austcraft", 472], ["gaetan2wiish", 464], ["As(térion)unayo", 448], ["undefined", 431], [".", 413], ["undefined", 413], ["=+=ITHRI=+=", 384], ["Aznum_Shark", 314], ["undefined", 311], ["undefined", 296], ["liamvittoz", 247], ["undefined", 240], ["undefined", 225], ["GBZ team", 28], ["Neramawa", 2]];
                    // const oldCookieLeaderboardID = [["833326528401637376", 515], ["809053504030638121", 101], ["830313779182567476", 38], ["743089421749977109", 36], ["697438073646088194", 32], ["610493430325313549", 25], ["494552404747091969", 25], ["526775472885858306", 23], ["385772850499420161", 18], ["482897963744624660", 12], ["426000385895825408", 8], ["556454400772538388", 6], ["886353118491721779", 6], ["448847464884207627", 4], ["851871020188434492", 3], ["447040889651724289", 2], ["763350993512562709", 1], ["437504868840898569", 1], ["718456289704804392", 1], ["730434563360424047", 1], ["930832815468216400", 1], ["887639389809819709", 1], ["726058517001273358", 1], ["629020731862286336", 1]];
                    // const oldCookieLeaderboardName = [["Leo Le Pik", 515], ["kapla", 101], ["Arcose 🗣", 38], ["Nagano", 36], ["Ninjdai", 32], ["BakaTaida", 25], ["undefined", 25], [".", 23], ["ScoobyBrown", 18], ["Richard Pudépié", 12], ["undefined", 8], [".꧁╭⊱Zelda🌺 ⊱╮꧂", 6], ["undefined", 6], ["MGW_Zoro", 4], ["undefined", 3], ["undefined", 2], ["XinKaoDai", 1], ["Gab", 1], ["Seaclye", 1], ["undefined", 1], ["undefined", 1], ["undefined", 1], ["undefined", 1], ["Austcraft", 1]];
                    // const oldBugLeaderboardID = [["697438073646088194", 12], ["891610376985260033", 5], ["785591158280814664", 4], ["719970883938287720", 4], ["809053504030638121", 1], ["886353118491721779", 1]];
                    // const oldBugLeaderboardName = [["Ninjdai", 12], ["Twentysix - Settings_Server", 5], ["polo3515", 4], ["Bebaal", 4], ["kapla", 1], ["undefined", 1]];
                    // let description = "";

                    // for (let i = 0; i < oldTokiCoinLeaderboardID.length; i++) {
                    //     description += `${i + 1} | <@${oldTokiCoinLeaderboardID[i][0]}> - ${oldTokiCoinLeaderboardID[i][1]}\n`;
                    // }

                    // const tesutoEmbed = new EmbedBuilder()
                    //     .setColor([255, 85, 0])
                    //     .setDescription(description)

                    // await interaction.reply({ embeds: [tesutoEmbed], flags: MessageFlags.Ephemeral });


                    // === Check probabilities ===
                    // await interaction.reply({ content: String(Object.values(cards).map(item => item.probability).reduce((a, b) => a + b)), flags: MessageFlags.Ephemeral });
                    break;

                case "simulate":
                    await interaction.deferReply({ flags: MessageFlags.Ephemeral });

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
                        ssl: { rejectUnauthorized: false }
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
                            .setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL({ extension: "png", size: 64, dynamic: true }) });

                        await interaction.reply({ embeds: [queryEmbed], flags: MessageFlags.Ephemeral });
                    } catch (error) {
                        const errorQueryEmbed = new EmbedBuilder()
                            .setColor([224, 0, 0])
                            .setDescription(`## ❌ Error...\n\`${query}\`\n\n\`\`\`js\n${cleanEval(error)}\`\`\`\n\n`)
                            .setTimestamp()
                            .setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL({ extension: "png", size: 64, dynamic: true }) });

                        await interaction.reply({ embeds: [errorQueryEmbed], flags: MessageFlags.Ephemeral });
                    }
                    break;
            }
        } catch (error) {
            await sendError(interaction, client, error);
        }
    }
};