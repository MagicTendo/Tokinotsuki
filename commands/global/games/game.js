const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, StringSelectMenuBuilder, AttachmentBuilder, MessageFlags } = require("discord.js");
const { getDictionary } = require("simple-spellchecker");
const puzzleLevels = require("../../../json/puzzles.json");
const { cardValues, cardSymbols, deckToValue } = require("../../../tools/card.js");
const { canCreateCollector, endCollector } = require("../../../tools/collectors-manager.js");
const { getCooldownList, hasCooldownFinished, resetCooldown } = require("../../../tools/cooldown.js");
const { getValue, updateValue, hasValue } = require("../../../tools/database.js");
const { sendError } = require("../../../tools/error-catcher.js");
const { adventureFlags, flagToTeam } = require("../../../tools/flags.js");
const { getRandomItem, sendResult } = require("../../../tools/game-result.js");
const { fishTable, birdTable, artefactTable, uniqueItemEmojis } = require("../../../tools/items-table.js");
const { addTeamPoints, completeQuest, getCurrencySymbol, getPing, getWinningTeam, simplify, capitalize } = require("../../../tools/modules.js");

module.exports = {
    category: "Jeux",
    data: new SlashCommandBuilder()
        .setName("game")
        .setDescription("Contient tous les jeux, permettant ou non, de gagner le l'argent.")
        .setIntegrationTypes([0])
        .setContexts([0])
        .addSubcommand(subcommand => subcommand
            .setName("adventure")
            .setDescription("Un jeu d'aventure où des ressources sont nécessaire pour envoyer Miyunira à l'aventure !"))

        .addSubcommand(subcommand => subcommand
            .setName("arkeology")
            .setDescription("Un jeu d'archéologie où il faut faire attention de ne pas se faire voler !"))

        .addSubcommand(subcommand => subcommand
            .setName("blackjack")
            .setDescription("Permet de jouer au blackjack avec des règles simplifiées.")
            .addIntegerOption(option => option
                .setName("bet")
                .setDescription("Ta mise en Toki Coins, ne pouvant pas dépasser 100 000.")
                .setMinValue(1)
                .setMaxValue(100_000)
                .setRequired(true)))

        .addSubcommand(subcommand => subcommand
            .setName("congelo")
            .setDescription("Concept repris de la commande +explo du bot Discord Hasu."))

        .addSubcommand(subcommand => subcommand
            .setName("fight")
            .setDescription("Un petit jeu de combat à la RPG où il faut vaincre un ennemi en tour par tour."))

        .addSubcommand(subcommand => subcommand
            .setName("fish")
            .setDescription("Un simple jeu de pêche avec divers poissons à attraper."))

        .addSubcommand(subcommand => subcommand
            .setName("gtn")
            .setDescription("Un jeu où il faut trouver un nombre choisi au hasard.")
            .addStringOption(option => option
                .setName("difficulty")
                .setDescription("Choisis ta difficulté.")
                .addChoices(
                    { name: "👍 Facile", value: "easy" },
                    { name: "💡 Moyen", value: "normal" },
                    { name: "🔥 Difficile", value: "hard" },
                    { name: "💢 Ultra difficile", value: "hardcore" },
                    { name: "🔄️ Inversé", value: "inverted" })
                .setRequired(true)))

        .addSubcommand(subcommand => subcommand
            .setName("guess-my-ping")
            .setDescription("Jeu où tu dois essayer de trouver ma latence exacte en millisecondes.")
            .addIntegerOption(option => option
                .setName("ping")
                .setDescription("Ta prédiction de ma latence en millisecondes.")
                .setRequired(true)))

        .addSubcommand(subcommand => subcommand
            .setName("jackpot")
            .setDescription("Jouable toutes les heures, si les 3 émojis sont les mêmes, c'est gagné !")
            .addStringOption(option => option
                .setName("machine")
                .setDescription("Choisis ta machine. Le prix en Toki Coin est indiqué entre parenthèses.")
                .addChoices(
                    { name: "🪙 Toki Fortune (500)", value: "toki-fortune" },
                    { name: "🍪 Cookie Deluxe (1 500)", value: "cookie-deluxe" },
                    { name: "🧭 Gold Adventure (900)", value: "gold-adventure" })
                .setRequired(true)))

        .addSubcommand(subcommand => subcommand
            .setName("minesweeper")
            .setDescription("Pour jouer au jeu du démineur, mais il n'y a rien à gagner..."))

        .addSubcommand(subcommand => subcommand
            .setName("pikpik")
            .setDescription("Jeu se passant dans une mine, où il faut miner pour avoir le meilleur minerai."))

        .addSubcommand(subcommand => subcommand
            .setName("puzzle")
            .setDescription("Un jeu d'énigme où il faut trouver un code pour passer au niveau suivant.")
            .addStringOption(option => option
                .setName("code")
                .setDescription("Le code pour passer au niveau suivant. En ne mettant rien, tu accédera au niveau 0.")
                .setRequired(false)))

        .addSubcommand(subcommand => subcommand
            .setName("snap-bird")
            .setDescription("Permet de tenter de photographier des oiseaux pour gagner de l'argent."))

        .addSubcommand(subcommand => subcommand
            .setName("tictactoe")
            .setDescription("Pour jouer au jeu du morpion !"))

        .addSubcommand(subcommand => subcommand
            .setName("rock-paper-scissors")
            .setDescription("Permet de jouer au chifoumi contre moi.")
            .addStringOption(option => option
                .setName("move")
                .setDescription("Choisis ton action.")
                .addChoices(
                    { name: "✊ Pierre", value: "rock" },
                    { name: "✋ Feuille", value: "paper" },
                    { name: "✌️ Ciseaux", value: "scissors" })
                .setRequired(true)))

        .addSubcommand(subcommand => subcommand
            .setName("roulette")
            .setDescription("Permet de doubler ta mise, ou tout perdre !")
            .addIntegerOption(option => option
                .setName("bet")
                .setDescription("Ta mise en Toki Coins, ne pouvant pas dépasser 5 000.")
                .setMinValue(1)
                .setMaxValue(5_000)
                .setRequired(true))
            .addStringOption(option => option
                .setName("color")
                .setDescription("Choisis une couleur.")
                .addChoices(
                    { name: "🟥 Rouge", value: "red" },
                    { name: "⚫ Noir", value: "black" })
                .setRequired(true))),
    async execute(interaction, client) {
        try {
            const userID = interaction.user.id;
            const gameType = interaction.options.getSubcommand();
            const betAmount = interaction.options?.getInteger("bet");
            const cooldownList = await getCooldownList();
            const gamesWithCooldown = ["arkeology", "blackjack", "fight", "fish", "gtn", "guess-my-ping", "jackpot", "pikpik", "snap-bird", "roulette"];

            if (!gamesWithCooldown.includes(gameType) || await hasCooldownFinished(interaction, gameType, cooldownList[gameType])) {
                switch (gameType) {
                    case "adventure":
                        const adventureStatus = await getValue(userID, "users", "adventure-status");

                        if (adventureStatus === adventureFlags.failed) {
                            const adventureBackTime = await getValue(userID, "users", "adventure-time") + await getValue(userID, "users", "adventure-duration");

                            if (adventureBackTime <= Date.now()) {
                                await updateValue(userID, "users", "adventure-status", adventureFlags.none, false);
                            } else {
                                return await interaction.reply({ content: `⌚ Attends encore un peu, tu pourras refaire une expédition <t:${Math.round(adventureBackTime / 1_000)}:R> !`, flags: [MessageFlags.Ephemeral] });
                            }
                        }

                        if (adventureStatus > adventureFlags.none) {
                            const rewardRanges = [[50_000, 75_000], [80_000, 100_000], [2_500, 5_000], [30_000, 40_000], [15_000, 25_000], [5_000, 12_500]];

                            if (adventureStatus === adventureFlags.failed) {
                                await updateValue(userID, "users", "adventure-status", adventureFlags.failed, false);
                                await updateValue(userID, "users", "adventure-time", Date.now(), false);
                                await updateValue(userID, "users", "adventure-duration", 172_800_000, false);

                                const adventureEmbed = new EmbedBuilder()
                                    .setColor([255, 85, 0])
                                    .setTitle("L'expédition est terminée !")
                                    .setDescription("L'aventure s'est mal passée par manque de ressources... Miyunira sera de nouveau disponible dans 2 jours !")
                                    .setTimestamp()
                                    .setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL({ extension: "png", size: 64 }) });

                                await interaction.reply({ embeds: [adventureEmbed] });
                            } else {
                                const prizeRange = rewardRanges[adventureStatus - 2];
                                const prize = Math.floor(Math.random() * prizeRange[1] - prizeRange[0]) + prizeRange[0];

                                await updateValue(userID, "users", "adventure-status", adventureFlags.none, false);
                                await updateValue(userID, "users", "toki-coin", prize);

                                const adventureEmbed = new EmbedBuilder()
                                    .setColor([255, 85, 0])
                                    .setTitle("L'expédition est terminée !")
                                    .setDescription(`Grâce aux découvertes de Miyunira, cela t'as rapporté ${await simplify(userID, prize)} ${getCurrencySymbol("toki-coin")} !`)
                                    .setTimestamp()
                                    .setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL({ extension: "png", size: 64 }) });

                                await interaction.reply({ embeds: [adventureEmbed] });
                            }
                        } else {
                            const adventurePreparationButtons = new ActionRowBuilder().addComponents(
                                new ButtonBuilder()
                                    .setEmoji({ name: "🍴" })
                                    .setLabel("Provision de nourriture (0)")
                                    .setStyle(ButtonStyle.Primary)
                                    .setCustomId(`adventure_food-provision_0_0_${userID}`),
                                new ButtonBuilder()
                                    .setEmoji({ name: "💧" })
                                    .setLabel("Provision d'eau (0)")
                                    .setStyle(ButtonStyle.Success)
                                    .setCustomId(`adventure_water-provision_1_0_${userID}`),
                                new ButtonBuilder()
                                    .setEmoji({ name: "🩹" })
                                    .setLabel("Kit de soin (0)")
                                    .setStyle(ButtonStyle.Danger)
                                    .setCustomId(`adventure_care-kit_2_0_${userID}`),
                                new ButtonBuilder()
                                    .setEmoji({ name: "💤" })
                                    .setLabel("Kit de nuit (0)")
                                    .setStyle(ButtonStyle.Secondary)
                                    .setCustomId(`adventure_sleep-kit_3_0_${userID}`));

                            const adventurePreparationMenu = new ActionRowBuilder().addComponents(
                                new StringSelectMenuBuilder()
                                    .setPlaceholder("🗺️ Régions")
                                    .addOptions([{
                                        emoji: { name: "❄️" },
                                        label: "Yukidami",
                                        description: "Une région très froide et dangereuse.",
                                        value: "yukidami_3_10800000",
                                    },
                                    {
                                        emoji: { name: "🌋" },
                                        label: "Yōgandaichi",
                                        description: "Une région volcanique encore active.",
                                        value: "yogandaichi_5_18000000",
                                    },
                                    {
                                        emoji: { name: "🌳" },
                                        label: "Tennenrin",
                                        description: "Une forêt plutôt calme.",
                                        value: "tennenrin_0_600000",
                                    },
                                    {
                                        emoji: { name: "🕯️" },
                                        label: "Reidaihōsun",
                                        description: "Une grotte remplie d'âme, d'esprits et de spectres.",
                                        value: "reidaihosun_4_7200000",
                                    },
                                    {
                                        emoji: { name: "❔" },
                                        label: "Iryūjon",
                                        description: "Une forêt avec des propriétés bizarres.",
                                        value: "iryujon_2_3600000",
                                    },
                                    {
                                        emoji: { name: "🏚️" },
                                        label: "Arkotalan",
                                        description: "Une ancienne ville en ruine.",
                                        value: "arkotalan_1_1800000",
                                    }])
                                    .setCustomId(`adventure_region_${userID}`));

                            const adventurePreparationEmbed = new EmbedBuilder()
                                .setColor([255, 85, 0])
                                .setTitle("Préparations pour l'aventure !")
                                .setDescription("### Ressources\n> D'abord, donne autant de **ressources** que nécessaire pour l'aventure, la **quantité dépendra de la difficulté de la localisation**. Une localisation **plus compliquée demandera plus de ressources et de temps**, mais apporte de **meilleurs récompenses**. Les ressources sont achetable depuis **le magasin de Kerusuna**. S'il n'y a pas assez de ressources, **Miyunira ne pourra pas repartir en aventure pendant 2 jours** le temps qu'elle soit rapatriée, s'il en a trop, **tu perderas l'excédent**. Une fois la quantités des ressources choisies, **choisi la région dans laquelle partir**, et l'aventure commencera directement !\n\n### Difficultés des régions\n**Yukidami** : Plutôt dangereuse (≈ 10 🍴 | 15 💧 | 8 🩹 | 5 💤 | 3h 🕰️)\n**Yōgandaichi** : Très dangereuse (≈ 15 🍴 | 25 💧 | 10 🩹 | 5 💤 | 5h 🕰️)\n**Tennenrin** : Très calme (≈ 1 🍴 | 2 💧 | 1 🩹 | 0 💤 | 10m 🕰️)\n**Reidaihōsun** : Dangereux (≈ 10 🍴 | 15 💧 | 8 🩹 | 4 💤 | 2h 🕰️)\n**Iryūjon** : Un peu dangereux (≈ 5 🍴 | 10 💧 | 5 🩹 | 3 💤 | 1h 🕰️)\n**Arkotalan** : Peu dangereux (≈ 3 🍴 | 5 💧 | 5 🩹 | 1 💤 | 30m 🕰️)")
                                .setTimestamp()
                                .setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL({ extension: "png", size: 64 }) });

                            await interaction.reply({ embeds: [adventurePreparationEmbed], components: [adventurePreparationButtons, adventurePreparationMenu] });
                        }
                        break;

                    case "arkeology":
                        const userBrush = await getValue(userID, "users", "brush");

                        if (userBrush < 1 && await resetCooldown(userID, "arkeology"))
                            return await interaction.reply({ content: "❌ Tu as besoin d'avoir un pinceau du magasin de Kerusuna !", flags: [MessageFlags.Ephemeral] });

                        const hasBrushUpgrade = userBrush > 1;
                        const username = interaction.user.globalName;
                        const randomDelay = Math.floor(Math.random() * 270_000) + 30_000;
                        let timeApproximation;

                        if (randomDelay < 60_000) {
                            timeApproximation = "moins d'une minute";
                        } else if (randomDelay >= 60_000 && randomDelay < 200_000) {
                            timeApproximation = "2 minutes ou plus";
                        } else {
                            timeApproximation = "5 minutes ou moins";
                        }

                        await interaction.reply({ content: `${uniqueItemEmojis[`brush${hasBrushUpgrade ? "-upgrade" : ""}`]} Fouille de ${username} en cours ! Le temps est estimé à environ ${timeApproximation}...` });

                        const artefact = getRandomItem(artefactTable, hasBrushUpgrade);

                        setTimeout(async () => {
                            await sendResult(artefact, "arkeology", interaction, userID);
                        }, randomDelay);
                        break;

                    case "blackjack":
                        if (betAmount > await getValue(userID, "users", "toki-coin") && await resetCooldown(userID, "blackjack"))
                            return await interaction.reply({ content: "❌ Tu n'as pas autant d'argent à miser !", flags: [MessageFlags.Ephemeral] });

                        await updateValue(userID, "users", "toki-coin", -betAmount);

                        await fetch("https://deckofcardsapi.com/api/deck/new/shuffle/?jokers_enabled=false").then(function (response) {
                            return response.json();
                        }).then(async function (deckData) {
                            const deckID = deckData["deck_id"];

                            await fetch(`https://deckofcardsapi.com/api/deck/${deckID}/draw/?count=3`).then(function (response) {
                                return response.json();
                            }).then(async function (cardData) {
                                const dealerCards = [];
                                const playerCards = [];

                                for (let i = 0; i < 3; i++) {
                                    const card = cardData["cards"][i];
                                    const cardValue = card["value"];
                                    const cardName = (cardValues[cardValue] ?? cardValue) + cardSymbols[card["suit"]];

                                    i === 0 ? dealerCards.push(cardName) : playerCards.push(cardName);
                                }

                                const dealerTotal = await deckToValue(dealerCards);
                                const playerTotal = await deckToValue(playerCards);

                                const blackjackButtons = new ActionRowBuilder().addComponents(
                                    new ButtonBuilder()
                                        .setEmoji({ name: "🎴" })
                                        .setLabel("Hit")
                                        .setStyle(ButtonStyle.Primary)
                                        .setCustomId(`blackjack_hit_${deckID}_${dealerCards.join("-")}_${playerCards.join("-")}_${betAmount}_${userID}`),
                                    new ButtonBuilder()
                                        .setEmoji({ name: "✋" })
                                        .setLabel("Stand")
                                        .setStyle(ButtonStyle.Secondary)
                                        .setCustomId(`blackjack_stand_${deckID}_${dealerCards.join("-")}_${playerCards.join("-")}_${betAmount}_${userID}`));

                                const cardEmbed = new EmbedBuilder()
                                    .setColor([255, 0, 0])
                                    .setTitle("Blackjack")
                                    .setDescription("Tu dois dépasser la main de Tokinotsuki sans dépasser la valeur 21 !\n\n> 🎴 Hit : Pioche une carte.\n> ✋ Stand : Valide tes cartes.\n\n** **")
                                    .setFields(
                                        { name: "🟠 __Tokinotsuki__", value: `${dealerCards[0]} | ?? (**${dealerTotal}**)`, inline: true },
                                        { name: `🔵 __${interaction.user.globalName}__`, value: `${playerCards.join(" | ")} (**${playerTotal}**)`, inline: true })
                                    .setTimestamp()
                                    .setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL({ extension: "png", size: 64 }) });

                                await interaction.reply({ embeds: [cardEmbed], components: [blackjackButtons] });
                            });
                        });
                        break;

                    case "congelo":
                        if (await canCreateCollector(interaction, interaction.guild.id)) {
                            const chains = ["ai", "ans", "ant", "at", "au", "bi", "eau", "ère", "ff", "fr", "ge", "gr", "ie", "il", "le", "ll", "ma", "me", "na", "ne", "nie", "on", "pa", "po", "ra", "rap", "re", "su", "tr", "vr"];
                            const randomChainIndex = Math.floor(Math.random() * chains.length);
                            const randomChain = chains[randomChainIndex];
                            const timeLeftPartyTimestamp = `<t:${Math.floor(Date.now() / 1_000 + 60)}:R>`;
                            const players = [userID];
                            const previousWords = [];
                            const scores = {};
                            const partyStaticDescription = `> Les règles sont simples ! Une série de 2 à 3 lettres sera donnée. Le but est de trouver le plus de mots français unique ayant cette série de lettre. Si vous arrivez à utiliser toutes les lettres de l'alphabet au moins une fois, vous obtiendrez une vie supplémentaire. Le gagnant est celui qui a trouvé le plus de mots !\n\nPour rejoindre, écrit \`+join\` (ou \`+leave\` pour quitter) ! Début ${timeLeftPartyTimestamp}.`;
                            const allLetters = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"];
                            let letters = allLetters;
                            let lives = 3;

                            const partyCollector = await interaction.channel.createMessageCollector({ filter: message => !message.author.bot, time: 60_000 });

                            let congeloPartyEmbed = new EmbedBuilder()
                                .setColor([3, 169, 252])
                                .setTitle(`Congelo ${getCurrencySymbol("congelo")}`)
                                .setDescription(`## Joueurs (${players.length})\n${players.map(player => `<@${player}>`).join(" ")}\n\n${partyStaticDescription}`)
                                .setTimestamp()
                                .setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL({ extension: "png", size: 64 }) });

                            await interaction.reply({ embeds: [congeloPartyEmbed] });

                            partyCollector.on("collect", async message => {
                                const authorID = message.author.id;

                                await message.delete();

                                if (message.content === "+join") {
                                    if (players.length >= 9)
                                        return await interaction.followUp({ content: "❌ La partie est au complet !", flags: [MessageFlags.Ephemeral] });

                                    if (!players.includes(authorID)) {
                                        players.push(authorID);

                                        await interaction.editReply({ embeds: [congeloPartyEmbed] });
                                    } else {
                                        await interaction.followUp({ content: "❌ Tu es déjà dans la partie !", flags: [MessageFlags.Ephemeral] });
                                    }
                                } else if (message.content === "+leave") {
                                    players.splice(players.indexOf(authorID), 1);

                                    await interaction.editReply({ embeds: [congeloPartyEmbed] });
                                }

                                if (message.content.startsWith("+")) {
                                    congeloPartyEmbed = new EmbedBuilder(congeloPartyEmbed.data).setDescription(`## Joueurs (${players.length})\n${players.map(player => `<@${player}>`).join(" ")}\n\n${partyStaticDescription}`);

                                    await interaction.editReply({ embeds: [congeloPartyEmbed] });
                                }
                            });

                            partyCollector.on("end", async () => {
                                if (players.length <= 1)
                                    return await interaction.editReply({ embeds: [new EmbedBuilder(congeloPartyEmbed.data).setColor([158, 0, 37]).setDescription("## Partie annulée !")] });

                                await congelo();
                            });

                            async function congelo(multiplier = 0) {
                                const timeLeft = 20_000 - (1_000 * multiplier);
                                const timeLeftTimestamp = `<t:${Math.floor((Date.now() + timeLeft) / 1_000)}:R>`;
                                const gameCollector = await interaction.channel.createMessageCollector({ filter: message => players.includes(message.author.id), time: timeLeft });
                                let wordFound = false;

                                const gameStartStaticDescription = `## Joueurs (${players.length})\n${players.map(player => `<@${player}>`).join(" ")}\n\n**Partie en cours !**`;
                                const gameEndStaticDescription = `Vies\n> ${"❤️".repeat(lives)}\n\nLe mot doit contenir **\`${randomChain.toUpperCase()}\`**.`;
                                let congeloGameEmbed = new EmbedBuilder()
                                    .setColor([0, 98, 255])
                                    .setTitle(`Congelo ${getCurrencySymbol("congelo")}`)
                                    .setDescription(`${gameStartStaticDescription}\nLettres non utilisées\n> ${letters.join(" ")}\n\nTemps restant de la manche\n> ${timeLeftTimestamp} ${wordFound ? "✅" : "❌"}\n\n${gameEndStaticDescription}`)
                                    .setTimestamp()
                                    .setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL({ extension: "png", size: 64 }) });

                                await interaction.editReply({ embeds: [congeloGameEmbed] });

                                gameCollector.on("collect", async message => {
                                    if (!players.includes(message.author.id))
                                        return;

                                    const answer = message.content;

                                    await message.delete();

                                    if (await checkAnswer(answer, randomChain) && !previousWords.includes(answer)) {
                                        const authorID = message.author.id;
                                        scores[authorID] ? scores[authorID] += 1 : scores[authorID] = 1;

                                        previousWords.push(answer);

                                        wordFound = true;
                                        letters = letters.filter(letter => !answer.split("").includes(letter));
                                        congeloGameEmbed = new EmbedBuilder(congeloGameEmbed.data).setDescription(`${gameStartStaticDescription}\nLettres non utilisées\n> ${letters.join(" ")}\n\nTemps restant de la manche\n> ${timeLeftTimestamp} ${wordFound ? "✅" : "❌"}\n\n${gameEndStaticDescription}`);

                                        if (letters.length <= 0) {
                                            letters = allLetters;
                                            lives === 3 ? lives = 3 : lives += 1;
                                        }

                                        await interaction.editReply({ embeds: [congeloGameEmbed] });
                                    } else {
                                        await interaction.followUp({ content: "❌ Le mot est incorrecte ou a déjà été dit !", flags: [MessageFlags.Ephemeral] });
                                    }
                                });

                                gameCollector.on("end", async message => {
                                    if (!wordFound)
                                        lives -= 1;

                                    if (lives <= 0) {
                                        await endCongelo();
                                    } else {
                                        await congelo(multiplier >= 15 ? multiplier = 15 : multiplier += 1);
                                    }
                                });
                            }

                            async function checkAnswer(answer, letters) {
                                const dictionary = await new Promise((resolve, reject) => {
                                    getDictionary("fr-FR", async function (error, dictionary) {
                                        if (error)
                                            reject(await sendError(error));

                                        resolve(dictionary);
                                    });
                                });

                                return await dictionary.spellCheck(answer) && await answer.includes(letters);
                            }

                            async function endCongelo() {
                                const leaderboard = Object.keys(scores).map(k => ([k, scores[k]])).sort((a, b) => (b[1] - a[1])).slice(0, 10);
                                const winner = leaderboard[0];
                                const winnerID = winner?.[0];
                                const winnerScore = winner?.[1] ?? 0;

                                await endCollector(interaction.guild.id);

                                const congeloEndEmbed = new EmbedBuilder()
                                    .setColor([3, 169, 252])
                                    .setTitle(`Congelo ${getCurrencySymbol("congelo")}`)
                                    .setTimestamp()
                                    .setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL({ extension: "png", size: 64 }) });

                                if (winnerScore === 0) {
                                    congeloEndEmbed.setDescription("Personne n'a gagné...");
                                } else {
                                    let finalLeaderboard = "";

                                    for (let i = 0; i < leaderboard.length; i++) {
                                        await updateValue(leaderboard[i][0], "users", "congelo", leaderboard[i][1]);

                                        if (await getValue(leaderboard[i][0], "users", "congelo") >= 200)
                                            await completeQuest(leaderboard[i][0], "icy");
                                        if (i !== 0)
                                            finalLeaderboard += `**${i + 1}** - <@${leaderboard[i][0]}> | \`${leaderboard[i][1]}\` points\n`;
                                    }

                                    const userTeamFlag = await getValue(winnerID, "users", "team");
                                    const userTeamName = await flagToTeam(userTeamFlag);

                                    if (userTeamFlag > 0)
                                        await addTeamPoints(interaction, winnerID, winnerScore, false);

                                    congeloEndEmbed.setDescription(`### <@${winnerID}> a gagné avec ${winnerScore} points !${userTeamFlag > 0 ? ` Il fait gagner autant de points à l'équipe ${userTeamName} !` : ""}\n\n${finalLeaderboard}`);
                                }

                                await interaction.editReply({ embeds: [congeloEndEmbed] });
                            }
                        }
                        break;

                    case "fight":
                        const fightWinningTeam = await getWinningTeam(userID);
                        const fighters = {
                            "Suyasomin": {
                                "emoji": "💫",
                                "color": ButtonStyle.Success,
                                "health": 50,
                                "defense": 10,
                                "attack": 10,
                                "available": true
                            },
                            "Inosayo": {
                                "emoji": "🔥",
                                "color": ButtonStyle.Danger,
                                "health": 75,
                                "defense": 40,
                                "attack": 15,
                                "available": await hasValue(userID, "users", "inosayo")
                            },
                            "Oseitena": {
                                "emoji": "🌌",
                                "color": ButtonStyle.Secondary,
                                "health": 100,
                                "defense": 25,
                                "attack": 20,
                                "available": await hasValue(userID, "users", "oseitena")
                            },
                            "Mijilse": {
                                "emoji": "🎴",
                                "color": ButtonStyle.Primary,
                                "health": 50,
                                "defense": 15,
                                "attack": 20,
                                "available": fightWinningTeam["isUserTeamWinning"]
                            }
                        };

                        const fightButtons = new ActionRowBuilder();

                        const fightEmbed = new EmbedBuilder()
                            .setColor([83, 0, 87])
                            .setTitle("Choisi quel personnage faire combattre !")
                            .setTimestamp()
                            .setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL({ extension: "png", size: 64 }) });

                        for (let i = 0; i < Object.keys(fighters).length; i++) {
                            const fighterName = Object.keys(fighters)[i];
                            const fighter = fighters[fighterName];

                            if (fighter["available"]) {
                                fightEmbed.addFields({ name: `${fighter["emoji"]} ${fighterName}`, value: `${fighter["health"]} ❤️ ${fighter["defense"]} 🛡️ ${fighter["attack"]} 👊`, inline: true });

                                fightButtons.addComponents(
                                    new ButtonBuilder()
                                        .setEmoji({ name: fighter["emoji"] })
                                        .setLabel(fighterName)
                                        .setStyle(fighter["color"])
                                        .setCustomId(`fight_start_${`${fighter["emoji"]} ${fighterName}`}_${fighter["health"]}_${fighter["defense"]}_${fighter["attack"]}_${userID}`));
                            }
                        }

                        await interaction.reply({ embeds: [fightEmbed], components: [fightButtons] });
                        break;

                    case "fish":
                        const userFishingRod = await getValue(userID, "users", "fishing-rod");

                        if (userFishingRod < 1 && await resetCooldown(userID, "fish"))
                            return await interaction.reply({ content: "❌ Tu as besoin d'avoir une canne à pêche du magasin de Kerusuna !", flags: [MessageFlags.Ephemeral] });

                        const hasFishingRodUpgrade = userFishingRod > 1;

                        await interaction.reply({ content: `${uniqueItemEmojis[`fishing-rod${hasFishingRodUpgrade ? "-upgrade" : ""}`]} En attente d'une prise...` });

                        const fish = getRandomItem(fishTable, hasFishingRodUpgrade);

                        setTimeout(async () => {
                            await sendResult(fish, "fish", interaction, userID);
                        }, 1_500);
                        break;

                    case "gtn":
                        function getRandomNumber(minimum, maximum) {
                            return Math.floor(Math.random() * (minimum - maximum + 1)) + maximum;
                        }

                        const difficulty = interaction.options.getString("difficulty");
                        let isInverted = difficulty === "inverted";
                        let hasFound = false;
                        let guessRange = [0, 500];
                        let lastGuess = await getRandomNumber(guessRange[0], guessRange[1]);
                        let attempts = 0;
                        let range;
                        let teamPoints;
                        let rewardBonus;

                        switch (difficulty) {
                            case "easy":
                                range = [0, 1_000];
                                rewardBonus = 2;
                                break;

                            case "normal":
                                range = [0, 10_000];
                                teamPoints = 1;
                                rewardBonus = 5;
                                break;

                            case "hard":
                                range = [0, 100_000];
                                teamPoints = 3;
                                rewardBonus = 15;
                                break;

                            case "hardcore":
                                range = [-250_000, 250_000];
                                teamPoints = 10;
                                rewardBonus = 50;
                                break;

                            case "inverted":
                                range = guessRange;
                                teamPoints = 2;
                                break;
                        }

                        const randomNumber = await getRandomNumber(range[0], range[1]);
                        const gtnCollector = interaction.channel.createMessageCollector({ filter: message => message.author.id === userID, time: 60_000 });

                        await interaction.reply({ content: isInverted ? `Le nombre a été choisis, c'est ||${randomNumber}|| ! Tu as une minute pour me le faire deviner en me disant \`plus\`, \`moins\` ou \`exact\` ! Ma première tentative est **${lastGuess}**` : "Le nombre a été choisis ! Tu as une minute pour le trouver !" });

                        gtnCollector.on("collect", async message => {
                            attempts++;

                            if (isInverted) {
                                if (guessRange[0] > guessRange[1] || guessRange[1] < guessRange[0] || (guessRange[0] === guessRange[1] && guessRange[0] !== randomNumber)) {
                                    hasFound = true;

                                    await gtnCollector.stop();

                                    return await message.reply({ content: "Hmmm, selon tes indications, cela n'est pas possible ! Partie terminée..." });
                                }

                                if (message.content.toLowerCase() === "plus" || message.content === "+")
                                    guessRange = [lastGuess + 1, guessRange[1]];
                                if (message.content.toLowerCase() === "moins" || message.content === "-")
                                    guessRange = [guessRange[0], lastGuess - 1];

                                if (message.content.toLowerCase() === "exact" || message.content.toLowerCase() === "oui" || message.content.toLowerCase() === "ok" || message.content.toLowerCase() === "gg" || message.content === "=") {
                                    if (lastGuess === randomNumber) {
                                        hasFound = true;

                                        await gtnCollector.stop();

                                        const reward = Math.floor(((Math.random() * 100) + 250) / attempts);

                                        await updateValue(userID, "users", "toki-coin", reward);

                                        await message.reply({ content: `Oui, j'ai gagné en ${attempts} tentative(s) ! Tu remportes ${reward} ${getCurrencySymbol("toki-coin")} ! :D` });
                                        return await addTeamPoints(interaction, userID, teamPoints);
                                    } else {
                                        return await message.reply({ content: "Non, ce n'est pas ça ! D:" });
                                    }
                                }

                                lastGuess = await getRandomNumber(guessRange[0], guessRange[1]);

                                await message.reply({ content: `${lastGuess} ?` });
                            } else {
                                if (message.content > randomNumber)
                                    return await message.reply({ content: "Plus petit !" });
                                if (message.content < randomNumber)
                                    return await message.reply({ content: "Plus grand !" });

                                if (message.content == randomNumber) {
                                    hasFound = true;

                                    if (difficulty === "hardcore" && attempts <= 15)
                                        await completeQuest(userID, "gtn");

                                    const reward = Math.floor(((Math.random() * 225) + (125 * rewardBonus)) / (attempts / rewardBonus + 1));

                                    await updateValue(userID, "users", "toki-coin", reward);

                                    await message.reply({ content: `Oui, le nombre était bien \`${randomNumber}\` ! Tu l'as trouvé en ${attempts} tentatives ! Tu remportes ${await simplify(userID, reward)} ${getCurrencySymbol("toki-coin")} !` });

                                    if (teamPoints)
                                        await addTeamPoints(interaction, userID, teamPoints);

                                    await gtnCollector.stop();
                                }
                            }
                        });

                        gtnCollector.on("end", async collected => {
                            if (!hasFound)
                                await interaction.followUp({ content: isInverted ? "Tu n'as pas réussi à me faire trouver le nombre à temps..." : `Tu n'as pas trouvé le nombre dans le temps imparti... Le nombre était \`${randomNumber}\` !` });
                        });
                        break;

                    case "guess-my-ping":
                        const guessedPing = interaction.options.getInteger("ping");

                        const ping = await getPing(interaction);
                        const pingDifference = ping - guessedPing;

                        const pingEmbed = new EmbedBuilder()
                            .setColor([255, 85, 0])
                            .setDescription(`🏓 Pong <@${userID}> !\n\n🛜 Ma latence (round-trip latency) est de **${ping}ms** !\n📊 Tu es à **${pingDifference}ms** de décalage !`);

                        await interaction.editReply({ content: "", embeds: [pingEmbed] });

                        if (pingDifference === 0) {
                            await updateValue(userID, "users", "cookie", 9);
                            await interaction.followUp({ content: `Tu as trouvé mon ping, félicitation ! Tu as gagné 9 ${getCurrencySymbol("cookie")} !` });
                            await addTeamPoints(interaction, userID, 3);
                        }
                        break;

                    case "jackpot":
                        const machineName = interaction.options.getString("machine");
                        const userJackpotTokiCoins = await getValue(userID, "users", "toki-coin");
                        const machinePrices = {
                            "toki-fortune": 500,
                            "cookie-deluxe": 1_000,
                            "gold-adventure": 1_500
                        };

                        if (machinePrices[machineName] > userJackpotTokiCoins && await resetCooldown(userID, "jackpot"))
                            return await interaction.reply({ content: `❌ Tu n'as pas autant d'argent pour jouer ! Il te manque ${await simplify(userID, machinePrices[machineName] - userJackpotTokiCoins)} ${getCurrencySymbol("toki-coin")} !`, flags: [MessageFlags.Ephemeral] });

                        await updateValue(userID, "users", "toki-coin", -machinePrices[machineName]);

                        let prizes;

                        switch (machineName) {
                            case "toki-fortune":
                                prizes = { "🪙": ["toki-coin", 5_000], "💴": ["toki-coin", 9_000], "💰": ["toki-coin", 15_000] };
                                break;

                            case "cookie-deluxe":
                                prizes = { "🍴": ["cookie", 9], "☕️": ["cookie", 18], "🍫": ["cookie", 27], "🍪": ["cookie", 36], "🎴": ["booster-pack", 3] };
                                break;

                            case "gold-adventure":
                                prizes = { "🍽️": ["food-provision", 9], "💧": ["water-provision", 9], "⛑️": ["care-kit", 9], "💤": ["sleep-kit", 9] };
                                break;
                        }

                        const rows = [[], [], []];
                        let jackpotStatus = "*Perdu...*";
                        let prizeList = "";

                        for (let i = 0; i < 3; i++) {
                            for (let j = 0; j < 3; j++) {
                                do {
                                    rows[i][j] = Object.keys(prizes)[Math.floor(Math.random() * Object.keys(prizes).length)];
                                } while ((i === 1 && rows[0][j] === rows[i][j]) || (i === 2 && (rows[0][j] === rows[i][j] || rows[1][j] === rows[i][j])));
                            }
                        }

                        for (let i = 0; i < Object.keys(prizes).length; i++) {
                            const prizeEmoji = Object.keys(prizes)[i];
                            const prize = prizes[prizeEmoji];

                            prizeList += `-# ${prizeEmoji} ➔ **${await simplify(userID, prize[1])}** ${prize[0].replaceAll("-", " ").replace("toki coin", "Toki Coin")}s\n`;
                        }

                        if (rows[1].every(symbol => symbol === rows[1][0])) {
                            const prizeData = prizes[rows[1][0]];

                            await updateValue(userID, "users", prizeData[0], prizeData[1]);

                            jackpotStatus = `Tu as gagné ${await simplify(userID, prizeData[1])} ${getCurrencySymbol(prizeData[0])} !`;
                        }

                        const jackpotEmbed = new EmbedBuilder()
                            .setColor([255, 85, 0])
                            .setTitle(`/ ~ ${capitalize(machineName.split("-")[0])} ${capitalize(machineName.split("-")[1])} ~ \\`)
                            .setDescription(`** **\n\`\`\`\n    ${rows[0].join(" | ")}\n  > ${rows[1].join(" | ")}\n    ${rows[2].join(" | ")}\n\`\`\`\n> ${jackpotStatus}\n\n${prizeList}`)
                            .setTimestamp()
                            .setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL({ extension: "png", size: 64 }) });

                        await interaction.reply({ embeds: [jackpotEmbed] });
                        break;

                    case "minesweeper":
                        const tileSymbols = { 0: "0️⃣", 1: "1️⃣", 2: "2️⃣", 3: "3️⃣", 4: "4️⃣", 5: "5️⃣", 6: "6️⃣", 7: "7️⃣", 8: "8️⃣", "x": "💣" };
                        const width = 9;
                        const height = 9;
                        const maximumBombs = 30;
                        const minimumBombs = 5;
                        const bombs = Math.floor(Math.random() * maximumBombs) + minimumBombs;
                        const grid = new Array(height).fill().map(() => new Array(width).fill(0));
                        let finalGrid = "||";
                        let remainingBombs = bombs;

                        while (remainingBombs > 0) {
                            const randomX = Math.floor(Math.random() * width);
                            const randomY = Math.floor(Math.random() * height);

                            if (grid[randomY][randomX] !== "x") {
                                grid[randomY][randomX] = "x";
                                remainingBombs -= 1;
                            }
                        }

                        for (let i = 0; i < grid.length; i++) {
                            const x = i;

                            for (let j = 0; j < grid[i].length; j++) {
                                const y = j;

                                if (grid[x][y] === "x") {
                                    if (x - 1 >= 0 && grid[x - 1][y] !== "x")
                                        grid[x - 1][y] += 1;
                                    if (x + 1 < grid.length && typeof grid[x + 1][y] !== "undefined" && grid[x + 1][y] !== "x")
                                        grid[x + 1][y] += 1;
                                    if (y - 1 >= 0 && grid[x][y - 1] !== "x")
                                        grid[x][y - 1] += 1;
                                    if (y + 1 < grid[0].length && typeof grid[x][y + 1] !== "undefined" && grid[x][y + 1] !== "x")
                                        grid[x][y + 1] += 1;
                                    if (x + 1 < grid.length && y + 1 < grid[0].length && typeof grid[x + 1][y + 1] !== "undefined" && grid[x + 1][y + 1] !== "x")
                                        grid[x + 1][y + 1] += 1;
                                    if (x + 1 < grid.length && y - 1 >= 0 && typeof grid[x + 1][y - 1] !== "undefined" && grid[x + 1][y - 1] !== "x")
                                        grid[x + 1][y - 1] += 1;
                                    if (x - 1 >= 0 && y + 1 < grid[0].length && typeof grid[x - 1][y + 1] !== "undefined" && grid[x - 1][y + 1] !== "x")
                                        grid[x - 1][y + 1] += 1;
                                    if (x - 1 >= 0 && y - 1 >= 0 && grid[x - 1][y - 1] !== "x")
                                        grid[x - 1][y - 1] += 1;
                                }
                            }
                        }

                        for (let i = 0; i < grid.length; i++) {
                            for (let j = 0; j < grid[i].length; j++) {
                                finalGrid += `${tileSymbols[grid[i][j]]}||||`;
                            }

                            finalGrid += "\n";
                        }

                        finalGrid += "||";

                        await interaction.reply({ content: finalGrid, flags: [MessageFlags.Ephemeral] });
                        break;

                    case "pikpik":
                        const userPickaxe = await getValue(userID, "users", "pickaxe");

                        if (userPickaxe < 1 && await resetCooldown(userID, "pikpik"))
                            return await interaction.reply({ content: "❌ Tu as besoin d'avoir une pioche du magasin de Kerusuna !", flags: [MessageFlags.Ephemeral] });

                        const hasPickaxeUpgrade = userPickaxe > 1;

                        await interaction.reply({ content: `${uniqueItemEmojis[`pickaxe${hasPickaxeUpgrade ? "-upgrade" : ""}`]} En route vers la mine !` });

                        setTimeout(async () => {
                            await sendResult({ catchedName: "Un caillou", keptName: "Le caillou", color: [87, 87, 87], price: "50", shortName: "rock" }, "pikpik", interaction, userID, hasPickaxeUpgrade);
                        }, 1_000);
                        break;

                    case "puzzle":
                        await interaction.deferReply({ flags: [MessageFlags.Ephemeral] });

                        const code = interaction.options.getString("code") ?? null;
                        const codes = process.env.PUZZLE_CODES.split(",");

                        let puzzleFiles = [];
                        let puzzleLevelEmbed = new EmbedBuilder()
                            .setColor([255, 85, 0])
                            .setTimestamp()
                            .setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL({ extension: "png", size: 64 }) });

                        if (code !== null) {
                            switch (code.toLowerCase().replace("ω", "Ω")) {
                                case codes[0]:
                                    puzzleLevelEmbed.setTitle("Niveau 2")
                                        .setDescription(puzzleLevels["2"]);
                                    break;

                                case codes[1]:
                                    puzzleLevelEmbed.setTitle("Niveau 3")
                                        .setDescription(puzzleLevels["3"]);
                                    break;

                                case codes[2]:
                                    puzzleLevelEmbed.setTitle("Niveau 4")
                                        .setDescription(puzzleLevels["4"].split(";")[0])
                                        .setFooter({ text: puzzleLevels["4"].split(";")[1], iconURL: client.user.displayAvatarURL({ extension: "png", size: 64 }) });
                                    break;

                                case codes[3]:
                                    puzzleLevelEmbed.setTitle("Niveau 5")
                                        .setDescription(puzzleLevels["5"]);
                                    break;

                                case codes[4]:
                                    puzzleLevelEmbed.setTitle("Niveau 6")
                                        .setDescription(puzzleLevels["6"]);
                                    break;

                                case codes[5]:
                                    puzzleFiles.push(`./assets/puzzles/level-7.png`);

                                    puzzleLevelEmbed.setTitle("Niveau 7")
                                        .setDescription(puzzleLevels["7"])
                                        .setImage(`attachment://level-7.png`);
                                    break;

                                case codes[6]:
                                    puzzleLevelEmbed.setTitle("Niveau 8")
                                        .setDescription(puzzleLevels["8"]);
                                    break;

                                case codes[7]:
                                    const file = new AttachmentBuilder("./assets/puzzles/level-9", { name: "level-9" });

                                    puzzleFiles.push(file);

                                    puzzleLevelEmbed.setTitle("Niveau 9")
                                        .setDescription(puzzleLevels["9"]);
                                    break;

                                case codes[8]:
                                    puzzleLevelEmbed.setTitle("Niveau 10")
                                        .setDescription(puzzleLevels["10"]);
                                    break;

                                case codes[9]:
                                    const audioFile = new AttachmentBuilder("./assets/puzzles/level-8.wav", { name: "level-8.wav" });

                                    puzzleFiles.push(audioFile);

                                    puzzleLevelEmbed.setTitle("Niveau 11")
                                        .setDescription(puzzleLevels["11"]);
                                    break;

                                case codes[10]:
                                    puzzleLevelEmbed.setTitle("Niveau 12")
                                        .setDescription(puzzleLevels["12"]);
                                    break;

                                case codes[11]:
                                    puzzleLevelEmbed.setTitle("Niveau 13")
                                        .setDescription(puzzleLevels["13"]);
                                    break;

                                case codes[12]:
                                    puzzleFiles.push("./assets/puzzles/level-14.jpg");

                                    puzzleLevelEmbed.setTitle("Niveau 14")
                                        .setDescription(puzzleLevels["14"])
                                        .setImage("attachment://level-14.jpg");
                                    break;

                                case codes[13]:
                                    puzzleLevelEmbed.setTitle("Félicitations !")
                                        .setDescription(puzzleLevels["15"]);
                                    break;

                                default:
                                    puzzleLevelEmbed.setColor([109, 97, 100])
                                        .setTitle("!!! ERREUR !!!")
                                        .setDescription(`❌ Le code \`${code}\` est invalide !`);
                                    break;
                            }
                        } else {
                            puzzleLevelEmbed.setTitle("Niveau 1")
                                .setDescription(puzzleLevels["1"]);
                        }

                        await interaction.editReply({ embeds: [puzzleLevelEmbed], files: puzzleFiles });
                        break;

                    case "snap-bird":
                        const userCamera = await getValue(userID, "users", "camera");

                        if (userCamera < 1 && await resetCooldown(userID, "snap-bird"))
                            return await interaction.reply({ content: "❌ Tu as besoin d'avoir un appareil photo du magasin de Kerusuna !", flags: [MessageFlags.Ephemeral] });

                        const hasCameraUpgrade = userCamera > 1;

                        await interaction.reply({ content: `${uniqueItemEmojis[`camera${hasCameraUpgrade ? "-upgrade" : ""}`]} Préparation de la caméra...` });

                        const bird = getRandomItem(birdTable, hasCameraUpgrade);

                        setTimeout(async () => {
                            await sendResult(bird, "bird", interaction, userID);
                        }, 500);
                        break;

                    case "tictactoe":
                        const tictactoeFirstRowButtons = new ActionRowBuilder().addComponents(
                            new ButtonBuilder()
                                .setEmoji({ name: "⬛" })
                                .setStyle(ButtonStyle.Secondary)
                                .setCustomId(`tictactoe_0_0_${userID}`),
                            new ButtonBuilder()
                                .setEmoji({ name: "⬛" })
                                .setStyle(ButtonStyle.Secondary)
                                .setCustomId(`tictactoe_1_0_${userID}`),
                            new ButtonBuilder()
                                .setEmoji({ name: "⬛" })
                                .setStyle(ButtonStyle.Secondary)
                                .setCustomId(`tictactoe_2_0_${userID}`));

                        const tictactoeSecondRowButtons = new ActionRowBuilder().addComponents(
                            new ButtonBuilder()
                                .setEmoji({ name: "⬛" })
                                .setStyle(ButtonStyle.Secondary)
                                .setCustomId(`tictactoe_0_1_${userID}`),
                            new ButtonBuilder()
                                .setEmoji({ name: "⬛" })
                                .setStyle(ButtonStyle.Secondary)
                                .setCustomId(`tictactoe_1_1_${userID}`),
                            new ButtonBuilder()
                                .setEmoji({ name: "⬛" })
                                .setStyle(ButtonStyle.Secondary)
                                .setCustomId(`tictactoe_2_1_${userID}`));

                        const tictactoeThirdRowButtons = new ActionRowBuilder().addComponents(
                            new ButtonBuilder()
                                .setEmoji({ name: "⬛" })
                                .setStyle(ButtonStyle.Secondary)
                                .setCustomId(`tictactoe_0_2_${userID}`),
                            new ButtonBuilder()
                                .setEmoji({ name: "⬛" })
                                .setStyle(ButtonStyle.Secondary)
                                .setCustomId(`tictactoe_1_2_${userID}`),
                            new ButtonBuilder()
                                .setEmoji({ name: "⬛" })
                                .setStyle(ButtonStyle.Secondary)
                                .setCustomId(`tictactoe_2_2_${userID}`));

                        const tictactoeEmbed = new EmbedBuilder()
                            .setColor([255, 85, 0])
                            .setTitle("Morpion !")
                            .setTimestamp()
                            .setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL({ extension: "png", size: 64 }) });

                        await interaction.reply({ embeds: [tictactoeEmbed], components: [tictactoeFirstRowButtons, tictactoeSecondRowButtons, tictactoeThirdRowButtons] });
                        break;

                    case "rock-paper-scissors":
                        const userMove = interaction.options.getString("move");
                        const actions = { "rock": "🪨", "paper": "📄", "scissors": "✂️" };
                        const randomActionIndex = Math.floor(Math.random() * Object.keys(actions).length);
                        const tokiMove = Object.keys(actions)[randomActionIndex];
                        const userMoveEmoji = actions[userMove];
                        const tokiMoveEmoji = actions[tokiMove];
                        const affrontation = `# ${userMoveEmoji} 🆚 ${tokiMoveEmoji}`;
                        let hasWon;

                        if (userMove === tokiMove) {
                            return await interaction.reply({ content: `${affrontation}\n➖ Égalité !`, flags: [MessageFlags.Ephemeral] });
                        }

                        switch (userMove) {
                            case "rock":
                                if (tokiMove === "paper") {
                                    hasWon = false;
                                } else if (tokiMove === "scissors") {
                                    hasWon = true;
                                }
                                break;

                            case "paper":
                                if (tokiMove === "rock") {
                                    hasWon = true;
                                } else if (tokiMove === "scissors") {
                                    hasWon = false;
                                }
                                break;

                            case "scissors":
                                if (tokiMove === "rock") {
                                    hasWon = false;
                                } else if (tokiMove === "paper") {
                                    hasWon = true;
                                }
                                break;
                        }

                        if (hasWon) {
                            const reward = Math.floor(Math.random() * 25) + 25;

                            await updateValue(userID, "users", "toki-coin", reward);
                            await interaction.reply({ content: `${affrontation}\n✅ Gagné ! Tu remportes ${reward} ${getCurrencySymbol("toki-coin")} !`, flags: [MessageFlags.Ephemeral] });
                            await addTeamPoints(interaction, userID, 1);
                        } else {
                            await interaction.reply({ content: `${affrontation}\n❌ Perdu !`, flags: [MessageFlags.Ephemeral] });
                        }
                        break;

                    case "roulette":
                        const userRouletteTokiCoins = await getValue(userID, "users", "toki-coin");
                        const rouletteWinningTeam = await getWinningTeam(userID);
                        const isUserTeamWinning = rouletteWinningTeam["isUserTeamWinning"];

                        if ((isUserTeamWinning && betAmount * 2 > userRouletteTokiCoins) || betAmount > userRouletteTokiCoins)
                            return await interaction.reply({ content: "❌ Tu n'as pas autant d'argent à miser !", flags: [MessageFlags.Ephemeral] });

                        const betColor = interaction.options.getString("color");
                        const colors = { "red": ["🟥", "rouge"], "black": ["⚫", "noire"] };
                        const randomColorIndex = Math.floor(Math.random() * Object.keys(colors).length);
                        const randomColor = Object.keys(colors)[randomColorIndex];

                        if (betColor === randomColor) {
                            const gain = isUserTeamWinning ? betAmount * 3 : betAmount * 2;

                            await updateValue(userID, "users", "toki-coin", gain);
                            await interaction.reply({ content: `${colors[randomColor][0]} Bravo, la couleur était bien ${colors[randomColor][1]} ! Tu as ${isUserTeamWinning ? "triplé" : "doublé"} ta mise et gagné ${await simplify(userID, gain)} ${getCurrencySymbol("toki-coin")} !` });
                        } else {
                            const lose = isUserTeamWinning ? Math.min(betAmount * 2, userRouletteTokiCoins) : betAmount;

                            await updateValue(userID, "users", "toki-coin", -lose);
                            await interaction.reply({ content: `${colors[randomColor][0]} Tu as perdu, la couleur était ${colors[randomColor][1]}... Tu as perdu ${isUserTeamWinning ? "le double de ta mise, soit" : "ta mise de"} ${await simplify(userID, lose)} ${getCurrencySymbol("toki-coin")} !` });
                        }
                        break;
                }
            }
        } catch (error) {
            await sendError(interaction, client, error);
        }
    }
};