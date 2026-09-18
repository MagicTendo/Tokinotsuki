const { SlashCommandBuilder, EmbedBuilder, AttachmentBuilder, MessageFlags } = require("discord.js");
const Color = require("color").default;
const { readFileSync } = require("fs");
const { cardAcronyms } = require("../../../tools/card.js");
const { sendError } = require("../../../tools/error-catcher.js");
const { capitalize, getRandomKanji } = require("../../../tools/modules.js");

module.exports = {
    category: "Fun",
    data: new SlashCommandBuilder()
        .setName("random")
        .setDescription("Permet de générer pleins de choses diverses de façon aléatoire.")
        .setIntegrationTypes([0, 1])
        .setContexts([0, 1, 2])
        .addSubcommand(subcommand => subcommand
            .setName("animal")
            .setDescription("Affiche une image aléatoire d'un animal de ton choix.")
            .addStringOption(option => option
                .setName("type")
                .setDescription("Choisis une animal.")
                .addChoices(
                    { name: "🐡 Axolotl", value: "axolotl" },
                    { name: "🦆 Canard", value: "duck" },
                    { name: "🦦 Capybara", value: "capybara" },
                    { name: "🐈 Chat", value: "cat" },
                    { name: "🐕 Chien", value: "dog" },
                    { name: "🐬 Dauphin", value: "dolphin" },
                    { name: "🌰 Écureuil", value: "squirrel" },
                    { name: "🐸 Grenouille", value: "frog" },
                    { name: "🦔 Hérisson", value: "hedgehog" },
                    { name: "🐨 Koala", value: "koala" },
                    { name: "🐇 Lapin", value: "rabbit" },
                    { name: "🐦 Oiseau", value: "bird" },
                    { name: "🐼 Panda", value: "panda" },
                    { name: "🐾 Panda roux", value: "redpanda" },
                    { name: "🦊 Renard", value: "fox" },
                    { name: "🐢 Tortue", value: "turtle" })
                .setRequired(true)))

        .addSubcommand(subcommand => subcommand
            .setName("anime-holding-a-programming-book")
            .setDescription("Affiche une image aléatoire d'une fille d'anime tenant un livre de programmation."))

        .addSubcommand(subcommand => subcommand
            .setName("card")
            .setDescription("Donne une carte aléatoire d'un paquet de carte classique."))

        .addSubcommand(subcommand => subcommand
            .setName("character")
            .setDescription("Pour avoir un caractère UNICODE aléatoire !"))

        .addSubcommand(subcommand => subcommand
            .setName("choice")
            .setDescription("Permet de faire le choix entre 2 à 3 options.")
            .addStringOption(option => option
                .setName("first-option")
                .setDescription("La première option.")
                .setRequired(true))
            .addStringOption(option => option
                .setName("second-option")
                .setDescription("La seconde option.")
                .setRequired(true))
            .addStringOption(option => option
                .setName("third-option")
                .setDescription("La troisième option.")
                .setRequired(false)))

        .addSubcommand(subcommand => subcommand
            .setName("coin-flip")
            .setDescription("Simule un lancer de pièce."))

        .addSubcommand(subcommand => subcommand
            .setName("dice")
            .setDescription("Simule le lancer d'un dé."))

        .addSubcommand(subcommand => subcommand
            .setName("flag")
            .setDescription("Montre un drapeau aléatoire du monde."))

        .addSubcommand(subcommand => subcommand
            .setName("kanji")
            .setDescription("Donne un kanji aléatoire du JLPT 5 au JLPT 1."))

        .addSubcommand(subcommand => subcommand
            .setName("periodic-element")
            .setDescription("Permet d'avoir un élément aléatoire du tableau périodique des éléments."))

        .addSubcommand(subcommand => subcommand
            .setName("pokemon")
            .setDescription("Donne un Pokémon aléatoire."))

        .addSubcommand(subcommand => subcommand
            .setName("user")
            .setDescription("Donne un utilisateur aléatoire qui a cliqué sur la réaction."))

        .addSubcommand(subcommand => subcommand
            .setName("ytpmv")
            .setDescription("Pour obtenir une idée aléatoire d'YTPMV, avec une source et une musique.")),
    async execute(interaction, client) {
        try {
            switch (interaction.options.getSubcommand()) {
                case "animal":
                    const animalType = interaction.options.getString("type");
                    const api = animalType === "fox" ? "https://randomfox.ca/floof/" : `https://api.animality.xyz/all/${animalType}`;

                    await fetch(api).then(function (response) {
                        return response.json();
                    }).then(async function (data) {
                        const animalImage = data["image"];

                        const animalEmbed = new EmbedBuilder()
                            .setColor([255, 85, 0])
                            .setImage(animalImage)
                            .setTimestamp()
                            .setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL({ extension: "png", size: 64 }) });

                        await interaction.reply({ embeds: [animalEmbed] });
                    });
                    break;

                case "anime-holding-a-programming-book":
                    await interaction.deferReply();

                    const animeGirlResponse = await fetch("https://api.devgoldy.xyz/aghpb/v1/random/");
                    const animeGirlBuffer = await animeGirlResponse.arrayBuffer();
                    const animeGirl = new AttachmentBuilder(new Buffer.from(animeGirlBuffer), { name: "anime-girl-holding-a-programming-book.png" });

                    await interaction.editReply({ files: [animeGirl] });
                    break;

                case "card":
                    const cardValues = ["As", "2", "3", "4", "5", "6", "7", "8", "9", "10", "Valet", "Reine", "Roi"];
                    const cardSybmols = ["pique", "trèfle", "cœur", "carreau"];
                    const cardValueIndex = Math.floor(Math.random() * cardValues.length);
                    const cardSymbolIndex = Math.floor(Math.random() * cardSybmols.length);
                    const cardValue = cardValues[cardValueIndex];
                    const cardSymbol = cardSybmols[cardSymbolIndex];
                    const cardAcronym = (cardAcronyms[cardValue] ?? cardValue) + cardAcronyms[cardSymbol];

                    const cardEmbed = new EmbedBuilder()
                        .setColor(cardSymbol === "pique" || cardSymbol === "trèfle" ? [0, 0, 0] : [255, 0, 0])
                        .setTitle(`${cardValue} de ${cardSymbol} !`)
                        .setImage(`https://deckofcardsapi.com/static/img/${cardAcronym}.png`)
                        .setTimestamp()
                        .setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL({ extension: "png", size: 64 }) });

                    await interaction.reply({ embeds: [cardEmbed] });
                    break;

                case "character":
                    const randomCharacter = String.fromCharCode(Math.floor(Math.random() * 65_535));

                    await interaction.reply({ content: `# \`${randomCharacter}\`` });
                    break;

                case "choice":
                    const firstOption = interaction.options.getString("first-option");
                    const secondOption = interaction.options.getString("second-option");
                    const thirdOption = interaction.options.getString("third-option");
                    const choices = [firstOption, secondOption, thirdOption];
                    const numberChoices = thirdOption === null ? 2 : 3;
                    const randomChoiceIndex = Math.floor(Math.random() * numberChoices);

                    await interaction.reply({ content: `Je choisis **\`${choices[randomChoiceIndex]}\`** !` });
                    break;

                case "coin-flip":
                    const coinFaces = ["heads", "tails"];
                    const coin = { "heads": "Face", "tails": "Pile" };
                    const coinIndex = Math.floor(Math.random() * 2);
                    const coinImageName = coinFaces[coinIndex];
                    const coinName = coin[coinImageName];

                    const coinFlipEmbed = new EmbedBuilder()
                        .setColor([255, 85, 0])
                        .setTitle(`${coinName} !`)
                        .setImage(`attachment://${coinImageName}.png`)
                        .setTimestamp()
                        .setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL({ extension: "png", size: 64 }) });

                    await interaction.reply({ embeds: [coinFlipEmbed], files: [`./assets/images/random/coin/${coinImageName}.png`] });
                    break;

                case "dice":
                    const diceFaces = ["one", "two", "three", "four", "five", "six"];
                    const dice = { "one": "Un", "two": "Deux", "three": "Trois", "four": "Quatre", "five": "Cinq", "six": "Six" };
                    const diceIndex = Math.floor(Math.random() * 6);
                    const diceImageName = diceFaces[diceIndex];
                    const diceName = dice[diceImageName];

                    const diceEmbed = new EmbedBuilder()
                        .setColor([255, 85, 0])
                        .setTitle(`${diceName} !`)
                        .setImage(`attachment://${diceImageName}.png`)
                        .setTimestamp()
                        .setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL({ extension: "png", size: 64 }) });

                    await interaction.reply({ embeds: [diceEmbed], files: [`./assets/images/random/dice/${diceImageName}.png`] });
                    break;

                case "flag":
                    const countries = readFileSync("./json/countries.json", "utf-8");
                    const countriesData = JSON.parse(countries);
                    const continentList = countriesData["continents"];
                    const randomContinentIndex = Math.floor(Math.random() * continentList.length);
                    const randomContinent = continentList[randomContinentIndex];
                    const countryList = countriesData[randomContinent];
                    const randomCountryIndex = Math.floor(Math.random() * Object.keys(countryList).length);
                    const flagNameCode = Object.keys(countryList)[randomCountryIndex];
                    const flagName = countryList[flagNameCode]["name"];

                    const flagEmbed = new EmbedBuilder()
                        .setColor([255, 85, 0])
                        .setTitle(flagName)
                        .setImage(`https://flagcdn.com/w2560/${flagNameCode}.png`)
                        .setTimestamp()
                        .setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL({ extension: "png", size: 64 }) });

                    await interaction.reply({ embeds: [flagEmbed] });
                    break;

                case "kanji":
                    const kanjiInformations = getRandomKanji();
                    const kanji = kanjiInformations[0];
                    const kanjiIndex = kanjiInformations[1] + 1;
                    const kanjiNumber = kanjiInformations[2];

                    await fetch(`https://kanjiapi.dev/v1/kanji/${kanji}`).then(function (response) {
                        return response.json();
                    }).then(async function (data) {
                        const kanjiJLPTLevel = data["jlpt"];
                        let kanjiKunyomi = "";
                        let kanjiOnyomi = "";
                        let kanjiTranslation = "";

                        data["kun_readings"].length >= 1 ? data["kun_readings"].forEach(pronunciation => {
                            kanjiKunyomi += `${pronunciation}　`;
                        }) : kanjiKunyomi = "無　";

                        data["on_readings"].length >= 1 ? data["on_readings"].forEach(pronunciation => {
                            kanjiOnyomi += `${pronunciation}　`;
                        }) : kanjiOnyomi = "無　";

                        data["meanings"].forEach(meaning => {
                            kanjiTranslation += `${meaning}, `;
                        });

                        kanjiKunyomi = `${kanjiKunyomi.slice(0, -1)}`;
                        kanjiOnyomi = `${kanjiOnyomi.slice(0, -1)}`;
                        kanjiTranslation = `${kanjiTranslation.slice(0, -2)}`;

                        const quizKanjiEmbed = new EmbedBuilder()
                            .setColor([255, 85, 0])
                            .setTitle(`Kanji #${kanjiIndex}/${kanjiNumber} - JLPT${kanjiJLPTLevel}`)
                            .setDescription(`> # ${kanji}\n\n| 訓読み：||${kanjiKunyomi}||\n| 音読み：||${kanjiOnyomi}||\n| 英訳：||${kanjiTranslation}||`)
                            .setTimestamp()
                            .setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL({ extension: "png", size: 64 }) });

                        await interaction.reply({ embeds: [quizKanjiEmbed] });
                    });
                    break;

                case "periodic-element":
                    await interaction.deferReply();

                    await fetch(`https://api.popcat.xyz/v2/periodic-table/random`).then(function (response) {
                        return response.json();
                    }).then(async function (data) {
                        const elementName = data["message"]["name"];
                        const elementSymbol = data["message"]["symbol"];
                        const elementAtomicNumber = data["message"]["atomic_number"];
                        const elementAtomicMass = data["message"]["atomic_mass"];
                        const elementPeriod = data["message"]["period"];
                        const elementPhase = data["message"]["phase"];
                        const elementTranslatedPhase = elementPhase === "Solid" ? "solide" : elementPhase === "Liquid" ? "liquide" : "gaz";
                        const elementDiscover = data["message"]["discovered_by"];
                        const elementSummary = data["message"]["summary"];
                        const elementSummaryTranslatedResponse = await fetch(`https://ftapi.pythonanywhere.com/translate?sl=en&dl=fr&text=${elementSummary}`);
                        const elementSummaryTranslatedData = await elementSummaryTranslatedResponse?.json() ?? elementSummary;
                        const elementSummaryTranslated = elementSummaryTranslatedData["destination-text"];
                        const elementImage = data["message"]["image"];

                        const pokemonEmbed = new EmbedBuilder()
                            .setColor([255, 85, 0])
                            .setTitle(elementName)
                            .setDescription(`⚛️ **Symbole** : ${elementSymbol}\n🔢 **Numéro atomique** : ${elementAtomicNumber}\n⚖️ **Masse atomique** : ${elementAtomicMass}\n➡️ **Période** : ${elementPeriod}\n🧪 **Phase** : ${elementTranslatedPhase}\n🔎 **Découvert par** : ${elementDiscover}\n\n> ${elementSummaryTranslated}`)
                            .setThumbnail(elementImage)
                            .setTimestamp()
                            .setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL({ extension: "png", size: 64 }) });

                        await interaction.editReply({ embeds: [pokemonEmbed] });
                    });
                    break;

                case "pokemon":
                    const randomPokemonID = Math.floor(Math.random() * 1_024) + 1;

                    await fetch(`https://pokeapi.co/api/v2/pokemon/${randomPokemonID}`).then(function (response) {
                        return response.json();
                    }).then(async function (data) {
                        const pokemonName = capitalize(data["name"]);
                        const pokemonID = data["id"];
                        const pokemonImage = data["sprites"]["other"]["official-artwork"]["front_default"];
                        const pokemonShinyImage = data["sprites"]["other"]["official-artwork"]["front_shiny"];

                        const pokemonEmbed = new EmbedBuilder()
                            .setColor([255, 85, 0])
                            .setTitle(`${pokemonName} Nº${pokemonID}`)
                            .setThumbnail(pokemonShinyImage)
                            .setImage(pokemonImage)
                            .setTimestamp()
                            .setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL({ extension: "png", size: 64 }) });

                        await interaction.reply({ embeds: [pokemonEmbed] });
                    });
                    break;

                case "user":
                    if (Object.keys(interaction.authorizingIntegrationOwners)[0] === "1")
                        return await interaction.reply({ content: "❌ Je dois être sur le serveur afin d'effectuer cette commande !", flags: [MessageFlags.Ephemeral] });

                    const timeRemainingTimestamp = Math.floor((Date.now() + 60_000) / 1_000);
                    const users = [];

                    const randomUserEmbed = new EmbedBuilder()
                        .setColor([255, 85, 0])
                        .setTitle("Clique pour être choisi aléatoirement !")
                        .setDescription(`> Temps restant : <t:${timeRemainingTimestamp}:R>`)
                        .setTimestamp()
                        .setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL({ extension: "png", size: 64 }) });

                    const reactedMessage = await interaction.reply({ embeds: [randomUserEmbed], withResponse: true });

                    await reactedMessage.resource.message.react("✨");

                    const reactionCollector = reactedMessage.resource.message.createReactionCollector({ filter: (reaction, user) => reaction.emoji.name === "✨" && !user.bot, time: 60_000 });

                    reactionCollector.on("collect", (reaction, user) => {
                        users.push(user.id);
                    });

                    reactionCollector.on("end", async (collected, reason) => {
                        if (reason !== "messageDelete") {
                            let newRandomUserEmbed;

                            if (users.length !== 0) {
                                const randomUserIndex = Math.floor(Math.random() * users.length);
                                const randomUser = `<@${users[randomUserIndex]}>`;

                                newRandomUserEmbed = new EmbedBuilder(randomUserEmbed)
                                    .setDescription(`> ${randomUser} a été désigné !`)
                            } else {
                                newRandomUserEmbed = new EmbedBuilder(randomUserEmbed)
                                    .setDescription(`> Personne n'a été désigné...`)
                            }

                            await interaction.editReply({ embeds: [newRandomUserEmbed] });
                        }
                    });
                    break;

                case "ytpmv":
                    await fetch("https://magictendo.github.io/api/ytpmv.json").then(function (response) {
                        return response.json();
                    }).then(async function (data) {
                        const sourceIndex = Math.floor(Math.random() * Number(data["total_sources"]));
                        const musicIndex = Math.floor(Math.random() * Number(data["total_musics"]));
                        const cleanSource = `${sourceIndex}_source`;
                        const cleanMusic = `${musicIndex}_music`;

                        const source = data["ytpmv_sources"][cleanSource]["source"];
                        const sourceLink = data["ytpmv_sources"][cleanSource]["source_link"];
                        const music = data["ytpmv_musics"][cleanMusic]["music"];
                        const musicLink = data["ytpmv_musics"][cleanMusic]["music_link"];
                        const sourceImage = data["ytpmv_sources"][cleanSource]["source_image"];

                        const ytpmvEmbed = new EmbedBuilder()
                            .setColor([255, 85, 0])
                            .setTitle("Random YTPMV generator")
                            .setURL("https://magictendo.github.io/api/ytpmv.json")
                            .setDescription(`🏵 **Source** : [${source}](${sourceLink})\n🎹 **Musique** : [${music}](${musicLink})`)
                            .setThumbnail(sourceImage)
                            .setTimestamp()
                            .setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL({ extension: "png", size: 64 }) });

                        await interaction.reply({ embeds: [ytpmvEmbed] })
                    });
                    break;
            }
        } catch (error) {
            await sendError(interaction, client, error);
        }
    }
};